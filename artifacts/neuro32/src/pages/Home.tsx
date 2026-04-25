import { useState, useEffect, useRef, type ReactNode, Fragment, lazy, Suspense } from 'react';
import { useLocation } from 'wouter';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import { Bot, Clock, Zap, Folder, XCircle, CheckCircle2, MessageSquare, Layers, Code2, Rocket, Lock, Pencil, BarChart, Settings } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { store } from '../lib/store';
// Heavy visual components go into separate chunks + render lazily. We also
// skip them entirely on low-end devices (prefers-reduced-motion OR Save-Data
// header) so INP on a Moto G9 doesn't get murdered by 80 canvas particles +
// a 25-node animated globe running on the main thread.
const ParticlesBackground = lazy(() => import('../components/ParticlesBackground'));
const NeuralNetworkModel = lazy(() => import('../components/NeuralNetworkModel'));
import { useIsMobile } from '../hooks/use-mobile';
import { analytics } from '../lib/analytics';

// True when the device explicitly asks us to chill (OS reduced-motion or the
// browser sending Save-Data). Using this to entirely skip particle/3D chunks.
function useWantsLowMotion(): boolean {
  const reduced = useReducedMotion();
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) setSaveData(true);
  }, []);
  return Boolean(reduced) || saveData;
}

function useCountUp(target: number, started: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let rafId: number;
    let startTime = 0;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) { rafId = requestAnimationFrame(step); }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, started, duration]);
  return count;
}

