import { usePageMeta } from '../hooks/usePageMeta';
import Roadmap from '../components/Roadmap';
import { ProgramHero, TrustMini, ProjectCardsSection, ProgramFAQ, ProgramRoadmap, CourseJsonLd } from '../components/ProgramBlocks';
import OutcomesGallery from '../components/OutcomesGallery';
import type { Phase } from '../components/Roadmap';
import type { RoadmapPhase } from '../components/ProgramBlocks';
import { Bot, Settings, Mic, BarChart2, CheckCircle2 } from 'lucide-react';

const MILESTONE_PHASES: RoadmapPhase[] = [
  { num: '01', title: 'Основы', sub: 'Занятия 1–9', milestone: 'Первый промпт-сет и ГигаЧат-бот', skills: ['ChatGPT', 'ГигаЧат', 'промпты'], type: 'theory' },
  { num: '02', title: 'Программирование', sub: 'Занятия 10–18', milestone: 'Рабочий Telegram-бот', skills: ['Python', 'aiogram'], type: 'practice' },
  { num: '03', title: 'Автоматизация', sub: 'Занятия 19–27', milestone: 'Make.com-сценарий для реальной задачи', skills: ['Make.com', 'ElevenLabs'], type: 'practice' },
  { num: '04', title: 'Питч', sub: 'Занятия 28–36', milestone: 'Портфолио из 5 проектов', skills: ['Питч', 'Портфолио'], type: 'project' },
];

