# SPEC.md — Спецификация проекта НЕЙРО32

## Концепция и видение

**НЕЙРО32** — премиальная офлайн-лаборатория ИИ-технологий в Новозыбкове. 
Это место, где технологии будущего становятся практическими навыками для жителей 
Брянской области. Дизайн — тёмный, неоновый, технологичный.

---

## Статус

**ДЕПЛОЙ**: ✅ Живой сайт — https://catdark797-boop.github.io/neuro32/

Хостинг: **GitHub Pages** (бесплатно, через GitHub Actions)
Деплой: автоматический при пуше в master

---

## Дизайн-система

### Цветовая палитра
- **Primary (Cyan)**: #06B6D4
- **Accent (Purple)**: #8B5CF6
- **Accent (Pink)**: #EC4899
- **Background**: #09090b
- **Surface**: #18181b
- **Border**: #27272a
- **Text**: #fafafa
- **Text Muted**: #a1a1aa

### Типографика
- **Заголовки**: Inter (Google Fonts), bold
- **Текст**: Inter, regular
- **Код**: JetBrains Mono

### Компоненты
- **Cards**: glassmorphism, hover-эффекты
- **Buttons**: default/secondary/outline/ghost, glow-эффекты
- **Badges**: цветные подсветки
- **Анимации**: CSS keyframes + IntersectionObserver scroll-reveal

---

## Страницы

| Маршрут | Название |
|---------|----------|
| `/` | Главная — Hero, программы, CTA |
| `/about` | О лаборатории |
| `/programs` | Все программы |
| `/kids` | Детям 7-12 лет |
| `/teens` | Подросткам 13-17 лет |
| `/adults` | Взрослым 18+ лет |
| `/cybersecurity` | Кибербезопасность |
| `/contacts` | Контакты + форма |
| `/expert` | О Денисе |
| `/dashboard` | Заглушка личного кабинета |
| `/reviews` | Заглушка отзывов |

---

## SEO

- metadataBase: https://neuro32.ru (пока catdark797-boop.github.io/neuro32)
- Schema.org: Organization + LocalBusiness
- sitemap.xml: статический
- robots.txt: статический
- OG Image: тёмная тема

---

## Стек

- Next.js 16.2.1 (App Router, static export)
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- Lucide React
- CSS-анимации (IntersectionObserver)

---

## Юридическия

- Самозанятый (ИП Марьянович Д.С.)
- НЕ используем: "образование", "обучение", "курсы", "уроки"
- Вместо них: "практические встречи", "освоение навыков"

---

## Следующие шаги

| Задача | Приоритет |
|--------|-----------|
| Купить домен neuro32.ru | Высокий |
| Привязать домен к GitHub Pages | Высокий |
| Добавить фото Дениса | Средний |
| Настроить ЮKassa | Средний |
| Настроить OAuth | Низкий |
| Заполнить контентом (если нужно) | По запросу |

---

## Команды

```bash
npm run dev    # Локальная разработка
npm run build  # Билд (output: export → папка out/)
npm run lint   # ESLint
```
