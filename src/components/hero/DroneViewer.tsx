"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { FloatingDrone } from "@/components/three/FloatingDrone";

interface DroneViewerProps {
  mouse: { x: number; y: number };
}

export function DroneViewer({ mouse }: DroneViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="rounded-2xl"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 6]} intensity={1} castShadow />
        <pointLight position={[-4, 3, 2]} intensity={0.3} color="#ff6a00" />
        <Environment preset="studio" environmentIntensity={0.4} />
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
          <FloatingDrone
            modelPath="/models/dronegen.glb"
            scale={2}
            disableRotation
            mouse={mouse}
          />
        </Float>
      </Suspense>
    </Canvas>
  );
}
