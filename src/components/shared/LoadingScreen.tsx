"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  A loading screen with an iris-reveal transition into the website   */
/*  Bars pulse → converge → flash → portal opens → site fades in.    */
/* ------------------------------------------------------------------ */

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"loading" | "converge" | "flash" | "portal" | "done">("loading");
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1 — Loading bars pulse for a minimum time, then finish when ready
    let cancelled = false;

    const startConverge = () => {
      if (cancelled) return;
      setPhase("converge");

      // 2 — After converge animation, trigger flash
      setTimeout(() => {
        if (cancelled) return;
        setPhase("flash");

        // 3 — Flash → portal opening
        setTimeout(() => {
          if (cancelled) return;
          setPhase("portal");

          // 4 — Portal fully open → done
          setTimeout(() => {
            if (cancelled) return;
            setPhase("done");
            onFinish();
          }, 500);
        }, 400);
      }, 600);
    };

    // Wait for the page to fully load, then start the transition
    if (document.readyState === "complete") {
      // Small delay so the loader is seen for at least a moment
      setTimeout(startConverge, 800);
    } else {
      window.addEventListener("load", () => {
        setTimeout(startConverge, 800);
      });
    }

    return () => { cancelled = true; };
  }, [onFinish]);

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: phase === "flash"
          ? "#ff6a00"
          : phase === "portal"
            ? "#ff6a00"
            : phase === "done"
              ? "transparent"
              : "#0b1220",
        transition: phase === "done" ? "background 0.4s ease" : "none",
      }}
    >
      {/* Background gradient rings for portal effect */}
      <div
        className="absolute rounded-full"
        style={{
          width: phase === "portal" ? "300vw" : "0vw",
          height: phase === "portal" ? "300vw" : "0vw",
          background: "radial-gradient(circle, rgba(255,106,0,0.3) 0%, transparent 70%)",
          transition: phase === "portal" ? "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
          opacity: phase === "portal" ? 0 : 1,
        }}
      />

      {/* Bars */}
      <div
        className="flex items-center justify-center gap-[6px]"
        style={{
          opacity: phase === "converge" || phase === "flash" || phase === "portal" ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block w-[4px] rounded-full"
            style={{
              height: phase === "converge" ? "0px" : "50px",
              background: "#ff6a00",
              animation:
                phase === "loading"
                  ? `loader-pulse 0.9s ease-in-out infinite`
                  : "none",
              animationDelay: phase === "loading" ? `-${0.8 - i * 0.1}s` : "0s",
              transition: "height 0.4s ease, opacity 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Converge glow — bars collapse to a bright point */}
      <div
        className="absolute rounded-full"
        style={{
          width: phase === "flash" ? "40vw" : phase === "converge" ? "8px" : "0px",
          height: phase === "flash" ? "40vw" : phase === "converge" ? "8px" : "0px",
          background: phase === "flash"
            ? "radial-gradient(circle, rgba(255,255,255,0.9) 0%, #ff6a00 40%, transparent 70%)"
            : "#ff6a00",
          transition: phase === "converge"
            ? "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            : phase === "flash"
              ? "all 0.25s ease-out"
              : "none",
          boxShadow: phase === "flash"
            ? "0 0 200px 100px rgba(255,106,0,0.6)"
            : phase === "converge"
              ? "0 0 40px 10px rgba(255,106,0,0.8)"
              : "none",
          opacity: phase === "portal" || phase === "done" ? 0 : 1,
        }}
      />

      {/* Flash overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "white",
          opacity: phase === "flash" ? 0.6 : 0,
          transition: "opacity 0.15s ease-out",
          pointerEvents: "none",
        }}
      />

      {/* Subtle brand name that fades during transition */}
      <p
        className="absolute bottom-12 left-1/2 -translate-x-1/2 font-label text-[10px] uppercase tracking-[0.3em]"
        style={{
          color: phase === "done" ? "transparent" : "rgba(255,106,0,0.5)",
          transition: "color 0.4s ease",
          opacity: phase === "converge" ? 0 : 1,
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
