import { usePageMeta } from '../hooks/usePageMeta';
import Roadmap from '../components/Roadmap';
import { ProgramHero, TrustMini, ProjectCardsSection, ProgramFAQ, ProgramRoadmap } from '../components/ProgramBlocks';
import type { Phase } from '../components/Roadmap';
import type { RoadmapPhase } from '../components/ProgramBlocks';

const MILESTONE_PHASES: RoadmapPhase[] = [
  { num: '01', title: 'Инструменты', sub: 'Занятия 1–8', milestone: 'Экономишь 3+ часа в неделю', skills: ['ChatGPT', 'Notion AI', 'Gamma'], type: 'theory' },
  { num: '02', title: 'Автоматизация', sub: 'Занятия 9–16', milestone: 'Make.com-сценарий в рабочем процессе', skills: ['Make.com', 'CRM'], type: 'practice' },
  { num: '03', title: 'Медиа и контент', sub: 'Занятия 17–24', milestone: 'Личный медиа-продукт с ElevenLabs', skills: ['ElevenLabs', 'HeyGen'], type: 'practice' },
  { num: '04', title: 'Итог', sub: 'Занятия 25–32', milestone: 'Сертификат практика 🏆', skills: ['Питч'], type: 'project' },
];

const PHASES: Phase[] = [
  {
    num: '01', title: 'ИИ В РАБОТЕ: БЫСТРЫЙ СТАРТ', sub: 'Занятия 1–8 · 4 недели',
    chip: { label: 'Практика сразу', cls: 'ch-amber' },
    sessions: [
      { n: 'Занятие 1', t: 'ИИ-экосистема 2026', d: 'Карта инструментов: что реально работает, что маркетинг. Настраиваем рабочее пространство за 90 минут.', tags: ['Обзор', 'ChatGPT', 'ГигаЧат', 'Perplexity'], type: 'online' },
      { n: 'Занятие 2', t: 'Промпты для бизнеса и карьеры', d: 'Пишем резюме, коммерческое предложение, деловое письмо с ИИ. Разбираем ваши реальные задачи.', tags: ['Промпты', 'Бизнес-текст'], type: 'online' },
      { n: 'Занятие 3', t: 'ChatGPT для анализа данных', d: 'Code Interpreter: загружаем Excel, получаем графики и выводы. Анализ продаж без знания Python.', tags: ['ChatGPT', 'Excel', 'Анализ'], type: 'online' },
      { n: 'Занятие 4', t: 'Notion AI + база знаний', d: 'Создаём умную базу знаний для работы. Notion AI пишет, резюмирует, ищет. Шаблоны для команды.', tags: ['Notion AI', 'База знаний'], type: 'online' },
      { n: 'Занятие 5', t: 'Автоматизация Email и задач', d: 'Make.com сценарий: входящий email → ИИ анализирует → создаёт задачу в Notion → отправляет ответ.', tags: ['Make.com', 'Email', 'Автоматизация'], type: 'online' },
      { n: 'Занятие 6', t: 'ИИ-контент: тексты и изображения', d: 'Генерируем контент-план на месяц, пишем посты, создаём иллюстрации. За 2 часа — работа недели.', tags: ['Контент', 'SMM', 'Шедеврум'], type: 'online' },
      { n: 'Занятие 7', t: 'Презентации и отчёты с ИИ', d: 'Gamma.app: годовой отчёт из текста за 15 минут. PowerPoint Copilot. Деловая презентация за занятие.', tags: ['Gamma.app', 'Презентации'], type: 'online' },
      { n: 'Занятие 8', t: '✓ Первый рабочий результат', d: 'Показываете реальную задачу с работы. Решим вместе с ИИ прямо на занятии. Считаем экономию времени.', tags: ['✓ Проект', 'Ваша задача'], type: 'project' },
    ]
  },
  {
    num: '02', title: 'АВТОМАТИЗАЦИЯ БЕЗ КОДА', sub: 'Занятия 9–16 · 4 недели',
    chip: { label: 'Make.com', cls: 'ch-blue' },
    sessions: [
      { n: 'Занятие 9–10', t: 'Make.com: продвинутые сценарии', d: 'CRM-интеграция, автоотчёты в Telegram. Реальные бизнес-процессы без программирования.', tags: ['Make.com', 'CRM', 'Telegram'], type: 'online' },
      { n: 'Занятие 11–12', t: 'Make.com: данные и уведомления', d: 'Парсинг данных, авторассылки, напоминания. Связываем сервисы: Google Sheets → Telegram → Notion.', tags: ['Make.com', 'Google Sheets', 'Автоматизация'], type: 'online' },
      { n: 'Занятие 13–14', t: 'ИИ-агент для вашего бизнеса', d: 'Создаём ИИ-помощника, который отвечает на вопросы о вашем продукте, бронирует, консультирует.', tags: ['ИИ-агент', 'Чат-бот', 'Бизнес'], type: 'online' },
      { n: 'Занятие 15', t: '⚠️ Безопасность данных с ИИ', d: 'Защита данных при работе с ИИ. GDPR. Как не «кормить» конкурентов своими данными.', tags: ['⚠️ Безопасность', 'GDPR', 'Данные'], type: 'warn' },
      { n: 'Занятие 16', t: '✓ Итог: ваш автоматизированный рабочий процесс', d: 'Полный сценарий Make.com для вашей работы. Измеряем: сколько часов сэкономлено в неделю.', tags: ['✓ Проект', 'Автоматизация'], type: 'project' },
    ]
  },
  {
    num: '03', title: 'ИИ-МЕДИА И ЛИЧНЫЙ ПРОЕКТ', sub: 'Занятия 17–28 · 6 недель',
    chip: { label: 'Медиа', cls: 'ch-green' },
    sessions: [
      { n: 'Занятие 17–18', t: 'Голос и видео с ИИ', d: 'ElevenLabs: аудиокнига, подкаст, голосовой помощник. HeyGen: аватар для обучения или рекламы.', tags: ['ElevenLabs', 'HeyGen', 'Медиа'], type: 'online' },
      { n: 'Занятие 19–20', t: 'Своё медиа с нуля', d: 'Telegram-канал + автоконтент через Make.com + ИИ. Редполитика, шаблоны постов, расписание.', tags: ['SMM', 'Make.com', 'Telegram'], type: 'online' },
      { n: 'Занятие 21–28', t: 'Личный ИИ-проект', d: '8 занятий: придумываете и реализуете собственный проект с ИИ. Степан — ментор на каждом шаге.', tags: ['Личный проект', 'Менторство'], type: 'project' },
    ]
  },
  {
    num: '04', title: 'ИТОГОВЫЙ ПРОЕКТ И СЕРТИФИКАТ', sub: 'Занятия 29–32 · 2 недели',
    chip: { label: 'Финал', cls: 'ch-amber' },
    sessions: [
      { n: 'Занятие 29–30', t: 'Доработка и полировка проекта', d: 'Финальный спринт: исправляем, докручиваем, измеряем бизнес-ценность. Готовим питч.', tags: ['Проект', 'Питч'], type: 'online' },
      { n: 'Занятие 31', t: 'Карьера и рынок ИИ-профессий', d: 'Актуальный рынок: prompt engineer, AI product manager, AI-копирайтер. Зарплаты и перспективы.', tags: ['Карьера', 'Рынок'], type: 'online' },
      { n: 'Занятие 32', t: '🏆 Финальная презентация', d: 'Представляете свой проект. Получаете сертификат участника Нейро 32 + рекомендательное письмо.', tags: ['✓ Сертификат', 'Презентация'], type: 'project' },
    ]
  }
];

