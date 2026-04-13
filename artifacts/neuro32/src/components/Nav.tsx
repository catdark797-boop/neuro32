import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { store } from '../lib/store';

const PROGRAMS = [
  { href: '/kids', label: 'ИИ для детей 7–12' },
  { href: '/teens', label: 'ИИ для подростков' },
  { href: '/adults', label: 'ИИ для взрослых' },
  { href: '/cyber', label: 'Цифровая защита' },
];

const TOP_LINKS = [
  { href: '/reviews', label: 'Отзывы' },
  { href: '/about', label: 'Об эксперте' },
  { href: '/#business', label: 'Для бизнеса', isAnchor: true },
  { href: '/contact', label: 'Контакты' },
];

export default function Nav({ onEnroll }: { onEnroll: (p?: string) => void }) {
  const [solid, setSolid] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [progOpen, setProgOpen] = useState(false);
  const [location, navigate] = useLocation();
  const user = store.getCurrentUser();
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobOpen(false); setProgOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setProgOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const goAnchor = (l: { href: string; isAnchor?: boolean }) => {
    if (l.isAnchor) {
      const id = l.href.split('#')[1];
      const scrollToEl = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      if (location === '/') {
        scrollToEl();
      } else {
        navigate('/');
        const poll = (attempt = 0) => {
          if (document.getElementById(id)) { scrollToEl(); return; }
          if (attempt < 30) setTimeout(() => poll(attempt + 1), 50);
        };
        setTimeout(() => poll(), 50);
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
      <nav id="topNav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000, height: 'var(--nav-h)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        background: solid ? 'rgba(10,10,18,.96)' : 'transparent',
        backdropFilter: solid ? 'blur(20px)' : 'none',
        borderBottom: solid ? '1px solid var(--line)' : 'none',
        transition: 'all .4s cubic-bezier(.16,1,.3,1)',
      }}>
        {/* LOGO */}
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          aria-label="Нейро 32 — на главную">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 44" className="nav-logo-svg" fill="none" aria-hidden="true">
            <defs>
              <radialGradient id="nav-bg" cx="40%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#f0a500" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#0a0a12" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="44" height="44" rx="11" fill="#0a0a12"/>
            <rect width="44" height="44" rx="11" fill="url(#nav-bg)"/>
            {/* Neural edges */}
            <line x1="22" y1="9" x2="10" y2="34" stroke="rgba(240,165,0,0.35)" strokeWidth="1.5"/>
            <line x1="22" y1="9" x2="34" y2="34" stroke="rgba(74,124,255,0.3)" strokeWidth="1.5"/>
            <line x1="10" y1="34" x2="34" y2="34" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            <line x1="22" y1="9" x2="22" y2="24" stroke="rgba(240,165,0,0.18)" strokeWidth="1.2"/>
            {/* Nodes */}
            <circle cx="22" cy="9" r="3.5" fill="#f0a500"/>
            <circle cx="22" cy="9" r="6" fill="none" stroke="#f0a500" strokeWidth="0.8" strokeOpacity="0.3"/>
            <circle cx="10" cy="34" r="2.6" fill="#4a7cff"/>
            <circle cx="34" cy="34" r="2.6" fill="rgba(255,255,255,0.85)"/>
            <circle cx="22" cy="24" r="1.8" fill="rgba(240,165,0,0.65)"/>
            {/* Wordmark */}
            <text x="56" y="18" fontFamily="'Unbounded',sans-serif" fontWeight="700" fontSize="9.5" fill="#f0a500" letterSpacing="2.5">НЕЙРО</text>
            <text x="56" y="37" fontFamily="'Unbounded',sans-serif" fontWeight="700" fontSize="17" fill="#ffffff" letterSpacing="0.5">32</text>
            <line x1="56" y1="40" x2="198" y2="40" stroke="rgba(240,165,0,0.2)" strokeWidth="0.6"/>
          </svg>
        </button>

        {/* DESKTOP NAV */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="nav-links-desktop">
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProgOpen(v => !v)}
              className={isProgramActive ? 'nav-active' : ''}
              style={{
                padding: '6px 12px', borderRadius: 8, fontFamily: 'var(--fm)', fontSize: '.62rem',
                fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
                background: progOpen ? 'rgba(255,255,255,.06)' : 'none', border: 'none',
                color: isProgramActive ? 'var(--amber)' : (progOpen ? '#fff' : 'var(--t2)'),
                transition: 'color .2s', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              Программы <span style={{ fontSize: '.55rem', opacity: .6, transform: progOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform .2s' }}>▼</span>
            </button>
            {progOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'rgba(14,14,26,.97)',
                backdropFilter: 'blur(24px)', border: '1px solid var(--line2)', borderRadius: 14,
                padding: 8, minWidth: 220, boxShadow: '0 16px 48px rgba(0,0,0,.5)', zIndex: 100,
              }}>
                {PROGRAMS.map(p => (
                  <button key={p.href} onClick={() => { navigate(p.href); setProgOpen(false); }} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                    borderRadius: 9, fontFamily: 'var(--fm)', fontSize: '.62rem', fontWeight: 600,
                    letterSpacing: '.06em', color: location === p.href ? 'var(--amber)' : 'var(--t2)',
                    background: location === p.href ? 'rgba(240,165,0,.08)' : 'none',
                    border: 'none', cursor: 'pointer', transition: 'all .15s',
                  }}
                    onMouseEnter={e => { if (location !== p.href) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.05)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { if (location !== p.href) { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = 'var(--t2)'; } }}
                  >{p.label}</button>
                ))}
              </div>
            )}
          </div>

          {TOP_LINKS.map(l => (
            <button key={l.href} onClick={() => goAnchor(l)}
              className={!l.isAnchor && location === l.href ? 'nav-active' : ''}
              style={{
                padding: '6px 11px', borderRadius: 8, fontFamily: 'var(--fm)', fontSize: '.62rem',
                fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
                background: 'none', border: 'none',
                color: !l.isAnchor && location === l.href ? 'var(--amber)' : 'var(--t2)',
                transition: 'color .2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { if (!l.isAnchor && location !== l.href) (e.currentTarget as HTMLElement).style.color = 'var(--t2)'; else if (l.isAnchor) (e.currentTarget as HTMLElement).style.color = 'var(--t2)'; }}
            >{l.label}</button>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-amber btn-sm" onClick={() => onEnroll()}>Записаться</button>
          <button className="btn btn-ghost btn-sm" onClick={goLK} style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t2)' }}>
            {user ? (user.name.split(' ')[0] || 'Кабинет') : 'Войти'}
          </button>
          <button onClick={() => setMobOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '1.3rem', display: 'none' }} className="mob-ham" aria-label={mobOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={mobOpen}>
            {mobOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`nav-mob-menu${mobOpen ? ' open' : ''}`}>
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 8, paddingLeft: 4 }}>Программы</div>
        {PROGRAMS.map(p => (
          <button key={p.href} onClick={() => { navigate(p.href); setMobOpen(false); }} style={{
            fontFamily: 'var(--fu)', fontSize: '.66rem', fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase', color: location === p.href ? 'var(--amber)' : 'var(--t2)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0',
            width: '100%', textAlign: 'left',
          }}>{p.label}</button>
        ))}
        <div style={{ height: 1, background: 'var(--line)', margin: '10px 0' }} />
        {TOP_LINKS.map(l => (
          <button key={l.href} onClick={() => { goAnchor(l); setMobOpen(false); }} style={{
            fontFamily: 'var(--fu)', fontSize: '.66rem', fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase', color: !l.isAnchor && location === l.href ? 'var(--amber)' : 'var(--t2)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0',
            width: '100%', textAlign: 'left',
          }}>{l.label}</button>
        ))}
        <div style={{ height: 1, background: 'var(--line)', margin: '10px 0' }} />
        <button className="btn btn-amber" onClick={() => { onEnroll(); setMobOpen(false); }} style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}>Записаться →</button>
        <button className="btn btn-ghost" onClick={goLK} style={{ width: '100%', justifyContent: 'center', fontSize: '.62rem' }}>
          {user ? 'Личный кабинет' : 'Войти'}
        </button>
      </div>

      <style>{`
        @media(max-width:1024px) { .nav-links-desktop { display: none !important; } .mob-ham { display: block !important; } }
        .nav-logo-svg { width: 200px; height: 44px; }
        @media(max-width:480px) { .nav-logo-svg { width: 148px; height: 33px; } }
      `}</style>
    </>
  );
}
