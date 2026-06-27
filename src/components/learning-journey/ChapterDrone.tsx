"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { fixAllMaterials } from "@/lib/fixShaderPrecision";

/* ────────────────────────────────────────────────────────────────── */
/*  3D drone scene — one per chapter.  frameloop="never" when hidden. */
/* ────────────────────────────────────────────────────────────────── */

export function ChapterDrone({ level, active }: { level: number; active: boolean }) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, outputColorSpace: "srgb", toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 6]} intensity={0.8} />
        <pointLight position={[-3, 2, 2]} intensity={0.3} color="#ff6a00" />
        <Environment preset="studio" environmentIntensity={0.3} />
        <DroneModel level={level} />
      </Canvas>
      <LevelOverlay level={level} />
    </div>
  );
}

/* ── Rotating drone ── */

function DroneModel({ level }: { level: number }) {
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
    const speeds = [0.12, 0.2, 0.28, 0.35];
    const s = speeds[level] ?? 0.12;
    group.current.rotation.y += dt * s;
    const bob = Math.sin(performance.now() * 0.0008 + level * 1.2) * 0.04 * (level + 1);
    group.current.position.y += (bob - group.current.position.y) * 2 * dt;
  });

  const cloned = scene.clone();
  cloned.rotation.y = Math.PI;

  return (
    <group ref={group} scale={1.5}>
      <primitive object={cloned} />
    </group>
  );
}

/* ── Per-level CSS overlays ── */

function LevelOverlay({ level }: { level: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {level === 1 && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "60%", aspectRatio: "1", background: "radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 70%)" }}
        />
      )}

      {level === 2 && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,106,0,0.1)" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,106,0,0.06)" strokeWidth="0.5" strokeDasharray="2 8" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
        </svg>
      )}

      {level === 3 && (
        <>
          {[
            { t: "8%", l: "20%" }, { t: "20%", l: "80%" }, { t: "80%", l: "15%" },
            { t: "75%", l: "75%" }, { t: "50%", l: "10%" }, { t: "45%", l: "90%" },
          ].map((p, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#ff6a00]/30"
              style={{ top: p.t, left: p.l, animation: `jd-pulse 2s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </>
      )}

      {level === 4 && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          <path d="M120 140 Q 200 100, 260 200 Q 300 280, 200 300" fill="none" stroke="rgba(255,106,0,0.07)" strokeWidth="1" strokeDasharray="3 6" />
          <path d="M300 100 Q 200 150, 150 250 Q 120 320, 250 320" fill="none" stroke="rgba(255,106,0,0.04)" strokeWidth="0.5" strokeDasharray="2 8" />
          {[{ cx: 160, cy: 130, r: 8 }, { cx: 250, cy: 200, r: 10 }, { cx: 190, cy: 290, r: 7 }].map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="none" stroke="rgba(255,106,0,0.18)" strokeWidth="1" opacity={0.6} />
          ))}
        </svg>
      )}
    </div>
  );
}
