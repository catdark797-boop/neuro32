import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { usePageMeta } from '../hooks/usePageMeta';
import { store } from '../lib/store';
import ParticlesBackground from '../components/ParticlesBackground';
import { useIsMobile } from '../hooks/use-mobile';
import { analytics } from '../lib/analytics';

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
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-8px)`;
    el.style.boxShadow = `${x * -18}px ${y * -8}px 36px rgba(0,0,0,.35), 0 24px 64px rgba(0,0,0,.45), 0 0 28px rgba(240,165,0,.18)`;
  };
  const handleMouseLeave = () => {
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
    stats: [{ n: '24', l: 'занятия' }, { n: '5 500', l: '₽/мес' }], chip: 'Старт 4 мая', chipCls: 'ch-amber',
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

const PAINS = [
  {
    ico: '😵',
    ttl: 'Слышали об ИИ, но не знаете с чего начать',
    dsc: 'Статьи, курсы онлайн, YouTube — всё разное и противоречивое. Непонятно, что реально работает, а что маркетинг.',
    solved: false,
  },
  {
    ico: '⏰',
    ttl: 'Тратите часы на рутину, которую ИИ сделает за минуты',
    dsc: 'Написать текст, подготовить отчёт, ответить на письмо — всё это ИИ умеет. Но без практики это так и останется теорией.',
    solved: false,
  },
  {
    ico: '📱',
    ttl: 'Дети сидят в соцсетях, а не развиваются',
    dsc: 'Хочется направить интерес ребёнка к технологиям в нужное русло — пока навык ещё воспринимается легко.',
    solved: false,
  },
  {
    ico: '◆',
    ttl: 'Нейро 32: результат с первого занятия',
    dsc: 'Только реальные инструменты и живая практика. Уйдёте с готовым рабочим результатом — не слайдами.',
    solved: true,
  },
  {
    ico: '◆',
    ttl: 'Экономия 3–5 часов рабочего времени уже через месяц',
    dsc: 'Разбираем ваши реальные задачи прямо на занятии. ChatGPT, Make.com, Notion AI — всё настраивается под вас.',
    solved: true,
  },
  {
    ico: '◆',
    ttl: 'Дети создают, а не потребляют',
    dsc: 'Мультфильмы, игры, музыка — ребёнок создаёт продукт руками. Безопасно, весело, с реальным портфолио проектов.',
    solved: true,
  },
];

const START_DATE = new Date(2026, 4, 4, 17, 0, 0); // 4 мая 2026 17:00

function HeroCountdown() {
  const [diff, setDiff] = useState(() => Math.max(0, START_DATE.getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, START_DATE.getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);
  if (diff === 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.2)',
      borderRadius: 12, padding: '10px 18px', marginBottom: 24,
    }}>
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="rgba(240,165,0,.7)" strokeWidth="1.2"/>
        <line x1="6" y1="3" x2="6" y2="6.5" stroke="rgba(240,165,0,.7)" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="6" y1="6.5" x2="8.2" y2="8" stroke="rgba(240,165,0,.7)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t3)', letterSpacing: '.06em' }}>Старт через</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {[{ v: pad(days), l: 'дн' }, { v: pad(hours), l: 'ч' }, { v: pad(mins), l: 'мин' }].map((u, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: i < 2 ? 6 : 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>{u.v}</div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', color: 'var(--t4)', letterSpacing: '.08em' }}>{u.l}</div>
            </div>
            {i < 2 && <span style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', color: 'rgba(240,165,0,.4)', lineHeight: 1, marginBottom: 6 }}>:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}


const WHY32 = [
  { ico: '🏙️', title: 'Офлайн в Новозыбкове', sub: 'Живые практики', desc: 'Реальный класс, живое общение — не видеоуроки на диване. Здесь задают вопросы и сразу получают ответы.' },
  { ico: '👥', title: 'Группы до 4 человек', sub: 'Внимание каждому', desc: 'Степан работает с каждым лично. Маленькая группа — значит темп под вас, а не под среднего студента.' },
  { ico: '⚡', title: '80% практика', sub: 'С первого занятия', desc: 'Никакой воды — сразу запускаем инструменты. На каждом занятии создаёте что-то реальное.' },
  { ico: '📁', title: 'Реальное портфолио', sub: 'Проекты, не теория', desc: 'Уходите с проектами в руках: боты, автоматизации, истории, треки. Это можно показать, запустить, использовать.' },
];

function WhySection({ onEnroll }: { onEnroll: () => void }) {
  return (
    <section style={{ padding: '80px 56px', background: 'rgba(0,0,0,.15)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="s-eyebrow rv" style={{ textAlign: 'center' }}>Наши принципы</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv" style={{ textAlign: 'center' }}>Почему <span className="accent">Нейро 32</span></h2>
        <div className="why32-grid rv">
          {WHY32.map((c, i) => (
            <div key={i} className="why32-card rv-s" style={{ transitionDelay: `${i * 0.09}s` }}>
              <div className="why32-ico">{c.ico}</div>
              <div className="why32-sub">{c.sub}</div>
              <div className="why32-title">{c.title}</div>
              <div className="why32-desc">{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-amber btn-lg" onClick={onEnroll}>Попробовать за 500 ₽ →</button>
        </div>
      </div>
    </section>
  );
}

const HOW_STEPS = [
  { num: '01', title: 'Приходишь', desc: 'Команда 3–4 человека. Ни у кого нет опыта — это нормально. Всё объясняем с нуля.', tag: 'Офлайн · Новозыбков' },
  { num: '02', title: 'Делаешь', desc: '80% времени — практика на реальных ИИ-инструментах прямо на занятии.', tag: '60–90 мин · 2 раза/нед' },
  { num: '03', title: 'Уходишь с результатом', desc: 'Готовый проект: текст, изображение, бот, автоматизация — то, что реально работает.', tag: 'Готовый проект' },
];

function HowItWorks() {
  return (
    <section className="howto-sec">
      <div className="howto-inner">
        <div className="s-eyebrow rv" style={{ textAlign: 'center' }}>Формат</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv" style={{ textAlign: 'center', marginBottom: 48 }}>Как проходит <span className="accent">занятие</span></h2>
        <div className="howto-wrap">
          {HOW_STEPS.map((s, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className="howto-step rv-s" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="howto-node">{s.num}</div>
                <div className="howto-title">{s.title}</div>
                <div className="howto-desc">{s.desc}</div>
                <div className="howto-tag">{s.tag}</div>
              </div>
              {i < HOW_STEPS.length - 1 && <div className="howto-conn" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BIZ_TASKS = [
  { ico: '✍️', label: 'Маркетинговые тексты', desc: 'Продающие посты, описания товаров, письма клиентам' },
  { ico: '🎨', label: 'Визуальный контент', desc: 'Иллюстрации, баннеры, презентации с помощью ИИ-инструментов' },
  { ico: '⚙️', label: 'Прототипы автоматизаций', desc: 'Простые сценарии на Make.com: уведомления, сбор данных, интеграции' },
  { ico: '📊', label: 'Несложная аналитика', desc: 'Обработка таблиц, сводки, визуализация через ИИ-инструменты' },
];

const BIZ_LIMITS = [
  'Не беремся за критически важные системы',
  'Не работаем с чувствительными персональными данными',
  'Не даём гарантий качества как профессиональная команда',
];

const FORMAT_OPTIONS = [
  { value: 'only_neuro32', label: 'Только Нейро 32 (Степан)' },
  { value: 'educational_case', label: 'Учебный кейс с участием учеников' },
  { value: 'any', label: 'Не важно — обсудим' },
];

interface BizForm {
  nameOrCompany: string;
  contact: string;
  taskDescription: string;
  format: string;
  consentPersonalData: boolean;
  consentEducationalCase: boolean;
}

function BusinessSection() {
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
      const res = await fetch('/api/business-inquiry', {
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
        setStatus('success');
        setForm({ nameOrCompany: '', contact: '', taskDescription: '', format: 'any', consentPersonalData: false, consentEducationalCase: false });
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
      <div className="s-eyebrow rv" style={{ color: '#4a7cff' }}>Для бизнеса и организаций</div>
      <div className="prem-div" />
      <h2 className="s-h2 rv">Нейро 32 <span className="accent">для бизнеса</span></h2>
      <p className="rv" style={{ fontSize: '1rem', color: 'var(--t2)', maxWidth: 700, margin: '0 auto 36px', lineHeight: 1.8, textAlign: 'center' }}>
        Компании и ИП могут обратиться в Нейро 32 с задачами по ИИ: маркетинг, автоматизация, визуал. Часть задач выполняется учениками под руководством наставника — это честный учебный кейс с реальным результатом.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 36 }}>
        {/* What we do */}
        <div style={{ background: 'rgba(74,124,255,.04)', border: '1px solid rgba(74,124,255,.15)', borderRadius: 20, padding: '28px 28px 24px' }}>
          <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: '#4a7cff', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Что можем сделать</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {BIZ_TASKS.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 1 }}>{t.ico}</span>
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
                  <span style={{ color: '#f87171', fontSize: '.8rem', flexShrink: 0, marginTop: 2 }}>✕</span>
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

      {/* Form */}
      <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid var(--line)', borderRadius: 24, padding: '36px 40px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--fu)', fontSize: '.78rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 6 }}>Отправить бизнес-заявку</div>
        <p style={{ fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--t3)', marginBottom: 28, lineHeight: 1.6 }}>
          Опишите задачу — Степан свяжется в течение 24 часов в рабочие дни.
        </p>

        {status === 'success' ? (
          <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.9rem', color: '#fff', marginBottom: 10, letterSpacing: '.03em' }}>Заявка отправлена!</div>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: 'var(--t2)', marginBottom: 20, lineHeight: 1.6 }}>
              Степан рассмотрит вашу задачу и свяжется в течение 24 часов в рабочее время (Пн–Пт 10:00–20:00).
            </p>
            <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm">
              Написать в Telegram напрямую →
            </a>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: 10 }}
              onClick={() => setStatus('idle')}
            >
              Отправить ещё
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-field">
                <label className="form-label">Имя / компания *</label>
                <input
                  className="form-inp"
                  value={form.nameOrCompany}
                  onChange={e => setForm(f => ({ ...f, nameOrCompany: e.target.value }))}
                  placeholder="ООО «Название» или Иван Иванов"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Телефон или Telegram *</label>
                <input
                  className="form-inp"
                  value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                  placeholder="+7 900 000-00-00 или @username"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Краткое описание задачи *</label>
              <textarea
                className="form-ta"
                value={form.taskDescription}
                onChange={e => setForm(f => ({ ...f, taskDescription: e.target.value }))}
                placeholder="Опишите, что нужно сделать: написать тексты для соцсетей, создать баннеры, настроить автоматизацию..."
                required
                style={{ minHeight: 100 }}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Желаемый формат</label>
              <select
                className="form-sel"
                value={form.format}
                onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
              >
                {FORMAT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Consent 1: Personal data — required */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '14px 16px', background: form.consentPersonalData ? 'rgba(45,158,107,.06)' : 'rgba(255,255,255,.03)', border: `1.5px solid ${form.consentPersonalData ? 'rgba(45,158,107,.3)' : 'var(--line)'}`, borderRadius: 12, transition: 'all .2s' }}>
              <input
                type="checkbox"
                checked={form.consentPersonalData}
                onChange={e => { setForm(f => ({ ...f, consentPersonalData: e.target.checked })); setErrorMsg(''); }}
                style={{ width: 18, height: 18, accentColor: '#2d9e6b', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <div style={{ fontFamily: 'var(--fb)', fontSize: '.84rem', color: '#fff', fontWeight: 600, marginBottom: 3 }}>
                  Согласие на обработку персональных данных <span style={{ color: '#f87171' }}>*</span>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--t4)', lineHeight: 1.5 }}>
                  Я даю согласие на обработку переданных данных (имя, контакты, описание задачи) исключительно в целях рассмотрения заявки и связи по её содержанию. Данные не передаются третьим лицам.
                </div>
              </div>
            </label>

            {/* Consent 2: Educational case — optional */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '14px 16px', background: form.consentEducationalCase ? 'rgba(240,165,0,.06)' : 'rgba(255,255,255,.02)', border: `1.5px solid ${form.consentEducationalCase ? 'rgba(240,165,0,.3)' : 'var(--line)'}`, borderRadius: 12, transition: 'all .2s' }}>
              <input
                type="checkbox"
                checked={form.consentEducationalCase}
                onChange={e => setForm(f => ({ ...f, consentEducationalCase: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: '#f0a500', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <div style={{ fontFamily: 'var(--fb)', fontSize: '.84rem', color: '#fff', fontWeight: 600, marginBottom: 3 }}>
                  Согласие на использование задачи как учебного кейса <span style={{ color: 'var(--t4)', fontWeight: 400, fontSize: '.72rem' }}>(необязательно)</span>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--t4)', lineHeight: 1.5 }}>
                  Я разрешаю использовать обезличенное описание задачи (без названия организации и контактных данных) в качестве учебного примера в занятиях Нейро 32.
                </div>
              </div>
            </label>

            {errorMsg && (
              <div style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--fm)', fontSize: '.78rem', color: '#f87171' }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-amber btn-lg"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Отправка...' : 'Отправить заявку →'}
            </button>
          </form>
        )}
      </div>
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
      { q: 'Когда ближайший старт?', a: 'Ближайший набор — 4 мая 2026. Осталось 3 свободных места. Запишитесь сейчас — подтверждение и детали придут в течение часа.' },
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
              padding: '7px 18px',
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
            <div className="faq-a">
              <div className="faq-a-inner">{item.a}</div>
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
    <div ref={ref} className="hero-stats" style={{ marginBottom: 28 }}>
      <div className="hstat"><div className="hstat-n">{dirs}</div><div className="hstat-l">направления</div></div>
      <div className="hstat"><div className="hstat-n">{tools}+</div><div className="hstat-l">инструментов</div></div>
      <div className="hstat"><div className="hstat-n">{pct}%</div><div className="hstat-l">офлайн</div></div>
      <div className="hstat"><div className="hstat-n">7–70</div><div className="hstat-l">лет</div></div>
    </div>
  );
}

export default function Home({ onAIToggle, onEnroll }: { onAIToggle: () => void; onEnroll: (p?: string) => void }) {
  usePageMeta('Нейро 32 — Офлайн-практика ИИ в Новозыбкове', 'Офлайн-лаборатория ИИ в Новозыбкове. 4 направления: дети 7–12, подростки 13–17, взрослые 18+, кибербезопасность. Пробное занятие 500 ₽. Результат с первого урока.');
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();
  const reviews = store.getReviews().slice(0, 3);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollDir = (d: number) => {
    const wrap = trackRef.current?.parentElement;
    if (wrap) wrap.scrollBy({ left: d * 360, behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-mesh" />
        <ParticlesBackground count={isMobile ? 30 : 80} maxDist={130} mouseRadius={170} />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-l">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8, padding: '6px 14px', fontFamily: 'var(--fm)', fontSize: '.64rem', color: '#10b981', letterSpacing: '.1em', marginBottom: 10 }}>
              <div className="badge-dot" />
              Набор открыт · 3 места · Старт 4 мая 2026
            </div>
            <HeroCountdown />
            <h1>
              НЕЙРО-ПРАКТИКИ<br />
              <span className="gradient-text" style={{ display: 'block', filter: 'drop-shadow(0 0 22px rgba(240,165,0,.4))' }}>ИИ</span>
            </h1>
            <p className="hero-sub">
              Изучите <Typewriter /> на офлайн-занятиях в Новозыбкове. Результат с первого занятия.
            </p>

            {/* Mobile-only expert photo strip */}
            <div className="ec-mobile-strip">
              <img
                src="/denis.jpg"
                alt="Степан Денис — основатель Нейро 32"
                className="ec-mobile-photo"
                width="48"
                height="48"
              />
              <div>
                <div className="ec-mobile-name">Степан Денис</div>
                <div className="ec-mobile-sub">Основатель Нейро 32 · 3+ года практики с ИИ</div>
              </div>
            </div>

            <HeroStats />

            <div className="hero-btns">
              <button className="btn btn-amber btn-lg" onClick={() => onEnroll()}>Записаться на занятие →</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/packages')}>Выбрать программу</button>
            </div>
          </div>
          <div className="hero-r">
            <div className="expert-card">
              <div className="ec-photo-wrap">
                <img src="/denis.jpg" alt="Степан Денис — основатель Нейро 32" className="ec-photo" width="340" height="420" />
                <div className="ec-photo-overlay">
                  <div className="ec-name">Степан Денис</div>
                  <div className="ec-role">Основатель · Нейро 32 · Новозыбков</div>
                </div>
              </div>
              <div className="ec-caption-strip">
                <span className="ec-caption-name">Степан Денис</span>
                <span className="ec-caption-sep">·</span>
                <span className="ec-caption-role">Основатель Нейро 32 · 3+ года практики с ИИ</span>
              </div>
              <div className="ec-body">
                <div className="ec-tagline">«Каждое занятие — конкретный результат, а не теория»</div>
                <div className="ec-facts">
                  <div className="ec-fact"><span className="ec-fact-dot" />3+ года практики с ИИ-инструментами (с 2022)</div>
                  <div className="ec-fact"><span className="ec-fact-dot" />Офлайн-лаборатория · Новозыбков, ул. Коммунистическая 22А</div>
                  <div className="ec-fact"><span className="ec-fact-dot" />4 направления · дети, подростки, взрослые, кибербез</div>
                </div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  <span className="chip ch-amber">Практик с 2022</span>
                  <span className="chip ch-green">Офлайн</span>
                  <span className="chip ch-dim">Самозанятый с 2026 года</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* WHY НЕЙРО 32 */}
      <WhySection onEnroll={onEnroll} />

      {/* PAIN POINTS */}
      <section className="S S-mid">
        <div className="s-eyebrow rv">Узнаёте себя?</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">Проблемы, которые мы <span className="accent">решаем</span></h2>
        <div className="pain-grid">
          {PAINS.map((p, i) => (
            <div key={i} className={`pain-card rv-s${p.solved ? ' solved' : ''}`} style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
              <div className="pain-ico" style={{ color: p.solved ? 'var(--emerald)' : undefined }}>{p.ico}</div>
              <div className="pain-ttl">{p.ttl}</div>
              <div className="pain-dsc">{p.dsc}</div>
              {p.solved && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--emerald)' }}>
                  <span>✓</span> Нейро 32 решает это
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-amber btn-lg" onClick={() => onEnroll()}>Попробовать за 500 ₽ →</button>
        </div>
      </section>

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

      {/* HOW IT WORKS */}
      <HowItWorks />

      <WaveDivider fromColor="#0a0a12" toColor="#faf8f3" />

      {/* WHY OFFLINE */}
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

      {/* TOOLS */}
      <section className="S S-mid">
        <div className="s-eyebrow rv">Онлайн-инструменты</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">Инструменты, которые <span className="accent">изучаем</span></h2>
        <p className="rv" style={{ fontSize: '.9rem', color: 'var(--t3)', maxWidth: 680, marginBottom: 32, lineHeight: 1.65 }}>
          На занятиях начинаем с российских сервисов — они стабильно доступны без ограничений. Международные инструменты используем там, где нет российского аналога; доступность некоторых из них может зависеть от ограничений в интернете.
        </p>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--fm)' }}>Базовые российские</h3>
            <span style={{
              fontSize: '.65rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 8px',
              borderRadius: 6, whiteSpace: 'nowrap',
              background: 'rgba(16,185,129,.1)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)',
            }}>🇷🇺 Стабильно доступен</span>
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
                  <span style={{
                    fontSize: '.52rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 7px',
                    borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0,
                    background: 'rgba(16,185,129,.1)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)',
                  }}>🇷🇺 Стабильно доступен</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--fm)' }}>Международные</h3>
            <span style={{
              fontSize: '.65rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 8px',
              borderRadius: 6, whiteSpace: 'nowrap',
              background: 'rgba(240,165,0,.1)', color: 'var(--amber)', border: '1px solid rgba(240,165,0,.2)',
            }}>⚠️ Доступность зависит от ограничений в интернете</span>
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
                  <span style={{
                    fontSize: '.52rem', fontFamily: 'var(--fm)', letterSpacing: '.05em', padding: '2px 7px',
                    borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0,
                    background: 'rgba(240,165,0,.1)', color: 'var(--amber)', border: '1px solid rgba(240,165,0,.2)',
                  }}>⚠️ Ограниченный доступ</span>
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
          <span style={{ fontSize: '1.1rem' }}>🔐</span>
          <span><strong style={{ color: 'var(--t2)' }}>Кибербезопасность</strong> — Kali Linux и DVWA — изучаем на отдельном курсе <a href="/cyber" style={{ color: 'var(--amber)', textDecoration: 'none' }}>«Цифровая защита»</a>.</span>
        </div>
      </section>

      {/* EXPERT */}
      <section className="S S-mid">
        <div className="s-eyebrow rv" style={{ color: 'var(--amber)' }}>Кто ведёт занятия</div>
        <div className="prem-div" />
        <div style={{
          background: 'rgba(255,255,255,.02)', border: '1px solid var(--line)',
          borderRadius: 24, padding: '36px 48px',
          backdropFilter: 'blur(12px)',
          borderLeft: '3px solid rgba(240,165,0,.4)',
        }}>
          <div style={{ fontFamily: 'var(--fu)', fontSize: '.64rem', color: 'var(--amber)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 16 }}>Степан Денис · Основатель Нейро 32 · Практик с 2022 года</div>
          <p style={{ fontSize: '1rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 12 }}>
            Я практик — не академический преподаватель. С 2022 года использую ИИ-инструменты для решения реальных задач: тексты, автоматизация, контент. Коллеги начали просить «покажи как» — и я открыл Нейро 32.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 24 }}>
            Принцип простой: каждое занятие — конкретный результат. Приносите реальные задачи — решим вместе прямо на занятии.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/about" className="btn btn-amber btn-sm" style={{ textDecoration: 'none' }}>Подробнее об эксперте →</a>
            <button className="btn btn-ghost btn-sm" onClick={() => onEnroll()}>Записаться</button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="S">
        <div className="s-eyebrow rv">Отзывы участников</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">Говорят те, кто <span className="accent">прошёл практики</span></h2>
        {reviews.length > 0 ? (
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
        ) : (
          <div style={{ marginBottom: 28 }}>
            <div style={{
              padding: '40px 32px', background: 'rgba(255,255,255,.02)', border: '1px solid var(--line)',
              borderRadius: 20, textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>📬</div>
              <div style={{ fontFamily: 'var(--fu)', fontSize: '.76rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 10 }}>
                Отзывы появятся после первых занятий
              </div>
              <div style={{ fontSize: '.92rem', color: 'var(--t3)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                Первая группа стартует <strong style={{ color: 'var(--amber)' }}>4 мая 2026</strong>. После занятий участники смогут оставить честный отзыв через Личный кабинет.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,.04)', border: '1px solid var(--line)', borderRadius: 100, padding: '8px 18px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t2)' }}>Набор открыт</span>
                </div>
                <a href="/packages" style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  background: 'rgba(240,165,0,.08)', border: '1px solid rgba(240,165,0,.2)',
                  borderRadius: 100, padding: '8px 18px', textDecoration: 'none',
                  fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--amber)',
                }}>
                  Пробный урок — 500 ₽ →
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

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

      {/* BUSINESS SECTION */}
      <BusinessSection />

      {/* CTA v2 — animated gradient */}
      <div className="cta-sec-v2">
        <div className="cta-box-v2 rv-s">
          <div className="cta-v2-txt" style={{ position: 'relative', zIndex: 1 }}>
            <h3>Готовы начать?</h3>
            <p>Запишитесь — Степан подберёт программу под ваши задачи и уровень</p>
            <div className="cta-v2-timer">Старт ближайшей группы — 4 мая 2026 · Осталось 3 места</div>
          </div>
          <div className="cta-v2-btns" style={{ position: 'relative', zIndex: 1 }}>
            <button className="btn-cta-enroll" onClick={() => onEnroll()}>Записаться на занятие →</button>
            <button className="btn-cta-dark" onClick={onAIToggle}>Спросить у Нейры</button>
          </div>
        </div>
      </div>

    </div>
  );
}
