"use client";

import Link from "next/link";
import { useState } from "react";

const packages = [
  { stripe: "linear-gradient(90deg,#2563eb,#4f46e5)", emoji: "🚀", title: "Семейный старт", sub: "Ребёнок и родитель — вместе в ИИ", desc: "Идеальный вектор для семей, где хотят развиваться вместе. Пока ребёнок делает первые шаги с нейросетями, родитель осваивает бесплатные ИИ-инструменты для работы.", price: "9 000", per: "Детская программа + Взрослые блоки А–В", tags: [["ch-b","ИИ для детей"],["ch-g","ИИ для взрослых"]] },
  { stripe: "linear-gradient(90deg,#7c3aed,#e11d48)", emoji: "⚡", title: "Технарь+", sub: "Для подростков, готовых идти глубже", desc: "ИИ-инженерия плюс кибербезопасность в одной траектории. Подросток получает и базу разработчика, и понимание защиты систем — полный профиль.", price: "14 000", per: "Подростковый курс + Блоки кибербезопасности", tags: [["ch-v","Подростки"],["ch-r","Кибербезопасность"]] },
  { stripe: "linear-gradient(90deg,#059669,#0891b2)", emoji: "🧠", title: "Профессионал 360°", sub: "Полная картина ИИ для специалиста", desc: "Для тех, кто хочет разобраться в ИИ на системном уровне. От языковых моделей и баз знаний — до красной команды и защиты систем.", price: "18 000", per: "Взрослые блоки А–Г + Кибербезопасность", tags: [["ch-g","Взрослые"],["ch-r","Кибербезопасность"]] },
  { stripe: "linear-gradient(90deg,#d97706,#e11d48)", emoji: "🏆", title: "Мастер ИИ — Всё включено", sub: "Путь от первых шагов до эксперта", desc: "Максимальная траектория — все направления, приоритетная запись, персональные консультации между встречами.", price: "25 000", per: "Все направления + персональные консультации", tags: [["ch-b","Все программы"],["ch-g","Взрослые"],["ch-r","Кибербез"],["ch-a","Приоритет"]] },
];