const PHASES: Phase[] = [
  {
    num: '01', title: 'ОСНОВЫ ИИ И ПРОМПТ-ИНЖИНИРИНГ', sub: 'Занятия 1–8 · 4 недели',
    chip: { label: 'Фундамент', cls: 'ch-amber' },
    sessions: [
      { n: 'Занятие 1', t: 'Как работает ИИ изнутри', d: 'Нейронные сети простыми словами: веса, слои, обучение. Почему GPT-4 умнее Алисы?', tags: ['Теория', 'ChatGPT', 'ГигаЧат'], type: 'online' },
      { n: 'Занятие 2', t: 'Мастерство промпта — базовый', d: 'RPCQ-формула: Роль, Промпт, Контекст, Качество. Пишем 20 промптов для разных задач.', tags: ['Промпт-инжиниринг'], type: 'online' },
      { n: 'Занятие 3', t: 'Промпт — продвинутый', d: 'Chain-of-Thought, few-shot, zero-shot. Системные промпты. Сравниваем: GPT-4o vs Gemini vs ГигаЧат.', tags: ['Сравнение моделей', 'Chain-of-Thought'], type: 'online' },
      { n: 'Занятие 4', t: 'ИИ для учёбы и творчества', d: 'Как использовать ИИ честно: объяснение сложных тем, генерация задач для самопроверки.', tags: ['Учёба', 'Perplexity'], type: 'online' },
      { n: 'Занятие 5', t: 'Медиаграмотность: фейк vs реал', d: 'Deepfake детектирование, проверка изображений, SORA-видео. Создаём собственный deepfake-обзор.', tags: ['⚠️ Безопасность', 'Deepfake', 'Факт-чекинг'], type: 'warn' },
      { n: 'Занятие 6', t: 'ИИ-копирайтинг', d: 'Пишем тексты для VK, Telegram, резюме с ИИ. A/B-тест: с ИИ vs без. Учим ИИ звучать «как ты».', tags: ['Контент', 'VK', 'Telegram'], type: 'online' },
      { n: 'Занятие 7', t: 'Визуальный ИИ', d: 'Продвинутые промпты для Шедеврума и Кандинского. Стили, негативные промпты, seed.', tags: ['Шедеврум', 'Кандинский'], type: 'online' },
      { n: 'Занятие 8', t: '✓ Проект: ИИ-портфолио', d: 'Создаём профессиональное портфолио: о себе, навыки, 3 лучших работы. Оформление через Gamma.app.', tags: ['✓ Проект', 'Портфолио', 'Gamma.app'], type: 'project' },
    ]
  },
  {
    num: '02', title: 'PYTHON И ИИ-БОТЫ', sub: 'Занятия 9–15 · 3,5 недели',
    chip: { label: 'Код', cls: 'ch-blue' },
    sessions: [
      { n: 'Занятие 9', t: 'Что такое ИИ-агент?', d: 'Агенты: планирование, инструменты, память. AutoGPT, AgentGPT. Создаём первого простого агента.', tags: ['ИИ-агенты', 'AutoGPT'], type: 'online' },
      { n: 'Занятие 10', t: 'Python: основы за занятие', d: 'Переменные, циклы, функции, списки. Пишем первую программу — ИИ-генератор идей.', tags: ['Python'], type: 'online' },
      { n: 'Занятие 11', t: 'Python + OpenAI API', d: 'Подключаем GPT-4 через API. Пишем скрипт, который отвечает на вопросы и делает резюме.', tags: ['Python', 'API', 'OpenAI'], type: 'online' },
      { n: 'Занятие 12', t: 'Telegram-бот: старт', d: 'BotFather, aiogram, деплой на Replit. Бот принимает вопросы и отвечает через GPT.', tags: ['Telegram Bot', 'aiogram'], type: 'online' },
      { n: 'Занятие 13–14', t: 'Telegram-бот: функции и кнопки', d: 'Добавляем кнопки, логику, базу данных. Бот реально работает — можно показать друзьям.', tags: ['Python', 'Telegram Bot', 'SQLite'], type: 'online' },
      { n: 'Занятие 15', t: '✓ Проект: рабочий Telegram-бот', d: 'Финишируем бота. Деплой, тест, запуск. Публикуем в свой Telegram-канал.', tags: ['✓ Проект', 'Деплой'], type: 'project' },
    ]
  },
  {
    num: '03', title: 'АВТОМАТИЗАЦИЯ И МЕДИА', sub: 'Занятия 16–26 · 5,5 недели',
    chip: { label: 'Без кода', cls: 'ch-green' },
    sessions: [
      { n: 'Занятие 16–18', t: 'Make.com — визуальная автоматизация', d: 'Сценарии без кода: автопостинг в VK, Telegram-рассылка, парсинг новостей + ИИ-резюме.', tags: ['Make.com', 'Автоматизация'], type: 'online' },
      { n: 'Занятие 19', t: 'Видео- и аудиопродакшн с ИИ', d: 'Kling AI, ElevenLabs, Riffusion. Снимаем 30-секундный ролик о своём проекте.', tags: ['Kling AI', 'ElevenLabs', 'Видео'], type: 'online' },
      { n: 'Занятие 20–23', t: 'Командный ИИ-проект', d: 'Команды по 2–3 чел. Придумываем и реализуем проект: бот, автоматизация, веб-страница с ИИ.', tags: ['Командная работа', 'Проект'], type: 'project' },
      { n: 'Занятие 24–26', t: 'Презентация и питч-декк', d: 'Gamma.app для презентации. Структура питча: проблема, решение, демо, цифры. Репетируем.', tags: ['Gamma.app', 'Питч', 'Презентация'], type: 'online' },
    ]
  },
  {
    num: '04', title: 'ДЕМО-ДЕНЬ И ПОРТФОЛИО', sub: 'Занятия 27–36 · 5 недель',
    chip: { label: 'Финал', cls: 'ch-amber' },
    sessions: [
      { n: 'Занятие 27–30', t: 'Доработка финального проекта', d: 'Полировка, тест, исправление ошибок. Степан-ментор помогает довести до идеала.', tags: ['Менторство', 'Проект'], type: 'online' },
      { n: 'Занятие 31–33', t: 'Карьера с ИИ: навыки 2026', d: 'Какие профессии с ИИ востребованы. Как оформить портфолио для вуза и работодателя.', tags: ['Карьера', 'Портфолио'], type: 'online' },
      { n: 'Занятие 34–35', t: 'Генеральная репетиция', d: 'Прогон перед демо-днём. Таймер, вопросы, обратная связь от группы.', tags: ['Презентация', 'Обратная связь'], type: 'online' },
      { n: 'Занятие 36', t: '🏆 Демо-день: защита проектов', d: 'Публичная защита перед приглашёнными. Сертификат участника Нейро 32. Рекомендательное письмо.', tags: ['✓ Демо-день', 'Сертификат'], type: 'project' },
    ]
  }
];

