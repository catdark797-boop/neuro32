"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setOut(true), 2200);
    const timer2 = setTimeout(() => setHidden(true), 2900);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  if (hidden) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#ffffff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 24,
        transition: "opacity .7s ease, transform .7s ease",
        opacity: out ? 0 : 1,
        transform: out ? "scale(1.03)" : "none",
        pointerEvents: out ? "none" : "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="loaderG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <path d="M20 2L36 11v18L20 38 4 29V11z" fill="url(#loaderG)" opacity="0.12" />
          <path d="M20 2L36 11v18L20 38 4 29V11z" fill="none" stroke="url(#loaderG)" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="3" fill="url(#loaderG)" />
        </svg>
        <span style={{ fontFamily: "var(--font-d)", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-.03em", color: "var(--ink)" }}>
          НЕЙРО{" "}
          <span style={{ background: "var(--g1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            32
          </span>
        </span>
      </div>

      <div style={{ width: 220, height: 3, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%", width: "0%", borderRadius: 2,
            background: "var(--g1)",
            animation: "lbar 2.2s cubic-bezier(.4,0,.2,1) forwards",
          }}
        />
      </div>

      <span style={{ fontSize: "1rem", color: "var(--ink4)", letterSpacing: ".06em" }}>
        Лаборатория ИИ-технологий
      </span>

      <style>{`@keyframes lbar { to { width: 100%; } }`}</style>
    </div>
  );
}
