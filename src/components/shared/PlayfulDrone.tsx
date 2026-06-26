"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

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
  }

  const state = useRef({
    scroll: 0,
    opacity: 0,
    phase: Math.random() * 100, // unique phase offset per session
  });

  useEffect(() => {
    const onScroll = () => { state.current.scroll = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05);
    const s = state.current;

    // scroll progress (0–1)
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? s.scroll / docH : 0;

    // gate: appear after hero, full opacity by p≈0.15
    const heroGate = Math.min(1, Math.max(0, (s.scroll - window.innerHeight * 0.6) / (window.innerHeight * 0.3)));
    s.opacity += (heroGate - s.opacity) * 3 * dt;

    // ---- Lissajous path in viewport space ----
    // x: figure-8 sweep, width 7 units
    const lx = Math.sin(p * Math.PI * 2 + s.phase * 0.01) * 3.5;
    // y: scrolls from top to bottom, with a gentle wobble
    const ly = 2.2 - p * 4.4 + Math.sin(p * Math.PI * 3 + s.phase * 0.01) * 0.6;
    // z: depth oscillation, forward then back
    const lz = Math.sin(p * Math.PI + s.phase * 0.01) * 1.5;

    // smooth follow
    ref.current.position.x += (lx - ref.current.position.x) * 3 * dt;
    ref.current.position.y += (ly - ref.current.position.y) * 3 * dt;
    ref.current.position.z += (lz - ref.current.position.z) * 2.5 * dt;

    // ---- rotation: gentle tumble in the direction of travel ----
    const dx = lx - ref.current.position.x;
    const dy = ly - ref.current.position.y;
    ref.current.rotation.x += (-dy * 0.12 - ref.current.rotation.x) * 3 * dt;
    ref.current.rotation.z += (dx * 0.1 - ref.current.rotation.z) * 3 * dt;
    ref.current.rotation.y += dt * 0.08; // slow constant spin

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

export function PlayfulDrone() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
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
