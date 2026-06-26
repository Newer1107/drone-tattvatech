declare module "lenis" {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: "vertical" | "horizontal";
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
  }

  class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
    scrollTo(target: string | number | HTMLElement, options?: object): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
  }

  export default Lenis;
}
