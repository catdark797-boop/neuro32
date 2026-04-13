import { usePageMeta } from '../hooks/usePageMeta';
import Roadmap from '../components/Roadmap';
import { ProgramHero, TrustMini, ProjectCardsSection, ProgramFAQ, ProgramRoadmap } from '../components/ProgramBlocks';
import type { Phase } from '../components/Roadmap';
import type { RoadmapPhase } from '../components/ProgramBlocks';

const MILESTONE_PHASES: RoadmapPhase[] = [
  { num: '01', title: 'Знакомство', sub: 'Занятия 1–8', milestone: 'Первая ИИ-история и трек', skills: ['ГигаЧат', 'Шедеврум', 'промпты'], type: 'theory' },
  { num: '02', title: 'Творчество', sub: 'Занятия 9–16', milestone: 'Мини-мультфильм и Scratch-игра', skills: ['Suno AI', 'ElevenLabs', 'Scratch'], type: 'practice' },
  { num: '03', title: 'Портфолио', sub: 'Занятия 17–24', milestone: 'Сертификат участника + 4 проекта 🎓', skills: ['Kling AI', 'Медиаграмотность'], type: 'project' },
];

const PHASES: Phase[] = [
  {
    num: '01', title: 'ЗНАКОМСТВО С ИИ · БАЗОВЫЙ', sub: 'Занятия 1–6 · 3 недели · Возраст 7–9 лет',
    chip: { label: 'Вводный блок', cls: 'ch-amber' },
    sessions: [
      { n: 'Занятие 1', t: 'Что такое ИИ?', d: 'Знакомство: голосовые помощники, рекомендации YouTube, автоперевод. Пробуем Яндекс Алису вживую — задаём вопросы, слушаем ответы, находим ошибки.', tags: ['Теория 20%', 'Практика 80%', 'Алиса'], type: 'online' },
      { n: 'Занятие 2', t: 'Алиса умеет всё?', d: 'Работаем с Яндекс Алисой 60 минут. Загадки, сочинение стихов, математика. Создаём «карту суперсил Алисы».', tags: ['Яндекс Алиса', 'Исследование'], type: 'online' },
      { n: 'Занятие 3', t: 'ИИ рисует!', d: 'Первые генерации в Шедевруме. «Дракон в Новозыбкове», «кот-астронавт». Учимся описывать картинку словами — это и есть промпт.', tags: ['Шедеврум', 'Первый промпт'], type: 'online' },
      { n: 'Занятие 4', t: 'Говорим с ГигаЧатом', d: 'Открываем ГигаЧат. Просим рассказать сказку про нас, загадать загадку. Учимся формулировать вопрос точнее.', tags: ['ГигаЧат', 'Диалог'], type: 'online' },
      { n: 'Занятие 5', t: 'Правила цифровой безопасности', d: 'Что нельзя говорить ИИ: имя, адрес, телефон. Галлюцинации ИИ. Правило «трёх проверок».', tags: ['Безопасность', 'Обязательно'], type: 'warn' },
      { n: 'Занятие 6', t: 'Мой первый ИИ-проект', d: 'Создаём иллюстрированную мини-историю: 3 страницы текста + 3 картинки. Первое «портфолио».', tags: ['Проект', 'Портфолио'], type: 'project' },
    ]
  },
  {
    num: '02', title: 'ТВОРЧЕСТВО С ИИ', sub: 'Занятия 7–14 · 4 недели',
    chip: { label: 'Практика', cls: 'ch-blue' },
    sessions: [
      { n: 'Занятие 7', t: 'Сочиняем истории вместе с ИИ', d: 'Метод «ИИ-соавтор»: ребёнок придумывает завязку, ИИ продолжает. Создаём серию из 5 эпизодов.', tags: ['ГигаЧат', 'Сторителлинг'], type: 'online' },
      { n: 'Занятие 8', t: 'ИИ-комикс', d: 'Рисуем серию из 6 картинок по нашей истории. Добавляем подписи через ГигаЧат.', tags: ['Шедеврум', 'Кандинский'], type: 'online' },
      { n: 'Занятие 9', t: 'ИИ поёт — Suno AI', d: 'Suno AI — генерация музыки. Придумываем слова для песни через ГигаЧат, вставляем в Suno.', tags: ['Suno AI', 'Музыка'], type: 'online' },
      { n: 'Занятие 10', t: 'Мой ИИ-питомец', d: 'Создаём образ виртуального питомца: рисуем внешность, придумываем имя, характер. «Паспорт питомца».', tags: ['Итерация промптов'], type: 'online' },
      { n: 'Занятие 11', t: 'Говорящий ИИ — ElevenLabs', d: 'Синтез речи в ElevenLabs. Наш питомец теперь говорит!', tags: ['ElevenLabs', 'Синтез речи'], type: 'online' },
      { n: 'Занятие 12', t: 'ИИ-мультфильм — Kling AI', d: 'Превращаем нашу лучшую картинку в 5-секундный видеоклип. Монтируем 3 клипа в одну историю.', tags: ['Kling AI', 'Видео'], type: 'online' },
      { n: 'Занятие 13', t: 'Шахматы и логика ИИ', d: 'Как ИИ принимает решения в играх? Играем против ИИ в шахматы, анализируем ходы.', tags: ['Логика', 'Алгоритмы'], type: 'online' },
      { n: 'Занятие 14', t: 'Защита большого проекта', d: 'Итоговая работа модуля: иллюстрированная история с озвучкой и музыкой. Первые аплодисменты!', tags: ['Защита', 'Сертификат этапа'], type: 'project' },
    ]
  },
  {
    num: '03', title: 'КОД И ЛОГИКА', sub: 'Занятия 15–24 · 5 недель',
    chip: { label: 'Продвинутый', cls: 'ch-green' },
    sessions: [
      { n: 'Занятие 15', t: 'Знакомство со Scratch', d: 'Блочное программирование. Создаём первую игру — «Поймай бота». ИИ объясняет код простыми словами.', tags: ['Scratch', 'Программирование'], type: 'online' },
      { n: 'Занятие 16', t: 'Анимации и персонажи', d: 'Добавляем персонажей, анимации, звуки. Учим ИИ помогать придумывать правила игры.', tags: ['Scratch', 'Геймдизайн'], type: 'online' },
      { n: 'Занятие 17–20', t: 'Мини-игра с ИИ-помощником', d: '4 занятия: проектируем и создаём полноценную мини-игру. ИИ — помощник в дизайне и логике.', tags: ['Проект'], type: 'project' },
      { n: 'Занятие 21–23', t: 'ИИ-новости и факт-чекинг', d: 'Как отличить настоящее от сгенерированного. Создаём собственный ИИ-журнал.', tags: ['Медиаграмотность', 'Критмышление'], type: 'online' },
      { n: 'Занятие 24', t: 'Финальная защита — Выпускной!', d: 'Итоговый проект перед родителями. Сертификат участника Нейро 32. Фотосессия!', tags: ["Выпускной", "Сертификат"], type: 'project' },
    ]
  }
];

