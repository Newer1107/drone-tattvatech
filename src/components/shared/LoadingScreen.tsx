"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Clean loading screen — bars pulse, then dissolve away.             */
/*  No orange flash. The drone reveal is handled by PlayfulDrone.     */
/* ------------------------------------------------------------------ */

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"loading" | "outro">("loading");
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      setPhase("outro");
      setTimeout(() => {
        if (cancelled) return;
        onFinish();
      }, 500);
    };

    if (document.readyState === "complete") {
      setTimeout(finish, 1000);
    } else {
      window.addEventListener("load", () => setTimeout(finish, 1000));
    }

    return () => { cancelled = true; };
  }, [onFinish]);

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "#0b1220",
        opacity: phase === "outro" ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }}
    >
      {/* Bars */}
      <div className="flex items-center justify-center gap-[6px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block w-[4px] rounded-full"
            style={{
              height: "50px",
              background: "#ff6a00",
              animation: `loader-pulse 0.9s ease-in-out infinite`,
              animationDelay: `${-0.8 + i * 0.1}s`,
              opacity: phase === "outro" ? 0 : 1,
              transition: "opacity 0.35s ease",
              transitionDelay: phase === "outro" ? `${i * 0.06}s` : "0s",
            }}
          />
        ))}
      </div>

      {/* Brand */}
      <p
        className="absolute bottom-12 left-1/2 -translate-x-1/2 font-label text-[10px] uppercase tracking-[0.3em]"
        style={{
          color: "rgba(255,106,0,0.4)",
          opacity: phase === "outro" ? 0 : 1,
          transition: "opacity 0.4s ease 0.15s",
        }}
      >
        Tattva Tech
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inject keyframes once                                              */
/* ------------------------------------------------------------------ */

const styleId = "loader-style";

function injectStyles() {
  if (typeof document === "undefined" || document.getElementById(styleId)) return;
  const s = document.createElement("style");
  s.id = styleId;
  s.textContent = `
    @keyframes loader-pulse {
      0%, 40%, 100% { transform: scaleY(0.05); }
      20% { transform: scaleY(1); }
    }
  `;
  document.head.appendChild(s);
}

injectStyles();
