"use client";

import { useRef, useCallback } from "react";

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function CardTilt({ children, className = "", intensity = 10 }: CardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateY(-7px) scale(1.01)`;

    // Обновляем card-glow
    const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    el.style.setProperty("--gx", gx + "%");
    el.style.setProperty("--gy", gy + "%");
  }, [intensity]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
