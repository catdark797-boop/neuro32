import { usePageMeta } from '../hooks/usePageMeta';
import { Info } from 'lucide-react';

const PKGS = [
  {
    ico: '◆', name: 'Дети 7–12 лет', tagline: 'Творчество, игра, первые проекты. Базовый и продвинутый треки.',
    price: '5 500', per: '/ мес', perSes: '≈ 688 ₽ / занятие при 2 занятиях в неделю', note: '24 занятия · 3 месяца · Базовый трек',
    program: 'Дети 7–12',
    features: ['2 занятия в неделю по 60–90 мин', 'Шедеврум, ГигаЧат, Алиса, Suno AI', 'Проектная работа каждые 6 занятий', 'Отчёты родителям после каждого блока', 'Сертификат участника Нейро 32'],
    btnLabel: 'Записать ребёнка →', featured: false,
  },
  {
    ico: '◆', name: 'Подростки 13–17', tagline: 'Промпт-инжиниринг, боты, автоматизация. Портфолио.',
    price: '7 000', per: '/ мес', perSes: '≈ 875 ₽ / занятие при 2 занятиях в неделю', note: '36 занятий · 4–5 месяцев',
    program: 'Подростки 13–17',
    badge: 'Популярный',
    features: ['2–3 занятия в неделю', 'Python API, Telegram-боты, Make.com', '5+ проектов в портфолио', 'Командная работа, питч-сессии', 'Рекомендательное письмо'],
    btnLabel: 'Записаться →', featured: true,
  },
  {
    ico: '◆', name: 'Взрослые 18+', tagline: 'Рабочие автоматизации. Реальные задачи каждое занятие.',
    price: '8 500', per: '/ мес', perSes: '≈ 1 062 ₽ / занятие при 2 занятиях в неделю', note: '32 занятия · 4 месяца',
    program: 'Взрослые 18+',
    features: ['2 занятия в неделю', 'ChatGPT, Make.com, Notion AI, Gamma.app', 'Ваши реальные задачи как основа', 'ИИ-агент для вашего бизнеса', 'Сертификат участника + рекомендательное письмо'],
    btnLabel: 'Записаться →', featured: false,
  },
  {
    ico: '◆', name: 'Цифровая защита', tagline: 'Защита, пентест, CTF. Для всех с техническим интересом.',
    price: '11 000', per: '/ мес', perSes: '≈ 1 375 ₽ / занятие при 2 занятиях в неделю', note: '24 занятия · 3 месяца',
    program: 'Кибербезопасность',
    features: ['2 занятия в неделю', 'Kali Linux, Wireshark, VPN, CTF', 'Полигон для безопасных экспериментов', 'CTF-финал с рейтингом', 'Сертификат участника Нейро 32: Кибербезопасность'],
    btnLabel: 'Записаться →', featured: false,
  },
];

