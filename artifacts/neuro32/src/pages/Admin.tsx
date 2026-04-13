import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { store, ClassSession } from '../lib/store';

type Tab = 'stats' | 'requests' | 'users' | 'prices' | 'analytics' | 'content' | 'marketing' | 'schedule' | 'groups' | 'business';

const PRICES_INIT = [
  { dir: 'Дети 7–12 лет', price: '5 500', per: 'мес' },
  { dir: 'Подростки 13–17', price: '7 000', per: 'мес' },
  { dir: 'Взрослые 18+', price: '8 500', per: 'мес' },
  { dir: 'Кибербезопасность', price: '11 000', per: 'мес' },
  { dir: 'Пробное занятие', price: '500', per: 'раз' },
];

const REVENUE_DATA = [
  { month: 'Янв', revenue: 34000, students: 4 },
  { month: 'Фев', revenue: 42500, students: 5 },
  { month: 'Мар', revenue: 51000, students: 6 },
  { month: 'Апр', revenue: 68000, students: 8 },
  { month: 'Май', revenue: 85000, students: 10 },
];

const REGISTRATIONS_BY_DAY = [
  { day: '25 апр', reg: 1 },
  { day: '26 апр', reg: 0 },
  { day: '27 апр', reg: 2 },
  { day: '28 апр', reg: 1 },
  { day: '29 апр', reg: 3 },
  { day: '30 апр', reg: 1 },
  { day: '4 мая', reg: 2 },
];

const REQUESTS_BY_DIR = [
  { dir: 'Дети 7–12', requests: 7 },
  { dir: 'Подростки', requests: 5 },
  { dir: 'Взрослые', requests: 9 },
  { dir: 'Кибер', requests: 4 },
];

const CONVERSION_DATA = [
  { month: 'Фев', leads: 12, enrolled: 5, pct: 42 },
  { month: 'Мар', leads: 18, enrolled: 6, pct: 33 },
  { month: 'Апр', leads: 24, enrolled: 8, pct: 33 },
  { month: 'Май', leads: 31, enrolled: 10, pct: 32 },
];

const REQUESTS_BY_DIR_PIE = [
  { name: 'Взрослые', value: 4, color: '#f0a500' },
  { name: 'Дети', value: 3, color: '#2d9e6b' },
  { name: 'Подростки', value: 2, color: '#4a7cff' },
  { name: 'КиберЗащита', value: 1, color: '#e63946' },
];

const TOOLTIP_STYLE = {
  background: '#16162a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10,
  fontFamily: 'var(--fm)', fontSize: '.72rem', color: '#fff', padding: '8px 12px',
};

const SMM_POSTS = [
  {
    platform: 'ВКонтакте',
    tag: 'Пост·образовательный',
    text: `🤖 Вы знаете, что ChatGPT может проанализировать ваш Excel за 2 минуты?\n\nНа прошлом занятии мы загрузили таблицу продаж за год — и за 90 секунд получили:\n✅ График роста по месяцам\n✅ Топ-5 продуктов\n✅ Прогноз на следующий квартал\n\nБез знания Excel. Без Python. Просто вопрос на русском языке.\n\n🎓 Нейро 32 · Офлайн-занятия в Новозыбкове\n📞 +7 (901) 976-98-10\n🔗 Пробное занятие — 500 ₽`,
  },
  {
    platform: 'Telegram',
    tag: 'Канал·результат',
    text: `Ученица Марина пришла на занятие с одной задачей: написать продающее письмо клиентам.\n\nЗа 60 минут мы:\n1. Прописали портрет клиента через ChatGPT\n2. Создали 3 варианта письма\n3. A/B тест — выбрали лучшее\n4. Настроили Make.com на автоотправку\n\nВ понедельник — 7 ответов от клиентов. Раньше это занимало 3 часа вручную.\n\n📍 Новозыбков · Коммунистическая, 22А\n🔔 Следующий старт — 4 мая`,
  },
  {
    platform: 'ВКонтакте',
    tag: 'Пост·дети',
    text: `Вчера 9-летний Артём сделал свой первый мультфильм 🎬\n\n1. Придумал историю вместе с ГигаЧатом\n2. Нарисовал персонажей в Шедевруме\n3. Озвучил в ElevenLabs своим голосом\n4. Собрал видео в Kling AI\n\nОбщее время: 90 минут. Результат — мультфильм, который он показывает маме каждый день.\n\n🎓 Нейро 32 для детей 7–12 лет\n💰 5 500 ₽/мес · Записать ребёнка: +7 (901) 976-98-10`,
  },
  {
    platform: 'WhatsApp/SMS',
    tag: 'Рассылка·набор',
    text: `Здравствуйте! Это Степан из Нейро 32.\n\nОткрылся новый набор на май 2026. Осталось 3 места.\n\nЕсли вы (или ваш ребёнок) хотели попробовать ИИ-инструменты — сейчас хороший момент.\n\nПробное занятие — 500 ₽. Засчитывается в абонемент.\n\nОтвечу на любой вопрос: @DSM1322`,
  },
];

const CONTENT_BLOCKS = [
  { key: 'hero_badge', label: 'Бейдж в герое', value: 'Набор открыт · 3 места · Старт 4 мая 2026' },
  { key: 'trial_price', label: 'Цена пробного', value: '500 ₽' },
  { key: 'next_start', label: 'Дата старта', value: '4 мая 2026' },
  { key: 'slots_left', label: 'Свободных мест', value: '3' },
  { key: 'address', label: 'Адрес', value: 'ул. Коммунистическая, 22А' },
  { key: 'phone', label: 'Телефон', value: '+7 (901) 976-98-10' },
];

