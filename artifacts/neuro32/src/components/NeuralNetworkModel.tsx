import { useEffect, useRef, useState, useMemo } from 'react';

/**
 * 3D interactive AI-tools globe.
 * - CSS 3D transforms + SVG grid (no three.js).
 * - Drag to rotate, release to coast with inertia, idle → slow auto-rotate.
 * - Hover a node → tooltip with category + what-we-teach.
 * - prefers-reduced-motion: static, still hoverable.
 */

interface AITool {
  name: string;
  category: 'LLM' | 'Изображения' | 'Видео' | 'Звук' | 'Код' | 'Автоматизация' | 'Безопасность' | 'Дети';
  desc: string;          // what we actually teach
  icon: string;          // short emoji / abbreviation
  color: string;         // tint for node
}

const AI_TOOLS: AITool[] = [
  { name: 'ChatGPT',       category: 'LLM',          desc: 'Промпт-инжиниринг, анализ, генерация текста.',        icon: '💬', color: '#10a37f' },
  { name: 'Claude',        category: 'LLM',          desc: 'Длинный контекст, анализ документов, кода.',          icon: '🧠', color: '#c084fc' },
  { name: 'YandexGPT',     category: 'LLM',          desc: 'Русскоязычные задачи: тексты, саммари, отчёты.',      icon: 'Я', color: '#ff0000' },
  { name: 'GigaChat',      category: 'LLM',          desc: 'Модель Сбера: деловая переписка, код на русском.',    icon: 'G', color: '#22c55e' },
  { name: 'Midjourney',    category: 'Изображения',  desc: 'Художественная генерация картинок по описанию.',      icon: '🎨', color: '#ec4899' },
  { name: 'DALL-E 3',      category: 'Изображения',  desc: 'Быстрая иллюстрация, логотипы, рекламные баннеры.',   icon: '🖼️', color: '#f59e0b' },
  { name: 'Stable Diff.',  category: 'Изображения',  desc: 'Локальная генерация, тонкая настройка стиля.',        icon: '🌀', color: '#8b5cf6' },
  { name: 'Шедеврум',      category: 'Изображения',  desc: 'Русский Яндекс-генератор — быстро и без VPN.',        icon: 'Ш', color: '#ff0000' },
  { name: 'Sora',          category: 'Видео',        desc: 'Видео из текста: ролики и анимация по описанию.',     icon: '🎬', color: '#06b6d4' },
  { name: 'Kling AI',      category: 'Видео',        desc: 'Генерация видео 5–10 сек — для Reels/Shorts.',        icon: '🎥', color: '#3b82f6' },
  { name: 'Runway',        category: 'Видео',        desc: 'Монтаж, удаление фона, motion-magic на видео.',       icon: '🎞️', color: '#a855f7' },
  { name: 'Suno AI',       category: 'Звук',         desc: 'Музыка и песни с текстом по промпту.',                icon: '🎵', color: '#ef4444' },
  { name: 'ElevenLabs',    category: 'Звук',         desc: 'Клонирование голоса, озвучка видео.',                 icon: '🎙️', color: '#fb923c' },
  { name: 'Gamma.app',     category: 'Автоматизация', desc: 'Презентации из текстового брифа за минуты.',          icon: '📊', color: '#14b8a6' },
  { name: 'Notion AI',     category: 'Автоматизация', desc: 'Саммари, таблицы, планировщики на базе GPT.',         icon: '📝', color: '#e5e7eb' },
  { name: 'Make.com',      category: 'Автоматизация', desc: 'No-code интеграции: CRM, почта, соцсети.',            icon: '🔗', color: '#6b7280' },
  { name: 'Python',        category: 'Код',          desc: 'Скрипты, парсеры, микросервисы и ИИ-интеграции.',     icon: '🐍', color: '#3776ab' },
  { name: 'Claude Code',   category: 'Код',          desc: 'AI-агент, который пишет и правит код под твой проект.', icon: '⌘', color: '#a855f7' },
  { name: 'Scratch',       category: 'Дети',         desc: 'Визуальное программирование для детей 7–12.',         icon: '🧒', color: '#f97316' },
  { name: 'Алиса',         category: 'Дети',         desc: 'Умный голосовой помощник для игр и учёбы.',           icon: '🔺', color: '#ff0066' },
  { name: 'Telegram Bot',  category: 'Автоматизация', desc: 'Свой бот за 1 урок: уведомления, команды, кнопки.',   icon: '✈️', color: '#3b82f6' },
  { name: 'aiogram',       category: 'Код',          desc: 'Python-фреймворк для продвинутых Telegram-ботов.',     icon: '🐍', color: '#22c55e' },
  { name: 'Kali Linux',    category: 'Безопасность', desc: 'Хакерский дистрибутив: разбор уязвимостей.',          icon: '🐉', color: '#38bdf8' },
  { name: 'DVWA',          category: 'Безопасность', desc: 'Тренажёр веб-уязвимостей — SQL inj, XSS, CSRF.',       icon: '🛡️', color: '#ef4444' },
];

