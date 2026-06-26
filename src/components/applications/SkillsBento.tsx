"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SKILLS_BENTO } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SkillsBento() {
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hdr = section.current?.querySelector(".bento-header");
      if (hdr) gsap.fromTo(hdr, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: hdr, start: "top 85%", toggleActions: "play none none none" } });

      const cards = grid.current?.querySelectorAll(".bento-card");
      if (cards?.length) gsap.fromTo(cards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: grid.current, start: "top 80%", toggleActions: "play none none none" } });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="bg-surface px-4 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="bento-header mb-16 text-center">
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Beyond the Build</p>
          <h2 className="font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">The Skills of Tomorrow</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant font-body">Engineering mindsets that transcend the classroom.</p>
        </div>
        <div ref={grid} className="grid auto-rows-[240px] grid-cols-1 gap-5 md:grid-cols-3">
          {SKILLS_BENTO.map((skill) => {
            const large = skill.span === "col-span-2 row-span-2";
            return (
              <div key={skill.title} className={`bento-card group relative flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-8 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg ${large ? "md:col-span-2 md:row-span-2" : ""} ${large ? "bg-gradient-to-br from-surface to-surface-container-high" : ""}`}>
                <div className={`mb-4 flex items-center justify-center rounded-xl bg-[#ff6a00]/10 ${large ? "h-14 w-14" : "h-12 w-12"}`}>
                  <span className={`material-symbols-outlined text-[#a14000] ${large ? "text-3xl" : "text-2xl"}`} style={{ fontVariationSettings: "'FILL' 1" }}>{skill.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-heading font-semibold text-on-surface transition-colors group-hover:text-[#a14000] ${large ? "text-2xl" : "text-lg"}`}>{skill.title}</h3>
                  <p className={`mt-2 leading-relaxed text-on-surface-variant font-body ${large ? "text-sm" : "text-xs"}`}>{skill.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
