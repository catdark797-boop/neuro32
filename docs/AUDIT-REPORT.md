# Нейро 32 — Сводный аудит (7 слоёв · 19.04.2026)

Аудит проведён от лица виртуальной команды: **CTO + Solution Architect + Head of Security + AppSec + VP Product + PM + QA Lead + Head of Design + Head of DevOps + SRE + Data Engineer + Legal Counsel**.

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | **Accessibility** | 3/4 | Контраст `--t4` ограниченный; touch-targets не везде 44px на мобильных |
| 2 | **Performance** | 3/4 | Lazy-loading есть; 2.2 МБ hero-bg.png не оптимизирован (WebP) |
| 3 | **Responsive** | 2/4 | Admin/LK sidebar ломаются на 375px; нет mobile-first подхода |
| 4 | **Theming** | 4/4 | 100% CSS-переменные, zero hardcoded hex |
| 5 | **Anti-Patterns** | 3/4 | Fail-silent error в EnrollModal; PRICES_INIT hardcoded; emoji-иконки |
| **Total** | | **15/20** | **Good — работать над weak dimensions** |

**Анти-паттерн вердикт**: проект **не выглядит AI-сгенерированным**. Есть distinctive palette (amber + navy + cobalt), нестандартные шрифты (Unbounded + Golos Text), продуманный бренд. Минимум «ИИ-слопа».

---

## Executive Summary

- **Состояние**: 🟡 Production работает (live на нейро32.рф), но недостаточно protected для масштабирования
- **Найдено**: ~50 issues (P0: 6, P1: 18, P2: 19, P3: 7)
- **Top-3 блокера для прод-готовности**:
  1. Нет CI/CD → ручные деплои, high-risk релизы
  2. Нет error-tracking (Sentry) → слепы к прод-ошибкам
  3. Нет тестов → регрессии уходят в прод

---

## Детальные Findings по слоям

### 🏗 Архитектура (CTO + Architect)

| ID | Severity | Issue | File:Line | Fix |
|---|---|---|---|---|
| A1 | P0 | Railway single-instance (нет failover) | deployment | Railway replica + health-based routing |
| A2 | P1 | Admin.tsx god-object 1166 строк | `src/pages/Admin.tsx` | Разбить на `src/pages/admin/{Stats,Users,Pricing,Requests,Audit}.tsx` |
| A3 | P2 | Нет пагинации `/api/users` | `api-server/src/routes/users.ts:48` | `LIMIT/OFFSET`, паттерн уже в `auditLogs.ts` |
| A4 | P2 | localStorage `store.ts` = источник мусора | `src/lib/store.ts` | Удалить полностью, переехать на API |
| A5 | P2 | Нет failover для side-effects (TG, VK) | `lib/telegram.ts`, `lib/vk.ts` | Retry + очередь (Bull/Temporal) либо игнор |

### 🔒 Security (Head of Security + AppSec)

| ID | Severity | Issue | File:Line | Fix |
|---|---|---|---|---|
| S1 | P1 | SameSite=none без CSRF-токенов | `api-server/src/app.ts:102` | Либо домен-общий setup + sameSite=strict, либо double-submit CSRF |
| S2 | P1 | `password` без `.min(8)` в RegisterBody | `lib/api-zod/src/...` | Добавить min(8) + regex сложности |
| S3 | P2 | CSP отключена | `api-server/src/app.ts:21` | Включить CSP (script-src self + 'unsafe-inline' для Yandex.Metrika) |
| S4 | P2 | Нет rate-limit на `/api/payments` POST | `api-server/src/routes/payments.ts:28` | `submitLimiter` (5/мин) |
| S5 | P2 | Нет валидации email/phone regex | `lib/api-zod/src/...` | `.email()`, `^\+?[\d\s\-()]{10,}$` |
| S6 | P2 | Нет rate-limit на DELETE `/auth/sessions` | `api-server/src/routes/auth.ts:156` | `authLimiter` |
| S7 | P3 | `ADMIN_PASSWORD` в `.env.example` | `api-server/.env.example:27` | Убрать, сгенерировать случайно |

### 💼 Бизнес-логика (Product + Backend Lead)

| ID | Severity | Issue | File:Line | Fix |
|---|---|---|---|---|
| B1 | P1 | Payment amount без проверки >0 | `api-server/src/routes/payments.ts:16,31` | `z.number().positive()` + валидация webhook |
| B2 | P1 | Hardcoded PRICES_INIT | `src/pages/Admin.tsx:26-32` | Вынести в `settings` таблицу + API GET/PATCH |
| B3 | P1 | Нет связи оплата → доступ к классам | `src/pages/LK.tsx` | Добавить `subscription_status` в users + проверка при записи |
| B4 | P2 | Rate-limit 5/мин без CAPTCHA | `applications.ts:19-25` | Добавить hCaptcha на фронт |
| B5 | P2 | Пробное (500₽) можно оплатить многократно | `payments.ts:31` | Проверка `WHERE userId=? AND desc LIKE 'пробное' AND status='succeeded'` |
| B6 | P1 | Session TTL 30 дней для финансовых операций | `app.ts:103` | Сократить до 7 дней или re-auth для платежей |
| B7 | P2 | Нет soft-delete users | `users.ts:94-111` | `deleted_at` + audit перед удалением |

### 🧪 QA (QA Lead)

