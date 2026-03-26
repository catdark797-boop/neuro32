# Навык: Vercel Deployment

## Проблема

Vercel CLI требует интерактивный вход в браузер, который не работает в AI-терминале. 
Нужен альтернативный путь.

## Решение: GitHub + Vercel Dashboard

### Шаг 1: Код уже на GitHub
```bash
cd neuro32
gh repo create neuro32 --public --source=. --push
```

### Шаг 2: Подключить Vercel
1. Открыть https://vercel.com/new
2. Import Git Repository
3. Выбрать neuro32 из списка
4. Vercel автоматически определит Next.js
5. Deploy

### Шаг 3: После деплоя
1. Settings → Domains → Add Domain → neuro32.ru (когда купишь)
2. Settings → Environment Variables (добавить из .env.example)

## Альтернатива: Ручной деплой

1. Скачать https://github.com/catdark797-boop/neuro32 (Code → Download ZIP)
2. Распаковать
3. Загрузить папку на https://vercel.com/new

## Команды Vercel CLI

```bash
vercel login              # Интерактивный вход (не работает в терминале)
vercel --yes              # Быстрый деплой
vercel --prod             # Прод деплой
vercel env add KEY=VALUE  # Добавить переменную
vercel domains add neuro32.ru  # Добавить домен
```

## Для автоматизации нужен токен

Если есть токен Vercel, можно использовать API:
```bash
curl -X POST https://api.vercel.com/v13/deployments \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gitSource":{"type":"github","repo":"catdark797-boop/neuro32"}}'
```

Получить токен: https://vercel.com/account/tokens
