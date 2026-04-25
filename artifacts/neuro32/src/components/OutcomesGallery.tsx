import React, { useState } from 'react';

// ─── Типы ────────────────────────────────────────────────────────────────────
type Program = 'kids' | 'teens' | 'adults' | 'cyber';

interface MockupTab {
  label: string;
  icon: string;
  tool: string;
  render: () => React.ReactNode;
}

// ─── Мокапы для каждой программы ─────────────────────────────────────────────

const KIDS_TABS: MockupTab[] = [
  {
    label: 'Трек Suno AI',
    icon: '🎵',
    tool: 'Suno AI',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, padding: '18px 20px', fontFamily: 'var(--fm)' }}>
        {/* Заголовок плеера */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#f0a500,#ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎵</div>
          <div>
            <div style={{ color: '#fff', fontSize: '.85rem', fontWeight: 600 }}>Моя первая песня</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.72rem' }}>Suno AI · Pop · 2:34</div>
          </div>
          <div style={{ marginLeft: 'auto', background: 'rgba(240,165,0,.15)', border: '1px solid rgba(240,165,0,.3)', borderRadius: 20, padding: '3px 10px', fontSize: '.68rem', color: '#f0a500' }}>Создано мной ✨</div>
        </div>
        {/* Волновая форма */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 36, marginBottom: 12 }}>
          {[3,6,9,14,11,8,5,12,16,10,7,13,9,6,4,11,15,8,12,6,9,14,7,5,10,13,8,11,6,9,12,7,4,8,14,10].map((h, i) => (
            <div key={i} style={{ width: 4, height: h * 2, borderRadius: 2, background: i < 14 ? 'var(--amber)' : 'rgba(255,255,255,.15)', flexShrink: 0, transition: 'height .2s' }} />
          ))}
        </div>
        {/* Прогресс */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.35)' }}>0:58</span>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 2 }}>
            <div style={{ width: '38%', height: '100%', background: 'var(--amber)', borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.35)' }}>2:34</span>
        </div>
        {/* Управление */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
          {['⏮', '▶', '⏭'].map((b, i) => (
            <div key={i} style={{ width: i === 1 ? 40 : 32, height: i === 1 ? 40 : 32, borderRadius: '50%', background: i === 1 ? 'var(--amber)' : 'rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 1 ? '.9rem' : '.75rem', cursor: 'pointer', color: i === 1 ? '#000' : 'rgba(255,255,255,.6)' }}>
              {b}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: '.68rem', color: 'rgba(255,255,255,.25)' }}>Слова придуманы ребёнком · Музыка сгенерирована Suno AI</div>
      </div>
    ),
  },
  {
    label: 'Мультфильм Kling',
    icon: '🎬',
    tool: 'Kling AI',
    render: () => (
      <div style={{ background: '#0a0a14', borderRadius: 14, overflow: 'hidden', fontFamily: 'var(--fm)' }}>
        {/* «Экран» видео */}
        <div style={{ position: 'relative', background: 'linear-gradient(160deg,#1a0a2e,#0d1a3a)', height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Облачко */}
          <div style={{ position: 'absolute', top: 18, left: 24, fontSize: 28 }}>☁️</div>
          <div style={{ position: 'absolute', top: 22, right: 30, fontSize: 20 }}>☁️</div>
          {/* Персонаж */}
          <div style={{ fontSize: 48, zIndex: 1 }}>🐉</div>
          {/* Город */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, padding: '0 10px' }}>
            {[16,22,18,28,12,20,24,14].map((h, i) => <div key={i} style={{ width: 14, height: h, background: 'rgba(240,165,0,.3)', borderRadius: '2px 2px 0 0' }} />)}
          </div>
          {/* Метка Kling */}
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.6)', borderRadius: 6, padding: '2px 7px', fontSize: '.62rem', color: 'rgba(255,255,255,.5)' }}>Kling AI</div>
          {/* Кнопка Play */}
          <div style={{ position: 'absolute', bottom: 36, right: 14, width: 28, height: 28, borderRadius: '50%', background: 'rgba(240,165,0,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', color: '#000' }}>▶</div>
        </div>
        {/* Таймлайн */}
        <div style={{ padding: '10px 16px 14px' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {['Сцена 1', 'Сцена 2', 'Сцена 3'].map((s, i) => (
              <div key={i} style={{ flex: 1, height: 22, borderRadius: 4, background: i === 0 ? 'rgba(240,165,0,.25)' : 'rgba(255,255,255,.05)', border: `1px solid ${i === 0 ? 'rgba(240,165,0,.4)' : 'rgba(255,255,255,.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', color: i === 0 ? '#f0a500' : 'rgba(255,255,255,.3)' }}>
                {s}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>Дракон в Новозыбкове · 5 сек · Промпт написан ребёнком</div>
        </div>
      </div>
    ),
  },
  {
    label: 'Scratch-игра',
    icon: '🎮',
    tool: 'Scratch',
    render: () => (
      <div style={{ background: '#1e1b2e', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        {/* Заголовок */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 16 }}>🎮</div>
          <span style={{ color: '#fff', fontSize: '.82rem', fontWeight: 600 }}>Поймай бота</span>
          <div style={{ marginLeft: 'auto', background: 'rgba(74,124,255,.15)', border: '1px solid rgba(74,124,255,.3)', borderRadius: 20, padding: '2px 8px', fontSize: '.65rem', color: '#4a7cff' }}>Scratch 3.0</div>
        </div>
        {/* Игровой экран */}
        <div style={{ background: '#0d1018', borderRadius: 10, height: 110, position: 'relative', marginBottom: 12, overflow: 'hidden' }}>
          {/* Фон звёзды */}
          {[15,45,80,25,65,50,90,35].map((x, i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${[20,50,30,70,15,60,40,80][i]}%`, width: 2, height: 2, background: 'rgba(255,255,255,.4)', borderRadius: '50%' }} />
          ))}
          {/* Игрок */}
          <div style={{ position: 'absolute', bottom: 14, left: '35%', fontSize: 22 }}>🚀</div>
          {/* Боты */}
          <div style={{ position: 'absolute', top: 16, left: '20%', fontSize: 16 }}>🤖</div>
          <div style={{ position: 'absolute', top: 28, right: '25%', fontSize: 14, opacity: .6 }}>🤖</div>
          {/* Счёт */}
          <div style={{ position: 'absolute', top: 8, right: 10, background: 'rgba(240,165,0,.15)', border: '1px solid rgba(240,165,0,.25)', borderRadius: 6, padding: '2px 8px', fontSize: '.68rem', color: '#f0a500' }}>Счёт: 42</div>
        </div>
        {/* Блоки кода Scratch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { color: '#f0a500', text: 'когда 🚩 нажата' },
            { color: '#4a7cff', text: 'всегда' },
            { color: '#2d9e6b', text: '  если касается «Бота»' },
            { color: '#e55', text: '    изменить «Счёт» на 1' },
          ].map((b, i) => (
            <div key={i} style={{ background: `${b.color}18`, border: `1px solid ${b.color}30`, borderRadius: 5, padding: '3px 10px', fontSize: '.65rem', color: b.color, fontFamily: 'monospace' }}>
              {b.text}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'История + иллюстрации',
    icon: '🎨',
    tool: 'Шедеврум + ГигаЧат',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 16 }}>📖</div>
          <span style={{ color: '#fff', fontSize: '.82rem', fontWeight: 600 }}>Кот-астронавт</span>
          <div style={{ marginLeft: 'auto', fontSize: '.65rem', color: 'rgba(255,255,255,.35)' }}>3 стр. · ГигаЧат + Шедеврум</div>
        </div>
        {/* Страницы */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { bg: 'linear-gradient(135deg,#1a0a2e,#2d1a5e)', emoji: '🐱', caption: 'Жил-был кот...' },
            { bg: 'linear-gradient(135deg,#0a1a2e,#1a3a6e)', emoji: '🚀', caption: 'Он мечтал о звёздах' },
            { bg: 'linear-gradient(135deg,#0a2e1a,#1a5e3a)', emoji: '⭐', caption: 'И полетел!' },
          ].map((p, i) => (
            <div key={i} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
              <div style={{ background: p.bg, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{p.emoji}</div>
              <div style={{ background: '#12121f', padding: '4px 6px', fontSize: '.58rem', color: 'rgba(255,255,255,.4)', lineHeight: 1.3 }}>{p.caption}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.15)', borderRadius: 8, padding: '8px 12px', fontSize: '.68rem', color: 'rgba(255,255,255,.5)', fontStyle: 'italic', lineHeight: 1.5 }}>
          «Однажды рыжий кот Мурзик решил полететь на Луну. Он попросил ГигаЧат помочь написать план...»
        </div>
      </div>
    ),
  },
];

const TEENS_TABS: MockupTab[] = [
  {
    label: 'Telegram-бот',
    icon: '🤖',
    tool: 'Python + aiogram',
    render: () => (
      <div style={{ background: '#0d1117', borderRadius: 14, overflow: 'hidden', fontFamily: 'var(--fm)' }}>
        {/* Шапка Telegram */}
        <div style={{ background: '#17212b', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4a7cff,#7c4fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
          <div>
            <div style={{ color: '#fff', fontSize: '.78rem', fontWeight: 600 }}>МойБот</div>
            <div style={{ color: '#4a7cff', fontSize: '.62rem' }}>онлайн</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '.65rem', color: 'rgba(255,255,255,.3)', background: 'rgba(74,124,255,.1)', borderRadius: 10, padding: '2px 8px' }}>Python · aiogram</div>
        </div>
        {/* Сообщения */}
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8, background: '#0e1621' }}>
          {[
            { from: 'user', text: '/start' },
            { from: 'bot', text: 'Привет! Я твой ИИ-помощник 🤖\nЧем могу помочь?' },
            { from: 'user', text: 'Объясни квантовую физику просто' },
            { from: 'bot', text: 'Квантовая физика — это наука о том, как ведут себя очень маленькие частицы... 🔬 (GPT-4 ответил за 1.2 сек)' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', background: m.from === 'user' ? '#2b5278' : '#182533', borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', padding: '6px 10px', fontSize: '.68rem', color: '#e0e0e0', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        {/* Инпут */}
        <div style={{ background: '#17212b', padding: '8px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, background: '#242f3d', borderRadius: 20, padding: '5px 12px', fontSize: '.68rem', color: 'rgba(255,255,255,.3)' }}>Сообщение...</div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#4a7cff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', color: '#fff' }}>➤</div>
        </div>
      </div>
    ),
  },
  {
    label: 'Make.com сценарий',
    icon: '⚙️',
    tool: 'Make.com',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, padding: '16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>⚙️</span>
          <span style={{ color: '#fff', fontSize: '.8rem', fontWeight: 600 }}>Автопостинг VK</span>
          <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#2d9e6b', boxShadow: '0 0 6px #2d9e6b' }} />
          <span style={{ fontSize: '.65rem', color: '#2d9e6b' }}>Активен</span>
        </div>
        {/* Схема узлов */}
        <div style={{ position: 'relative', height: 90, marginBottom: 10 }}>
          {/* Узлы */}
          {[
            { x: 4, label: 'Google\nSheets', color: '#2d9e6b', icon: '📊' },
            { x: 31, label: 'ChatGPT\nAPI', color: '#4a7cff', icon: '🤖' },
            { x: 58, label: 'Изображение\nShedulum', color: '#f0a500', icon: '🎨' },
            { x: 85, label: 'VK\nPost', color: '#5181b8', icon: '📱' },
          ].map((n, i) => (
            <div key={i} style={{ position: 'absolute', left: `${n.x}%`, top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${n.color}18`, border: `2px solid ${n.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, margin: '0 auto 4px' }}>{n.icon}</div>
              <div style={{ fontSize: '.55rem', color: 'rgba(255,255,255,.4)', whiteSpace: 'pre', lineHeight: 1.3 }}>{n.label}</div>
            </div>
          ))}
          {/* Стрелки */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {[18, 45, 72].map((x, i) => (
              <g key={i}>
                <line x1={`${x}%`} y1="45%" x2={`${x + 13}%`} y2="45%" stroke="rgba(255,255,255,.15)" strokeWidth="1.5" strokeDasharray="4 3" />
                <polygon points={`${x + 13}%,42% ${x + 14.5}%,45% ${x + 13}%,48%`} fill="rgba(255,255,255,.25)" />
              </g>
            ))}
          </svg>
        </div>
        {/* Лог */}
        <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 8, padding: '8px 10px' }}>
          {['✓ Прочитан пост из Google Sheets', '✓ Текст улучшен ChatGPT', '✓ Опубликовано в VK — 09:00'].map((l, i) => (
            <div key={i} style={{ fontSize: '.62rem', color: i < 2 ? 'rgba(45,158,107,.8)' : '#f0a500', fontFamily: 'monospace', marginBottom: 2 }}>{l}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Питч-дек',
    icon: '📊',
    tool: 'Gamma.app',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, overflow: 'hidden', fontFamily: 'var(--fm)' }}>
        {/* Слайд */}
        <div style={{ background: 'linear-gradient(135deg,#1a0a2e 0%,#0d1a3a 100%)', padding: '20px 22px', position: 'relative', minHeight: 120 }}>
          <div style={{ position: 'absolute', top: 10, right: 12, fontSize: '.6rem', color: 'rgba(255,255,255,.25)' }}>1 / 8</div>
          <div style={{ fontSize: '.6rem', color: '#f0a500', fontWeight: 600, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>Мой стартап</div>
          <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>EduBot — помощник для подготовки к ОГЭ</div>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.7rem', lineHeight: 1.5 }}>Telegram-бот, который объясняет темы простым языком и генерирует тесты с ИИ</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {['14 000 школьников\nв аудитории', '30 сек\nна старт', 'ИИ-объяснения\nбесплатно'].map((s, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: '6px 8px', textAlign: 'center', fontSize: '.58rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{s}</div>
            ))}
          </div>
        </div>
        {/* Миниатюры слайдов */}
        <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: '#0a0a14' }}>
          {['Проблема', 'Решение', 'Демо', 'Команда', 'Цифры', 'Контакты'].map((s, i) => (
            <div key={i} style={{ flex: 1, height: 16, borderRadius: 3, background: i === 0 ? 'rgba(74,124,255,.3)' : 'rgba(255,255,255,.05)', border: `1px solid ${i === 0 ? 'rgba(74,124,255,.5)' : 'rgba(255,255,255,.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.48rem', color: i === 0 ? '#4a7cff' : 'rgba(255,255,255,.2)' }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: '30-сек видео',
    icon: '🎤',
    tool: 'Kling AI + ElevenLabs',
    render: () => (
      <div style={{ background: '#0a0a14', borderRadius: 14, overflow: 'hidden', fontFamily: 'var(--fm)' }}>
        <div style={{ background: '#111', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🎤</span>
          <span style={{ color: '#fff', fontSize: '.78rem', fontWeight: 600 }}>Мой проект за 30 секунд</span>
          <div style={{ marginLeft: 'auto', background: 'rgba(255,50,50,.15)', border: '1px solid rgba(255,50,50,.3)', borderRadius: 10, padding: '2px 8px', fontSize: '.62rem', color: '#ff5252' }}>● REC</div>
        </div>
        <div style={{ background: 'linear-gradient(160deg,#0d1a2e,#1a0d2e)', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ fontSize: 36 }}>👤</div>
          {/* Субтитры */}
          <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, background: 'rgba(0,0,0,.7)', borderRadius: 6, padding: '4px 10px', fontSize: '.65rem', color: '#fff', textAlign: 'center' }}>
            «Мой бот помогает готовиться к ОГЭ...»
          </div>
        </div>
        <div style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.3)' }}>0:18</span>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, position: 'relative' }}>
              <div style={{ width: '60%', height: '100%', background: '#f0a500', borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.3)' }}>0:30</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, background: 'rgba(74,124,255,.07)', border: '1px solid rgba(74,124,255,.2)', borderRadius: 6, padding: '4px 8px', fontSize: '.6rem', color: 'rgba(74,124,255,.8)', textAlign: 'center' }}>ElevenLabs голос</div>
            <div style={{ flex: 1, background: 'rgba(240,165,0,.07)', border: '1px solid rgba(240,165,0,.2)', borderRadius: 6, padding: '4px 8px', fontSize: '.6rem', color: 'rgba(240,165,0,.8)', textAlign: 'center' }}>Kling AI фон</div>
          </div>
        </div>
      </div>
    ),
  },
];

const ADULTS_TABS: MockupTab[] = [
  {
    label: 'Email-автоматизация',
    icon: '📨',
    tool: 'Make.com + ИИ',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 14 }}>📨</span>
          <span style={{ color: '#fff', fontSize: '.8rem', fontWeight: 600 }}>Входящий запрос → Автоответ</span>
          <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#2d9e6b', boxShadow: '0 0 5px #2d9e6b' }} />
        </div>
        {/* Email */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)' }}>от: client@company.ru</span>
            <span style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.25)' }}>09:14</span>
          </div>
          <div style={{ fontSize: '.72rem', color: '#fff', marginBottom: 4 }}>Запрос на коммерческое предложение</div>
          <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', lineHeight: 1.4 }}>Здравствуйте, интересует сотрудничество по направлению...</div>
        </div>
        {/* Стрелка */}
        <div style={{ textAlign: 'center', fontSize: '.75rem', color: 'rgba(45,158,107,.6)', marginBottom: 8 }}>↓ Make.com + ChatGPT анализирует (1.8 сек)</div>
        {/* Ответ */}
        <div style={{ background: 'rgba(45,158,107,.06)', border: '1px solid rgba(45,158,107,.2)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '.65rem', color: 'rgba(45,158,107,.8)' }}>✓ Автоответ отправлен</span>
            <span style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.25)' }}>09:14</span>
          </div>
          <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>Добрый день! Благодарим за обращение. Ваш запрос обработан. Персональное КП отправим в течение 2 часов...</div>
          <div style={{ marginTop: 6, fontSize: '.62rem', color: 'rgba(255,255,255,.25)' }}>+ Задача создана в Notion · Уведомление в Telegram отправлено</div>
        </div>
      </div>
    ),
  },
  {
    label: 'База знаний Notion',
    icon: '🧠',
    tool: 'Notion AI',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, overflow: 'hidden', fontFamily: 'var(--fm)' }}>
        {/* Заголовок */}
        <div style={{ background: '#111', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🧠</span>
          <span style={{ color: '#fff', fontSize: '.78rem', fontWeight: 600 }}>База знаний команды</span>
          <div style={{ marginLeft: 'auto', fontSize: '.62rem', color: 'rgba(255,255,255,.3)' }}>Notion AI</div>
        </div>
        {/* Структура */}
        <div style={{ display: 'flex', height: 140 }}>
          {/* Sidebar */}
          <div style={{ width: 100, background: '#0a0a14', padding: '10px 8px', borderRight: '1px solid rgba(255,255,255,.05)' }}>
            {['📁 Процессы', '📋 Шаблоны', '🤖 ИИ-инструкции', '📊 Отчёты', '💡 Идеи'].map((item, i) => (
              <div key={i} style={{ padding: '4px 6px', borderRadius: 4, background: i === 2 ? 'rgba(240,165,0,.1)' : 'transparent', marginBottom: 2, fontSize: '.58rem', color: i === 2 ? '#f0a500' : 'rgba(255,255,255,.4)', cursor: 'pointer' }}>{item}</div>
            ))}
          </div>
          {/* Содержимое */}
          <div style={{ flex: 1, padding: '10px 12px' }}>
            <div style={{ fontSize: '.75rem', color: '#fff', fontWeight: 600, marginBottom: 6 }}>🤖 Промпты для ChatGPT</div>
            {[
              'Написать КП → «Ты опытный менеджер по продажам...»',
              'Резюме встречи → «Структурируй тезисно...»',
              'Ответ клиенту → «Ответь вежливо и предложи...»',
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5 }}>
                <span style={{ color: 'var(--amber)', fontSize: '.62rem', marginTop: 1 }}>▸</span>
                <span style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.4 }}>{p}</span>
              </div>
            ))}
            {/* AI badge */}
            <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(74,124,255,.08)', border: '1px solid rgba(74,124,255,.2)', borderRadius: 6, padding: '3px 8px' }}>
              <span style={{ fontSize: '.62rem', color: '#4a7cff' }}>✨ Notion AI может дополнить</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'ИИ-агент',
    icon: '🤖',
    tool: 'ChatGPT API + Make.com',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2d9e6b,#4a7cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
          <div>
            <div style={{ color: '#fff', fontSize: '.78rem', fontWeight: 600 }}>Бизнес-ассистент</div>
            <div style={{ color: '#2d9e6b', fontSize: '.62rem' }}>● онлайн · обработал 47 запросов сегодня</div>
          </div>
        </div>
        {/* Диалог */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <div style={{ alignSelf: 'flex-end', background: '#2b5278', borderRadius: '12px 12px 2px 12px', padding: '6px 10px', maxWidth: '80%', fontSize: '.68rem', color: '#e0e0e0' }}>
            Когда следующая встреча с клиентом Иванов?
          </div>
          <div style={{ alignSelf: 'flex-start', background: 'rgba(45,158,107,.1)', border: '1px solid rgba(45,158,107,.2)', borderRadius: '12px 12px 12px 2px', padding: '6px 10px', maxWidth: '80%', fontSize: '.68rem', color: '#e0e0e0', lineHeight: 1.5 }}>
            📅 Завтра, 15:00 — встреча «Презентация проекта». Я отправил напоминание в Telegram и подготовил краткое КП на основе переписки.
          </div>
        </div>
        {/* Статистика агента */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { val: '3.2ч', label: 'сэкономлено/день' },
            { val: '47', label: 'запросов/день' },
            { val: '98%', label: 'точность' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, padding: '6px', textAlign: 'center' }}>
              <div style={{ color: 'var(--amber)', fontSize: '.8rem', fontWeight: 700 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,.35)', fontSize: '.58rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Личный проект',
    icon: '🎯',
    tool: 'Ваши задачи',
    render: () => (
      <div style={{ background: '#0d0d1f', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 16 }}>🎯</span>
          <span style={{ color: '#fff', fontSize: '.8rem', fontWeight: 600 }}>Мой ИИ-проект</span>
          <div style={{ marginLeft: 'auto', background: 'rgba(240,165,0,.1)', border: '1px solid rgba(240,165,0,.2)', borderRadius: 10, padding: '2px 8px', fontSize: '.62rem', color: '#f0a500' }}>В работе</div>
        </div>
        {/* Карточки направлений */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { icon: '🏪', text: 'ИИ-ассистент для магазина', color: '#f0a500' },
            { icon: '📚', text: 'Автогенерация контента', color: '#4a7cff' },
            { icon: '📞', text: 'Обработка входящих звонков', color: '#2d9e6b' },
            { icon: '📊', text: 'Аналитика продаж с ИИ', color: '#9b6bff' },
          ].map((c, i) => (
            <div key={i} style={{ background: `${c.color}0d`, border: `1px solid ${c.color}25`, borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 14 }}>{c.icon}</span>
              <span style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.3 }}>{c.text}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(45,158,107,.06)', border: '1px solid rgba(45,158,107,.2)', borderRadius: 8, padding: '8px 12px', fontSize: '.68rem', color: 'rgba(255,255,255,.5)', textAlign: 'center' }}>
          Степан поможет выбрать и реализовать <span style={{ color: '#2d9e6b' }}>именно вашу задачу</span>
        </div>
      </div>
    ),
  },
];

const CYBER_TABS: MockupTab[] = [
  {
    label: 'Kali Linux терминал',
    icon: '💻',
    tool: 'Kali Linux',
    render: () => (
      <div style={{ background: '#0a0f0a', borderRadius: 14, overflow: 'hidden', fontFamily: 'monospace' }}>
        {/* Заголовок терминала */}
        <div style={{ background: '#111a11', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 8, fontSize: '.65rem', color: 'rgba(255,255,255,.3)' }}>kali@neuro32:~$</span>
        </div>
        {/* Терминал */}
        <div style={{ padding: '12px 16px', minHeight: 130 }}>
          {[
            { prompt: true, text: 'nmap -sV -O 192.168.1.1' },
            { prompt: false, text: 'Starting Nmap 7.94...' },
            { prompt: false, text: 'Host is up (0.0012s latency)' },
            { prompt: false, text: 'PORT     STATE  SERVICE   VERSION' },
            { prompt: false, text: '22/tcp   open   ssh       OpenSSH 8.9', color: '#10b981' },
            { prompt: false, text: '80/tcp   open   http      nginx 1.24', color: '#10b981' },
            { prompt: false, text: '443/tcp  open   https     nginx 1.24', color: '#10b981' },
            { prompt: false, text: 'OS: Linux 5.15 (Ubuntu 22.04)', color: '#f0a500' },
            { prompt: true, text: '_', blink: true },
          ].map((l, i) => (
            <div key={i} style={{ fontSize: '.66rem', lineHeight: 1.6, color: l.color ?? (l.prompt ? '#10b981' : 'rgba(255,255,255,.6)') }}>
              {l.prompt && !l.blink && <span style={{ color: '#10b981', marginRight: 6 }}>kali@neuro32:~$</span>}
              {l.text}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'CTF-флаг',
    icon: '🏆',
    tool: 'CTF · Kali / DVWA',
    render: () => (
      <div style={{ background: '#0a0f0a', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 16 }}>🏆</span>
          <span style={{ color: '#fff', fontSize: '.8rem', fontWeight: 600 }}>Capture The Flag</span>
          <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 10, padding: '2px 8px', fontSize: '.62rem', color: '#10b981' }}>Solved ✓</div>
        </div>
        {/* Задача */}
        <div style={{ background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
          <div style={{ fontSize: '.65rem', color: 'rgba(16,185,129,.7)', marginBottom: 4 }}>Задача #07 · Криптография</div>
          <div style={{ fontSize: '.72rem', color: '#fff', marginBottom: 6 }}>Расшифруй сообщение</div>
          <div style={{ fontFamily: 'monospace', fontSize: '.65rem', color: 'rgba(255,255,255,.4)', background: '#0a0f0a', padding: '6px 8px', borderRadius: 6 }}>
            SGVsbG8gTmV1cm8zMiE=
          </div>
        </div>
        {/* Решение */}
        <div style={{ fontFamily: 'monospace', fontSize: '.65rem', color: '#10b981', background: 'rgba(16,185,129,.05)', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
          <div style={{ color: 'rgba(255,255,255,.3)', marginBottom: 4 }}># base64 decode</div>
          <div>$ echo "SGVsbG8..." | base64 -d</div>
          <div style={{ color: '#f0a500', marginTop: 4 }}>{'>'} Hello Neuro32!</div>
        </div>
        {/* Флаг */}
        <div style={{ background: 'rgba(240,165,0,.08)', border: '1px solid rgba(240,165,0,.3)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>Флаг принят</div>
          <div style={{ fontFamily: 'monospace', fontSize: '.75rem', color: '#f0a500', letterSpacing: 1 }}>CTF{'{'}b4s3_64_m4st3r{'}'}</div>
          <div style={{ fontSize: '.6rem', color: '#10b981', marginTop: 4 }}>+100 очков · 3 место в группе</div>
        </div>
      </div>
    ),
  },
  {
    label: 'Аудит безопасности',
    icon: '🛡️',
    tool: 'HaveIBeenPwned + VeraCrypt',
    render: () => (
      <div style={{ background: '#0a0f0a', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>🛡️</span>
          <span style={{ color: '#fff', fontSize: '.8rem', fontWeight: 600 }}>Аудит безопасности</span>
          <div style={{ marginLeft: 'auto', fontSize: '.62rem', color: 'rgba(255,255,255,.3)' }}>Персональный отчёт</div>
        </div>
        {/* Метрики */}
        {[
          { label: 'Менеджер паролей', score: 100, status: '✓ Bitwarden настроен', color: '#10b981' },
          { label: 'Двухфакторная аутентификация', score: 90, status: '✓ 12 из 13 аккаунтов', color: '#10b981' },
          { label: 'Утечки данных', score: 70, status: '⚠ 1 старый email в утечке', color: '#f0a500' },
          { label: 'VPN защита', score: 100, status: '✓ WireGuard активен', color: '#10b981' },
        ].map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.6)' }}>{m.label}</span>
              <span style={{ fontSize: '.62rem', color: m.color }}>{m.status}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,.07)', borderRadius: 2 }}>
              <div style={{ width: `${m.score}%`, height: '100%', background: m.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 10, background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.5)' }}>Общий балл безопасности</span>
          <span style={{ fontSize: '.85rem', color: '#10b981', fontWeight: 700 }}>90 / 100</span>
        </div>
      </div>
    ),
  },
  {
    label: 'VPN-сервер',
    icon: '🌐',
    tool: 'Outline / WireGuard',
    render: () => (
      <div style={{ background: '#0a0f0a', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--fm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 16 }}>🌐</span>
          <span style={{ color: '#fff', fontSize: '.8rem', fontWeight: 600 }}>Мой VPN-сервер</span>
          <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontSize: '.65rem', color: '#10b981' }}>Connected</span>
        </div>
        {/* Схема */}
        <div style={{ position: 'relative', height: 90, marginBottom: 12 }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <line x1="20%" y1="50%" x2="40%" y2="50%" stroke="rgba(16,185,129,.3)" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="60%" y1="50%" x2="80%" y2="50%" stroke="rgba(16,185,129,.3)" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          {[
            { left: '8%', icon: '💻', label: 'Мой ПК', color: '#4a7cff' },
            { left: '42%', icon: '🔒', label: 'WireGuard', color: '#10b981', big: true },
            { left: '78%', icon: '🌍', label: 'Интернет', color: '#f0a500' },
          ].map((n, i) => (
            <div key={i} style={{ position: 'absolute', left: n.left, top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ width: n.big ? 44 : 36, height: n.big ? 44 : 36, borderRadius: n.big ? 12 : '50%', background: `${n.color}15`, border: `2px solid ${n.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: n.big ? 18 : 14, margin: '0 auto 4px' }}>{n.icon}</div>
              <div style={{ fontSize: '.55rem', color: 'rgba(255,255,255,.4)' }}>{n.label}</div>
            </div>
          ))}
        </div>
        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { val: '45ms', label: 'Пинг' },
            { val: '↑ 12MB', label: 'Отдано' },
            { val: '↓ 48MB', label: 'Получено' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 8, padding: '6px', textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontSize: '.78rem', fontWeight: 700 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,.35)', fontSize: '.58rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const PROGRAM_DATA: Record<Program, { tabs: MockupTab[]; accent: string; title: string; subtitle: string }> = {
  kids:   { tabs: KIDS_TABS,   accent: '#f0a500', title: 'Что создаёт ребёнок',         subtitle: 'Реальные проекты с первого занятия — не учебные упражнения' },
  teens:  { tabs: TEENS_TABS,  accent: '#4a7cff', title: 'Что создают подростки',       subtitle: 'Рабочие инструменты, которые можно показать при поступлении' },
  adults: { tabs: ADULTS_TABS, accent: '#2d9e6b', title: 'Что создают взрослые',        subtitle: 'Реальные бизнес-инструменты под ваши задачи' },
  cyber:  { tabs: CYBER_TABS,  accent: '#10b981', title: 'Что осваивают на практике',   subtitle: 'Только реальные инструменты — никаких слайдов без практики' },
};

// ─── Компонент ────────────────────────────────────────────────────────────────
export default function OutcomesGallery({ program }: { program: Program }) {
  const { tabs, accent, title, subtitle } = PROGRAM_DATA[program];
  const [active, setActive] = useState(0);

  return (
    <section
      style={{
        padding: '64px 0',
        background: 'var(--bg)',
        // Skip rendering this whole heavy section while it's off-screen.
        // Browser keeps the layout slot reserved (~800px) so scrolling
        // doesn't jump, but skips paint/style/layout for the children
        // (tabs + 6 cards). Big win on long Programs pages.
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 800px',
      }}
    >
      <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="s-eyebrow" style={{ marginBottom: 12 }}>Примеры возможных результатов</div>
          <h2 className="s-h2" style={{ marginBottom: 10 }}>
            {title.split(' ').map((w, i) => i === title.split(' ').length - 1
              ? <span key={i} className="accent">{w}</span>
              : <span key={i}>{w} </span>
            )}
          </h2>
          <p style={{ color: 'var(--t2)', fontSize: '.95rem', maxWidth: 520, margin: '0 auto' }}>{subtitle}</p>
          {/* Honesty disclaimer — these are stylised mockups, not real student
              submissions. Said upfront so we never look like we're passing
              demos as portfolio pieces. */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 14,
            padding: '5px 12px',
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 999,
            fontFamily: 'var(--fm)',
            fontSize: '.62rem',
            color: 'var(--t4)',
            letterSpacing: '.04em',
          }}>
            <span aria-hidden="true">ⓘ</span>
            Стилизованные мокапы возможных работ — реальные проекты учеников появятся после первой когорты
          </div>
        </div>

        {/* Табы */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                border: `1px solid ${i === active ? accent : 'rgba(255,255,255,.1)'}`,
                background: i === active ? `${accent}18` : 'rgba(255,255,255,.03)',
                color: i === active ? accent : 'rgba(255,255,255,.5)',
                fontSize: '.8rem', fontWeight: i === active ? 600 : 400,
                transition: 'all .15s',
                outline: 'none',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Мокап + метаданные */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
          {/* Мокап */}
          <div style={{ border: `1px solid ${accent}25`, borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,.02)' }}>
            {tabs[active].render()}
          </div>

          {/* Описание */}
          <div style={{ padding: '8px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {tabs[active].icon}
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '.9rem', fontWeight: 600 }}>{tabs[active].label}</div>
                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.72rem' }}>Инструмент: {tabs[active].tool}</div>
              </div>
            </div>

            {/* Другие проекты */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Все проекты программы</div>
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '8px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
                    border: `1px solid ${i === active ? accent + '40' : 'rgba(255,255,255,.06)'}`,
                    background: i === active ? `${accent}0d` : 'transparent',
                    textAlign: 'left', outline: 'none',
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{tab.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.78rem', color: i === active ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: i === active ? 600 : 400 }}>{tab.label}</div>
                    <div style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.3)' }}>{tab.tool}</div>
                  </div>
                  {i === active && <span style={{ color: accent, fontSize: '.7rem' }}>●</span>}
                </button>
              ))}
            </div>

            <div style={{ background: `${accent}0a`, border: `1px solid ${accent}20`, borderRadius: 10, padding: '12px 14px', fontSize: '.75rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
              Всё это создаётся прямо на занятиях в лаборатории. Инструменты уже установлены — приходи и делай.
            </div>
          </div>
        </div>

        {/* Мобильные стили */}
        <style>{`
          @media (max-width: 680px) {
            .outcomes-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
