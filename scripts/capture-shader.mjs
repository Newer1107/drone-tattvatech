/**
 * Capture and analyze the Three.js compiled shader for X4122 warning.
 * Prints the actual generated vertex + fragment shader to find the exact line.
 */

import { createCanvas } from "canvas";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelPath = join(__dirname, "..", "public", "models", "movingdrone.glb");

// Minimal WebGL setup (headless)
const canvas = createCanvas(1, 1);
const gl = canvas.getContext("webgl2", { 
  alpha: true, 
  antialias: true,
  premultipliedAlpha: false
});

const renderer = new THREE.WebGLRenderer({ 
  canvas, 
  context: gl,
  alpha: true
});
renderer.setSize(1, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);

// Load the GLB
const loader = new GLTFLoader();

loader.load(modelPath, (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  // Log every material detail
  model.traverse((node) => {
    if (node.isMesh) {
      const mat = node.material;
      if (Array.isArray(mat)) {
        mat.forEach((m, i) => inspectMaterial(m, `${node.name || "unnamed"}[${i}]`));
      } else {
        inspectMaterial(mat, node.name || "unnamed");
      }
    }
  });

  // Hook onBeforeCompile for every material
  model.traverse((node) => {
    if (node.isMesh) {
      const mat = node.material;
      const materials = Array.isArray(mat) ? mat : [mat];
      materials.forEach((m) => {
        m.onBeforeCompile = (shader) => {
          console.log(`\n========== SHADER for material: ${m.name || "(unnamed)"} ==========`);
          console.log(`Type: ${m.type}`);
          console.log(`Defines: ${JSON.stringify(m.defines)}`);
          
          // Save the full shaders to files for analysis
          const vsFile = join(__dirname, "..", "shader_capture", `vs_${(m.name || "unnamed").replace(/\s+/g, "_")}.txt`);
          const fsFile = join(__dirname, "..", "shader_capture", `fs_${(m.name || "unnamed").replace(/\s+/g, "_")}.txt`);
          
          try {
            writeFileSync(vsFile, shader.vertexShader);
            console.log(`Vertex shader saved: ${vsFile}`);
            writeFileSync(fsFile, shader.fragmentShader);
            console.log(`Fragment shader saved: ${fsFile}`);
          } catch(e) {
            console.log(`Could not save shader files: ${e.message}`);
          }
          
          // Search for suspicious expressions in fragment shader
          const fs = shader.fragmentShader;
          const lines = fs.split("\n");
          console.log(`Fragment shader: ${lines.length} lines`);
          
          // Search for patterns that could produce X4122
          const patterns = [
            /1\.0\s*-\s*[\w\.]+\s*\*\s*/,
            /pow\(/,
            /normalize\(/,
            /mix\(/,
            /fresnel/i,
            /F_Schlick/,
            /0\.996/,
            /1\.0\s*\+\s*/,
            /1\.0\s*-\s*/,
            /1\.0\s*\/\s*256/,
            /\/\s*256/,
          ];
          
          for (const [idx, line] of lines.entries()) {
            for (const pat of patterns) {
              if (pat.test(line)) {
                console.log(`  L${idx+1}: ${line.trim()}`);
                break;
              }
            }
          }
          
          // Specifically find lines involving addition of small + large
          for (const [idx, line] of lines.entries()) {
            // Look for patterns like "a + b" where one term could be near 1.0
            if (/([\w\.\[\]]+\s*\+\s*[\w\.\[\]]+)/.test(line)) {
              // Check if this line has both a "1.0" or near-1.0 term
              if (line.includes("1.0") || line.includes("f90") || line.includes("F0") || line.includes("F90")) {
                console.log(`  SUM L${idx+1}: ${line.trim()}`);
              }
            }
          }
        };
      });
    }
  });

  // Render a single frame to trigger shader compilation
  renderer.render(scene, camera);
  console.log("\nRendered one frame. Shaders should be captured.");
  
  // Render again to ensure environment map is ready
  setTimeout(() => {
    renderer.render(scene, camera);
    console.log("Second frame rendered.");
  }, 100);
});

function inspectMaterial(mat, name) {
  console.log(`\n--- Material: ${name} ---`);
  console.log(`  type: ${mat.type}`);
  console.log(`  uuid: ${mat.uuid}`);
  console.log(`  defines: ${JSON.stringify(mat.defines)}`);
  console.log(`  metalness: ${mat.metalness}`);
  console.log(`  roughness: ${mat.roughness}`);
  console.log(`  transmission: ${mat.transmission}`);
  console.log(`  clearcoat: ${mat.clearcoat}`);
  console.log(`  sheen: ${mat.sheen}`);
  console.log(`  iridescence: ${mat.iridescence}`);
  console.log(`  envMap: ${mat.envMap ? "yes" : "no"}`);
  console.log(`  envMapIntensity: ${mat.envMapIntensity}`);
  console.log(`  map (diffuse): ${mat.map ? "yes" : "no"}`);
  console.log(`  normalMap: ${mat.normalMap ? "yes" : "no"}`);
  console.log(`  roughnessMap: ${mat.roughnessMap ? "yes" : "no"}`);
  console.log(`  metalnessMap: ${mat.metalnessMap ? "yes" : "no"}`);
  console.log(`  aoMap: ${mat.aoMap ? "yes" : "no"}`);
  console.log(`  emissiveMap: ${mat.emissiveMap ? "yes" : "no"}`);
  console.log(`  emissive: ${mat.emissive ? mat.emissive.toArray() : "N/A"}`);
  console.log(`  color: ${mat.color ? mat.color.toArray() : "N/A"}`);
  console.log(`  opacity: ${mat.opacity}`);
  console.log(`  transparent: ${mat.transparent}`);
  console.log(`  side: ${mat.side === THREE.FrontSide ? "Front" : mat.side === THREE.DoubleSide ? "Double" : "Back"}`);
  console.log(`  toneMapped: ${mat.toneMapped}`);
  console.log(`  format: ${mat.format}`);
  console.log(`  precision: ${mat.precision || "default"}`);
  
  // Check for NaN or Infinity in any numeric property
  for (const key of Object.keys(mat)) {
    try {
      const val = mat[key];
      if (typeof val === "number" && (isNaN(val) || !isFinite(val))) {
        console.log(`  ⚠️  INVALID value in ${key}: ${val}`);
      }
      if (val && val.isColor) {
        const c = val.toArray();
        for (const v of c) {
          if (isNaN(v) || !isFinite(v)) {
            console.log(`  ⚠️  INVALID color in ${key}: ${c}`);
          }
        }
      }
    } catch(e) { /* skip getters that throw */ }
  }
}
