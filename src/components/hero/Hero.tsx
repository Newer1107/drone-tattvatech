"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Particles } from "@/components/shared/Particles";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DroneCanvas = dynamic(
  () => import("@/components/hero/DroneCanvas").then((mod) => mod.DroneCanvas),
  { ssr: false },
);

interface Mouse {
  x: number;
  y: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<T extends (...args: any[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<Mouse>({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const handleMouseMove = throttle((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMouse({ x, y });
  }, 50);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-container-lowest"
      onMouseMove={!reducedMotion ? handleMouseMove : undefined}
    >
      {/* Background Video with dark overlay */}
      <div className="absolute inset-0 mask-fade-bottom">
        <video
          className="object-cover w-full h-full"
          loop
          muted
          autoPlay
          playsInline
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Particles */}
      <Particles />

      {/* 3D Drone Scene */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <DroneCanvas mouse={mouse} />
      </div>

      {/* Content Overlay */}
      <motion.div
        className="relative z-20 max-w-4xl mx-auto text-center px-4"
        variants={reducedMotion ? undefined : stagger}
        initial={reducedMotion ? undefined : "hidden"}
        animate={reducedMotion ? undefined : "visible"}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/20 bg-brand-orange/5 text-sm font-label text-brand-orange mb-8"
          variants={fadeUp}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
          </span>
          Flight Academy 2026
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-display text-6xl md:text-8xl tracking-tighter font-bold text-white mb-6"
          variants={fadeUp}
        >
          BUILD THE{" "}
          <span className="text-brand-orange">FUTURE</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="font-body text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12"
          variants={fadeUp}
        >
          Learn. Build. Fly. Innovate. Step into a high-end innovation lab and
          master the precision of aerospace engineering and drone telemetry.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeUp}
        >
          <a
            href="#start"
            className="inline-flex items-center justify-center bg-brand-orange text-white rounded-full px-8 py-4 font-label font-semibold text-base transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Start Your Journey
          </a>
          <a
            href="#learning-path"
            className="inline-flex items-center justify-center border-2 border-brand-orange text-brand-orange rounded-full px-8 py-4 font-label font-semibold text-base transition-all hover:bg-brand-orange hover:text-white active:scale-[0.98]"
          >
            Explore Learning Path
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs font-label tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
