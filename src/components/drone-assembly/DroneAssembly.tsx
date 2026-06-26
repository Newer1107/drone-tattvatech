"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LABELS = [
  { text: "Brushless Motor", left: "16%", top: "23%" },
  { text: "Flight Controller", left: "72%", top: "25%" },
  { text: "Camera Module", left: "18%", top: "42%" },
  { text: "LiPo Battery", left: "68%", top: "47%" },
  { text: "Landing Gear", left: "22%", top: "65%" },
  { text: "Drone Frame", left: "38%", top: "55%" },
  { text: "Propeller", left: "74%", top: "68%" },
];

/* ------------------------------------------------------------------ */
/*  Render video client-side to avoid YPSC extension hydration issues  */
/* ------------------------------------------------------------------ */

function AssemblyVideo({
  onReady,
}: {
  onReady: (el: HTMLVideoElement) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.className = "w-full h-auto";
    v.style.pointerEvents = "none";
    v.innerHTML =
      '<source src="/videos/create_a_video_where_start_fro-cleaned.mp4" type="video/mp4" />';
    container.appendChild(v);
    onReady(v);
    return () => {
      v.remove();
    };
  }, [onReady]);

  return <div ref={ref} className="w-full" />;
}

/* ================================================================== */
/*  Section                                                           */
/* ================================================================== */

export function DroneAssembly() {
  const section = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const labelsWrap = useRef<HTMLDivElement>(null);
  const endWrap = useRef<HTMLDivElement>(null);
  const heroText = useRef<HTMLDivElement>(null);
  const gsapReady = useRef(false);

  const rafId = useRef(0);
  const cleanup = useRef<(() => void) | null>(null);

  const handleVideoReady = useRef((v: HTMLVideoElement) => {
    videoRef.current = v;
  }).current;

  // Setup GSAP once video is ready
  useEffect(() => {
    const v = videoRef.current;
    const lbls = labelsWrap.current?.children;
    const endEl = endWrap.current;
    const hero = heroText.current;
    if (!v || !lbls || !endEl || !hero) return;

    v.load();
    v.currentTime = 0;
    gsap.set(endEl, { opacity: 0 });

    let targetTime = 0;

    function tick() {
      if (!v) return;
      const diff = targetTime - v.currentTime;
      v.currentTime += diff * 0.18;
      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);

    const st = ScrollTrigger.create({
      id: "assembly-pin",
      trigger: section.current,
      start: "top top",
      end: "+=3800",
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (v.readyState < 2) return;
        targetTime = self.progress * (v.duration || 10);
      },
    });

    const endSt = ScrollTrigger.create({
      id: "assembly-end",
      trigger: section.current,
      start: "top top",
      end: "+=3800",
      scrub: 1.2,
      onUpdate: (self) => {
        gsap.set(endEl, { opacity: self.progress > 0.92 ? (self.progress - 0.92) / 0.08 : 0 });
        gsap.set(hero, { opacity: self.progress > 0.15 ? 0 : 1 - self.progress / 0.15 });
      },
    });

    gsap.set(lbls, { opacity: 0, y: 12 });

    const labelTl = gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: "top center",
        once: true,
        onEnter: () => {
          labelTl.to(lbls, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
            onComplete: () => {
              ScrollTrigger.create({
                trigger: section.current,
                start: "top top+=1",
                once: true,
                onEnter: () => gsap.to(lbls, { opacity: 0, y: -8, duration: 0.3, ease: "power2.out", overwrite: "auto" }),
              });
            },
          });
        },
      },
    });

    cleanup.current = () => {
      cancelAnimationFrame(rafId.current);
      st.kill();
      endSt.kill();
      labelTl.kill();
    };

    return () => cleanup.current?.();
  }, []);

  return (
    <section ref={section} className="relative min-h-screen w-full bg-surface overflow-hidden">
      {/* Full-viewport video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80vw] max-w-6xl">
          <AssemblyVideo onReady={handleVideoReady} />
        </div>
      </div>

      {/* Dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {/* Hero-style headline overlaying video */}
      <div ref={heroText} className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Scroll to Assemble
          </p>
          <h2 className="mt-4 font-heading text-4xl font-semibold text-white sm:text-5xl lg:text-6xl tracking-tight">
            From Components to Flight
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 font-body max-w-lg mx-auto">
            Every drone is a system. Understand how each part contributes to the whole — then build one yourself.
          </p>
        </div>
      </div>

      {/* Apple-style labels */}
      <div ref={labelsWrap} className="pointer-events-none absolute inset-0">
        {LABELS.map((l) => (
          <div key={l.text} className="absolute flex items-center gap-3" style={{ left: l.left, top: l.top }}>
            <span className="font-label text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 whitespace-nowrap drop-shadow-sm">
              {l.text}
            </span>
            <svg width="28" height="2" className="overflow-visible">
              <line x1="0" y1="1" x2="26" y2="1" stroke="white" strokeWidth="0.5" className="opacity-40" />
              <circle cx="27" cy="1" r="1.5" fill="white" className="opacity-60" />
            </svg>
          </div>
        ))}
      </div>

      {/* End state */}
      <div ref={endWrap} className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
        <div className="text-center max-w-md">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Built by Students.</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70 font-body">
            The drone assembled here is the same platform used in our Level 2 curriculum — designed, built, and flown by students.
          </p>
          <a href="#academy" className="pointer-events-auto mt-5 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a00] transition-opacity hover:opacity-70">
            Explore Level 2 &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
