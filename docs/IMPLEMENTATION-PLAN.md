# Implementation Plan — Нейро 32 Post-Audit (19.04.2026)

Реализация идёт шагами: **Шаг N → тесты → работа над ошибками → Шаг N+1**.

Статус: v6 api-server задеплоен, v5 frontend готов к загрузке, основной функционал work. Фокус плана — закрыть P0/P1 из аудита.

---

## 🚀 Шаг 0 (текущий): V5 Frontend Deploy
**Цель**: Выпустить уже собранный v5 на prod с фиксами login-loop и relative-fetch.

**Задачи**: User: загрузить `https://litter.catbox.moe/8c9co3.zip` в ISPmanager, распаковать.

**Тесты**: curl E2E (login 200, /applications реальные данные, /users real list).

**Нужно**: ничего нового, уже готово.

---

## Шаг 1 · CI/CD + Error tracking + Тесты [P0, ~3 дня]

**Цель**: Убрать ручной деплой, включить error visibility, заложить тестовую базу.

**Задачи**:
- **Engineering (Backend)**: `@sentry/node` init + DSN в Railway env. Оборачивание globalHandler в `Sentry.setupExpressErrorHandler(app)`.
- **Engineering (Frontend)**: `@sentry/react` + SourceMaps upload на билде. Connect react-router (Wouter).
- **QA**: `vitest.config.ts`, 10 unit-тестов для `smartFallback`, zod-схем, payment math. `playwright.config.ts` + 5 E2E: login, register, enroll-form, admin-sees-apps, AI-widget.
- **DevOps**: `.github/workflows/ci.yml` — install, lint, type-check, test, build, deploy-to-Railway (на main). Staging env в Railway (опционально).
- **Security**: Sentry redact cookies/headers/passwords.

**Skills/MCP**:
- Уже есть: `Bash`, `Write/Edit/Grep/Glob`, Railway CLI, Chrome MCP
- Нужно: `skill-sec-audit` (паттерны regex), `skill-qa-matrix` (генерация матрицы TC), `skill-ci-cd-setup` (шаблоны GHA)

**Тесты Шага 1**:
- CI запускается на push → все зелёные
- Playwright: `pnpm exec playwright test` → 5/5 зелёные
- Sentry: sent test event → в дашборде видно

**Definition of Done**:
- [ ] `pnpm run test` + `pnpm run test:e2e` на CI pass
- [ ] Sentry captures тестовый error в prod
- [ ] Deploy происходит через GitHub Actions, не руками

---

## Шаг 2 · Security hardening [P0/P1, ~2 дня]

**Цель**: Закрыть баги CSRF/password-policy/payment-amount/CAPTCHA.

**Задачи**:
- **Security**:
  - CSRF: либо `lusca` или custom `csurf`-style token через cookie + header, либо миграция на единый домен (обе части на `нейро32.рф` с nginx-proxy на `/api` → Railway).
  - `RegisterBody.password.min(8)` + zxcvbn strength check на фронте.
  - `POST /api/payments` rate-limit 5/мин.
  - `DELETE /api/auth/sessions` rate-limit.
  - Email regex `z.string().email()`, phone `^\+?[\d\s\-()]{10,}$`.
- **Product**: решение по CAPTCHA — hCaptcha (бесплатно, GDPR-friendly) или reCAPTCHA v3.
- **Backend**: `payments.amount` → `z.number().positive().max(100000)`.
- **QA**: 5 security-фокусированных E2E: brute-force lockout, CSRF attempt, XSS in form, CAPTCHA skip.

**Skills/MCP**:
- Нужно: `skill-sec-audit` — полезно для double-check OWASP.

**Тесты**:
- `TC-SEC-01`: 21 логин за 15 мин → blocked
- `TC-SEC-02`: POST `/payments {amount: -1}` → 400
- `TC-SEC-03`: Регистрация пароль=`12345` → 400
- `TC-SEC-04`: без CAPTCHA в заявке → 400 (после установки)
- `TC-SEC-05`: CSRF-hit (другой Origin без token) → 403

**DoD**:
- [ ] Все 5 security TC зелёные
- [ ] OWASP ZAP scan на staging без HIGH findings
- [ ] CSRF token обязателен для POST/PATCH/DELETE

---

