"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Не показываем на тач-устройствах
    if ("ontouchstart" in window) return;

    const cur = curRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    // Создаём точки хвоста
    const dots: { el: HTMLDivElement; x: number; y: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = document.createElement("div");
      const s = 3.5 - i * 0.4;
      d.className = "trail-dot";
      d.style.cssText = `
        position:fixed;pointer-events:none;border-radius:50%;
        transform:translate(-50%,-50%);z-index:99988;
        background:rgba(37,99,235,.25);
        width:${s}px;height:${s}px;opacity:${0.35 - i * 0.04};
      `;
      document.body.appendChild(d);
      dots.push({ el: d, x: 0, y: 0 });
      trailRefs.current.push(d);
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";
    };

    // Увеличение курсора при наведении на интерактивные элементы
    const onEnter = () => document.body.classList.add("cursor-big");
    const onLeave = () => document.body.classList.remove("cursor-big");

    document.addEventListener("mousemove", onMove);

    const interactiveSelector = "a,button,.card,.dc,.btn";
    const attachHover = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attachHover();
    const mutObs = new MutationObserver(attachHover);
    mutObs.observe(document.body, { childList: true, subtree: true });

    // Анимация кольца (плавное следование)
    let ringAnim: number;
    const animRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      ringAnim = requestAnimationFrame(animRing);
    };
    animRing();

    // Анимация хвоста
    let trailAnim: number;
    const animTrail = () => {
      let px = mx, py = my;
      dots.forEach((d, i) => {
        d.x += (px - d.x) * (0.3 - i * 0.03);
        d.y += (py - d.y) * (0.3 - i * 0.03);
        d.el.style.left = d.x + "px";
        d.el.style.top = d.y + "px";
        px = d.x;
        py = d.y;
      });
      trailAnim = requestAnimationFrame(animTrail);
    };
    animTrail();

    // Скрываем системный курсор
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", onMove);
      mutObs.disconnect();
      cancelAnimationFrame(ringAnim);
      cancelAnimationFrame(trailAnim);
      document.body.style.cursor = "";
      document.body.classList.remove("cursor-big");
      dots.forEach((d) => d.el.remove());
    };
  }, []);

  // Не рендерить на тач-устройствах (проверяем на клиенте через CSS)
  return (
    <>
      <div
        ref={curRef}
        id="cursor"
        style={{
          position: "fixed", zIndex: 99990, pointerEvents: "none",
          width: 10, height: 10, borderRadius: "50%",
          background: "var(--blue)",
          transform: "translate(-50%,-50%)",
          transition: "width .25s, height .25s, background .25s, opacity .25s",
          mixBlendMode: "multiply",
        }}
      />
      <div
        ref={ringRef}
        id="cursor-ring"
        style={{
          position: "fixed", zIndex: 99989, pointerEvents: "none",
          width: 38, height: 38, borderRadius: "50%",
          border: "1.5px solid rgba(37,99,235,.35)",
          transform: "translate(-50%,-50%)",
          transition: "width .4s cubic-bezier(.16,1,.3,1), height .4s cubic-bezier(.16,1,.3,1), border-color .25s",
        }}
      />
      <style>{`
        @media (pointer: coarse) {
          #cursor, #cursor-ring, .trail-dot { display: none !important; }
          body { cursor: auto !important; }
        }
        .cursor-big #cursor { width: 5px !important; height: 5px !important; }
        .cursor-big #cursor-ring { width: 52px !important; height: 52px !important; border-color: rgba(37,99,235,.6) !important; }
        a, button, .card, .dc, .btn { cursor: none; }
      `}</style>
    </>
  );
}
