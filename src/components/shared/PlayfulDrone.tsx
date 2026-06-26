"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Small square landing pad                                          */
/* ------------------------------------------------------------------ */

function LandingPad({ pos, visible }: { pos: [number, number, number]; visible: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const opacity = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    opacity.current += ((visible ? 1 : 0) - opacity.current) * 3 * delta;
    ref.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.opacity = Math.max(0, opacity.current * 0.5);
      }
    });
  });

  return (
    <group ref={ref} position={pos}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color="#ff6a00" transparent opacity={0} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial color="#ff6a00" transparent opacity={0} side={THREE.DoubleSide} emissive="#ff6a00" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Track section headings                                            */
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
/*  Drone — parks on right-side launchpad, glides down to footer      */
/* ------------------------------------------------------------------ */

function DroneGlider() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/movingdrone.glb");

  const model = useRef<THREE.Group>(new THREE.Group());
  if (model.current.children.length === 0) {
    const s = scene.clone();
    s.rotation.y = Math.PI;
    model.current.add(s);
  }

  const progress = useRef(0);
  const headings = useRef<{ el: HTMLElement }[]>([]);
  const lookTarget = useRef(new THREE.Vector3());
  const lookWeight = useRef(0);
  const heroPassed = useRef(false);
  const droneOpacity = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => { headings.current = getHeadingTargets(); timer = null; };
    const handler = () => { if (!timer) timer = setTimeout(refresh, 250); };
    refresh();
    window.addEventListener("scroll", handler, { passive: true });
    return () => { window.removeEventListener("scroll", handler); if (timer) clearTimeout(timer); };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05);

    heroPassed.current = window.scrollY > window.innerHeight * 0.7;
    droneOpacity.current += ((heroPassed.current ? 1 : 0) - droneOpacity.current) * 3 * dt;

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const raw = docH > 0 ? window.scrollY / docH : 0;
    progress.current += (raw - progress.current) * 3 * dt;
    const p = progress.current;

    // PARKED at right side start (p≈0) and right side bottom (p≈1)
    const flightBlend = p < 0.08 ? 0 : p > 0.92 ? 0 : Math.sin((p - 0.08) / 0.84 * Math.PI);
    const fly = flightBlend;
    const park = 1 - fly;

    // Start: right-mid (beside "Every Component" section). End: right-bottom (footer).
    const parkStart = { x: 3.5, y: 0.5, z: 2 };
    const parkEnd = { x: 3.5, y: -2.5, z: 2 };

    // Blend between start and end parked positions based on progress
    const parkX = parkStart.x + (parkEnd.x - parkStart.x) * p;
    const parkY = parkStart.y + (parkEnd.y - parkStart.y) * p;
    const parkZ = parkStart.z + (parkEnd.z - parkStart.z) * p;

    // Flying path with a bit of arc
    const flyX = -3 + p * 6;
    const flyY = 2 - p * 4;
    const flyZ = -2 + p * 3.5;

    const tx = parkX * park + flyX * fly;
    const ty = parkY * park + flyY * fly;
    const tz = parkZ * park + flyZ * fly;

    ref.current.position.x += (tx - ref.current.position.x) * 4 * dt;
    ref.current.position.y += (ty - ref.current.position.y) * 4 * dt;
    ref.current.position.z += (tz - ref.current.position.z) * 3 * dt;

    // Fade based on hero gate + flight
    const fade = droneOpacity.current * (0.2 + 0.8 * (0.3 + 0.7 * fly));
    ref.current.children.forEach((child) => {
      child.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const mat = node.material as THREE.MeshStandardMaterial;
          if (mat && mat.transparent !== undefined) {
            mat.transparent = true;
            mat.opacity = Math.max(0.01, fade);
          }
        }
      });
    });

    // Look at headings while flying
    const vh = window.innerHeight;
    let best = Infinity;
    let bestEl: HTMLElement | null = null;
    for (const h of headings.current) {
      const r = h.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const dist = Math.abs(r.top + r.height / 2 - vh / 2);
      if (dist < best) { best = dist; bestEl = h.el; }
    }

    if (fly > 0.01 && bestEl) {
      const r = bestEl.getBoundingClientRect();
      const sx = (r.left + r.width / 2) / window.innerWidth * 2 - 1;
      const sy = -(r.top + r.height / 2) / window.innerHeight * 2 + 1;
      lookTarget.current.set(sx * 5, sy * 3, 0);
      lookWeight.current = Math.min(1, lookWeight.current + dt * 3);
      const dir = new THREE.Vector3().subVectors(lookTarget.current, ref.current.position).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
      ref.current.quaternion.slerp(q, dt * 2.5);
    } else {
      lookWeight.current = Math.max(0, lookWeight.current - dt);
      ref.current.rotation.x += (0.2 * park - ref.current.rotation.x) * 3 * dt;
    }

    if (fly > 0.05) {
      ref.current.position.y += Math.sin(performance.now() * 0.0015) * 0.03 * dt * 6;
    }
  });

  return (
    <group ref={ref} scale={0.25}>
      <primitive object={model.current} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress line                                                     */
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
      <div className="absolute inset-x-0 bottom-0 rounded-full bg-[#ff6a00] transition-all duration-200 ease-out" style={{ height: `${pct * 100}%`, boxShadow: "0 0 6px rgba(255,106,0,0.3)" }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export function PlayfulDrone() {
  const [heroPassed, setHeroPassed] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setHeroPassed(sy > window.innerHeight * 0.7);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? sy / docH : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pad at launch (start) position — right-mid. Pad at land (end) — right-bottom.
  // Show start pad when hero passed and not landed yet
  const showStartPad = heroPassed && scrollPct < 0.9;
  const showEndPad = scrollPct > 0.85;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <ProgressLine />
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
          <LandingPad pos={[3.5, 0.5, 2]} visible={showStartPad} />
          <LandingPad pos={[3.5, -2.5, 2]} visible={showEndPad} />
          <DroneGlider />
        </Suspense>
      </Canvas>
    </div>
  );
}
