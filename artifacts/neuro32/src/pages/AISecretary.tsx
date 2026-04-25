import { useState, useRef, useEffect } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Bot, User } from 'lucide-react';

const TOPICS = [
  { label: 'Цены и оплата', q: 'Сколько стоят занятия и как оплатить?' },
  { label: 'Расписание', q: 'Когда проходят занятия и как записаться?' },
  { label: 'Дети 7–12 лет', q: 'Расскажи про программу для детей 7–12 лет' },
  { label: 'Подростки 13–17', q: 'Что изучают подростки 13–17 лет?' },
  { label: 'Взрослые 18+', q: 'Программа для взрослых — что получу в итоге?' },
  { label: 'Кибербезопасность', q: 'Расскажи про курс кибербезопасности' },
  { label: 'Пробное занятие', q: 'Как записаться на пробное занятие?' },
  { label: 'Адрес и проезд', q: 'Где находится лаборатория?' },
];

function smartAnswer(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('цен') || m.includes('стоим') || m.includes('оплат') || m.includes('сколько')) {
    return `Цены на программы Нейро 32:

🧒 Дети 7–12 лет — **5 500 ₽/мес** (24 занятия, 3 мес.)
👦 Подростки 13–17 — **7 000 ₽/мес** (36 занятий, 4–5 мес.)
👔 Взрослые 18+ — **8 500 ₽/мес** (32 занятия, 4 мес.)
🔐 Кибербезопасность — **11 000 ₽/мес** (24 занятия, 3 мес.)
🎯 Пробное занятие — **500 ₽**

Оплата: СБП на +7 (901) 976-98-10 или наличными. Чек НПД автоматически.`;
  }
  if (m.includes('расписани') || m.includes('записат') || m.includes('старт') || m.includes('когда')) {
    return `Набор открыт в постоянном режиме — новые группы каждые 4–6 недель.

📅 Занятия: 2 раза в неделю, 60–90 минут
🕐 Время: согласовывается с группой (обычно 16:00–17:30 или 18:00–19:30)
📍 Место: г. Новозыбков, ул. Коммунистическая, 22А

Для уточнения точной даты ближайшего старта и количества свободных мест свяжитесь со Степаном:
📱 Telegram: @DSM1322
📞 +7 (901) 976-98-10`;
  }
  if (m.includes('дет') || m.includes('7') && m.includes('12') || m.includes('ребён')) {
    return `Программа для детей 7–12 лет:

**Два трека:**
1. Базовый (7–12 лет) — 24 занятия, 3 месяца — **5 500 ₽/мес**
2. Продвинутый (10–12 лет) — 32 занятия, 4 месяца

**Что изучаем:**
• Яндекс Алиса, ГигаЧат, Шедеврум
• Suno AI (музыка), ElevenLabs (голос), Kling AI (видео)
• Scratch (программирование), алгоритмическое мышление
• Цифровая безопасность

**Результат:** портфолио проектов, сертификат участника Нейро 32`;
  }
  if (m.includes('подрост') || m.includes('13') || m.includes('17')) {
    return `Программа для подростков 13–17 лет — **7 000 ₽/мес**:

**Чему научитесь:**
• Промпт-инжиниринг (RPCQ-формула)
• Python + OpenAI API
• Telegram-боты через BotFather
• Make.com — автоматизация без кода
• ИИ-агенты и продвинутые инструменты

**36 занятий, 4–5 месяцев**
**Результат:** 5+ проектов в портфолио, рекомендательное письмо 🚀`;
  }
  if (m.includes('взросл') || m.includes('18') || m.includes('бизнес') || m.includes('работ')) {
    return `Программа для взрослых 18+ — **8 500 ₽/мес**:

**Принцип:** каждое занятие — решение вашей реальной задачи

**Инструменты:**
• ChatGPT, ГигаЧат — тексты и анализ
• Make.com — автоматизация процессов
• Notion AI — умная база знаний  
• Gamma.app — презентации и отчёты
• ElevenLabs, HeyGen — медиапродакшн

**32 занятия, 4 месяца**
Экономия: **3–5 часов в неделю** за счёт автоматизации 💼`;
  }
  if (m.includes('кибер') || m.includes('безопас') || m.includes('хакер') || m.includes('пентест')) {
    return `Курс кибербезопасности — **11 000 ₽/мес**:

**Программа:**
• Блок 1: Защита (пароли, VPN, 2FA, фишинг)
• Блок 2: Пентест (Kali Linux, nmap, DVWA)
• Блок 3: ИИ в кибербезопасности
• Блок 4: CTF-соревнования

**24 занятия, 3 месяца**
Возраст: от 14 лет

Всё — в безопасной среде (виртуальные машины, полигоны). Сертификат участника Нейро 32 🔐`;
  }
  if (m.includes('пробн') || m.includes('попроб') || m.includes('первое')) {
    return `Пробное занятие — всего **500 ₽**! 🎯

• 60–90 минут офлайн в Новозыбкове
• Если понравится — сумма засчитывается в абонемент
• Можно для любого направления

Для записи на пробное:
📱 Telegram: @DSM1322
📞 +7 (901) 976-98-10

Отвечаем в течение 30 минут ⚡`;
  }
  if (m.includes('адрес') || m.includes('где') || m.includes('находит') || m.includes('проезд')) {
    return `📍 **Адрес:** г. Новозыбков, Брянская обл., ул. Коммунистическая, 22А

Площадка АНО «Простые вещи» — предоставляется безвозмездно.

**Как добраться:**
• На машине: паркинг рядом с зданием
• Пешком от ж/д вокзала: ~20 минут или маршрутка

**Контакты:**
📱 Telegram: @DSM1322
📞 +7 (901) 976-98-10`;
  }
  if (m.includes('привет') || m.includes('здравствуй') || m.includes('добрый')) {
    return 'Привет! 👋 Я Нейра — ИИ-помощник лаборатории Нейро 32. Выберите тему слева или задайте любой вопрос о программах, ценах или записи. Отвечу моментально!';
  }
  return `Хороший вопрос! Для подробного ответа лучше обратиться к Степану напрямую:

📱 **Telegram:** @DSM1322 (отвечает за 30 мин.)
📞 **Телефон:** +7 (901) 976-98-10
✉️ **Email:** d3stemar@yandex.ru

Или выберите тему в меню слева — я расскажу о любой программе!`;
}