interface NodePos {
  x: number; y: number; z: number;   // unit sphere
  tool: AITool;
}

// Fibonacci sphere — even distribution
function buildNodes(tools: AITool[]): NodePos[] {
  const n = tools.length;
  const gold = Math.PI * (3 - Math.sqrt(5));
  return tools.map((tool, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = gold * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, tool };
  });
}

// Simple multiply a 3-vector by rotation (Ry then Rx)
function rotate(v: { x: number; y: number; z: number }, rx: number, ry: number) {
  // Ry
  const cy = Math.cos(ry), sy = Math.sin(ry);
  let x = v.x * cy + v.z * sy;
  let z = -v.x * sy + v.z * cy;
  let y = v.y;
  // Rx
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const y2 = y * cx - z * sx;
  const z2 = y * sx + z * cx;
  return { x, y: y2, z: z2 };
}

export default function NeuralNetworkModel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef({ rx: 0.1, ry: 0 });
  const velRef = useRef({ rx: 0, ry: 0.003 });         // baseline slow auto-rotate
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0, lastT: 0 });
  const idleRef = useRef(Date.now());
  const [hovered, setHovered] = useState<AITool | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const nodes = useMemo(() => buildNodes(AI_TOOLS), []);

  useEffect(() => {
    let rafId = 0;
    const step = () => {
      const now = Date.now();
      const idleMs = now - idleRef.current;

      // If not dragging: apply inertia or baseline auto-rotate
      if (!dragRef.current.active) {
        const v = velRef.current;
        if (reducedMotion) {
          v.rx = 0; v.ry = 0;
        } else if (idleMs < 2500) {
          // post-drag coasting: damp velocity
          v.rx *= 0.94;
          v.ry *= 0.94;
        } else {
          // baseline auto-rotate: slow horizontal spin, decay any vertical residue
          v.ry = v.ry * 0.92 + 0.0025 * 0.08;
          v.rx *= 0.92;
        }
        rotRef.current.ry += v.ry;
        rotRef.current.rx += v.rx;
        // clamp rx to prevent flipping
        rotRef.current.rx = Math.max(-1.1, Math.min(1.1, rotRef.current.rx));
      }
      setTick((t) => t + 1);
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY, lastT: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    idleRef.current = Date.now();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    const now = performance.now();
    const dt = Math.max(1, now - dragRef.current.lastT);
    rotRef.current.ry += dx * 0.008;
    rotRef.current.rx = Math.max(-1.1, Math.min(1.1, rotRef.current.rx + dy * 0.008));
    velRef.current.ry = (dx / dt) * 8;
    velRef.current.rx = (dy / dt) * 8;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastT = now;
    idleRef.current = Date.now();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    idleRef.current = Date.now();
  };

  const { rx, ry } = rotRef.current;

  // Project nodes to 2D
  const R = 180;              // sphere radius in px
  const cx = 220, cy = 220;   // container center
  const projected = nodes.map((n, i) => {
    const p = rotate(n, rx, ry);
    // depth for scaling & fade
    const depth = (p.z + 1) / 2;              // 0 back → 1 front
    const scale = 0.55 + 0.65 * depth;
    const opacity = 0.15 + 0.85 * depth;
    return {
      i,
      tool: n.tool,
      x: cx + p.x * R,
      y: cy + p.y * R,
      z: p.z,
      scale,
      opacity,
    };
  }).sort((a, b) => a.z - b.z);           // paint back-to-front

  void tick; // force re-render every raf

  return (
    <div
      className="globe-wrap"
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 440,
        cursor: reducedMotion ? 'default' : dragRef.current.active ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      aria-label="Интерактивный глобус ИИ-инструментов"
      role="img"
    >
      {/* Ambient glow behind sphere */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(240,165,0,0.09) 0%, rgba(74,124,255,0.04) 35%, transparent 65%)',
      }} />

      <svg
        viewBox="0 0 440 440"
        style={{ width: '100%', height: '100%', display: 'block', maxHeight: 540 }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sphereFill" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0%" stopColor="rgba(240,165,0,0.16)" />
            <stop offset="45%" stopColor="rgba(74,124,255,0.08)" />
            <stop offset="100%" stopColor="rgba(10,10,18,0.0)" />
          </radialGradient>
          <radialGradient id="nodeCore" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sphere disk */}
        <circle cx={cx} cy={cy} r={R} fill="url(#sphereFill)" />

        {/* Latitude / longitude grid */}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const radY = Math.sin((lat * Math.PI) / 180) * R;
          const radX = Math.cos((lat * Math.PI) / 180) * R;
          return (
            <ellipse
              key={`lat-${lat}`}
              cx={cx}
              cy={cy + radY * Math.cos(rx)}
              rx={radX}
              ry={Math.max(1, Math.abs(radX * Math.sin(rx))) || 1}
              fill="none"
              stroke="rgba(240,165,0,0.12)"
              strokeWidth="0.6"
            />
          );
        })}
        {/* Longitude lines — 8 ellipses rotated */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (Math.PI * i) / 8 + ry;
          const rxScale = Math.abs(Math.sin(angle));
          return (
            <ellipse
              key={`lng-${i}`}
              cx={cx}
              cy={cy}
              rx={Math.max(1, rxScale * R)}
              ry={R}
              fill="none"
              stroke="rgba(74,124,255,0.08)"
              strokeWidth="0.5"
              transform={`rotate(${(rx * 180) / Math.PI} ${cx} ${cy})`}
            />
          );
        })}

        {/* Sphere edge halo */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(240,165,0,0.22)" strokeWidth="1" />

        {/* Nodes */}
        {projected.map(({ tool, x, y, scale, opacity, i }) => {
          const isFront = opacity > 0.6;
          const r = 6 * scale;
          return (
            <g
              key={i}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
              onMouseEnter={(e) => {
                setHovered(tool);
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHovered(null)}
            >
              {/* glow halo (front nodes only) */}
              {isFront && (
                <circle cx={x} cy={y} r={r * 3} fill={tool.color} opacity={opacity * 0.14} />
              )}
              <circle cx={x} cy={y} r={r} fill={tool.color} opacity={opacity * 0.95} />
              <circle cx={x} cy={y} r={r * 0.5} fill="#fff" opacity={opacity * 0.8} />
              {isFront && (
                <text
                  x={x}
                  y={y + r + 10}
                  fill="rgba(255,255,255,0.7)"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize={9 * scale}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {tool.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Instructions chip */}
      <div style={{
        position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center',
        pointerEvents: 'none', fontFamily: 'var(--fm)', fontSize: '.58rem',
        color: 'rgba(240,165,0,0.55)', letterSpacing: '.08em', textTransform: 'uppercase',
      }}>
        ⚡ Крути мышью · Наведи на точку — узнаешь инструмент
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            left: tooltipPos.x + 16,
            top: tooltipPos.y + 16,
            maxWidth: 280,
            pointerEvents: 'none',
            background: 'rgba(10,10,18,0.96)',
            border: `1px solid ${hovered.color}55`,
            borderRadius: 12,
            padding: '12px 14px',
            boxShadow: `0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px ${hovered.color}33`,
            zIndex: 9999,
            fontFamily: 'var(--fm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '1rem' }}>{hovered.icon}</span>
            <div style={{
              fontFamily: 'var(--fu, "Unbounded", sans-serif)',
              fontWeight: 700, fontSize: '.88rem', color: '#fff',
            }}>{hovered.name}</div>
          </div>
          <div style={{
            display: 'inline-block',
            fontSize: '.55rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
            color: hovered.color, background: `${hovered.color}18`,
            padding: '3px 8px', borderRadius: 8, marginBottom: 8,
          }}>
            {hovered.category}
          </div>
          <div style={{ fontSize: '.75rem', color: 'var(--t2)', lineHeight: 1.55 }}>
            {hovered.desc}
          </div>
        </div>
      )}
    </div>
  );
}
