## Деплой backend на REG.RU (VPS / SSH)

Этот проект — API на Node.js (Express) + PostgreSQL.
На "виртуальный хостинг по FTP" backend не ставится. Нужен VPS/сервер с SSH и Docker.

### 1) Заливка кода на сервер

На ПК (Windows PowerShell), из `Solo-Learner\Solo-Learner`:

```powershell
cd "C:\Users\CatDark\Downloads\Solo-Learner\Solo-Learner"
tar -czf solo-learner.tgz --exclude=node_modules --exclude=dist --exclude=.env --exclude=".env.*" --exclude=".git" .
scp .\solo-learner.tgz u3486033@server217:~/
```

На сервере:

```bash
mkdir -p ~/solo-learner
tar -xzf ~/solo-learner.tgz -C ~/solo-learner
cd ~/solo-learner
```

### 2) Переменные окружения (обязательно)

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
nano artifacts/api-server/.env
```

Минимум для production:
- `DATABASE_URL` (удалённый PostgreSQL)
- `SESSION_SECRET` (случайная строка 64+ символов)
- `ALLOWED_ORIGINS=https://<ваш_домен>`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `FRONTEND_URL=https://<ваш_домен>`

### 3) Запуск API через Docker Compose

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f api
```

Проверка:

```bash
curl -fsS http://localhost:3000/api/healthz
```

### 4) (Опционально) Один сервер: фронт + API + HTTPS

Если хочешь поднимать всё на VPS (web+api+TLS), используй:

```bash
cp .env.regru.example .env.regru
nano .env.regru

docker compose -f docker-compose.regru.yml up -d --build
docker compose -f docker-compose.regru.yml logs -f caddy
```