## Шаг 3 · Mobile-first UX + Empty States [P1, ~2 дня]

**Цель**: Фикс LK/Admin на 375px, унифицировать error/empty/loading компоненты.

**Задачи**:
- **UX**: дизайн-система `<EmptyState icon msg cta />`, `<ErrorState msg retry />`, `<LoadingSkeleton rows />`.
- **Frontend**: использовать везде (Admin/requests, Admin/users, LK/notifications, LK/payments, Reviews).
- **Frontend**: Mobile-first hamburger в LK и Admin sidebar `@media(max-width:768px){ grid-template-columns:1fr; .lk-sidebar,.admin-sidebar { display:none } }` + bottom-tabs (уже частично есть).
- **CSS**: WCAG AA контраст аудит — инструмент Stark / axe-devtools.

**Skills/MCP**:
- Нужно: `skill-ux-review` — чек-лист;  `/adapt`, `/polish` — готовые команды из `.claude/skills`

**Тесты**:
- Playwright `@mobile` preset (iPhone 12, 390×844) — навигация LK/Admin без overflow
- Visual regression (Percy, Chromatic) — опционально
- Manual QA на реальном iPhone/Android

**DoD**:
- [ ] LK/Admin работают на 375×667 (iPhone SE)
- [ ] 6+ empty-state компонентов используются
- [ ] Contrast всей палитры ≥ 4.5:1

---

## Шаг 4 · Data-driven config (цены, onboarding) [P1, ~1 день]

**Цель**: Убрать hardcoded из админки → editable без релиза.

**Задачи**:
- **Backend**: `GET /api/settings`, `PATCH /api/settings/:key` (admin). Использует уже существующий `settingsTable`.
- **Frontend**: `Admin/Prices` читает через `useQuery`. Admin UI — inline-edit + save.
- **Data**: миграция — insert начальные значения (`price_kids: 5500`, и т.д.).
- **Legal**: audit-log для смены цен.

**Тесты**:
- `TC-SET-01`: PATCH цены детей 5500→6000, затем GET /packages показывает 6000
- `TC-SET-02`: не-admin PATCH /settings → 403

**DoD**:
- [ ] Админ меняет цены из UI → прод обновляется без релиза
- [ ] Aудит-лог фиксирует кто и когда менял

---

## Шаг 5 · Payment idempotency + Right-to-be-forgotten [P1, ~2 дня]

**Цель**: Защита от дублей webhook + 152-ФЗ compliance.

**Задачи**:
- **Backend**: `UNIQUE` constraint на `payments.label`; webhook handler — `ON CONFLICT (label) DO UPDATE SET status=excluded.status WHERE payments.status='pending'`.
- **Backend**: `DELETE /api/users/me` (+ подтверждение через пароль) — удаление + audit-log + TG-notify админа.
- **Backend**: `GET /api/users/me/export` — JSON со всеми personal data.
- **Legal/Compliance**: обновить `/privacy` — право на удаление + export упомянуть.
- **QA**: double-webhook тест, delete-cascade тест.

**Тесты**:
- `TC-PAY-06`: double-webhook с тем же operation_id → нет дубля в БД
- `TC-DEL-01`: DELETE /users/me → 204, потом login → 401

**DoD**:
- [ ] Idempotency guaranteed
- [ ] Удаление + export доступны из LK/Security tab

---

## Шаг 6 · Performance: WebP + split bundle [P1, ~1 день]

**Цель**: Снизить LCP до < 2.5s на мобиле.

**Задачи**:
- **Engineering**: `sharp` script для конвертации `public/gen/*.png` → `.webp` + `.jpg` fallback. `<picture>` с `<source type="image/webp">`.
- **Engineering**: `vite.config.ts` `manualChunks` → Radix UI в отдельный chunk.
- **Frontend**: `loading="lazy"`, `width/height` атрибуты на всех img.

**Тесты**:
- Lighthouse mobile Performance ≥ 85
- WebPageTest: LCP < 2.5s на 4G

**DoD**:
- [ ] Hero bundle < 500 KB gz (сейчас 0.5-1 MB)
- [ ] Lighthouse всех 4 Core Vitals зелёные

---

## Шаг 7 · Admin refactor (Admin.tsx god-object) [P2, ~2 дня]

**Цель**: Разбить 1166-строчный `Admin.tsx` на 8 чистых компонентов.