const PROJECTS = [
  { icon: <Bot size={22} className="icon-amber" />, name: 'Telegram-бот для школы или хобби', tool: 'Python + Telegram API' },
  { icon: <Settings size={22} className="icon-amber" />, name: 'Автопостинг в VK без кода', tool: 'Make.com' },
  { icon: <Mic size={22} className="icon-amber" />, name: '30-сек видеопрезентация проекта', tool: 'Kling AI + ElevenLabs' },
  { icon: <BarChart2 size={22} className="icon-amber" />, name: 'Питч-дек стартапа', tool: 'Gamma.app' },
];

const FAQ = [
  { q: 'Нужно ли знать программирование?', a: 'Нет. Python появляется только на 10-м занятии — когда уже понятна общая логика. До этого работаем без кода: промпты, Make.com, Gamma.' },
  { q: 'Это поможет при поступлении в вуз?', a: 'Да. Портфолио с рабочими проектами — конкретное преимущество. Плюс сертификат участника и рекомендательное письмо от Нейро 32.' },
  { q: 'Можно ли без своего ноутбука?', a: 'Можно. Лаборатория оснащена всем необходимым. Ноутбук пригодится только для самостоятельных экспериментов дома.' },
  { q: 'Что такое «демо-день»?', a: 'Финальная публичная защита перед приглашёнными — как в стартап-акселераторе. Подросток рассказывает о проекте, отвечает на вопросы и получает сертификат участника Нейро 32.' },
  { q: 'Смогу ли использовать проекты для портфолио?', a: 'Да. Вы создадите 5+ реальных проектов: Telegram-бот, автоматизацию на Make.com, питч-дек. Всё это — конкретные работы, которые можно показать при поступлении или устройстве на работу.' },
  { q: 'Поможет ли курс при выборе профессии?', a: 'Поможет. На занятиях вы примерите разные роли: разработчик бота, автоматизатор процессов, дизайнер презентаций. Это помогает понять, что нравится. Плюс навыки ИИ востребованы в любой сфере.' },
];

const RIGHT_COL = (
  <>
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 20, border: '1px solid rgba(74,124,255,.2)' }}>
      <picture>
        <source srcSet="/gen/teens-bg.webp" type="image/webp" />
        <img src="/gen/teens-bg.jpg" alt="ИИ для подростков" width={1600} height={700} style={{ display: 'block', width: '100%', height: 220, objectFit: 'cover', objectPosition: 'center', aspectRatio: '1600/700' }} loading="lazy" decoding="async" />
      </picture>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,24,.5) 0%, rgba(10,10,24,.2) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['🤖 Python API', '⚙️ Make.com', '💬 Telegram-бот'].map((t) => (
          <span key={t} style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: '#fff', background: 'rgba(74,124,255,.2)', border: '1px solid rgba(74,124,255,.35)', borderRadius: 6, padding: '4px 9px', backdropFilter: 'blur(8px)' }}>{t}</span>
        ))}
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        { text: 'Telegram-бот, который реально работает' },
        { text: 'Навык автоматизации без кода' },
        { text: 'Портфолио из 5+ проектов' },
        { text: 'Сертификат участника + рекомендательное письмо' },
      ].map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px' }}>
          <CheckCircle2 size={15} style={{ color: 'var(--cobalt)', flexShrink: 0 }} />
          <span style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.4 }}>{it.text}</span>
        </div>
      ))}
    </div>
  </>
);

