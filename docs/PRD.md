# PRD — Нейро 32 (офлайн-школа ИИ-практик)

_Product Manager + Business Analyst · v1.0 · 19.04.2026_

## 1. Обзор продукта

**Название**: Нейро 32
**Описание**: офлайн-лаборатория ИИ-практик в Новозыбкове (Брянская область). Учит детей, подростков и взрослых применять современные ИИ-инструменты (ChatGPT, Claude, Midjourney, Sora, Kali Linux и др.) на реальных задачах. 4 рабочих ПК, группы до 4 человек, занятия 2×/нед.
**Целевая аудитория**: жители Новозыбкова и области 7-60+ лет; основные сегменты — семьи (дети 7-12), школьники (13-17), взрослые работающие (18-45), энтузиасты кибербезопасности.

## 2. Продуктовое видение и цели

**Vision (24 мес)**: стать региональным бенчмарком прикладного ИИ-образования, масштабируемым во 2 локации (Брянск, Клинцы).
**Цели на 3 мес**:
- 30 активных учеников (4 группы × 8) с удержанием ≥ 80%
- Конверсия «заявка → пробное → абонемент» ≥ 40%
- Средний чек ₽7 000/мес

## 3. Business requirements

### 3.1 Модель монетизации
| Продукт | Цена | Формат |
|---|---|---|
| Пробное занятие | 500 ₽ | 1 урок 60-90 мин, засчитывается в абонемент |
| Дети 7-12 | 5 500 ₽/мес | 8 занятий, игровой формат |
| Подростки 13-17 | 7 000 ₽/мес | 8 занятий, промпт-инжиниринг |
| Взрослые 18+ | 8 500 ₽/мес | 8 занятий, автоматизация рутины |
| Кибербезопасность | 11 000 ₽/мес | 8 занятий, Kali/DVWA |
| B2B (школы, компании) | от 15 000 ₽ | корпоративные занятия |

**Payment rails**: YooMoney (СБП + карты) → webhook → БД.

### 3.2 Ключевые метрики
| Метрика | Целевое | Метод |
|---|---|---|
| MAU (активные ученики/мес) | 30 | `payments.status='succeeded'` за 30 дней |
| Заявок в неделю | 15 | `applications` created |
| Конверсия заявка→оплата | 40% | `payment / application` funnel |
| NPS | ≥ 8 | опрос после 4 занятий |
| Ретеншн на 2-й месяц | 80% | повторная оплата |
| Среднее время ответа на заявку | < 2 ч в рабочее время | admin audit log |

## 4. User personas

### Персона 1 · Родитель
«Мама Маша, 38 лет, бухгалтер, ищет что-то полезное для сына 9 лет». Задачи: быстро понять безопасно/полезно ли, как записаться, сколько стоит. Сценарий: Home → /kids → Записаться → TG-звонок от Степана.

### Персона 2 · Школьник
«Артём, 15 лет, сам нашёл в ВК». Задачи: узнать «чему научат», «дадут ли портфолио». Сценарий: ВК-пост → Home → /teens → AI-виджет (Нейра) → заявка.

### Персона 3 · Взрослый-профи
«Оля, 34, SMM-менеджер, хочет автоматизировать рутину». Сценарий: Google → /adults → /packages → регистрация → оплата пробного → LK.

### Персона 4 · Администратор (Степан)
Задачи: мониторинг заявок, общение, оплаты, расписание, контент. Сценарий: /admin → requests → одобрение → TG-чат с учеником.

## 5. Product scope (Epics)

| Epic | Приоритет | Описание |
|---|---|---|
| E1 · Лендинг и конверсия | Must | Home-страница с hero, 3D-глобусом, программами, FAQ, CTA |
| E2 · Регистрация и заявки | Must | EnrollModal + Auth (register/login) + TG/VK уведомления |
| E3 · Личный кабинет | Must | Расписание, оплаты, профиль, уведомления, безопасность |
| E4 · Админ-панель | Must | Заявки, пользователи, расписание, платежи, контент, аналитика, аудит |
| E5 · ИИ-помощник Нейра | Should | Чат-виджет на YandexGPT с fallback regex |
| E6 · Автопостинг VK | Should | 10 шаблонов + cover + описание; запуск по крону |
| E7 · B2B-воронка | Should | Отдельная страница + форма + админ-раздел |
| E8 · Платежи YooMoney | Must | Создание платежа + webhook + статусы |
| E9 · Аналитика (Яндекс.Метрика) | Should | Воронки, goals, ключевые события |
| E10 · Tests + CI/CD | **Must** | Vitest + Playwright + GitHub Actions (NEW — из аудита) |
| E11 · Error tracking (Sentry) | **Must** | `@sentry/node` + `@sentry/react` (NEW — из аудита) |
| E12 · GDPR / 152-ФЗ compliance | Should | `/privacy`, consent, export, deletion (right to be forgotten) |

## 6. Functional requirements (MoSCoW)

