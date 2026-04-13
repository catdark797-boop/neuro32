import { useLocation } from 'wouter';
import { usePageMeta } from '../hooks/usePageMeta';
import Roadmap from '../components/Roadmap';
import { ProgramHero, TrustMini, ProjectCardsSection, ProgramFAQ, MatrixCanvas, ProgramRoadmap } from '../components/ProgramBlocks';
import type { Phase } from '../components/Roadmap';
import type { RoadmapPhase } from '../components/ProgramBlocks';

const MILESTONE_PHASES: RoadmapPhase[] = [
  { num: '01', title: 'Атаки', sub: 'Занятия 1–8', milestone: 'Понимаешь 10 реальных схем взлома', skills: ['Kali Linux', 'DVWA', 'ChatGPT'], accent: '#10b981', type: 'theory' },
  { num: '02', title: 'Защита', sub: 'Занятия 9–16', milestone: 'Настроен безопасный цифровой периметр', skills: ['Bitwarden', 'VPN', '2FA'], accent: '#10b981', type: 'practice' },
  { num: '03', title: 'CTF', sub: 'Занятия 17–24', milestone: 'Победа в командном CTF + Сертификат 🏆', skills: ['CTF', 'Криптография'], accent: '#10b981', type: 'project' },
];

const GREEN = '#10b981';
const GREEN_DIM = 'rgba(16,185,129,.25)';

