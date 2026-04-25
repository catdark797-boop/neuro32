import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useListReviews, createReview, getListReviewsQueryKey } from '@workspace/api-client-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Star } from 'lucide-react';

export default function Reviews() {
  usePageMeta('Отзывы', 'Отзывы участников офлайн-курсов ИИ в Новозыбкове. Реальные результаты учеников Нейро 32.');
  const qc = useQueryClient();
  const { data: reviews = [] } = useListReviews({ query: { staleTime: 60_000 } });
  const [form, setForm] = useState({ name: '', role: '', direction: 'Дети', rating: 5, text: '' });
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Review submission from anonymous public was removed — we don't want user-seeded
  // "reviews" before the first cohort even finishes (confusing + gameable). Form
  // re-appears only when ENABLE_PUBLIC_REVIEWS === 'true' in build env, once we
  // have real students.
  const showForm = import.meta.env.VITE_ENABLE_PUBLIC_REVIEWS === 'true';

  const dirs = ['Дети', 'Подростки', 'Взрослые', 'Кибербезопасность', 'Другое'];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return;
    setSubmitting(true);
    try {
      await createReview({ name: form.name, role: form.role, direction: form.direction, rating: form.rating, text: form.text });
      qc.invalidateQueries({ queryKey: getListReviewsQueryKey() });
      setSaved(true);
      setForm({ name: '', role: '', direction: 'Дети', rating: 5, text: '' });
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const approved = reviews.filter((r: { approved: boolean }) => r.approved);

  // Schema.org: emit Organization with aggregateRating + Review array ONLY
  // when we have real approved reviews. Fabricating a 0-review aggregate
  // would fail Google's Rich Results validator and harm SEO.
  const reviewsLd = approved.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Нейро 32",
    url: "https://xn--32-mlcqsin.xn--p1ai",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (
        approved.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / approved.length
      ).toFixed(1),
      reviewCount: approved.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: approved.slice(0, 20).map((r: { name: string; rating: number; text: string; createdAt?: string; direction?: string }) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: r.text,
      ...(r.createdAt ? { datePublished: r.createdAt.slice(0, 10) } : {}),
      ...(r.direction ? { itemReviewed: { "@type": "Course", name: `ИИ для ${r.direction.toLowerCase()}` } } : {}),
    })),
  } : null;

  return (
    <div>
      {reviewsLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsLd) }}
        />
      )}
      <div className="pg-hero">
        <div className="pg-badge"><Star size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Отзывы</div>
        <h1>ОТЗЫВЫ <span className="accent">УЧАСТНИКОВ</span></h1>
        <p>Здесь будут реальные отзывы от учеников и родителей — после того, как первая группа проведёт 4 недели занятий. Мы не пишем отзывы сами.</p>
        <div className="prog-meta">
          <span className="chip ch-amber">{approved.length > 0 ? `${approved.length} отзывов` : 'Первая когорта в работе'}</span>
          {approved.length > 0 && <span className="chip ch-green">Принимаем отзывы</span>}
          {approved.length === 0 && <span className="chip ch-dim">Отзывы появятся после занятий</span>}
        </div>
      </div>

      <section className="S">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="s-h2" style={{ margin: 0 }}>Говорят те, кто <span className="accent">прошёл практики</span></h2>
        </div>

        {saved && (
          <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, color: 'var(--emerald)', fontFamily: 'var(--fm)', fontSize: '.84rem' }}>
            ✓ Спасибо за отзыв! Он отправлен на проверку и скоро появится.
          </div>
        )}

        {showForm && (
          <div className="contact-form-card" style={{ marginBottom: 40 }}>
            <h3 style={{ fontFamily: 'var(--fu)', fontSize: '1rem', letterSpacing: '.04em', color: '#fff', marginBottom: 20 }}>Оставить отзыв</h3>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Ваше имя *</label>
                  <input className="form-inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Анна Петрова" autoComplete="name" required />
                </div>
                <div className="form-field">
                  <label className="form-label">Кто вы</label>
                  <input className="form-inp" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Мама ученика / Студент" autoComplete="off" />
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
                      <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}
                        style={{ fontSize: '1.6rem', background: 'none', border: 'none', cursor: 'pointer', color: s <= form.rating ? 'var(--amber)' : 'var(--t4)', transition: 'transform .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = '')}>★</button>
                    ))}
                    <span style={{ color: 'var(--amber)', fontFamily: 'var(--fu)', fontSize: '.8rem', marginLeft: 4 }}>{form.rating}/5</span>
                  </div>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Отзыв *</label>
                <textarea className="form-ta" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Расскажите о своём опыте..." style={{ minHeight: 100 }} required />
              </div>
              <button type="submit" className="btn btn-amber" style={{ alignSelf: 'flex-start' }} disabled={submitting}>
                {submitting ? 'Отправляю…' : 'Отправить отзыв →'}
              </button>
            </form>
          </div>
        )}

        {approved.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ marginBottom: 20, color: 'var(--amber)', opacity: 0.7 }}>
            <Star size={56} strokeWidth={1.2} />
          </div>
            <h3 style={{ fontFamily: 'var(--fu)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '.04em' }}>Первые отзывы скоро появятся</h3>
            <p style={{ color: 'var(--t3)', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>Первая когорта ещё в работе. После 4 недель занятий ученики и родители поделятся впечатлениями здесь — все отзывы будут реальными, без выдумок.</p>
            <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber">Записаться на пробное →</a>
          </div>
        ) : (
          <div className="rv-grid">
            {approved.map((r: { id: number; name: string; role?: string | null; direction?: string | null; rating: number; text: string; createdAt: string }) => (
              <div key={r.id} className="rv-card rv">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: 2 }}>{r.name}</div>
                    {r.role && <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--t4)' }}>{r.role}</div>}
                  </div>
                  <div style={{ color: 'var(--amber)', fontSize: '.9rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
                <p style={{ fontFamily: 'var(--fm)', fontSize: '.84rem', color: 'var(--t2)', lineHeight: 1.65, marginBottom: 12 }}>{r.text}</p>
                {r.direction && <span className="chip ch-dim" style={{ fontSize: '.66rem' }}>{r.direction}</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
