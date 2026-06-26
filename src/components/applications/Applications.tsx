"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { APPLICATION_CARDS } from "@/lib/constants";
import { ApplicationCard } from "@/components/applications/ApplicationCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Applications() {
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hdr = section.current?.querySelector(".apps-header");
      if (hdr) gsap.fromTo(hdr, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: hdr, start: "top 85%", toggleActions: "play none none none" } });

      const cards = grid.current?.querySelectorAll(".app-card");
      if (cards?.length) gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: grid.current, start: "top 80%", toggleActions: "play none none none" } });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="bg-surface-container-lowest px-4 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="apps-header mb-16 text-center">
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Real World</p>
          <h2 className="font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">Where Drones <span className="text-[#ff6a00]">Make a Difference</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant font-body">From search and rescue to cinema — drones are transforming every industry.</p>
        </div>
        <div ref={grid} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {APPLICATION_CARDS.map((card) => (
            <div key={card.title} className="app-card">
              <ApplicationCard card={card} index={APPLICATION_CARDS.indexOf(card)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