const PROJECTS = [
  { icon: '🎨', name: 'Иллюстрированная история', tool: 'Шедеврум + ГигаЧат' },
  { icon: '🎵', name: 'Авторский музыкальный трек', tool: 'Suno AI' },
  { icon: '🎬', name: 'Мини-мультфильм', tool: 'Kling AI' },
  { icon: '🎮', name: 'Компьютерная игра', tool: 'Scratch' },
];

const FAQ = [
  { q: 'Какой возраст подходит?', a: '7–12 лет. Для 7–9 — базовый трек (Алиса, Шедеврум, ГигаЧат), для 10–12 — расширенный (Scratch, Kling AI, ElevenLabs). Разбивку делаем на первом занятии.' },
  { q: 'Нужен ли свой компьютер или планшет?', a: 'Нет. В лаборатории 4 компьютера с установленным программным обеспечением. Всё готово — приходите.' },
  { q: 'Ребёнок совсем без опыта с технологиями — потянет?', a: 'Потянет. Начинаем с Яндекс Алисы — её знают все дети. Задачи подобраны так, чтобы первый успех случился уже на первом занятии.' },
  { q: 'Что ребёнок получит по итогу курса?', a: 'Иллюстрированную историю, музыкальный трек, мини-мультфильм, компьютерную игру — и сертификат участника Нейро 32. Всё это — его первое настоящее портфолио.' },
  { q: 'Кто ведёт занятия с детьми?', a: 'Занятия ведёт Степан. Формат — игровой: дети работают в парах, 4 компьютера на 8 человек — сразу учатся командной работе.' },
  { q: 'Насколько безопасны темы и контент?', a: 'Полностью безопасно и адаптировано по возрасту. Используются только проверенные инструменты (Алиса, Шедеврум, Suno AI). Все темы — творческие: рисование, музыка, анимация, игры.' },
  { q: 'Будут ли отчёты для родителей?', a: 'Да. После каждого блока из 6 занятий родители получают отчёт с описанием того, что сделал ребёнок, и ссылками на его проекты.' },
];

