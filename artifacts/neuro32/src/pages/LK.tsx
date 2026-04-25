import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useListClassSessions, updateUser } from '@workspace/api-client-react';
import { useCurrentUser } from '../lib/auth-context';
import { usePageMeta } from '../hooks/usePageMeta';
import { EmptyState, LoadingState } from '../components/StateViews';
import { usePricing, DEFAULT_PRICES } from '../hooks/usePricing';
import { analytics } from '../lib/analytics';
import {
  LayoutDashboard, Calendar, CreditCard, User, Bell, ShieldCheck,
  LogOut, CheckCircle2, Clock, BookOpen, Folder,
  MessageCircle, MapPin, AlertTriangle
} from 'lucide-react';

type ApiNotification = {
  id: number;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

type ApiPayment = {
  id: number;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  paidAt: string | null;
};

type Tab = 'dashboard' | 'schedule' | 'payment' | 'profile' | 'notifications' | 'security';

// Onboarding steps are derived at render time from the real user profile /
// payment history — no hardcoded "done: true" so we don't lie to new users
// about progress they haven't actually made.

const NAV_ITEMS: Array<{ key: Tab; Icon: React.FC<{ size?: number }>; label: string }> = [
  { key: 'dashboard',     Icon: LayoutDashboard, label: 'Дашборд' },
  { key: 'schedule',      Icon: Calendar,        label: 'Расписание' },
  { key: 'payment',       Icon: CreditCard,      label: 'Оплата' },
  { key: 'profile',       Icon: User,            label: 'Профиль' },
  { key: 'notifications', Icon: Bell,            label: 'Уведомления' },
  { key: 'security',      Icon: ShieldCheck,     label: 'Безопасность' },
];

export default function LK() {
  usePageMeta('Личный кабинет', 'Личный кабинет ученика Нейро 32: расписание, оплаты, профиль, уведомления.');
  const { data: pricing = DEFAULT_PRICES } = usePricing();
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading, logout, invalidate } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [profile, setProfile] = useState({ name: '', telegram: '', goals: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  // Page size matches the API server default (20). Frontend pagination is
  // explicit — "Показать ещё" button appends the next page; we don't do
  // intersection-observer auto-load because users on metered mobile data
  // sometimes scroll past the section unintentionally.
  const NOTIF_PAGE = 20;
  const [notifHasMore, setNotifHasMore] = useState(true);
  const [notifLoadingMore, setNotifLoadingMore] = useState(false);
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const { data: classSessions = [] } = useListClassSessions({ query: { staleTime: 60_000 } });

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', telegram: user.telegram || '', goals: user.goals || '' });
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

  useEffect(() => {
    if (!user) return;
    setNotifLoading(true);
    fetch(`${apiBase}/api/notifications?limit=${NOTIF_PAGE}&offset=0`, { credentials: 'include' })
      .then(r => r.ok ? r.json() as Promise<ApiNotification[]> : Promise.resolve([]))
      .then(data => {
        setNotifications(data);
        // Server returns < page size when there are no more rows.
        setNotifHasMore(data.length === NOTIF_PAGE);
      })
      .catch(() => {})
      .finally(() => setNotifLoading(false));
  }, [user, apiBase]);

  const loadMoreNotifications = async () => {
    if (notifLoadingMore || !notifHasMore) return;
    setNotifLoadingMore(true);
    try {
      const res = await fetch(
        `${apiBase}/api/notifications?limit=${NOTIF_PAGE}&offset=${notifications.length}`,
        { credentials: 'include' },
      );
      if (!res.ok) return;
      const next = (await res.json()) as ApiNotification[];
      setNotifications(prev => [...prev, ...next]);
      setNotifHasMore(next.length === NOTIF_PAGE);
    } catch { /* ignore — button stays clickable for retry */ } finally {
      setNotifLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!user || tab !== 'payment') return;
    setPaymentsLoading(true);
    fetch(`${apiBase}/api/payments`, { credentials: 'include' })
      .then(r => r.ok ? r.json() as Promise<ApiPayment[]> : Promise.resolve([]))
      .then(data => setPayments(data))
      .catch(() => {})
      .finally(() => setPaymentsLoading(false));
  }, [user, tab, apiBase]);

  if (authLoading) return null;
  if (!user) { navigate('/auth'); return null; }

  const handleLogout = async () => { await logout(); navigate('/'); };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(user.id, { name: profile.name, telegram: profile.telegram, goals: profile.goals });
      invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (!pwForm.current) { setPwError('Введите текущий пароль'); return; }
    if (pwForm.next.length < 8) { setPwError('Новый пароль — минимум 8 символов'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Пароли не совпадают'); return; }
    setPwSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/users/${user!.id}/change-password`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setPwError(data.error ?? 'Ошибка при смене пароля');
        return;
      }
      setPwSaved(true);
      setPwForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwSaved(false), 3000);
    } catch { setPwError('Ошибка сети. Попробуйте позже.'); }
    finally { setPwSaving(false); }
  };

  const revokeAllSessions = async () => {
    if (!confirm('Выйти со всех устройств? Вам потребуется войти снова.')) return;
    setRevoking(true);
    try {
      await fetch(`${apiBase}/api/auth/sessions`, { method: 'DELETE', credentials: 'include' });
      await logout(); navigate('/auth');
    } catch { setRevoking(false); }
  };

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: number) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
    fetch(`${apiBase}/api/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' }).catch(() => {});
  };
  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    fetch(`${apiBase}/api/notifications/read-all`, { method: 'PATCH', credentials: 'include' }).catch(() => {});
  };

  // Derive onboarding progress from the user's actual profile + payment state.
  // We never mark steps as done without real evidence — users should see what
  // they actually completed, not a fake "1/3 ready" placeholder.
  const paidCount = payments.filter(p => p.status === 'paid').length;
  const onboardingSteps = [
    {
      title: 'Познакомьтесь со Степаном',
      desc: 'Напишите в Telegram @DSM1322 — представьтесь и расскажите о своих целях.',
      done: Boolean(user.telegram && user.telegram.trim().length > 1),
    },
    {
      title: 'Укажите направление и цели',
      desc: 'Заполните направление обучения и цели в разделе «Профиль» — помогает Степану подготовить материал.',
      done: Boolean(user.direction && user.goals),
    },
    {
      title: 'Оплатите абонемент',
      desc: 'Оплатите первый месяц через вкладку «Оплата». Чек «Мой налог» придёт автоматически.',
      done: paidCount > 0,
    },
  ];
  const onboardingDone = onboardingSteps.filter(s => s.done).length;
  const onboardingPct = Math.round((onboardingDone / onboardingSteps.length) * 100);

  return (
    <>
      <div className="lk-layout">
        {/* SIDEBAR */}
        <aside className="lk-sidebar">
          <div className="lk-sidebar-brand">
            <div className="lk-sidebar-brand-name">НЕЙРО <span style={{ color: 'var(--amber)' }}>32</span></div>
            <div className="lk-user-block">
              <div className="lk-avatar">{initials}</div>
              <div>
                <div className="lk-user-name">{user.name}</div>
                <div className="lk-user-email">{user.email}</div>
              </div>
            </div>
          </div>

          <nav className="lk-nav-section">
            <div className="lk-nav-label">Кабинет</div>
            {NAV_ITEMS.map(({ key, Icon, label }) => (
              <button
                key={key}
                className={`lk-nav-item${tab === key ? ' lk-active' : ''}`}
                onClick={() => setTab(key)}
              >
                <Icon size={16} />
                <span style={{ flex: 1 }}>{label}</span>
                {key === 'notifications' && unreadCount > 0 && (
                  <span style={{ background: 'var(--amber)', color: 'var(--navy)', borderRadius: 20, fontSize: '.54rem', fontWeight: 800, padding: '2px 6px', fontFamily: 'var(--fu)' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="lk-nav-sep" />
          <div className="lk-sidebar-footer">
            <button className="lk-nav-item" onClick={handleLogout} style={{ color: 'var(--scarlet)' }}>
              <LogOut size={16} style={{ color: 'var(--scarlet)' }} />
              Выйти
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="lk-main">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <>
              <div className="lk-page-title">Добро пожаловать, {user.name.split(' ')[0]}!</div>
              <div className="lk-page-sub">Ваш личный кабинет Нейро 32</div>

              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="skeleton" style={{ height: 100, borderRadius: 14 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 86, borderRadius: 14 }} />)}
                  </div>
                  <div className="skeleton" style={{ height: 110, borderRadius: 14 }} />
                </div>
              ) : (
                <>
                  {/* Stats row — derived from real payment/session data.
                      We don't track "lessons attended" per student yet, so the
                      dashboard shows what we CAN compute honestly: paid months,
                      upcoming sessions, and unread notifications. */}
                  {(() => {
                    const paidMonths = payments.filter(p => p.status === 'paid').length;
                    const now = new Date();
                    const upcomingCount = classSessions.filter((s: { date: string; time: string }) => new Date(s.date + 'T' + (s.time || '00:00')) >= now).length;
                    return (
                      <div className="lk-stats-row">
                        <div className="lk-stat-card accent">
                          <div className="lk-stat-num">{paidMonths}</div>
                          <div className="lk-stat-label">Оплаченных месяцев</div>
                        </div>
                        <div className="lk-stat-card">
                          <div className="lk-stat-num">{upcomingCount}</div>
                          <div className="lk-stat-label">Занятий в расписании</div>
                        </div>
                        <div className="lk-stat-card">
                          <div className="lk-stat-num">{unreadCount}</div>
                          <div className="lk-stat-label">Новых уведомлений</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Next lesson — from real classSessions if any, else a CTA
                      to reach out in Telegram (no hardcoded "4 мая 17:00"). */}
                  {(() => {
                    const now = new Date();
                    const directionMap: Record<string, string> = { 'Дети 7–12': 'Дети', 'Подростки 13–17': 'Подростки', 'Взрослые 18+': 'Взрослые', 'Кибербезопасность': 'Кибербезопасность' };
                    const storeDir = user.direction ? directionMap[user.direction] || user.direction : null;
                    const futureAll = classSessions
                      .filter((s: { date: string; time: string }) => new Date(s.date + 'T' + (s.time || '00:00')) >= now)
                      .sort((a: { date: string; time: string }, b: { date: string; time: string }) => (a.date + a.time).localeCompare(b.date + b.time));
                    const dirFuture = storeDir ? futureAll.filter((s: { direction: string }) => s.direction === storeDir || !s.direction) : futureAll;
                    const next = (dirFuture[0] ?? futureAll[0]) as { date: string; time: string; topic: string } | undefined;
                    if (!next) {
                      return (
                        <div className="lk-next-lesson" style={{ alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <div className="lk-next-info-label">Ближайшее занятие</div>
                            <div className="lk-next-info-title">Расписание появится после записи</div>
                            <div className="lk-next-info-time" style={{ color: 'var(--t3)', marginTop: 4 }}>Напишите Степану в Telegram, чтобы закрепить дату.</div>
                          </div>
                          <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm"><MessageCircle size={14} />Написать</a>
                        </div>
                      );
                    }
                    const dt = new Date(next.date);
                    const day = isNaN(dt.getTime()) ? next.date : dt.getDate();
                    const month = isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('ru-RU', { month: 'long' });
                    return (
                      <div className="lk-next-lesson">
                        <div className="lk-next-date-block">
                          <div className="lk-next-date-day">{day}</div>
                          <div className="lk-next-date-month">{month}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="lk-next-info-label">Следующее занятие</div>
                          <div className="lk-next-info-title">{next.topic}</div>
                          <div className="lk-next-info-time" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} style={{ color: 'var(--amber)' }} />{next.time}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} style={{ color: 'var(--amber)' }} />ул. Коммунистическая, 22А</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                          <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm">
                            <MessageCircle size={14} />Написать
                          </a>
                          <button className="btn btn-outline btn-sm" onClick={() => setTab('schedule')}>Расписание</button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Onboarding */}
                  {onboardingPct < 100 && (
                    <div className="lk-card" style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div className="lk-card-title" style={{ marginBottom: 0 }}>Настройте профиль</div>
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--cobalt)' }}>{onboardingPct}%</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--line)', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${onboardingPct}%`, background: 'linear-gradient(90deg,var(--cobalt),rgba(74,124,255,.6))', borderRadius: 2, transition: 'width .8s ease' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {onboardingSteps.map((step, i) => (
                          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, color: step.done ? 'var(--emerald)' : 'var(--t4)', marginTop: 2 }}>
                              {step.done
                                ? <CheckCircle2 size={18} />
                                : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--line2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', color: 'var(--t4)' }}>{i + 1}</div>
                              }
                            </div>
                            <div>
                              <div style={{ fontSize: '.86rem', fontWeight: 600, color: step.done ? 'var(--t3)' : '#fff', textDecoration: step.done ? 'line-through' : 'none', marginBottom: 2 }}>{step.title}</div>
                              <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)' }}>{step.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Program card — derived from real data only. Direction
                      from profile, session count from actual classSessions. */}
                  {(() => {
                    const directionMap: Record<string, string> = { 'Дети 7–12': 'Дети', 'Подростки 13–17': 'Подростки', 'Взрослые 18+': 'Взрослые', 'Кибербезопасность': 'Кибербезопасность' };
                    const storeDir = user.direction ? directionMap[user.direction] || user.direction : null;
                    const dirSessions = storeDir
                      ? classSessions.filter((s: { direction: string }) => s.direction === storeDir || !s.direction)
                      : classSessions;
                    const totalForDir = dirSessions.length;
                    const firstSession = [...dirSessions].sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date))[0] as { date: string } | undefined;
                    const startLabel = firstSession
                      ? new Date(firstSession.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'дата не назначена';
                    if (!user.direction && totalForDir === 0) {
                      return (
                        <div className="lk-card">
                          <div className="lk-card-title">Ваша программа</div>
                          <div style={{ fontSize: '.86rem', color: 'var(--t3)', lineHeight: 1.6 }}>
                            Укажите направление в <button className="btn-link" onClick={() => setTab('profile')} style={{ color: 'var(--amber)', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}>Профиле</button>, чтобы мы показали персональное расписание и программу.
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="lk-card">
                        <div className="lk-card-title">Ваша программа</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                          <span className="chip ch-amber"><BookOpen size={11} />{user.direction || 'Не указано'}</span>
                          {totalForDir > 0 && <span className="chip ch-green"><Folder size={11} />{totalForDir} занятий в расписании</span>}
                          <span className="chip ch-blue"><Calendar size={11} />Старт {startLabel}</span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </>
          )}

          {/* ── SCHEDULE ── */}
          {tab === 'schedule' && (() => {
            const now = new Date();
            const directionMap: Record<string, string> = { 'Дети 7–12': 'Дети', 'Подростки 13–17': 'Подростки', 'Взрослые 18+': 'Взрослые', 'Кибербезопасность': 'Кибербезопасность' };
            const storeDir = user.direction ? directionMap[user.direction] || user.direction : null;
            const future = classSessions.filter((s: { date: string; time: string }) => new Date(s.date + 'T' + (s.time || '00:00')) >= now);
            const filtered = storeDir ? future.filter((s: { direction: string }) => s.direction === storeDir || !s.direction) : future;
            const upcomingSessions = (filtered.length > 0 ? filtered : future)
              .sort((a: { date: string; time: string }, b: { date: string; time: string }) => (a.date + a.time).localeCompare(b.date + b.time))
              .slice(0, 8);
            const fmtDate = (d: string) => { const dt = new Date(d); return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }); };
            const getDayName = (d: string) => { const dt = new Date(d); return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(); };
            return (
              <>
                <div className="lk-page-title">Расписание занятий</div>
                <div className="lk-page-sub">Актуальное расписание — 2 занятия в неделю</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.15)', borderRadius: 10, fontSize: '.82rem', color: 'var(--amber)', fontFamily: 'var(--fm)', marginBottom: 20 }}>
                  <MapPin size={13} />г. Новозыбков, ул. Коммунистическая, 22А
                </div>
                <div className="lk-card" style={{ padding: 0, overflow: 'hidden' }}>
                  {upcomingSessions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                      <Calendar size={32} style={{ color: 'var(--t4)', margin: '0 auto 14px' }} />
                      <div style={{ fontFamily: 'var(--fu)', fontSize: '.8rem', color: '#fff', marginBottom: 8 }}>Расписание появится здесь</div>
                      <div style={{ fontSize: '.84rem', color: 'var(--t3)', marginBottom: 20, lineHeight: 1.6, maxWidth: 340, margin: '0 auto 20px' }}>
                        Актуальное расписание — у Степана в Telegram после записи.
                      </div>
                      <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm">
                        <MessageCircle size={14} />Telegram @DSM1322
                      </a>
                    </div>
                  ) : upcomingSessions.map((s: { id: number; date: string; time: string; topic: string; direction: string }, i: number) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 22px', borderBottom: i < upcomingSessions.length - 1 ? '1px solid var(--line)' : 'none', background: i === 0 ? 'rgba(240,165,0,.04)' : 'transparent' }}>
                      <div style={{ width: 56, textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t4)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.08em' }}>{getDayName(s.date)}</div>
                        <div style={{ fontFamily: 'var(--fu)', fontSize: '.96rem', color: i === 0 ? 'var(--amber)' : '#fff', lineHeight: 1.1 }}>{fmtDate(s.date)}</div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)', marginTop: 2 }}>{s.time}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '.88rem', fontWeight: 600, color: '#fff', marginBottom: 3 }}>{s.topic}</div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)' }}>{s.direction || 'Все'} · Офлайн</div>
                      </div>
                      {i === 0 && (
                        <span style={{ background: 'rgba(240,165,0,.12)', color: 'var(--amber)', border: '1px solid rgba(240,165,0,.2)', borderRadius: 20, fontSize: '.58rem', fontWeight: 700, padding: '3px 10px', fontFamily: 'var(--fm)' }}>
                          Следующее
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* ── PAYMENT ── */}
          {tab === 'payment' && (
            <>
              <div className="lk-page-title">Оплата</div>
              <div className="lk-page-sub">История платежей и оплата абонемента</div>
              {paymentError && (
                <div style={{ display: 'flex', gap: 10, background: 'rgba(230,57,70,.08)', border: '1px solid rgba(230,57,70,.18)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: 'var(--scarlet)', fontSize: '.82rem' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />{paymentError}
                </div>
              )}
              <div className="lk-card" style={{ marginBottom: 16 }}>
                <div className="lk-card-title">Оплатить абонемент</div>
                <p style={{ fontSize: '.84rem', color: 'var(--t3)', marginBottom: 16, lineHeight: 1.6 }}>
                  Оплата через ЮMoney. После успешной оплаты статус обновится автоматически.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    { amount: pricing.kids, label: 'Дети' },
                    { amount: pricing.teens, label: 'Подростки' },
                    { amount: pricing.adults, label: 'Взрослые' },
                    { amount: pricing.cyber, label: 'Кибербез.' },
                  ].map(({ amount, label }) => (
                    <button key={amount} className="btn btn-outline btn-sm"
                      onClick={async () => {
                        setPaymentError('');
                        try {
                          const res = await fetch(`${apiBase}/api/payments`, {
                            method: 'POST', credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ amount, description: `Абонемент Нейро 32 — ${label} — ${amount} ₽` }),
                          });
                          const data = await res.json() as { redirectUrl?: string; error?: string };
                          if (data.redirectUrl) {
                            analytics.paymentInitiated(amount);
                            window.location.href = data.redirectUrl;
                          } else {
                            setPaymentError(data.error ?? 'Ошибка при создании платежа');
                          }
                        } catch { setPaymentError('Ошибка сети. Попробуйте позже.'); }
                      }}
                    >
                      <CreditCard size={14} />{label} — {amount.toLocaleString('ru-RU')} ₽
                    </button>
                  ))}
                </div>
              </div>
              <div className="lk-card">
                <div className="lk-card-title">История платежей</div>
                {paymentsLoading ? (
                  <div style={{ color: 'var(--t3)', fontSize: '.82rem' }}>Загрузка...</div>
                ) : payments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--t3)', fontSize: '.84rem' }}>
                    История платежей появится после первой оплаты.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {payments.map((p, idx) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < payments.length - 1 ? '1px solid var(--line)' : 'none' }}>
                        <div>
                          <div style={{ fontSize: '.86rem', color: '#fff', marginBottom: 3 }}>{p.description}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)' }}>
                            {new Date(p.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontFamily: 'var(--fu)', fontSize: '.82rem', color: '#fff' }}>{p.amount.toLocaleString('ru-RU')} ₽</span>
                          <span className={`chip ${p.status === 'succeeded' ? 'ch-green' : p.status === 'failed' ? 'ch-red' : 'ch-dim'}`} style={{ fontSize: '.58rem' }}>
                            {p.status === 'succeeded' ? 'Оплачено' : p.status === 'failed' ? 'Ошибка' : 'Ожидает'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(45,158,107,.05)', border: '1px solid rgba(45,158,107,.12)', borderRadius: 10, fontSize: '.82rem', color: 'var(--t2)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: 1 }} />
                <span>Самозанятый, чек через «Мой налог». По вопросам: <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--amber)' }}>@DSM1322</a></span>
              </div>
            </>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <>
              <div className="lk-page-title">Мой профиль</div>
              <div className="lk-page-sub">Обновите данные и поставьте цели</div>
              {saved && (
                <div style={{ display: 'flex', gap: 8, background: 'rgba(45,158,107,.08)', border: '1px solid rgba(45,158,107,.2)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, color: 'var(--emerald)', fontSize: '.82rem' }}>
                  <CheckCircle2 size={16} />Сохранено
                </div>
              )}
              <div className="lk-card">
                {/* Avatar + initials */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(240,165,0,.12)', border: '2px solid rgba(240,165,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fu)', fontSize: '1.4rem', color: 'var(--amber)' }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{user.name}</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--t4)', marginTop: 3 }}>{user.email}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <span className="chip ch-amber" style={{ fontSize: '.58rem' }}>{user.direction || 'Взрослые 18+'}</span>
                      <span className="chip ch-green" style={{ fontSize: '.58rem' }}>Активный</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Имя</label>
                      <input className="form-inp" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} autoComplete="name" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Email</label>
                      <input className="form-inp" type="email" inputMode="email" value={user.email} disabled style={{ opacity: .5 }} autoComplete="email" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Телефон</label>
                      <input className="form-inp" type="tel" inputMode="tel" value={user.phone || ''} disabled style={{ opacity: .5 }} placeholder="+7 900 000-00-00" autoComplete="tel" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Telegram</label>
                      <input className="form-inp" value={profile.telegram} onChange={e => setProfile(p => ({ ...p, telegram: e.target.value }))} placeholder="@username" autoComplete="off" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Ваши цели</label>
                    <textarea className="form-ta" value={profile.goals} onChange={e => setProfile(p => ({ ...p, goals: e.target.value }))} placeholder="Что хотите освоить?" style={{ minHeight: 80 }} />
                  </div>
                  <button type="submit" className="btn btn-amber" style={{ alignSelf: 'flex-start' }} disabled={saving}>
                    {saving ? 'Сохраняю…' : 'Сохранить →'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div className="lk-page-title" style={{ marginBottom: 0 }}>Уведомления</div>
                {unreadCount > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Все прочитаны</button>
                )}
              </div>
              <div className="lk-page-sub">Новости и обновления вашего обучения</div>
              {notifLoading ? (
                <LoadingState title="Загружаем уведомления…" />
              ) : notifications.length === 0 ? (
                <EmptyState
                  icon={<Bell size={20} />}
                  title="Уведомлений пока нет"
                  description="Здесь появятся новости об оплатах, записях на занятия и обновлениях программы."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {notifications.map(n => {
                    const colorMap: Record<string, string> = { info: 'var(--cobalt)', success: 'var(--emerald)', tip: 'var(--amber)', warning: 'var(--scarlet)' };
                    const c = colorMap[n.type] ?? colorMap.info;
                    const timeAgo = (() => {
                      const diff = Date.now() - new Date(n.createdAt).getTime();
                      const mins = Math.floor(diff / 60000);
                      if (mins < 60) return `${mins} мин назад`;
                      const hrs = Math.floor(mins / 60);
                      if (hrs < 24) return `${hrs} ч назад`;
                      return `${Math.floor(hrs / 24)} дн назад`;
                    })();
                    return (
                      <div key={n.id} onClick={() => markRead(n.id)}
                        style={{ display: 'flex', gap: 14, padding: '14px 18px', background: n.read ? 'rgba(14,14,26,.82)' : 'rgba(240,165,0,.03)', border: `1px solid ${n.read ? 'rgba(255,255,255,.065)' : 'rgba(240,165,0,.15)'}`, borderRadius: 14, cursor: 'pointer', transition: 'all .2s' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `color-mix(in srgb, ${c} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 25%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bell size={16} style={{ color: c }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <div style={{ fontSize: '.88rem', fontWeight: n.read ? 500 : 700, color: '#fff' }}>{n.title}</div>
                            {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />}
                          </div>
                          <div style={{ fontSize: '.82rem', color: 'var(--t3)', lineHeight: 1.55, marginBottom: 4 }}>{n.body}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)' }}>{timeAgo}</div>
                        </div>
                      </div>
                    );
                  })}
                  {notifHasMore && (
                    <button
                      onClick={loadMoreNotifications}
                      disabled={notifLoadingMore}
                      className="btn btn-outline btn-sm"
                      style={{ alignSelf: 'center', minWidth: 200, justifyContent: 'center', marginTop: 8 }}
                    >
                      {notifLoadingMore ? 'Загружаю…' : `Показать ещё ${NOTIF_PAGE}`}
                    </button>
                  )}
                  {!notifHasMore && notifications.length > NOTIF_PAGE && (
                    <div style={{ textAlign: 'center', marginTop: 8, fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)', letterSpacing: '.08em' }}>
                      Это все уведомления
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <>
              <div className="lk-page-title">Безопасность</div>
              <div className="lk-page-sub">Управление паролем и активными сессиями</div>
              <div className="lk-card" style={{ marginBottom: 16 }}>
                <div className="lk-card-title">Смена пароля</div>
                {pwError && (
                  <div style={{ display: 'flex', gap: 8, background: 'rgba(230,57,70,.08)', border: '1px solid rgba(230,57,70,.18)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: 'var(--scarlet)', fontSize: '.82rem' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />{pwError}
                  </div>
                )}
                {pwSaved && (
                  <div style={{ display: 'flex', gap: 8, background: 'rgba(45,158,107,.08)', border: '1px solid rgba(45,158,107,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: 'var(--emerald)', fontSize: '.82rem' }}>
                    <CheckCircle2 size={15} />Пароль изменён
                  </div>
                )}
                <form onSubmit={savePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Текущий пароль', key: 'current' as const, autoComplete: 'current-password' },
                    { label: 'Новый пароль', key: 'next' as const, autoComplete: 'new-password' },
                    { label: 'Повторите новый', key: 'confirm' as const, autoComplete: 'new-password' },
                  ].map(f => (
                    <div key={f.key} className="form-field">
                      <label className="form-label">{f.label}</label>
                      <input className="form-inp" type="password" autoComplete={f.autoComplete} value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <button type="submit" className="btn btn-amber" style={{ alignSelf: 'flex-start' }} disabled={pwSaving}>
                    {pwSaving ? 'Сохраняю…' : 'Изменить пароль →'}
                  </button>
                </form>
              </div>
              <div className="lk-card">
                <div className="lk-card-title">Активные сессии</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line)', marginBottom: 18 }}>
                  <div>
                    <div style={{ fontSize: '.86rem', color: '#fff', marginBottom: 2 }}>Текущий браузер</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)' }}>Сейчас активна</div>
                  </div>
                  <span className="chip ch-green" style={{ fontSize: '.6rem' }}>Текущая</span>
                </div>
                <button className="btn btn-danger btn-sm" onClick={revokeAllSessions} disabled={revoking} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LogOut size={14} />{revoking ? 'Выход...' : 'Выйти со всех устройств'}
                </button>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)', marginTop: 8 }}>
                  Завершит все активные сессии. Потребуется повторный вход.
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM TABS */}
      <nav className="lk-mobile-tabs">
        {NAV_ITEMS.slice(0, 5).map(({ key, Icon, label }) => (
          <button
            key={key}
            className={`lk-mobile-tab${tab === key ? ' lk-active' : ''}`}
            onClick={() => setTab(key)}
          >
            <Icon size={20} />
            <span>{label}</span>
            {key === 'notifications' && unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 8, width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)' }} />
            )}
          </button>
        ))}
      </nav>
    </>
  );
}
