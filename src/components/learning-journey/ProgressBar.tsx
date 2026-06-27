"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ────────────────────────────────────────────────────────────────── */
/*  Premium top-centre progress indicator                             */
/*  01 —— 02 —— 03 —— 04                                              */
/*  Tracks which chapter section is currently in view                 */
/* ────────────────────────────────────────────────────────────────── */

export function ProgressBar({ sectionRefs }: { sectionRefs: React.RefObject<(HTMLElement | null)[]> }) {
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refs = sectionRefs.current;
    if (!refs) return;

    const update = (active: number) => {
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        if (i < active) {
          dot.style.background = "#ff6a00";
          dot.style.transform = "scale(1)";
          dot.style.opacity = "1";
        } else if (i === active) {
          dot.style.background = "#ff6a00";
          dot.style.transform = "scale(1.25)";
          dot.style.opacity = "1";
        } else {
          dot.style.background = "rgba(0,0,0,0.15)";
          dot.style.transform = "scale(1)";
          dot.style.opacity = "1";
        }
      });
    };

    const triggers = refs.map((section, i) => {
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

    return () => triggers.forEach((t) => t?.kill());
  }, [sectionRefs]);

  return (
    <div className="fixed left-1/2 top-5 z-50 hidden -translate-x-1/2 items-center gap-2 md:flex">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            ref={(el) => { dotRefs.current[i] = el; }}
            className="block rounded-full transition-all duration-500"
            style={{ width: 6, height: 6, background: "rgba(0,0,0,0.15)" }}
          />
          {i < 3 && (
            <div ref={lineRef} className="h-px w-8 bg-black/[0.08]" />
          )}
        </div>
      ))}
    </div>
  );
}
