"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { fixAllMaterials } from "@/lib/fixShaderPrecision";

const SPEEDS: Record<string, number> = { classroom: 0.1, workshop: 0.18, lab: 0.3, mission: 0.35 };
const BOBS: Record<string, number> = { classroom: 0.03, workshop: 0.05, lab: 0.08, mission: 0.1 };
const SCALES: Record<string, number> = { classroom: 1.5, workshop: 1.8, lab: 1.6, mission: 1.4 };

export function ChapterDrone({ mode, active }: { mode: string; active: boolean }) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, outputColorSpace: "srgb", toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={mode === "lab" ? 0.3 : 0.5} />
        <directionalLight position={[5, 8, 6]} intensity={mode === "lab" ? 0.5 : 0.8} />
        <pointLight position={[-3, 2, 2]} intensity={0.3} color="#ff6a00" />
        <Environment preset="studio" environmentIntensity={mode === "lab" ? 0.15 : 0.3} />
        <DroneModel mode={mode} />
      </Canvas>
      <LevelOverlay mode={mode} />
    </div>
  );
}

function DroneModel({ mode }: { mode: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/dronegen.glb");
  const fixed = useRef(false);

  useEffect(() => {
    if (!fixed.current) {
      fixAllMaterials(scene.clone());
      fixed.current = true;
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const s = SPEEDS[mode] ?? 0.1;
    const ba = BOBS[mode] ?? 0.03;
    group.current.rotation.y += dt * s;
    const bob = Math.sin(performance.now() * 0.0008) * ba;
    group.current.position.y += (bob - group.current.position.y) * 2 * dt;
  });

  const cloned = scene.clone();
  cloned.rotation.y = Math.PI;

  return (
    <group ref={group} scale={SCALES[mode] ?? 1.5}>
      <primitive object={cloned} />
    </group>
  );
}

function LevelOverlay({ mode }: { mode: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {mode === "classroom" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "70%", aspectRatio: "1", background: "radial-gradient(circle, rgba(255,106,0,0.05) 0%, transparent 70%)" }}
        />
      )}
      {mode === "workshop" && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(255,106,0,0.08)" strokeWidth="0.5" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,106,0,0.04)" strokeWidth="0.5" strokeDasharray="1 10" />
        </svg>
      )}
      {mode === "lab" && (
        <>
          {[{ t: "15%", l: "20%" }, { t: "20%", l: "75%" }, { t: "70%", l: "15%" }, { t: "75%", l: "80%" }, { t: "45%", l: "10%" }].map((p, i) => (
            <span key={i} className="absolute h-1 w-1 rounded-full bg-[#ff6a00]/40"
              style={{ top: p.t, left: p.l, animation: `jd-pulse 2s ease-in-out ${i * 0.4}s infinite` }}
            />
          ))}
        </>
      )}
      {mode === "mission" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "85%", aspectRatio: "1", border: "1px solid rgba(255,106,0,0.06)" }}
        />
      )}
    </div>
  );
}
