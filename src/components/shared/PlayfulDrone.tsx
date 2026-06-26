"use client";

import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Drone brain — runs in R3F land                                     */
/* ------------------------------------------------------------------ */

function DronePhysics() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/movingdrone.glb");

  // — persistent state that survives across frames —
  const state = useRef({
    // position / velocity (screen-space, roughly -10…10)
    px: 0, py: 0, pz: 0,
    vx: 0, vy: 0, vz: 0,
    // rotation
    rx: 0, ry: 0, rz: 0,
    // trick timer
    nextTrick: 0,
    // current trick: 0=none 1=barrel-roll 2=loop 3=wobble
    trick: 0,
    trickT: 0,
    // lazy mouse (trails behind real mouse)
    mx: 0, my: 0,
    // scroll velocity
    sv: 0,
    lastScrollY: 0,
  }).current;

  /* ---------- track mouse & scroll ---------- */
  useEffect(() => {
    let last = 0;
    const onMouse = (e: MouseEvent) => {
      state.mx = (e.clientX / window.innerWidth) * 2 - 1;
      state.my = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      const sy = window.scrollY;
      state.sv = sy - state.lastScrollY;
      state.lastScrollY = sy;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, [state]);

  /* ---------- per-frame physics ---------- */
  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05); // cap for tab-away

    // ---- target position ----
    // scroll moves it vertically, mouse pulls it horizontally, with some chaos
    const scrollNorm = Math.min(state.lastScrollY / 3000, 1);
    const tx = state.mx * 4 + Math.sin(state.lastScrollY * 0.002) * 2;
    const ty = state.my * 3 - scrollNorm * 2 + Math.sin(state.lastScrollY * 0.003) * 1.5;
    const tz = Math.sin(state.lastScrollY * 0.001) * 2 - 1;

    // ---- spring toward target ----
    const spring = 3.5;
    const damp = 5;
    state.vx += (tx - state.px) * spring * dt;
    state.vy += (ty - state.py) * spring * dt;
    state.vz += (tz - state.pz) * spring * dt;
    state.vx -= state.vx * damp * dt;
    state.vy -= state.vy * damp * dt;
    state.vz -= state.vz * damp * dt;

    // scroll velocity adds an extra kick
    state.vy += state.sv * 0.008 * dt;
    state.sv *= 0.92; // decay

    state.px += state.vx * dt;
    state.py += state.vy * dt;
    state.pz += state.vz * dt;

    // ---- tricks ----
    state.trickT += dt;
    if (state.trick === 0 && state.trickT > state.nextTrick) {
      state.trick = Math.ceil(Math.random() * 3);
      state.trickT = 0;
      state.nextTrick = 4 + Math.random() * 5;
    }

    // ---- rotation ----
    // always look in the direction of movement + bank into turns
    const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
    const targetRy = Math.atan2(state.vx, -state.vy) + Math.PI;
    const targetRx = -state.vy * 0.15;
    const targetRz = state.vx * 0.12;

    switch (state.trick) {
      case 1: /* barrel roll */ {
        const p = state.trickT * 6;
        if (state.trickT > 1.2) { state.trick = 0; state.trickT = 0; break; }
        ref.current.position.set(state.px, state.py + Math.sin(p * 4) * 0.3, state.pz);
        ref.current.rotation.set(p, state.ry + p, p);
        return;
      }
      case 2: /* loop */ {
        const p = state.trickT * 5;
        if (state.trickT > 1.4) { state.trick = 0; state.trickT = 0; break; }
        ref.current.position.set(
          state.px + Math.sin(p) * 1.5,
          state.py + Math.cos(p) * 1.5 + 1,
          state.pz,
        );
        ref.current.rotation.set(p + 0.5, state.ry, 0);
        return;
      }
      case 3: /* wobble */ {
        const p = state.trickT * 12;
        if (state.trickT > 1) { state.trick = 0; state.trickT = 0; break; }
        ref.current.position.set(
          state.px + Math.sin(p) * 0.8,
          state.py + Math.cos(p * 1.3) * 0.6,
          state.pz,
        );
        ref.current.rotation.set(
          Math.sin(p * 2) * 0.4,
          state.ry + Math.sin(p) * 0.5,
          Math.cos(p * 1.7) * 0.3,
        );
        return;
      }
    }

    // smooth rotation toward target
    ref.current.position.set(state.px, state.py, state.pz);
    ref.current.rotation.x += (targetRx - ref.current.rotation.x) * 4 * dt;
    ref.current.rotation.y += (targetRy - ref.current.rotation.y) * 4 * dt;
    ref.current.rotation.z += (targetRz - ref.current.rotation.z) * 4 * dt;
  });

  return (
    <group ref={ref} scale={0.8}>
      <primitive object={scene} />
    </group>
  );
}

function SceneFallback() {
  return null;
}

/* ------------------------------------------------------------------ */
/*  Public component — render once in layout                           */
/* ------------------------------------------------------------------ */

export function PlayfulDrone() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<SceneFallback />}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 6]} intensity={1} />
          <pointLight position={[-4, 3, 2]} intensity={0.3} color="#ff6a00" />
          <Environment preset="studio" environmentIntensity={0.4} />
          <DronePhysics />
        </Suspense>
      </Canvas>
    </div>
  );
}
