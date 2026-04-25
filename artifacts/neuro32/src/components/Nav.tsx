import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { Baby, Users, Briefcase, Shield } from 'lucide-react';
import { store } from '../lib/store';

const PROGRAMS = [
  { href: '/kids',   Icon: Baby,      title: 'Дети',              sub: '7–12 лет' },
  { href: '/teens',  Icon: Users,     title: 'Подростки',         sub: '13–17 лет' },
  { href: '/adults', Icon: Briefcase, title: 'Взрослые',          sub: 'Карьера и бизнес' },
  { href: '/cyber',  Icon: Shield,    title: 'Кибербезопасность', sub: 'CTF и защита' },
];

const TOP_LINKS = [
  { href: '/packages',    label: 'Цены' },
  { href: '/business',    label: 'Для бизнеса' },
  { href: '/safety',      label: 'Безопасность' },
  { href: '/reviews',     label: 'Отзывы' },
  { href: '/about',       label: 'Об эксперте' },
  { href: '/contact',     label: 'Контакты' },
];

// Dropdown variants
const dropContainerV = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 22, staggerChildren: 0.045, delayChildren: 0.04 },
  },
  exit: { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.15 } },
};
const dropItemV = {
  hidden: { opacity: 0, y: 7 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 250, damping: 24 } },
};

// Bottom-sheet backdrop
const backdropV = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};
const sheetV = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  exit: { y: '100%', transition: { duration: 0.22, ease: 'easeIn' as const } },
};