### Must-Have
| FR | Описание | Статус |
|---|---|---|
| FR-01 | POST /api/applications — открытая форма записи | ✅ |
| FR-02 | TG + VK уведомления при новой заявке | ✅ |
| FR-03 | POST /api/auth/register + /login + session cookies | ✅ |
| FR-04 | `requireAdmin` middleware на мутациях | ✅ |
| FR-05 | YooMoney payment create + webhook verify | ✅ |
| FR-06 | LK: расписание из `class_sessions` | ✅ |
| FR-07 | Admin: CRUD заявок, юзеров, расписания, цен | ⚠️ цены hardcoded |
| FR-08 | Audit log админ-действий | ✅ |
| FR-09 | Rate-limit на public endpoints | ⚠️ не все |
| FR-10 | CI/CD + тесты | ❌ отсутствует |
| FR-11 | Sentry error tracking | ❌ отсутствует |
| FR-12 | Право на забвение (DELETE /me) | ❌ отсутствует |

### Should-Have
- Нейра на YandexGPT с fallback ✅
- VK автопостинг ✅ (5 из 10 постов)
- B2B форма ✅
- Yandex.Metrika ❌ (placeholder)
- Mobile-first LK/Admin ⚠️

### Could-Have
- A/B тесты CTA, PWA, Email-рассылки, Push-notifications, Referral-программа

### Won't (этот MVP)
- Multi-tenancy, маркетплейс курсов, e-learning LMS

## 7. Non-functional requirements

- **Performance**: TTFB < 300ms; LCP < 2.5s; INP < 200ms. Bundle < 500KB gz для первого экрана.
- **Security**: OWASP Top-10. Helmet + CSP + HSTS + SameSite=Strict (после миграции) + CSRF-токены. Bcrypt cost ≥ 12. Секреты только в env, никогда в коде.
- **Scalability**: текущий Railway single-instance держит ~100 MAU. Для >500 нужен Redis-limiter + Postgres pooler (PgBouncer) + Railway replica.
- **Privacy**: 152-ФЗ, consent на формах, право на удаление/экспорт, минимизация данных.
- **Accessibility**: WCAG AA минимум (контраст 4.5:1, touch ≥ 44px, keyboard nav).
- **Availability**: 99.5% (≈ 3ч downtime/мес). Health/readiness зонды, graceful shutdown, автоматические backup'ы.

## 8. Dependencies & Risks

### Внешние зависимости
- **Railway** (API + Postgres) — vendor lock-in. Риск: удорожание / удаление сервиса.
- **YandexGPT** — YandexCloud API. Риск: изменение pricing / доступности.
- **YooMoney** — процессинг платежей. Риск: SHA-1 подписи устарели.
- **reg.ru** — фронтенд хостинг. Риск: ограничения shared hosting.
- **Telegram Bot API** — уведомления.
- **VK API** — комьюнити и постинг. Риск: community-token с 2FA.

### Риски
- **R1 [P0]**: единая точка отказа Railway → недоступность продукта. Митигейт: Railway replica + health-routing.
- **R2 [P0]**: сильный бизнес-логик баг в `/payments` webhook → двойная оплата. Митигейт: UNIQUE label + idempotency.
- **R3 [P1]**: утечка cookie `connect.sid` → хищение сессии. Митигейт: CSRF + `samesite=strict` после унификации домена.
- **R4 [P2]**: спам через формы без CAPTCHA → засорение админки. Митигейт: hCaptcha.
- **R5 [P2]**: ручной деплой → релизные баги. Митигейт: CI/CD (E10).

## 9. Success metrics & Definition of Done

### DoR (Definition of Ready — фича готова к разработке)
- Есть feature-doc (`docs/features/<name>.md`) с user-stories, acceptance criteria
- UX-макеты (если новый UI)
- API-контракт (zod-схема + generated TS-клиент)
- Тест-план (минимум 3 TC)
- Проверка безопасности: кто имеет доступ? какие данные логируются?

### DoD (Definition of Done — фича готова к релизу)
- Код прошёл code-review
- Unit + integration тесты ≥ 80% покрытия нового кода
- Playwright E2E для happy path
- Миграция БД применена + rollback план
- Обновлены feature-doc + README
- Проверено в staging на реальных данных
- Запланирован rollback-план на случай проблем
- PR smoke-tested на preview URL

### Ключевые release-блокеры
| # | Критерий | Статус |
|---|---|---|
| ✅ | Admin login работает на production | ✓ (после v6 api-server) |
| ✅ | TG-уведомления без кракозябр | ✓ |
| ✅ | Нейра отвечает через YandexGPT | ✓ |
| ✅ | VK брендирован + 5 постов | ✓ |
| ⚠️ | Mobile LK/Admin не ломается на 375px | ⚠️ частично |
| ❌ | CI/CD настроен | ❌ |
| ❌ | Sentry подключен | ❌ |
| ❌ | Минимум 10 E2E тестов green | ❌ |
| ⚠️ | Payment webhook idempotent | ⚠️ частично |
| ❌ | Right-to-be-forgotten API | ❌ |
