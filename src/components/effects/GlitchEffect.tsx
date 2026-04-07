"use client";

import { useEffect } from "react";

export function GlitchEffect() {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function glitch() {
      const headings = document.querySelectorAll("main h1, main h2");
      if (headings.length) {
        const h = headings[Math.floor(Math.random() * headings.length)] as HTMLElement;
        h.style.textShadow = "2px 0 #2563eb, -2px 0 #7c3aed";
        h.style.transform = "translateX(1.5px)";
        setTimeout(() => {
          h.style.textShadow = "";
          h.style.transform = "";
        }, 90);
      }
      timeout = setTimeout(glitch, Math.random() * 5000 + 3500);
    }

    timeout = setTimeout(glitch, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return null;
}