const GROUPS = [
  { key: 'Дети', label: 'ИИ для детей 7–12', color: '#f0a500', emoji: '🧒' },
  { key: 'Подростки', label: 'ИИ для подростков 13–17', color: '#4a7cff', emoji: '👦' },
  { key: 'Взрослые', label: 'ИИ для взрослых 18+', color: '#2d9e6b', emoji: '👤' },
  { key: 'Кибербезопасность', label: 'Кибербезопасность', color: '#e63946', emoji: '🛡️' },
];

const DIRECTIONS: ClassSession['direction'][] = ['Дети', 'Подростки', 'Взрослые', 'Кибербезопасность'];

interface BusinessInquiry {
  id: string;
  createdAt: string;
  nameOrCompany: string;
  contact: string;
  taskDescription: string;
  format: 'only_neuro32' | 'educational_case' | 'any';
  consentPersonalData: boolean;
  consentEducationalCase: boolean;
}

const FORMAT_LABELS: Record<string, string> = {
  only_neuro32: 'Только Нейро 32',
  educational_case: 'Учебный кейс',
  any: 'Не важно',
};

const DIR_COLORS: Record<string, string> = {
  'Дети': '#f0a500',
  'Подростки': '#4a7cff',
  'Взрослые': '#2d9e6b',
  'Кибербезопасность': '#e63946',
};

