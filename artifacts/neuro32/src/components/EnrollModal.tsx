import { useState, useEffect } from 'react';
import { store } from '../lib/store';
import { analytics } from '../lib/analytics';

const DIRECTIONS = ['Дети 7–12', 'Подростки 13–17', 'Взрослые 18+', 'Кибербезопасность', 'Семейный пакет', 'Ещё не определился'];

export default function EnrollModal({ open, onClose, program = '' }: { open: boolean; onClose: () => void; program?: string }) {
  const [form, setForm] = useState({ name: '', phone: '', direction: program || 'Дети 7–12', message: '' });
  const [sent, setSent] = useState(false);
  const [autoCloseSeconds, setAutoCloseSeconds] = useState(8);

  useEffect(() => {
    if (program) setForm(f => ({ ...f, direction: program }));
  }, [program]);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; setSent(false); setAutoCloseSeconds(8); }
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!sent) return;
    const closeTimer = setTimeout(() => onClose(), 8000);
    const countTimer = setInterval(() => setAutoCloseSeconds(s => Math.max(0, s - 1)), 1000);
    return () => { clearTimeout(closeTimer); clearInterval(countTimer); };
  }, [sent, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    store.addRequest({ ...form, format: 'Записаться' });
    analytics.enrollSubmit(form.direction);
    setSent(true);
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть форму записи">✕</button>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
            <h3 style={{ fontFamily: 'var(--fu)', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '.06em' }}>Заявка принята!</h3>
            <p style={{ color: 'var(--t2)', marginBottom: 8, lineHeight: 1.7 }}>Степан свяжется с вами в течение 2 часов в рабочее время.</p>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--t4)', marginBottom: 24 }}>Пн–Пт 10:00–20:00, Сб 10:00–16:00</p>
            <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-lg" style={{ justifyContent: 'center', width: '100%', marginBottom: 12 }}>Написать в Telegram @DSM1322 →</a>
            <button className="btn btn-outline btn-sm" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Закрыть ({autoCloseSeconds})</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--amber)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 6 }}>Нейро 32</div>
              <h3 style={{ fontFamily: 'var(--fu)', fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 4 }}>Записаться на занятие</h3>
              <p style={{ fontSize: '.84rem', color: 'var(--t3)' }}>Ответим в течение 1–2 часов в рабочее время</p>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-field">
                <label className="form-label" htmlFor="enroll-name">Имя *</label>
                <input id="enroll-name" className="form-inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ваше имя" required />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="enroll-phone">Телефон или Telegram *</label>
                <input id="enroll-phone" className="form-inp" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 900 000-00-00 или @username" required />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="enroll-direction">Направление</label>
                <select id="enroll-direction" className="form-sel" value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}>
                  {DIRECTIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="enroll-message">Вопрос или комментарий</label>
                <textarea id="enroll-message" className="form-ta" style={{ minHeight: 72 }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Возраст ребёнка, рабочие задачи, вопросы..." />
              </div>
              <button type="submit" className="btn btn-amber btn-lg" style={{ width: '100%', justifyContent: 'center' }}>Отправить заявку →</button>
              <p style={{ fontSize: '.72rem', color: 'var(--t4)', textAlign: 'center', lineHeight: 1.5 }}>Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
