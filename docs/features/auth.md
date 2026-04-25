# Feature · Auth (Registration / Login / Session)

## Цель и ценность
Аутентификация — вход в ЛК (`/lk`) и админ-панель (`/admin`). Основа для доступа к платным материалам, расписанию, оплате, персональным уведомлениям.

## Персоны
- Ученик (user) — вход в свой ЛК.
- Администратор (admin) — вход в админку.

## User stories
1. Как посетитель, я могу зарегистрироваться (email + пароль) чтобы получить ЛК.
2. Как ученик, я могу войти по email/паролю и попасть в ЛК.
3. Как админ, я могу войти под `catdark797@gmail.com` / _(env-password)_ и попасть в /admin.
4. Как ученик, я могу выйти и оказаться на главной.
5. Как ученик, я могу сменить пароль (нужно ввести текущий + новый × 2).
6. Как ученик, я могу «Выйти со всех устройств» → все сессии инвалидируются.

## Functional requirements
- `POST /api/auth/register {name, email, phone, password}` → 201 + Set-Cookie.
- `POST /api/auth/login {email, password}` → 200 + Set-Cookie. `email` не начинается с `@`.
- `POST /api/auth/logout` → 200, очистка cookie.
- `GET /api/auth/me` → 200 current user или 401.
- `DELETE /api/auth/sessions` → ревок всех сессий + logout.
- `POST /api/users/:id/change-password {currentPassword, newPassword}`.
- Cookie: `HttpOnly, Secure (prod), SameSite=None (prod)`, TTL 30 дней.
- Session store: connect-pg-simple в Postgres (table `session`).
- Rate-limit: 20 попыток / 15 мин на `/auth/login` и `/auth/register`.

## UX/UI
- `/auth` — 2 mode: Login / Register, переключение табом.
- Ошибки inline: «Неверный email или пароль», «Пользователь существует».
- Password minimum 8 символов (валидация на фронте + backend).
- После register сразу автоматический login + redirect в /lk (/admin для admin).

## API контракт (Zod)
```typescript
LoginBody      { email: string, password: string.min(6) }
RegisterBody   { name, email: string.email(), phone, password: string.min(8) }
LoginResponse  { id, name, email, phone, telegram, role, direction, goals, registeredAt }
```

## Data модель
`users`: id, name, email (UNIQUE), phone, telegram, password_hash (bcrypt 12), role ('user'|'admin'), direction, goals, avatar_url, session_invalidated_before, created_at.

## Acceptance criteria
- [x] Login возвращает 200 + cookie с production-Origin
- [x] `/api/auth/me` с cookie возвращает 200 и user-объект
- [x] Cookie сохраняется в Postgres (не в памяти)
- [x] После register cookie установлена, ЛК сразу рендерит user
- [x] После logout cookie `connect.sid` удаляется
- [ ] Password policy min(8) enforce'ится на register (сейчас min(6))
- [ ] CSRF-токен при мутациях (сейчас опирается только на SameSite/credentials)

## Test cases
| TC | Шаги | Ожидание |
|---|---|---|
| TC-AUTH-01 | POST /login валидные creds | 200 + Set-Cookie |
| TC-AUTH-02 | POST /login неверный пароль | 401 `Неверный email или пароль` |
| TC-AUTH-03 | POST /register с `@handle` | 400 + сообщение «корректный email» |
| TC-AUTH-04 | GET /me без cookie | 401 |
| TC-AUTH-05 | DELETE /sessions → GET /me | 401 (сессия инвалидирована) |
| TC-AUTH-06 | Browser: login → /admin → /api/applications | 200, реальный список |

## Риски
- Cookie SameSite=None требует HTTPS на обоих доменах → строгий prerequisite.
- connect-pg-simple ищет `table.sql` которого нет в нашем Docker-образе → мы решили через `createTableIfMissing: false` + ручная миграция.
- Session store single-point-of-failure → zero replica.