const PHASES: Phase[] = [
  {
    num: '01', title: 'ОСНОВЫ ЦИФРОВОЙ БЕЗОПАСНОСТИ', sub: 'Занятия 1–8 · 4 недели',
    chip: { label: 'Фундамент', cls: 'ch-red' },
    sessions: [
      { n: 'Занятие 1', t: 'Ландшафт угроз 2026', d: 'Актуальные атаки: фишинг, социальная инженерия, ИИ-deepfake-звонки. Разбираем реальные кейсы из России.', tags: ['⚠️ Угрозы', 'Фишинг', 'Deepfake'], type: 'warn' },
      { n: 'Занятие 2', t: 'Пароли и менеджеры', d: 'Bitwarden, KeePass: настраиваем менеджер паролей за занятие. Генератор паролей, 2FA для всего.', tags: ['Bitwarden', '2FA', 'Пароли'], type: 'online' },
      { n: 'Занятие 3', t: 'VPN и анонимность', d: 'Как работает VPN. Настраиваем Outline/WireGuard. Что VPN скрывает, а что нет — без мифов.', tags: ['VPN', 'WireGuard', 'Анонимность'], type: 'online' },
      { n: 'Занятие 4', t: 'Безопасность смартфона', d: 'Android vs iOS: что выбрать. Настройки приватности. Антивирус: нужен ли? Приложения-шпионы.', tags: ['Android', 'iOS', 'Приватность'], type: 'online' },
      { n: 'Занятие 5', t: 'Социальная инженерия', d: 'Психология атак. Отрабатываем сценарии: «сотрудник банка», «ваш ребёнок попал в беду». Как не попасться.', tags: ['⚠️ Соц. инженерия', 'Психология'], type: 'warn' },
      { n: 'Занятие 6', t: 'Безопасность в сетях Wi-Fi', d: 'Атаки на публичный Wi-Fi. Настраиваем безопасное соединение. Wireshark: смотрим трафик сети.', tags: ['Wi-Fi', 'Wireshark', 'MITM'], type: 'online' },
      { n: 'Занятие 7', t: 'Защита данных и бэкапы', d: 'Шифрование файлов (VeraCrypt). 3-2-1 правило бэкапов. Облако vs локальное хранилище.', tags: ['VeraCrypt', 'Бэкапы', 'Шифрование'], type: 'online' },
      { n: 'Занятие 8', t: '✓ Аудит своей безопасности', d: 'Проверяем утечки (HaveIBeenPwned), оцениваем уязвимости. Создаём персональный план защиты.', tags: ['✓ Аудит', 'HaveIBeenPwned'], type: 'project' },
    ]
  },
  {
    num: '02', title: 'ПЕНТЕСТ И ИИ В КИБЕРБЕЗОПАСНОСТИ', sub: 'Занятия 9–16 · 4 недели',
    chip: { label: 'Пентест', cls: 'ch-amber' },
    sessions: [
      { n: 'Занятие 9', t: 'Kali Linux — введение', d: 'Виртуальная машина с Kali. Первые команды. Инструменты пентестера: nmap, Metasploit (безопасная среда).', tags: ['Kali Linux', 'nmap', 'Пентест'], type: 'online' },
      { n: 'Занятие 10–11', t: 'Веб-безопасность', d: 'SQL-инъекции, XSS, CSRF — на тренировочных полигонах DVWA. Как их находить и как защититься.', tags: ['DVWA', 'SQL-инъекции', 'XSS'], type: 'online' },
      { n: 'Занятие 12–13', t: 'ИИ в кибербезопасности', d: 'Как ИИ используют хакеры. Как ИИ помогает защищаться. ChatGPT для анализа логов и кода.', tags: ['ИИ-атаки', 'ChatGPT', 'Анализ'], type: 'online' },
      { n: 'Занятие 14–15', t: 'Сетевая безопасность и мониторинг', d: 'Firewall, IDS/IPS. Настраиваем мониторинг сети. Grafana + Prometheus для визуализации.', tags: ['Firewall', 'IDS', 'Grafana'], type: 'online' },
      { n: 'Занятие 16', t: '✓ Аудит реальной системы', d: 'Комплексная проверка своего устройства: уязвимости, утечки, конфигурация. Составляем отчёт.', tags: ['✓ Аудит', 'Пентест'], type: 'project' },
    ]
  },
  {
    num: '03', title: 'CTF И КАРЬЕРА В КИБЕРБЕЗОПАСНОСТИ', sub: 'Занятия 17–24 · 4 недели',
    chip: { label: 'CTF-финал', cls: 'ch-red' },
    sessions: [
      { n: 'Занятие 17–20', t: 'CTF-соревнования', d: '4 занятия: решаем задачи Capture The Flag. Криптография, стеганография, реверс-инжиниринг. Рейтинг группы.', tags: ['CTF', 'Криптография', 'Реверс'], type: 'online' },
      { n: 'Занятие 21–22', t: 'Командный CTF-финал', d: 'Командное CTF-соревнование внутри группы. Рейтинг, разбор решений, призовые сертификаты.', tags: ['✓ CTF', 'Команда', 'Рейтинг'], type: 'project' },
      { n: 'Занятие 23', t: 'Карьера в кибербезопасности', d: 'Пути: пентестер, аналитик SOC, DevSecOps. Сертификации (CEH, OSCP). Зарплаты в 2026.', tags: ['Карьера', 'Сертификации', 'CEH'], type: 'online' },
      { n: 'Занятие 24', t: '🏆 Итоговый CTF + Сертификат участника', d: 'Финальное соревнование. Победители получают отдельный сертификат. Все — сертификат участника Нейро 32.', tags: ['✓ CTF-финал', 'Сертификат'], type: 'project' },
    ]
  }
];

const PROJECTS = [
  { icon: '🔐', name: 'Защищённый менеджер паролей', tool: 'Bitwarden + 2FA' },
  { icon: '🌐', name: 'Собственный VPN-сервер', tool: 'Outline / WireGuard' },
  { icon: '🛡️', name: 'Аудит безопасности своей системы', tool: 'HaveIBeenPwned + VeraCrypt' },
  { icon: '🏆', name: 'Решение CTF-задачи', tool: 'Kali Linux / DVWA' },
];

