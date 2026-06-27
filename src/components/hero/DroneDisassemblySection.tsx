"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const DroneViewer = dynamic(
  () => import("@/components/hero/DroneViewer").then((m) => m.DroneViewer),
  { ssr: false },
);

export function DroneDisassemblySection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    setMouse({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    });
  };

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative overflow-hidden bg-surface px-4 py-24 lg:px-8 lg:py-32"
    >
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#ff6a00]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
              The Machine
            </p>
            <h2 className="mb-6 font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">
              Every Component{" "}
              <span className="text-[#ff6a00]">Revealed.</span>
            </h2>

            <div className="space-y-5 font-body text-base leading-relaxed text-on-surface-variant">
              <p>
                A drone is not one thing. It is a system of interconnected
                technologies working in harmony — flight controllers adjusting
                attitude sixty times a second, ESCs switching current at
                frequencies you can hear, a GPS module locking onto satellites
                orbiting 20,000 km overhead.
              </p>
              <p>
                At <strong className="text-on-surface">Tattva Tech</strong>,
                we teach you to understand every layer of that system. Not just
                how to fly, but how each component contributes to the behaviour
                of the aircraft in the air.
              </p>
              <p>
                You will build from the frame up. Solder your own power
                distribution board. Flash Betaflight to a real flight
                controller. Tune a PID loop until the quad holds a hover within
                a handspan. Calibrate a compass. Interpret a gyro log.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-surface-variant/50 pt-8">
              {[
                { value: "40+", label: "Flight Hours" },
                { value: "8", label: "Build Projects" },
                { value: "4", label: "Skill Levels" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-[#ff6a00]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant/70 font-body">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <motion.a
              href="#academy"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              Explore the Curriculum
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Right — 3D Drone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] lg:h-[550px] overflow-hidden [isolation:isolate]"
          >
            <DroneViewer mouse={mouse} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
