# Feature · VK-автопостинг и брендинг

## Цель и ценность
Регулярные обучающие + продающие посты в VK-сообществе [club237819583](https://vk.com/club237819583). Поддержка бренда, лидогенерация через SMM без ручного труда.

## User stories
1. Как админ, я запускаю скрипт → публикуется следующий из 10 заготовок.
2. Как подписчик VK, я вижу брендовую обложку + регулярный контент.
3. Опционально: cron-авто каждые 2-3 дня.

## Functional requirements
- `src/scripts/vk-brand.ts` — генерит обложку (1590×400 SVG → PNG), обновляет описание + website.
- `src/scripts/vk-autopost.ts` — берёт следующий `POSTS_SEED[idx]` из `settings.vk_next_post_idx`, рендерит image (1080×1080), пробует `uploadWallPhoto` (community-token ограничение: может не работать → fallback на text-only), публикует `wall.post`, инкрементит `idx`.
- `POSTS_SEED` — 10 текстов + выбранные шаблоны (tip/tool/announce).
- Визуал: amber + navy палитра, шрифт Arial (Noto Sans для кириллицы).

## Шаблоны постов
- **tip**: большой emoji, заголовок, body, tag «СОВЕТ ДНЯ»
- **tool**: иконка, название, tagline, 3 буллета с нумерованными кружками
- **announce**: большая дата + заголовок + sub

## Acceptance criteria
- [x] Обложка 1590×400 загружается на production (vk-brand)
- [x] Описание сообщества обновлено с адресом, ценами, контактами
- [x] 5 постов опубликовано в стене
- [ ] Cron-авто запуск (сейчас вручную)
- [ ] Картинки прикрепляются (сейчас text-only из-за VK community-token restrict)

## Test cases
| TC | Шаги | Ожидание |
|---|---|---|
| TC-VK-01 | `tsx src/scripts/vk-brand.ts` | Обложка применена |
| TC-VK-02 | `tsx src/scripts/vk-autopost.ts --dry-run` | PNG в /tmp + текст в консоли |
| TC-VK-03 | `tsx src/scripts/vk-autopost.ts` (prod) | Пост виден в VK, idx++ |

## Риски
- VK-API: community-token с 2FA требует периодической ротации.
- `photos.getWallUploadServer` community-restricted → text-only workaround.
- VK может поменять API / модерировать посты.
