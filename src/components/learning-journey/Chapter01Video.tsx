"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────── */
/*  Chapter 01 — Video Hero Experience                                */
/*  Scroll-controlled assembly video → blur → content reveal.        */
/* ────────────────────────────────────────────────────────────────── */

const VIDEOP = 0.32; // video occupies first 32 % of scroll progress
const BLURP  = 0.06; // blur transition occupies next 6 %

const CHIPS = [
  "Learn Flight Principles",
  "Assemble & Understand Components",
  "Fly Your First Drone",
];

interface StepItem {
  name?: string;
  desc?: string;
  label?: string;
  value?: number;
}

interface ContentStep {
  title: string;
  type: "list" | "cards" | "donut";
  items: StepItem[];
}

const STEPS: ContentStep[] = [
  {
    title: "What You'll Learn",
    type: "list",
    items: [
      { name: "UAV Architecture & Components" },
      { name: "Flight Principles" },
      { name: "Safety & Regulations" },
      { name: "Basic Drone Operations" },
      { name: "Industry Applications" },
    ],
  },
  {
    title: "Learning Outcomes",
    type: "list",
    items: [
      { name: "Understand drone structure" },
      { name: "Identify major components" },
      { name: "Explain principles of flight" },
      { name: "Apply safety guidelines" },
      { name: "Explore real-world drone applications" },
    ],
  },
  {
    title: "Hands-on Experience",
    type: "cards",
    items: [
      { name: "Drone Kit", desc: "Build and experiment with real hardware" },
      { name: "Flight Simulator", desc: "Practice in a risk-free environment" },
      { name: "Component Labs", desc: "Test each part individually" },
      { name: "Mini Project", desc: "Apply everything you learn" },
      { name: "Peer Presentation", desc: "Share and refine your ideas" },
    ],
  },
  {
    title: "Assessment",
    type: "donut",
    items: [
      { label: "Theory", value: 20 },
      { label: "Practical", value: 30 },
      { label: "Mini Project", value: 30 },
      { label: "Presentation", value: 20 },
    ],
  },
];

/* ── Assessment donut ── */

