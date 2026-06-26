"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LABELS = [
  { text: "Brushless Motor", left: "16%", top: "23%" },
  { text: "Flight Controller", left: "72%", top: "25%" },
  { text: "Camera Module", left: "18%", top: "42%" },
  { text: "LiPo Battery", left: "68%", top: "47%" },
  { text: "Landing Gear", left: "22%", top: "65%" },
  { text: "Drone Frame", left: "38%", top: "55%" },
  { text: "Propeller", left: "74%", top: "68%" },
];

export function DroneAssembly() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const labelsWrap = useRef<HTMLDivElement>(null);
  const endWrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const v = video.current;
      const lbls = labelsWrap.current?.children;
      const endEl = endWrap.current;
      if (!v || !lbls || !endEl) return;

      v.load();
      v.currentTime = 0;
      gsap.set(endEl, { opacity: 0 });

      ScrollTrigger.create({
        id: "assembly-pin",
        trigger: section.current,
        start: "top top",
        end: "+=3800",
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (v.readyState < 2) return;
          v.currentTime = self.progress * (v.duration || 10);
        },
      });

      ScrollTrigger.create({
        id: "assembly-end",
        trigger: section.current,
        start: "top top",
        end: "+=3800",
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.set(endEl, { opacity: self.progress > 0.92 ? (self.progress - 0.92) / 0.08 : 0 });
        },
      });

      gsap.set(lbls, { opacity: 0, y: 12 });

      const labelTl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top center",
          once: true,
          onEnter: () => {
            labelTl.to(lbls, {
              opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
              onComplete: () => {
                ScrollTrigger.create({
                  trigger: section.current,
                  start: "top top+=1",
                  once: true,
                  onEnter: () => gsap.to(lbls, { opacity: 0, y: -8, duration: 0.3, ease: "power2.out", overwrite: "auto" }),
                });
              },
            });
          },
        },
      });

      return () => {
        ScrollTrigger.getById("assembly-pin")?.kill();
        ScrollTrigger.getById("assembly-end")?.kill();
        labelTl.kill();
      };
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative min-h-screen w-full bg-surface overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[70vw] max-w-5xl">
          <video ref={video} preload="auto" muted playsInline className="w-full h-auto" style={{ pointerEvents: "none" }}>
            <source src="/videos/create_a_video_where_start_fro-cleaned.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div ref={labelsWrap} className="pointer-events-none absolute inset-0">
        {LABELS.map((l) => (
          <div key={l.text} className="absolute flex items-center gap-3" style={{ left: l.left, top: l.top }}>
            <span className="font-label text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface/80 whitespace-nowrap">
              {l.text}
            </span>
            <svg width="28" height="2" className="overflow-visible">
              <line x1="0" y1="1" x2="26" y2="1" stroke="currentColor" strokeWidth="0.5" className="text-on-surface/30" />
              <circle cx="27" cy="1" r="1.5" fill="currentColor" className="text-on-surface/50" />
            </svg>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-12 left-10 max-w-xs select-none">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface/40">LEO Educational Drone</p>
        <p className="mt-2 text-sm leading-relaxed text-on-surface/60 font-body">
          Every student begins with a complete drone kit. Understand every component before bringing them together into a fully functional aircraft.
        </p>
        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-on-surface/30 font-label">Scroll to assemble</p>
      </div>

      <div ref={endWrap} className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
        <div className="text-center max-w-md">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface/40">Built by Students.</p>
          <p className="mt-3 text-sm leading-relaxed text-on-surface/60 font-body">
            The complete drone assembled during this experience is the same platform students build throughout the Level 2 curriculum.
          </p>
          <a href="#academy" className="pointer-events-auto mt-5 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[#ff6a00] transition-opacity hover:opacity-70">
            Explore Level 2
          </a>
        </div>
      </div>
    </section>
  );
}
