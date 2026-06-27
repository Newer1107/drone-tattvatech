"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LEVELS, FINAL_STAGE } from "./journey-data";
import { JourneyDrone } from "./JourneyDrone";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────────
   Scroll mapping
   Total progress 0–1 over 6000 px.
   4 levels + final stage at the very end.
   ────────────────────────────────────────────────────────────────── */

const LV = 0.22; // per-level active window
const GAP = 0.03; // transition gap between levels
const LV_STARTS = [0, LV + GAP, (LV + GAP) * 2, (LV + GAP) * 3];
const LV_ENDS   = LV_STARTS.map((s) => Math.min(s + LV, 1));

const FINAL_START = 0.92;

/* subgroup thresholds within a level's sub-progress [0–1] */
const REVEAL: { start: number; end: number; cls: string }[] = [
  { start: 0.00, end: 0.18, cls: "rg-header" },
  { start: 0.18, end: 0.38, cls: "rg-learn" },
  { start: 0.38, end: 0.55, cls: "rg-outcomes" },
  { start: 0.55, end: 0.70, cls: "rg-method" },
  { start: 0.70, end: 0.85, cls: "rg-details" },
  { start: 0.85, end: 1.00, cls: "rg-project" },
];

/* ────────────────────────────────────────────────────────────────── */

