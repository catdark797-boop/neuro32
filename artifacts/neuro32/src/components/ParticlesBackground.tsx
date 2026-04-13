import { useEffect, useRef } from 'react';

interface Config {
  count?: number;
  maxDist?: number;
  mouseRadius?: number;
  mouseForce?: number;
  speed?: number;
}

export default function ParticlesBackground({
  count = 80,
  maxDist = 130,
  mouseRadius = 160,
  mouseForce = 0.018,
  speed = 0.35,
}: Config) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    type Node = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; pulse: number; pulseSpeed: number;
    };

    const nodes: Node[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 1.5 + 0.8,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.018 + Math.random() * 0.02,
    }));

    const AMBER = [240, 165, 0] as const;
    const BLUE  = [80, 120, 255] as const;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const n of nodes) {
        n.pulse += n.pulseSpeed;
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * mouseForce;
          n.vx += dx / dist * force;
          n.vy += dy / dist * force;
        }

        n.vx *= 0.998;
        n.vy *= 0.998;

        const maxV = speed * 2.2;
        const v = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (v > maxV) { n.vx = n.vx / v * maxV; n.vy = n.vy / v * maxV; }

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0)  { n.x = 0; n.vx *= -1; }
        if (n.x > W)  { n.x = W; n.vx *= -1; }
        if (n.y < 0)  { n.y = 0; n.vy *= -1; }
        if (n.y > H)  { n.y = H; n.vy *= -1; }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > maxDist) continue;
          const t = 1 - d / maxDist;

          const aMouse = Math.sqrt((mx - a.x) ** 2 + (my - a.y) ** 2);
          const bMouse = Math.sqrt((mx - b.x) ** 2 + (my - b.y) ** 2);
          const closestToMouse = Math.min(aMouse, bMouse);
          const nearMouse = closestToMouse < mouseRadius * 1.4;
          const mouseT = nearMouse ? Math.max(0, 1 - closestToMouse / (mouseRadius * 1.4)) : 0;

          const [rA, gA] = AMBER;
          const [rB, gB, blB] = BLUE;
          const r = Math.round(lerp(rB, rA, mouseT));
          const g = Math.round(lerp(gB, gA, mouseT));
          const bl = Math.round(lerp(blB, 0, mouseT));
          const alpha = t * lerp(0.1, 0.5, mouseT) + (nearMouse ? 0 : 0.05);

          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth = t * lerp(0.5, 1.4, mouseT);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        const distM = Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2);
        const nearFactor = distM < mouseRadius ? Math.max(0, 1 - distM / mouseRadius) : 0;
        const pulseFactor = 0.7 + Math.sin(n.pulse) * 0.3;

        const [rA, gA] = AMBER;
        const [rB, , blB] = BLUE;
        const r = Math.round(lerp(rB, rA, nearFactor));
        const gVal = Math.round(lerp(80, gA, nearFactor));
        const bl = Math.round(lerp(blB, 0, nearFactor));
        const brightness = lerp(0.22, 0.85, nearFactor) * pulseFactor;
        const radius = n.r * lerp(1, 2.2, nearFactor);

        if (nearFactor > 0.05) {
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 6 * nearFactor);
          grad.addColorStop(0, `rgba(${r},${gVal},${bl},${brightness * 0.4})`);
          grad.addColorStop(1, `rgba(${r},${gVal},${bl},0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 6 * nearFactor, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${gVal},${bl},${brightness})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [count, maxDist, mouseRadius, mouseForce, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
