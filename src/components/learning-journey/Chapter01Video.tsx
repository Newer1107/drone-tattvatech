"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHIPS = ["Learn Flight Principles", "Assemble & Understand Components", "Fly Your First Drone"];

interface StepItem { name?: string; desc?: string; label?: string; value?: number }
interface ContentStep { title: string; type: "list" | "cards" | "donut"; items: StepItem[] }

const STEPS: ContentStep[] = [
  { title: "What You'll Learn", type: "list", items: [
    { name: "UAV Architecture & Components" }, { name: "Flight Principles" },
    { name: "Safety & Regulations" }, { name: "Basic Drone Operations" }, { name: "Industry Applications" },
  ]},
  { title: "Learning Outcomes", type: "list", items: [
    { name: "Understand drone structure" }, { name: "Identify major components" },
    { name: "Explain principles of flight" }, { name: "Apply safety guidelines" },
    { name: "Explore real-world drone applications" },
  ]},
  { title: "Hands-on Experience", type: "cards", items: [
    { name: "Drone Kit", desc: "Build and experiment with real hardware" },
    { name: "Flight Simulator", desc: "Practice in a risk-free environment" },
    { name: "Component Labs", desc: "Test each part individually" },
    { name: "Mini Project", desc: "Apply everything you learn" },
    { name: "Peer Presentation", desc: "Share and refine your ideas" },
  ]},
  { title: "Assessment", type: "donut", items: [
    { label: "Theory", value: 20 }, { label: "Practical", value: 30 },
    { label: "Mini Project", value: 30 }, { label: "Presentation", value: 20 },
  ]},
];

function Donut({ items }: { items: { label: string; value: number }[] }) {
  const colors = ["#ff6a00", "#ff8c33", "#ffad66", "#ffce99"];
  const r = 34;
  return (
    <div className="flex flex-wrap gap-6">
      {items.map((item, i) => {
        const circ = 2 * Math.PI * r;
        const len = (item.value / 100) * circ;
        return (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <div className="rounded-xl bg-white/50 p-2 shadow-sm backdrop-blur-sm">
              <svg width="82" height="82" viewBox="0 0 82 82" className="shrink-0">
                <circle cx="41" cy="41" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" />
                <circle cx="41" cy="41" r={r} fill="none" stroke={colors[i] ?? "#ff6a00"} strokeWidth="5"
                  strokeDasharray={`${len} ${circ - len}`} transform="rotate(-90 41 41)" strokeLinecap="round" />
                <text x="41" y="41" textAnchor="middle" dominantBaseline="central"
                  fontSize="14" fontWeight="700" fontFamily="var(--font-display)" fill="rgba(0,0,0,0.7)">{item.value}%</text>
              </svg>
            </div>
            <span className="font-body text-[12px] font-medium text-black/40">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CardList({ items }: { items: { name?: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.name}
          className="rounded-xl border border-black/[0.05] bg-white/60 px-4 py-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff6a00]/10 text-[10px] font-bold text-[#ff6a00]">✓</span>
            <span className="font-body text-sm font-medium text-black/80">{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceCards({ items }: { items: { name?: string; desc?: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.name}
          className="rounded-xl border border-black/[0.05] bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <span className="font-display text-sm font-semibold text-black/85">{item.name}</span>
          {item.desc && <p className="mt-1 font-body text-xs leading-relaxed text-black/45">{item.desc}</p>}
        </div>
      ))}
    </div>
  );
}

export function Chapter01Video() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setupDone = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const videoWrap = videoWrapRef.current;
    const overlay = overlayRef.current;
    const chipsEl = chipsRef.current;
    const blurEl = blurRef.current;
    const contentEl = contentRef.current;
    if (!section || !videoWrap || !overlay || !chipsEl || !blurEl || !contentEl || setupDone.current) return;
    setupDone.current = true;

    /* Create video via DOM */
    const v = document.createElement("video");
    v.className = "h-full w-full object-cover";
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.innerHTML = '<source src="/videos/I_want_a_video_of_this_model_a.mp4" type="video/mp4" />';
    videoWrap.appendChild(v);

    const chips = Array.from(chipsEl.children) as HTMLElement[];
    const steps = stepRefs.current.filter(Boolean) as HTMLElement[];

    /* Initial hidden states */
    gsap.set(chips, { opacity: 0, y: 12 });
    gsap.set(blurEl, { opacity: 0 });
    gsap.set(contentEl, { opacity: 0 });
    gsap.set(steps, { opacity: 0, y: 20 });
    gsap.set(overlay, { opacity: 1 });

    const VIDEOP = 0.82;
    const BLURP = 0.06;

    /* Single scrub timeline — NO pin */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          if (v.readyState < 2) return;
          const p = self.progress;
          v.currentTime = p < VIDEOP ? (p / VIDEOP) * (v.duration || 12) : v.duration;
        },
      },
    });

    tl.to(chips, { opacity: 1, y: 0, duration: 0.04, stagger: 0.03 }, 0.04);
    tl.to(overlay, { opacity: 0, duration: 0.04 }, VIDEOP - 0.06);
    tl.to(blurEl, { opacity: 1, duration: 0.04 }, VIDEOP);
    tl.set(blurEl, { backdropFilter: "blur(20px)" }, VIDEOP + BLURP);
    tl.to(contentEl, { opacity: 1, duration: 0.02 }, VIDEOP + BLURP);
    steps.forEach((step, i) => {
      tl.fromTo(step, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.05 }, VIDEOP + BLURP + i * 0.035);
    });

    return () => { v.remove(); tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="sticky top-0" style={{ height: "700vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <div className="absolute inset-0" ref={videoWrapRef} />
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 flex flex-col items-start justify-center px-6 md:px-14 lg:px-20">
          <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">LEVEL 1</span>
          <h2 className="mt-3 max-w-2xl font-display font-bold leading-[1.05] tracking-tight text-black/90"
            style={{ fontSize: "clamp(42px, 5.5vw, 88px)" }}>Drone Systems Fundamentals</h2>
          <p className="mt-3 max-w-lg font-body leading-relaxed text-black/50"
            style={{ fontSize: "clamp(18px, 1.4vw, 22px)" }}>Build your first understanding of how drones work.</p>
          <div ref={chipsRef} className="mt-6 flex flex-wrap gap-3">
            {CHIPS.map((chip) => (
              <span key={chip} className="rounded-full border border-black/[0.08] bg-white/60 px-4 py-2 font-label text-xs text-black/60 backdrop-blur-sm">{chip}</span>
            ))}
          </div>
        </div>
        <div ref={blurRef} className="pointer-events-none absolute inset-0 z-10 bg-white/70" />
        <div ref={contentRef} className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-12 md:px-10 lg:px-14 md:pt-20">
            {STEPS.map((step, si) => (
              <div key={step.title} ref={(el) => { stepRefs.current[si] = el; }} className="mb-10 last:mb-0">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-black/5" />
                  <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ff6a00]/60">{step.title}</span>
                  <span className="h-px flex-1 bg-black/5" />
                </div>
                {step.type === "list" && <CardList items={step.items} />}
                {step.type === "cards" && <ExperienceCards items={step.items} />}
                {step.type === "donut" && <Donut items={step.items as { label: string; value: number }[]} />}
              </div>
            ))}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