**Задачи**:
- **Engineering**: `src/pages/admin/{Stats,Requests,Users,Pricing,Content,Marketing,Schedule,Groups,Business,Audit}.tsx`. Главный `Admin.tsx` держит layout + routing.
- **Frontend**: переиспользовать `<AdminTable/>`, `<AdminStatCard/>`, `<AdminChart/>`.
- **QA**: не должно сломать ни один из текущих табов.

**Тесты**:
- Smoke E2E по каждому табу (10 кликов, visual compare)

**DoD**:
- [ ] Admin.tsx < 200 строк
- [ ] Каждый таб = отдельный файл < 300 строк

---

## Шаг 8 · Yandex.Metrika + funnel analytics [P1, ~0.5 дня]

**Цель**: Видеть конверсию заявка → оплата в метриках.

**Задачи**:
- **Data**: зарегить счётчик Metrika, вставить `VITE_YM_ID` в Railway env для фронта.
- **Frontend**: `src/lib/analytics.ts` уже скелет — проверить все `ym.goal()` вызовы.
- **Goals**: `enroll_click`, `enroll_submit`, `payment_init`, `payment_success`.

**Тесты**:
- Ручная проверка: открыть прод, сделать flow → в Metrika → увидеть событие.

**DoD**:
- [ ] Все 4 goal event'а приходят

---

## Шаг 9 · Infrastructure hardening [P2, ~1 день]

**Цель**: Масштабирование, backup, Redis-limiter.

**Задачи**:
- **DevOps**: Railway Postgres snapshot schedule (раз в день). Ручной `pg_dump` weekly на S3 (опционально).
- **DevOps**: Railway Redis add-on → `rate-limit-redis` store для express-rate-limit.
- **DevOps**: Healthcheck liveness (`/healthz`) vs readiness (`/readyz` с DB) — проверить что Railway использует правильный.

**Тесты**:
- Восстановить DB из snapshot на staging — проверить интеграцию
- Kill API инстанс → Railway перезапускает → curl still works

**DoD**:
- [ ] Daily Postgres snapshots
- [ ] Rate-limit работает через Redis (можно масштабировать инстансы)

---

## Шаг 10 · VK cron + остальные посты [P2, ~0.5 дня]

**Цель**: Автоматический постинг без ручного вызова.

**Задачи**:
- **Backend**: `artifacts/api-server/src/cron/vk-autopost.ts` с node-cron + Railway CRON. Пн/Ср/Пт 10:00 МСК.
- **Product**: 5 новых постов в `vk-posts-seed.ts` (нужно ещё 5 для квартала).

**DoD**:
- [ ] Пост публикуется автоматически в ожидаемое время

---

# Рекомендуемые Skills / MCP / Plugins

## 5.1 Уже есть в окружении
- **Базовые tools Claude Code**: Bash, Read, Write, Edit, Grep, Glob, TodoWrite, Agent (Explore/Plan/general-purpose/claude-code-guide).
- **MCP Chrome**: `mcp__Claude_in_Chrome__*` — browser automation (navigate, click, find, screenshot, file_upload).
- **MCP-registry**: `mcp__mcp-registry__search_mcp_registry`, `mcp__mcp-registry__suggest_connectors`.
- **Railway CLI**: `railway up`, `railway variables`, `railway logs`.
- **Anthropic skills (pre-installed)**: `/impeccable`, `/audit`, `/adapt`, `/animate`, `/brainstorming`, `/clarify`, `/colorize`, `/critique`, `/delight`, `/distill`, `/layout`, `/optimize`, `/polish`, `/quieter`, `/shape`, `/typeset`, `/bolder`, `/overdrive`, `/subagent-driven-development`, `/test-driven-development`, `/systematic-debugging`, `/verification-before-completion`, `/writing-plans`, `/using-git-worktrees`.

## 5.2 Предлагаемые custom skills (создать)

