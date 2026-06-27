"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { fixAllMaterials } from "@/lib/fixShaderPrecision";

/* ------------------------------------------------------------------ */
/*  Drone — drifts through the page on a Lissajous curve               */
/*  No pads, no takeoff, no landing. Just a ghost in the machine.     */
/* ------------------------------------------------------------------ */

function DroneGhost() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/movingdrone.glb");

  const model = useRef<THREE.Group>(new THREE.Group());
  if (model.current.children.length === 0) {
    const s = scene.clone();
    s.rotation.y = Math.PI;
    s.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const m = node.material as THREE.MeshStandardMaterial;
        if (m) { m.transparent = true; m.opacity = 0; }
      }
    });
    model.current.add(s);

    // Shader precision fix: clamp Ems ≥ 0 to prevent X4122 denormal warning
    s.traverse((node) => {
      if (node instanceof THREE.Mesh) fixAllMaterials(node);
    });
  }

  const state = useRef({
    scroll: 0,
    opacity: 0,
    phase: Math.random() * 100,
    trickTime: 0,
    trickDone: false,
    // speed & idle
    velocity: 0,
    idleTime: 0,
    lastScrollTime: 0,
    idleTrickPhase: 0,
    inIdleTrick: false,
    // entrance
    entranceStarted: false,
    entranceProgress: 0,
    entranceDone: false,
    fadeOutProgress: 0,
  });

  useEffect(() => {
    const onScroll = () => {
      const s = state.current;
      const now = performance.now();
      const dt = Math.max(16, now - s.lastScrollTime);
      const dy = Math.abs(window.scrollY - s.scroll);
      s.velocity = dy / dt * 16; // normalize to ~16ms frames
      s.scroll = window.scrollY;
      s.lastScrollTime = now;
      s.idleTime = 0;
      s.inIdleTrick = false;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05);
    const s = state.current;

    // ──────────────────────────────────────────────
    //  ENTRANCE — triggered when app finishes loading
    // ──────────────────────────────────────────────
    if (!s.entranceDone && document.body.classList.contains("app-loaded")) {
      if (!s.entranceStarted) {
        s.entranceStarted = true;
        s.entranceProgress = 0;
        ref.current.position.set(0, -0.5, 0);
        ref.current.scale.set(0.9, 0.9, 0.9);
        ref.current.rotation.set(0, 0, 0);
      }

      if (s.entranceProgress < 1) {
        s.entranceProgress += dt * 0.4; // ~2.5s
        const ep = Math.min(1, s.entranceProgress);
        const ease = ep < 0.5 ? 4 * ep * ep * ep : 1 - Math.pow(-2 * ep + 2, 3) / 2;

        // Scale: 0.9 → 0.2
        const sc = 0.9 - 0.7 * ease;
        ref.current.scale.set(sc, sc, sc);

        // Y rotation: one full spin
        ref.current.rotation.y = ep * Math.PI * 2;

        // Gentle drift upward from center
        ref.current.position.y = -0.5 + ease * 0.8;
        ref.current.position.x = Math.sin(ep * Math.PI) * 0.5;

        // Opacity fade in (overwrites the initial 0)
        const matOpacity = Math.min(1, ep * 1.8);
        ref.current.children.forEach((child) => {
          child.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              const m = node.material as THREE.MeshStandardMaterial;
              if (m) m.opacity = matOpacity;
            }
          });
        });

        if (ep >= 1) {
          s.entranceProgress = 1;
          s.fadeOutProgress = 0;
        }
        return;
      }

      // Fade-out after the spin completes
      s.fadeOutProgress += dt * 1.2; // ~0.83s
      const fp = Math.min(1, s.fadeOutProgress);
      const fadeOpacity = Math.max(0, 1 - fp);
      ref.current.children.forEach((child) => {
        child.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            const m = node.material as THREE.MeshStandardMaterial;
            if (m) m.opacity = fadeOpacity;
          }
        });
      });

      if (fp >= 1) {
        s.entranceDone = true;
        // Hand off opacity to the normal hero-gate system (starts at 0)
        s.opacity = 0;
      }
      return;
    }

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? s.scroll / docH : 0;

    // gate: appear after hero
    const heroGate = Math.min(1, Math.max(0, (s.scroll - window.innerHeight * 0.6) / (window.innerHeight * 0.3)));
    s.opacity += (heroGate - s.opacity) * 3 * dt;

    // ---- trick trigger — footer zone ----
    const inFooter = p > 0.82;
    if (inFooter && !s.trickDone) {
      s.trickTime += dt;
      if (s.trickTime > 3.5) s.trickDone = true;
    }
    if (!inFooter) {
      s.trickTime = 0;
      s.trickDone = false;
    }
    const trickProgress = Math.min(1, s.trickTime / 3);

    // ---- position ----
    let lx: number, ly: number, lz: number;

    if (inFooter && trickProgress > 0) {
      // During trick: settle into a gentle hover at a fixed spot
      const settle = Math.min(1, trickProgress * 2);
      const hoverX = Math.sin(p * Math.PI * 2 + s.phase * 0.01) * 3.5;
      const hoverY = 2.2 - p * 4.4;
      const hoverZ = 0;
      // blend from Lissajous to settled hover
      lx = hoverX * (1 - settle) + hoverX * settle;
      ly = (2.2 - p * 4.4 + Math.sin(p * Math.PI * 3 + s.phase * 0.01) * 0.6) * (1 - settle) + (-1.8) * settle;
      lz = Math.sin(p * Math.PI + s.phase * 0.01) * 1.5 * (1 - settle);
    } else {
      lx = Math.sin(p * Math.PI * 2 + s.phase * 0.01) * 3.5;
      ly = 2.2 - p * 4.4 + Math.sin(p * Math.PI * 3 + s.phase * 0.01) * 0.6;
      lz = Math.sin(p * Math.PI + s.phase * 0.01) * 1.5;
    }

    // ---- scroll velocity response ----
    // Fast scrolling → more aggressive banking, looser spring
    const vel = Math.min(s.velocity, 30);
    const speedFactor = vel / 15;
    const springPos = 3 - speedFactor * 0.8; // spring loosens at speed (min 2.2)
    const bankMultiplier = 1 + speedFactor * 2; // more bank at speed

    // ---- idle detection ----
    s.idleTime += dt;
    const idleThreshold = 1.5; // seconds of stillness before idle trick
    const isIdle = s.idleTime > idleThreshold && vel < 0.5;
    if (isIdle && !s.inIdleTrick && !inFooter) {
      s.inIdleTrick = true;
      s.idleTrickPhase = 0;
    }
    if (s.inIdleTrick) {
      s.idleTrickPhase += dt;
      if (s.idleTrickPhase > 4) s.inIdleTrick = false;
    }

    // ---- position: velocity loosens spring ----
    const springX = springPos * dt;
    const springY = springPos * dt;
    const springZ = (springPos - 0.5) * dt;
    ref.current.position.x += (lx - ref.current.position.x) * springX;
    ref.current.position.y += (ly - ref.current.position.y) * springY;
    ref.current.position.z += (lz - ref.current.position.z) * springZ;

    // ---- rotation ----
    const dx = lx - ref.current.position.x;
    const dy = ly - ref.current.position.y;

    if (inFooter && s.trickTime > 0.3 && !s.trickDone) {
      const rollAngle = easeInOutCubic(trickProgress) * Math.PI * 2;
      ref.current.rotation.x += (-dy * 0.08 + Math.sin(rollAngle) * 0.3 - ref.current.rotation.x) * 3 * dt;
      ref.current.rotation.z += (Math.cos(rollAngle * 2) * 0.15 - ref.current.rotation.z) * 3 * dt;
      ref.current.rotation.y += dt * 0.4 * (1 - trickProgress);
    } else if (inFooter && s.trickDone) {
      const bob = Math.sin(performance.now() * 0.001) * 0.04;
      ref.current.position.y += bob * dt * 8;
      ref.current.rotation.x += (-0.05 - ref.current.rotation.x) * 2 * dt;
      ref.current.rotation.z += (0.03 - ref.current.rotation.z) * 2 * dt;
      ref.current.rotation.y += dt * 0.03;
    } else if (isIdle && s.inIdleTrick) {
      // Idle trick: slow curiosity scan — yaw left then right
      const phase = s.idleTrickPhase;
      const scan = Math.sin(phase * 0.8) * 0.4;
      ref.current.rotation.x += (-dy * 0.08 - ref.current.rotation.x) * 2 * dt;
      ref.current.rotation.z += (dx * 0.06 - ref.current.rotation.z) * 2 * dt;
      ref.current.rotation.y += (scan + dt * 0.02 - ref.current.rotation.y) * 2 * dt;
      // Gentle hover bob
      ref.current.position.y += Math.sin(performance.now() * 0.002 + s.phase) * 0.02 * dt * 6;
    } else {
      // Normal flight: bank into turns, amplified by speed
      ref.current.rotation.x += (-dy * 0.12 * bankMultiplier - ref.current.rotation.x) * 3 * dt;
      ref.current.rotation.z += (dx * 0.1 * bankMultiplier - ref.current.rotation.z) * 3 * dt;
      ref.current.rotation.y += dt * (0.08 + vel * 0.005);
    }

    // ---- opacity ----
    const matOpacity = Math.max(0.01, Math.min(1, s.opacity * 0.6));
    ref.current.children.forEach((child) => {
      child.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const m = node.material as THREE.MeshStandardMaterial;
          if (m) { m.opacity = matOpacity; }
        }
      });
    });
  });

  return (
    <group ref={ref} scale={0.2}>
      <primitive object={model.current} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

// Suppress non-actionable Three.js deprecation warnings once
// X4122 is NOT suppressed here — fixed at the shader level in fixShaderPrecision.ts
const SUPPRESS_WARNS = [
  "THREE.Clock: This module has been deprecated",
];
if (typeof console !== "undefined") {
  const _warn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && SUPPRESS_WARNS.some((s) => args[0].includes(s))) return;
    _warn.apply(console, args);
  };
}

export function PlayfulDrone() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden [isolation:isolate]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
        onCreated={(state) => { state.gl.setClearColor(new THREE.Color(0, 0, 0), 0); }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 6]} intensity={1} />
          <Environment preset="studio" environmentIntensity={0.4} />
          <DroneGhost />
        </Suspense>
      </Canvas>
    </div>
  );
}
