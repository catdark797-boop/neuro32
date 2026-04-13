import { usePageMeta } from '../hooks/usePageMeta';

export default function About({ onEnroll }: { onEnroll?: (p?: string) => void }) {
  usePageMeta('Об эксперте — Степан Марьянович Денис', 'Степан Марьянович Денис — ИИ-практик, основатель Нейро 32. Практические занятия по ИИ в Новозыбкове для детей, подростков и взрослых.');
  return (
    <div>
      {/* FULL-HEIGHT HERO WITH PHOTO */}
      <section style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex', alignItems: 'center',
        padding: '80px 48px',
        maxWidth: 1280, margin: '0 auto',
        gap: 64,
      }} className="about-hero-section">
        {/* LEFT: Photo */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 320, height: 420, borderRadius: 24,
            overflow: 'hidden', border: '2px solid rgba(240,165,0,.2)',
            boxShadow: '0 24px 80px rgba(0,0,0,.5)',
            position: 'relative',
          }}>
            <img src="/denis.jpg" alt="Степан Денис — основатель Нейро 32, ИИ-практик" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} width="320" height="420" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,18,.6) 0%, transparent 50%)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
            {[
              { icon: '◆', l: 'Telegram', v: '@DSM1322', href: 'https://t.me/DSM1322' },
              { icon: '◆', l: 'ВКонтакте', v: 'vk.ru/id1071554033', href: 'https://vk.ru/id1071554033' },
              { icon: '◆', l: 'Телефон', v: '+7 (901) 976-98-10', href: 'tel:+79019769810' },
              { icon: '◆', l: 'Email', v: 'd3stemar@yandex.ru', href: 'mailto:d3stemar@yandex.ru' },
              { icon: '◆', l: 'Адрес', v: 'Новозыбков, Коммунистическая, 22А', href: 'https://maps.google.com/?q=Новозыбков,+Коммунистическая+22А' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--line)' }}>
                <span style={{ fontFamily: 'var(--fu)', fontSize: '.6rem', color: 'var(--amber)', marginTop: 2 }}>{c.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>{c.l}</div>
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ fontSize: '.84rem', color: 'var(--t1)', textDecoration: 'none' }}>{c.v}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Bio */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>Основатель Нейро 32</div>
          <h1 style={{ fontFamily: 'var(--fu)', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>
            СТЕПАН <span style={{ color: 'var(--amber)' }}>ДЕНИС</span>
          </h1>
          <div style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--t3)', marginBottom: 32 }}>ИИ-практик · с 2022 года · Новозыбков</div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            <span className="chip ch-amber">3+ года практики</span>
            <span className="chip ch-green">Практик с 2022 года</span>
            <span className="chip ch-dim">Самозанятый с 2026 года</span>
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 20 }}>
            Меня зовут Степан. Я практик — не академический преподаватель. С 2022 года я использую ИИ-инструменты в работе: сначала научился закрывать через них реальные задачи — писать тексты, автоматизировать рутину, генерировать контент. Потом коллеги начали просить «покажи как», и я понял, что хочу передавать этот навык дальше.
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 20 }}>
            Сейчас веду 4 направления в Новозыбкове для детей, подростков и взрослых. Принцип один: каждое занятие — конкретный результат. Не слайды и теория, а рабочий инструмент, который вы используете уже завтра.
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--t2)', lineHeight: 1.8, marginBottom: 36 }}>
            Приносите реальные задачи — решим вместе прямо на занятии.
          </p>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>Направления экспертизы</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Промпт-инжиниринг', 'Языковые модели', 'Make.com', 'Python + AI API', 'Кибербезопасность', 'ИИ для детей', 'ElevenLabs', 'Kling AI', 'Gamma.app', 'Telegram-боты'].map((s, i) => (
                <span key={i} className="chip ch-dim">{s}</span>
              ))}
            </div>
          </div>

          <div className="cert-grid" style={{ marginBottom: 36 }}>
            {[
              { t: 'Самозанятый (НПД)', s: 'Официально зарегистрирован с 2026 г.' },
              { t: 'Практик с 2022 года', s: 'Реальные задачи: тексты, автоматизация, контент' },
              { t: 'Офлайн в Новозыбкове', s: 'Лаборатория практик · Коммунистическая, 22А' },
            ].map((c, i) => (
              <div key={i} className="cert-card">
                <div className="cert-t">{c.t}</div>
                <div className="cert-s">{c.s}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-amber btn-lg" onClick={() => onEnroll?.()}>Записаться на занятие →</button>
            <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">Telegram @DSM1322</a>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px) {
          .about-hero-section { flex-direction: column !important; padding: 40px 24px !important; }
          .about-hero-section > div:first-child { width: 100% !important; }
          .about-hero-section > div:first-child > div:first-child { width: 100% !important; height: 300px !important; }
          .about-hero-section > div:first-child > div:last-child { width: 100% !important; }
        }
      `}</style>

      {/* INTERNAL LINKING: About → Contact → Packages */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 48px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <a href="/contact" style={{ flex: 1, minWidth: 220, padding: '20px 24px', background: 'rgba(255,255,255,.03)', border: '1px solid var(--line2)', borderRadius: 16, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, transition: 'border-color .2s', textDecoration: 'none' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,.3)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line2)')}>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Следующий шаг</div>
          <div style={{ fontFamily: 'var(--fu)', fontSize: '.8rem', fontWeight: 700, color: '#fff' }}>Связаться со Степаном →</div>
          <div style={{ fontSize: '.8rem', color: 'var(--t3)' }}>Telegram, телефон, адрес лаборатории</div>
        </a>
        <a href="/packages" style={{ flex: 1, minWidth: 220, padding: '20px 24px', background: 'rgba(240,165,0,.04)', border: '1px solid rgba(240,165,0,.15)', borderRadius: 16, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, transition: 'border-color .2s', textDecoration: 'none' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,.5)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,.15)')}>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--amber)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Выбрать программу</div>
          <div style={{ fontFamily: 'var(--fu)', fontSize: '.8rem', fontWeight: 700, color: '#fff' }}>Тарифы и пакеты →</div>
          <div style={{ fontSize: '.8rem', color: 'var(--t3)' }}>4 направления · от 5 500 ₽/мес</div>
        </a>
      </div>

    </div>
  );
}
