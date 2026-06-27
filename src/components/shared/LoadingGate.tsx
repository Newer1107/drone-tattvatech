"use client";

import { useState, useCallback } from "react";
import { LoadingScreen } from "./LoadingScreen";

export function LoadingGate({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const handleFinish = useCallback(() => {
    setLoaded(true);
  }, []);

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
