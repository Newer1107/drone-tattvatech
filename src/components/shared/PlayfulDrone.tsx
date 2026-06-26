"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Drone — slides along the right-edge progress track                */
/* ------------------------------------------------------------------ */

function DroneProgress() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/movingdrone.glb");

  // Rotate model 180° on Y — it faces the wrong way by default
  const model = useRef<THREE.Group>(new THREE.Group());
  if (model.current.children.length === 0) {
    const s = scene.clone();
    s.rotation.y = Math.PI;
    model.current.add(s);
  }

  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const raw = docH > 0 ? window.scrollY / docH : 0;
    progress.current += (raw - progress.current) * 3.5 * dt;

    // Map progress to vertical position: top = 2, bottom = -2 (stays within viewport)
    const ty = 2 - progress.current * 4;

    ref.current.position.x += (3.6 - ref.current.position.x) * 5 * dt;
    ref.current.position.y += (ty - ref.current.position.y) * 5 * dt;
    ref.current.position.z += (0 - ref.current.position.z) * 3 * dt;

    // Gentle bob
    const bob = Math.sin(performance.now() * 0.002) * 0.05;
    ref.current.position.y += bob * dt * 8;

    // Slight tilt based on velocity
    const speed = (ty - ref.current.position.y) * 8;
    ref.current.rotation.z += (-speed * 0.06 - ref.current.rotation.z) * 4 * dt;
    ref.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.03;
  });

  return (
    <group ref={ref} scale={0.6}>
      <primitive object={model.current} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-progress line (CSS)                                         */
/* ------------------------------------------------------------------ */

function ProgressLine() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? window.scrollY / docH : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute right-4 top-8 bottom-8 w-[2px] rounded-full bg-surface-variant/30 md:right-6 lg:right-10">
      <div
        className="absolute inset-x-0 bottom-0 rounded-full bg-[#ff6a00] transition-all duration-200 ease-out"
        style={{
          height: `${progress * 100}%`,
          boxShadow: "0 0 8px rgba(255,106,0,0.4), 0 0 16px rgba(255,106,0,0.15)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export function PlayfulDrone() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <ProgressLine />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 6]} intensity={1} />
          <pointLight position={[-4, 3, 2]} intensity={0.3} color="#ff6a00" />
          <Environment preset="studio" environmentIntensity={0.4} />
          <DroneProgress />
        </Suspense>
      </Canvas>
    </div>
  );
}
