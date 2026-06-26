"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/*  Register GSAP + ScrollTrigger once (call at app entry)            */
/* ------------------------------------------------------------------ */

export function useGsap() {
  // Call this once in the layout to register plugins
}

/* ------------------------------------------------------------------ */
/*  Stagger entrance — each child fades up as it scrolls into view    */
/*  Usage: <div ref={ref}><div className="gsap-reveal">...</div></div> */
/* ------------------------------------------------------------------ */

export function useStaggerReveal(
  selector: string,
  opts?: {
    stagger?: number;
    y?: number;
    duration?: number;
    start?: string;
    once?: boolean;
  },
) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    stagger = 0.12,
    y = 40,
    duration = 0.7,
    start = "top 85%",
    once = true,
  } = opts || {};

  useGSAP(
    () => {
      const els = ref.current?.querySelectorAll(selector);
      if (!els || els.length === 0) return;

      gsap.fromTo(
        els,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: once ? "play none none none" : "play reverse play reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Single element fade-up (for section headers, etc.)                */
/* ------------------------------------------------------------------ */

export function useFadeUp(
  opts?: {
    y?: number;
    duration?: number;
    start?: string;
    delay?: number;
  },
) {
  const ref = useRef<HTMLDivElement>(null);
  const { y = 40, duration = 0.7, start = "top 85%", delay = 0 } = opts || {};

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Timeline pin + scrub — pins element while animating children      */
/* ------------------------------------------------------------------ */

export function usePinTimeline(
  opts?: {
    end?: string;
    scrub?: number;
  },
) {
  const ref = useRef<HTMLDivElement>(null);
  const { end = "+=1000", scrub = 1 } = opts || {};

  const createTimeline = (
    buildFn: (tl: gsap.core.Timeline) => void,
    deps?: unknown[],
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGSAP(
      () => {
        if (!ref.current) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end,
            pin: true,
            scrub,
          },
        });
        buildFn(tl);
      },
      { scope: ref, dependencies: deps },
    );
  };

  return { ref, createTimeline };
}

/* ------------------------------------------------------------------ */
/*  Progress bar fill (for the PlayfulDrone)                           */
/* ------------------------------------------------------------------ */

export function useProgressBar(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      el.style.height = `${pct}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ref]);
}
