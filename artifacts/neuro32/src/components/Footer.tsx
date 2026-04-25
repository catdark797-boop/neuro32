import { useLocation } from 'wouter';
import { analytics } from '../lib/analytics';

const SocTelegram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const SocVK = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.712-.576.712z"/>
  </svg>
);

const SocEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SOCIALS = [
  { href: 'https://t.me/DSM1322', label: 'Telegram', icon: <SocTelegram /> },
  { href: 'https://vk.ru/id1071554033', label: 'ВКонтакте', icon: <SocVK /> },
  { href: 'mailto:d3stemar@yandex.ru', label: 'Email', icon: <SocEmail /> },
];

export default function Footer({ onEnroll }: { onEnroll?: (p?: string) => void }) {
  const [, navigate] = useLocation();

  const scrollTop = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      <footer>
        <div>
          <div className="f-brand">НЕЙРО <span className="f32">32</span></div>
          <p className="f-desc">Практические офлайн-занятия по ИИ в Новозыбкове. 4 направления для всех возрастов.</p>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="https://maps.google.com/?q=Новозыбков,+Коммунистическая+22А" target="_blank" rel="noopener noreferrer" className="f-addr">
              г. Новозыбков, ул. Коммунистическая, 22А
            </a>
            <a href="tel:+79019769810" className="f-addr">+7 (901) 976-98-10</a>
          </div>
          {/* Social icons row */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.label}
                onClick={() => { if (s.label === 'Telegram') analytics.telegramClick('footer-social'); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.08)',
                  color: 'var(--t3)',
                  transition: 'background .2s, color .2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(240,165,0,.12)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.05)'; (e.currentTarget as HTMLElement).style.color = 'var(--t3)'; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="f-col-h">Программы</div>
          <ul className="f-links">
            <li><a onClick={() => scrollTop('/kids')} style={{ cursor: 'pointer' }}>ИИ для детей 7–12</a></li>
            <li><a onClick={() => scrollTop('/teens')} style={{ cursor: 'pointer' }}>ИИ для подростков</a></li>
            <li><a onClick={() => scrollTop('/adults')} style={{ cursor: 'pointer' }}>ИИ для взрослых</a></li>
            <li><a onClick={() => scrollTop('/cyber')} style={{ cursor: 'pointer' }}>Цифровая защита</a></li>
            <li><a onClick={() => scrollTop('/packages')} style={{ cursor: 'pointer' }}>Пакеты и цены</a></li>
          </ul>
        </div>
        <div>
          <div className="f-col-h">Сервисы</div>
          <ul className="f-links">
            <li><a onClick={() => scrollTop('/aisecretary')} style={{ cursor: 'pointer' }}>ИИ-ассистент Нейра</a></li>
            <li><a onClick={() => scrollTop('/reviews')} style={{ cursor: 'pointer' }}>Отзывы</a></li>
            <li><a onClick={() => scrollTop('/safety')} style={{ cursor: 'pointer' }}>Цифровая безопасность</a></li>
            <li><a onClick={() => scrollTop('/about')} style={{ cursor: 'pointer' }}>Об эксперте</a></li>
            <li><a onClick={() => scrollTop('/contact')} style={{ cursor: 'pointer' }}>Контакты</a></li>
          </ul>
        </div>
        <div>
          <div className="f-col-h">Связь</div>
          <ul className="f-links" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SOCIALS.map(s => (
              <li key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--t4)', flexShrink: 0 }}>{s.icon}</span>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
            <li><a href="tel:+79019769810" style={{ color: 'var(--amber)' }}>+7 (901) 976-98-10</a></li>
          </ul>
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-amber btn-sm" onClick={() => onEnroll?.()} style={{ width: '100%', justifyContent: 'center' }}>Записаться →</button>
          </div>
        </div>
      </footer>
      <div className="fbot" style={{ flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, width: '100%', alignItems: 'center' }}>
          <span>© 2026 Нейро 32</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="/privacy" style={{ color: 'var(--t4)' }} onClick={e => { e.preventDefault(); scrollTop('/privacy'); }}>Политика конфиденциальности</a>
            <a href="/offer" style={{ color: 'var(--t4)' }} onClick={e => { e.preventDefault(); scrollTop('/offer'); }}>Договор-оферта</a>
          </div>
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--t4)', lineHeight: 1.5, opacity: 0.7 }}>
          Степан Марьянович Денис · НПД · ИНН 326504606285 · Услуги оказываются в рамках индивидуальной педагогической деятельности · Не является образовательной организацией
        </div>
      </div>
    </>
  );
}
