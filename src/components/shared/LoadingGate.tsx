"use client";

import { useState, useCallback, useEffect } from "react";
import { LoadingScreen } from "./LoadingScreen";

export function LoadingGate({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const handleFinish = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      document.body.classList.add("app-loaded");
    }
  }, [loaded]);

  return (
    <>
      {!loaded && <LoadingScreen onFinish={handleFinish} />}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
