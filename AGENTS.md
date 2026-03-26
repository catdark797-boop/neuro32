# AGENTS.md — Инструкции для AI агентов

## Проект

**НЕЙРО32** — Лаборатория ИИ-технологий в Новозыбкове
- **Основатель**: Денис Степан Марьянович (самозанятый)
- **Стек**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, CSS-анимации
- **Деплой**: GitHub Pages (https://catdark797-boop.github.io/neuro32/)
- **Автодеплой**: при пуше в master через GitHub Actions

---

## Критические правила

1. **Билд после каждого изменения** — `npm run build` должен проходить
2. **Без фейковых данных** — проект только запущен
3. **Легальная терминология** — "практические встречи", не "обучение/курсы"
4. **CSS-анимации** — без GSAP/Framer Motion (SSR-конфликты)
5. **workdir** — всегда используй, никогда `cd`
6. **Static export** — `next.config.ts` настроен на `output: "export"` + `basePath: "/neuro32"`

---

## Команды

```bash
npm run dev    # localhost:3000
npm run build  # вывод в папку out/
npm run lint   # ESLint
```

---

## Структура

```
src/app/          — 11 страниц + sitemap + robots
src/components/   — animations, forms, layout, seo, ui
src/lib/         — utils.ts
public/           — og-image.svg, favicon.svg, logo.svg
.github/workflows/deploy.yml — автодеплой
```

---

## SEO для neuro32.ru

Когда купишь домен neuro32.ru:
1. Settings на GitHub Pages → Custom domain → neuro32.ru
2. DNS у регистратора: A-запись на GitHub Pages IP или CNAME
3. В `next.config.ts` убрать `basePath: "/neuro32"`
4. Обновить sitemap.ts и robots.ts URL на neuro32.ru
5. metadataBase в layout.tsx на https://neuro32.ru
