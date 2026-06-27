import { Hero } from "@/components/hero/Hero";
import { DroneDisassemblySection } from "@/components/hero/DroneDisassemblySection";
import { DroneBuilder } from "@/components/drone-builder/DroneBuilder";
import { Applications } from "@/components/applications/Applications";
import { SkillsBento } from "@/components/applications/SkillsBento";
import { DroneAssembly } from "@/components/drone-assembly/DroneAssembly";
import { LearningJourneyReimagined } from "@/components/learning-journey/LearningJourneyReimagined";

export default function Home() {
  return (
    <>
      <Hero />
      <DroneDisassemblySection />
      <DroneBuilder />
      <Applications />
      <SkillsBento />
      <DroneAssembly />
      <LearningJourneyReimagined />
    </>
  );
}
