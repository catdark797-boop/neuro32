# Feature · Нейра (AI-ассистент)

## Цель и ценность
Чат-виджет справа-снизу на всех страницах, отвечающий на вопросы о школе (программы, цены, расписание), работающий на YandexGPT-Lite с regex-fallback при недоступности API.

## User stories
1. Как посетитель, я открываю чат и спрашиваю «сколько стоит для ребёнка» → получаю содержательный ответ за 2-5 сек.
2. Как посетитель, я задаю вопрос вне темы → Нейра мягко возвращает в контекст школы.
3. Если YandexGPT не отвечает, regex-fallback даёт базовый ответ.

## Functional requirements
- `POST /api/ai-chat {messages: [{role, content}]}` → `{reply: string | null}`.
- System-prompt: «Ты Нейра — AI-ассистент школы Нейро 32…» (в `ai-chat.ts`).
- Модель: `gpt://{YANDEX_FOLDER_ID}/yandexgpt-lite/latest`, temp=0.35, max_tokens=400.
- Rate-limit: 20 req/мин/IP (`chatLimiter`).
- При 503 (no key или API fail) → клиент `smartFallback(msg)` regex.
- Message history: sessionStorage 10 последних, обрезается до 20.

## UX/UI
- FAB (robot emoji) в правом нижнем углу.
- Панель: аватарка Нейры, приветствие, input, список сообщений с bubbles.
- Scenarios (быстрый старт): 5 предустановленных вопросов.
- `aria-expanded`, `role="dialog"`, Escape — доступность.

## API контракт
```typescript
ChatBody { messages: Array<{ role: 'user'|'assistant'|'system', content: string }> }
ChatResponse { reply: string | null }
```

## Аналитика
- `store.incAIMessages()` — счётчик в localStorage (показывается в admin stats).

## Acceptance criteria
- [x] YandexGPT ответ за 2-5 сек на русском
- [x] При timeout > 16 сек → regex fallback
- [x] System prompt строго ограничивает domain
- [x] `VITE_API_URL` prefix для cross-origin
- [ ] Стриминг ответа (SSE) для ощущения скорости — опционально

## Test cases
| TC | Шаги | Ожидание |
|---|---|---|
| TC-AI-01 | Открыть виджет, спросить «сколько стоит» | Ответ содержит 5500/7000/8500/11000 |
| TC-AI-02 | Спросить «какой сейчас президент РФ» | Мягкий редирект в контекст школы |
| TC-AI-03 | Mock API 503 | Regex fallback срабатывает |
| TC-AI-04 | 25 запросов за минуту | Req 21 → 429 |
| TC-AI-05 | Панель закрыть Escape | FAB видимый, панель скрыта |

## Риски
- YandexGPT pricing — при резком росте трафика счёт может расти.
- Prompt injection: пользователь может попытаться «вырвать» Нейру из системного промпта.
- Ответы YandexGPT-Lite иногда фактически неточны (например, путает программы) — нужно строгое тестирование.
