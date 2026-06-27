"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "./data";
import { ChapterWorkshop, ChapterLab, ChapterMission } from "./chapters";
import { Chapter01Video } from "./Chapter01Video";
import { ProgressBar } from "./ProgressBar";

gsap.registerPlugin(ScrollTrigger);

/* total scroll = ch1(700) + ch2(80) + ch3(80) + ch4(80) */
const SCROLL_TOTAL = 940;
const CH_BOUNDS = [700 / SCROLL_TOTAL, (700 + 80) / SCROLL_TOTAL, (700 + 80 + 80) / SCROLL_TOTAL, 1];

const CHAPTER_COMPONENTS = [Chapter01Video, ChapterWorkshop, ChapterLab, ChapterMission] as const;

export function LearningJourney() {
  const wrapperRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const wrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chTLs = useRef<(gsap.core.Timeline | null)[]>([null, null, null, null]);

  const register = useCallback((index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  }, []);

  const registerWrap = useCallback((index: number) => (el: HTMLDivElement | null) => {
    wrapsRef.current[index] = el;
  }, []);

  const registerTL = useCallback((index: number) => (tl: gsap.core.Timeline | null) => {
    chTLs.current[index] = tl;
  }, []);

  /* ── ONE ScrollTrigger to rule them all ── */
  const stCreated = useRef(false);
  const cbRef = useCallback((el: HTMLElement | null) => {
    wrapperRef.current = el;
    if (!el || stCreated.current) return;
    stCreated.current = true;

    ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: `+=${SCROLL_TOTAL}vh`,
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;

        /* which chapter? */
        let activeIdx = 0;
        let subP = p;
        for (let i = 0; i < CH_BOUNDS.length; i++) {
          if (p < CH_BOUNDS[i]) {
            activeIdx = i;
            const prev = i === 0 ? 0 : CH_BOUNDS[i - 1];
            subP = (p - prev) / (CH_BOUNDS[i] - prev);
            break;
          }
        }

        /* crossfade chapter wraps */
        wrapsRef.current.forEach((w, i) => {
          if (!w) return;
          w.style.opacity = i === activeIdx ? "1" : "0";
          w.style.pointerEvents = i === activeIdx ? "auto" : "none";
        });

        /* drive active chapter's internal timeline */
        const tl = chTLs.current[activeIdx];
        if (tl) tl.progress(Math.max(0, Math.min(1, subP)));
      },
    });
  }, []);

  return (
    <section ref={cbRef} className="relative overflow-hidden bg-white" style={{ height: "100vh" }}>
      <ProgressBar sectionRefs={sectionsRef as React.RefObject<(HTMLElement | null)[]>} />

      {CHAPTERS.map((chapter, i) => {
        const Comp = CHAPTER_COMPONENTS[i];
        return (
          <div
            key={chapter.id}
            ref={registerWrap(i)}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}
          >
            <Comp
              data={chapter}
              onRegister={register(i)}
              onRegisterTL={(tl) => registerTL(i)(tl)}
            />
          </div>
        );
      })}
    </section>
  );
}
