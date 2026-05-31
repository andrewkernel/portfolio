"use client";

import { useEffect, useState, type ReactNode } from "react";

const BASE_WIDTH = 1280;
const RENDER_WIDTH = 1920;
const RENDER_HEIGHT = 1080;
const INTERNAL_SCALE = RENDER_WIDTH / BASE_WIDTH;

type ScaledCanvasProps = {
  children: ReactNode;
};

export function ScaledCanvas({ children }: ScaledCanvasProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.max(window.innerWidth / RENDER_WIDTH, window.innerHeight / RENDER_HEIGHT));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[1080px] w-[1920px]"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          className="absolute left-0 top-0 h-[768px] w-[1280px]"
          style={{
            transform: `scale(${INTERNAL_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
