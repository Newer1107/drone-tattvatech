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
      <div className="sticky top-0 flex h-screen overflow-hidden bg-[#f3f3ef]">
        {/* Subtle dot pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle, #000 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
        {/* Left: Drone */}
        <div className="relative z-10 flex w-1/2 items-center justify-center">
          <div className="h-full w-full max-w-lg"><ChapterDrone mode={data.layout} active={true} /></div>
        </div>
        {/* Right: Content */}
        <div className="relative z-10 flex w-1/2 items-center px-10 lg:px-14">
          <div className="w-full max-w-md">
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
            <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} &middot; {data.chapterTitle}</p>
            <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-black/90"
              style={{ fontSize: "clamp(32px, 4.5vw, 72px)" }}>{data.chapterTitle}</h2>
            <p className="mt-4 font-body leading-relaxed text-black/40"
              style={{ fontSize: "clamp(16px, 1.3vw, 20px)" }}>{data.subtitle}</p>
            <div className="mt-8 space-y-4">
              {data.features.map((f, i) => (
                <div key={f.title} ref={(el) => { cardRefs.current[i] = el; }}
                  className="rounded-xl border border-black/[0.06] bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ opacity: 0 }}>
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]/80">{f.title}</span>
                  <p className="mt-1 font-body text-sm leading-relaxed text-black/45">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Large section number */}
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

  return (
    <section ref={sectionRef} className="sticky top-0" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen overflow-hidden bg-[#f7f7f5]">
        {/* Subtle dot pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #000 0.5px, transparent 0.5px)", backgroundSize: "32px 32px" }} />
        {/* Left: Content */}
        <div className="relative z-10 flex w-1/2 items-center px-10 lg:px-14">
          <div className="w-full max-w-md">
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">{data.badge}</span>
            <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-black/30">{data.chapterNum} &middot; {data.chapterTitle}</p>
            <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-tight text-black/90"
              style={{ fontSize: "clamp(32px, 4.5vw, 72px)" }}>{data.chapterTitle}</h2>
            <p className="mt-4 font-body leading-relaxed text-black/40"
              style={{ fontSize: "clamp(16px, 1.3vw, 20px)" }}>{data.subtitle}</p>
            <div className="mt-8 space-y-4">
              {data.features.map((f, i) => (
                <div key={f.title} ref={(el) => { cardRefs.current[i] = el; }}
                  className="rounded-xl border border-black/[0.05] bg-white/70 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ opacity: 0 }}>
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]/80">{f.title}</span>
                  <p className="mt-1 font-body text-sm leading-relaxed text-black/45">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Drone */}
        <div className="relative z-10 flex w-1/2 items-center justify-center">
          <div className="h-full w-full max-w-lg"><ChapterDrone mode={data.layout} active={true} /></div>
        </div>
        {/* Large section number */}
        <div className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-black/[0.015]"
          style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}>{data.chapterNum}</div>
      </div>
    </section>
  );
}
