"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CounterAnimation({ target, suffix = "", duration = 1400, className = "" }: CounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();

          function update(now: number) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * ease));
            if (p < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {value}{suffix}
    </span>
  );
}
