import { useState, useEffect } from 'react';
import { createApplication } from '@workspace/api-client-react';
import { analytics } from '../lib/analytics';
import { formatRuPhone, isValidRuPhone, normalizeRuPhone } from '../lib/phone';
import * as Sentry from '@sentry/react';

const DIRECTIONS = ['Дети 7–12', 'Подростки 13–17', 'Взрослые 18+', 'Кибербезопасность', 'Семейный пакет', 'Ещё не определился'];

export default function EnrollModal({ open, onClose, program = '' }: { open: boolean; onClose: () => void; program?: string }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    direction: program || 'Дети 7–12',
    message: '',
    age: '',              // for Cyber & similar programs — unlocks minor-consent when <18
    parentName: '',       // legal guardian full name if minor
    parentConsent: false, // explicit parent agreement
  });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoCloseSeconds, setAutoCloseSeconds] = useState(15);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (program) setForm(f => ({ ...f, direction: program }));
  }, [program]);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; setSent(false); setAutoCloseSeconds(15); }
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!sent) return;
    const closeTimer = setTimeout(() => onClose(), 15000);
    const countTimer = setInterval(() => setAutoCloseSeconds(s => Math.max(0, s - 1)), 1000);
    return () => { clearTimeout(closeTimer); clearInterval(countTimer); };
  }, [sent, onClose]);

  if (!open) return null;

  // A minor is anyone who is clearly a child by program (Дети/Подростки) OR
  // an explicit age field <18. Cyber is 14+ and legally requires parent
  // agreement for anything under 18.
  const ageNum = form.age ? parseInt(form.age, 10) : NaN;
  const isChildProgram = form.direction === 'Дети 7–12' || form.direction === 'Подростки 13–17';
  const isCyberProgram = form.direction === 'Кибербезопасность';
  // Cyber: show age field; if filled and <18 → require parent block. For child
  // programs we already know it's a minor.
  const requireParentBlock = isChildProgram || (isCyberProgram && Number.isFinite(ageNum) && ageNum < 18);

  // Retry a failed submit once after a short delay — handles flaky cellular
  // networks where the preflight succeeds but the POST itself times out.
  async function submitWithRetry(phone: string, message: string) {
    const payload = {
      name: form.name,
      phone,
      direction: form.direction,
      format: 'Записаться',
      message,
    };
    try {
      await createApplication(payload);
    } catch (err) {
      // One more attempt after 1.5s — matches typical transient-network drop.
      await new Promise((r) => setTimeout(r, 1500));
      await createApplication(payload);
      // First attempt failed but retry succeeded — useful signal for Sentry.
      Sentry.captureMessage('EnrollModal submit retry succeeded', {
        level: 'info',
        extra: { firstError: String(err) },
      });
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !consent) return;
    if (!isValidRuPhone(form.phone)) {
      setError('Укажите корректный российский номер в формате +7 (9XX) XXX-XX-XX.');
      return;
    }
    // Minor-consent gate: for programs involving minors we need the parent's
    // explicit OK — a website that just quietly enrols a 14-year-old into an
    // ethical-hacking class is asking for a lawsuit.
    if (requireParentBlock && (!form.parentName.trim() || !form.parentConsent)) {
      setError('Заполните ФИО родителя / законного представителя и поставьте согласие — курс предполагает участие несовершеннолетнего.');
      return;
    }
    if (isCyberProgram && !form.age) {
      setError('Укажите возраст ученика — курс «Цифровая защита» доступен с 14 лет.');
      return;
    }
    if (isCyberProgram && Number.isFinite(ageNum) && ageNum < 14) {
      setError('Курс «Цифровая защита» доступен с 14 лет. Для младшего возраста подойдёт программа «Дети 7–12».');
      return;
    }
    const normalizedPhone = normalizeRuPhone(form.phone) ?? form.phone;
    // Bundle parent info + age into the message so admin sees it in TG.
    const minorNotes: string[] = [];
    if (form.age) minorNotes.push(`Возраст: ${form.age}`);
    if (form.parentName) minorNotes.push(`Родитель: ${form.parentName}`);
    const fullMessage = [form.message, ...minorNotes].filter(Boolean).join(' · ');
    setError('');
    setSubmitting(true);
    try {
      await submitWithRetry(normalizedPhone, fullMessage);
      analytics.enrollSubmit(form.direction);
      setSent(true);
    } catch (err) {
      // Previously we faked success here to keep UX smooth — but that means
      // real submissions can silently drop (admin never gets notified, user
      // thinks they're enrolled). Surface the error instead so the user can
      // retry or switch to Telegram.
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { error?: string } }).data?.error
          : null;
      setError(
        msg ||
          'Не удалось отправить заявку. Проверьте интернет и попробуйте снова — или напишите напрямую в Telegram @DSM1322.',
      );
      Sentry.captureException(err, { tags: { feature: 'enroll-submit' } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="enroll-modal-title" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Close stays OUTSIDE .modal-scroll so it's always visible even when
            the form (Cyber + minor-consent) overflows the viewport on mobile.
            Without this, the submit button used to land below the fold and
            users couldn't reach it — confirmed in real-user feedback. */}
        <button className="modal-close" onClick={onClose} aria-label="Закрыть форму записи">✕</button>
        <div className="modal-scroll">
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
            <h3 style={{ fontFamily: 'var(--fu)', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '.06em' }}>Заявка принята!</h3>
            <p style={{ color: 'var(--t2)', marginBottom: 8, lineHeight: 1.7 }}>Степан свяжется с вами в течение 2 часов в рабочее время.</p>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--t4)', marginBottom: 24 }}>Пн–Пт 10:00–20:00, Сб 10:00–16:00</p>
            <a
              href="https://t.me/DSM1322"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-amber btn-lg"
              style={{ justifyContent: 'center', width: '100%', marginBottom: 12 }}
              onClick={() => analytics.telegramClick('enroll-success')}
            >Написать в Telegram @DSM1322 →</a>
            <button className="btn btn-outline btn-sm" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Закрыть ({autoCloseSeconds})</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--amber)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 6 }}>Нейро 32</div>
              <h3 id="enroll-modal-title" style={{ fontFamily: 'var(--fu)', fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 4 }}>Записаться на занятие</h3>
              <p style={{ fontSize: '.84rem', color: 'var(--t3)' }}>Ответим в течение 1–2 часов в рабочее время</p>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {error && (
                <div role="alert" style={{ background: 'rgba(230,57,70,.1)', border: '1px solid rgba(230,57,70,.3)', color: '#ff8a94', borderRadius: 10, padding: '10px 14px', fontSize: '.84rem', lineHeight: 1.5 }}>
                  {error}
                </div>
              )}
              <div className="form-field">
                <label className="form-label" htmlFor="enroll-name">Ваше имя *</label>
                <input
                  id="enroll-name"
                  className="form-inp"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Иван Петров"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="enroll-phone">Телефон *</label>
                <input
                  id="enroll-phone"
                  className="form-inp"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: formatRuPhone(e.target.value) }))}
                  onFocus={e => { if (!form.phone) setForm(f => ({ ...f, phone: '+7 (' })); e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length); }}
                  placeholder="+7 (9XX) XXX-XX-XX"
                  autoComplete="tel"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="enroll-direction">Направление</label>
                <select id="enroll-direction" className="form-sel" value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value, age: '', parentName: '', parentConsent: false }))}>
                  {DIRECTIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {isCyberProgram && (
                <div className="form-field">
                  <label className="form-label" htmlFor="enroll-age">Возраст ученика *</label>
                  <input
                    id="enroll-age"
                    className="form-inp"
                    type="number"
                    min={14}
                    max={99}
                    value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                    placeholder="14+"
                    required
                  />
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', marginTop: 4 }}>
                    Курс по кибербезопасности — с 14 лет. Для младшего возраста есть программа «Дети 7–12».
                  </div>
                </div>
              )}

              {requireParentBlock && (
                <div style={{ padding: '12px 14px', background: 'rgba(240,165,0,0.04)', border: '1px solid rgba(240,165,0,0.15)', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Согласие законного представителя
                  </div>
                  <div className="form-field" style={{ marginBottom: 10 }}>
                    <label className="form-label" htmlFor="enroll-parent">ФИО родителя / законного представителя *</label>
                    <input
                      id="enroll-parent"
                      className="form-inp"
                      value={form.parentName}
                      onChange={e => setForm(f => ({ ...f, parentName: e.target.value }))}
                      placeholder="Иванова Анна Петровна"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.parentConsent}
                      onChange={e => setForm(f => ({ ...f, parentConsent: e.target.checked }))}
                      style={{ marginTop: 3, flexShrink: 0, accentColor: 'var(--amber)', width: 16, height: 16 }}
                      required
                    />
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--t2)', lineHeight: 1.5 }}>
                      Я являюсь родителем (законным представителем) ученика и даю письменное согласие на его участие в программе «{form.direction}» в лаборатории «Нейро 32».
                    </span>
                  </label>
                </div>
              )}

              <div className="form-field">
                <label className="form-label" htmlFor="enroll-message">Комментарий</label>
                <textarea
                  id="enroll-message"
                  className="form-ta"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Удобное время, вопросы, пожелания..."
                  style={{ minHeight: 70 }}
                />
              </div>
              {/* Согласие на обработку ПДн — обязательный чекбокс (152-ФЗ ст. 9) */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  style={{ marginTop: 3, flexShrink: 0, accentColor: 'var(--amber)', width: 16, height: 16 }}
                  required
                />
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.65rem', color: 'var(--t3)', lineHeight: 1.55 }}>
                  Я даю согласие на обработку персональных данных в соответствии с{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--amber)' }}>политикой конфиденциальности</a>
                  {' '}и принимаю условия{' '}
                  <a href="/offer" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--amber)' }}>публичной оферты</a>
                  {' '}(включая порядок возврата — §7–8: отказ в любой момент с возвратом за непроведённые занятия).
                </span>
              </label>
              <button type="submit" className="btn btn-amber btn-lg" style={{ justifyContent: 'center' }} disabled={submitting || !consent}>
                {submitting ? 'Отправляю…' : 'Записаться →'}
              </button>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
