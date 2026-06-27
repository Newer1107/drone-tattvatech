"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ────────────────────────────────────────────────────────────────── */
/*  Top-centre progress indicator — only visible while the Learning   */
/*  Journey chapters are in the viewport.                              */
/* ────────────────────────────────────────────────────────────────── */

export function ProgressBar({ sectionRefs }: { sectionRefs: React.RefObject<(HTMLElement | null)[]> }) {
  const barRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const refs = sectionRefs.current;
    const bar = barRef.current;
    if (!refs || !bar) return;

    const update = (active: number) => {
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.background = i < active ? "#ff6a00" : i === active ? "#ff6a00" : "rgba(0,0,0,0.15)";
        dot.style.transform = i === active ? "scale(1.25)" : "scale(1)";
      });
    };

    /* ── Show/hide bar based on first chapter visibility ── */
    let firstSection: HTMLElement | null = null;
    for (const s of refs) {
      if (s) { firstSection = s; break; }
    }

    let lastSection: HTMLElement | null = null;
    for (let i = refs.length - 1; i >= 0; i--) {
      if (refs[i]) { lastSection = refs[i]; break; }
    }

    const showTriggers: ScrollTrigger[] = [];

    if (firstSection) {
      showTriggers.push(ScrollTrigger.create({
        trigger: firstSection,
        start: "top top",
        onEnter: () => { bar.style.opacity = "1"; bar.style.pointerEvents = "auto"; },
        onLeave: () => { bar.style.opacity = "0"; bar.style.pointerEvents = "none"; },
        onEnterBack: () => { bar.style.opacity = "1"; bar.style.pointerEvents = "auto"; },
      }));
    }

    if (lastSection) {
      showTriggers.push(ScrollTrigger.create({
        trigger: lastSection,
        start: "bottom bottom",
        onLeave: () => { bar.style.opacity = "0"; bar.style.pointerEvents = "none"; },
        onEnterBack: () => { bar.style.opacity = "1"; bar.style.pointerEvents = "auto"; },
      }));
    }

    /* ── Chapter tracking ── */
    const trackTriggers = refs.map((section, i) => {
      if (!section) return null;
      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => update(i),
        onEnterBack: () => update(i),
      });
    });

    update(0);

    return () => {
      [...showTriggers, ...trackTriggers].forEach((t) => t?.kill());
    };
  }, [sectionRefs]);

  return (
    <div
      ref={barRef}
      className="fixed left-1/2 top-5 z-50 hidden -translate-x-1/2 items-center gap-2 transition-opacity duration-500 md:flex"
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            ref={(el) => { dotRefs.current[i] = el; }}
            className="block rounded-full transition-all duration-500"
            style={{ width: 6, height: 6, background: "rgba(0,0,0,0.15)" }}
          />
          {i < 3 && <span className="h-px w-8 bg-black/[0.08]" />}
        </div>
      ))}
    </div>
  );
}
