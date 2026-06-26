"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 12}px, ${mouseY - 12}px)`;
    };

    const animate = () => {
      trailX += (mouseX - trailX) * 0.08;
      trailY += (mouseY - trailY) * 0.08;
      trail.style.transform = `translate(${trailX - 4}px, ${trailY - 4}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    animate();

    // Hide cursor on touch devices
    const isTouch = "ontouchstart" in window;
    if (isTouch) {
      cursor.style.display = "none";
      trail.style.display = "none";
    }

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-[#ff6a00]/50 pointer-events-none z-[9999] hidden md:block transition-opacity duration-300"
        style={{ transform: "translate(0, 0)" }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#ff6a00]/30 pointer-events-none z-[9998] hidden md:block"
        style={{ transform: "translate(0, 0)" }}
      />
    </>
  );
}