function TiltCard({ children, className, style, onClick }: {
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pendingEvent = useRef<{ x: number; y: number } | null>(null);
  // Throttle mousemove via rAF — previously every pointer movement triggered
  // layout read + 2 style writes, which was the top INP offender on mobile.
  // Now at most one update per frame (≤16ms) regardless of input rate.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    pendingEvent.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = ref.current;
      const ev = pendingEvent.current;
      if (!el || !ev) return;
      const rect = el.getBoundingClientRect();
      const x = (ev.x - rect.left) / rect.width - 0.5;
      const y = (ev.y - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-8px)`;
      el.style.boxShadow = `${x * -18}px ${y * -8}px 36px rgba(0,0,0,.35), 0 24px 64px rgba(0,0,0,.45), 0 0 28px rgba(240,165,0,.18)`;
    });
  };
  const handleMouseLeave = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
  };
  return (
    <div ref={ref} className={`tilt-card ${className}`} style={style}
      onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
    >{children}</div>
  );
}

function MagneticBtn({ children, className, onClick }: { children: ReactNode; className: string; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });
  const prefersReduced = useReducedMotion();
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  if (prefersReduced || isTouch) {
    return <button className={className} onClick={onClick}>{children}</button>;
  }

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.28);
    y.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}>
      <button className={className} onClick={onClick}>{children}</button>
    </motion.div>
  );
}

function WaveDivider({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div className="wave-divider" style={{ background: fromColor }}>
      <svg viewBox="0 0 1440 54" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 54 }}>
        <path d="M0,27 C240,54 600,0 960,27 C1200,45 1320,12 1440,27 L1440,54 L0,54 Z" fill={toColor} />
      </svg>
    </div>
  );
}

const TW_WORDS = ['языковые модели', 'автоматизацию', 'кибербезопасность', 'промпт-инжиниринг', 'ИИ-агентов'];

function Typewriter() {
  const [word, setWord] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = TW_WORDS[idx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (word.length < target.length) {
        timeout = setTimeout(() => setWord(target.slice(0, word.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (word.length > 0) {
        timeout = setTimeout(() => setWord(word.slice(0, -1)), 50);
      } else {
        setDeleting(false);
        setIdx(i => (i + 1) % TW_WORDS.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [word, idx, deleting]);

  return (
    <span>
      <span className="tw-word">{word}</span>
      <span className="tw-cursor" />
    </span>
  );
}

const DIRS = [
  {
    num: '01', title: 'ИИ для детей 7–12', href: '/kids', program: 'Дети 7–12',
    desc: 'Ребёнок будет создавать картины, музыку и мультфильмы с помощью ИИ — и полюбит технологии без страха.',
    tags: ['Шедеврум', 'Suno AI', 'Kling AI'],
    stats: [{ n: '24', l: 'занятия' }, { n: '5 500', l: '₽/мес' }], chip: 'Набор открыт', chipCls: 'ch-amber',
  },
  {
    num: '02', title: 'ИИ для подростков', href: '/teens', program: 'Подростки 13–17',
    desc: 'Подросток соберёт портфолио из реальных проектов: боты, автоматизации, питч-декки — это выделит его при поступлении.',
    tags: ['Python API', 'Telegram-бот', 'Make.com'],
    stats: [{ n: '36', l: 'занятий' }, { n: '7 000', l: '₽/мес' }], chip: '5 проектов', chipCls: 'ch-blue',
  },
  {
    num: '03', title: 'ИИ для взрослых 18+', href: '/adults', program: 'Взрослые 18+',
    desc: 'Вы начнёте экономить 3–5 часов рабочего времени в неделю — тексты, отчёты, рутина будут делаться за минуты.',
    tags: ['ChatGPT', 'Notion AI', 'Make.com'],
    stats: [{ n: '32', l: 'занятия' }, { n: '8 500', l: '₽/мес' }], chip: 'Ваши задачи', chipCls: 'ch-green',
  },
  {
    num: '04', title: 'Цифровая защита', href: '/cyber', program: 'Кибербезопасность',
    desc: 'Вы научитесь защищать аккаунты, распознавать атаки и безопасно работать с ИИ — навык, нужный каждому.',
    tags: ['VPN', 'Kali Linux', 'CTF'],
    stats: [{ n: '24', l: 'занятия' }, { n: '11 000', l: '₽/мес' }], chip: '100% практика', chipCls: 'ch-red',
  },
];

const IconGigaChat = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#0050ff18" stroke="#0050ff40" strokeWidth="1.2"/>
    <path d="M10 15.5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-4l-3 3-3-3h-4a3 3 0 0 1-3-3v-7z" fill="#0050ff" opacity="0.85"/>
    <rect x="13.5" y="17" width="8" height="1.5" rx=".75" fill="white" opacity="0.9"/>
    <rect x="13.5" y="20.5" width="5.5" height="1.5" rx=".75" fill="white" opacity="0.7"/>
  </svg>
);

const IconAlisa = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#fc3f1d18" stroke="#fc3f1d40" strokeWidth="1.2"/>
    <circle cx="20" cy="20" r="11" fill="none" stroke="#fc3f1d" strokeWidth="1.8" opacity="0.5"/>
    <path d="M17 28v-8.5L12 12h3l5 6.5 5-6.5h3l-5 7.5V28h-3z" fill="#fc3f1d" opacity="0.9"/>
  </svg>
);

const IconSherAI = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#21a03818" stroke="#21a03840" strokeWidth="1.2"/>
    <path d="M20 11c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm1.5 13.5v-2.8c1.7-.5 3-2.1 3-4.2 0-2.3-1.9-4.2-4.2-4.2-.7 0-1.4.2-2 .5V11c.7-.2 1.3-.3 2-.3 4.6 0 8.3 3.7 8.3 8.3 0 3.9-2.7 7.2-6.4 8.1l-.7-2.6z" fill="#21a038" opacity="0.85"/>
    <path d="M14.8 24.5l1.5-1.5c.8.8 1.9 1.3 3 1.3.4 0 .8-.1 1.2-.2l.7 2.6c-.6.2-1.2.3-1.9.3-2 0-3.8-.9-5-2.4l-.5-.1z" fill="#21a038" opacity="0.6"/>
  </svg>
);

const IconYandexGPT = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#fc3f1d18" stroke="#fc3f1d40" strokeWidth="1.2"/>
    <path d="M13 12h5.5c3.5 0 6 2 6 5.2 0 2.2-1.2 3.8-3 4.7l3.5 6.1H22l-3-5.4h-3V28H13V12zm3 8h2.5c2 0 3-.9 3-2.8 0-1.8-1-2.7-3-2.7H16V20z" fill="#fc3f1d" opacity="0.9"/>
  </svg>
);

const IconShedevrum = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#7c3aed18" stroke="#7c3aed40" strokeWidth="1.2"/>
    <path d="M26 11.5L14 23l.9 3.1 3.1.9L30 15.5l-4-4z" fill="#7c3aed" opacity="0.85"/>
    <ellipse cx="14.5" cy="25.5" rx="2.8" ry="2.2" fill="#a78bfa" opacity="0.9"/>
    <path d="M28.5 9.5l1.2-1.7M31 14l1.7-.5M29 16.5l1.2 1.2" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconMidjourney = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#3b82f618" stroke="#3b82f640" strokeWidth="1.2"/>
    <path d="M20 10l3 7h7l-5.5 4 2 7L20 24l-6.5 4 2-7L10 17h7l3-7z" fill="#3b82f6" opacity="0.85"/>
    <circle cx="20" cy="20" r="3.5" fill="#bfdbfe" opacity="0.6"/>
  </svg>
);

const IconKlingAI = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#f59e0b18" stroke="#f59e0b40" strokeWidth="1.2"/>
    <rect x="11" y="18" width="18" height="12" rx="1.5" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="1.5"/>
    <rect x="11" y="13" width="18" height="5" rx="1.5" fill="#f59e0b" opacity="0.85"/>
    <line x1="16" y1="13" x2="14" y2="18" stroke="white" strokeWidth="1.3" opacity="0.8"/>
    <line x1="21" y1="13" x2="19" y2="18" stroke="white" strokeWidth="1.3" opacity="0.8"/>
    <line x1="26" y1="13" x2="24" y2="18" stroke="white" strokeWidth="1.3" opacity="0.8"/>
  </svg>
);

const IconElevenLabs = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#ffffff0a" stroke="#ffffff30" strokeWidth="1.2"/>
    <rect x="10" y="22" width="3" height="7" rx="1.5" fill="white" opacity="0.9"/>
    <rect x="15" y="17" width="3" height="12" rx="1.5" fill="white" opacity="0.9"/>
    <rect x="20" y="12" width="3" height="17" rx="1.5" fill="white" opacity="0.9"/>
    <rect x="25" y="16" width="3" height="13" rx="1.5" fill="white" opacity="0.9"/>
    <rect x="30" y="20" width="3" height="9" rx="1.5" fill="white" opacity="0.9"/>
  </svg>
);

const IconMakeCom = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#6d00cc18" stroke="#6d00cc40" strokeWidth="1.2"/>
    <circle cx="12" cy="20" r="4" fill="#6d00cc" opacity="0.9"/>
    <circle cx="27" cy="13" r="3.5" fill="#a855f7" opacity="0.85"/>
    <circle cx="27" cy="27" r="3.5" fill="#a855f7" opacity="0.85"/>
    <line x1="16" y1="18" x2="23.5" y2="14.5" stroke="#a855f7" strokeWidth="1.6"/>
    <line x1="16" y1="22" x2="23.5" y2="25.5" stroke="#a855f7" strokeWidth="1.6"/>
  </svg>
);

const IconNotionAI = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#ffffff0a" stroke="#ffffff30" strokeWidth="1.2"/>
    <rect x="12" y="11" width="16" height="18" rx="3.5" fill="white" opacity="0.1" stroke="white" strokeWidth="1.3"/>
    <path d="M16 15v10l3-4 3 4V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IconSunoAI = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#e11d4818" stroke="#e11d4840" strokeWidth="1.2"/>
    <path d="M23 12v12.5" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M23 12l7 1.7v3.5l-7-1.7" fill="#e11d48" opacity="0.85"/>
    <ellipse cx="21" cy="24.5" rx="3.5" ry="2.2" fill="#e11d48" opacity="0.9"/>
    <path d="M8.5 27q3-3 6 0 3 3 6 0" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

const IconKaliLinux = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#267ff718" stroke="#267ff740" strokeWidth="1.2"/>
    <path d="M20 11l9 4.5v5.5c0 5-4 8.5-9 10-5-1.5-9-5-9-10v-5.5l9-4.5z" fill="#267ff7" opacity="0.15" stroke="#267ff7" strokeWidth="1.5"/>
    <path d="M20 16l2.5 1.2v4L20 23l-2.5-1.8v-4L20 16z" fill="#267ff7" opacity="0.9"/>
    <path d="M17 22.5l-2 4.5h10l-2-4.5" fill="#267ff7" opacity="0.45"/>
  </svg>
);

const IconDVWA = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#e53e3e18" stroke="#e53e3e40" strokeWidth="1.2"/>
    <path d="M20 11l10 17H10l10-17z" fill="#e53e3e" opacity="0.15" stroke="#e53e3e" strokeWidth="1.5"/>
    <rect x="18.5" y="18" width="3" height="6" rx="1.5" fill="#e53e3e" opacity="0.9"/>
    <circle cx="20" cy="26.5" r="1.5" fill="#e53e3e" opacity="0.9"/>
  </svg>
);

const IconChatGPT = () => (
  <svg width="40" height="40" viewBox="0 0 41 41" fill="none" aria-hidden="true">
    <path d="M37.532 16.87a9.96 9.96 0 0 0-.856-8.184 10.08 10.08 0 0 0-10.855-4.835 9.96 9.96 0 0 0-6.666-2.539 10.08 10.08 0 0 0-9.612 6.977 9.97 9.97 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.96 9.96 0 0 0 .856 8.185 10.08 10.08 0 0 0 10.855 4.835 9.96 9.96 0 0 0 6.666 2.538 10.08 10.08 0 0 0 9.617-6.981 9.97 9.97 0 0 0 6.663-4.834 10.08 10.08 0 0 0-1.243-11.813zm-22.034 15.02a7.47 7.47 0 0 1-4.8-1.735l.238-.134 7.964-4.6a1.29 1.29 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.51 7.51 0 0 1-7.489 7.496zM6.392 31.006a7.47 7.47 0 0 1-.894-5.023l.237.141 7.964 4.6a1.3 1.3 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L16.57 34a7.51 7.51 0 0 1-10.178-2.994zm-2.501-17.527a7.47 7.47 0 0 1 3.903-3.292l-.006.055v9.201a1.29 1.29 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L6.794 23.566a7.5 7.5 0 0 1-2.903-10.087zm27.836 6.437-9.724-5.615 3.367-1.943a.12.12 0 0 1 .114-.012l8.048 4.648a7.5 7.5 0 0 1-1.158 13.528v-9.476a1.29 1.29 0 0 0-.647-1.13zm3.35-5.043-.236-.141-7.965-4.6a1.3 1.3 0 0 0-1.308 0L15.843 16.6V12.71a.12.12 0 0 1 .048-.103l8.048-4.645a7.5 7.5 0 0 1 11.135 7.763zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092V11.47a7.5 7.5 0 0 1 12.293-5.756 7.3 7.3 0 0 0-.236.134l-7.965 4.6a1.29 1.29 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943 4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5v-4.998z" fill="#10a37f"/>
  </svg>
);

export interface Tool {
  name: string; desc: string; badge: string; cls: string; url: string;
  icon?: ReactNode; iconColor?: string; initials?: string; color?: string;
  rf: 'ru' | 'intl' | 'cyber';
}

const TOOLS_RU: Tool[] = [
  { name: 'ГигаЧат', desc: 'Веди диалог, пиши тексты и анализируй данные с российским ИИ от Сбера.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://giga.chat', icon: <IconGigaChat />, rf: 'ru' },
  { name: 'Яндекс Алиса', desc: 'Голосовой ИИ-помощник и поиск от Яндекса — задавай вопросы по-русски.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://ya.ru/alice', icon: <IconAlisa />, rf: 'ru' },
  { name: 'Шедеврум', desc: 'Создавай картинки по текстовому описанию на русском языке.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://shedevrum.ai', icon: <IconShedevrum />, rf: 'ru' },
  { name: 'ЯндексGPT', desc: 'Мощная языковая модель от Яндекса для аналитики, текстов и кода.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://ya.ru', icon: <IconYandexGPT />, rf: 'ru' },
  { name: 'Сбер AI', desc: 'Экосистема ИИ-инструментов от Сбера: ГигаЧат, Кандинский, Studio.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://developers.sber.ru/gigachat', icon: <IconSherAI />, rf: 'ru' },
];

const TOOLS_INTL: Tool[] = [
  { name: 'ChatGPT', desc: 'Решай сложные задачи с одной из самых мощных языковых моделей в мире.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://chatgpt.com', icon: <IconChatGPT />, rf: 'intl' },
  { name: 'Midjourney', desc: 'Создавай фотореалистичные и художественные изображения по описанию.', badge: 'Платно', cls: 'tb-paid', url: 'https://midjourney.com', icon: <IconMidjourney />, rf: 'intl' },
  { name: 'Suno AI', desc: 'Создавай музыкальные треки любого жанра по текстовому запросу.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://suno.com', icon: <IconSunoAI />, rf: 'intl' },
  { name: 'ElevenLabs', desc: 'Клонируй голос и озвучивай тексты с реалистичным синтезом речи.', badge: 'Пробно', cls: 'tb-trial', url: 'https://elevenlabs.io', icon: <IconElevenLabs />, rf: 'intl' },
  { name: 'Make.com', desc: 'Автоматизируй повторяющиеся задачи и связывай сервисы без кода.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://make.com', icon: <IconMakeCom />, rf: 'intl' },
  { name: 'Notion AI', desc: 'Веди умные заметки, базы знаний и документы с ИИ-помощником.', badge: 'Пробно', cls: 'tb-trial', url: 'https://notion.so', icon: <IconNotionAI />, rf: 'intl' },
  { name: 'Kling AI', desc: 'Превращай текст и изображения в короткие видеоролики.', badge: 'Пробно', cls: 'tb-trial', url: 'https://klingai.com', icon: <IconKlingAI />, rf: 'intl' },
];

export const TOOLS_CYBER: Tool[] = [
  { name: 'Kali Linux', desc: 'Изучай кибербезопасность в профессиональной ОС с инструментами для пентеста.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://www.kali.org', icon: <IconKaliLinux />, rf: 'cyber' },
  { name: 'DVWA', desc: 'Практикуй взлом и защиту на специально уязвимом учебном веб-приложении.', badge: 'Бесплатно', cls: 'tb-free', url: 'https://dvwa.co.uk', icon: <IconDVWA />, rf: 'cyber' },
];

function ToolIcon({ t }: { t: Tool }) {
  if (t.icon) return <>{t.icon}</>;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: (t.color || '#f0a500') + '22',
      border: `1.5px solid ${(t.color || '#f0a500')}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--fu)',
      fontSize: (t.initials || '').length > 1 ? '.62rem' : '1.1rem',
      fontWeight: 700, color: t.color || '#f0a500',
    }}>
      {t.initials}
    </div>
  );
}