export default function Packages({ onEnroll }: { onEnroll?: (p?: string) => void }) {
  usePageMeta('Пакеты и цены', 'Цены и программы Нейро 32. 4 направления: дети 5 500 ₽, подростки 7 000 ₽, взрослые 8 500 ₽, кибербезопасность 11 000 ₽. Пробное — 500 ₽.', '/packages');
  return (
    <div>
      <div className="pg-hero">
        <div className="pg-badge">Пакеты и цены</div>
        <h1>ЦЕНЫ И <span className="accent">ПАКЕТЫ</span></h1>
        <p>Прозрачные цены. Оплата СБП или наличными. Пробное занятие — специальная цена.</p>
        <div className="prog-meta">
          <span className="chip ch-green">Чек НПД</span>
          <span className="chip ch-blue">СБП оплата</span>
          <span className="chip ch-dim">Рассрочка возможна</span>
        </div>
      </div>

      {/* PROMO TRIAL */}
      <section className="S" style={{ paddingTop: 0 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(240,165,0,.12), rgba(240,165,0,.04))',
          border: '2px solid rgba(240,165,0,.3)',
          borderRadius: 24, padding: '36px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
          marginBottom: 64,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 8 }}>Специальное предложение</div>
            <div style={{ fontFamily: 'var(--fu)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
              Пробное занятие за <span style={{ color: 'var(--amber)' }}>500 ₽</span>
            </div>
            <p style={{ fontSize: '.95rem', color: 'var(--t2)', lineHeight: 1.7, maxWidth: 520 }}>
              Приходите на одно занятие 60–90 минут — разберём ваш запрос, покажем инструменты в деле. Понравится — стоимость засчитывается в абонемент.
            </p>
          </div>
          <button className="btn btn-amber btn-lg" style={{ flexShrink: 0 }} onClick={() => onEnroll?.()}>
            Записаться на пробное →
          </button>
        </div>

        <div className="s-eyebrow rv">Выберите программу</div>
        <div className="prem-div" />
        <h2 className="s-h2 rv">Найдём <span className="accent">идеальный формат</span></h2>
        <div className="pkg-grid">
          {PKGS.map((p, i) => (
            <div key={i} className={`pkg-card${p.featured ? ' featured' : ''}`}>
              {p.badge && <div className="pkg-badge">{p.badge}</div>}
              <div className="pkg-ico" style={{ fontFamily: 'var(--fu)', fontSize: '1.4rem', color: 'var(--amber)' }}>{p.ico}</div>
              <div className="pkg-name">{p.name}</div>
              <div className="pkg-tagline">{p.tagline}</div>
              <div className="pkg-price">
                <span className="pnum">{p.price} ₽</span>
                <span className="pper">{p.per}</span>
              </div>
              <div style={{ fontSize: '.72rem', color: 'var(--amber)', fontFamily: 'var(--fm)', opacity: .8, marginTop: 2 }}>{p.perSes}</div>
              <div className="pkg-price-note">{p.note}</div>
              <div style={{ height: 1, background: 'var(--line)', margin: '16px 0' }} />
              <ul className="pkg-features">
                {p.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button className="btn btn-amber" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onEnroll?.(p.program)}>
                {p.btnLabel}
              </button>
            </div>
          ))}
        </div>

        {/* DISCLAIMER */}
        <div style={{
          background: 'rgba(255,255,255,.03)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 32,
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}>
          <Info size={18} className="icon-muted" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>О формате и документах</div>
            <p style={{ fontSize: '.85rem', color: 'var(--t3)', lineHeight: 1.7, margin: 0 }}>
              Занятия проводятся в формате кружка/лаборатории практик. По итогу курса выдаётся <strong style={{ color: 'var(--t2)' }}>сертификат участника Нейро 32</strong> — документ нашей организации, подтверждающий прохождение программы. Свидетельства и дипломы государственного образца не выдаются: Нейро 32 не является лицензированным образовательным учреждением.
            </p>
            <p style={{ fontSize: '.85rem', color: 'var(--t3)', lineHeight: 1.7, margin: '8px 0 0' }}>
              <strong style={{ color: 'var(--t2)' }}>Оплата:</strong> чек самозанятого через «Мой налог» — подходит для физлиц. Для юридических лиц и ИП — по договорённости, с договором.
            </p>
          </div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, padding: 36, marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--fu)', fontSize: '.8rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>Дополнительные форматы</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '◆', nm: 'Семейный пакет', pr: '−15%', d: 'При записи двух и более членов семьи — скидка 15% на каждого.' },
              { icon: '◆', nm: 'Корпоративный', pr: 'По запросу', d: 'Обучение команды на вашей площадке или у нас. Договор с юрлицом.' },
            ].map((it, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--line)', borderRadius: 14, padding: 22, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '1rem', color: 'var(--amber)', marginBottom: 10 }}>{it.icon}</div>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.66rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#fff', marginBottom: 5 }}>{it.nm}</div>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '1.3rem', color: 'var(--amber)', marginBottom: 8 }}>{it.pr}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--t3)', lineHeight: 1.6 }}>{it.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg,rgba(240,165,0,.06),rgba(240,165,0,.02))', border: '1px solid rgba(240,165,0,.15)', borderRadius: 20, padding: 36 }}>
          <h3 style={{ fontFamily: 'var(--fu)', fontSize: '.76rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', marginBottom: 20 }}>Как оплатить</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>СБП — быстро</div>
              <p style={{ fontSize: '.9rem', color: 'var(--t2)', lineHeight: 1.7 }}>
                Перевод по СБП на номер <strong style={{ color: '#fff' }}>+7 (901) 976-98-10</strong>. Чек через «Мой налог» — автоматически.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Наличные</div>
              <p style={{ fontSize: '.9rem', color: 'var(--t2)', lineHeight: 1.7 }}>
                На первом занятии или в офисе. Адрес: <strong style={{ color: '#fff' }}>ул. Коммунистическая, 22А</strong>.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn btn-amber btn-lg" onClick={() => onEnroll?.()}>Записаться →</button>
        </div>
      </section>

    </div>
  );
}
