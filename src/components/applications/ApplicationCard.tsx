"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ApplicationCard as AppCard } from "@/lib/types";

const lucideMap: Record<string, string> = {
  emergency: "\u26A0",
  movie: "\u25B6",
  agriculture: "\u2618",
  domain: "\u2302",
  forest: "\u2663",
  local_shipping: "\u2630",
};

const cardItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface Props {
  card: AppCard;
  index: number;
}

export function ApplicationCard({ card, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    setRot({ x: rx, y: ry });
  };

  const leave = () => {
    setRot({ x: 0, y: 0 });
    setHover(false);
  };

  return (
    <motion.div
      variants={cardItem}
      ref={ref}
      onMouseMove={move}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={leave}
      className="group cursor-pointer"
      style={{ perspective: "800px" }}
    >
      <motion.div
        className="rounded-2xl border border-white/40 bg-white/70 p-8 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-lg"
        animate={{
          rotateX: hover ? rot.x : 0,
          rotateY: hover ? rot.y : 0,
          y: hover ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: `${card.color}15` }}
        >
          <span style={{ color: card.color }}>
            {lucideMap[card.icon] || "\u25C7"}
          </span>
        </div>
        <h3 className="mb-2 font-heading text-lg font-semibold text-on-surface transition-colors group-hover:text-[#a14000]">
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed text-on-surface-variant font-body">
          {card.description}
        </p>
      </motion.div>
    </motion.div>
  );
}