const PROJECTS = [
  { icon: '🤖', name: 'ИИ-агент для вашего бизнеса', tool: 'ChatGPT API + Make.com' },
  { icon: '📨', name: 'Автоответы на входящие Email', tool: 'Make.com + ИИ' },
  { icon: '🧠', name: 'Умная база знаний команды', tool: 'Notion AI' },
  { icon: '🎯', name: 'Личный ИИ-проект по выбору', tool: 'Ваши задачи' },
];

const FAQ = [
  { q: 'У меня нет технического образования. Осилю?', a: 'Осилите. Программа построена вокруг бизнес-задач, а не кода. Если умеете работать в Word или Excel — этого достаточно для старта.' },
  { q: 'Как это применить в моей конкретной работе?', a: 'На первом занятии разбираем ваши реальные задачи и строим индивидуальный план. 8-е занятие полностью посвящено вашей рабочей ситуации.' },
  { q: 'Есть ли домашние задания?', a: 'Обязательных нет. Есть опциональные: применить навык к своей задаче до следующего занятия. Большинство участников делают их с удовольствием — сразу видят результат.' },
  { q: 'Когда увижу первый реальный результат?', a: 'На 8-м занятии решаем вашу реальную рабочую задачу с ИИ прямо на занятии — и считаем, сколько часов это экономит в неделю.' },
  { q: 'Как сочетается курс с полной занятостью?', a: '2 занятия в неделю по 60–90 минут в удобное вечернее время. Обязательных домашних заданий нет. Расписание согласовываем с группой — большинство участников совмещают с работой без проблем.' },
  { q: 'Что конкретно я смогу делать после курса?', a: 'Автоматизировать рутинные задачи, создавать тексты и отчёты в 10× быстрее, настроить умную базу знаний команды, запустить ИИ-агента для вашего бизнеса. Всё это отрабатываем на реальных задачах прямо на занятиях.' },
  { q: 'Какой документ выдаётся по итогу?', a: 'Сертификат участника Нейро 32 и рекомендательное письмо. Нейро 32 — лаборатория практик, не лицензированное учебное заведение. Государственные документы об образовании не выдаются.' },
];

