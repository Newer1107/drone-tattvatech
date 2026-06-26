"use client";

import { motion } from "framer-motion";
import { SKILLS_BENTO } from "@/lib/constants";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function SkillsBento() {
  return (
    <section className="bg-surface px-4 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            Beyond the Build
          </p>
          <h2 className="font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">
            The Skills of Tomorrow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant font-body">
            Engineering mindsets that transcend the classroom.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid auto-rows-[240px] grid-cols-1 gap-5 md:grid-cols-3"
        >
          {SKILLS_BENTO.map((skill) => {
            const large = skill.span === "col-span-2 row-span-2";
            return (
              <motion.div
                key={skill.title}
                variants={cardItem}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-8 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg ${
                  large ? "md:col-span-2 md:row-span-2" : ""
                } ${
                  large
                    ? "bg-gradient-to-br from-surface to-surface-container-high"
                    : ""
                }`}
              >
                <div
                  className={`mb-4 flex items-center justify-center rounded-xl bg-[#ff6a00]/10 ${
                    large ? "h-14 w-14" : "h-12 w-12"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[#a14000] ${
                      large ? "text-3xl" : "text-2xl"
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {skill.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-heading font-semibold text-on-surface group-hover:text-[#a14000] transition-colors ${
                      large ? "text-2xl" : "text-lg"
                    }`}
                  >
                    {skill.title}
                  </h3>
                  <p
                    className={`mt-2 leading-relaxed text-on-surface-variant font-body ${
                      large ? "text-sm" : "text-xs"
                    }`}
                  >
                    {skill.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
