"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { fixAllMaterials } from "@/lib/fixShaderPrecision";

/* ────────────────────────────────────────────────────────────────── */
/*  Evolving drone — the 3D drone changes behaviour per journey level
/*  Level 0: slow rotation, gentle bob
/*  Level 1: moderate rotation, assembly-like motion
/*  Level 2: steady hover, tech overlays (CSS)
/*  Level 3: faster, more dynamic, multiple-formations feel
/* ────────────────────────────────────────────────────────────────── */

function DroneScene() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/dronegen.glb");
  const { gl } = useThree();
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

    // Read level & progress from the Canvas wrapper's data attributes
    const el = (gl.domElement.parentElement?.closest("[data-level]") ?? gl.domElement.closest("[data-level]")) as HTMLElement | null;
    const lvl = Number(el?.getAttribute("data-level") ?? "0");
    const prog = Number(el?.getAttribute("data-progress") ?? "0");

    // ── Rotation speeds per level ──
    const speeds = [0.08, 0.18, 0.25, 0.4];
    const rotSpeed = speeds[lvl] ?? 0.08;
    group.current.rotation.y += dt * rotSpeed;

    // ── Subtle bank per level ──
    const bankAmount = [0.02, 0.04, 0.06, 0.1][lvl] ?? 0.02;
    const bank = Math.sin(performance.now() * 0.0008 + lvl * 1.5) * bankAmount;
    group.current.rotation.x += (bank - group.current.rotation.x) * 2 * dt;
    group.current.rotation.z += (Math.sin(performance.now() * 0.0006) * bankAmount * 0.5 - group.current.rotation.z) * 2 * dt;

    // ── Float bob ──
    const bobAmp = [0.06, 0.08, 0.1, 0.15][lvl] ?? 0.06;
    const bobFreq = [0.6, 0.8, 1.0, 1.4][lvl] ?? 0.6;
    const bob = Math.sin(performance.now() * 0.001 * bobFreq + lvl) * bobAmp;
    group.current.position.y += (bob - group.current.position.y) * 2 * dt;

    // ── Scale pulse for level transitions ──
    // Subtle "power-up" feel as progress increases within a level
    const pulse = 1 + Math.sin(prog * Math.PI) * 0.015 * (lvl + 1);
    group.current.scale.setScalar(pulse);
  });

  const cloned = scene.clone();
  cloned.rotation.y = Math.PI;

  return (
    <group ref={group} scale={1.4}>
      <primitive object={cloned} />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────── */

export function JourneyDrone() {
  return (
    <div className="relative h-full w-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, outputColorSpace: "srgb", toneMapping: THREE.ACESFilmicToneMapping }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 6]} intensity={0.8} />
        <pointLight position={[-4, 3, 2]} intensity={0.3} color="#ff6a00" />
        <Environment preset="studio" environmentIntensity={0.3} />
        <DroneScene />
      </Canvas>

      {/* ── Level-specific CSS overlays ── */}
      <LevelOverlays />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Per-level decorative overlays (CSS-only, no 3D)                  */
/* ────────────────────────────────────────────────────────────────── */

function LevelOverlays() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parent = el.closest("[data-level]") as HTMLElement | null;
    if (!parent) return;

    const mo = new MutationObserver(() => {
      const lvl = Number(parent.getAttribute("data-level") ?? "0");
      el.setAttribute("data-show", String(lvl));

      // Show/hide specific overlays
      el.querySelectorAll("[data-lvl]").forEach((child) => {
        const target = child as HTMLElement;
        const lvlMatch = Number(target.dataset.lvl);
        target.style.opacity = lvl === lvlMatch && lvl > 0 ? "1" : "0";
      });
    });

    mo.observe(parent, { attributes: true, attributeFilter: ["data-level"] });
    return () => mo.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      data-show="0"
    >
      {/* Level 1: subtle glow ring */}
      <div
        data-lvl="1"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
        style={{
          width: "70%",
          aspectRatio: "1 / 1",
          background: "radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 70%)",
          opacity: 0,
        }}
      />

      {/* Level 2: assembly ring segments */}
      <svg
        data-lvl="2"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700"
        viewBox="0 0 200 200"
        style={{ width: "80%", opacity: 0 }}
      >
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,106,0,0.15)" strokeWidth="0.5" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,106,0,0.08)" strokeWidth="0.5" strokeDasharray="2 8" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      </svg>

      {/* Level 3: telemetry / data nodes */}
      <div
        data-lvl="3"
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: 0 }}
      >
        {/* Corner data brackets */}
        {[
          { top: "15%", left: "10%" },
          { top: "15%", right: "10%" },
          { bottom: "15%", left: "10%" },
          { bottom: "15%", right: "10%" },
        ].map((pos, i) => (
          <svg
            key={i}
            className="absolute text-white/10"
            style={{ ...pos, width: 24, height: 24 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            {i < 2
              ? <><path d="M4 4h6M4 4v6" /></>
              : <><path d="M20 20h-6M20 20v-6" /></>
            }
          </svg>
        ))}

        {/* Pulsing nodes */}
        {[
          { top: "30%", left: "25%" },
          { top: "55%", left: "18%" },
          { top: "70%", left: "35%" },
          { top: "40%", right: "22%" },
          { top: "65%", right: "28%" },
        ].map((pos, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#ff6a00]/40"
            style={{
              ...pos,
              animation: `journey-pulse 2s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Level 4: multi-drone silhouettes + paths */}
      <div
        data-lvl="4"
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: 0 }}
      >
        {/* Drone silhouettes */}
        {[
          { top: "25%", left: "20%", delay: "0s" },
          { top: "55%", left: "65%", delay: "0.5s" },
          { top: "70%", left: "35%", delay: "1s" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute transition-all duration-[3000ms]"
            style={{
              ...pos,
              width: 20,
              height: 20,
              opacity: 0.2,
              animation: `journey-float ${3 + i * 0.5}s ease-in-out ${pos.delay} infinite`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,106,0,0.4)" strokeWidth="1" className="h-full w-full">
              <path d="M12 2l3 5h5l-3 5 3 5h-5l-3 5-3-5H4l3-5-3-5h5z" />
            </svg>
          </div>
        ))}

        {/* Path lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="none">
          <path
            d="M80 100 Q 200 50, 260 220 Q 320 350, 200 320"
            fill="none"
            stroke="rgba(255,106,0,0.08)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d="M320 80 Q 180 120, 140 260 Q 100 370, 280 340"
            fill="none"
            stroke="rgba(255,106,0,0.05)"
            strokeWidth="0.5"
            strokeDasharray="3 8"
          />
        </svg>

        {/* Mission labels */}
        {["Agriculture", "Search & Rescue", "Mapping"].map((label, i) => (
          <span
            key={label}
            className="absolute font-label text-[8px] uppercase tracking-[0.15em] text-white/20"
            style={{
              top: `${25 + i * 20}%`,
              left: i < 2 ? "75%" : "15%",
              animation: `journey-fade 4s ease-in-out ${i * 1.2}s infinite`,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
