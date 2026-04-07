"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number; hue: number;
  pulse: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const N = 55;
    let nodes: Node[] = [];
    let animId: number;

    function resize() {
      const parent = c!.parentElement;
      if (parent) {
        W = c!.width = parent.offsetWidth;
        H = c!.height = parent.offsetHeight;
      }
    }

    function init() {
      nodes = [];
      for (let i = 0; i < N; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 0.8,
          hue: [210, 245, 270][Math.floor(Math.random() * 3)],
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const t = Date.now() / 1000;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;

        // Линии между близкими узлами
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(37,99,235,${(1 - d / 120) * 0.12})`;
            ctx!.lineWidth = 0.7;
            ctx!.stroke();
          }
        }

        // Пульсирующие узлы
        const p = 0.5 + 0.5 * Math.sin(t * 2 + a.pulse);
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, a.r * p, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${a.hue},80%,60%,${0.35 * p})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, zIndex: 0,
        pointerEvents: "none", opacity: 0.5,
      }}
    />
  );
}
