"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import { FloatingDrone } from "@/components/three/FloatingDrone";

interface DroneCanvasProps {
  mouse: { x: number; y: number };
}

export function DroneCanvas({ mouse }: DroneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        outputColorSpace: "srgb",
        toneMapping: 3,
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7]} intensity={0.8} />
        <pointLight position={[-5, 2, 2]} intensity={0.5} color="#ff6a00" />
        <Environment preset="studio" environmentIntensity={0.3} />
        <FloatingDrone mouse={mouse} />
      </Suspense>
    </Canvas>
  );
}
