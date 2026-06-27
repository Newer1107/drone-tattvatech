/**
 * Inspect movingdrone.glb materials for shader precision warning root cause.
 * X4122: "sum of X and Y cannot be represented accurately in double precision"
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelPath = join(__dirname, "..", "public", "models", "movingdrone.glb");
const buf = readFileSync(modelPath);

// ── Parse GLB header ──
const magic = buf.readUInt32LE(0);
const version = buf.readUInt32LE(4);
const totalLen = buf.readUInt32LE(8);
console.log(`GLB header: magic=0x${magic.toString(16)}, version=${version}, total=${totalLen}B`);

// ── Parse chunks ──
let offset = 12;
const chunks = [];
while (offset < buf.length) {
  const chunkLen = buf.readUInt32LE(offset);
  const chunkType = buf.readUInt32LE(offset + 4);
  const chunkData = buf.subarray(offset + 8, offset + 8 + chunkLen);
  chunks.push({ type: chunkType === 0x4E4F534A ? "JSON" : chunkType === 0x004E4942 ? "BIN" : "UNKNOWN", len: chunkLen, data: chunkData });
  offset += 8 + chunkLen;
}

const jsonChunk = chunks.find(c => c.type === "JSON");
if (!jsonChunk) { console.error("No JSON chunk"); process.exit(1); }

const gltf = JSON.parse(new TextDecoder().decode(jsonChunk.data));

// ── Inspect materials ──
console.log(`\n=== GLTF Materials (${gltf.materials?.length || 0}) ===`);
if (gltf.materials) {
  for (const [i, mat] of gltf.materials.entries()) {
    console.log(`\n--- Material ${i}: "${mat.name || "(unnamed)"}" ---`);
    console.log(JSON.stringify(mat, null, 2));
    
    // Check for potentially problematic values
    if (mat.pbrMetallicRoughness) {
      const pbr = mat.pbrMetallicRoughness;
      console.log(`  baseColorFactor: ${JSON.stringify(pbr.baseColorFactor)}`);
      console.log(`  metallicFactor: ${pbr.metallicFactor}`);
      console.log(`  roughnessFactor: ${pbr.roughnessFactor}`);
      
      // Check for near-zero or extreme values
      for (const key of Object.keys(pbr)) {
        const v = pbr[key];
        if (typeof v === "number" && v !== 0 && Math.abs(v) < 1e-10) {
          console.log(`  ⚠️  Extremely small value in ${key}: ${v}`);
        }
        if (Array.isArray(v)) {
          for (const [idx, val] of v.entries()) {
            if (typeof val === "number" && val !== 0 && Math.abs(val) < 1e-10) {
              console.log(`  ⚠️  Extremely small value in ${key}[${idx}]: ${val}`);
            }
          }
        }
      }
    }
    
    // Check extensions
    if (mat.extensions) {
      console.log(`  extensions: ${JSON.stringify(mat.extensions)}`);
    }
    
    // Check for transmission, clearcoat, sheen, etc.
    if (mat.extensions?.KHR_materials_transmission) {
      console.log(`  ⚠️  transmission: ${JSON.stringify(mat.extensions.KHR_materials_transmission)}`);
    }
    if (mat.extensions?.KHR_materials_clearcoat) {
      console.log(`  clearcoat: ${JSON.stringify(mat.extensions.KHR_materials_clearcoat)}`);
    }
    if (mat.extensions?.KHR_materials_sheen) {
      console.log(`  sheen: ${JSON.stringify(mat.extensions.KHR_materials_sheen)}`);
    }
  }
} else {
  console.log("No materials found in GLTF root.");
}

// ── Check for KHR_lights_punctual or other extensions ──
if (gltf.extensionsUsed) console.log(`\nextensionsUsed: ${JSON.stringify(gltf.extensionsUsed)}`);
if (gltf.extensionsRequired) console.log(`extensionsRequired: ${JSON.stringify(gltf.extensionsRequired)}`);

// ── Inspect meshes/primitives ──
console.log(`\n=== Meshes (${gltf.meshes?.length || 0}) ===`);
if (gltf.meshes) {
  for (const [i, mesh] of gltf.meshes.entries()) {
    console.log(`\nMesh ${i}: "${mesh.name || "(unnamed)"}"`);
    for (const [j, prim] of (mesh.primitives || []).entries()) {
      console.log(`  Primitive ${j}: mode=${prim.mode}, material=${prim.material ?? -1}, indices=${prim.indices !== undefined}`);
      if (prim.attributes) console.log(`    attributes: ${JSON.stringify(Object.keys(prim.attributes))}`);
    }
  }
}

// ── Inspect textures / samplers ──
if (gltf.textures) {
  console.log(`\n=== Textures (${gltf.textures.length}) ===`);
  for (const [i, tex] of gltf.textures.entries()) {
    console.log(`  Texture ${i}: source=${tex.source}, sampler=${tex.sampler}`);
  }
}
if (gltf.samplers) {
  console.log(`\n=== Samplers (${gltf.samplers.length}) ===`);
  for (const [i, sam] of gltf.samplers.entries()) {
    console.log(`  Sampler ${i}: magFilter=${sam.magFilter}, minFilter=${sam.minFilter}, wrapS=${sam.wrapS}, wrapT=${sam.wrapT}`);
  }
}

// ── Accessors ──
if (gltf.accessors) {
  console.log(`\n=== Accessors with NaN/Infinity checks ===`);
  const binChunk = chunks.find(c => c.type === "BIN");
  if (binChunk) {
    for (const [i, acc] of gltf.accessors.entries()) {
      if (acc.type === "VEC3" || acc.type === "VEC4" || acc.type === "SCALAR") {
        const byteOffset = (acc.bufferView !== undefined ? gltf.bufferViews[acc.bufferView].byteOffset : 0) + (acc.byteOffset || 0);
        console.log(`  Accessor ${i}: ${acc.type}, count=${acc.count}, componentType=${acc.componentType}, byteOffset=${byteOffset}`);
        if (acc.min) console.log(`    min: ${JSON.stringify(acc.min)}`);
        if (acc.max) console.log(`    max: ${JSON.stringify(acc.max)}`);
      }
    }
  }
}

console.log("\n=== Model stats ===");
console.log(`  meshes: ${gltf.meshes?.length || 0}`);
console.log(`  materials: ${gltf.materials?.length || 0}`);
console.log(`  textures: ${gltf.textures?.length || 0}`);
console.log(`  total size: ${buf.length} bytes (${(buf.length / 1024).toFixed(0)} KB)`);