const FAQ = [
  { q: 'Нужны ли знания программирования?', a: 'Нет. Начинаем с бытовой безопасности: пароли, VPN, распознавание фишинга. Kali Linux появляется только на 9-м занятии.' },
  { q: 'Это законно? Не научите взламывать чужое?', a: '100% законно. Все практики — только на тренировочных полигонах (DVWA) и виртуальных машинах. Взлом реальных систем — уголовное преступление по ст. 272 УК РФ.' },
  { q: 'Какой минимальный возраст?', a: '14 лет. До 18 лет — необходимо письменное согласие родителей или законных представителей.' },
  { q: 'Будут ли настоящие CTF-соревнования?', a: 'Да, с 19-го занятия — командные CTF внутри группы с рейтингом. Победители получают отдельные сертификаты участника.' },
  { q: 'Нужно ли согласие родителя для участия?', a: 'До 18 лет — да, необходимо письменное согласие родителя или законного представителя. Форму согласия выдаём перед первым занятием.' },
  { q: 'Что я получу по итогу курса?', a: 'Практические навыки защиты: VPN, пароли, распознавание фишинга и deepfake, основы пентеста. По итогу — сертификат участника Нейро 32 по направлению «Кибербезопасность». Государственный документ об образовании не выдаётся.' },
  { q: 'Какое оборудование нужно?', a: 'Ничего не нужно. Все практики — на компьютерах лаборатории с установленным Kali Linux и виртуальными машинами. Свой ноутбук пригодится только для домашних экспериментов.' },
];

const CYBER_RIGHT = (
  <>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" style={{ display: 'block', marginBottom: 20, borderRadius: 20 }} aria-label="Кибербезопасность">
      <rect width="380" height="180" rx="16" fill="rgba(5,10,13,.95)"/>
      <polygon points="190,20 255,58 255,112 190,150 125,112 125,58" fill="none" stroke="rgba(16,185,129,.3)" strokeWidth="1.5"/>
      <polygon points="190,40 240,70 240,106 190,136 140,106 140,70" fill="none" stroke="rgba(16,185,129,.15)" strokeWidth="1"/>
      <text x="190" y="96" textAnchor="middle" fontSize="28" fill="#10b981">🔒</text>
      <text x="60" y="80" fontSize="14" fill="rgba(16,185,129,.65)">🛡️</text>
      <text x="300" y="80" fontSize="14" fill="rgba(16,185,129,.65)">🔑</text>
      <text x="60" y="120" fontSize="14" fill="rgba(16,185,129,.5)">🕵️</text>
      <text x="300" y="120" fontSize="14" fill="rgba(16,185,129,.5)">⚡</text>
      <text x="190" y="163" textAnchor="middle" fontSize="9" fill="rgba(16,185,129,.5)" fontFamily="monospace">ЗАЩИТА · ОБНАРУЖЕНИЕ · РЕАКЦИЯ</text>
    </svg>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        { text: 'Настроить VPN и менеджер паролей' },
        { text: 'Распознать фишинг и deepfake' },
        { text: 'Провести аудит своей безопасности' },
        { text: 'Решать CTF-задачи начального уровня' },
      ].map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(16,185,129,.04)', border: `1px solid ${GREEN_DIM}`, borderRadius: 10, padding: '10px 12px' }}>
          <span style={{ color: GREEN, fontWeight: 700, fontSize: '.82rem' }}>✓</span>
          <span style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.4 }}>{it.text}</span>
        </div>
      ))}
    </div>
  </>
);

