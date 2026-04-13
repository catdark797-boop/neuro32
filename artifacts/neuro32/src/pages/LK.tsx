import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { store } from '../lib/store';


const NOTIFICATIONS = [
  { id: 1, type: 'info', title: 'Следующее занятие — завтра', body: '4 мая (пн), 17:00. Промпт-инжиниринг: базовый. ул. Коммунистическая, 22А', time: '10 минут назад', read: false },
  { id: 2, type: 'success', title: 'Оплата подтверждена', body: 'Абонемент на апрель 2026 — 8 500 ₽. Чек отправлен через «Мой налог».', time: '2 дня назад', read: false },
  { id: 3, type: 'tip', title: 'Совет недели', body: 'Попробуйте использовать ChatGPT для анализа ваших рабочих документов — загрузите Excel и задайте вопросы.', time: '3 дня назад', read: true },
  { id: 4, type: 'info', title: 'Расписание обновлено', body: 'Добавлено занятие 26 мая. Проверьте раздел «Расписание».', time: '1 неделю назад', read: true },
];

type Tab = 'dashboard' | 'schedule' | 'payment' | 'profile' | 'notifications' | 'security';

const ONBOARDING_STEPS = [
  { icon: '1', title: 'Познакомьтесь со Степаном', desc: 'Напишите в Telegram @DSM1322 — представьтесь и расскажите о своих целях. Степан поможет определить программу.', done: true },
  { icon: '2', title: 'Пройдите первое занятие', desc: 'Первый урок запланирован на 4 мая в 17:00 — ул. Коммунистическая, 22А. Приходите за 5 минут, возьмите ноутбук.', done: false },
  { icon: '3', title: 'Оплатите и начните курс', desc: 'Переведите абонемент через СБП на +7 (901) 976-98-10. Чек придёт автоматически. Вы стали участником Нейро 32!', done: false },
];

