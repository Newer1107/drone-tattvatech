"use client";

import { motion } from "framer-motion";
import { HiMenu } from "react-icons/hi";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollPosition } from "@/hooks/useScrollPosition";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Navigation() {
  const { scrollY } = useScrollPosition();
  const scrolled = scrollY > 50;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-surface/90 shadow-lg backdrop-blur-xl"
          : "border-transparent bg-surface/80 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="text-xl font-bold tracking-tight" style={{ color: "#a14000" }}>
          Tattva Tech
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-widest text-on-surface-variant transition-colors hover:text-[#ff6a00]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#enroll"
            className="rounded-full bg-[#ff6a00] px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e05e00] active:translate-y-px"
          >
            Enroll Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="flex size-9 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-muted">
              <HiMenu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col">
              <SheetHeader>
                <SheetTitle
                  className="text-left text-xl font-bold"
                  style={{ color: "#a14000" }}
                >
                  Tattva Tech
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pt-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose
                    key={link.href}
                    className="w-full"
                    render={
                      <button
                        onClick={() => { window.location.hash = link.href; }}
                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium uppercase tracking-widest text-on-surface transition-colors hover:bg-muted hover:text-[#ff6a00]"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </div>
              <div className="mt-auto px-4 pb-8">
                <SheetClose
                  className="w-full"
                  render={
                    <button
                      onClick={() => { window.location.hash = "#enroll"; }}
                      className="flex w-full items-center justify-center rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#e05e00] active:translate-y-px"
                    />
                  }
                >
                  Enroll Now
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
