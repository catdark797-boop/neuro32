import { useState, useRef, useEffect } from 'react';
import ShareButton from './ShareButton';
import Roadmap from './Roadmap';
import type { Phase } from './Roadmap';
export type { Phase };

/* ── helpers ─────────────────────────────────────────── */
function accentDim(a: string) {
  return a === 'var(--amber)' ? 'rgba(240,165,0,.25)' : 'rgba(16,185,129,.25)';
}
function accentBg(a: string) {
  return a === 'var(--amber)'
    ? 'linear-gradient(90deg,rgba(240,165,0,.09),rgba(240,165,0,.04))'
    : 'linear-gradient(90deg,rgba(16,185,129,.09),rgba(16,185,129,.04))';
}
function accentBadgeBg(a: string) {
  return a === 'var(--amber)' ? 'rgba(240,165,0,.06)' : 'rgba(16,185,129,.08)';
}
function isGreen(a: string) { return a !== 'var(--amber)'; }

/* ── UrgencyStrip ─────────────────────────────────────── */
export function UrgencyStrip({ onEnroll, program, slots = 3, accent = 'var(--amber)' }: {
  onEnroll?: (p?: string) => void;
  program: string;
  slots?: number;
  accent?: string;
}) {
  return (
    <div className="urgency-strip" style={{ borderColor: accentDim(accent), background: accentBg(accent) }}>
      <span className="urgency-live-dot" />
      <span style={{ fontSize: '.84rem', color: 'var(--t2)' }}>
        Осталось <strong style={{ color: accent }}>
          {slots} {slots === 1 ? 'место' : slots < 5 ? 'места' : 'мест'}
        </strong> · Старт <strong style={{ color: accent }}>4 мая</strong>
        {' · '}Пробное <strong style={{ color: accent }}>500 ₽</strong>
      </span>
      <button
        className="btn btn-sm"
        style={{ marginLeft: 'auto', background: accent, color: '#0a0a12', fontFamily: 'var(--fu)', fontSize: '.58rem', padding: '7px 14px', borderRadius: 8, whiteSpace: 'nowrap' }}
        onClick={() => onEnroll?.(program)}
      >
        Записаться на пробное →
      </button>
    </div>
  );
}

/* ── TrustMini ────────────────────────────────────────── */
export function TrustMini({ accent = 'rgba(240,165,0,.3)' }: { accent?: string }) {
  return (
    <div className="trust-mini">
      <img src="/denis.jpg" className="trust-mini-photo" alt="Степан Денис" style={{ borderColor: accent }} loading="lazy" width="48" height="48" />
      <div>
        <div className="trust-mini-name">Степан Денис</div>
        <div className="trust-mini-role">Практик с 2022 · ведёт занятия лично</div>
      </div>
    </div>
  );
}

