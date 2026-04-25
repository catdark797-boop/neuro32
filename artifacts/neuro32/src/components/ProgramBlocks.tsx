import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, GraduationCap, Wrench, Rocket } from 'lucide-react';
import ShareButton from './ShareButton';
import type { Phase } from './Roadmap';
export type { Phase };

/* ── CourseJsonLd ─────────────────────────────────────────────────────
 * Per-program schema.org Course + Offer JSON-LD. Helps Google/Yandex
 * surface the program in SERP rich-results (price, length, instructor).
 * The aggregate `Course` array in index.html covers the four programs
 * for site-wide context; this per-page block lets each program own its
 * canonical record (URL, price, sessions, level).
 */
export function CourseJsonLd({
  name,
  description,
  url,
  price,
  sessions,
  weeks,
  level,
  audience,
}: {
  name: string;
  description: string;
  url: string;
  price: number;
  sessions: number;
  weeks: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  audience: string;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "Нейро 32",
      sameAs: "https://xn--32-mlcqsin.xn--p1ai",
    },
    educationalLevel: level,
    audience: { "@type": "EducationalAudience", educationalRole: audience },
    inLanguage: "ru",
    offers: {
      "@type": "Offer",
      url,
      price: String(price),
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      category: "Subscription",  // monthly tuition
      // Pricing model so SERP can label it "from 5500 ₽/мес" instead of
      // a one-time price (less attractive for cold visitors).
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(price),
        priceCurrency: "RUB",
        unitCode: "MON",          // UN/CEFACT — months
        billingDuration: "P1M",
      },
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      location: {
        "@type": "Place",
        name: "Лаборатория «Нейро 32»",
        address: {
          "@type": "PostalAddress",
          streetAddress: "ул. Коммунистическая, 22А",
          addressLocality: "Новозыбков",
          addressRegion: "Брянская область",
          addressCountry: "RU",
        },
      },
      instructor: {
        "@type": "Person",
        name: "Степан Денис",
        jobTitle: "ИИ-практик",
      },
      courseWorkload: `PT${weeks}W`,
      // Plain-text count so we surface "24 занятия" without a separate prop.
      description: `${sessions} занятий за ${weeks} недель`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

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
        </strong> · Группы <strong style={{ color: accent }}>каждые 4–6 недель</strong>
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

/* ── TrustMini ──────────────────────────────────────────
 * Compact founder-credibility strip. Shows on every program page so a cold
 * visitor sees a real human behind the school before deciding whether to
 * leave an application. Photo + name + experience + one-click to full bio.
 */
export function TrustMini({ accent = 'rgba(240,165,0,.3)' }: { accent?: string }) {
  return (
    <a
      href="/about"
      className="trust-mini"
      style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex' }}
    >
      <img
        src="/denis.jpg"
        className="trust-mini-photo"
        alt="Степан Денис, основатель Нейро 32"
        style={{ borderColor: accent }}
        loading="lazy"
        decoding="async"
        width="48"
        height="48"
      />
      <div>
        <div className="trust-mini-name">Степан Денис · ИИ-практик</div>
        <div className="trust-mini-role">С 2022 · ведёт занятия лично · подробнее →</div>
      </div>
    </a>
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
// Origin used in BreadcrumbList JSON-LD `item` URLs. Hard-coded to the
// canonical punycode domain (xn--32-mlcqsin.xn--p1ai = нейро32.рф) so
// search engines see the same canonical form everywhere — sitemap.xml,
// og:url meta, and now structured data — instead of a mix of variants.
const SITE_ORIGIN = "https://xn--32-mlcqsin.xn--p1ai";

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  // Schema.org BreadcrumbList — helps Google/Yandex render the trail in
  // SERP and pass authority between pages. Must include every step (incl.
  // current page); current page typically has no `href`, so we synthesise
  // its URL from window.location at render time.
  const ldItems = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.label,
    item: item.href
      ? `${SITE_ORIGIN}${item.href.startsWith("/") ? item.href : `/${item.href}`}`
      : (typeof window !== "undefined"
          ? `${SITE_ORIGIN}${window.location.pathname}`
          : SITE_ORIGIN),
  }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: ldItems,
  };
  return (
    <>
      <script
        type="application/ld+json"
        // dangerouslySetInnerHTML keeps the JSON literal — React would
        // otherwise escape angle-brackets / quotes inside the string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
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
    </>
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
  icon: ReactNode;
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
        <motion.div
          className="proj-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {items.map((p, i) => (
            <motion.div
              key={i}
              className="proj-card"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }}
              style={{ backdropFilter: 'blur(16px)', background: 'rgba(16,16,32,0.55)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="proj-card-icon">{p.icon}</div>
              <div className="proj-card-name">{p.name}</div>
              <div className="proj-card-tool">{p.tool}</div>
            </motion.div>
          ))}
        </motion.div>
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
              <div className="faq-a-wrap">
                <div className="faq-a">
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </div>
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

const TYPE_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; cls: string }> = {
  theory:   { label: 'Теория',   Icon: GraduationCap, cls: 'rm-type-badge rm-tb-theory' },
  practice: { label: 'Практика', Icon: Wrench,        cls: 'rm-type-badge rm-tb-practice' },
  project:  { label: 'Проект',   Icon: Rocket,        cls: 'rm-type-badge rm-tb-project' },
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

      <motion.div
        className="rm-vert-wrap"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        {phases.map((ph, i) => {
          const typeMeta = ph.type ? TYPE_META[ph.type] : null;
          const phAccent = ph.accent || accent;
          const watermark = String(i + 1).padStart(2, '0');
          return (
            <motion.div
              key={i}
              className="rm-vert-row rv-s"
              variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }}
            >
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
                    <span className={`rm-type-badge ${typeMeta.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <typeMeta.Icon size={11} /> {typeMeta.label}
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
                  <CheckCircle2 size={14} style={{ color: phAccent, marginRight: 6, flexShrink: 0, verticalAlign: 'middle' }} />{ph.milestone}
                </div>

                {/* Skills chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, position: 'relative', zIndex: 1 }}>
                  {ph.skills.map((sk, j) => (
                    <span key={j} className="chip ch-dim" style={{ fontSize: '.66rem' }}>{sk}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