const RIGHT_COL = (
  <>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" style={{ display: 'block', marginBottom: 20, borderRadius: 20 }} aria-label="Дети создают с ИИ">
      <rect width="380" height="200" rx="16" fill="#0d0d1f"/>
      <circle cx="60" cy="100" r="38" fill="rgba(240,165,0,.07)" stroke="rgba(240,165,0,.18)" strokeWidth="1"/>
      <circle cx="190" cy="100" r="38" fill="rgba(74,124,255,.07)" stroke="rgba(74,124,255,.18)" strokeWidth="1"/>
      <circle cx="320" cy="100" r="38" fill="rgba(45,158,107,.07)" stroke="rgba(45,158,107,.18)" strokeWidth="1"/>
      <text x="60" y="96" textAnchor="middle" fontSize="22" fill="#f0a500">🎨</text>
      <text x="60" y="115" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.4)" fontFamily="monospace">Шедеврум</text>
      <text x="190" y="96" textAnchor="middle" fontSize="22" fill="#4a7cff">🎵</text>
      <text x="190" y="115" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.4)" fontFamily="monospace">Suno AI</text>
      <text x="320" y="96" textAnchor="middle" fontSize="22" fill="#2d9e6b">🎬</text>
      <text x="320" y="115" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.4)" fontFamily="monospace">Kling AI</text>
      <line x1="98" y1="100" x2="152" y2="100" stroke="rgba(255,255,255,.08)" strokeWidth="1" strokeDasharray="4 3"/>
      <line x1="228" y1="100" x2="282" y2="100" stroke="rgba(255,255,255,.08)" strokeWidth="1" strokeDasharray="4 3"/>
      <text x="190" y="178" textAnchor="middle" fontSize="9" fill="rgba(240,165,0,.5)" fontFamily="monospace">СОЗДАЁМ · УЧИМСЯ · ТВОРИМ</text>
    </svg>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        { icon: '✓', text: 'Рисует картины и сочиняет истории с ИИ' },
        { icon: '✓', text: 'Создаёт музыку в Suno AI' },
        { icon: '✓', text: 'Делает мультфильм в Kling AI' },
        { icon: '✓', text: 'Знает правила цифровой безопасности' },
      ].map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px' }}>
          <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '.82rem' }}>{it.icon}</span>
          <span style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.4 }}>{it.text}</span>
        </div>
      ))}
    </div>
  </>
);

export default function Kids({ onEnroll }: { onEnroll?: (p?: string) => void }) {
  usePageMeta('ИИ для детей 7–12', 'Офлайн-занятия по ИИ для детей 7–12 лет в Новозыбкове. Шедеврум, ГигаЧат, Suno AI, Scratch. 24 занятия · 5 500 ₽/мес. Пробное — 500 ₽.', '/kids');
  return (
    <div>
      <ProgramHero
        badge="Для детей · 7–12 лет"
        headline={
          <h1 style={{ fontFamily: 'var(--fu)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>🤖</span>ИИ ДЛЯ <span style={{ color: 'var(--amber)' }}>ДЕТЕЙ</span>
          </h1>
        }
        description="Через 3 месяца ребёнок создаст иллюстрированную историю, музыкальный трек, мультфильм и игру — и полюбит технологии. Никаких лекций: 80% времени — живая практика."
        chips={<>
          <span className="chip ch-green" style={{ fontWeight: 600 }}>🟢 Набор открыт · Старт 4 мая</span>
          <span className="chip ch-amber">7–12 лет</span>
          <span className="chip ch-green">24 занятия · 3 мес · 2 раза/нед</span>
          <span className="chip ch-amber">5 500 ₽/мес</span>
        </>}
        rightCol={RIGHT_COL}
        variant="kids"
        program="Дети 7–12"
        slots={3}
        enrollLabel="Записать ребёнка на пробное →"
        onEnroll={onEnroll}
        shareTitle="ИИ для детей 7–12 — Нейро 32"
        shareText="Офлайн-лаборатория ИИ-практик в Новозыбкове. Дети 7–12 лет. Старт 4 мая."
        breadcrumb={[{ label: 'Главная', href: '/' }, { label: 'Программы', href: '/#programs' }, { label: 'ИИ для детей 7–12' }]}
        progressSteps={['Знакомство', 'Творчество', 'Портфолио']}
        progressActive={0}
      />

      <ProjectCardsSection
        title="За 3 месяца ребёнок создаст 4 настоящих проекта"
        promise="Не учебные упражнения — творческие работы, которые можно показать друзьям и положить в первое портфолио."
        items={PROJECTS}
      />

      <ProgramRoadmap
        phases={MILESTONE_PHASES}
        eyebrow="Программа · 3 этапа · 24 занятия"
        title="Путь от новичка до первого портфолио"
      />

      <div className="roadmap-wrap">
        <div className="s-eyebrow" style={{ marginTop: 0 }}>Детальная программа</div>
        <h2 className="s-h2" style={{ marginBottom: 32 }}>Что на <span className="accent">каждом занятии</span></h2>
        <div className="rm-intro">
          Каждое занятие — 60–90 минут офлайн в Новозыбкове. 4 компьютера, реальные инструменты. Практика/теория: 80/20.
        </div>
        <Roadmap phases={PHASES} />
        <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-amber btn-lg" onClick={() => onEnroll?.('Дети 7–12')}>Записать ребёнка на пробное →</button>
          <TrustMini />
        </div>
      </div>

      <ProgramFAQ items={FAQ} />

      <style>{`@media(max-width:768px){.prog-hero-grid{grid-template-columns:1fr!important;padding:40px 24px!important;}}`}</style>
    </div>
  );
}