const MARQUEE_ITEMS = ['ГигаЧат', 'ЯндексGPT', 'ChatGPT', 'Шедеврум', 'Кандинский', 'Suno AI', 'ElevenLabs', 'Kling AI', 'Make.com', 'Perplexity', 'Gamma.app', 'Notion AI', 'n8n', 'HeyGen', 'DALL·E'];

const TICKER_ITEMS = [
  'ChatGPT', 'Midjourney', 'Suno AI', 'Kling AI', 'Make.com',
  'GigaChat', 'YandexGPT', 'Kandinsky', 'DALL-E', 'ElevenLabs',
  'HeyGen', 'Notion AI', 'Telegram Bot', 'Шедеврум', 'Claude',
];

function ToolsTicker() {
  return (
    <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 24, animation: 'tickerScroll 20s linear infinite', width: 'max-content' }}>
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} style={{ fontFamily: 'var(--fu)', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t3)', whiteSpace: 'nowrap', padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const WHY32 = [
  { ico: '◆', title: 'Офлайн в Новозыбкове', sub: 'Живые практики', desc: 'Реальный класс, живое общение — не видеоуроки на диване. Здесь задают вопросы и сразу получают ответы.' },
  { ico: '◆', title: 'Группы до 4 человек', sub: 'Внимание каждому', desc: 'Степан работает с каждым лично. Маленькая группа — значит темп под вас, а не под среднего студента.' },
  { ico: '◆', title: '80% практика', sub: 'С первого занятия', desc: 'Никакой воды — сразу запускаем инструменты. На каждом занятии создаёте что-то реальное.' },
  { ico: '◆', title: 'Реальное портфолио', sub: 'Проекты, не теория', desc: 'Уходите с проектами в руках: боты, автоматизации, истории, треки. Это можно показать, запустить, использовать.' },
];

const RESULTS = [
  { Icon: Bot,    stat: 'за 1 занятие', label: 'Telegram-бот',       sub: 'от идеи до рабочего бота' },
  { Icon: Clock,  stat: '3–5 ч/нед',   label: 'Экономия времени',   sub: 'на рутинных задачах' },
  { Icon: Zap,    stat: '×10',          label: 'Скорость контента',  sub: 'посты, видео, презентации' },
  { Icon: Folder, stat: 'с 1-го урока', label: 'Реальный проект',   sub: 'портфолио для показа' },
];

