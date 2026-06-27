"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import type { ChapterData } from "./data";
import { ChapterDrone } from "./ChapterDrone";

/* ────────────────────────────────────────────────────────────────── */
/*  4 distinct layouts — NO internal ScrollTriggers.                  */
/*  Each exposes a timeline that the parent drives via progress().    */
/* ────────────────────────────────────────────────────────────────── */

interface ChProps {
  data: ChapterData;
  onRegister: (el: HTMLElement | null) => void;
  onRegisterTL: (tl: gsap.core.Timeline | null) => void;
}

/* ────────────────────────────────────────────────────── Chapter 02 */
export function ChapterWorkshop({ data, onRegister, onRegisterTL }: ChProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = useCallback((el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); }, [onRegister]);

  useEffect(() => {
    const hero = heroRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const tl = gsap.timeline({ paused: true });

    if (hero) {
      const ch = Array.from(hero.children) as HTMLElement[];
      tl.fromTo(ch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15, stagger: 0.04 }, 0);
    }
    cards.forEach((card, i) => {
      const pos = 0.2 + i * 0.22;
      tl.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.18 }, pos);
    });

    onRegisterTL(tl);
    return () => { tl.kill(); onRegisterTL(null); };
  }, [onRegisterTL]);

  return (
    <section ref={setRef} className="relative overflow-hidden bg-[#fafaf8]" style={{ minHeight: "100vh", transform: "translateZ(0)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #000 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-20 pb-16 pt-20">
        <div className="h-full w-full max-w-3xl"><ChapterDrone mode={data.layout} active={true} /></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-5xl px-6 pb-10 md:px-10 lg:px-14">
          <div ref={heroRef}>
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
            <p className="mt-3 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} · {data.chapterTitle}</p>
            <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-black/90"
              style={{ fontSize: "clamp(36px, 5vw, 80px)" }}>{data.chapterTitle}</h2>
            <p className="mt-3 max-w-xl font-body leading-relaxed text-black/50"
              style={{ fontSize: "clamp(16px, 1.3vw, 20px)" }}>{data.subtitle} {data.description}</p>
          </div>
          <div className="mt-4 flex gap-3">
            {data.features.map((f, i) => (
              <div key={f.title} ref={(el) => { cardRefs.current[i] = el; }}
                className="rounded-xl border border-black/[0.06] bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-sm" style={{ opacity: 0 }}>
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff6a00]/80">{f.title}</span>
                <p className="mt-0.5 font-body text-xs text-black/40">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-black/[0.015]"
        style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}>{data.chapterNum}</div>
    </section>
  );
}

/* ────────────────────────────────────────────────────── Chapter 03 */
export function ChapterLab({ data, onRegister, onRegisterTL }: ChProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = useCallback((el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); }, [onRegister]);

  useEffect(() => {
    const hero = heroRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const tl = gsap.timeline({ paused: true });

    if (hero) {
      const ch = Array.from(hero.children) as HTMLElement[];
      tl.fromTo(ch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15, stagger: 0.04 }, 0);
    }
    cards.forEach((card, i) => {
      const pos = 0.2 + i * 0.22;
      tl.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.18 }, pos);
    });

    onRegisterTL(tl);
    return () => { tl.kill(); onRegisterTL(null); };
  }, [onRegisterTL]);

  return (
    <section ref={setRef} className="relative overflow-hidden bg-[#0d0d0d] text-white" style={{ minHeight: "100vh", transform: "translateZ(0)" }}>
      <div className="absolute bottom-0 left-0 top-0 w-1/2"><ChapterDrone mode={data.layout} active={true} /></div>
      <div className="absolute bottom-0 right-0 top-0 flex w-1/2 items-center px-10 lg:px-14">
        <div ref={heroRef} className="w-full max-w-md">
          <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
          <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-white/30">{data.chapterNum} · {data.chapterTitle}</p>
          <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-white/90"
            style={{ fontSize: "clamp(42px, 5.5vw, 90px)" }}>{data.chapterTitle}</h2>
          <p className="mt-4 font-body leading-relaxed text-white/40"
            style={{ fontSize: "clamp(18px, 1.4vw, 22px)" }}>{data.subtitle}</p>
          <div className="mt-8 space-y-4">
            {data.features.map((f, i) => (
              <div key={f.title} ref={(el) => { cardRefs.current[i] = el; }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 backdrop-blur-sm" style={{ opacity: 0 }}>
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]/80">{f.title}</span>
                <p className="mt-1 font-body text-sm leading-relaxed text-white/40">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-white/[0.02]"
        style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}>{data.chapterNum}</div>
    </section>
  );
}

/* ────────────────────────────────────────────────────── Chapter 04 */
export function ChapterMission({ data, onRegister, onRegisterTL }: ChProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = useCallback((el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); }, [onRegister]);

  useEffect(() => {
    const hero = heroRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const tl = gsap.timeline({ paused: true });

    if (hero) {
      const ch = Array.from(hero.children) as HTMLElement[];
      tl.fromTo(ch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15, stagger: 0.04 }, 0);
    }
    cards.forEach((card, i) => {
      const pos = 0.2 + i * 0.22;
      tl.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.18 }, pos);
    });

    onRegisterTL(tl);
    return () => { tl.kill(); onRegisterTL(null); };
  }, [onRegisterTL]);

  const cardPositions: React.CSSProperties[] = [
    { top: "15%", left: "8%" }, { top: "15%", right: "8%" },
    { bottom: "18%", left: "12%" }, { bottom: "18%", right: "12%" },
  ];

  return (
    <section ref={setRef} className="relative overflow-hidden bg-white" style={{ minHeight: "100vh", transform: "translateZ(0)" }}>
      <div className="pointer-events-none absolute inset-0 bg-[#fafaf8] opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center px-28 py-20">
        <div className="h-full w-full max-w-lg"><ChapterDrone mode={data.layout} active={true} /></div>
      </div>
      <div ref={heroRef} className="absolute left-6 top-8 z-20 md:left-10 lg:left-14">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
        <p className="mt-2 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} · {data.chapterTitle}</p>
        <h2 className="mt-1 font-display font-bold leading-[1.05] tracking-tight text-black/90"
          style={{ fontSize: "clamp(32px, 4vw, 72px)" }}>{data.chapterTitle}</h2>
        <p className="mt-2 max-w-xs font-body leading-relaxed text-black/50"
          style={{ fontSize: "clamp(14px, 1.2vw, 18px)" }}>{data.subtitle}</p>
      </div>
      {data.features.map((f, i) => (
        <div key={f.title} ref={(el) => { cardRefs.current[i] = el; }}
          className="absolute z-20 w-52 rounded-2xl border border-black/[0.04] bg-white/70 px-4 py-3.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] backdrop-blur-md"
          style={{ opacity: 0, ...(cardPositions[i] ?? {}) }}>
          <span className="font-label text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]">{f.title}</span>
          <p className="mt-0.5 font-body text-xs leading-relaxed text-black/40">{f.description}</p>
        </div>
      ))}
      <div className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-black/[0.015]"
        style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}>{data.chapterNum}</div>
    </section>
  );
}
