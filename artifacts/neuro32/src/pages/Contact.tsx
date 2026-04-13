import { useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';

const SocVK = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.712-.576.712z"/>
  </svg>
);

const SocYouTube = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Contact() {
  usePageMeta('Контакты', 'Нейро 32 — лаборатория ИИ-практик в Новозыбкове. Телефон: +7 (901) 976-98-10. Telegram: @DSM1322.');

  const [copied, setCopied] = useState<string | null>(null);
  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const contacts = [
    {
      key: 'phone',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.48 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C6.92 21 3 14.08 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.36.28 2.67.76 3.88a1 1 0 01-.21 1.11l-2.43 2.43-.0.37z" fill="currentColor"/>
        </svg>
      ),
      label: 'Телефон',
      value: '+7 (901) 976-98-10',
      href: 'tel:+79019769810',
      copyVal: '+79019769810',
    },
    {
      key: 'tg',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      label: 'Telegram',
      value: '@DSM1322',
      href: 'https://t.me/DSM1322',
      copyVal: '@DSM1322',
    },
    {
      key: 'email',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Email',
      value: 'd3stemar@yandex.ru',
      href: 'mailto:d3stemar@yandex.ru',
      copyVal: 'd3stemar@yandex.ru',
    },
    {
      key: 'vk',
      icon: <SocVK />,
      label: 'ВКонтакте',
      value: 'vk.com/DSM1322',
      href: 'https://vk.com/DSM1322',
      copyVal: 'https://vk.com/DSM1322',
    },
    {
      key: 'youtube',
      icon: <SocYouTube />,
      label: 'YouTube',
      value: 'youtube.com/@DSM1322',
      href: 'https://youtube.com/@DSM1322',
      copyVal: 'https://youtube.com/@DSM1322',
    },
    {
      key: 'addr',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      ),
      label: 'Адрес',
      value: 'г. Новозыбков, Брянская обл.\nул. Коммунистическая, 22А',
      href: null,
      copyVal: 'г. Новозыбков, ул. Коммунистическая 22А',
    },
    {
      key: 'hours',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Время работы',
      value: 'Пн–Пт: 10:00–20:00\nСб: 10:00–16:00\nВс: по договорённости',
      href: null,
      copyVal: null,
    },
  ];

  return (
    <div>
      <div className="pg-hero">
        <div className="pg-badge">📍 Контакты</div>
        <h1>НЕЙРО 32 <span className="accent">В НОВОЗЫБКОВЕ</span></h1>
        <p>Офлайн-лаборатория ИИ-практик. Пишите в Telegram — ответим быстрее всего.</p>
        <div className="prog-meta">
          <span className="chip ch-green">Ответ за 30 мин в рабочее время</span>
          <span className="chip ch-blue">Telegram @DSM1322</span>
          <span className="chip">ИНН 326504606285</span>
        </div>
      </div>

      <section className="S">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 40,
            alignItems: 'start',
          }} className="contact-grid-layout">

            {/* LEFT — contact cards */}
            <div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 24 }}>
                — Как связаться
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {contacts.map(c => (
                  <div key={c.key} style={{
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 14,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    transition: 'border-color .2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,.3)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(240,165,0,.08)',
                      border: '1px solid rgba(240,165,0,.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--amber)', flexShrink: 0,
                    }}>
                      {c.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: '.9rem', color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {c.href ? (
                          <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                            style={{ color: '#fff', textDecoration: 'none' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--amber)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                          >{c.value}</a>
                        ) : c.value}
                      </div>
                    </div>
                    {c.copyVal && (
                      <button
                        onClick={() => copyText(c.copyVal!, c.key)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: copied === c.key ? 'var(--amber)' : 'var(--t4)',
                          fontSize: '.75rem', padding: '4px 8px',
                          borderRadius: 6, transition: 'color .2s', flexShrink: 0,
                        }}
                        title="Скопировать"
                      >
                        {copied === c.key ? '✓' : '⎘'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer"
                  className="btn btn-amber btn-lg" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Написать в Telegram
                </a>
                <a href="tel:+79019769810" className="btn btn-outline btn-lg" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.48 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C6.92 21 3 14.08 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.36.28 2.67.76 3.88a1 1 0 01-.21 1.11l-2.43 2.43z" fill="currentColor"/>
                  </svg>
                  Позвонить: +7 (901) 976-98-10
                </a>
              </div>

              <div style={{
                padding: '16px 18px',
                background: 'rgba(240,165,0,.05)',
                border: '1px solid rgba(240,165,0,.12)',
                borderRadius: 12,
                fontSize: '.82rem',
                color: 'var(--t2)',
                lineHeight: 1.7,
              }}>
                💡 <strong style={{ color: 'var(--amber)' }}>Совет:</strong> Степан отвечает в Telegram быстрее всего — обычно в течение 30 минут в рабочее время.
              </div>
            </div>

            {/* RIGHT — Yandex Map */}
            <div style={{ position: 'sticky', top: 88 }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>
                — Мы на карте
              </div>
              <div style={{ fontSize: '.84rem', color: 'var(--t2)', marginBottom: 16 }}>
                г. Новозыбков, ул. Коммунистическая 22А · АНО «Простые вещи»
              </div>
              <div style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid var(--line)',
                boxShadow: '0 8px 32px rgba(0,0,0,.4)',
              }}>
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=31.9356%2C52.5375&z=16&pt=31.9356%2C52.5375%2Cpm2rdl&text=%D0%9D%D0%BE%D0%B2%D0%BE%D0%B7%D1%8B%D0%B1%D0%BA%D0%BE%D0%B2%2C%20%D0%9A%D0%BE%D0%BC%D0%BC%D1%83%D0%BD%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%2022%D0%90&theme=dark"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allowFullScreen
                  title="Нейро 32 на карте — Новозыбков, Коммунистическая 22А"
                  style={{ display: 'block' }}
                />
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                <a
                  href="https://yandex.ru/maps/-/CDf8mJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, textAlign: 'center', padding: '10px 16px',
                    background: 'var(--card)', border: '1px solid var(--line)',
                    borderRadius: 10, color: 'var(--t2)', textDecoration: 'none',
                    fontSize: '.8rem', fontFamily: 'var(--fm)', letterSpacing: '.04em',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,.3)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.color = 'var(--t2)'; }}
                >
                  Открыть в Яндекс.Картах →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width: 768px) {
          .contact-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