/* ── VariantDecoration ────────────────────────────────── */
function VariantDecoration({ variant }: { variant: 'kids' | 'teens' | 'adults' | 'cyber' }) {
  const base: React.CSSProperties = {
    position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
  };
  if (variant === 'kids') return (
    <div style={base}>
      {[...Array(12)].map((_, i) => (
        <span key={i} className="vd-star" style={{
          left: `${8 + (i * 7.5) % 88}%`,
          top: `${10 + (i * 11.3) % 78}%`,
          animationDelay: `${(i * 0.37) % 3}s`,
          fontSize: `${0.7 + (i % 3) * 0.35}rem`,
          opacity: 0.25 + (i % 4) * 0.1,
        }}>{'✦'}</span>
      ))}
      <div className="vd-robot">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" opacity="0.07">
          <rect x="30" y="40" width="60" height="50" rx="8" fill="#f0a500"/>
          <rect x="45" y="20" width="30" height="22" rx="4" fill="#f0a500"/>
          <rect x="20" y="50" width="12" height="30" rx="6" fill="#f0a500"/>
          <rect x="88" y="50" width="12" height="30" rx="6" fill="#f0a500"/>
          <circle cx="47" cy="58" r="7" fill="#0a0a12"/>
          <circle cx="73" cy="58" r="7" fill="#0a0a12"/>
          <rect x="45" y="72" width="30" height="6" rx="3" fill="#0a0a12"/>
          <line x1="60" y1="20" x2="60" y2="10" stroke="#f0a500" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="60" cy="7" r="4" fill="#f0a500"/>
        </svg>
      </div>
    </div>
  );
  if (variant === 'teens') return (
    <div style={base}>
      <div className="vd-grid-dots" />
      <div className="vd-terminal">
        <span style={{ color: '#818cf8', fontFamily: 'var(--fm)', fontSize: '.75rem', opacity: 0.15 }}>
          {'</>'}
        </span>
      </div>
    </div>
  );
  if (variant === 'adults') return (
    <div style={base}>
      <div className="vd-diag-lines" />
      <div className="vd-barchart">
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none" opacity="0.08">
          <rect x="5" y="50" width="14" height="30" rx="3" fill="#34d399"/>
          <rect x="25" y="30" width="14" height="50" rx="3" fill="#34d399"/>
          <rect x="45" y="15" width="14" height="65" rx="3" fill="#34d399"/>
          <rect x="65" y="25" width="14" height="55" rx="3" fill="#34d399"/>
          <rect x="85" y="5" width="14" height="75" rx="3" fill="#34d399"/>
        </svg>
      </div>
    </div>
  );
  if (variant === 'cyber') return (
    <div style={base}>
      <div className="vd-hex-grid" />
      <div className="vd-shield-pulse">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" opacity="0.08">
          <path d="M45 10L75 25V48C75 62 62 73 45 80C28 73 15 62 15 48V25L45 10Z" fill="#f43f5e" stroke="#f43f5e" strokeWidth="2"/>
          <path d="M34 45l8 8 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
  return null;
}

/* ── Breadcrumb ──────────────────────────────────────── */
function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="prog-breadcrumb" aria-label="Навигация">
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {i > 0 && <span className="bc-sep">›</span>}
          {item.href ? (
            <a href={item.href} className="bc-link">{item.label}</a>
          ) : (
            <span className="bc-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ── ProgressSteps ────────────────────────────────────── */
function ProgressSteps({ steps, active = 0, accent = 'var(--amber)' }: {
  steps: string[];
  active?: number;
  accent?: string;
}) {
  return (
    <div className="prog-steps">
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {i > 0 && <div className="pstep-line" />}
          <div className={`pstep${i === active ? ' active' : i < active ? ' done' : ''}`}>
            <div className="pstep-dot" style={i === active ? { background: accent, boxShadow: `0 0 8px ${accent}80` } : i < active ? { background: '#10b981' } : undefined} />
            <span>{step}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── ProgramHero ──────────────────────────────────────── */
export interface ProgramHeroProps {
  badge: React.ReactNode;
  headline: React.ReactNode;
  description: string;
  chips: React.ReactNode;
  rightCol: React.ReactNode;
  program: string;
  slots?: number;
  accentColor?: string;
  enrollLabel?: string;
  onEnroll?: (p?: string) => void;
  shareTitle: string;
  shareText: string;
  wrapperStyle?: React.CSSProperties;
  bgOverlay?: React.ReactNode;
  extraCta?: React.ReactNode;
  variant?: 'kids' | 'teens' | 'adults' | 'cyber';
  breadcrumb?: { label: string; href?: string }[];
  progressSteps?: string[];
  progressActive?: number;
}

export function ProgramHero({
  badge, headline, description, chips, rightCol,
  program, slots = 3, accentColor = 'var(--amber)',
  enrollLabel = 'Записаться на пробное →',
  onEnroll, shareTitle, shareText,
  wrapperStyle, bgOverlay, extraCta, variant,
  breadcrumb, progressSteps, progressActive = 0,
}: ProgramHeroProps) {
  const green = isGreen(accentColor);
  const trustAccent = green ? 'rgba(16,185,129,.25)' : 'rgba(240,165,0,.3)';
  const outlineBorderColor = green ? 'rgba(16,185,129,.25)' : undefined;

  const primaryBtnStyle: React.CSSProperties = green
    ? { background: accentColor, color: '#050a0d', fontFamily: 'var(--fu)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '17px 36px', borderRadius: 13, boxShadow: `0 4px 24px rgba(16,185,129,.35)`, border: 'none', cursor: 'pointer' }
    : {};

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...wrapperStyle }}>
      {bgOverlay}
      {variant && <VariantDecoration variant={variant} />}
      <section
        className="prog-hero-grid"
        style={{
          position: (bgOverlay || variant) ? 'relative' : undefined,
          zIndex: (bgOverlay || variant) ? 1 : undefined,
          minHeight: 'calc(100vh - var(--nav-h))',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          alignItems: 'center', gap: 64,
          padding: '80px 48px',
          maxWidth: 1280, margin: '0 auto',
        }}
      >
        <div>
          {/* Breadcrumb */}
          {breadcrumb && <Breadcrumb items={breadcrumb} />}

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: accentBadgeBg(accentColor),
            border: `1px solid ${accentDim(accentColor)}`,
            borderRadius: 8, padding: '5px 12px',
            fontFamily: 'var(--fm)', fontSize: '.62rem', color: accentColor,
            letterSpacing: '.08em', marginBottom: 24,
          }}>
            {badge}
          </div>

          {/* Headline */}
          {headline}

          {/* Description */}
          <p style={{ fontSize: '1.12rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 20 }}>
            {description}
          </p>

          {/* Chips */}
          <div className="prog-meta" style={{ marginBottom: 20 }}>
            {chips}
          </div>

          {/* Progress steps */}
          {progressSteps && (
            <ProgressSteps steps={progressSteps} active={progressActive} accent={accentColor} />
          )}

          {/* Urgency */}
          <UrgencyStrip onEnroll={onEnroll} program={program} slots={slots} accent={accentColor} />

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {green ? (
              <button style={primaryBtnStyle} onClick={() => onEnroll?.(program)}>{enrollLabel}</button>
            ) : (
              <button className="btn btn-amber btn-lg" onClick={() => onEnroll?.(program)}>{enrollLabel}</button>
            )}
            {extraCta}
            <button
              className="btn btn-outline btn-lg"
              style={green ? { borderColor: outlineBorderColor, color: accentColor } : undefined}
              onClick={() => document.querySelector('.roadmap-wrap')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть программу
            </button>
            <ShareButton title={shareTitle} text={shareText} />
          </div>

          {/* Trust */}
          <TrustMini accent={trustAccent} />
        </div>

        <div>{rightCol}</div>
      </section>
    </div>
  );
}

/* ── ProjectCardsSection ─────────────────────────────── */
export interface Project {
  icon: string;
  name: string;
  tool: string;
}

export function ProjectCardsSection({ eyebrow, title, promise, items, accentColor = 'var(--amber)' }: {
  eyebrow?: string;
  title: string;
  promise: string;
  items: Project[];
  accentColor?: string;
}) {
  return (
    <section
      className="proj-section"
      style={{ '--proj-accent': accentColor } as React.CSSProperties}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="proj-eyebrow">
          {eyebrow || 'Что создашь на курсе'}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
          <h2 className="proj-title">{title}</h2>
          <p style={{ fontFamily: 'var(--fd)', fontSize: '.94rem', color: 'var(--t3)', maxWidth: 480, lineHeight: 1.7, marginBottom: 0 }}>{promise}</p>
        </div>
        <div className="proj-grid">
          {items.map((p, i) => (
            <div key={i} className="proj-card">
              <div className="proj-card-icon">{p.icon}</div>
              <div className="proj-card-name">{p.name}</div>
              <div className="proj-card-tool">{p.tool}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ProgramFAQ ──────────────────────────────────────── */
export interface FAQItem {
  q: string;
  a: string;
}

export function ProgramFAQ({ items, accentColor = 'var(--amber)' }: {
  items: FAQItem[];
  accentColor?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="prog-faq-section">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="s-eyebrow" style={{ color: accentColor }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: accentColor, verticalAlign: 'middle', marginRight: 10 }} />
          Частые вопросы
        </div>
        <h2 className="s-h2" style={{ marginBottom: 32, fontSize: 'clamp(1.5rem,2.5vw,2.2rem)' }}>
          Ответы на <span style={{ color: accentColor }}>ваши вопросы</span>
        </h2>
        <div className="prog-faq">
          {items.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${open === i ? 'open' : ''}`}
              style={{ borderColor: open === i ? accentDim(accentColor) : undefined }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="faq-q">
                <span>{item.q}</span>
                <span className="faq-arrow" style={{ color: accentColor }}>{open === i ? '−' : '+'}</span>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── MatrixCanvas ────────────────────────────────────── */
export function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COL_W = 16;
    const drops = Array.from({ length: Math.floor(canvas.width / COL_W) }, () => Math.random() * -40);
    const CHARS = '01アイウカキクアイ01セキュリティ防衛10';

    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,18,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px "JetBrains Mono", monospace';
      drops.forEach((y, i) => {
        const bright = Math.random() > 0.95;
        ctx.fillStyle = bright ? '#ffffff' : '#10b981';
        ctx.globalAlpha = bright ? 0.9 : 0.55;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * COL_W, y * COL_W);
        ctx.globalAlpha = 1;
        if (y * COL_W > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += 0.8;
      });
    };

    const id = setInterval(draw, 60);
    return () => { clearInterval(id); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.13, pointerEvents: 'none', display: 'block' }} />
  );
}

/* ── ProgramRoadmap ─────────────────────────────────────
   Vertical milestone chain with dashed amber connector,
   watermark step numbers, and type badges.
   ─────────────────────────────────────────────────────── */
export interface RoadmapPhase {
  num: string;
  title: string;
  sub: string;
  milestone: string;
  skills: string[];
  accent?: string;
  type?: 'theory' | 'practice' | 'project';
}

const TYPE_META: Record<string, { label: string; emoji: string; cls: string }> = {
  theory:   { label: 'Теория',   emoji: '🎓', cls: 'rm-type-badge rm-tb-theory' },
  practice: { label: 'Практика', emoji: '🛠️', cls: 'rm-type-badge rm-tb-practice' },
  project:  { label: 'Проект',   emoji: '🚀', cls: 'rm-type-badge rm-tb-project' },
};

export function ProgramRoadmap({
  phases,
  eyebrow = 'Роадмап программы',
  title = 'Что вас ждёт',
  accent = 'var(--amber)',
}: {
  phases: RoadmapPhase[];
  eyebrow?: string;
  title?: string;
  accent?: string;
}) {
  return (
    <section className="S roadmap-wrap">
      <div className="s-eyebrow rv">{eyebrow}</div>
      <div className="prem-div" />
      <h2 className="s-h2 rv">{title}</h2>

      <div className="rm-vert-wrap">
        {phases.map((ph, i) => {
          const typeMeta = ph.type ? TYPE_META[ph.type] : null;
          const phAccent = ph.accent || accent;
          const watermark = String(i + 1).padStart(2, '0');
          return (
            <div key={i} className="rm-vert-row rv-s">
              {/* Left: connector + circle */}
              <div className="rm-vert-left">
                <div className="rm-vert-circle" style={{
                  border: `2px solid ${phAccent}`,
                  background: `linear-gradient(135deg, ${phAccent}22, ${phAccent}0a)`,
                  boxShadow: `0 0 18px ${phAccent}33`,
                  color: phAccent,
                }}>
                  {watermark}
                </div>
                {i < phases.length - 1 && (
                  <div className="rm-vert-line" style={{
                    borderLeft: `2px dashed ${phAccent}40`,
                  }} />
                )}
              </div>

              {/* Right: card */}
              <div className="rm-vert-card glass-card" style={{
                borderLeft: `3px solid ${phAccent}`,
              }}>
                {/* Watermark number */}
                <div className="rm-wm">{watermark}</div>

                {/* Top row: title + type badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, position: 'relative', zIndex: 1 }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--fu)', fontSize: '.75rem', fontWeight: 700,
                      letterSpacing: '.06em', textTransform: 'uppercase',
                      color: '#fff', marginBottom: 3,
                    }}>{ph.title}</div>
                    <div style={{
                      fontFamily: 'var(--fd)', fontSize: '.82rem', color: 'var(--t3)',
                    }}>{ph.sub}</div>
                  </div>
                  {typeMeta && (
                    <span className={`rm-type-badge ${typeMeta.cls}`}>
                      {typeMeta.emoji} {typeMeta.label}
                    </span>
                  )}
                </div>

                {/* Milestone */}
                <div style={{
                  background: `${phAccent}10`, border: `1px solid ${phAccent}28`,
                  borderRadius: 8, padding: '8px 12px', marginTop: 12, marginBottom: 10,
                  fontFamily: 'var(--fd)', fontSize: '.82rem', color: 'var(--t2)',
                  lineHeight: 1.5, position: 'relative', zIndex: 1,
                }}>
                  <span style={{ color: phAccent, marginRight: 6 }}>✓</span>{ph.milestone}
                </div>

                {/* Skills chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, position: 'relative', zIndex: 1 }}>
                  {ph.skills.map((sk, j) => (
                    <span key={j} className="chip ch-dim" style={{ fontSize: '.66rem' }}>{sk}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
