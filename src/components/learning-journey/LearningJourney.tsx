"use client";

import { CHAPTERS } from "./data";
import { ChapterWorkshop, ChapterLab, ChapterMission } from "./chapters";
import { Chapter01Video } from "./Chapter01Video";

const CHAPTER_COMPONENTS = [Chapter01Video, ChapterWorkshop, ChapterLab, ChapterMission] as const;

export function LearningJourney() {
  return (
    <section className="bg-white">
      {CHAPTERS.map((chapter, i) => {
        const Comp = CHAPTER_COMPONENTS[i];
        return <Comp key={chapter.id} data={chapter} />;
      })}
    </section>
  );
}