export default function LK() {
  const [, navigate] = useLocation();
  const user = store.getCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', telegram: user?.telegram || '', goals: user?.goals || '' });
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [sessions2fa] = useState([
    { device: 'Chrome · Windows 10', location: 'Новозыбков, RU', time: 'Сейчас', current: true },
    { device: 'Safari · iPhone 14', location: 'Новозыбков, RU', time: '2 дня назад', current: false },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const logout = () => { store.logout(); navigate('/'); };
  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateUser(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (!pwForm.current) { setPwError('Введите текущий пароль'); return; }
    if (pwForm.next.length < 6) { setPwError('Новый пароль — минимум 6 символов'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Пароли не совпадают'); return; }
    setPwSaved(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 3000);
  };

  const navItems: Array<{ key: Tab; icon: string; label: string; badge?: number }> = [
    { key: 'dashboard', icon: '📊', label: 'Дашборд' },
    { key: 'schedule', icon: '📅', label: 'Расписание' },
    { key: 'payment', icon: '💳', label: 'Оплата' },
    { key: 'profile', icon: '⚙️', label: 'Профиль' },
    { key: 'notifications', icon: '🔔', label: 'Уведомления', badge: unreadCount },
    { key: 'security', icon: '🔒', label: 'Безопасность' },
  ];

  const onboardingDone = ONBOARDING_STEPS.filter(s => s.done).length;
  const onboardingPct = Math.round((onboardingDone / ONBOARDING_STEPS.length) * 100);

  return (
    <div>
      <div className="lk-layout">
        {/* Sidebar */}
        <div className="lk-side">
          <div style={{ padding: '14px', background: 'rgba(240,165,0,.05)', borderRadius: 12, marginBottom: 12 }}>
            <div className="lk-av">{initials}</div>
            <div className="lk-nm">{user.name}</div>
            <div className="lk-em">{user.email}</div>
            <div className="lk-badge"><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />Активный ученик</div>
          </div>
          <ul className="lk-nav">
            {navItems.map(item => (
              <li key={item.key}>
                <button className={tab === item.key ? 'active' : ''} onClick={() => setTab(item.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 9, fontSize: '.84rem', fontWeight: 500, color: tab === item.key ? 'var(--amber)' : 'var(--t2)', cursor: 'pointer', transition: 'all .2s', border: '1px solid transparent', width: '100%', textAlign: 'left', background: tab === item.key ? 'rgba(240,165,0,.06)' : 'none' }}>
                  <span>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge ? (
                    <span style={{ background: 'var(--amber)', color: 'var(--navy)', borderRadius: 20, fontSize: '.56rem', fontWeight: 800, padding: '2px 6px', fontFamily: 'var(--fu)' }}>{item.badge}</span>
                  ) : null}
                </button>
              </li>
            ))}
            <li><div className="lk-nav-sep" /></li>
            <li><button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 9, fontSize: '.84rem', fontWeight: 500, color: 'var(--scarlet)', cursor: 'pointer', transition: 'all .2s', border: '1px solid transparent', width: '100%', textAlign: 'left', background: 'none' }}>🚪 Выйти</button></li>
          </ul>
        </div>

        {/* Main content */}
        <div className="lk-content">

          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <>
              <div className="lk-title">Добро пожаловать, {user.name.split(' ')[0]}!</div>

              {/* SKELETON LOADING STATE */}
              {isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="skeleton" style={{ height: 130, borderRadius: 16 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                    {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
                  </div>
                  <div className="skeleton" style={{ height: 110, borderRadius: 14 }} />
                  <div className="skeleton" style={{ height: 90, borderRadius: 14 }} />
                </div>
              )}

              {!isLoading && (<>

              {/* ONBOARDING BANNER */}
              {onboardingPct < 100 && (
                <div style={{ background: 'linear-gradient(135deg,rgba(74,124,255,.08),rgba(74,124,255,.03))', border: '1px solid rgba(74,124,255,.2)', borderRadius: 16, padding: 22, marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontFamily: 'var(--fu)', fontSize: '.66rem', fontWeight: 700, color: '#fff', letterSpacing: '.05em' }}>ОНБОРДИНГ · НАСТРОЙТЕ ПРОФИЛЬ</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--cobalt)' }}>{onboardingPct}%</div>
                  </div>
                  <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${onboardingPct}%`, background: 'linear-gradient(90deg,var(--cobalt),rgba(74,124,255,.6))', borderRadius: 2, transition: 'width .8s ease' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {ONBOARDING_STEPS.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: step.done ? 'var(--emerald)' : 'rgba(255,255,255,.08)', border: `1.5px solid ${step.done ? 'var(--emerald)' : 'var(--line2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', color: step.done ? '#fff' : 'var(--t4)', flexShrink: 0, marginTop: 2 }}>
                          {step.done ? '✓' : i + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: '.84rem', fontWeight: 600, color: step.done ? 'var(--t3)' : '#fff', marginBottom: 1, textDecoration: step.done ? 'line-through' : 'none' }}>{step.title}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)' }}>{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="lk-g4">
                {[
                  { n: '8', l: 'Занятий пройдено' },
                  { n: '16', l: 'До конца курса' },
                  { n: '33%', l: 'Прогресс' },
                  { n: '3', l: 'Проекта сдано' },
                ].map((s, i) => (
                  <div key={i} className="lk-stat">
                    <div className="lk-sn">{s.n}</div>
                    <div className="lk-sl">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="sub-banner">
                <h4>Следующее занятие</h4>
                <p>📅 4 мая (пн) · 17:00 · Промпт-инжиниринг: базовый · ул. Коммунистическая, 22А</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm">Написать Степану</a>
                  <button className="btn btn-outline btn-sm" onClick={() => setTab('schedule')}>Расписание →</button>
                </div>
              </div>
              <div className="lk-card">
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', marginBottom: 14 }}>Ваша программа</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                  <span className="chip ch-amber">{user.direction || 'Взрослые 18+'}</span>
                  <span className="chip ch-green">32 занятия</span>
                  <span className="chip ch-blue">Старт 4 мая 2026</span>
                </div>
                <div style={{ height: 6, background: 'var(--line)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '33%', background: 'linear-gradient(90deg,var(--amber),var(--amber2))', borderRadius: 3, transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)', marginTop: 6 }}>8 / 24 занятий · 33% завершено</div>
              </div>
              </>)}
            </>
          )}

          {/* SCHEDULE */}
          {tab === 'schedule' && (() => {
            const allSessions = store.getClassSessions();
            const now = new Date();
            const userDirection = user.direction;
            const future = allSessions
              .filter(s => new Date(s.date + 'T' + (s.time || '00:00')) >= now);
            const directionMap: Record<string, string> = {
              'Дети 7–12': 'Дети',
              'Подростки 13–17': 'Подростки',
              'Взрослые 18+': 'Взрослые',
              'Кибербезопасность': 'Кибербезопасность',
            };
            const storeDir = userDirection ? directionMap[userDirection] || userDirection : null;
            const filtered = storeDir
              ? future.filter(s => s.direction === storeDir || !s.direction)
              : future;
            const upcomingSessions = (filtered.length > 0 ? filtered : future)
              .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
              .slice(0, 5);
            const formatDate = (dateStr: string) => {
              const d = new Date(dateStr);
              if (isNaN(d.getTime())) return dateStr;
              return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            };
            const getDayName = (dateStr: string) => {
              const d = new Date(dateStr);
              if (isNaN(d.getTime())) return '';
              return d.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase();
            };
            return (
              <>
                <div className="lk-title">Расписание занятий</div>
                <div style={{ marginBottom: 14, padding: '12px 16px', background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.15)', borderRadius: 12, fontSize: '.84rem', color: 'var(--amber)', fontFamily: 'var(--fm)' }}>
                  📅 2 занятия в неделю · г. Новозыбков, ул. Коммунистическая, 22А
                </div>
                {upcomingSessions.length === 0 ? (
                  <div className="lk-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 12 }}>📅</div>
                    <div style={{ fontFamily: 'var(--fu)', fontSize: '.8rem', color: '#fff', marginBottom: 8 }}>Расписание появится здесь</div>
                    <div style={{ fontSize: '.84rem', color: 'var(--t3)', marginBottom: 20, lineHeight: 1.6 }}>
                      Актуальное расписание — у Степана в Telegram после записи на занятие.
                    </div>
                    <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm">Написать в Telegram @DSM1322 →</a>
                  </div>
                ) : (
                  <div className="lk-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {upcomingSessions.map((s, i) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: i < upcomingSessions.length - 1 ? '1px solid var(--line)' : 'none', background: i === 0 ? 'rgba(240,165,0,.04)' : 'transparent' }}>
                        <div style={{ width: 52, textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: 'var(--t4)', marginBottom: 2, textTransform: 'uppercase' }}>{getDayName(s.date)}</div>
                          <div style={{ fontFamily: 'var(--fu)', fontSize: '1rem', color: i === 0 ? 'var(--amber)' : '#fff' }}>{formatDate(s.date)}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)' }}>{s.time}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '.88rem', fontWeight: 600, color: '#fff', marginBottom: 3 }}>{s.topic}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)' }}>{s.direction} · Офлайн</div>
                        </div>
                        <div>
                          {i === 0 && <span className="sbdg sb-new">Следующее</span>}
                          {i > 0 && <span className="sbdg sb-fr">Запланировано</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          {/* PAYMENT */}
          {tab === 'payment' && (
            <>
              <div className="lk-title">Оплата</div>
              <div className="sub-banner" style={{ marginBottom: 20 }}>
                <h4>💳 Оплата через СБП</h4>
                <p>Переведите на номер <strong style={{ color: '#fff' }}>+7 (901) 976-98-10</strong> (Степан Марьянович Денис) через СБП в приложении банка. Чек придёт автоматически через «Мой налог».</p>
                <p style={{ fontSize: '.82rem', color: 'var(--t3)', marginTop: 6 }}>Стоимость уточняется у Степана — зависит от направления и формата занятий.</p>
              </div>
              <div className="lk-card">
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>История платежей</div>
                <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--t3)', fontSize: '.84rem' }}>
                  История платежей появится после первой оплаты. Чеки отправляются в Telegram через «Мой налог».
                </div>
              </div>
              <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(45,158,107,.06)', border: '1px solid rgba(45,158,107,.15)', borderRadius: 12, fontSize: '.84rem', color: 'var(--t2)' }}>
                ✅ <strong style={{ color: 'var(--emerald)' }}>Официально:</strong> Самозанятый, чек через «Мой налог». Подходит для физлиц, ИП и организаций. По вопросам: <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--amber)' }}>@DSM1322</a>
              </div>
            </>
          )}

          {/* PROFILE */}
          {tab === 'profile' && (
            <>
              <div className="lk-title">Мой профиль</div>
              {saved && <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, color: 'var(--emerald)', fontFamily: 'var(--fm)', fontSize: '.82rem' }}>✓ Сохранено</div>}
              <div className="lk-card">
                <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Имя</label>
                      <input className="form-inp" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Email</label>
                      <input className="form-inp" value={user.email} disabled style={{ opacity: .5 }} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Телефон</label>
                      <input className="form-inp" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+7 900 000-00-00" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Telegram</label>
                      <input className="form-inp" value={profile.telegram} onChange={e => setProfile(p => ({ ...p, telegram: e.target.value }))} placeholder="@username" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Ваши цели</label>
                    <textarea className="form-ta" value={profile.goals} onChange={e => setProfile(p => ({ ...p, goals: e.target.value }))} placeholder="Что хотите освоить?" style={{ minHeight: 80 }} />
                  </div>
                  <button type="submit" className="btn btn-amber" style={{ alignSelf: 'flex-start' }}>Сохранить →</button>
                </form>
              </div>
            </>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div className="lk-title" style={{ marginBottom: 0 }}>Уведомления</div>
                {unreadCount > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Отметить все как прочитанные</button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--t4)', fontFamily: 'var(--fm)', fontSize: '.8rem' }}>
                  Уведомлений нет
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {notifications.map(n => {
                    const colors: Record<string, string> = { info: 'var(--cobalt)', success: 'var(--emerald)', tip: 'var(--amber)' };
                    const icons: Record<string, string> = { info: '📅', success: '✅', tip: '💡' };
                    return (
                      <div key={n.id} onClick={() => markRead(n.id)} style={{ display: 'flex', gap: 14, padding: '16px 18px', background: n.read ? 'var(--card)' : 'rgba(240,165,0,.04)', border: `1px solid ${n.read ? 'var(--line)' : 'rgba(240,165,0,.15)'}`, borderRadius: 14, cursor: 'pointer', transition: 'all .2s' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${colors[n.type]}18`, border: `1px solid ${colors[n.type]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{icons[n.type]}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <div style={{ fontSize: '.88rem', fontWeight: n.read ? 500 : 700, color: '#fff' }}>{n.title}</div>
                            {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />}
                          </div>
                          <div style={{ fontSize: '.82rem', color: 'var(--t3)', lineHeight: 1.55, marginBottom: 4 }}>{n.body}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)' }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* SECURITY */}
          {tab === 'security' && (
            <>
              <div className="lk-title">Безопасность</div>

              {/* Change password */}
              <div className="lk-card" style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', marginBottom: 18 }}>Изменить пароль</div>
                {pwSaved && <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: 'var(--emerald)', fontFamily: 'var(--fm)', fontSize: '.82rem' }}>✓ Пароль изменён</div>}
                {pwError && <div style={{ background: 'rgba(230,57,70,.1)', border: '1px solid rgba(230,57,70,.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: 'var(--scarlet)', fontFamily: 'var(--fm)', fontSize: '.82rem' }}>{pwError}</div>}
                <form onSubmit={savePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Текущий пароль</label>
                    <input type="password" className="form-inp" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Новый пароль</label>
                      <input type="password" className="form-inp" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} placeholder="Минимум 6 символов" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Повторите пароль</label>
                      <input type="password" className="form-inp" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Повторите новый пароль" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-amber" style={{ alignSelf: 'flex-start' }}>Сохранить пароль →</button>
                </form>
              </div>

              {/* Active sessions */}
              <div className="lk-card" style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>Активные сессии</div>
                {sessions2fa.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < sessions2fa.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: s.current ? 'rgba(45,158,107,.1)' : 'rgba(255,255,255,.05)', border: `1px solid ${s.current ? 'rgba(45,158,107,.25)' : 'var(--line)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      {s.device.includes('iPhone') ? '📱' : '💻'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '.88rem', fontWeight: 600, color: '#fff', marginBottom: 2 }}>{s.device}</div>
                      <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)' }}>{s.location} · {s.time}</div>
                    </div>
                    {s.current ? (
                      <span className="sbdg sb-ok">Текущая</span>
                    ) : (
                      <button className="btn btn-danger btn-sm" style={{ padding: '5px 10px', fontSize: '.58rem' }}>Завершить</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Privacy */}
              <div style={{ padding: '18px 22px', background: 'rgba(74,124,255,.05)', border: '1px solid rgba(74,124,255,.15)', borderRadius: 14, fontSize: '.84rem', color: 'var(--t2)', lineHeight: 1.7 }}>
                🔒 <strong style={{ color: '#fff' }}>Данные в безопасности.</strong> Ваши данные хранятся только локально на этом устройстве. Нейро 32 — самозанятый (НПД), данные не передаются третьим лицам. По вопросам: <a href="mailto:d3stemar@yandex.ru" style={{ color: 'var(--amber)' }}>d3stemar@yandex.ru</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