const rmData: Record<string, { steps: { emoji: string; title: string; sub: string; dur: string; result?: string; color: string; isFinal?: boolean }[]; banner: { ico: string; title: string; desc: string } }> = {
  family: {
    steps: [
      { emoji: "🧒", title: "Дети: Первое знакомство с ИИ", sub: "Ребёнок запускает первую программу с ИИ", dur: "1 встреча", color: "#2563eb" },
      { emoji: "👨‍💼", title: "Взрослые: Бесплатные ИИ-инструменты", sub: "Родитель осваивает ГигаЧат, ЯндексGPT, Шедеврум", dur: "2–3 встречи", color: "#059669" },
      { emoji: "🧒", title: "Дети: Обучение нейросети", sub: "Ребёнок создаёт и обучает свою нейросеть", dur: "2 встречи", color: "#4f46e5" },
      { emoji: "👨‍💼", title: "Взрослые: Локальные модели", sub: "Языковая модель без интернета на вашем ПК", dur: "1–2 встречи", color: "#0891b2" },
      { emoji: "🎉", title: "Семейный демо-день", sub: "Ребёнок и родитель показывают свои проекты друг другу", dur: "1 встреча", result: "Два проекта", color: "#7c3aed", isFinal: true },
    ],
    banner: { ico: "👨‍👩‍👧‍👦", title: "Результат: семья в мире ИИ", desc: "У ребёнка — первый проект, у родителя — рабочие инструменты. Общие разговоры за ужином — гарантированы." },
  },
  tech: {
    steps: [
      { emoji: "🐍", title: "Питон для ИИ", sub: "Базовый язык для работы с нейросетями", dur: "2–3 встречи", color: "#2563eb" },
      { emoji: "🧠", title: "Нейросеть изнутри", sub: "Перцептрон, обратное распространение, визуализация", dur: "2 встречи", color: "#4f46e5" },
      { emoji: "👁️", title: "Компьютерное зрение", sub: "Детекция объектов в реальном времени", dur: "3 встречи", color: "#0891b2" },
      { emoji: "🛡️", title: "Кибербез: Красная команда", sub: "Атаки на системы ИИ на изолированном стенде", dur: "3–4 встречи", color: "#e11d48" },
      { emoji: "🔵", title: "Кибербез: Синяя команда", sub: "Защита и мониторинг ИИ-систем", dur: "3 встречи", color: "#2563eb" },
      { emoji: "🏆", title: "Финальный проект + защита", sub: "ИИ-проект с элементами безопасности", dur: "2–3 встречи", result: "Портфолио", color: "#7c3aed", isFinal: true },
    ],
    banner: { ico: "⚡", title: "Результат: Junior AI + Security", desc: "Подросток владеет Питоном, понимает нейросети и кибербезопасность — редкое сочетание навыков." },
  },
  pro: {
    steps: [
      { emoji: "💻", title: "Локальные языковые модели", sub: "Установка и настройка на вашем оборудовании", dur: "1–2 встречи", color: "#2563eb" },
      { emoji: "📚", title: "База знаний", sub: "ИИ-ассистент на ваших документах", dur: "2–3 встречи", color: "#059669" },
      { emoji: "🎨", title: "Бесплатные ИИ-инструменты", sub: "Полный арсенал для бизнеса", dur: "2–3 встречи", color: "#4f46e5" },
      { emoji: "🔴", title: "Красная команда", sub: "Атаки на системы ИИ", dur: "3–4 встречи", color: "#e11d48" },
      { emoji: "🔵", title: "Синяя команда", sub: "Защита и обнаружение аномалий", dur: "3 встречи", color: "#2563eb" },
      { emoji: "🏆", title: "Финальный аудит", sub: "Комплексная оценка ИИ-системы", dur: "2 встречи", result: "Сертификат", color: "#7c3aed", isFinal: true },
    ],
    banner: { ico: "🧠", title: "Результат: ИИ-специалист 360°", desc: "Вы понимаете и создание, и защиту, и атаку ИИ-систем. Это полная картина." },
  },
  master: {
    steps: [
      { emoji: "🤖", title: "Все детские модули", sub: "Если начинаете с нуля — лёгкий старт", dur: "8 встреч", color: "#2563eb" },
      { emoji: "⚡", title: "Все подростковые модули", sub: "Питон, нейросети, зрение, языковые модели", dur: "12–14 встреч", color: "#7c3aed" },
      { emoji: "🧠", title: "Все взрослые блоки", sub: "Локальные модели, базы знаний, тонкая настройка", dur: "10–14 встреч", color: "#059669" },
      { emoji: "🛡️", title: "Полная кибербезопасность", sub: "Красная + Синяя команды + Закон", dur: "13–16 встреч", color: "#e11d48" },
      { emoji: "🏆", title: "Персональные консультации", sub: "Индивидуальная поддержка от Степана", dur: "Постоянно", result: "VIP", color: "#d97706", isFinal: true },
    ],
    banner: { ico: "🏆", title: "Результат: Мастер ИИ", desc: "Полный путь от первых шагов до защиты ИИ-систем. Максимальная экспертиза." },
  },
};

const rmTabs = [
  { key: "family", label: "🚀 Семейный старт" },
  { key: "tech", label: "⚡ Технарь+" },
  { key: "pro", label: "🧠 Профессионал 360°" },
  { key: "master", label: "🏆 Мастер ИИ" },
];

