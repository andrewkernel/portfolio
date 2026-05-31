"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BootScreen } from "./boot-screen";
import { Desktop } from "./desktop";

type Stage = "boot" | "desktop";

export function AndrewDangOS() {
  const [stage, setStage] = useState<Stage>("boot");

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="grid h-full place-items-center bg-[#0078d7] px-[26px] md:hidden">
        <section className="w-full max-w-[420px] border border-white/40 bg-[#f4f4f4] text-[#222] shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
          <div className="flex h-[34px] items-center gap-[8px] bg-white px-[12px] text-[12px]">
            <span className="grid size-[16px] grid-cols-2 gap-[1px]">
              <i className="bg-[#0078d7]" /><i className="bg-[#0078d7]" />
              <i className="bg-[#0078d7]" /><i className="bg-[#0078d7]" />
            </span>
            Andrew Dang Portfolio
          </div>
          <div className="px-[22px] py-[28px]">
            <p className="text-[12px] font-semibold uppercase text-[#0067b8]">Preview notice</p>
            <h1 className="pt-[7px] text-[28px] font-semibold leading-[1.08]">Mobile is still in testing.</h1>
            <p className="pt-[14px] text-[14px] leading-[1.55] text-[#555]">
              Open this portfolio on a desktop or laptop for the full Windows experience.
            </p>
          </div>
        </section>
      </div>
      <div className="hidden h-full md:block">
        <AnimatePresence mode="wait">
          {stage === "boot" ? (
            <BootScreen key="boot" onComplete={() => setStage("desktop")} />
          ) : null}
          {stage === "desktop" ? <Desktop key="desktop" /> : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

