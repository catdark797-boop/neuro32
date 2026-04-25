# Нейро 32 — Руководство по проекту и деплою

## Стек

| Слой | Технология |
|------|-----------|
| Frontend | React 19 + Vite → статический SPA |
| Backend | Express 5 + Drizzle ORM + PostgreSQL |
| Авторизация | Session-based (express-session) |
| UI | shadcn/ui + TailwindCSS 4 + Framer Motion |
| Монорепо | pnpm workspaces |

---

## Команды разработки

```bash
# Установить зависимости
pnpm install

# Запустить сборку frontend (SPA → dist/public/)
pnpm --filter @workspace/neuro32 run build

# Запустить backend в dev-режиме (требует .env в artifacts/api-server/)
pnpm --filter @workspace/api-server run dev

# Применить схему БД (требует DATABASE_URL в .env)
pnpm --filter @workspace/db run push

# Проверка типов по всему монорепо
pnpm run typecheck
```

---

## Развёртывание на Яндекс-хостинге

### Архитектура деплоя

```
Браузер
  │
  ├─► mysite.ru  ──► Yandex Object Storage (статический SPA)
  │
  └─► api.mysite.ru ──► Yandex Cloud Compute VM (Docker-контейнер с Express)
                              │
                              └─► Yandex Managed PostgreSQL
```

---

### Шаг 1. Домен

**1.1 Купить домен** у любого регистратора (nic.ru, reg.ru, 2domains.ru и др.).
Пример: `mysite.ru`.

**1.2 Делегировать домен** — два варианта:

**Вариант А — DNS-серверы Яндекса:**
В личном кабинете регистратора замените NS-серверы вашего домена на:
```
ns1.yandexcloud.net
ns2.yandexcloud.net
```
После этого управляйте записями в **Yandex Cloud DNS** (console.yandex.cloud → Cloud DNS → Создать зону).

**Вариант Б — Оставить DNS у регистратора:**
Вручную добавьте нужные A/CNAME записи в панели регистратора (описано в шаге 6).

---

### Шаг 2. Бакет в Yandex Object Storage

