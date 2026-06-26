"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

interface SceneProps extends CanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function Scene({ children, className, ...props }: SceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          outputColorSpace: "srgb",
          toneMapping: 3, // ACESFilmic
        }}
        {...props}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 10, 7]}
            intensity={0.8}
            castShadow
          />
          <pointLight position={[-5, 2, 2]} intensity={0.5} color="#ff6a00" />
          <Environment preset="studio" environmentIntensity={0.5} />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
          />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