function ResultsStrip() {
  return (
    <div className="results-strip">
      <div className="results-bento">
        {RESULTS.map(({ Icon, stat, label, sub }, i) => (
          <motion.div key={i} className="results-item"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
            <div className="results-item-icon"><Icon size={20} /></div>
            <div className="results-item-stat">{stat}</div>
            <div className="results-item-label">{label}</div>
            <div className="results-item-sub">{sub}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const PROCESS_STEPS = [
  { Icon: MessageSquare, num: '01', title: 'Приходишь', desc: 'Команда 3–4 человека. Ни у кого нет опыта — это нормально. Всё с нуля.' },
  { Icon: Layers,        num: '02', title: 'Изучаешь',  desc: '20% теории — принципы, которые работают в любом инструменте.' },
  { Icon: Code2,         num: '03', title: 'Делаешь',   desc: '80% практики прямо на занятии: реальные задачи, реальные инструменты.' },
  { Icon: Rocket,        num: '04', title: 'Уходишь с результатом', desc: 'Готовый проект: бот, автоматизация, контент — то, что работает.' },
];

function ProcessSection() {
  return (
    <section className="process-sec">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-head-wrap">
          <span className="section-ghost-num">02</span>
          <motion.div className="s-eyebrow" style={{ textAlign: 'center', marginBottom: 12, position: 'relative', zIndex: 1 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Формат</motion.div>
          <motion.h2 className="s-h2" style={{ textAlign: 'center', marginBottom: 56, position: 'relative', zIndex: 1 }}
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            Как проходит <span className="accent">занятие</span>
          </motion.h2>
        </div>
        <div className="process-timeline">
          {PROCESS_STEPS.map(({ Icon, num, title, desc }, i) => (
            <Fragment key={i}>
              <motion.div className="process-step"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="process-icon-wrap"><Icon size={24} /></div>
                <div className="process-step-body">
                  <div className="process-num">{num}</div>
                  <div className="process-step-title">{title}</div>
                  <div className="process-step-desc">{desc}</div>
                </div>
              </motion.div>
              {i < PROCESS_STEPS.length - 1 && (
                <div className="process-conn"><div className="process-conn-line" /></div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials section — placeholder until real reviews arrive.
// Previously we shipped 3 AI-generated avatars (Алина К. / Дмитрий С. / Юлия В.)
// with invented quotes. That violates Google/Yandex FAQ-structured-data policy
// and any adult visitor sees through it instantly — a trust-loss on first scroll.
// When the first cohort finishes we'll replace this block with real reviews
// (component `Reviews.tsx` handles the form + storage).
function TestimonialsSection() {
  return (
    <section className="testi-sec">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-head-wrap">
          <span className="section-ghost-num">03</span>
          <div className="s-eyebrow rv" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>Отзывы</div>
          <motion.h2 className="s-h2" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            Первый выпуск — <span className="accent">в работе</span>
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
            padding: '44px 28px',
            border: '1px dashed rgba(240,165,0,.25)',
            borderRadius: 18,
            background: 'rgba(240,165,0,.04)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>✍️</div>
          <p style={{ fontSize: '1rem', color: 'var(--t1)', marginBottom: 10, fontFamily: 'var(--fu)', letterSpacing: '.02em' }}>
            Честные отзывы — после первой когорты
          </p>
          <p style={{ fontSize: '.9rem', color: 'var(--t3)', lineHeight: 1.7, marginBottom: 18 }}>
            Мы только начинаем. Не хотим выдумывать цитаты — дождёмся реальных слов участников.
            Хотите быть первым? Напишите Степану в Telegram и запишитесь на пробное занятие — ваш отзыв
            появится здесь после четырёх недель обучения.
          </p>
          <a
            href="https://t.me/DSM1322"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-amber btn-sm"
            style={{ justifyContent: 'center' }}
          >
            Написать Степану в Telegram →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

const PAIN_BEFORE = [
  { text: 'Слышали об ИИ, но не знаете с чего начать' },
  { text: 'Тратите часы на рутину, которую ИИ делает за минуты' },
  { text: 'Дети сидят в соцсетях, а не развиваются' },
];
const PAIN_AFTER = [
  { text: 'Результат уже на первом занятии — не теория, а готовый проект' },
  { text: 'Экономите 3–5 часов рабочего времени уже через месяц' },
  { text: 'Дети создают мультфильмы, музыку и ботов — и горят этим' },
];

function PainBASection({ onEnroll }: { onEnroll: () => void }) {
  return (
    <section className="pain-sec">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="s-eyebrow rv" style={{ textAlign: 'center' }}>Узнаёте себя?</div>
        <motion.h2 className="s-h2" style={{ textAlign: 'center' }}
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          Проблемы, которые мы <span className="accent">решаем</span>
        </motion.h2>
        <div className="pain-ba-grid">
          <div className="pain-col pain-col-before">
            <div className="pain-col-heading">
              <XCircle size={14} /> До Нейро 32
            </div>
            {PAIN_BEFORE.map((p, i) => (
              <div key={i} className="pain-item">
                <XCircle size={16} className="pain-item-icon icon-red" />
                <span>{p.text}</span>
              </div>
            ))}
          </div>
          <div className="pain-col pain-col-after">
            <div className="pain-col-heading">
              <CheckCircle2 size={14} /> После Нейро 32
            </div>
            {PAIN_AFTER.map((p, i) => (
              <div key={i} className="pain-item">
                <CheckCircle2 size={16} className="pain-item-icon icon-amber" />
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <MagneticBtn className="btn btn-amber btn-lg" onClick={onEnroll}>
            Записаться на первое занятие →
          </MagneticBtn>
        </div>
      </div>
    </section>
  );
}

function WhySection({ onEnroll }: { onEnroll: () => void }) {
  return (
    <section style={{ padding: '80px 56px', background: 'rgba(0,0,0,.15)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-head-wrap">
          <span className="section-ghost-num">01</span>
          <div className="s-eyebrow rv" style={{ textAlign: 'center' }}>Наши принципы</div>
          <motion.h2 className="s-h2 rv" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            Почему <span className="accent">Нейро 32</span>
          </motion.h2>
        </div>
        <motion.div className="why32-grid rv"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}>
          {WHY32.map((c, i) => (
            <motion.div key={i}
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.97 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 80 } },
              }}>
              <TiltCard className="why32-card rv-s">
                <div className="why32-ico">{c.ico}</div>
                <div className="why32-sub">{c.sub}</div>
                <div className="why32-title">{c.title}</div>
                <div className="why32-desc">{c.desc}</div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-amber btn-lg" onClick={onEnroll}>Начать сейчас за 500 ₽ →</button>
        </div>
      </div>
    </section>
  );
}


const BIZ_TASKS = [
  { Icon: Pencil,   label: 'Маркетинговые тексты', desc: 'Продающие посты, описания товаров, письма клиентам' },
  { Icon: Zap,      label: 'Визуальный контент', desc: 'Иллюстрации, баннеры, презентации с помощью ИИ-инструментов' },
  { Icon: Settings, label: 'Прототипы автоматизаций', desc: 'Простые сценарии на Make.com: уведомления, сбор данных, интеграции' },
  { Icon: BarChart, label: 'Несложная аналитика', desc: 'Обработка таблиц, сводки, визуализация через ИИ-инструменты' },
];

const BIZ_LIMITS = [
  'Не беремся за критически важные системы',
  'Не работаем с чувствительными персональными данными',
  'Не даём гарантий качества как профессиональная команда',
];


interface BizForm {
  nameOrCompany: string;
  contact: string;
  taskDescription: string;
  format: string;
  consentPersonalData: boolean;
  consentEducationalCase: boolean;
}

export function BusinessSection() {
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<BizForm>({
    nameOrCompany: '',
    contact: '',
    taskDescription: '',
    format: 'any',
    consentPersonalData: false,
    consentEducationalCase: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consentPersonalData) {
      setErrorMsg('Необходимо дать согласие на обработку персональных данных');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
      const res = await fetch(`${apiBase}/api/business-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameOrCompany: form.nameOrCompany,
          contact: form.contact,
          taskDescription: form.taskDescription,
          format: form.format,
          consentPersonalData: form.consentPersonalData,
          consentEducationalCase: form.consentEducationalCase,
        }),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      if (data.ok) {
        analytics.businessSubmit(form.format);
        setStatus('success');
        setForm({ nameOrCompany: '', contact: '', taskDescription: '', format: 'any', consentPersonalData: false, consentEducationalCase: false });
        setTimeout(() => { setModalOpen(false); setStatus('idle'); }, 3000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Ошибка отправки. Попробуйте позже.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Не удалось отправить заявку. Проверьте соединение и попробуйте снова.');
    }
  };

  return (
    <section className="S S-mid" id="business">
      <div className="s-eyebrow rv" style={{ color: 'var(--amber)' }}>Для бизнеса и организаций</div>
      <h2 className="s-h2 rv">Нейро 32 <span className="accent">для бизнеса</span></h2>
      <div className="rv" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, maxWidth: 700, margin: '0 auto 36px', fontSize: '1rem', color: 'var(--t2)', lineHeight: 1.8 }}>
        <p style={{ margin: 0 }}>Компании и ИП могут обратиться в Нейро 32 с задачами по ИИ: маркетинг, автоматизация, создание контента и визуалов.</p>
        <p style={{ margin: 0 }}>Часть задач выполняется учениками под руководством наставника — это честный учебный кейс с реальным результатом.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 36 }}>
        {/* What we do */}
        <div style={{ background: 'rgba(74,124,255,.04)', border: '1px solid rgba(74,124,255,.15)', borderRadius: 20, padding: '28px 28px 24px' }}>
          <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: '#4a7cff', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Что можем сделать</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {BIZ_TASKS.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <t.Icon size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--amber)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--fb)', fontSize: '.88rem', color: '#fff', fontWeight: 600, marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', color: 'var(--t3)', lineHeight: 1.5 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limits + educational case */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(220,38,38,.04)', border: '1px solid rgba(220,38,38,.15)', borderRadius: 20, padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: '#f87171', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>Ограничения</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BIZ_LIMITS.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <XCircle size={14} style={{ color: '#f87171', flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.5 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(240,165,0,.04)', border: '1px solid rgba(240,165,0,.15)', borderRadius: 20, padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Формат «учебный кейс»</div>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.7, margin: 0 }}>
              Часть задач может выполняться учениками под контролем наставника. Заказчик явно соглашается на такой формат — это опционально. Описание задачи может использоваться в обезличенном виде как учебный материал только с отдельного согласия.
            </p>
          </div>
        </div>
      </div>

      {/* CTA to open modal */}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button className="btn btn-amber btn-lg" onClick={() => setModalOpen(true)}>Отправить бизнес-заявку →</button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 24, padding: 'clamp(20px, 5vw, 40px)', width: '100%', maxWidth: 'min(520px, calc(100vw - 32px))',
            maxHeight: '90vh', overflowY: 'auto', position: 'relative',
          }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--t4)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
              aria-label="Закрыть"
            >✕</button>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.78rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 6 }}>Бизнес-заявка</div>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--t3)', marginBottom: 24, lineHeight: 1.6 }}>
              Оставьте контакт — Степан свяжется в течение 24 часов в рабочие дни.
            </p>

            {status === 'success' ? (
              <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={40} style={{ color: '#2d9e6b' }} /></div>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.9rem', color: '#fff', marginBottom: 10 }}>Заявка отправлена!</div>
                <p style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: 'var(--t2)', lineHeight: 1.6 }}>
                  Степан свяжется в течение 24 часов.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="biz-name">Имя / компания *</label>
                  <input
                    id="biz-name"
                    className="form-inp"
                    value={form.nameOrCompany}
                    onChange={e => setForm(f => ({ ...f, nameOrCompany: e.target.value }))}
                    placeholder="ООО «Название» или Иван Иванов"
                    autoComplete="organization"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="biz-contact">Телефон или Telegram *</label>
                  <input
                    id="biz-contact"
                    className="form-inp"
                    type="tel"
                    inputMode="tel"
                    value={form.contact}
                    onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="+7 (9XX) XXX-XX-XX или @username"
                    autoComplete="tel"
                    required
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '12px 14px', background: form.consentPersonalData ? 'rgba(45,158,107,.06)' : 'rgba(255,255,255,.03)', border: `1.5px solid ${form.consentPersonalData ? 'rgba(45,158,107,.3)' : 'var(--line)'}`, borderRadius: 12, transition: 'all .2s' }}>
                  <input
                    type="checkbox"
                    checked={form.consentPersonalData}
                    onChange={e => { setForm(f => ({ ...f, consentPersonalData: e.target.checked })); setErrorMsg(''); }}
                    style={{ width: 18, height: 18, accentColor: '#2d9e6b', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
                  />
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--t3)', lineHeight: 1.5 }}>
                    Согласен на обработку персональных данных (имя, контакт) для связи по заявке. <span style={{ color: '#f87171' }}>*</span>
                  </div>
                </label>

                {errorMsg && (
                  <div style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--fm)', fontSize: '.78rem', color: '#f87171' }}>
                    {errorMsg}
                  </div>
                )}

                <button type="submit" className="btn btn-amber btn-lg" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Отправка...' : 'Отправить →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

type FaqItem = { q: string; a: string };

const FAQ_GROUPS: { label: string; items: FaqItem[] }[] = [
  {
    label: 'Общие',
    items: [
      { q: 'Я вообще не разбираюсь в ИИ — это подойдёт мне?', a: 'Да, мы начинаем с нуля. На первом занятии у каждого будет рабочий результат, даже без опыта. 80% времени — практика за компьютером рядом со Степаном.' },
      { q: 'Какой формат занятий? Онлайн или офлайн?', a: 'Только офлайн: г. Новозыбков, ул. Коммунистическая 22А (АНО «Простые вещи»). 4 рабочих компьютера. 2 занятия в неделю по 60–90 минут.' },
      { q: 'Когда ближайший старт?', a: 'Новые группы стартуют каждые 4–6 недель. Точную дату и количество свободных мест я скажу, когда вы напишете в Telegram @DSM1322 или оставите заявку — подтверждение и детали пришлю в течение часа.' },
      { q: 'Как записаться?', a: 'Нажмите кнопку «Записаться» на сайте или напишите напрямую в Telegram. После заявки мы свяжемся в течение часа для подтверждения места и уточнения деталей.' },
      { q: 'Какие документы выдаются?', a: 'Нейро 32 — кружок/лаборатория практик, не лицензированное учебное заведение. По итогу курса выдаётся сертификат участника Нейро 32. Государственные документы об образовании не выдаются.' },
      { q: 'Есть ли гибкая оплата или рассрочка?', a: 'Да. Оплата через СБП или наличными. Рассрочка возможна по договорённости — обсудим индивидуально. Официальный чек через «Мой налог» — автоматически.' },
      { q: 'Что будет, если пропустить занятие?', a: 'Можно согласовать пересдачу с другой группой или отработать материал самостоятельно по записям. Степан доступен в Telegram для вопросов между занятиями.' },
    ],
  },
  {
    label: 'Родителям',
    items: [
      { q: 'С какого возраста принимаете детей?', a: 'Дети с 7 лет — отдельная программа с Алисой, Шедеврумом, Suno AI и Scratch. Особый подход: игровой формат, 60 минут, отчёты родителям каждые 6 занятий.' },
      { q: 'Кто ведёт занятия?', a: 'Занятия ведёт Степан — практик в области ИИ-инструментов с опытом работы с детьми и подростками. Дети работают в парах: 4 компьютера на 8 человек — с первого занятия осваивают командную работу.' },
      { q: 'Что получит ребёнок по итогу курса?', a: 'Ребёнок создаст реальные проекты: иллюстрированную историю, музыкальный трек, мини-мультфильм — и получит сертификат участника Нейро 32. Это его первое настоящее портфолио.' },
      { q: 'Насколько безопасны темы и контент на занятиях?', a: 'Программа для детей полностью адаптирована по возрасту. Используются только проверенные отечественные и международные инструменты (Алиса, Шедеврум, Suno AI). Все темы — творческие и образовательные.' },
      { q: 'Нужно ли согласие родителя для курса по кибербезопасности?', a: 'Да. Для участников до 18 лет в курсе «Цифровая защита» необходимо письменное согласие родителя или законного представителя.' },
    ],
  },
  {
    label: 'Подросткам',
    items: [
      { q: 'Смогу ли использовать проекты для портфолио или поступления?', a: 'Да. Вы создадите 5+ реальных проектов: Telegram-бот, автоматизацию, питч-дек. Всё это — конкретные работы для портфолио при поступлении или устройстве на работу. Также выдаётся сертификат участника и рекомендательное письмо от Нейро 32.' },
      { q: 'Поможет ли курс при выборе профессии?', a: 'Да. На занятиях вы попробуете разные роли: разработчик бота, автоматизатор, дизайнер презентаций. Это помогает понять, что нравится и куда двигаться. Плюс — навыки ИИ востребованы в любой профессии.' },
      { q: 'Нужно ли знать программирование?', a: 'Нет. Python появляется только на 10-м занятии — когда уже понятна общая логика. До этого работаем без кода: промпты, Make.com, Gamma.' },
    ],
  },
  {
    label: 'Взрослым',
    items: [
      { q: 'Как сочетается курс с полной занятостью?', a: '2 занятия в неделю по 60–90 минут в удобное вечернее время. Обязательных домашних заданий нет. Расписание согласовываем с группой — большинство участников совмещают с работой без проблем.' },
      { q: 'Нужен ли технический бэкграунд?', a: 'Нет. Программа построена вокруг бизнес-задач, а не кода. Если умеете работать в Word или Excel — этого достаточно для старта. Не нужно знать программирование.' },
      { q: 'Что конкретно я смогу делать после курса?', a: 'Автоматизировать рутинные задачи, создавать тексты и отчёты в 10× быстрее, запустить ИИ-агента для вашего бизнеса, настроить умную базу знаний команды. На 8-м занятии решаем вашу реальную рабочую задачу прямо на уроке.' },
    ],
  },
];

function FAQ() {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const currentItems = FAQ_GROUPS[activeTab].items;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {FAQ_GROUPS.map((g, i) => (
          <button
            key={i}
            onClick={() => { setActiveTab(i); setOpen(null); }}
            style={{
              minHeight: 44,
              padding: '10px 18px',
              borderRadius: 20,
              border: `1px solid ${activeTab === i ? 'var(--amber)' : 'var(--line)'}`,
              background: activeTab === i ? 'rgba(240,165,0,.12)' : 'transparent',
              color: activeTab === i ? 'var(--amber)' : 'var(--t2)',
              fontFamily: 'var(--fm)',
              fontSize: '.7rem',
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className="faq-list">
        {currentItems.map((item, i) => (
          <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span className="faq-q-text">{item.q}</span>
              <span className="faq-toggle">+</span>
            </button>
            <div className="faq-a-wrap">
              <div className="faq-a">
                <div className="faq-a-inner">{item.a}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { obs.disconnect(); setStarted(true); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const dirs = useCountUp(4, started, 1100);
  const tools = useCountUp(12, started, 1300);
  const pct = useCountUp(100, started, 1600);
  return (
    <div ref={ref} className="hero-stats" style={{ marginBottom: 28 }} role="group" aria-label="Статистика школы">
      <div className="hstat" aria-label={`${dirs} направления`}><div className="hstat-n">{dirs}</div><div className="hstat-l">направления</div></div>
      <div className="hstat" aria-label={`${tools}+ инструментов`}><div className="hstat-n">{tools}+</div><div className="hstat-l">инструментов</div></div>
      <div className="hstat" aria-label={`${pct}% офлайн`}><div className="hstat-n">{pct}%</div><div className="hstat-l">офлайн</div></div>
      <div className="hstat" aria-label="возраст от 7 до 70 лет"><div className="hstat-n">7–70</div><div className="hstat-l">лет</div></div>
    </div>
  );
}

const HERO_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.10, delayChildren: 0.15 } },
};
const HERO_ITEM = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring' as const, stiffness: 70, damping: 18 } },
};

export default function Home({ onAIToggle, onEnroll }: { onAIToggle: () => void; onEnroll: (p?: string) => void }) {
  usePageMeta('Нейро 32 — Офлайн-практика ИИ в Новозыбкове', 'Офлайн-лаборатория ИИ в Новозыбкове. 4 направления: дети 7–12, подростки 13–17, взрослые 18+, кибербезопасность. Пробное занятие 500 ₽. Результат с первого урока.');
  const isMobile = useIsMobile();
  const wantsLowMotion = useWantsLowMotion();
  const [, navigate] = useLocation();
  const reviews = store.getReviews().slice(0, 3);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.97]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const scrollDir = (d: number) => {
    const wrap = trackRef.current?.parentElement;
    if (wrap) wrap.scrollBy({ left: d * 360, behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO */}
      <motion.section ref={heroRef} className="hero" style={{ scale: heroScale, opacity: heroOpacity }}>
        <div className="hero-bg-grid" />
        <div className="hero-mesh" />
        <picture>
          <source srcSet="/gen/hero-bg.webp" type="image/webp" />
          <img src="/gen/hero-bg.jpg" alt="" aria-hidden="true" width={1600} height={1067} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07, pointerEvents: 'none', userSelect: 'none' }} decoding="async" fetchPriority="high" />
        </picture>
        {!wantsLowMotion && (
          <Suspense fallback={null}>
            <ParticlesBackground count={isMobile ? 20 : 60} maxDist={130} mouseRadius={170} />
          </Suspense>
        )}
        <div className="hero-glow" />
        <div className="hero-neon-arc" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <path className="neon-path-1" d="M-100,600 Q350,100 700,350 Q1050,600 1500,200" />
            <path className="neon-path-2" d="M-50,400 Q400,50 750,300 Q1100,550 1500,100" />
            <path className="neon-path-3" d="M0,700 Q500,200 900,450 Q1200,650 1500,350" />
          </svg>
        </div>
        <div className="hero-inner">
          <motion.div className="hero-l" variants={HERO_CONTAINER} initial="hidden" animate="show">
            <motion.div variants={HERO_ITEM} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8, padding: '6px 14px', fontFamily: 'var(--fm)', fontSize: '.64rem', color: '#10b981', letterSpacing: '.1em', marginBottom: 10 }}>
              <div className="badge-dot" />
              Набор открыт · Запишитесь на пробное
            </motion.div>
            <motion.h1 variants={HERO_ITEM}>
              НЕЙРО-ПРАКТИКИ&nbsp;<span className="text-gradient-animated" style={{ filter: 'drop-shadow(0 0 22px rgba(240,165,0,.4))' }}>ИИ</span>
            </motion.h1>
            <motion.p className="hero-sub" variants={HERO_ITEM}>
              Изучите <Typewriter /> на офлайн-занятиях в Новозыбкове. Результат с первого занятия.
            </motion.p>

            <motion.div variants={HERO_ITEM}><HeroStats /></motion.div>

            <motion.div className="hero-btns" variants={HERO_ITEM}>
              <MagneticBtn className="btn btn-amber btn-lg" onClick={() => onEnroll()}>Записаться на занятие →</MagneticBtn>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/packages')}>Выбрать программу</button>
            </motion.div>
            <motion.div variants={HERO_ITEM} className="hero-chips">
              <span className="hero-chip"><Zap size={11} />1 занятие → рабочий проект</span>
              <span className="hero-chip"><Bot size={11} />ChatGPT, Midjourney, Sora</span>
              <span className="hero-chip"><Clock size={11} />Новые группы каждые 4–6 недель</span>
            </motion.div>
          </motion.div>
          <motion.div className="hero-r hero-r-animated"
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            {!wantsLowMotion && (
              <Suspense fallback={<div style={{ height: 360 }} aria-hidden="true" />}>
                <NeuralNetworkModel />
              </Suspense>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="marquee-item">
              <span className="mi-dot">◆</span>{item}
            </div>
          ))}
        </div>
      </div>

      {/* TOOLS TRUST STRIP */}
      <div className="tools-trust-strip">
        <span className="tts-label">Инструменты, которым вы научитесь</span>
        <div className="tts-logos">
          {['ChatGPT', 'Midjourney', 'Claude AI', 'Telegram Bot', 'Canva AI', 'Sora', 'Runway', 'ElevenLabs'].map((name, i) => (
            <span key={i} className="tts-logo">{name}</span>
          ))}
        </div>
      </div>

      {/* RESULTS BENTO */}
      <ResultsStrip />

      {/* WHY НЕЙРО 32 */}
      <WhySection onEnroll={onEnroll} />

      {/* PAIN POINTS — До/После */}
      <PainBASection onEnroll={onEnroll} />

      {/* DIRECTIONS */}
      <section className="S">
        <div className="s-eyebrow rv">Направления практики</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">Выберите свой <span className="accent">путь в ИИ</span></h2>
        <div className="dir-track-wrap">
          <div className="dir-track" ref={trackRef}>
            {DIRS.map((d, i) => (
              <TiltCard key={i} className="dsc" onClick={() => { analytics.programClick(d.href.replace('/', '') as 'kids' | 'teens' | 'adults' | 'cyber'); navigate(d.href); }}>
                <div className="dsc-num">{d.num}</div>
                <div className="dsc-title">{d.title}</div>
                <div className="dsc-desc">{d.desc}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {d.tags.map((t, j) => (
                    <span key={j} style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t3)', background: 'rgba(255,255,255,.05)', borderRadius: 6, padding: '3px 8px' }}>{t}</span>
                  ))}
                </div>
                <div className="dsc-stats">
                  {d.stats.map((s, j) => (
                    <div key={j} style={{ flex: 1 }}>
                      <div className="dsc-sn">{s.n}</div>
                      <div className="dsc-sl">{s.l}</div>
                    </div>
                  ))}
                  <span className={`dsc-chip ${d.chipCls}`}>{d.chip}</span>
                </div>
                <button className="btn btn-amber btn-sm" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                  onClick={e => { e.stopPropagation(); onEnroll(d.program); }}>
                  Записаться →
                </button>
              </TiltCard>
            ))}
          </div>
        </div>
        <div className="dir-scroll-hint">
          <button className="dir-arrow" onClick={() => scrollDir(-1)} aria-label="Прокрутить влево">←</button>
          <span>Листайте горизонтально</span>
          <button className="dir-arrow" onClick={() => scrollDir(1)} aria-label="Прокрутить вправо">→</button>
        </div>
      </section>

      <WaveDivider fromColor="#0a0a12" toColor="#faf8f3" />

      {/* WHY OFFLINE — сначала аргумент, потом метод */}
      <section className="S S-light">
        <div className="s-eyebrow rv" style={{ color: 'var(--amber)' }}>Почему офлайн эффективнее</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv" style={{ color: 'var(--navy)' }}>Живая практика <span className="accent">меняет всё</span></h2>
        <div className="why-grid">
          <div className="why-list">
            {[
              { icon: '◈', ttl: 'Немедленная обратная связь', dsc: 'В офлайне вопрос задаётся мгновенно. Эксперт видит реакцию и подстраивает темп прямо на занятии.' },
              { icon: '▣', ttl: '4 компьютера на каждую сессию', dsc: 'Рабочая лаборатория, а не рекламный текст. Всё, что показывается — запускается прямо на реальных устройствах.' },
              { icon: '◉', ttl: 'Партнёрство с АНО «Простые вещи»', dsc: 'Площадка предоставляется безвозмездно — это позволяет держать стоимость ниже рынка.' },
              { icon: '◎', ttl: 'Под ваши задачи, не под программу', dsc: 'Каждое занятие завершается конкретным результатом. Приносите реальные рабочие задачи — решим вместе.' },
            ].map((item, i) => (
              <div key={i} className="why-item">
                <div className="why-ico" style={{ fontFamily: 'var(--fu)', fontSize: '1.1rem', color: 'var(--amber)' }}>{item.icon}</div>
                <div>
                  <div className="why-ttl">{item.ttl}</div>
                  <div className="why-dsc">{item.dsc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="why-panel">
            <h3 style={{ fontFamily: 'var(--fu)', fontSize: '.76rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', marginBottom: 8 }}>Инструменты на каждом занятии</h3>
            <p style={{ fontSize: '.84rem', color: 'var(--t3)', marginBottom: 16 }}>Уйдёте с готовым рабочим арсеналом из 10+ инструментов.</p>
            {[
              { l: 'Языковые модели', v: 'ГигаЧат · ЯндексGPT · ChatGPT' },
              { l: 'Изображения', v: 'Шедеврум · Кандинский · DALL·E' },
              { l: 'Видео и голос', v: 'Kling AI · ElevenLabs · HeyGen' },
              { l: 'Автоматизация', v: 'Make.com · n8n · Perplexity' },
            ].map((row, i) => (
              <div key={i} className="wp-row">
                <div className="wp-l">{row.l}</div>
                <div className="wp-v">{row.v}</div>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-amber btn-sm" onClick={() => onEnroll()} style={{ width: '100%', justifyContent: 'center' }}>Записаться →</button>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#faf8f3" toColor="#0f0f1e" />

      {/* HOW IT WORKS — Process Section */}
      <ProcessSection />

      {/* TOOLS */}
      <section className="S S-mid tools-section-wrap">
        <div className="s-eyebrow rv">Онлайн-инструменты</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">Инструменты, которые <span className="accent">изучаем</span></h2>
        <div className="rv" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, maxWidth: 680, margin: '0 auto 32px', fontSize: '.9rem', color: 'var(--t3)', lineHeight: 1.65 }}>
          <p style={{ margin: 0 }}>На занятиях начинаем с российских сервисов — они стабильно доступны без ограничений и работают в любой сети.</p>
          <p style={{ margin: 0 }}>Международные инструменты используем там, где нет российского аналога. Доступность части из них зависит от настроек интернета.</p>
        </div>

        <ToolsTicker />

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--fm)' }}>Базовые российские</h3>
            <span style={{
              fontSize: '.65rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 8px',
              borderRadius: 6,
              background: 'rgba(16,185,129,.1)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)',
            }}>RU · Стабильно доступен</span>
          </div>
          <div className="tools-grid">
            {TOOLS_RU.map((t, i) => (
              <a
                key={i}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tool-card rv-s"
                style={{ transitionDelay: `${(i % 4) * 0.06}s`, textDecoration: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div className="tool-ico" style={{ display: 'flex', alignItems: 'center' }}>
                    <ToolIcon t={t} />
                  </div>
                  <span className="tool-card-badge" style={{
                    fontSize: '.52rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 7px',
                    borderRadius: 6,
                    background: 'rgba(16,185,129,.1)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)',
                  }}>RU</span>
                </div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
                <div style={{ fontSize: '.6rem', color: 'var(--t4)', marginTop: 4, fontFamily: 'var(--fm)' }}>{t.url.replace('https://', '')}</div>
                <span className={`tool-badge ${t.cls}`}>{t.badge}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--fm)' }}>Международные</h3>
            <span style={{
              fontSize: '.65rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 8px',
              borderRadius: 6,
              background: 'rgba(240,165,0,.1)', color: 'var(--amber)', border: '1px solid rgba(240,165,0,.2)',
            }}>⚠ Доступность зависит от интернета</span>
          </div>
          <div className="tools-grid">
            {TOOLS_INTL.map((t, i) => (
              <a
                key={i}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tool-card rv-s"
                style={{ transitionDelay: `${(i % 4) * 0.06}s`, textDecoration: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div className="tool-ico" style={{ display: 'flex', alignItems: 'center' }}>
                    <ToolIcon t={t} />
                  </div>
                  <span className="tool-card-badge" style={{
                    fontSize: '.52rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 7px',
                    borderRadius: 6,
                    background: 'rgba(240,165,0,.1)', color: 'var(--amber)', border: '1px solid rgba(240,165,0,.2)',
                  }}>⚠</span>
                </div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
                <div style={{ fontSize: '.6rem', color: 'var(--t4)', marginTop: 4, fontFamily: 'var(--fm)' }}>{t.url.replace('https://', '')}</div>
                <span className={`tool-badge ${t.cls}`}>{t.badge}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 32,
          padding: '14px 20px',
          background: 'rgba(255,255,255,.03)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: '.82rem', color: 'var(--t3)', fontFamily: 'var(--fm)',
        }}>
          <Lock size={18} style={{ flexShrink: 0, color: 'var(--amber)' }} />
          <span><strong style={{ color: 'var(--t2)' }}>Кибербезопасность</strong> — Kali Linux и DVWA — изучаем на отдельном курсе <a href="/cyber" style={{ color: 'var(--amber)', textDecoration: 'none' }}>«Цифровая защита»</a>.</span>
        </div>
      </section>

      {/* EXPERT */}
      <section className="S S-mid">
        <div className="s-eyebrow rv" style={{ color: 'var(--amber)' }}>Кто ведёт занятия</div>
        <div style={{
          display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40,
          background: 'rgba(255,255,255,.02)', border: '1px solid var(--line)',
          borderRadius: 24, padding: '36px 48px',
          backdropFilter: 'blur(12px)',
          borderLeft: '3px solid rgba(240,165,0,.4)',
          alignItems: 'start',
        }} className="expert-expanded rv">
          {/* Photo column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 200, height: 240, borderRadius: 16,
              overflow: 'hidden', border: '1px solid rgba(240,165,0,.2)',
              boxShadow: '0 12px 40px rgba(0,0,0,.4)',
            }}>
              <img src="/denis.jpg" alt="Степан Денис — основатель Нейро 32" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} width="200" height="240" loading="lazy" decoding="async" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
              <span className="chip ch-amber" style={{ textAlign: 'center', justifyContent: 'center' }}>Практик с 2022</span>
              <span className="chip ch-green" style={{ textAlign: 'center', justifyContent: 'center' }}>Офлайн · Новозыбков</span>
              <span className="chip ch-dim" style={{ textAlign: 'center', justifyContent: 'center' }}>4 направления</span>
            </div>
          </div>
          {/* Bio column */}
          <div>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.64rem', color: 'var(--amber)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 10 }}>Степан Денис · Основатель Нейро 32</div>
            <h3 style={{ fontFamily: 'var(--fu)', fontSize: '1.3rem', color: '#fff', marginBottom: 16, fontWeight: 700 }}>Я не преподаю по учебникам</h3>
            <p style={{ fontSize: '1rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 12 }}>
              Я учу тому, что сам использую каждый день с 2022 года: ChatGPT, Make.com, Python, ElevenLabs — всё это реальные рабочие инструменты, а не демки из интернета. Коллеги начали просить «покажи как» — и я открыл Нейро 32.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 24 }}>
              Принцип простой: каждое занятие — конкретный результат. Приносите реальные задачи — решим вместе прямо на занятии.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/about" className="btn btn-amber btn-sm" style={{ textDecoration: 'none' }}>Подробнее об эксперте →</a>
              <button className="btn btn-ghost btn-sm" onClick={() => onEnroll()}>Записаться</button>
            </div>
          </div>
        </div>
        <style>{`
          @media(max-width:768px) {
            .expert-expanded { grid-template-columns: 1fr !important; padding: 28px 24px !important; }
            .expert-expanded > div:first-child { flex-direction: row !important; align-items: center !important; }
            .expert-expanded > div:first-child > div:first-child { width: 100px !important; height: 120px !important; flex-shrink: 0 !important; }
          }
        `}</style>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* REVIEWS — скрыты до первых занятий (4 мая 2026) */}
      {reviews.length > 0 && (
        <section className="S">
          <div className="s-eyebrow rv">Отзывы участников</div>
          <h2 className="s-h2 rv">Говорят те, кто <span className="accent">прошёл практики</span></h2>
          <div className="rv-grid" style={{ marginBottom: 28 }}>
            {reviews.map((rv, i) => (
              <div key={i} className="rv-card rv-s" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="rv-stars">{'★'.repeat(rv.rating)}</div>
                <div className="rv-text">«{rv.text}»</div>
                <div className="rv-author">
                  <div className="rv-av">{rv.name[0]}</div>
                  <div>
                    <div className="rv-nm">{rv.name}</div>
                    <div className="rv-role">{rv.role} · {rv.direction}</div>
                  </div>
                  <div className="rv-date">{rv.date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="S S-mid">
        <div className="s-eyebrow rv">Вопросы и ответы</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">Часто <span className="accent">спрашивают</span></h2>
        <FAQ />
        <div style={{ marginTop: 36, padding: '22px 28px', background: 'rgba(240,165,0,.05)', border: '1px solid rgba(240,165,0,.12)', borderRadius: 16, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.68rem', fontWeight: 700, color: '#fff', marginBottom: 5, letterSpacing: '.04em' }}>Не нашли ответ?</div>
            <div style={{ fontSize: '.88rem', color: 'var(--t3)' }}>Степан отвечает в Telegram обычно в течение 30 минут</div>
          </div>
          <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm">Написать в Telegram →</a>
        </div>
      </section>

      {/* BUSINESS TEASER — full section lives on /business */}
      <section className="S S-mid" id="business">
        <div className="s-eyebrow rv" style={{ color: 'var(--amber)' }}>Для бизнеса и организаций</div>
        <h2 className="s-h2 rv">Нейро 32 <span className="accent">для бизнеса</span></h2>
        <p className="rv" style={{ maxWidth: 640, margin: '0 auto 28px', textAlign: 'center', fontSize: '1rem', color: 'var(--t2)', lineHeight: 1.75 }}>
          Маркетинг, автоматизация, контент и визуалы — под задачу или как учебный кейс с учениками. Подробный формат и лимиты — на отдельной странице.
        </p>
        <div className="rv" style={{ textAlign: 'center' }}>
          <a href="/business" className="btn btn-amber btn-lg" style={{ textDecoration: 'none' }}>Открыть раздел «Для бизнеса» →</a>
        </div>
      </section>

      {/* CTA v2 — animated gradient */}
      <div className="cta-sec-v2">
        <div className="cta-box-v2 rv-s">
          <div className="cta-v2-txt" style={{ position: 'relative', zIndex: 1 }}>
            <h3>Готовы начать?</h3>
            <p>Запишитесь — Степан подберёт программу под ваши задачи и уровень</p>
            <div className="cta-v2-timer">Новые группы каждые 4–6 недель · Точную дату согласуем в Telegram</div>
          </div>
          <div className="cta-v2-btns" style={{ position: 'relative', zIndex: 1 }}>
            <button className="btn-cta-enroll" onClick={() => onEnroll()}>Записаться на занятие →</button>
            <button className="btn-cta-dark" onClick={onAIToggle}>Спросить у Нейры</button>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="mobile-sticky-cta">
        <button className="btn btn-amber" style={{ width: '100%', justifyContent: 'center', minHeight: 48 }}
          onClick={() => onEnroll()}>
          Записаться на урок →
        </button>
      </div>

    </div>
  );
}
