"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import type * as THREE from "three";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FloatingDroneProps {
  modelPath?: string;
  scale?: number;
  position?: [number, number, number];
  parallaxFactor?: number;
  mouse?: { x: number; y: number };
  disableRotation?: boolean;
}

export function FloatingDrone({
  modelPath = "/models/dronegen.glb",
  scale = 1.5,
  position = [0, 0, 0],
  parallaxFactor = 0.02,
  mouse,
  disableRotation,
}: FloatingDroneProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const { scrollY } = useScrollPosition();
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;

    // Slow continuous Y rotation — gives the drone a scanning/monitoring presence.
    // Intentional: keeps the model feeling alive even without user interaction.
    // Use disableRotation prop when Float handles it (e.g. DroneViewer).
    if (!disableRotation) group.current.rotation.y += delta * 0.15;

    // Mouse parallax — Float component handles Y oscillation
    if (mouse) {
      group.current.rotation.x +=
        (mouse.y * parallaxFactor - group.current.rotation.x) * 0.05;
      group.current.rotation.z +=
        (-mouse.x * parallaxFactor - group.current.rotation.z) * 0.05;
    }

    // Subtle scroll response
    const floatOffset = Math.sin(scrollY * 0.002) * 0.05;
    group.current.position.y = position[1] + floatOffset;
  });

  if (reducedMotion) {
    return (
      <group ref={group} position={position} scale={scale}>
        <primitive object={scene} />
      </group>
    );
  }

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      position={position}
    >
      <group ref={group} scale={scale}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}
