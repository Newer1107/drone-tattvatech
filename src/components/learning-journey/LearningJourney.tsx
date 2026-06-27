"use client";

import { useRef, useCallback } from "react";
import { CHAPTERS } from "./data";
import { ChapterWorkshop, ChapterLab, ChapterMission } from "./chapters";
import { Chapter01Video } from "./Chapter01Video";
import { ProgressBar } from "./ProgressBar";

const CHAPTER_COMPONENTS = [Chapter01Video, ChapterWorkshop, ChapterLab, ChapterMission] as const;

export function LearningJourney() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const register = useCallback((index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  }, []);

  return (
    <section className="bg-white">
      <ProgressBar sectionRefs={sectionsRef as React.RefObject<(HTMLElement | null)[]>} />

      {CHAPTERS.map((chapter, i) => {
        const Comp = CHAPTER_COMPONENTS[i];
        return <Comp key={chapter.id} data={chapter} onRegister={register(i)} />;
      })}
    </section>
  );
}
