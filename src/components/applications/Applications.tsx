"use client";

import { motion } from "framer-motion";
import { APPLICATION_CARDS } from "@/lib/constants";
import { ApplicationCard } from "@/components/applications/ApplicationCard";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export function Applications() {
  return (
    <section className="bg-surface-container-lowest px-4 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            Real World
          </p>
          <h2 className="font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">
            Where Drones{" "}
            <span className="text-[#ff6a00]">Make a Difference</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant font-body">
            From search and rescue to cinema — drones are transforming every
            industry.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {APPLICATION_CARDS.map((card, i) => (
            <ApplicationCard key={card.title} card={card} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