### `skill-prd-builder`
**Назначение**: Держать `docs/PRD.md` и `docs/features/*.md` в синхроне с изменениями кода.
**Пример вызова**: `/prd-builder update feature=payments` — читает `src/routes/payments.ts` + изменения, обновляет фиче-док.
**SKILL.md** (схематично):
```markdown
---
name: prd-builder
description: Maintains PRD.md and feature docs in sync with code changes
trigger: invoked when src/routes/ or src/pages/ files change, or manually with /prd-builder
---

When invoked:
1. Read the plan file C:\Users\CatDark\Downloads\Solo-Learner\Solo-Learner\docs\PRD.md
2. Read the changed feature file
3. Extract user stories, acceptance criteria, API schemas
4. Propose diffs to docs/features/<name>.md
5. Suggest PRD updates if scope changes
```

### `skill-qa-matrix`
**Назначение**: Генерация матрицы TC по feature-doc или API routes.
**Пример**: `/qa-matrix feature=payments` → markdown таблица с TC-ID, шагами, ожидаемыми, priority.

### `skill-feature-doc`
**Назначение**: Генерация скелета `docs/features/<name>.md` по API route + компоненту.
**Пример**: `/feature-doc route=/api/reviews component=Reviews.tsx`.

### `skill-arch-audit`
**Назначение**: Быстрый архитектурный чек-лист (god-objects, цикл. зависимости, N+1 запросы).
**Пример**: `/arch-audit` → топ-10 проблем за ≤ 1 мин.

### `skill-ci-cd-setup`
**Назначение**: Сгенерировать `.github/workflows/ci.yml` с lint/test/build/deploy под проект.
**Пример**: `/ci-cd-setup platform=railway node=24 framework=vite`.

### `skill-sec-audit`
**Назначение**: OWASP Top-10 regex checks на кодовой базе.
**Пример**: `/sec-audit` → список всех `dangerouslySetInnerHTML`, `eval`, hardcoded tokens.

### `skill-deployment-log`
**Назначение**: История деплоев + rollback helper.

## 5.3 Предлагаемые MCP-серверы

### MCP-Sentry (third-party, есть на npm)
Отслеживать ошибки напрямую из Claude Code.

### MCP-Postgres (read-only)
Делать SQL-запросы к production Postgres через MCP для отладки (`SELECT COUNT(*) FROM applications WHERE status='new'`).

### MCP-Lighthouse
Запускать Lighthouse CI и читать отчёт в Claude.

### MCP-GitHub
Управлять PR, issue, Actions workflows (для CI/CD шага).

## 5.4 Plugins

- **@anthropic-ai/claude-code-ui-kit** (опциональный) — готовые компоненты EmptyState/ErrorState/LoadingSkeleton.

## Checklist установки/создания
```markdown
## Уже есть
- Claude Code core tools
- Chrome MCP
- Railway CLI
- 20+ Anthropic built-in skills

## Нужно создать (custom skills в .claude/skills/)
- [ ] skill-prd-builder
- [ ] skill-qa-matrix
- [ ] skill-feature-doc
- [ ] skill-arch-audit
- [ ] skill-ci-cd-setup
- [ ] skill-sec-audit
- [ ] skill-deployment-log

## Нужно установить (MCP servers)
- [ ] Sentry MCP (@sentry/mcp-server на npm, если есть)
- [ ] Postgres MCP (ro-mode для debug)
- [ ] GitHub MCP (для CI/CD workflow management)

## Нужно зарегистрировать / получить
- [ ] Yandex.Metrika counter (VITE_YM_ID)
- [ ] hCaptcha sitekey + secret
- [ ] Sentry DSN (backend + frontend)
- [ ] GitHub репозиторий для CI/CD (сейчас только локальный git)
```

---

# Financials / Risk Matrix (Top)

| Риск | Probability | Impact | Митигейт |
|---|---|---|---|
| Railway outage | Low | Critical | Backup на S3 + переход на Render / VPS |
| Postgres corruption | Very low | Critical | Daily snapshots + pg_dump |
| YandexGPT rate-lim | Medium | Low | regex-fallback уже работает |
| VK API change | Low | Medium | text-only posts тоже работают |
| YooMoney SHA-1 deprecation | Low | High | Следить за новой API, мигрировать |

---

# Следующие шаги

1. **Сейчас (сегодня)**: пользователь загружает v5 на reg.ru (Шаг 0)
2. **Завтра**: начать Шаг 1 (CI/CD + Sentry + первые тесты)
3. Каждый шаг закрываем **после зелёных тестов и апрува**, потом переходим к N+1.

По готовности скажи «Шаг 1 поехали» — я распаковываю задачи и выполняю.
