"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LEARNING_LEVELS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LearningJourney() {
  const section = useRef<HTMLElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(header.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: header.current, start: "top 85%", toggleActions: "play none none none" } });

    const cards = items.current?.querySelectorAll(".tl-card");
    if (cards?.length) gsap.fromTo(cards, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: items.current, start: "top 82%", toggleActions: "play none none none" } });

    const bar = items.current?.querySelector(".tl-progress");
    if (bar) gsap.fromTo(bar, { width: "0%" }, { width: "100%", duration: 1.2, delay: 0.5, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 85%", toggleActions: "play none none none" } });
  }, { scope: section });

  return (
    <section ref={section} className="relative overflow-hidden bg-surface px-4 py-24 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute -right-80 top-0 h-[800px] w-[800px] rounded-full bg-[#ff6a00]/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div ref={header} className="mb-16 text-center">
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Curriculum</p>
          <h2 className="font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">The Engineering Path</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant font-body">A systematic progression from raw mechanics to autonomous artificial intelligence.</p>
        </div>
        <div ref={items} className="relative mx-auto max-w-3xl">
          <div className="absolute left-[27px] top-0 bottom-0 w-[2px] rounded-full bg-surface-variant md:left-1/2 md:-translate-x-px" />
          {LEARNING_LEVELS.map((level, i) => (
            <div key={level.id} className="tl-card relative mb-12 last:mb-0">
              <div className={`flex flex-col md:flex-row ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-0 z-10 md:left-1/2 md:-translate-x-1/2">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white transition-shadow ${level.unlocked ? "border-[#ff6a00] shadow-[0_0_0_4px_rgba(255,106,0,0.1)]" : "border-surface-variant"}`}>
                    <span className={`material-symbols-outlined text-2xl ${level.unlocked ? "text-[#ff6a00]" : "text-on-surface-variant"}`} style={{ fontVariationSettings: "'FILL' 1" }}>{level.icon}</span>
                  </div>
                </div>
                <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-10" : "md:pl-10"}`}>
                  <div className={`rounded-2xl border bg-white/70 p-6 backdrop-blur-xl transition-all ${level.unlocked ? "border-[#ff6a00]/20 shadow-lg shadow-[#ff6a00]/5" : "border-white/30 opacity-60 shadow-sm"}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff6a00]/10 text-xs font-bold text-[#ff6a00]">{level.id}</span>
                      <span className="text-xs font-label font-semibold uppercase tracking-wider text-[#ff6a00]">{level.unlocked ? "Level Unlocked" : "Locked"}</span>
                    </div>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-on-surface">{level.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-on-surface-variant font-body">{level.description}</p>
                    {level.unlocked && level.progress !== undefined && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-variant/50">
                          <div className="tl-progress h-full rounded-full bg-[#ff6a00]" />
                        </div>
                        <span className="text-xs font-semibold text-[#ff6a00]">{level.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