export default function PackagesPage() {
  const [activeRM, setActiveRM] = useState("family");
  const rm = rmData[activeRM];

  return (
    <>
      <div className="page-desc"><span className="page-desc-ico">📦</span>Не просто скидка на несколько курсов — это выверенная стратегия развития на несколько месяцев вперёд.</div>
      <div className="ph" style={{ background: "linear-gradient(135deg,#fefce8 0%,#ecfdf5 50%,#eff6ff 100%)" }}>
        <div className="ph-in">
          <div className="ph-badge r-fade">📦 Нейро 32 · Пакеты-траектории</div>
          <h1 className="r-up">Выверенный путь<br /><span style={{ background: "linear-gradient(135deg,#d97706,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>к вашей цели</span></h1>
          <p className="r-up d1">Каждый пакет — это не просто набор занятий. Это продуманная последовательность шагов с конкретными целями и измеримым результатом.</p>
        </div>
      </div>

      <section className="S" style={{ paddingTop: 52 }}>
        <div className="s-tag r-up">Траектории</div>
        <h2 className="s-h2 r-up">Выберите свой <span className="ac">вектор развития</span></h2>
        <div className="pkg-grid">
          {packages.map((p, i) => (
            <div key={p.title} className={`pkc card r-scale d${i + 1}`}>
              <div className="pkc-stripe" style={{ background: p.stripe }} />
              <div className="pk-t">{p.emoji} {p.title}</div>
              <div className="pk-sub">{p.sub}</div>
              <div className="pk-d">{p.desc}</div>
              <div className="pk-p">{p.price} <span style={{ fontSize: "1.02rem", fontWeight: 400, color: "#6b7280" }}>₽/мес</span></div>
              <div className="pk-per">{p.per}</div>
              <div className="pk-inc">Включает:</div>
              <div className="pk-tags">{p.tags.map(([cls, label]) => <span key={label} className={`chip ${cls}`}>{label}</span>)}</div>
              <div style={{ marginTop: 18 }}><Link href="/contacts" className="btn btn-p">Записаться</Link></div>
            </div>
          ))}
        </div>
      </section>

      <section className="S" style={{ paddingTop: 0 }}>
        <div className="s-tag r-up">Карта пути</div>
        <h2 className="s-h2 r-up">Ваша траектория — <span className="ac">шаг за шагом</span></h2>
        <p style={{ color: "var(--ink3)", fontSize: "1rem", maxWidth: 640, marginBottom: 32, lineHeight: 1.7, marginTop: -28 }} className="r-up d1">
          Выберите направление — и увидите конкретный путь: что происходит на каждой встрече, какие навыки накапливаются и к чему вы придёте в финале.
        </p>
        <div className="roadmap-wrap r-up d2">
          <div className="rm-tabs">
            {rmTabs.map((tab) => (
              <button key={tab.key} className={`rm-tab${activeRM === tab.key ? " active" : ""}`} onClick={() => setActiveRM(tab.key)}>{tab.label}</button>
            ))}
          </div>
          {rm && (
            <div className="rm-path-wrap" key={activeRM}>
              <div className="rm-path">
                {rm.steps.map((step, i) => (
                  <div key={i} className={`rm-step${step.isFinal ? " is-final" : ""}`}>
                    <div className="rm-step-left">
                      <div className="rm-step-num" style={{ background: step.color }}>{i + 1}</div>
                      {i < rm.steps.length - 1 && <div className="rm-step-connector" style={{ background: `linear-gradient(to bottom, ${step.color}, ${rm.steps[i + 1].color})`, opacity: 0.2 }} />}
                    </div>
                    <div className="rm-step-card" style={{ borderLeftColor: step.color }}>
                      <div className="rm-step-head">
                        <span className="rm-step-emoji">{step.emoji}</span>
                        <span className="rm-step-title">{step.title}</span>
                      </div>
                      <div className="rm-step-sub">{step.sub}</div>
                      <div className="rm-step-meta">
                        <span className="rm-step-dur">⏱️ {step.dur}</span>
                        {step.result && <span className="rm-step-result" style={{ background: `${step.color}15`, color: step.color }}>🎯 {step.result}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rm-result-banner">
                <span className="rm-result-ico">{rm.banner.ico}</span>
                <div>
                  <div className="rm-result-title">{rm.banner.title}</div>
                  <div className="rm-result-desc">{rm.banner.desc}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="cta-wrap"><div className="cta-box r-scale"><div className="cta-txt"><h3>Не нашли подходящую траекторию?</h3><p>Составим индивидуальное предложение под ваши цели и возможности.</p></div><div className="cta-action"><Link href="/contacts" className="btn btn-w">Обсудить →</Link></div></div></div>
    </>
  );
}
