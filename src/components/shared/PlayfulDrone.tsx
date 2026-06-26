"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Landing pad — a subtle platform with glow ring                    */
/* ------------------------------------------------------------------ */

function LandingPad({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const opacity = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    opacity.current += ((visible ? 1 : 0) - opacity.current) * 3 * delta;
    ref.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.opacity = Math.max(0, opacity.current * 0.6);
      }
    });
  });

  return (
    <group ref={ref}>
      {/* Main pad — subtle disc */}
      <mesh position={[0, -1.85, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 1.2, 48]} />
        <meshStandardMaterial
          color="#ff6a00"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, -1.83, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.4, 48]} />
        <meshStandardMaterial
          color="#ff6a00"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          emissive="#ff6a00"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Inner fill */}
      <mesh position={[0, -1.86, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial
          color="#151b2a"
          transparent
          opacity={0}
          roughness={0.8}
        />
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
/*  Drone — parks on platform, glides across page after hero          */
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

  // Refresh heading list
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

    // ---- hero gate: drone only appears after hero is scrolled past ----
    heroPassed.current = window.scrollY > window.innerHeight * 0.7;
    droneOpacity.current += ((heroPassed.current ? 1 : 0) - droneOpacity.current) * 3 * dt;

    // scroll progress
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const raw = docH > 0 ? window.scrollY / docH : 0;
    progress.current += (raw - progress.current) * 3 * dt;
    const p = progress.current;

    // blend between PARKED and FLYING
    const flightBlend = p < 0.08 ? 0 : p > 0.92 ? 0 : Math.sin((p - 0.08) / 0.84 * Math.PI);
    const fly = flightBlend;
    const park = 1 - fly;

    const parkX = 0, parkY = -1.8, parkZ = 2;
    const parkRx = 0.35, parkRz = 0.2;

    const flyX = -4 + p * 8;
    const flyY = 2.5 - p * 4.5;
    const flyZ = -1 + p * 3;

    const tx = parkX * park + flyX * fly;
    const ty = parkY * park + flyY * fly;
    const tz = parkZ * park + flyZ * fly;

    ref.current.position.x += (tx - ref.current.position.x) * 4 * dt;
    ref.current.position.y += (ty - ref.current.position.y) * 4 * dt;
    ref.current.position.z += (tz - ref.current.position.z) * 3 * dt;

    // fade drone with hero gate
    const finalOpacity = droneOpacity.current * (0.3 + 0.7 * (0.2 + 0.8 * fly));
    ref.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
        child.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            const mat = node.material as THREE.MeshStandardMaterial;
            if (mat && mat.transparent !== undefined) {
              mat.transparent = true;
              mat.opacity = Math.max(0.01, finalOpacity);
            }
          }
        });
      }
    });

    // look at headings while flying
    const vh = window.innerHeight;
    let best = Infinity;
    let bestEl: HTMLElement | null = null;
    for (const h of headings.current) {
      const r = h.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const dist = Math.abs(r.top + r.height / 2 - vh / 2);
      if (dist < best) { best = dist; bestEl = h.el; }
    }

    let targetRx = parkRx * park;
    let targetRz = parkRz * park;

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
      ref.current.rotation.x += (targetRx - ref.current.rotation.x) * 3 * dt;
      ref.current.rotation.z += (targetRz - ref.current.rotation.z) * 3 * dt;
    }

    if (fly > 0.05) {
      ref.current.position.y += Math.sin(performance.now() * 0.0015) * 0.03 * dt * 6;
    }
  });

  return (
    <group ref={ref} scale={0.3}>
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

  useEffect(() => {
    const check = () => setHeroPassed(window.scrollY > window.innerHeight * 0.7);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

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
          <LandingPad visible={heroPassed} />
          <DroneGlider />
        </Suspense>
      </Canvas>
    </div>
  );
}
