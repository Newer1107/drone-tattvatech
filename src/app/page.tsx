import { Hero } from "@/components/hero/Hero";
import { DroneDisassemblySection } from "@/components/hero/DroneDisassemblySection";
import { LearningJourney } from "@/components/learning-journey/LearningJourney";
import { DroneBuilder } from "@/components/drone-builder/DroneBuilder";
import { Applications } from "@/components/applications/Applications";
import { SkillsBento } from "@/components/applications/SkillsBento";
import { DroneAssembly } from "@/components/drone-assembly/DroneAssembly";

export default function Home() {
  return (
    <>
      <Hero />
      <DroneDisassemblySection />
      <LearningJourney />
      <DroneBuilder />
      <Applications />
      <SkillsBento />
      <DroneAssembly />
    </>
  );
}
