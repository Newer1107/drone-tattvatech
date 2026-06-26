"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScrollPosition } from "@/hooks/useScrollPosition";

interface DroneDisassemblyProps {
  modelPath?: string;
  scrollRange?: number;
}

// Spherical directions so each part explodes outward from center (GLB meshes
// all have local position (0,0,0), so we generate offsets procedurally).
const EXPLODE_DIRECTIONS = [
  { x: 0, y: 1, z: 0 },    // body
  { x: -1, y: 0.5, z: 1 }, // motor 1
  { x: 1, y: 0.5, z: 1 },  // motor 2
  { x: -1, y: 0.5, z: -1 },// motor 3
  { x: 1, y: 0.5, z: -1 }, // motor 4
  { x: 0, y: -0.5, z: 1 }, // battery
  { x: 0, y: -1, z: 0 },   // camera
  { x: 0.5, y: 1, z: 0 },  // gps
  { x: 0, y: 0, z: -0.5 }, // arm
  { x: -0.5, y: 0, z: 0 }, // arm
  // fallback for any remaining meshes
];

export function DroneDisassembly({
  modelPath = "/models/dronegen.glb",
  scrollRange = 1200,
}: DroneDisassemblyProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const { scrollY } = useScrollPosition();

  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        list.push(child as THREE.Mesh);
      }
    });
    return list;
  }, [scene]);

  const positions = useRef<Map<number, THREE.Vector3>>(new Map());

  useFrame(() => {
    if (!group.current) return;

    // Start disassembling ~300px after section enters viewport
    const entryPoint = window.innerHeight - 300;
    const sectionTop = group.current.parent?.position.y
      ? -group.current.parent.position.y
      : 0;
    const rawFactor = (scrollY - entryPoint + sectionTop) / scrollRange;
    const factor = Math.max(0, Math.min(1, rawFactor));

    group.current.children.forEach((child, i) => {
      if (!(child as THREE.Mesh).isMesh) return;

      if (!positions.current.has(i)) {
        positions.current.set(i, child.position.clone());
      }
      const orig = positions.current.get(i)!;
      const dir = EXPLODE_DIRECTIONS[i % EXPLODE_DIRECTIONS.length];
      const target = new THREE.Vector3(
        orig.x + dir.x * factor * 4,
        orig.y + dir.y * factor * 4,
        orig.z + dir.z * factor * 4,
      );
      child.position.lerp(target, 0.08);
    });
  });

  return (
    <group ref={group}>
      {meshes.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
    </group>
  );
}