export function LearningJourneyReimagined() {
  const section = useRef<HTMLElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const timeline = useRef<HTMLDivElement>(null);
  const finalEl = useRef<HTMLDivElement>(null);
  /* ── ScrollTrigger ── */
  useGSAP(() => {
    const els = {
      left: left.current,
      right: right.current,
      final: finalEl.current,
      wraps: Array.from(left.current?.querySelectorAll(".lvl-wrap") ?? []) as HTMLElement[],
      dots: Array.from(timeline.current?.querySelectorAll(".tl-dot") ?? []) as HTMLElement[],
      labels: Array.from(timeline.current?.querySelectorAll(".tl-label") ?? []) as HTMLElement[],
    };

    if (!els.left || !els.right) return;

    /* helper – set element opacity + y based on progress */
    const fade = (el: HTMLElement, f: number) => {
      gsap.set(el, { opacity: f, y: 15 * (1 - f) });
    };

    /* helper – reveal subgroups for a given level wrapper */
    const updateLevel = (lvl: number, sub: number) => {
      const wrap = els.wraps[lvl];
      if (!wrap) return;
      for (const r of REVEAL) {
        const targets = wrap.querySelectorAll<HTMLElement>(`.${r.cls}`);
        const f = sub < r.start ? 0 : sub > r.end ? 1 : (sub - r.start) / (r.end - r.start);
        const eased = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2;
        targets.forEach((t) => fade(t, eased));
      }
    };

    /* helper – switch active level wrapper */
    const setActiveLevel = (i: number) => {
      els.wraps.forEach((w, idx) => {
        gsap.set(w, {
          opacity: idx === i ? 1 : 0,
          pointerEvents: idx === i ? "auto" : "none",
        });
      });
    };

    /* helper – update timeline dots */
    const setTimeline = (active: number) => {
      els.dots.forEach((d, idx) => {
        if (idx < active) {
          d.style.background = "#fff";
          d.style.boxShadow = "0 0 0 4px rgba(255,255,255,0.08)";
        } else if (idx === active) {
          d.style.background = "#ff6a00";
          d.style.boxShadow = "0 0 0 4px rgba(255,106,0,0.25)";
        } else {
          d.style.background = "rgba(255,255,255,0.15)";
          d.style.boxShadow = "none";
        }
      });
    };

    ScrollTrigger.create({
      id: "journey-pin",
      trigger: section.current,
      pin: true,
      start: "top top",
      end: "+=6000",
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;

        /* ── Determine level ── */
        let lvl = 0;
        let sub = 0;
        for (let i = 0; i < 4; i++) {
          if (p >= LV_STARTS[i] && p < LV_ENDS[i]) {
            lvl = i;
            sub = (p - LV_STARTS[i]) / (LV_ENDS[i] - LV_STARTS[i]);
            break;
          }
          if (p >= LV_ENDS[i]) lvl = Math.min(i + 1, 3);
        }
        if (p >= LV_ENDS[3]) {
          lvl = 3;
          sub = Math.min(1, (p - LV_STARTS[3]) / (LV_ENDS[3] - LV_STARTS[3]));
        }

        const clampedSub = Math.max(0, Math.min(1, sub));

        /* ── Update active level ── */
        setActiveLevel(lvl);
        updateLevel(lvl, clampedSub);

        /* ── Update drone component through DOM attributes ── */
        if (els.right) {
          els.right.setAttribute("data-level", String(lvl));
          els.right.setAttribute("data-progress", String(clampedSub));
        }

        /* ── Timeline ── */
        setTimeline(lvl);

        /* ── Final stage ── */
        if (els.final) {
          const f = Math.max(0, Math.min(1, (p - FINAL_START) / (1 - FINAL_START)));
          gsap.set(els.final, { opacity: f, pointerEvents: f > 0.01 ? "auto" : "none" });
        }
      },
    });

    /* initial state */
    els.wraps.forEach((w, i) => {
      gsap.set(w, { opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" });
    });
    if (els.final) gsap.set(els.final, { opacity: 0, pointerEvents: "none" });
    els.dots.forEach((d) => {
      d.style.background = "rgba(255,255,255,0.15)";
      d.style.boxShadow = "none";
    });
    if (els.dots[0]) {
      els.dots[0].style.background = "#ff6a00";
      els.dots[0].style.boxShadow = "0 0 0 4px rgba(255,106,0,0.25)";
    }
  }, []);

  return (
    <section
      ref={section}
      className="relative bg-[#0b1220] text-white"
      style={{ height: "100vh", overflow: "hidden" }}
      aria-label="Learning Journey"
    >
      {/* Vertical timeline */}
      <div
        ref={timeline}
        className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-start md:flex"
      >
        {/* Connector line */}
        <div className="absolute left-[4px] top-0 bottom-0 w-px bg-white/10" />

        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="relative flex items-center gap-3" style={{ padding: "14px 0" }}>
            <span className="tl-dot relative z-10 block h-2.5 w-2.5 rounded-full transition-all duration-500" />
            <span className="tl-label font-label text-xs uppercase tracking-[0.15em] text-white/50">
              Level {n}
            </span>
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 py-16 md:px-12 lg:px-16">
        {/* ── LEFT: Content (40%) ── */}
        <div ref={left} className="relative z-10 w-full md:w-[42%]" style={{ minHeight: "60vh" }}>
          {/* Level wrappers — stacked */}
          {LEVELS.map((level) => (
            <div key={level.id} className="lvl-wrap absolute inset-0" style={{ willChange: "opacity" }}>
              <ContentGroup className="rg-header">
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ff6a00]">
                  {level.badge}
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
                  {level.title}
                </h3>
                <p className="mt-2 font-label text-xs uppercase tracking-[0.2em] text-white/40">
                  {level.subtitle}
                </p>
              </ContentGroup>

              <ContentGroup className="rg-learn">
                <p className="mt-6 font-body text-sm leading-relaxed text-white/70">
                  {level.description}
                </p>
                <div className="mt-4">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                    Students Learn
                  </span>
                  <ul className="mt-2 space-y-1">
                    {level.learnItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-sm text-white/80">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#ff6a00]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ContentGroup>

              <ContentGroup className="rg-outcomes">
                <div className="mt-4">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                    Learning Outcomes
                  </span>
                  <ul className="mt-2 space-y-1">
                    {level.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 font-body text-sm text-white/80">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#ff6a00]" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </ContentGroup>

              <ContentGroup className="rg-method">
                {level.stemIntegration && (
                  <div className="mt-4">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      STEM Integration
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                      {level.stemIntegration.map((s) => (
                        <div key={s.subject}>
                          <span className="font-label text-xs font-semibold text-[#ff6a00]/80">
                            {s.subject}
                          </span>
                          <p className="font-body text-xs text-white/60">{s.topics.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {level.extraSections?.map((es) => (
                  <div key={es.title} className="mt-4">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      {es.title}
                    </span>
                    <ul className="mt-1 space-y-0.5">
                      {es.items.map((item) => (
                        <li key={item} className="font-body text-xs text-white/60">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {level.learningMethod.length > 0 && (
                  <div className="mt-4">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      Learning Method
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {level.learningMethod.map((m) => (
                        <span
                          key={m}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-label text-[11px] text-white/70"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </ContentGroup>

              <ContentGroup className="rg-details">
                {level.assessment.length > 0 && (
                  <div className="mt-4">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      Assessment
                    </span>
                    <div className="mt-2 space-y-1">
                      {level.assessment.map((a) => (
                        <div key={a.label} className="flex items-center gap-3">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[#ff6a00] transition-all"
                              style={{ width: a.value }}
                            />
                          </div>
                          <span className="w-16 shrink-0 text-right font-label text-[11px] text-white/50">
                            {a.label} {a.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {level.equipment.length > 0 && (
                  <div className="mt-4">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      Equipment
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {level.equipment.map((eq) => (
                        <span
                          key={eq}
                          className="rounded-sm border border-white/8 bg-white/[0.03] px-2 py-0.5 font-body text-[11px] text-white/50"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </ContentGroup>

              <ContentGroup className="rg-project">
                <div className="mt-4 border-t border-white/10 pt-4">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ff6a00]/70">
                    Mini Project
                  </span>
                  <p className="mt-1 font-body text-sm leading-relaxed text-white/70">
                    {level.miniProject}
                  </p>
                </div>

                {level.deliverables.length > 0 && (
                  <div className="mt-3">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      Deliverables
                    </span>
                    <ul className="mt-1 space-y-0.5">
                      {level.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 font-body text-xs text-white/60">
                          <span className="mt-[6px] h-0.5 w-0.5 shrink-0 rounded-full bg-white/30" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </ContentGroup>
            </div>
          ))}
        </div>

        {/* ── RIGHT: Drone visualization (60%) ── */}
        <div
          ref={right}
          className="absolute bottom-0 right-0 top-0 z-0 w-full md:relative md:w-[58%]"
          data-level="0"
          data-progress="0"
        >
          <JourneyDrone />
        </div>
      </div>

      {/* ── FINAL STAGE overlay ── */}
      <div
        ref={finalEl}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0b1220]/95 px-6 text-center"
      >
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ff6a00]">
          Graduation
        </span>
        <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {FINAL_STAGE.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-lg font-body text-base leading-relaxed text-white/60">
          {FINAL_STAGE.description}
        </p>
        <a
          href="#curriculum"
          className="group mt-10 inline-flex items-center gap-2 font-label text-sm font-semibold text-white/90 no-underline transition-all hover:text-white"
        >
          <span className="relative">
            {FINAL_STAGE.cta}
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-white/40 transition-transform duration-300 group-hover:scale-x-0" />
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-ml-1 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Tiny wrapper — marks a content group for GSAP-driven reveal      */
/* ────────────────────────────────────────────────────────────────── */

function ContentGroup({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={className} style={{ opacity: 0, willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
