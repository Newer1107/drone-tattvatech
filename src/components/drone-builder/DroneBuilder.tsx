"use client";

import { motion } from "framer-motion";
import { DRONE_COMPONENTS } from "@/lib/constants";

const iconSymbol: Record<string, string> = {
  grid_view: "\u25A3",
  speed: "\u27F2",
  bolt: "\u21AF",
  battery_std: "\u229F",
  videocam: "\u25CE",
  satellite_alt: "\u2316",
  propeller: "\u2726",
  check_circle: "\u25CF",
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const cardItem = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const features = [
  {
    title: "Precision Assembly",
    desc: "Master micro-soldering and structural integrity.",
  },
  {
    title: "Power Systems",
    desc: "Calculate thrust-to-weight ratios and battery efficiency.",
  },
  {
    title: "Flight Dynamics",
    desc: "Understand PID tuning and aerodynamic stability.",
  },
];

export function DroneBuilder() {
  return (
    <section className="relative overflow-hidden bg-surface-container-lowest px-4 py-24 lg:px-8 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,106,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            Hardware Mastery
          </p>
          <h2 className="font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">
            Understand Every{" "}
            <span className="text-[#ff6a00]">Component.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant font-body">
            Build drones from the ground up. Each component plays a critical
            role in flight performance, stability, and mission capability.
          </p>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-3"
          >
            {DRONE_COMPONENTS.map((comp, i) => (
              <motion.div
                key={comp.id}
                variants={cardItem}
                className="group flex items-center gap-4 rounded-xl border border-white/30 bg-white/60 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-[#ff6a00]/30 hover:shadow-md hover:shadow-[#ff6a00]/5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6a00]/10 text-base text-[#ff6a00]">
                  {iconSymbol[comp.icon] || "\u25C7"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface transition-colors group-hover:text-[#ff6a00]">
                    {comp.name}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant/60">
                    {comp.description}
                  </p>
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff6a00]/10 text-xs font-bold text-[#ff6a00]">
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-lg font-heading font-semibold text-on-surface">
                Why build your own?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant font-body">
                Every drone we fly is assembled by hand. Understanding each
                component means you can diagnose, tune, and optimize any build.
              </p>
            </motion.div>

            <div className="space-y-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex gap-4"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6a00]/10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#ff6a00]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface font-heading">
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-sm text-on-surface-variant/80">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-2 pt-4"
            >
              {DRONE_COMPONENTS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full bg-[#ff6a00]/20 transition-all even:w-5 odd:w-1.5"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
