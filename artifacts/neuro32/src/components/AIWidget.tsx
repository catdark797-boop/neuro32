import { useState, useRef, useEffect } from 'react';
import { store } from '../lib/store';

const SESSION_KEY = 'n32_ai_history';

const SCENARIOS = [
  { label: 'Как выбрать направление?', text: 'Как понять, какое направление подойдёт мне или ребёнку?' },
  { label: 'Что дают занятия?', text: 'Что конкретно я получу после прохождения практик?' },
  { label: 'Как записаться?', text: 'Как записаться на занятия?' },
  { label: 'Цены?', text: 'Сколько стоит обучение?' },
  { label: 'Для детей?', text: 'Расскажи подробнее о программе для детей.' },
];

const INIT_MSG = 'Привет! Я Нейра — ИИ-ассистент Нейро 32 🤖\n\nПомогу выбрать направление, расскажу о ценах и расписании. Чем могу помочь?';

function smartFallback(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('выбрат') || m.includes('какое') || m.includes('подойд') || m.includes('направлен')) return 'Вот простой ориентир:\n🧒 Дети 7–12 → ИИ-творчество (картинки, мультфильмы)\n👦 Подростки 13–17 → промпт-инжиниринг, портфолио\n👔 Взрослые → автоматизация рутины\n🔐 Кибербезопасность → защита данных\nНапишите Степану @DSM1322 — подберёт точнее.';
  if (m.includes('получ') || m.includes('дают') || m.includes('результат')) return 'После практик вы умеете работать с 10+ ИИ-инструментами, автоматизируете рабочие задачи и уходите с готовыми проектами. Всё делается руками на реальных задачах.';
  if (m.includes('записат') || m.includes('запись')) return 'Напишите Степану в Telegram @DSM1322 или позвоните: +7 (901) 976-98-10. Пробный урок — 500 ₽, засчитывается в абонемент!';
  if (m.includes('цен') || m.includes('стоим') || m.includes('сколько')) return 'Цены:\n🧒 Дети 7–12 — 5 500 ₽/мес\n👦 Подростки — 7 000 ₽/мес\n👔 Взрослые — 8 500 ₽/мес\n🔐 Кибербез — 11 000 ₽/мес\nПробный урок — 500 ₽.';
  if (m.includes('расписани') || m.includes('когда') || m.includes('старт')) return 'Новые группы каждые 4–6 недель. Занятия 2 раза в неделю. Точную дату ближайшего старта подскажет Степан: @DSM1322.';
  if (m.includes('привет') || m.includes('здравствуй') || m.includes('добрый')) return 'Привет! 👋 Я Нейра — ИИ-ассистент Нейро 32. Чем могу помочь?';
  return 'Для подробного ответа напишите Степану:\nTelegram: @DSM1322\n📞 +7 (901) 976-98-10\nОтвечает в течение часа 😊';
}

interface Message { role: 'bot' | 'user'; text: string; }
interface ApiMessage { role: 'user' | 'assistant'; content: string; }

function loadHistory(): Message[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Message[];
  } catch {}
  return [{ role: 'bot', text: INIT_MSG }];
}

function saveHistory(msgs: Message[]) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(msgs));
  } catch {}
}

export default function AIWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(msgs.length <= 1);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    saveHistory(msgs);
  }, [msgs]);

  const callLLM = async (history: ApiMessage[]): Promise<string> => {
    try {
      const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
      const resp = await fetch(`${base}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ messages: history }),
        signal: AbortSignal.timeout(16000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json() as { reply?: string | null; error?: string };
      if (data.reply) return data.reply;
      throw new Error(data.error || 'empty reply');
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[AIWidget] LLM fallback:', err);
      return '';
    }
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowQuick(false);
    const userMsg: Message = { role: 'user', text };
    const nextMsgs = [...msgs, userMsg];
    setMsgs(nextMsgs);
    setInput('');
    setLoading(true);
    store.incAIMessages();

    // Every turn → try LLM first, regex only on failure
    const history: ApiMessage[] = nextMsgs
      .filter(m => m.text !== INIT_MSG)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

    let reply = await callLLM(history);
    if (!reply) {
      await new Promise(r => setTimeout(r, 250 + Math.random() * 200));
      reply = smartFallback(text);
    }

    setMsgs(m => [...m, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div id="ai-widget">
      {/* FAB */}
      <button
        className="ai-fab"
        onClick={onClose}
        aria-label={open ? 'Закрыть чат с Нейрой' : 'Открыть чат с Нейрой'}
        aria-expanded={open}
        aria-controls="ai-panel"
        style={{ position: 'relative' }}
      >
        <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🤖</span>
        {!open && (
          <span style={{
            position: 'absolute', top: -6, right: -6, background: 'var(--amber)',
            color: 'var(--navy)', fontSize: '.45rem', fontFamily: 'var(--fm)',
            fontWeight: 700, letterSpacing: '.04em', borderRadius: 100,
            padding: '2px 6px', whiteSpace: 'nowrap',
          }}>ИИ</span>
        )}
      </button>

      {/* PANEL */}
      <div id="ai-panel" role="dialog" aria-labelledby="ai-panel-title" aria-hidden={!open} className={`ai-panel${open ? ' open' : ''}`}>
        {/* Header */}
        <div className="ai-head">
          <div className="ai-head-ava" style={{ fontSize: '1.4rem', lineHeight: 1 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div id="ai-panel-title" className="ai-head-name">Нейра · ИИ-помощник лаборатории</div>
            <div className="ai-head-st">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', animation: 'bdot 2s ease infinite', flexShrink: 0 }} />
              ИИ · GPT · отвечает за секунды
            </div>
          </div>
          <button className="ai-close" onClick={onClose} aria-label="Закрыть чат">✕</button>
        </div>

        {/* Info strip */}
        <div style={{
          padding: '8px 16px', background: 'rgba(240,165,0,.05)',
          borderBottom: '1px solid rgba(240,165,0,.1)',
          fontSize: '.72rem', color: 'var(--t3)', fontFamily: 'var(--fm)', lineHeight: 1.5,
        }}>
          Знаю всё о программах, ценах и записи. Для срочных вопросов — <a href="https://t.me/DSM1322" target="_blank" rel="noopener" style={{ color: 'var(--amber)', textDecoration: 'none' }}>@DSM1322</a>
        </div>

        {/* Messages */}
        <div className="ai-msgs" ref={msgsRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>
              <div className="ai-ava">{m.role === 'bot' ? '🤖' : '👤'}</div>
              <div className="ai-bubble" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="ai-msg bot">
              <div className="ai-ava">🤖</div>
              <div className="ai-typing"><span /><span /><span /></div>
            </div>
          )}
        </div>

        {/* Scenario quick-starts */}
        {showQuick && (
          <div className="ai-quick">
            <div style={{ fontSize: '.65rem', color: 'var(--t4)', fontFamily: 'var(--fm)', marginBottom: 6, letterSpacing: '.06em' }}>Часто спрашивают:</div>
            {SCENARIOS.map(s => (
              <button key={s.label} className="ai-qbtn" onClick={() => send(s.text)}>{s.label}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="ai-inp-row">
          <input
            className="ai-inp"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Спросить Нейру..."
            aria-label="Ваш вопрос"
          />
          <button className="ai-send" onClick={() => send(input)} aria-label="Отправить">→</button>
        </div>
      </div>
    </div>
  );
}
