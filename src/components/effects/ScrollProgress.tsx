"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0) setWidth((window.scrollY / total) * 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, height: 2,
        background: "var(--g1)", zIndex: 998,
        width: `${width}%`,
        transition: "width .12s",
        boxShadow: "0 0 8px rgba(37,99,235,.4)",
      }}
    />
  );
}
