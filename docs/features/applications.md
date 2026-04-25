# Feature · Applications (Заявки на запись)

## Цель и ценность
Открытая форма «Записаться на занятие» — основной канал входа заявки в админку. Моментальное уведомление в TG/VK позволяет Степану ответить в течение 1-2 часов.

## User stories
1. Как посетитель, я заполняю имя/телефон/направление → получаю подтверждение.
2. Как админ, я вижу заявку в /admin/requests с пометкой «new».
3. Как админ, я меняю статус на «processed» или «declined» (audit log).
4. Как админ, я получаю моментальное уведомление в @neuro32_admin_bot.

## Functional requirements
- `POST /api/applications {name, phone, direction, format, message, isBusinessInquiry}` → 201.
- Rate-limit 5/мин/IP (`submitLimiter`).
- После вставки — `notifyAdmin(message)` (TG) и `notifyAdminVK(message)` (если настроен).
- `GET /api/applications` (admin only) — список отсортирован по `createdAt desc`.
- `PATCH /api/applications/:id {status}` — admin.

## UX/UI
- **EnrollModal** (`src/components/EnrollModal.tsx`) — overlay + form.
- Обязательные: имя, телефон, чекбокс согласия на ПДн.
- Опционально: направление, комментарий.
- Post-success state: "Заявка принята!" + кнопка в Telegram + auto-close 8s.
- **Срочно (P0)**: убрать fail-silent — при 500 API показывать error, а не success.

## Data модель
`applications`: id, name, phone, direction, format, message, status ('new'|'processed'|'declined'), is_business_inquiry, organization_name, business_status, created_at.

## Aналитика
- События: `enroll_click` (открыли модалку), `enroll_submit` (отправили, с направлением).
- Метрики: конверсия `click → submit`, `submit → processed`.

## Acceptance criteria
- [x] 201 + TG-уведомление (< 5 сек)
- [x] Admin видит заявку в списке
- [x] Rate-limit на 6-й запрос за минуту возвращает 429
- [ ] EnrollModal при 500 API показывает error (не fail-silent)
- [ ] Phone regex validation `^\+?[\d\s\-()]{10,}$`
- [ ] CAPTCHA / hCaptcha для защиты от ботов

## Test cases
| TC | Шаги | Ожидание |
|---|---|---|
| TC-APP-01 | Заполнить форму, submit | 201 + TG notification |
| TC-APP-02 | Submit без consent | Кнопка disabled |
| TC-APP-03 | 7 запросов за минуту с одного IP | Req 6 → 429 |
| TC-APP-04 | Submit с direction="Кибербезопасность" | В админке показывается правильно |
| TC-APP-05 | Mock API 500 | **Error UI показан, не success** |

## Риски
- Без CAPTCHA боты могут засыпать админку.
- `message` не ограничен длиной на фронте — сервер max 2000 (OK).
- SMS-phishing возможен: phone не валидируется → фейковые номера.