const RIGHT_COL = (
  <>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" style={{ display: 'block', marginBottom: 20, borderRadius: 20 }} aria-label="Взрослые работают эффективнее с ИИ">
      <rect width="380" height="180" rx="16" fill="#0d0d1f"/>
      <rect x="30" y="30" width="320" height="40" rx="8" fill="rgba(45,158,107,.06)" stroke="rgba(45,158,107,.15)" strokeWidth="1"/>
      <rect x="40" y="40" width="100" height="8" rx="2" fill="rgba(45,158,107,.25)"/>
      <rect x="40" y="53" width="180" height="6" rx="2" fill="rgba(255,255,255,.06)"/>
      <text x="340" y="56" textAnchor="middle" fontSize="14" fill="#2d9e6b">✓</text>
      <rect x="30" y="80" width="140" height="40" rx="8" fill="rgba(240,165,0,.06)" stroke="rgba(240,165,0,.15)" strokeWidth="1"/>
      <rect x="40" y="90" width="70" height="7" rx="2" fill="rgba(240,165,0,.3)"/>
      <rect x="40" y="102" width="100" height="5" rx="2" fill="rgba(255,255,255,.06)"/>
      <rect x="210" y="80" width="140" height="40" rx="8" fill="rgba(74,124,255,.06)" stroke="rgba(74,124,255,.15)" strokeWidth="1"/>
      <rect x="220" y="90" width="80" height="7" rx="2" fill="rgba(74,124,255,.3)"/>
      <rect x="220" y="102" width="100" height="5" rx="2" fill="rgba(255,255,255,.06)"/>
      <text x="190" y="152" textAnchor="middle" fontSize="9" fill="rgba(45,158,107,.5)" fontFamily="monospace">3–5 ЧАСОВ ЭКОНОМИИ В НЕДЕЛЮ</text>
    </svg>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        { text: 'Тексты и отчёты в 10× быстрее' },
        { text: 'Собственный ИИ-агент для бизнеса' },
        { text: 'Автоматизация рутины без кода' },
        { text: 'Навык, который сложно скопировать' },
      ].map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px' }}>
          <span style={{ color: 'var(--emerald)', fontWeight: 700, fontSize: '.82rem' }}>✓</span>
          <span style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.4 }}>{it.text}</span>
        </div>
      ))}
    </div>
  </>
);

