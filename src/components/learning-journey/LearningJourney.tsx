"use client";

import { useRef, useCallback } from "react";
import { CHAPTERS } from "./data";
import { Chapter } from "./Chapter";
import { ProgressBar } from "./ProgressBar";

/* ────────────────────────────────────────────────────────────────── */
/*  Learning Journey — 4 cinematic chapters, each ~200vh total        */
/*  White background, massive typography, progressive reveals.       */
/*  Top-centre progress bar tracks which chapter is active.          */
/* ────────────────────────────────────────────────────────────────── */

export function LearningJourney() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const activeDroneMap = useRef<Record<number, boolean>>({});

  const register = useCallback((index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  }, []);

  const handleActiveChange = useCallback((_index: number, _active: boolean) => {
    /* Track drone active state per chapter if needed */
  }, []);

  return (
    <section className="bg-white">
      {/* Fixed progress indicator - labels removed, just dots + lines */}
      <ProgressBar sectionRefs={sectionsRef as React.RefObject<(HTMLElement | null)[]>} />

      {CHAPTERS.map((chapter, i) => (
        <Chapter
          key={chapter.id}
          data={chapter}
          onRegister={register(i)}
          onActiveChange={(active) => handleActiveChange(i, active)}
        />
      ))}
    </section>
  );
}