export default function Cyber({ onEnroll }: { onEnroll?: (p?: string) => void }) {
  usePageMeta('Цифровая защита', 'Офлайн-занятия по кибербезопасности в Новозыбкове. VPN, CTF, Kali Linux. 24 занятия · 11 000 ₽/мес. Практика 100%.', '/cyber');
  const [, navigate] = useLocation();

  return (
    <div>
      <ProgramHero
        accentColor={GREEN}
        badge={<><span style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', letterSpacing: '.06em' }}>$ </span>Цифровая защита · 14+ лет</>}
        headline={
          <h1 style={{ fontFamily: 'var(--fu)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>🛡️</span>КИБЕР<span style={{ color: GREEN }}>_ЗАЩИТА</span>
          </h1>
        }
        description="Вы научитесь защищать аккаунты, деньги и данные от реальных угроз 2026 года. Плюс — этичный взлом и CTF-соревнования для тех, кто хочет понять, как работают атаки изнутри."
        chips={<>
          <span className="chip" style={{ background: 'rgba(16,185,129,.1)', color: GREEN, border: `1px solid ${GREEN_DIM}`, fontWeight: 600 }}>🟢 Набор открыт · Старт 4 мая</span>
          <span className="chip ch-red">14+ лет</span>
          <span className="chip" style={{ background: 'rgba(16,185,129,.08)', color: GREEN, border: `1px solid ${GREEN_DIM}` }}>24 занятия · 3 мес · 2 раза/нед</span>
          <span className="chip ch-amber">11 000 ₽/мес</span>
          <span className="chip ch-dim">100% практика</span>
        </>}
        rightCol={CYBER_RIGHT}
        variant="cyber"
        program="Кибербезопасность"
        slots={3}
        enrollLabel="Записаться на пробное →"
        onEnroll={onEnroll}
        shareTitle="Цифровая защита — Нейро 32"
        shareText="Курс кибербезопасности в Новозыбкове. Kali Linux, VPN, CTF. Старт 4 мая."
        wrapperStyle={{ background: 'linear-gradient(180deg, #050a0d 0%, var(--bg) 100%)' }}
        bgOverlay={<MatrixCanvas />}
        extraCta={
          <button className="btn btn-outline btn-lg" style={{ borderColor: GREEN_DIM, color: GREEN }} onClick={() => navigate('/safety')}>
            Базовая безопасность
          </button>
        }
        breadcrumb={[{ label: 'Главная', href: '/' }, { label: 'Программы', href: '/#programs' }, { label: 'Цифровая защита' }]}
        progressSteps={['Атаки', 'Защита', 'CTF']}
        progressActive={0}
      />

      {/* Project Cards — green accent via CSS var */}
      <ProjectCardsSection
        title="После программы — ни один фишинг не пройдёт"
        promise="Все упражнения в безопасной среде. Вы учитесь защищаться, понимая, как именно работают атаки."
        items={PROJECTS}
        accentColor={GREEN}
      />

      <ProgramRoadmap
        phases={MILESTONE_PHASES}
        eyebrow="Программа · 3 этапа · 24 занятия"
        title="От защиты до CTF-финала"
        accent={GREEN}
      />

      {/* Roadmap detail */}
      <div className="roadmap-wrap">
        <div className="s-eyebrow" style={{ marginTop: 0, color: GREEN }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: GREEN, verticalAlign: 'middle', marginRight: 10 }} />
          Детальная программа
        </div>
        <h2 className="s-h2" style={{ marginBottom: 32 }}>Что на <span style={{ color: GREEN }}>каждом занятии</span></h2>
        <div className="rm-intro" style={{ borderLeftColor: GREEN }}>
          Все упражнения — в безопасной среде (виртуальные машины, тренировочные полигоны). Реальный взлом реальных систем — уголовно наказуем. Мы учим защищаться.
        </div>
        <Roadmap phases={PHASES} />
        <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="btn btn-lg"
            style={{ background: GREEN, color: '#050a0d', fontFamily: 'var(--fu)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '17px 36px', borderRadius: 13 }}
            onClick={() => onEnroll?.('Кибербезопасность')}
          >
            Записаться на пробное →
          </button>
          <TrustMini accent={GREEN_DIM} />
        </div>
      </div>

      <ProgramFAQ items={FAQ} accentColor={GREEN} />

      <style>{`@media(max-width:768px){.prog-hero-grid{grid-template-columns:1fr!important;padding:40px 24px!important;}}`}</style>
    </div>
  );
}
