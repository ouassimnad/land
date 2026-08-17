"use client";

import { useState, useEffect } from "react";

export default function AnnouncementBar({ items, dir = "ltr" }: { items: string[], dir?: "ltr" | "rtl" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateState, setAnimateState] = useState<"enter" | "center" | "exit">("enter");

  useEffect(() => {
    // Sequence per item: enter from right (0.5s) -> hold in center (2.5s) -> exit to left (0.5s) -> next item
    const enterTimer = setTimeout(() => {
      setAnimateState("center");
    }, 50); // slight delay to allow the off-screen position to paint before transitioning

    const exitTimer = setTimeout(() => {
      setAnimateState("exit");
    }, 3000); // stay in center for 3 seconds

    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setAnimateState("enter");
    }, 3500); // switch to next item right after the exit animation

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIndex, items.length]);

  return (
    <div className="overflow-hidden w-full h-10 flex items-center justify-center relative bg-[#E7D0D0] text-[#617549] text-base md:text-lg font-bold" dir={dir}>
      <div
        key={currentIndex}
        className="absolute whitespace-nowrap will-change-transform"
        style={{
          transform:
            animateState === "enter"
              ? "translateX(100vw)"
              : animateState === "exit"
              ? "translateX(-100vw)"
              : "translateX(0)",
          transition: animateState === "enter" ? "none" : "transform 0.5s ease-in-out",
        }}
      >
        {items[currentIndex]}
      </div>
    </div>
  );
}
