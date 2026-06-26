"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Track section headings — update list on scroll                     */
/* ------------------------------------------------------------------ */

const HEADING_SELECTORS = "h2, h1";

function getHeadingTargets(): { el: HTMLElement }[] {
  const els: { el: HTMLElement }[] = [];
  document.querySelectorAll(HEADING_SELECTORS).forEach((el) => {
    if (el instanceof HTMLElement && el.isConnected) els.push({ el });
  });
  return els;
}

/* ------------------------------------------------------------------ */
/*  Drone — glides left→right, looks at the nearest heading          */
/* ------------------------------------------------------------------ */

function DroneGlider() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/movingdrone.glb");

  const model = useRef<THREE.Group>(new THREE.Group());
  if (model.current.children.length === 0) {
    const s = scene.clone();
    s.rotation.y = Math.PI; // face forward
    model.current.add(s);
  }

  const progress = useRef(0);
  const headings = useRef<{ el: HTMLElement }[]>([]);
  const lookTarget = useRef(new THREE.Vector3());
  const lookWeight = useRef(0);

  // Refresh heading list on scroll (debounced)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      headings.current = getHeadingTargets();
      timer = null;
    };
    const handler = () => { if (!timer) timer = setTimeout(refresh, 250); };
    refresh();
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05);

    // scroll progress (0 → 1)
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const raw = docH > 0 ? window.scrollY / docH : 0;
    progress.current += (raw - progress.current) * 3 * dt;
    const p = progress.current;

    // glide path: left→right, top→bottom, front→back
    ref.current.position.x += (-4 + p * 8 - ref.current.position.x) * 4 * dt;
    ref.current.position.y += (2.2 - p * 4 - ref.current.position.y) * 4 * dt;
    ref.current.position.z += (-1 + p * 3 - ref.current.position.z) * 3 * dt;

    // find the heading closest to viewport centre
    const vh = window.innerHeight;
    let best = Infinity;
    let bestEl: HTMLElement | null = null;
    for (const h of headings.current) {
      const r = h.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const dist = Math.abs(r.top + r.height / 2 - vh / 2);
      if (dist < best) { best = dist; bestEl = h.el; }
    }

    if (bestEl) {
      const r = bestEl.getBoundingClientRect();
      const sx = (r.left + r.width / 2) / window.innerWidth * 2 - 1;
      const sy = -(r.top + r.height / 2) / window.innerHeight * 2 + 1;
      lookTarget.current.set(sx * 5, sy * 3, 0);
      lookWeight.current = Math.min(1, lookWeight.current + dt * 3);
    } else {
      lookWeight.current = Math.max(0, lookWeight.current - dt);
    }

    if (lookWeight.current > 0.01) {
      const dir = new THREE.Vector3()
        .subVectors(lookTarget.current, ref.current.position)
        .normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), dir,
      );
      ref.current.quaternion.slerp(q, dt * 2.5);
    }

    // subtle idle bob
    ref.current.position.y += Math.sin(performance.now() * 0.0015) * 0.03 * dt * 6;
  });

  return (
    <group ref={ref} scale={0.3}>
      <primitive object={model.current} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Thin progress line on the right edge                               */
/* ------------------------------------------------------------------ */

function ProgressLine() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setPct(docH > 0 ? window.scrollY / docH : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pointer-events-none absolute right-4 top-14 bottom-14 w-[2px] rounded-full bg-surface-variant/20 md:right-6 lg:right-8">
      <div
        className="absolute inset-x-0 bottom-0 rounded-full bg-[#ff6a00] transition-all duration-200 ease-out"
        style={{ height: `${pct * 100}%`, boxShadow: "0 0 6px rgba(255,106,0,0.3)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export function PlayfulDrone() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <ProgressLine />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
        onCreated={(state) => {
          state.gl.setClearColor(new THREE.Color(0, 0, 0), 0);
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 6]} intensity={1} />
          <Environment preset="studio" environmentIntensity={0.4} />
          <DroneGlider />
        </Suspense>
      </Canvas>
    </div>
  );
}
