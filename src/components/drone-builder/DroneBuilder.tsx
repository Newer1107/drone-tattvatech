"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DRONE_COMPONENTS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const iconSymbol: Record<string, string> = {
  grid_view: "\u25A3", speed: "\u27F2", bolt: "\u21AF", battery_std: "\u229F",
  videocam: "\u25CE", satellite_alt: "\u2316", propeller: "\u2726", check_circle: "\u25CF",
};

const features = [
  { title: "Precision Assembly", desc: "Master micro-soldering and structural integrity." },
  { title: "Power Systems", desc: "Calculate thrust-to-weight ratios and battery efficiency." },
  { title: "Flight Dynamics", desc: "Understand PID tuning and aerodynamic stability." },
];

export function DroneBuilder() {
  const section = useRef<HTMLElement>(null);
  const cardList = useRef<HTMLDivElement>(null);
  const rightCol = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const hdr = section.current?.querySelector(".db-header");
    if (hdr) gsap.fromTo(hdr, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: hdr, start: "top 85%", toggleActions: "play none none none" } });

    const cards = cardList.current?.querySelectorAll(".db-card");
    if (cards?.length) gsap.fromTo(cards, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: cardList.current, start: "top 82%", toggleActions: "play none none none" } });

    const feats = rightCol.current?.querySelectorAll(".db-feat");
    if (feats?.length) gsap.fromTo(feats, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, delay: 0.3, ease: "power3.out", scrollTrigger: { trigger: rightCol.current, start: "top 82%", toggleActions: "play none none none" } });

    const dots = rightCol.current?.querySelectorAll(".db-dot");
    if (dots?.length) gsap.fromTo(dots, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: rightCol.current, start: "top 82%", toggleActions: "play none none none" } });
  }, { scope: section });

  return (
    <section ref={section} className="relative overflow-hidden bg-surface-container-lowest px-4 py-24 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,106,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,0.4) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="db-header mb-16 text-center">
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Hardware Mastery</p>
          <h2 className="font-heading text-3xl font-semibold text-on-surface sm:text-4xl lg:text-5xl">Understand Every <span className="text-[#ff6a00]">Component.</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant font-body">Build drones from the ground up. Each component plays a critical role in flight performance, stability, and mission capability.</p>
        </div>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div ref={cardList} className="space-y-3">
            {DRONE_COMPONENTS.map((comp, i) => (
              <div key={comp.id} className="db-card group flex items-center gap-4 rounded-xl border border-white/30 bg-white/60 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-[#ff6a00]/30 hover:shadow-md hover:shadow-[#ff6a00]/5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6a00]/10 text-base text-[#ff6a00]">{iconSymbol[comp.icon] || "\u25C7"}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface transition-colors group-hover:text-[#ff6a00]">{comp.name}</p>
                  <p className="truncate text-xs text-on-surface-variant/60">{comp.description}</p>
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff6a00]/10 text-xs font-bold text-[#ff6a00]">{i + 1}</span>
              </div>
            ))}
          </div>
          <div ref={rightCol} className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="db-feat">
              <p className="text-lg font-heading font-semibold text-on-surface">Why build your own?</p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant font-body">Every drone we fly is assembled by hand. Understanding each component means you can diagnose, tune, and optimize any build.</p>
            </div>
            {features.map((f) => (
              <div key={f.title} className="db-feat flex gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6a00]/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff6a00]"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface font-heading">{f.title}</p>
                  <p className="mt-0.5 text-sm text-on-surface-variant/80">{f.desc}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-4">
              {DRONE_COMPONENTS.map((_, i) => (<span key={i} className="db-dot h-1.5 rounded-full bg-[#ff6a00]/20 transition-all even:w-5 odd:w-1.5" />))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
