import { useState } from 'react';
import { store } from '../lib/store';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Reviews() {
  usePageMeta('Отзывы', 'Отзывы участников офлайн-курсов ИИ в Новозыбкове. Реальные результаты учеников Нейро 32.');
  const [reviews, setReviews] = useState(store.getReviews());
  const [form, setForm] = useState({ name: '', role: '', direction: 'Дети', rating: 5, text: '' });
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const dirs = ['Дети', 'Подростки', 'Взрослые', 'Кибербезопасность', 'Другое'];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return;
    const newR = store.addReview(form);
    setReviews([newR, ...reviews]);
    setSaved(true);
    setForm({ name: '', role: '', direction: 'Дети', rating: 5, text: '' });
    setShowForm(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="pg-hero">
        <div className="pg-badge">⭐ Отзывы</div>
        <h1>ОТЗЫВЫ <span className="accent">УЧАСТНИКОВ</span></h1>
        <p>Реальные отзывы от учеников и родителей. Первая группа стартует 4 мая — отзывы появятся после занятий.</p>
        <div className="prog-meta">
          <span className="chip ch-amber">{reviews.length > 0 ? `${reviews.length} отзывов` : 'Старт 4 мая'}</span>
          {reviews.length > 0 && <span className="chip ch-green">Принимаем отзывы</span>}
          {reviews.length === 0 && <span className="chip ch-dim">Отзывы появятся после занятий</span>}
        </div>
      </div>

      <section className="S">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="s-h2" style={{ margin: 0 }}>Говорят те, кто <span className="accent">прошёл практики</span></h2>
          <button className="btn btn-amber" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Закрыть' : '+ Оставить отзыв'}
          </button>
        </div>

        {saved && (
          <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, color: 'var(--emerald)', fontFamily: 'var(--fm)', fontSize: '.84rem' }}>
            ✓ Спасибо за отзыв! Он опубликован.
          </div>
        )}

        {showForm && (
          <div className="contact-form-card" style={{ marginBottom: 40 }}>
            <h3 style={{ fontFamily: 'var(--fu)', fontSize: '1rem', letterSpacing: '.04em', color: '#fff', marginBottom: 20 }}>Оставить отзыв</h3>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Ваше имя *</label>
                  <input className="form-inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Анна Петрова" required />
                </div>
                <div className="form-field">
                  <label className="form-label">Кто вы</label>
                  <input className="form-inp" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Мама ученика / Студент" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Направление</label>
                  <select className="form-sel" value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}>
                    {dirs.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Оценка</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 8 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))} style={{ fontSize: '1.6rem', background: 'none', border: 'none', cursor: 'pointer', color: s <= form.rating ? 'var(--amber)' : 'var(--t4)', transition: 'transform .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = '')}>★</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Ваш отзыв *</label>
                <textarea className="form-ta" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Расскажите о своём опыте..." required style={{ minHeight: 120 }} />
              </div>
              <button type="submit" className="btn btn-amber btn-lg" style={{ alignSelf: 'flex-start' }}>Опубликовать отзыв →</button>
            </form>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="rv-grid">
            {reviews.map((rv, i) => (
              <div key={rv.id} className="rv-card rv-s" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <div className="rv-stars">{'★'.repeat(rv.rating)}{'☆'.repeat(5 - rv.rating)}</div>
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
          <div style={{ padding: '56px 32px', textAlign: 'center', background: 'rgba(255,255,255,.02)', border: '1px solid var(--line)', borderRadius: 20 }}>
            <div style={{ fontSize: '3rem', marginBottom: 20 }}>📬</div>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.8rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 12 }}>
              Пока отзывов нет
            </div>
            <div style={{ fontSize: '.92rem', color: 'var(--t3)', maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
              Первая группа стартует <strong style={{ color: 'var(--amber)' }}>4 мая 2026</strong>. После первых занятий ученики и родители смогут оставить честный отзыв через эту форму.
            </div>
            <div style={{ marginTop: 28, fontSize: '.84rem', color: 'var(--t4)' }}>
              Хотите быть в числе первых? <button className="btn btn-amber btn-sm" style={{ marginLeft: 12 }} onClick={() => setShowForm(true)}>Запишитесь сейчас →</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