export default function Nav({ onEnroll }: { onEnroll: (p?: string) => void }) {
  const [scrolled, setScrolled]   = useState(false);
  const [mobOpen, setMobOpen]     = useState(false);
  const [progOpen, setProgOpen]   = useState(false);
  const [location, navigate]      = useLocation();
  const user                      = store.getCurrentUser();
  const dropRef                   = useRef<HTMLDivElement>(null);
  const navRef                    = useRef<HTMLElement>(null);

  // Scroll → pill shrinks / becomes more opaque
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close everything on route change
  useEffect(() => { setMobOpen(false); setProgOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setProgOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when sheet open
  useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobOpen]);

  const goAnchor = (l: { href: string; isAnchor?: boolean }) => {
    if (l.isAnchor) {
      const id = l.href.split('#')[1];
      const scrollToEl = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      if (location === '/') { scrollToEl(); }
      else {
        navigate('/');
        const mo = new MutationObserver(() => {
          if (document.getElementById(id)) { mo.disconnect(); clearTimeout(fb); scrollToEl(); }
        });
        mo.observe(document.body, { childList: true, subtree: true });
        const fb = setTimeout(() => mo.disconnect(), 2000);
      }
    } else {
      navigate(l.href);
    }
  };

  const goLK = () => {
    const u = store.getCurrentUser();
    if (u?.role === 'admin') navigate('/admin');
    else if (u) navigate('/lk');
    else navigate('/auth');
  };

  const isProgramActive = PROGRAMS.some(p => p.href === location);

  return (
    <>
      {/* ── DESKTOP / TABLET NAV (pill) ── */}
      <nav
        ref={navRef}
        id="topNav"
        className={scrolled ? 'scrolled' : ''}
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 48px)',
          maxWidth: 1100,
          height: 60,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 0 16px',
          background: scrolled ? 'rgba(10,10,18,0.95)' : 'rgba(12,12,22,0.72)',
          backdropFilter: 'blur(12px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: scrolled ? 16 : 100,
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
          transition: 'border-radius 0.4s ease, box-shadow 0.3s ease, background 0.3s ease',
        }}
      >
        {/* LOGO */}
        <button
          onClick={() => navigate('/')}
          // 44×44 hit target for the WCAG touch-target rule. The SVG logo is
          // 148×33 visually but we pad the button so the click area itself
          // never drops below 44px (mobile gets `padding: 6px 0`).
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, minHeight: 44, padding: '6px 4px' }}
          aria-label="Нейро 32 — на главную"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 44" className="nav-logo-svg" fill="none" aria-hidden="true">
            <defs>
              <radialGradient id="nav-bg" cx="40%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#f0a500" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#0a0a12" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="44" height="44" rx="11" fill="#0a0a12"/>
            <rect width="44" height="44" rx="11" fill="url(#nav-bg)"/>
            <line x1="22" y1="9" x2="10" y2="34" stroke="rgba(240,165,0,0.35)" strokeWidth="1.5"/>
            <line x1="22" y1="9" x2="34" y2="34" stroke="rgba(74,124,255,0.3)" strokeWidth="1.5"/>
            <line x1="10" y1="34" x2="34" y2="34" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            <line x1="22" y1="9" x2="22" y2="24" stroke="rgba(240,165,0,0.18)" strokeWidth="1.2"/>
            <circle cx="22" cy="9" r="3.5" fill="#f0a500"/>
            <circle cx="22" cy="9" r="6" fill="none" stroke="#f0a500" strokeWidth="0.8" strokeOpacity="0.3"/>
            <circle cx="10" cy="34" r="2.6" fill="#4a7cff"/>
            <circle cx="34" cy="34" r="2.6" fill="rgba(255,255,255,0.85)"/>
            <circle cx="22" cy="24" r="1.8" fill="rgba(240,165,0,0.65)"/>
            <text x="56" y="18" fontFamily="'Unbounded',sans-serif" fontWeight="700" fontSize="9.5" fill="#f0a500" letterSpacing="2.5">НЕЙРО</text>
            <text x="56" y="37" fontFamily="'Unbounded',sans-serif" fontWeight="700" fontSize="17" fill="#ffffff" letterSpacing="0.5">32</text>
            <line x1="56" y1="40" x2="198" y2="40" stroke="rgba(240,165,0,0.2)" strokeWidth="0.6"/>
          </svg>
        </button>

        {/* DESKTOP LINKS */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Programs dropdown */}
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProgOpen(v => !v)}
              aria-haspopup="menu"
              aria-expanded={progOpen}
              aria-controls="nav-programs-menu"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 100,
                fontFamily: 'var(--fm)', fontSize: '.62rem', fontWeight: 600,
                letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
                background: isProgramActive ? 'rgba(240,165,0,0.1)' : (progOpen ? 'rgba(255,255,255,0.06)' : 'none'),
                border: 'none',
                color: isProgramActive ? 'var(--amber)' : (progOpen ? '#fff' : 'var(--t2)'),
                transition: 'color .2s, background .2s',
              }}
            >
              Программы
              <span style={{
                fontSize: '.5rem', opacity: .55,
                display: 'inline-block',
                transform: progOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform .2s',
              }}>▼</span>
            </button>

            <AnimatePresence>
              {progOpen && (
                <motion.div
                  id="nav-programs-menu"
                  role="menu"
                  variants={dropContainerV}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', left: -8,
                    background: 'rgba(14,14,26,0.98)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: 10, minWidth: 280,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                    zIndex: 200,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
                  }}
                >
                  {PROGRAMS.map(p => (
                    <motion.button
                      key={p.href}
                      variants={dropItemV}
                      onClick={() => { navigate(p.href); setProgOpen(false); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                        gap: 4, padding: '10px 12px', borderRadius: 12, textAlign: 'left',
                        background: location === p.href ? 'rgba(240,165,0,0.08)' : 'rgba(255,255,255,0.02)',
                        border: location === p.href ? '1px solid rgba(240,165,0,0.2)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={e => {
                        if (location !== p.href) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (location !== p.href) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                        }
                      }}
                    >
                      <p.Icon size={16} color={location === p.href ? 'var(--amber)' : 'var(--t3)'} />
                      <span style={{
                        fontFamily: 'var(--fu)', fontSize: '.6rem', fontWeight: 700,
                        letterSpacing: '.04em', textTransform: 'uppercase',
                        color: location === p.href ? 'var(--amber)' : '#fff',
                      }}>{p.title}</span>
                      <span style={{ fontFamily: 'var(--fb)', fontSize: '.58rem', color: 'var(--t4)' }}>{p.sub}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top links */}
          {TOP_LINKS.map(l => {
            const isActive = location === l.href;
            return (
              <button
                key={l.href}
                onClick={() => goAnchor(l)}
                style={{
                  padding: isActive ? '6px 14px' : '6px 11px',
                  borderRadius: 100,
                  fontFamily: 'var(--fm)', fontSize: '.62rem', fontWeight: 600,
                  letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
                  background: isActive ? 'rgba(240,165,0,0.1)' : 'none',
                  border: 'none',
                  color: isActive ? 'var(--amber)' : 'var(--t2)',
                  transition: 'color .2s, background .2s, padding .2s',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--t2)'; }}
              >{l.label}</button>
            );
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-amber btn-sm nav-enroll-btn" onClick={() => onEnroll()}>Записаться</button>
          <button
            className="btn btn-ghost btn-sm nav-login-btn"
            onClick={goLK}
            style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t2)' }}
          >
            {user ? (user.name.split(' ')[0] || 'Кабинет') : 'Войти'}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobOpen(v => !v)}
            className="mob-ham"
            aria-label={mobOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobOpen}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              width: 36, height: 36, borderRadius: 8, padding: 6,
              display: 'none', flexDirection: 'column', justifyContent: 'center', gap: 5,
            }}
          >
            <span style={{
              display: 'block', height: 2, background: '#fff', borderRadius: 2,
              width: mobOpen ? '100%' : '100%',
              transform: mobOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
              transition: 'transform .25s',
            }} />
            <span style={{
              display: 'block', height: 2, background: '#fff', borderRadius: 2,
              opacity: mobOpen ? 0 : 1, transition: 'opacity .25s',
            }} />
            <span style={{
              display: 'block', height: 2, background: '#fff', borderRadius: 2,
              transform: mobOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
              transition: 'transform .25s',
            }} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM SHEET ── */}
      <AnimatePresence>
        {mobOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropV}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.2 }}
              onClick={() => setMobOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                zIndex: 9997,
              }}
            />

            {/* Sheet */}
            <motion.div
              variants={sheetV}
              initial="hidden"
              animate="show"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.25 }}
              onDragEnd={(_: unknown, info: { offset: { y: number } }) => { if (info.offset.y > 80) setMobOpen(false); }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#0e0e1a',
                borderRadius: '24px 24px 0 0',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '0 24px calc(32px + env(safe-area-inset-bottom))',
                zIndex: 9998,
                maxHeight: '88vh',
                overflowY: 'auto',
              }}
            >
              {/* Drag handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 20px' }}>
                <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 2 }} />
              </div>

              {/* Programs */}
              <div style={{
                fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t4)',
                textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10,
              }}>Программы</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
                {PROGRAMS.map(p => (
                  <button
                    key={p.href}
                    onClick={() => { navigate(p.href); setMobOpen(false); }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      gap: 4, padding: '12px', borderRadius: 14, textAlign: 'left',
                      background: location === p.href ? 'rgba(240,165,0,0.08)' : 'rgba(255,255,255,0.03)',
                      border: location === p.href ? '1px solid rgba(240,165,0,0.2)' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <p.Icon size={15} color={location === p.href ? 'var(--amber)' : 'var(--t3)'} />
                    <span style={{
                      fontFamily: 'var(--fu)', fontSize: '.58rem', fontWeight: 700,
                      letterSpacing: '.04em', textTransform: 'uppercase',
                      color: location === p.href ? 'var(--amber)' : '#fff',
                    }}>{p.title}</span>
                    <span style={{ fontFamily: 'var(--fb)', fontSize: '.55rem', color: 'var(--t4)' }}>{p.sub}</span>
                  </button>
                ))}
              </div>

              <div style={{ height: 1, background: 'var(--line)', margin: '16px 0' }} />

              {/* Top links */}
              {TOP_LINKS.map(l => {
                const isActive = location === l.href;
                return (
                  <button
                    key={l.href}
                    onClick={() => { goAnchor(l); setMobOpen(false); }}
                    style={{
                      fontFamily: 'var(--fu)', fontSize: '.66rem', fontWeight: 700,
                      letterSpacing: '.08em', textTransform: 'uppercase',
                      color: isActive ? 'var(--amber)' : 'var(--t2)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '11px 0', width: '100%', textAlign: 'left',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >{l.label}</button>
                );
              })}

              <div style={{ height: 1, background: 'var(--line)', margin: '16px 0' }} />

              {/* CTA */}
              <button
                className="btn btn-amber"
                onClick={() => { onEnroll(); setMobOpen(false); }}
                style={{ width: '100%', justifyContent: 'center', marginBottom: 10, minHeight: 48, fontSize: '1rem' }}
              >
                Записаться на урок →
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => { goLK(); setMobOpen(false); }}
                style={{ width: '100%', justifyContent: 'center', fontSize: '.8rem', minHeight: 44 }}
              >
                {user ? 'Личный кабинет' : 'Войти'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .nav-logo-svg { width: 200px; height: 44px; }
        .mob-ham { min-width: 44px; min-height: 44px; align-items: center; justify-content: center; }
        @media(max-width: 1024px) {
          .nav-links-desktop { display: none !important; }
          .mob-ham { display: flex !important; }
        }
        @media(max-width: 768px) {
          #topNav {
            top: 0 !important;
            border-radius: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            transform: none !important;
            left: 0 !important;
          }
        }
        @media(max-width: 480px) {
          .nav-logo-svg { width: 148px; height: 33px; }
          .nav-enroll-btn { display: none !important; }
          .nav-login-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