function formatDate(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

export default function Admin() {
  const [, navigate] = useLocation();
  const user = store.getCurrentUser();
  const [tab, setTab] = useState<Tab>('stats');
  const [requests, setRequests] = useState(store.getRequests());
  const [prices, setPrices] = useState(PRICES_INIT);
  const [pricesSaved, setPricesSaved] = useState(false);
  const [contentBlocks, setContentBlocks] = useState(CONTENT_BLOCKS);
  const [contentSaved, setContentSaved] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [users, setUsers] = useState(store.getUsers());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const aiMsgs = store.getAIMessages();

  // Schedule state
  const [classSessions, setClassSessions] = useState(store.getClassSessions());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState<Omit<ClassSession, 'id'>>({ date: '', time: '16:00', direction: 'Дети', topic: '' });
  const [scheduleFilter, setScheduleFilter] = useState<string>('all');

  // Groups state
  const [groupMax, setGroupMaxState] = useState(store.getGroupMax());

  // Business inquiries from API
  const [businessInquiries, setBusinessInquiries] = useState<BusinessInquiry[]>([]);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizError, setBizError] = useState('');

  const fetchBusinessInquiries = async () => {
    setBizLoading(true);
    setBizError('');
    try {
      const res = await fetch('/api/business-inquiry');
      const data = await res.json() as { ok: boolean; data?: BusinessInquiry[]; error?: string };
      if (data.ok && data.data) {
        setBusinessInquiries(data.data);
      } else {
        setBizError(data.error || 'Ошибка загрузки');
      }
    } catch {
      setBizError('Не удалось загрузить заявки');
    } finally {
      setBizLoading(false);
    }
  };

  const deleteBusinessInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/business-inquiry/${id}`, { method: 'DELETE' });
      const data = await res.json() as { ok: boolean };
      if (data.ok) {
        setBusinessInquiries(prev => prev.filter(i => i.id !== id));
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (tab === 'business') {
      fetchBusinessInquiries();
    }
  }, [tab]);

  if (!user || user.role !== 'admin') {
    navigate('/auth');
    return null;
  }

  const logout = () => { store.logout(); navigate('/'); };

  const updateStatus = (id: string, status: 'new' | 'processed' | 'declined') => {
    store.updateRequestStatus(id, status);
    setRequests(store.getRequests());
  };

  const savePrices = () => { setPricesSaved(true); setTimeout(() => setPricesSaved(false), 2000); };
  const saveContent = () => { setContentSaved(true); setTimeout(() => setContentSaved(false), 2000); };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleDeleteUser = (id: string) => {
    store.deleteUser(id);
    setUsers(store.getUsers());
    setDeleteConfirm(null);
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.date || !newSession.time || !newSession.topic) return;
    store.addClassSession(newSession);
    setClassSessions(store.getClassSessions());
    setNewSession({ date: '', time: '16:00', direction: 'Дети', topic: '' });
    setShowAddForm(false);
  };

  const handleDeleteSession = (id: string) => {
    store.deleteClassSession(id);
    setClassSessions(store.getClassSessions());
  };

  const handleUpdateUserGroup = (userId: string, direction: string) => {
    store.updateUserGroup(userId, direction);
    setUsers(store.getUsers());
  };

  const filteredSessions = scheduleFilter === 'all'
    ? classSessions
    : classSessions.filter(s => s.direction === scheduleFilter);

  const navItems: Array<{ key: Tab; icon: string; label: string }> = [
    { key: 'stats', icon: '📊', label: 'Статистика' },
    { key: 'analytics', icon: '📈', label: 'Аналитика' },
    { key: 'schedule', icon: '📅', label: 'Расписание' },
    { key: 'groups', icon: '🏫', label: 'Группы' },
    { key: 'business', icon: '🏢', label: `Бизнес${businessInquiries.length > 0 ? ` (${businessInquiries.length})` : ''}` },
    { key: 'requests', icon: '📩', label: `Заявки (${requests.filter(r => r.status === 'new' && !r.isBusinessInquiry).length})` },
    { key: 'users', icon: '👥', label: 'Пользователи' },
    { key: 'prices', icon: '💰', label: 'Цены' },
    { key: 'content', icon: '✏️', label: 'Контент' },
    { key: 'marketing', icon: '📣', label: 'Маркетинг' },
  ];

  return (
    <div>
      <div className="admin-layout">
        <div className="admin-side">
          <div style={{ padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--fu)', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 4 }}>НЕЙРО 32</div>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)' }}>Панель администратора</div>
          </div>
          {navItems.map(item => (
            <button key={item.key} className={`admin-ni${tab === item.key ? ' alk' : ''}`} onClick={() => setTab(item.key)}>
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--line)', margin: '12px 0' }} />
          <button className="admin-ni" onClick={() => navigate('/')}>🏠 На сайт</button>
          <button className="admin-ni" onClick={logout} style={{ color: 'var(--scarlet)' }}>🚪 Выйти</button>
        </div>

        <div className="admin-content">

          {/* STATS */}
          {tab === 'stats' && (
            <>
              <div className="admin-h">Статистика</div>
              <div className="astat-grid">
                {[
                  { n: requests.filter(r => !r.isBusinessInquiry).length.toString(), l: 'Частных заявок', accent: false },
                  { n: requests.filter(r => r.status === 'new' && !r.isBusinessInquiry).length.toString(), l: 'Новых заявок', accent: true },
                  { n: users.filter(u => u.role === 'user').length.toString(), l: 'Учеников', accent: false },
                  { n: aiMsgs.toString(), l: 'Сообщений Нейре', accent: false },
                ].map((s, i) => (
                  <div key={i} className="astat">
                    <div className="astat-n" style={{ color: s.accent ? 'var(--amber)' : '#fff' }}>{s.n}</div>
                    <div className="astat-l">{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {[
                  { l: 'Направление', r: 'Дети (3) · Взрослые (2) · Подростки (1)' },
                  { l: 'Выручка (демо)', r: '85 000 ₽ / мес (10 учеников)' },
                  { l: 'Следующий набор', r: '4 мая 2026 · 3 места свободно' },
                  { l: 'Площадка', r: 'ул. Коммунистическая, 22А · 4 ПК' },
                ].map((it, i) => (
                  <div key={i} className="astat" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="astat-l" style={{ fontSize: '.66rem' }}>{it.l}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--t2)', textAlign: 'right' }}>{it.r}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '18px 22px', background: 'rgba(240,165,0,.05)', border: '1px solid rgba(240,165,0,.12)', borderRadius: 13 }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Быстрые действия</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-sm">Открыть Telegram</a>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab('requests')}>Просмотреть заявки</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab('schedule')}>Расписание →</button>
                </div>
              </div>
            </>
          )}

          {/* ANALYTICS */}
          {tab === 'analytics' && (
            <>
              <div className="admin-h">Аналитика</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
                {[
                  { label: 'Выручка (май)', value: '85 000 ₽', delta: '+25%', up: true },
                  { label: 'Учеников', value: '10', delta: '+2 за мес', up: true },
                  { label: 'Конверсия', value: '32%', delta: '−1%', up: false },
                  { label: 'Заявок (май)', value: '31', delta: '+7', up: true },
                ].map((kpi, i) => (
                  <div key={i} className="astat" style={{ padding: 18 }}>
                    <div className="astat-l" style={{ marginBottom: 6 }}>{kpi.label}</div>
                    <div className="astat-n" style={{ marginBottom: 4 }}>{kpi.value}</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: kpi.up ? 'var(--emerald)' : 'var(--scarlet)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {kpi.up ? '↑' : '↓'} {kpi.delta}
                    </div>
                  </div>
                ))}
              </div>

              <div className="astat" style={{ marginBottom: 16, padding: '22px' }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.66rem', fontWeight: 700, letterSpacing: '.08em', color: '#fff', marginBottom: 2 }}>ЕЖЕМЕСЯЧНАЯ ВЫРУЧКА</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)', marginBottom: 18 }}>Рост за 5 месяцев 2026 · руб.</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={REVENUE_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v.toLocaleString('ru')} ₽`, 'Выручка']} />
                    <Bar dataKey="revenue" fill="#f0a500" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="astat" style={{ padding: '22px' }}>
                  <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', fontWeight: 700, color: '#fff', marginBottom: 2 }}>РЕГИСТРАЦИИ ПО ДНЯМ</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t4)', marginBottom: 16 }}>Последние 7 дней</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={REGISTRATIONS_BY_DAY} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 8 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v, 'Регистраций']} />
                      <Line type="monotone" dataKey="reg" stroke="#f0a500" strokeWidth={2} dot={{ fill: '#f0a500', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="astat" style={{ padding: '22px' }}>
                  <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', fontWeight: 700, color: '#fff', marginBottom: 2 }}>ЗАЯВКИ ПО НАПРАВЛЕНИЯМ</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t4)', marginBottom: 16 }}>Май 2026</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={REQUESTS_BY_DIR} cx="50%" cy="50%" innerRadius={36} outerRadius={56} dataKey="requests" nameKey="dir" paddingAngle={3}>
                        {REQUESTS_BY_DIR.map((_, idx) => (
                          <Cell key={idx} fill={['#4a7cff','#f0a500','#2d9e6b','#c5614a'][idx % 4]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => [v, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {REQUESTS_BY_DIR.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t3)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ['#4a7cff','#f0a500','#2d9e6b','#c5614a'][idx % 4], flexShrink: 0 }} />
                        {item.dir}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="astat" style={{ padding: '22px' }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', fontWeight: 700, color: '#fff', marginBottom: 2 }}>КОНВЕРСИЯ ЗАЯВКИ → ЗАПИСЬ</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', color: 'var(--t4)', marginBottom: 16 }}>Лиды vs Записавшихся · % конверсии</div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={CONVERSION_DATA} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="leads" stroke="#4a7cff" strokeWidth={2} name="Лидов" dot={{ fill: '#4a7cff', r: 3 }} />
                    <Line type="monotone" dataKey="enrolled" stroke="#2d9e6b" strokeWidth={2} name="Записалось" dot={{ fill: '#2d9e6b', r: 3 }} />
                    <Line type="monotone" dataKey="pct" stroke="#f0a500" strokeWidth={2} strokeDasharray="5 3" name="Конверсия %" dot={{ fill: '#f0a500', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                  {[{ c: '#4a7cff', l: 'Лидов' }, { c: '#2d9e6b', l: 'Записалось' }, { c: '#f0a500', l: 'Конверсия %' }].map((leg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t3)' }}>
                      <div style={{ width: 16, height: 2, background: leg.c, borderRadius: 1 }} />
                      {leg.l}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SCHEDULE */}
          {tab === 'schedule' && (
            <>
              <div className="admin-h">Расписание занятий</div>

              {/* Filter + Add button row */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['all', ...DIRECTIONS].map(d => (
                    <button
                      key={d}
                      onClick={() => setScheduleFilter(d)}
                      style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: '.7rem', fontFamily: 'var(--fm)', cursor: 'pointer', border: 'none',
                        background: scheduleFilter === d ? (d === 'all' ? 'var(--amber)' : DIR_COLORS[d]) : 'rgba(255,255,255,.06)',
                        color: scheduleFilter === d ? (d === 'all' ? '#000' : '#fff') : 'var(--t3)',
                        transition: 'all .15s',
                      }}
                    >
                      {d === 'all' ? 'Все' : d}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-amber btn-sm"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => setShowAddForm(v => !v)}
                >
                  {showAddForm ? '✕ Отмена' : '+ Добавить занятие'}
                </button>
              </div>

              {/* Add session form */}
              {showAddForm && (
                <form onSubmit={handleAddSession} style={{ background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.2)', borderRadius: 14, padding: '20px 22px', marginBottom: 20 }}>
                  <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', letterSpacing: '.08em', color: 'var(--amber)', marginBottom: 14 }}>НОВОЕ ЗАНЯТИЕ</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: 12, alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Дата</label>
                      <input type="date" value={newSession.date} onChange={e => setNewSession(s => ({ ...s, date: e.target.value }))}
                        required style={{ width: '100%', background: 'rgba(255,255,255,.06)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '9px 12px', fontFamily: 'var(--fm)', fontSize: '.82rem', color: '#fff', outline: 'none', colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Время</label>
                      <input type="time" value={newSession.time} onChange={e => setNewSession(s => ({ ...s, time: e.target.value }))}
                        required style={{ width: '100%', background: 'rgba(255,255,255,.06)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '9px 12px', fontFamily: 'var(--fm)', fontSize: '.82rem', color: '#fff', outline: 'none', colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Направление</label>
                      <select value={newSession.direction} onChange={e => setNewSession(s => ({ ...s, direction: e.target.value as ClassSession['direction'] }))}
                        style={{ width: '100%', background: 'rgba(255,255,255,.06)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '9px 12px', fontFamily: 'var(--fm)', fontSize: '.82rem', color: '#fff', outline: 'none' }}>
                        {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Тема занятия</label>
                      <input type="text" value={newSession.topic} onChange={e => setNewSession(s => ({ ...s, topic: e.target.value }))} placeholder="Например: Автоматизация в Make.com"
                        required style={{ width: '100%', background: 'rgba(255,255,255,.06)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '9px 12px', fontFamily: 'var(--fb)', fontSize: '.82rem', color: '#fff', outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button type="submit" className="btn btn-amber btn-sm">Сохранить занятие →</button>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)' }}>Место: ул. Коммунистическая, 22А</span>
                  </div>
                </form>
              )}

              {/* Sessions table */}
              {filteredSessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--t4)', fontFamily: 'var(--fm)', fontSize: '.84rem', background: 'rgba(255,255,255,.02)', borderRadius: 14, border: '1px dashed var(--line)' }}>
                  {scheduleFilter === 'all' ? 'Занятий пока нет. Добавьте первое занятие.' : `Нет занятий по направлению «${scheduleFilter}».`}
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Время</th>
                        <th>Направление</th>
                        <th>Тема</th>
                        <th>Место</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const rows: React.ReactNode[] = [];
                        let lastDate = '';
                        filteredSessions.forEach(s => {
                          if (s.date !== lastDate) {
                            lastDate = s.date;
                            rows.push(
                              <tr key={`hd-${s.date}`}>
                                <td colSpan={5} style={{ padding: '10px 14px 6px', background: 'rgba(240,165,0,.06)', borderBottom: '1px solid rgba(240,165,0,.15)', fontFamily: 'var(--fu)', fontSize: '.62rem', color: 'var(--amber)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                                  📅 {formatDate(s.date)}
                                </td>
                              </tr>
                            );
                          }
                          rows.push(
                            <tr key={s.id}>
                              <td style={{ fontFamily: 'var(--fm)', fontSize: '.78rem', color: '#fff', fontWeight: 600 }}>{s.time}</td>
                              <td>
                                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.62rem', fontFamily: 'var(--fm)', background: `${DIR_COLORS[s.direction]}22`, color: DIR_COLORS[s.direction], border: `1px solid ${DIR_COLORS[s.direction]}44` }}>
                                  {s.direction}
                                </span>
                              </td>
                              <td style={{ fontSize: '.84rem', color: '#fff', maxWidth: 240 }}>{s.topic}</td>
                              <td style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--t4)' }}>Коммунистическая, 22А</td>
                              <td>
                                <button
                                  onClick={() => handleDeleteSession(s.id)}
                                  style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.25)', color: '#f87171', borderRadius: 7, padding: '4px 10px', fontSize: '.62rem', cursor: 'pointer' }}
                                >Удалить</button>
                              </td>
                            </tr>
                          );
                        });
                        return rows;
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* GROUPS */}
          {tab === 'groups' && (
            <>
              <div className="admin-h">Группы учеников</div>

              {/* Capacity setting */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '12px 18px', background: 'rgba(255,255,255,.03)', border: '1px solid var(--line)', borderRadius: 12 }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.78rem', color: 'var(--t3)' }}>Максимум мест в группе:</div>
                <input
                  type="number" min={1} max={30} value={groupMax}
                  onChange={e => {
                    const v = Math.max(1, Math.min(30, Number(e.target.value)));
                    setGroupMaxState(v);
                    store.setGroupMax(v);
                  }}
                  style={{ width: 72, background: 'rgba(255,255,255,.06)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '7px 10px', fontFamily: 'var(--fu)', fontSize: '.9rem', color: '#fff', outline: 'none', textAlign: 'center' }}
                />
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--t4)' }}>Сохраняется автоматически</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {GROUPS.map(group => {
                  const members = users.filter(u => u.role === 'user' && (u.direction === group.key || u.direction.startsWith(group.key)));
                  const pct = Math.round((members.length / groupMax) * 100);
                  return (
                    <div key={group.key} style={{ background: 'var(--card)', border: `1px solid ${group.color}22`, borderRadius: 16, overflow: 'hidden' }}>
                      {/* Group header */}
                      <div style={{ padding: '16px 20px', background: `${group.color}0d`, borderBottom: `1px solid ${group.color}22`, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: '1.4rem' }}>{group.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--fu)', fontSize: '.72rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>{group.label}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', marginTop: 2 }}>{group.key}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--fu)', fontSize: '.9rem', fontWeight: 700, color: group.color }}>{members.length}/{groupMax}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.54rem', color: 'var(--t4)' }}>занято</div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 3, background: 'rgba(255,255,255,.06)' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: group.color, transition: 'width .4s', borderRadius: '0 2px 2px 0' }} />
                      </div>
                      {/* Members list */}
                      <div style={{ padding: '12px 0' }}>
                        {members.length === 0 ? (
                          <div style={{ padding: '16px 20px', fontFamily: 'var(--fm)', fontSize: '.76rem', color: 'var(--t4)', textAlign: 'center' }}>
                            Нет учеников
                          </div>
                        ) : (
                          members.map(u => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 20px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${group.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fu)', fontSize: '.7rem', color: group.color, flexShrink: 0 }}>
                                {u.name.charAt(0)}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: 'var(--fb)', fontSize: '.82rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)' }}>{u.email}</div>
                              </div>
                              <select
                                value={u.direction}
                                onChange={e => handleUpdateUserGroup(u.id, e.target.value)}
                                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--line)', borderRadius: 8, padding: '5px 8px', fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--t2)', outline: 'none', cursor: 'pointer', maxWidth: 130 }}
                              >
                                <option value="">— без группы —</option>
                                {GROUPS.map(g => <option key={g.key} value={g.key}>{g.key}</option>)}
                              </select>
                            </div>
                          ))
                        )}
                      </div>
                      {/* Footer */}
                      <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,.02)', borderTop: '1px solid var(--line)', fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Свободно: {groupMax - members.length} мест</span>
                        <span style={{ color: pct >= 100 ? '#f87171' : pct >= 75 ? 'var(--amber)' : 'var(--emerald)' }}>
                          {pct >= 100 ? '🔴 Группа заполнена' : pct >= 75 ? '🟡 Почти заполнена' : '🟢 Есть места'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unassigned students */}
              {(() => {
                const unassigned = users.filter(u => u.role === 'user' && !GROUPS.some(g => u.direction === g.key || u.direction.startsWith(g.key)));
                if (unassigned.length === 0) return null;
                return (
                  <div style={{ marginTop: 16, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--fu)', fontSize: '.64rem', color: 'var(--t3)', letterSpacing: '.06em' }}>
                      БЕЗ ГРУППЫ ({unassigned.length})
                    </div>
                    {unassigned.map(u => (
                      <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 20px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fu)', fontSize: '.66rem', color: 'var(--t3)', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--fb)', fontSize: '.82rem', color: '#fff' }}>{u.name}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--t4)' }}>{u.email} · {u.direction || 'направление не задано'}</div>
                        </div>
                        <select
                          value={u.direction}
                          onChange={e => handleUpdateUserGroup(u.id, e.target.value)}
                          style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--line)', borderRadius: 8, padding: '5px 8px', fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--t2)', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="">— без группы —</option>
                          {GROUPS.map(g => <option key={g.key} value={g.key}>{g.key}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}

          {/* BUSINESS INQUIRIES */}
          {tab === 'business' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                <div className="admin-h" style={{ marginBottom: 0 }}>Бизнес-заявки</div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={fetchBusinessInquiries}
                  disabled={bizLoading}
                  style={{ marginLeft: 'auto' }}
                >
                  {bizLoading ? 'Загрузка...' : '↻ Обновить'}
                </button>
              </div>
              <div style={{ marginBottom: 20, padding: '14px 18px', background: 'rgba(74,124,255,.06)', border: '1px solid rgba(74,124,255,.18)', borderRadius: 12, fontSize: '.84rem', color: 'var(--t2)', lineHeight: 1.6 }}>
                🏢 Заявки от компаний и ИП, поступившие через секцию «Нейро 32 для бизнеса» на главной странице.
              </div>

              {bizError && (
                <div style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontFamily: 'var(--fm)', fontSize: '.8rem', color: '#f87171' }}>
                  {bizError}
                </div>
              )}

              {!bizLoading && businessInquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--t4)', fontFamily: 'var(--fm)', fontSize: '.84rem', background: 'rgba(255,255,255,.02)', borderRadius: 14, border: '1px dashed var(--line)' }}>
                  Бизнес-заявок пока нет.<br />
                  <span style={{ fontSize: '.72rem', marginTop: 8, display: 'block' }}>Они появятся, когда кто-то заполнит форму в разделе «Нейро 32 для бизнеса» на главной странице.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {businessInquiries.map(inq => (
                    <div key={inq.id} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--fb)', fontSize: '.94rem', color: '#fff', fontWeight: 700, marginBottom: 2 }}>{inq.nameOrCompany}</div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--t4)' }}>{formatDate(inq.createdAt)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '.62rem', fontFamily: 'var(--fm)', background: 'rgba(74,124,255,.1)', color: '#4a7cff', border: '1px solid rgba(74,124,255,.25)', whiteSpace: 'nowrap' }}>
                            {FORMAT_LABELS[inq.format] || inq.format}
                          </span>
                          {inq.consentEducationalCase && (
                            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '.62rem', fontFamily: 'var(--fm)', background: 'rgba(240,165,0,.1)', color: 'var(--amber)', border: '1px solid rgba(240,165,0,.25)', whiteSpace: 'nowrap' }}>
                              ✓ Учебный кейс
                            </span>
                          )}
                          <button
                            onClick={() => deleteBusinessInquiry(inq.id)}
                            style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.25)', color: '#f87171', borderRadius: 8, padding: '5px 12px', fontSize: '.66rem', cursor: 'pointer', fontFamily: 'var(--fm)', whiteSpace: 'nowrap' }}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                        <div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Контакт</div>
                          <div style={{ fontSize: '.84rem', color: 'var(--t2)' }}>
                            {inq.contact.startsWith('@') ? (
                              <a href={`https://t.me/${inq.contact.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{inq.contact}</a>
                            ) : inq.contact.startsWith('+7') || inq.contact.startsWith('8') ? (
                              <a href={`tel:${inq.contact.replace(/\D/g,'')}`} style={{ color: '#34d399' }}>{inq.contact}</a>
                            ) : (
                              inq.contact
                            )}
                          </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Описание задачи</div>
                          <div style={{ fontSize: '.84rem', color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{inq.taskDescription}</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Согласия</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '.7rem', fontFamily: 'var(--fm)', color: inq.consentPersonalData ? '#34d399' : '#f87171' }}>
                              {inq.consentPersonalData ? '✓' : '✕'} ПДн
                            </span>
                            <span style={{ fontSize: '.7rem', fontFamily: 'var(--fm)', color: inq.consentEducationalCase ? '#34d399' : 'var(--t4)' }}>
                              {inq.consentEducationalCase ? '✓' : '—'} Учебный кейс
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* REQUESTS */}
          {tab === 'requests' && (
            <>
              <div className="admin-h">Заявки ({requests.filter(r => !r.isBusinessInquiry).length})</div>
              {requests.filter(r => !r.isBusinessInquiry).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--t4)', fontFamily: 'var(--fm)', fontSize: '.8rem' }}>
                  Заявок пока нет. Они появятся после заполнения формы на странице «Контакты».
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Дата</th><th>Имя</th><th>Телефон</th><th>Направление</th><th>Формат</th><th>Статус</th><th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.filter(r => !r.isBusinessInquiry).map(r => (
                        <tr key={r.id}>
                          <td style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--t4)', whiteSpace: 'nowrap' }}>{r.date}</td>
                          <td style={{ fontWeight: 600, color: '#fff' }}>{r.name}</td>
                          <td style={{ fontFamily: 'var(--fm)', fontSize: '.78rem' }}>{r.phone}</td>
                          <td><span className="chip ch-amber" style={{ fontSize: '.58rem' }}>{r.direction}</span></td>
                          <td style={{ fontSize: '.78rem' }}>{r.format}</td>
                          <td>
                            <span className={`sbdg ${r.status === 'new' ? 'sb-new' : r.status === 'processed' ? 'sb-ok' : 'sb-fr'}`}>
                              {r.status === 'new' ? 'Новая' : r.status === 'processed' ? 'Обработана' : 'Отклонена'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 5 }}>
                              <button className="btn btn-success btn-sm" style={{ padding: '4px 8px', fontSize: '.58rem' }} onClick={() => updateStatus(r.id, 'processed')}>✓</button>
                              <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px', fontSize: '.58rem' }} onClick={() => updateStatus(r.id, 'declined')}>✕</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <>
              <div className="admin-h">Пользователи ({users.length})</div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Имя</th><th>Email</th><th>Телефон</th><th>Роль</th><th>Направление</th><th>Регистрация</th><th></th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{u.name}</td>
                        <td style={{ fontFamily: 'var(--fm)', fontSize: '.74rem' }}>{u.email}</td>
                        <td style={{ fontFamily: 'var(--fm)', fontSize: '.74rem' }}>{u.phone || '—'}</td>
                        <td><span className={`chip ${u.role === 'admin' ? 'ch-amber' : 'ch-blue'}`}>{u.role === 'admin' ? 'Админ' : 'Ученик'}</span></td>
                        <td style={{ fontSize: '.78rem' }}>{u.direction || '—'}</td>
                        <td style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--t4)' }}>{u.registeredAt}</td>
                        <td>
                          {u.role !== 'admin' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.25)', color: '#f87171', padding: '4px 10px', fontSize: '.72rem' }}
                              onClick={() => setDeleteConfirm(u.id)}
                            >Удалить</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {deleteConfirm && (() => {
                const target = users.find(u => u.id === deleteConfirm);
                return (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                    onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 28, maxWidth: 420, width: '90%' }}>
                      <div style={{ fontFamily: 'var(--fu)', fontSize: '.9rem', color: '#fff', marginBottom: 10 }}>Удалить пользователя?</div>
                      <p style={{ color: 'var(--t3)', fontSize: '.84rem', marginBottom: 22 }}>
                        Вы собираетесь удалить <strong style={{ color: '#fff' }}>{target?.name}</strong> ({target?.email}). Это действие нельзя отменить.
                      </p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}>Отмена</button>
                        <button
                          className="btn btn-sm"
                          style={{ background: 'rgba(220,38,38,.15)', border: '1px solid rgba(220,38,38,.4)', color: '#f87171' }}
                          onClick={() => handleDeleteUser(deleteConfirm)}
                        >Удалить навсегда</button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* PRICES */}
          {tab === 'prices' && (
            <>
              <div className="admin-h">Редактор цен</div>
              {pricesSaved && <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, color: 'var(--emerald)', fontFamily: 'var(--fm)', fontSize: '.82rem' }}>✓ Цены сохранены (демо)</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {prices.map((p, i) => (
                  <div key={i} className="astat" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, fontWeight: 600, color: '#fff', fontSize: '.9rem' }}>{p.dir}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        value={p.price}
                        onChange={e => setPrices(ps => ps.map((pp, j) => j === i ? { ...pp, price: e.target.value } : pp))}
                        style={{ width: 100, background: 'rgba(255,255,255,.05)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--fu)', fontSize: '.9rem', color: '#fff', outline: 'none', textAlign: 'right' }}
                      />
                      <span style={{ color: 'var(--t4)', fontSize: '.84rem' }}>₽ / {p.per}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-amber" onClick={savePrices}>Сохранить цены →</button>
              <p style={{ marginTop: 12, fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--t4)' }}>
                Примечание: в этой демо-версии цены сохраняются только в памяти.
              </p>
            </>
          )}

          {/* CONTENT */}
          {tab === 'content' && (
            <>
              <div className="admin-h">Контент и настройки</div>
              {contentSaved && <div style={{ background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, color: 'var(--emerald)', fontFamily: 'var(--fm)', fontSize: '.82rem' }}>✓ Сохранено (демо)</div>}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--t4)', marginBottom: 14 }}>Ключевые тексты сайта</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {contentBlocks.map((block, i) => (
                    <div key={block.key} className="astat" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 160, flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{block.label}</div>
                      </div>
                      <input
                        value={block.value}
                        onChange={e => setContentBlocks(bs => bs.map((b, j) => j === i ? { ...b, value: e.target.value } : b))}
                        style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--fb)', fontSize: '.86rem', color: '#fff', outline: 'none' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-amber" onClick={saveContent}>Сохранить →</button>
              <div style={{ marginTop: 32, padding: '22px', background: 'rgba(255,255,255,.03)', border: '1px solid var(--line)', borderRadius: 14 }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--t4)', marginBottom: 14 }}>SEO и мета</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { l: 'Title страницы', v: 'Нейро 32 — Офлайн-курсы ИИ в Новозыбкове' },
                    { l: 'Description', v: 'Офлайн-школа ИИ в Новозыбкове. 4 направления. Пробное 500 ₽.' },
                    { l: 'Keywords', v: 'курсы ИИ Новозыбков, ИИ для детей, ChatGPT обучение' },
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 140, fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--t4)', paddingTop: 10, textTransform: 'uppercase', letterSpacing: '.06em', flexShrink: 0 }}>{f.l}</div>
                      <input defaultValue={f.v} style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1.5px solid var(--line)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--fb)', fontSize: '.84rem', color: '#fff', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* MARKETING */}
          {tab === 'marketing' && (
            <>
              <div className="admin-h">SMM-тексты</div>
              <div style={{ marginBottom: 22, padding: '14px 18px', background: 'rgba(240,165,0,.05)', border: '1px solid rgba(240,165,0,.12)', borderRadius: 12, fontSize: '.84rem', color: 'var(--t2)', lineHeight: 1.7 }}>
                📣 Готовые тексты для публикаций. Скопируйте и адаптируйте под свою аудиторию. Рекомендуется публиковать 3–4 поста в неделю.
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, padding: '16px 20px', background: 'rgba(74,124,255,.05)', border: '1px solid rgba(74,124,255,.15)', borderRadius: 14, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'var(--fu)', fontSize: '.64rem', fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 5 }}>🖼 SMM-баннер 1080×1080</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--t3)' }}>Готовый баннер для ВКонтакте, Telegram и Instagram. Откройте ссылку, сделайте скриншот на 1080×1080px.</div>
                </div>
                <a
                  href="/__mockup/ads/neuro32-smm-1080.html"
                  target="_blank" rel="noopener"
                  className="btn btn-ghost btn-sm"
                  style={{ whiteSpace: 'nowrap', fontSize: '.62rem', textDecoration: 'none' }}
                >Открыть баннер →</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {SMM_POSTS.map((post, i) => (
                  <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,.03)', borderBottom: '1px solid var(--line)' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span className="chip ch-amber" style={{ fontSize: '.56rem' }}>{post.platform}</span>
                        <span className="chip ch-dim" style={{ fontSize: '.56rem' }}>{post.tag}</span>
                      </div>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '5px 12px', fontSize: '.58rem' }} onClick={() => copyText(post.text, i)}>
                        {copiedIdx === i ? '✓ Скопировано' : 'Копировать'}
                      </button>
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <pre style={{ fontFamily: 'var(--fb)', fontSize: '.84rem', color: 'var(--t2)', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{post.text}</pre>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 28 }}>
                <div className="admin-h" style={{ marginBottom: 16 }}>Рекламные крючки (hooks)</div>
                <div style={{ marginBottom: 14, fontSize: '.82rem', color: 'var(--t3)' }}>Готовые заголовки для рекламных постов, таргета и рассылок. Скопируйте и используйте как основу.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    {
                      tag: 'Боль → решение', platform: 'ВКонтакте · Telegram',
                      hook: 'ChatGPT все используют, а вы ещё не умеете с ним работать эффективно?',
                      body: 'Нейро 32 — это не курс. Это практика. Приходите и попробуйте — первый урок 500 ₽.',
                    },
                    {
                      tag: 'Срочность', platform: 'SMS · WhatsApp',
                      hook: '🔴 Осталось 3 места в группу. Набор закрывается 4 мая.',
                      body: 'Нейро 32 — офлайн-лаборатория ИИ-практик в Новозыбкове. Старт — 4 мая. Пробный урок: 500 ₽ → @DSM1322',
                    },
                    {
                      tag: 'Идентичность', platform: 'ВКонтакте · Instagram',
                      hook: 'Пока одни смотрят видео про ИИ — другие уже работают с ним.',
                      body: 'Нейро 32 — место, где подростки 13–17 лет осваивают нейросети на практике. Первый урок — 500 ₽. Старт 4 мая.',
                    },
                  ].map((h, i) => (
                    <div key={i} style={{ background: 'rgba(240,165,0,.04)', border: '1px solid rgba(240,165,0,.15)', borderRadius: 14, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(240,165,0,.1)' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span className="chip ch-amber" style={{ fontSize: '.54rem' }}>{h.tag}</span>
                          <span className="chip ch-dim" style={{ fontSize: '.54rem' }}>{h.platform}</span>
                        </div>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: '.56rem' }}
                          onClick={() => copyText(`${h.hook}\n\n${h.body}`, 100 + i)}>
                          {copiedIdx === 100 + i ? '✓ Скопировано' : 'Копировать'}
                        </button>
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: 'var(--fu)', fontSize: '.7rem', fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '.02em' }}>«{h.hook}»</div>
                        <div style={{ fontSize: '.82rem', color: 'var(--t3)', lineHeight: 1.6 }}>{h.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 32, padding: '22px 28px', background: 'rgba(45,158,107,.05)', border: '1px solid rgba(45,158,107,.15)', borderRadius: 16 }}>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '.66rem', fontWeight: 700, color: '#fff', letterSpacing: '.05em', marginBottom: 14 }}>КОНТЕНТ-ПЛАН НА НЕДЕЛЮ</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { day: 'Понедельник', type: 'Образовательный', desc: 'Польза ИИ для конкретной профессии / задачи' },
                    { day: 'Среда', type: 'Результат', desc: 'Кейс ученика: до → после + цифры' },
                    { day: 'Пятница', type: 'Призыв', desc: 'Набор на курс + ссылка / контакт' },
                    { day: 'Воскресенье', type: 'Лайфстайл', desc: 'Закулисье занятия, фото с урока, вопрос аудитории' },
                  ].map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
                      <div style={{ width: 100, fontFamily: 'var(--fu)', fontSize: '.6rem', fontWeight: 700, color: 'var(--amber)', letterSpacing: '.05em', paddingTop: 2, flexShrink: 0 }}>{d.day}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--cobalt)', marginBottom: 3 }}>{d.type}</div>
                        <div style={{ fontSize: '.84rem', color: 'var(--t2)' }}>{d.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