function Donut({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const colors = ["#ff6a00", "#ff8c33", "#ffad66", "#ffce99"];
  const r = 34;
  return (
    <div className="flex flex-wrap gap-5">
      {items.map((item, i) => {
        const circ = 2 * Math.PI * r;
        const len = (item.value / 100) * circ;
        return (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <svg width="82" height="82" viewBox="0 0 82 82" className="shrink-0">
              <circle cx="41" cy="41" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" />
              <circle
                cx="41" cy="41" r={r} fill="none" stroke={colors[i] ?? "#ff6a00"} strokeWidth="5"
                strokeDasharray={`${len} ${circ - len}`}
                transform="rotate(-90 41 41)" strokeLinecap="round"
              />
              <text x="41" y="41" textAnchor="middle" dominantBaseline="central"
                fontSize="14" fontWeight="700" fontFamily="var(--font-display)" fill="rgba(0,0,0,0.7)">
                {item.value}%
              </text>
            </svg>
            <span className="font-body text-[11px] text-black/40">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */

export function Chapter01Video({
  onRegister,
}: {
  onRegister: (el: HTMLElement | null) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const setupDone = useRef(false);

  const cbRef = useCallback(
    (el: HTMLElement | null) => { sectionRef.current = el; onRegister(el); },
    [onRegister],
  );

  /* ── Video setup + ScrollTrigger ── */
  useEffect(() => {
    const section = sectionRef.current;
    const videoWrap = videoWrapRef.current;
    const overlay = overlayRef.current;
    const chipsEl = chipsRef.current;
    const blurEl = blurRef.current;
    const contentEl = contentRef.current;
    if (!section || !videoWrap || !overlay || !chipsEl || !blurEl || !contentEl || setupDone.current) return;
    setupDone.current = true;

    /* Create video element via DOM (hydration-safe) */
    const v = document.createElement("video");
    v.className = "h-full w-full object-contain";
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.innerHTML =
      '<source src="/videos/I_want_a_video_of_this_model_a.mp4" type="video/mp4" />';
    videoWrap.appendChild(v);
    videoRef.current = v;

    /* Initial states */
    gsap.set(overlay, { opacity: 0 });
    gsap.set(chipsEl.children, { opacity: 0, y: 12 });
    gsap.set(blurEl, { opacity: 0 });
    gsap.set(contentEl, { opacity: 0 });
    gsap.set(stepRefs.current, { opacity: 0, y: 20 });

    const chips = Array.from(chipsEl.children) as HTMLElement[];
    const steps = stepRefs.current.filter(Boolean) as HTMLElement[];

    /* Wait for video metadata */
    const onMeta = () => {
      const dur = v.duration || 12;

      /* ── Phase timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320vh",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      });

      /* Overlay text fades in during video phase */
      tl.to(overlay, { opacity: 1, duration: 0.06 }, 0);
      /* Chips stagger in */
      tl.fromTo(chips, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.03, stagger: 0.02 }, 0.04);

      /* Blur overlay fades in during transition */
      tl.to(blurEl, { opacity: 1, duration: 0.04 }, VIDEOP);

      /* Content panel appears after blur */
      tl.to(contentEl, { opacity: 1, duration: 0.02 }, VIDEOP + BLURP);

      /* Steps reveal progressively */
      steps.forEach((step, i) => {
        const pos = VIDEOP + BLURP + i * 0.13;
        tl.fromTo(step, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, pos);
      });

      /* ── Video scrubbing ── */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=320vh",
        onUpdate: (self) => {
          const p = self.progress;
          if (v.readyState < 2) return;

          if (p < VIDEOP) {
            /* Phase 1: scrub video */
            v.currentTime = (p / VIDEOP) * dur;

            /* Overlay opacity: fade out near the end of the video */
            const overlayStay = p < 0.22 ? 1 : Math.max(0, 1 - (p - 0.22) / 0.1);
            gsap.set(overlay, { opacity: overlayStay });

            /* Keep blur hidden during video */
            gsap.set(blurEl, { opacity: 0 });
            gsap.set(contentEl, { opacity: 0 });
          } else if (p < VIDEOP + BLURP) {
            /* Phase 2: blur transition */
            const bp = (p - VIDEOP) / BLURP;
            gsap.set(blurEl, { opacity: bp });
            gsap.set(blurEl, { backdropFilter: `blur(${bp * 12}px)` });
          }
          /* Phase 3 is handled by the timeline above */
        },
      });
    };

    if (v.readyState >= 2) { onMeta(); } else { v.addEventListener("loadedmetadata", onMeta); }

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={cbRef}
      className="relative bg-white"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      {/* ── Video container (centred, 80 % width) ── */}
      <div className="absolute inset-0 flex items-center justify-center px-4 md:px-10">
        <div className="h-full w-full max-w-[80vw]" ref={videoWrapRef} />
      </div>

      {/* ── Overlay text on video (Phase 1) ── */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-start justify-center px-6 md:px-14 lg:px-20"
      >
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6a00]">
          LEVEL 1
        </span>
        <h2
          className="mt-3 max-w-2xl font-display font-bold leading-[1.05] tracking-tight text-black/90"
          style={{ fontSize: "clamp(42px, 5.5vw, 88px)" }}
        >
          Drone Systems Fundamentals
        </h2>
        <p
          className="mt-3 max-w-lg font-body leading-relaxed text-black/50"
          style={{ fontSize: "clamp(18px, 1.4vw, 22px)" }}
        >
          Build your first understanding of how drones work.
        </p>

        {/* Animated highlight chips */}
        <div ref={chipsRef} className="mt-6 flex flex-wrap gap-3">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-black/[0.08] bg-white/60 px-4 py-2 font-label text-xs text-black/60 backdrop-blur-sm"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* ── Blur overlay (Phase 2) ── */}
      <div
        ref={blurRef}
        className="pointer-events-none absolute inset-0 z-10 bg-white/10"
      />

      {/* ── Content panel (Phase 3) ── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto"
      >
        <div className="mx-auto w-full max-w-3xl px-6 py-16 md:px-10 lg:px-14">
          {STEPS.map((step, si) => (
            <div
              key={step.title}
              ref={(el) => { stepRefs.current[si] = el; }}
              className="mb-14 last:mb-0"
            >
              <h3 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6a00]/70">
                {step.title}
              </h3>

              {step.type === "list" && (
                <div className="mt-4 space-y-3">
                  {step.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6a00]/30" />
                      <span
                        className="font-body text-black/65"
                        style={{ fontSize: "clamp(16px, 1.2vw, 19px)" }}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {step.type === "cards" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {step.items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border border-black/[0.04] bg-white/70 px-4 py-3.5 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] backdrop-blur-sm"
                    >
                      <span className="font-display text-sm font-semibold text-black/80">
                        {item.name}
                      </span>
                      {item.desc && (
                        <p className="mt-0.5 font-body text-xs leading-relaxed text-black/40">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {step.type === "donut" && (
                <div className="mt-4">
                  <Donut
                    items={step.items as { label: string; value: number }[]}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