interface Message { role: 'bot' | 'user'; text: string; }

export default function AISecretary() {
  usePageMeta('ИИ-секретарь', 'Нейра — ИИ-ассистент Нейро 32. Задайте любой вопрос о курсах, ценах и расписании.');
  const [msgs, setMsgs] = useState<Message[]>([
    { role: 'bot', text: 'Добро пожаловать! Я Нейра — ИИ-ассистент лаборатории «Нейро 32». Выберите тему слева или задайте любой вопрос о программах обучения.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 700));
    const reply = smartAnswer(text);
    setMsgs(m => [...m, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div>
      <div className="pg-hero">
        <div className="pg-badge"><Bot size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />ИИ-ассистент</div>
        <h1>НЕЙРА — <span className="accent">ИИ-ПОМОЩНИК</span></h1>
        <p>Задайте любой вопрос о программах, ценах и расписании. Нейра ответит мгновенно.</p>
      </div>

      <div className="aip-layout">
        <div className="aip-side">
          <div className="aip-ava"><Bot size={28} /></div>
          <div className="aip-name">Нейра</div>
          <div className="aip-status"><div className="aip-sdot" />онлайн · отвечает мгновенно</div>
          <div className="aip-sep" />
          <div className="aip-lbl">Популярные вопросы</div>
          {TOPICS.map((t, i) => (
            <button key={i} className="aip-topic" onClick={() => send(t.q)}>{t.label}</button>
          ))}
        </div>

        <div className="aip-main">
          <div className="aip-msgs" ref={msgsRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                <div className="ai-ava">{m.role === 'bot' ? <Bot size={18} /> : <User size={18} />}</div>
                <div className="ai-bubble" style={{ whiteSpace: 'pre-line', maxWidth: '70%' }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-msg bot">
                <div className="ai-ava"><Bot size={18} /></div>
                <div className="ai-typing"><span /><span /><span /></div>
              </div>
            )}
          </div>

          <div className="aip-inp-row">
            <input
              className="aip-inp"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Задайте вопрос Нейре..."
            />
            <button className="ai-send" onClick={() => send(input)} style={{ width: 44, height: 44, borderRadius: 10 }}>→</button>
          </div>
        </div>
      </div>

    </div>
  );
}
