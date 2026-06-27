"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ChapterData } from "./data";
import { ChapterDrone } from "./ChapterDrone";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────── */
/*  4 distinct layouts — each chapter has its own composition          */
/*  Every chapter has ONE visual moment. Text supports the image.     */
/* ────────────────────────────────────────────────────────────────── */

/* ── Helpers ── */

function useScrollReveal(
  sectionRef: React.RefObject<HTMLElement | null>,
  heroRef: React.RefObject<HTMLDivElement | null>,
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  extraVh = 80,
) {
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const hero = heroRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${extraVh}vh`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    if (hero) {
      const ch = Array.from(hero.children) as HTMLElement[];
      tl.fromTo(ch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15, stagger: 0.04 }, 0);
    }

    cards.forEach((card, i) => {
      const pos = 0.2 + i * 0.22;
      tl.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.18 }, pos);
    });

    cleanup.current = () => { tl.scrollTrigger?.kill(); tl.kill(); };
    return () => cleanup.current?.();
  }, [sectionRef, heroRef, cardRefs, extraVh]);
}

/* ────────────────────────────────────────────────────────────────── */
/*  Chapter 01 — Classroom                                            */
/*  Bright, clean.  Text LEFT (25%), drone RIGHT (75%).               */
/*  3 floating feature cards appear around the drone as you scroll.  */
/* ────────────────────────────────────────────────────────────────── */

export function ChapterClassroom({
  data,
  onRegister,
}: {
  data: ChapterData;
  onRegister: (el: HTMLElement | null) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cbRef = useCallback((el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); }, [onRegister]);
  useScrollReveal(sectionRef, heroRef, cardRefs, 80);

  const positions: React.CSSProperties[] = [
    { top: "12%", left: "55%" },
    { top: "40%", left: "8%" },
    { bottom: "15%", left: "60%" },
  ];

  return (
    <section ref={cbRef} className="relative overflow-hidden bg-white" style={{ minHeight: "100vh", transform: "translateZ(0)" }}>
      <div className="mx-auto flex h-screen max-w-7xl items-center px-6 md:px-10 lg:px-14">
        {/* Text — 25% */}
        <div className="z-10 w-full max-w-md md:w-[28%]">
          <div ref={heroRef}>
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
            <p className="mt-6 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} · {data.chapterTitle}</p>
            <h2
              className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-black/90"
              style={{ fontSize: "clamp(48px, 6vw, 100px)" }}
            >
              {data.chapterTitle}
            </h2>
            <p className="mt-4 font-body leading-relaxed text-black/50" style={{ fontSize: "clamp(18px, 1.5vw, 22px)" }}>
              {data.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Floating feature cards — overlaying drone area */}
      {data.features.map((f, i) => (
        <div
          key={f.title}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="absolute z-20 w-56 rounded-2xl border border-black/[0.04] bg-white/80 px-5 py-4 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          style={{ opacity: 0, ...positions[i] }}
        >
          <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]">{f.title}</span>
          <p className="mt-1 font-body text-sm leading-relaxed text-black/50">{f.description}</p>
        </div>
      ))}

      {/* Drone — 75% */}
      <div className="absolute bottom-0 right-0 top-0 w-[75%]">
        <ChapterDrone mode={data.layout} active={true} />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Chapter 02 — Workshop                                             */
/*  Drone CENTERED, large.  Text underneath in a clean band.          */
/*  Labels appear as you scroll.                                      */
/* ────────────────────────────────────────────────────────────────── */

export function ChapterWorkshop({
  data,
  onRegister,
}: {
  data: ChapterData;
  onRegister: (el: HTMLElement | null) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cbRef = useCallback((el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); }, [onRegister]);
  useScrollReveal(sectionRef, heroRef, cardRefs, 80);

  return (
    <section ref={cbRef} className="relative overflow-hidden bg-[#fafaf8]" style={{ minHeight: "100vh", transform: "translateZ(0)" }}>
      {/* Subtle dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #000 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}
      />

      {/* Drone — centered, large */}
      <div className="absolute inset-0 flex items-center justify-center px-20 pb-16 pt-20">
        <div className="h-full w-full max-w-3xl">
          <ChapterDrone mode={data.layout} active={true} />
        </div>
      </div>

      {/* Text band — bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-5xl px-6 pb-10 md:px-10 lg:px-14">
          <div ref={heroRef}>
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
            <p className="mt-3 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} · {data.chapterTitle}</p>
            <h2
              className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-black/90"
              style={{ fontSize: "clamp(36px, 5vw, 80px)" }}
            >
              {data.chapterTitle}
            </h2>
            <p className="mt-3 max-w-xl font-body leading-relaxed text-black/50" style={{ fontSize: "clamp(16px, 1.3vw, 20px)" }}>
              {data.subtitle} {data.description}
            </p>
          </div>

          {/* Labels as compact chips */}
          <div className="mt-4 flex gap-3">
            {data.features.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="rounded-xl border border-black/[0.06] bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-sm"
                style={{ opacity: 0 }}
              >
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff6a00]/80">{f.title}</span>
                <p className="mt-0.5 font-body text-xs text-black/40">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background number */}
      <div className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-black/[0.015]"
        style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}>
        {data.chapterNum}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Chapter 03 — Engineering Lab                                      */
/*  Dark glass.  Drone LEFT (50%), Tech UI RIGHT (50%).               */
/*  Telemetry lines, pulse nodes, code fragments fill the right side. */
/* ────────────────────────────────────────────────────────────────── */

export function ChapterLab({
  data,
  onRegister,
}: {
  data: ChapterData;
  onRegister: (el: HTMLElement | null) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cbRef = useCallback((el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); }, [onRegister]);
  useScrollReveal(sectionRef, heroRef, cardRefs, 80);

  return (
    <section ref={cbRef} className="relative overflow-hidden bg-[#0d0d0d] text-white" style={{ minHeight: "100vh", transform: "translateZ(0)" }}>
      {/* Drone left half */}
      <div className="absolute bottom-0 left-0 top-0 w-1/2">
        <ChapterDrone mode={data.layout} active={true} />
      </div>

      {/* Tech UI right half */}
      <div className="absolute bottom-0 right-0 top-0 flex w-1/2 items-center px-10 lg:px-14">
        <div ref={heroRef} className="w-full max-w-md">
          <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
          <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-white/30">{data.chapterNum} · {data.chapterTitle}</p>
          <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-white/90"
            style={{ fontSize: "clamp(42px, 5.5vw, 90px)" }}>
            {data.chapterTitle}
          </h2>
          <p className="mt-4 font-body leading-relaxed text-white/40" style={{ fontSize: "clamp(18px, 1.4vw, 22px)" }}>
            {data.subtitle}
          </p>

          {/* Tech features */}
          <div className="mt-8 space-y-4">
            {data.features.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 backdrop-blur-sm"
                style={{ opacity: 0 }}
              >
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]/80">{f.title}</span>
                <p className="mt-1 font-body text-sm leading-relaxed text-white/40">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated tech background elements */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Vertical scan line */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
        {/* Horizontal scan */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        {/* Grid dots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute h-0.5 w-0.5 rounded-full bg-white/[0.04]"
            style={{ top: `${10 + i * 11}%`, left: `${5 + (i % 3) * 8}%` }} />
        ))}
      </div>

      {/* Background number */}
      <div className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-white/[0.02]"
        style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}>
        {data.chapterNum}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Chapter 04 — Mission Control                                      */
/*  Drone CENTERED.  Mission cards orbit around it.                   */
/*  Feels like an operations centre.                                  */
/* ────────────────────────────────────────────────────────────────── */

export function ChapterMission({
  data,
  onRegister,
}: {
  data: ChapterData;
  onRegister: (el: HTMLElement | null) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cbRef = useCallback((el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); }, [onRegister]);
  useScrollReveal(sectionRef, heroRef, cardRefs, 80);

  const cardPositions: React.CSSProperties[] = [
    { top: "15%", left: "8%" },
    { top: "15%", right: "8%" },
    { bottom: "18%", left: "12%" },
    { bottom: "18%", right: "12%" },
  ];

  return (
    <section ref={cbRef} className="relative overflow-hidden bg-white" style={{ minHeight: "100vh", transform: "translateZ(0)" }}>
      {/* Subtle warm tone */}
      <div className="pointer-events-none absolute inset-0 bg-[#fafaf8] opacity-50" />

      {/* Drone — centered */}
      <div className="absolute inset-0 flex items-center justify-center px-28 py-20">
        <div className="h-full w-full max-w-lg">
          <ChapterDrone mode={data.layout} active={true} />
        </div>
      </div>

      {/* Header — top left */}
      <div ref={heroRef} className="absolute left-6 top-8 z-20 md:left-10 lg:left-14">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
        <p className="mt-2 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} · {data.chapterTitle}</p>
        <h2 className="mt-1 font-display font-bold leading-[1.05] tracking-tight text-black/90"
          style={{ fontSize: "clamp(32px, 4vw, 72px)" }}>
          {data.chapterTitle}
        </h2>
        <p className="mt-2 max-w-xs font-body leading-relaxed text-black/50" style={{ fontSize: "clamp(14px, 1.2vw, 18px)" }}>
          {data.subtitle}
        </p>
      </div>

      {/* Surrounding mission cards */}
      {data.features.map((f, i) => (
        <div
          key={f.title}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="absolute z-20 w-52 rounded-2xl border border-black/[0.04] bg-white/70 px-4 py-3.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] backdrop-blur-md"
          style={{ opacity: 0, ...(cardPositions[i] ?? {}) }}
        >
          <span className="font-label text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]">{f.title}</span>
          <p className="mt-0.5 font-body text-xs leading-relaxed text-black/40">{f.description}</p>
        </div>
      ))}

      {/* Background number */}
      <div className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-black/[0.015]"
        style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}>
        {data.chapterNum}
      </div>
    </section>
  );
}