export default function Teens({ onEnroll }: { onEnroll?: (p?: string) => void }) {
  usePageMeta('ИИ для подростков 13–17', 'Офлайн-занятия по ИИ для подростков 13–17 лет в Новозыбкове. Python, Telegram-боты, Make.com. Портфолио из 5 проектов. 36 занятий · 7 000 ₽/мес.', '/teens');
  return (
    <div>
      <CourseJsonLd
        name="ИИ для подростков 13–17 лет"
        description="Офлайн-курс ИИ-практик для подростков: Python, Telegram-боты, Make.com автоматизация. 36 занятий за 4 месяца, итог — портфолио из 5 проектов."
        url="https://xn--32-mlcqsin.xn--p1ai/teens"
        price={7000}
        sessions={36}
        weeks={16}
        level="Intermediate"
        audience="HighSchool"
      />
      <ProgramHero
        badge="Для подростков · 13–17 лет"
        headline={
          <h1 style={{ fontFamily: 'var(--fu)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--fm)', color: 'var(--cobalt)', fontWeight: 600, marginRight: 10, fontSize: '0.8em' }}>{'</>'}</span>ИИ ДЛЯ <span style={{ color: 'var(--amber)' }}>ПОДРОСТКОВ</span>
          </h1>
        }
        description="За 4–5 месяцев соберёшь боевое портфолио: свой Telegram-бот, автоматизация под себя, презентация-питч. Сертификат, который реально замечают HR и приёмные комиссии — с доказательствами в виде работающих проектов, а не сертификата «сидел на занятиях»."
        chips={<>
          <span className="chip ch-green" style={{ fontWeight: 600 }}>Набор открыт · Запись на пробное</span>
          <span className="chip ch-blue">13–17 лет</span>
          <span className="chip ch-green">36 занятий · 4–5 мес · 2 раза/нед</span>
          <span className="chip ch-amber">7 000 ₽/мес</span>
          <span className="chip ch-dim">5+ проектов</span>
        </>}
        rightCol={RIGHT_COL}
        variant="teens"
        program="Подростки 13–17"
        slots={4}
        enrollLabel="Записаться на пробное →"
        onEnroll={onEnroll}
        shareTitle="ИИ для подростков 13–17 — Нейро 32"
        shareText="Офлайн-лаборатория ИИ-практик в Новозыбкове. Подростки 13–17 лет. Набор открыт."
        breadcrumb={[{ label: 'Главная', href: '/' }, { label: 'Программы', href: '/#programs' }, { label: 'ИИ для подростков' }]}
        progressSteps={['Основы', 'Программирование', 'Автоматизация', 'Питч']}
        progressActive={0}
      />

      <ProjectCardsSection
        title="Через 4–5 месяцев — портфолио с реальными проектами"
        promise="Не учебные задачи — рабочие инструменты: бот, который отвечает, автоматизация, которая работает, питч, который можно показать."
        items={PROJECTS}
      />

      <OutcomesGallery program="teens" />

      <ProgramRoadmap
        phases={MILESTONE_PHASES}
        eyebrow="Программа · 4 этапа · 36 занятий"
        title="От первого промпта до демо-дня"
      />

      <div className="roadmap-wrap">
        <div className="s-eyebrow" style={{ marginTop: 0 }}>Детальная программа</div>
        <h2 className="s-h2" style={{ marginBottom: 32 }}>Что на <span className="accent">каждом занятии</span></h2>
        <div className="rm-intro">
          Подростки работают в командах, создают реальные боты и автоматизации. Портфолио из 5+ проектов. Всё используется в реальной жизни — не учебные задачи.
        </div>
        <Roadmap phases={PHASES} />
        <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-amber btn-lg" onClick={() => onEnroll?.('Подростки 13–17')}>Записаться на пробное →</button>
          <TrustMini />
        </div>
      </div>

      <ProgramFAQ items={FAQ} />


    </div>
  );
}
