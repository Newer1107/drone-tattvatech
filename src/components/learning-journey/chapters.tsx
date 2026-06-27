"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ChapterData } from "./data";
import { ChapterDrone } from "./ChapterDrone";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────── */
/*  Chapters use CSS position:sticky for pinning (no flicker).        */
/*  Outer sticky provides scroll height; inner sticky keeps content   */
/*  in view.  ScrollTrigger scrub (NO pin) drives card reveals.      */
/* ────────────────────────────────────────────────────────────────── */

interface ChProps {
  data: ChapterData;
}

function useStickyReveal(
  sectionRef: React.RefObject<HTMLElement | null>,
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!section || cards.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    cards.forEach((card, i) => {
      tl.to(card, { opacity: 1, y: 0, duration: 0.2 }, 0.15 + i * 0.22);
    });

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [sectionRef, cardRefs]);
}

/* ────────────────────────────────────────────────────── Chapter 02 */
export function ChapterWorkshop({ data }: ChProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  useStickyReveal(sectionRef, cardRefs);

  return (
    <section ref={sectionRef} className="sticky top-0" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-[#fafaf8]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #000 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
        <div className="flex flex-1 items-center justify-center px-20 pb-16 pt-20">
          <div className="h-full w-full max-w-3xl"><ChapterDrone mode={data.layout} active={true} /></div>
        </div>
        <div className="z-20 px-6 pb-10 md:px-10 lg:px-14">
          <div className="mx-auto max-w-5xl">
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
            <p className="mt-1 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} &middot; {data.chapterTitle}</p>
            <h2 className="font-display font-bold leading-[1.05] tracking-tight text-black/90"
              style={{ fontSize: "clamp(28px, 4vw, 60px)" }}>{data.chapterTitle}</h2>
            <div className="mt-3 flex gap-3">
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
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────── Chapter 03 */
export function ChapterLab({ data }: ChProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  useStickyReveal(sectionRef, cardRefs);

  return (
    <section ref={sectionRef} className="sticky top-0" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen overflow-hidden bg-[#0d0d0d] text-white">
        <div className="flex w-1/2 items-center justify-center">
          <div className="h-full w-full"><ChapterDrone mode={data.layout} active={true} /></div>
        </div>
        <div className="flex w-1/2 items-center px-10 lg:px-14">
          <div className="w-full max-w-md">
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
            <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-white/30">{data.chapterNum} &middot; {data.chapterTitle}</p>
            <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-white/90"
              style={{ fontSize: "clamp(32px, 4.5vw, 72px)" }}>{data.chapterTitle}</h2>
            <p className="mt-4 font-body leading-relaxed text-white/40"
              style={{ fontSize: "clamp(16px, 1.3vw, 20px)" }}>{data.subtitle}</p>
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
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────── Chapter 04 */
export function ChapterMission({ data }: ChProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  useStickyReveal(sectionRef, cardRefs);

  const cardPositions: React.CSSProperties[] = [
    { top: "15%", left: "8%" }, { top: "15%", right: "8%" },
    { bottom: "18%", left: "12%" }, { bottom: "18%", right: "12%" },
  ];

  return (
    <section ref={sectionRef} className="sticky top-0" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[#fafaf8] opacity-50" />
        <div className="flex flex-1 items-center justify-center px-28 py-20">
          <div className="h-full w-full max-w-lg"><ChapterDrone mode={data.layout} active={true} /></div>
        </div>
        <div className="absolute left-6 top-8 z-20 md:left-10 lg:left-14">
          <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
          <p className="mt-2 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} &middot; {data.chapterTitle}</p>
          <h2 className="mt-1 font-display font-bold leading-[1.05] tracking-tight text-black/90"
            style={{ fontSize: "clamp(28px, 3.5vw, 60px)" }}>{data.chapterTitle}</h2>
          <p className="mt-2 max-w-xs font-body leading-relaxed text-black/50"
            style={{ fontSize: "clamp(14px, 1.1vw, 17px)" }}>{data.subtitle}</p>
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
      </div>
    </section>
  );
}
