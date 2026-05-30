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
      <AnimatePresence mode="wait">
        {stage === "boot" ? (
          <BootScreen key="boot" onComplete={() => setStage("desktop")} />
        ) : null}
        {stage === "desktop" ? <Desktop key="desktop" /> : null}
      </AnimatePresence>
    </main>
  );
}

