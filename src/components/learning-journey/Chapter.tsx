"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ChapterData } from "./data";
import { ChapterDrone } from "./ChapterDrone";
import { SvgIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────── */
/*  Assessment donut — premium circular progress                      */
/* ────────────────────────────────────────────────────────────────── */

function AssessmentDonut({ items }: { items: { label: string; value: number }[] }) {
  const colors = ["#ff6a00", "#ff8c33", "#ffad66", "#ffce99"];
  let offset = 0;
  const r = 34;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-wrap gap-5">
      {items.map((item, i) => {
        const len = (item.value / 100) * circ;
        offset += len;
        return (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <svg width="82" height="82" viewBox="0 0 82 82" className="shrink-0">
              <circle cx="41" cy="41" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" />
              <circle
                cx="41" cy="41" r={r} fill="none" stroke={colors[i] ?? "#ff6a00"} strokeWidth="5"
                strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={offset * -1 + len}
                transform="rotate(-90 41 41)" strokeLinecap="round"
              />
              <text x="41" y="41" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="700" fontFamily="var(--font-display)" fill="rgba(0,0,0,0.8)">
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

/* ── Equipment tile ── */

const ICON_MAP: Record<string, string> = {
  Kit: "inventory_2", System: "inventory_2", Motor: "speed", Controller: "developer_board",
  Pixhawk: "developer_board", ESC: "bolt", Propeller: "propeller",
  Battery: "battery_std", GPS: "satellite_alt", Radio: "radio", Transmitter: "radio",
  Camera: "videocam", FPV: "videocam", Sensor: "sensors", LIDAR: "sensors",
  Telemetry: "cell_tower", Safety: "verified",
};

function eqIcon(name: string) {
  for (const [kw, icon] of Object.entries(ICON_MAP)) {
    if (name.includes(kw)) return icon;
  }
  return "settings";
}

function EquipmentTile({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="group rounded-xl border border-black/[0.04] bg-white px-4 py-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]">
      <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff6a00]/10">
        <span className="material-symbols-outlined text-sm text-[#ff6a00]" style={{ fontVariationSettings: "'FILL' 1" }}>{eqIcon(name)}</span>
      </div>
      <p className="font-display text-sm font-semibold text-black/90">{name}</p>
      <p className="mt-0.5 font-body text-xs leading-relaxed text-black/40">{desc}</p>
    </div>
  );
}

/* ── Render a single reveal block ── */

function RevealBlock({ block }: { block: ChapterData["blocks"][number] }) {
  return (
    <>
      <h4 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6a00]/70">{block.heading}</h4>

      {(block.type === "outcomes" || block.type === "projects") && (
        <ul className="mt-3 space-y-2">
          {(block.data as string[]).map((item) => (
            <li key={item} className="flex items-start gap-3 font-body text-black/70" style={{ fontSize: "clamp(14px, 1.15vw, 17px)" }}>
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6a00]/40" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {block.type === "equipment" && (
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {(block.data as { name: string; desc: string }[]).map((item) => (
            <EquipmentTile key={item.name} name={item.name} desc={item.desc} />
          ))}
        </div>
      )}

      {block.type === "assessment" && (
        <div className="mt-3"><AssessmentDonut items={block.data as { label: string; value: number }[]} /></div>
      )}

      {block.type === "deliverables" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {(block.data as string[]).map((item) => (
            <span key={item} className="rounded-lg border border-black/[0.06] bg-black/[0.02] px-3 py-1.5 font-body text-sm text-black/60">{item}</span>
          ))}
        </div>
      )}

      {(block.type === "technologies" || block.type === "industry") && (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {(block.data as string[]).map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-black/70">
              <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[#ff6a00]/30" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Chapter — single fullscreen chapter                               */
/*  Pins for 120vh extra scroll to reveal content progressively       */
/* ────────────────────────────────────────────────────────────────── */

export function Chapter({
  data,
  onRegister,
  onActiveChange,
}: {
  data: ChapterData;
  onRegister: (el: HTMLElement | null) => void;
  onActiveChange: (active: boolean) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const blockEls = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = useCallback((el: HTMLElement | null) => {
    sectionRef.current = el;
    onRegister(el);
  }, [onRegister]);

  useEffect(() => {
    const section = sectionRef.current;
    const hero = heroRef.current;
    const blockContainer = blocksRef.current;
    if (!section) return;

    /* Visibility tracking — tell parent when this chapter is in view */
    const vt = ScrollTrigger.create({
      trigger: section,
      start: "top 110%",
      end: "bottom -10%",
      onEnter: () => onActiveChange(true),
      onLeave: () => onActiveChange(false),
      onEnterBack: () => onActiveChange(true),
      onLeaveBack: () => onActiveChange(false),
    });

    /* Pin + scrub timeline for progressive reveal */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=120vh",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    if (hero) {
      tl.fromTo(hero.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15, stagger: 0.04 }, 0);
    }

    const positions = [0.25, 0.45, 0.62, 0.78, 0.92];
    const revealed = blockEls.current.filter(Boolean) as HTMLDivElement[];
    revealed.forEach((el, i) => {
      if (i < positions.length) {
        tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.18 }, positions[i]);
      }
    });

    return () => { vt.kill(); tl.scrollTrigger?.kill(); tl.kill(); };
  }, [onActiveChange]);

  return (
    <section ref={setRef} className="relative bg-white" style={{ minHeight: "100vh" }}>
      {/* Large background number */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 select-none leading-none text-black/[0.02]"
        style={{ fontSize: "clamp(200px, 40vw, 600px)", fontWeight: 900, letterSpacing: "-0.06em" }}
      >
        {data.number}
      </div>

      <div className="relative mx-auto flex h-screen max-w-7xl items-center px-6 md:px-10 lg:px-14">
        {/* ── LEFT content ── */}
        <div className="z-10 w-full md:w-[44%]">
          <div ref={heroRef}>
            <span className="font-label text-[11px] font-semibold uppercase tracking-[0.25em] text-[#ff6a00]">{data.label}</span>
            <h2
              className="mt-2 whitespace-pre-line font-display font-bold leading-[1.05] tracking-tight text-black/90"
              style={{ fontSize: "clamp(42px, 5.5vw, 80px)" }}
            >
              {data.title}
            </h2>
            <p
              className="mt-4 font-body leading-relaxed text-black/60"
              style={{ fontSize: "clamp(16px, 1.4vw, 20px)" }}
            >
              {data.description}
            </p>
            <div className="mt-5 space-y-2.5">
              {data.highlights.map((h) => (
                <div key={h.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#ff6a00]/10">
                    <SvgIcon name={h.icon} className="h-3.5 w-3.5 text-[#ff6a00]" />
                  </span>
                  <span className="font-body text-black/70" style={{ fontSize: "clamp(14px, 1.2vw, 17px)" }}>{h.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll-revealed blocks — hidden until scrub reaches them */}
          <div ref={blocksRef} className="mt-10 space-y-8">
            {data.blocks.map((block, bi) => (
              <div key={block.key} ref={(el) => { blockEls.current[bi] = el; }} style={{ opacity: 0 }}>
                <RevealBlock block={block} />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT drone ── */}
        <div className="absolute bottom-0 right-0 top-0 w-full md:relative md:w-[56%]">
          <ChapterDrone level={data.id} active={true} />
        </div>
      </div>
    </section>
  );
}