export default function Adults({ onEnroll }: { onEnroll?: (p?: string) => void }) {
  usePageMeta('ИИ для взрослых 18+', 'Офлайн-занятия по ИИ для взрослых в Новозыбкове. ChatGPT, Make.com, Notion AI. Экономия 3–5 часов в неделю. 32 занятия · 8 500 ₽/мес.', '/adults');
  return (
    <div>
      <ProgramHero
        badge="Для взрослых · 18+"
        headline={
          <h1 style={{ fontFamily: 'var(--fu)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>📊</span>ИИ КАК <span style={{ color: 'var(--amber)' }}>ПРЕИМУЩЕСТВО</span>
          </h1>
        }
        description="Уже после 8 занятий вы начнёте экономить 3–5 часов в неделю. Тексты, отчёты, презентации, рутина — ИИ возьмёт это на себя, пока вы занимаетесь тем, что важно."
        chips={<>
          <span className="chip ch-green" style={{ fontWeight: 600 }}>🟢 Набор открыт · Старт 4 мая</span>
          <span className="chip ch-green">18+ лет</span>
          <span className="chip ch-amber">32 занятия · 4 мес · 2 раза/нед</span>
          <span className="chip ch-amber">8 500 ₽/мес</span>
          <span className="chip ch-blue">Ваши задачи</span>
        </>}
        rightCol={RIGHT_COL}
        variant="adults"
        program="Взрослые 18+"
        slots={4}
        enrollLabel="Записаться на пробное →"
        onEnroll={onEnroll}
        shareTitle="ИИ для взрослых 18+ — Нейро 32"
        shareText="Офлайн-лаборатория ИИ-практик в Новозыбкове. Взрослые 18+. Старт 4 мая."
        breadcrumb={[{ label: 'Главная', href: '/' }, { label: 'Программы', href: '/#programs' }, { label: 'ИИ для взрослых 18+' }]}
        progressSteps={['Инструменты', 'Автоматизация', 'Медиа', 'Итог']}
        progressActive={0}
      />

      <ProjectCardsSection
        title="Уже после 8 занятий — экономия 3–5 часов в неделю"
        promise="Конкретные результаты с вашими реальными задачами. Никаких учебных примеров — только ваши рабочие процессы."
        items={PROJECTS}
      />

      <ProgramRoadmap
        phases={MILESTONE_PHASES}
        eyebrow="Программа · 4 этапа · 32 занятия"
        title="От первого инструмента до ИИ-агента"
      />

      <div className="roadmap-wrap">
        <div className="s-eyebrow" style={{ marginTop: 0 }}>Детальная программа</div>
        <h2 className="s-h2" style={{ marginBottom: 32 }}>Что на <span className="accent">каждом занятии</span></h2>
        <div className="rm-intro">
          Каждое занятие — решение реальной рабочей задачи. Уйдёте с готовыми автоматизациями, которые экономят 3–5 часов в неделю.
        </div>
        <Roadmap phases={PHASES} />
        <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-amber btn-lg" onClick={() => onEnroll?.('Взрослые 18+')}>Записаться на пробное →</button>
          <TrustMini />
        </div>
      </div>

      <ProgramFAQ items={FAQ} />

      <style>{`@media(max-width:768px){.prog-hero-grid{grid-template-columns:1fr!important;padding:40px 24px!important;}}`}</style>
    </div>
  );
}