1. Войдите в [Yandex Cloud Console](https://console.yandex.cloud).
2. Перейдите в **Object Storage → Создать бакет**.
3. **Имя бакета** укажите точно как домен: `mysite.ru` (это важно для CDN/домена).
4. Доступ: **Публичный**.
5. Нажмите **Создать**.
6. Откройте созданный бакет → **Веб-сайт** → включите режим статического сайта:
   - Главная страница: `index.html`
   - Страница ошибки: `404.html`
7. Сохраните.

---

### Шаг 3. Сборка проекта

```bash
# 1. Установить зависимости (если ещё не установлены)
pnpm install

# 2. Создать файл переменных окружения для frontend
cp artifacts/neuro32/.env.example artifacts/neuro32/.env.production.local
# Отредактируйте файл: укажите VITE_API_URL=https://api.mysite.ru

# 3. Собрать frontend (переменные из .env.production.local подхватятся автоматически)
pnpm --filter @workspace/neuro32 run build
```

После сборки в папке **`artifacts/neuro32/dist/public/`** будут:
- `index.html` — главная страница SPA
- `404.html` — копия index.html для SPA-роутинга (создаётся автоматически)
- `assets/` — JS/CSS/изображения

---

### Шаг 4. Заливка файлов в бакет

**Вариант А — Через веб-консоль:**
1. Откройте бакет в консоли.
2. Нажмите **Загрузить объекты**.
3. Перетащите содержимое папки `artifacts/neuro32/dist/public/` (все файлы и папку `assets/`).
4. Убедитесь, что все файлы имеют публичный доступ.

**Вариант Б — Через AWS CLI / YC CLI:**

```bash
# Установить AWS CLI (работает с Yandex Object Storage через совместимый S3 API)
# Настроить ~/.aws/credentials:
#   [default]
#   aws_access_key_id = <ваш access key>
#   aws_secret_access_key = <ваш secret key>

# Синхронизировать папку с бакетом
aws s3 sync artifacts/neuro32/dist/public/ \
  s3://mysite.ru/ \
  --endpoint-url https://storage.yandexcloud.net \
  --delete
```

Или через `yc`:
```bash
yc storage s3 sync \
  --source artifacts/neuro32/dist/public/ \
  --destination s3://mysite.ru \
  --delete
```

---

### Шаг 5. Настройка статического хостинга в бакете

(Если не сделано в шаге 2)

1. Откройте бакет → **Веб-сайт**.
2. Включите **Хостинг**.
3. Главная страница: `index.html`.
4. Страница ошибки: `404.html`.
5. Сохраните.

После этого сайт будет доступен по адресу:
`http://mysite.ru.website.yandexcloud.net`

---

### Шаг 6. Подключение домена

Нужно создать DNS-запись, указывающую ваш домен на бакет.

**Если DNS у Яндекса** (Cloud DNS):
1. Перейдите в Cloud DNS → ваша зона.
2. Создайте запись типа **ANAME** (или **CNAME** для `www`):
   - Имя: `mysite.ru` (или `@`)
   - Тип: ANAME
   - Значение: `mysite.ru.website.yandexcloud.net.`
3. Для `www`:
   - Имя: `www`
   - Тип: CNAME
   - Значение: `mysite.ru.website.yandexcloud.net.`

**Если DNS у регистратора:**
- Добавьте CNAME-запись:
  - Хост: `@` (или пустое поле для корневого домена)
  - Значение: `mysite.ru.website.yandexcloud.net`
- Для `www`:
  - Хост: `www`
  - Значение: `mysite.ru.website.yandexcloud.net`

> ⚠️ Некоторые регистраторы не поддерживают CNAME на корневом домене.
> В этом случае используйте делегирование на DNS Яндекса (шаг 1, вариант А).

---

### Шаг 7. HTTPS (бесплатный TLS-сертификат)

**7.1 Получить сертификат через Yandex Certificate Manager:**

1. Перейдите в **Certificate Manager → Создать сертификат → Let's Encrypt**.
2. Укажите домены: `mysite.ru` и `www.mysite.ru`.
3. Тип проверки: **DNS-challenge** (Яндекс создаст записи автоматически если DNS в Cloud DNS).
4. Дождитесь статуса **Issued** (обычно 5–15 минут).

**7.2 Привязать сертификат к бакету:**

1. Откройте бакет → **HTTPS** → **Настроить**.
2. Выберите ваш сертификат из Certificate Manager.
3. Сохраните.

После этого сайт будет доступен по `https://mysite.ru`.

---

### Шаг 8. Деплой backend (VM + Docker)

**8.1 Создать VM в Yandex Cloud Compute:**
- OS: Ubuntu 22.04 LTS
- Размер: 2 CPU, 2 GB RAM (стартовый)
- Публичный IP: да

**8.2 Настроить VM:**
```bash
# Подключиться по SSH
ssh ubuntu@<IP>

# Установить Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

# Создать директорию приложения
mkdir ~/neuro32 && cd ~/neuro32
```

**8.3 Залить код на сервер:**
```bash
# С вашей локальной машины:
scp -r . ubuntu@<IP>:~/neuro32/
```

**8.4 Создать .env файл:**
```bash
# На сервере:
cp artifacts/api-server/.env.example artifacts/api-server/.env
nano artifacts/api-server/.env
# Заполните все переменные (DATABASE_URL, SESSION_SECRET, ALLOWED_ORIGINS, и т.д.)
```

**8.5 Запустить:**
```bash
# Поднять сервисы (postgres + api)
docker compose up -d --build

# Применить схему БД (первый запуск)
docker compose exec api node -e "
  const { drizzle } = require('drizzle-orm/node-postgres');
  // или используйте drizzle-kit push из монорепо
"
# Проще — запустить push с хоста (нужен pnpm):
DATABASE_URL=postgresql://neuro32:localdev_password@localhost:5432/neuro32 \
  pnpm --filter @workspace/db run push

# Проверить логи
docker compose logs -f api
```

**8.6 Nginx reverse proxy (рекомендуется для HTTPS на API):**

```nginx
# /etc/nginx/sites-available/api.mysite.ru
server {
    listen 80;
    server_name api.mysite.ru;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.mysite.ru;

    ssl_certificate /etc/letsencrypt/live/api.mysite.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.mysite.ru/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Получить сертификат для API-домена через Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.mysite.ru
```

---

### Шаг 9. Финальная проверка

- [ ] `https://mysite.ru` открывается, SPA загружается
- [ ] Переход по прямой ссылке (например `/about`) работает (не 404)
- [ ] `https://api.mysite.ru/api/healthz` возвращает `{"status":"ok"}`
- [ ] Регистрация / вход работают
- [ ] Личный кабинет открывается после входа
- [ ] Админка открывается под admin-аккаунтом
- [ ] Кнопка оплаты перенаправляет на ЮMoney

---

## Переменные окружения

### Backend (`artifacts/api-server/.env`)

| Переменная | Обязательна | Описание |
|-----------|-------------|----------|
| `DATABASE_URL` | ✅ всегда | PostgreSQL connection string |
| `PORT` | ✅ всегда | Порт HTTP-сервера |
| `SESSION_SECRET` | ✅ всегда | Секрет для подписи сессионных кук (64+ символа) |
| `ALLOWED_ORIGINS` | ✅ в prod | Список разрешённых CORS-origins через запятую |
| `ADMIN_EMAIL` | ✅ в prod | Email первого admin-пользователя |
| `ADMIN_PASSWORD` | ✅ в prod | Пароль первого admin-пользователя |
| `YOOMONEY_RECEIVER` | Для оплаты | Номер кошелька ЮMoney |
| `YOOMONEY_SECRET` | Для оплаты | Секрет из настроек уведомлений ЮMoney |
| `FRONTEND_URL` | Для оплаты | URL фронтенда для редиректа после оплаты |
| `NODE_ENV` | — | `production` / `development` |

### Frontend (`artifacts/neuro32/.env.production.local`)

| Переменная | Описание |
|-----------|----------|
| `VITE_API_URL` | URL бэкенда, напр. `https://api.mysite.ru` |
| `BASE_PATH` | Базовый путь, обычно `/` |

---

## Безопасность (что сделано)

- ✅ Env-валидация при старте — сервер не запускается без критических переменных
- ✅ CORS ограничен списком из `ALLOWED_ORIGINS`
- ✅ Rate limiting: 20 попыток / 15 мин на `/auth/login` и `/auth/register`
- ✅ Пароли хешируются bcrypt (rounds=10)
- ✅ Сессии httpOnly cookies, `secure=true` в production
- ✅ Отзыв всех сессий через `DELETE /auth/sessions`
- ✅ Аудит-лог ключевых admin-действий
- ✅ SQL-инъекции исключены (Drizzle ORM parameterized queries)
- ✅ Сессии с revocation-проверкой при каждом запросе
