"use client";

import { useEffect, useRef } from "react";

export function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fragments = document.createDocumentFragment();
    const count = 20;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #ff6a00;
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
        left: ${left}%;
        animation: particle-float ${duration}s -${delay}s infinite linear;
      `;
      fragments.appendChild(particle);
    }

    container.appendChild(fragments);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" />;
}