| ID | Severity | Issue | Recommendation |
|---|---|---|---|
| Q1 | **P0** | **Нет тестов вообще (0 test-файлов)** | Vitest + Playwright → покрыть 5 happy-path и 3 edge cases |
| Q2 | P1 | EnrollModal fail-silent при API error | `catch { showError('Проверьте интернет') }` |
| Q3 | P1 | Double-submit не защищён debounce | Добавить `useRef` flag + disable кнопки |
| Q4 | P2 | Нет timeout на fetch — spinner навсегда | `AbortController` с 10s timeout |
| Q5 | P2 | Пустые списки без empty-state | `EmptyState` компонент + использовать в Admin/LK |

### 🎨 UX/UI (Head of Design)

| ID | Severity | Issue | File:Line | Fix |
|---|---|---|---|---|
| U1 | **P0** | EnrollModal показывает «успех» даже при 500 | `EnrollModal.tsx:47-55` | `catch { setError('...') }` + error-state |
| U2 | P1 | LK sidebar 240px на 375px → overflow | `index.css:275` | `@media(max-width:768px){ grid: 1fr }` (уже частично есть, проверить) |
| U3 | P1 | Auth: password < 6 символов validation только на submit | `Auth.tsx` | Real-time validation hint |
| U4 | P1 | Нет `*` индикатора у обязательных полей | `EnrollModal.tsx` | Добавить метки/звёздочку |
| U5 | P2 | Empty states отсутствуют (6+ мест) | Admin/requests, LK/notifications, Reviews | Создать `<EmptyState icon msg cta />` |
| U6 | P2 | `/aisecretary` скрыт (нет в nav) | `Nav.tsx` | Удалить (уже сделано) или добавить в footer |
| U7 | P3 | LK nav items `<44px` высоты | `index.css` `.lk-nav-item` | `min-height: 44px` (сделано) |

### ⚙️ DevOps / SRE (Head of DevOps)

| ID | Severity | Issue | Recommendation |
|---|---|---|---|
| D1 | **P0** | **Нет CI/CD (ручной деплой)** | GitHub Actions: lint + type-check + test + build + deploy |
| D2 | **P0** | **Нет Sentry / error tracking** | `@sentry/node` + `@sentry/react` integration |
| D3 | P1 | Только production — нет staging | Railway staging env + green-blue |
| D4 | P1 | Rate-limit in-memory → multi-instance проблема | Redis + `rate-limit-redis` |
| D5 | P1 | Нет автоматического backup Postgres | Railway scheduled backups + daily `pg_dump` на S3 |
| D6 | P2 | Нет `/metrics` для Prometheus | Опционально — Railway встроенные метрики сейчас ok |
| D7 | P2 | Нет rollback миграций Drizzle | `drizzle-kit generate` + version-controlled SQL |

### 📊 Data & Legal

| ID | Severity | Issue | Fix |
|---|---|---|---|
| L1 | P0 | Yandex.Metrika `VITE_YM_ID` не настроена | Получить счётчик, добавить в Railway env + `.env.production` |
| L2 | P1 | Нет API для «права на забвение» (152-ФЗ) | `DELETE /api/users/me` с подтверждением + audit log |
| L3 | P2 | Нет export персональных данных (152-ФЗ) | `GET /api/users/me/export` JSON с профилем и историей |
| L4 | P2 | Cookie-banner отсутствует (не требуется 152-ФЗ, но best practice) | Простая notice bar для GDPR-гостей |
| L5 | P3 | Консент родителей для детей 7-12 автоматически не собирается | Добавить чекбокс в EnrollModal когда direction='Дети 7-12' |

---

## Patterns & Systemic Issues

1. **Fail-silent error handling** встречается в 3+ местах (EnrollModal, TG/VK notify, LK fetch) — нужен единый error-boundary + toast-система.
2. **Hardcoded config** (цены, ONBOARDING_STEPS, REVENUE_DATA) — мешает изменять бизнес-параметры без релиза. Решение: `settingsTable` + admin-UI.
3. **Relative `/api/...` fetch'и** ещё могли остаться — надо перевести на `${VITE_API_URL}/api/...` либо обёртку `apiFetch()`.
4. **Нет shared UI-kit компонентов**: EmptyState, ErrorState, LoadingSpinner дублируются в каждом экране.

## Positive Findings ✅

- 100% CSS-переменные для цветов/шрифтов (4/4 в theming)
- Distinctive дизайн без AI-слопа (Unbounded + Golos Text, amber+navy палитра)
- Drizzle-ORM (параметризованные запросы, SQL-injection защита по дефолту)
- Pino-logger с redaction sensitive headers
- Privacy Policy актуальная, consent-чекбоксы на формах
- Docker multi-stage + non-root user
- Health + Ready endpoints для Kubernetes-стиля оркестрации
- Code-splitting на уровне routes (React.lazy)
- prefers-reduced-motion обрабатывается в 3D-глобусе и анимациях

---

## Рекомендации (в порядке приоритета)

1. **[P0] `/harden`** — CI/CD (GitHub Actions) + Sentry + Vitest/Playwright stubs
2. **[P0] `/clarify`** — EnrollModal fail-silent fix + EmptyState/ErrorState компоненты
3. **[P1] `/adapt`** — Mobile-first оптимизация LK/Admin sidebar + touch-targets
4. **[P1] `/shape`** — Settings-driven configs (цены, onboarding, PRICES_INIT → DB)
5. **[P1] `/harden`** — CSRF, password min(8), email/phone regex, rate-limits на payment/session
6. **[P2] `/optimize`** — WebP conversion `gen/*.png`, width/height attrs
7. **[P2] `/polish`** — 6 empty-state компонентов + real-time form validation
8. **[P2] `/distill`** — Разбить Admin.tsx (1166 строк) на 8 компонентов

После фиксов — повторный `/audit` для обновления score.
