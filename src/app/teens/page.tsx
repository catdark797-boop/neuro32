import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ИИ для подростков 13-17 лет" };

const modules = [
  { n: "01", g: "linear-gradient(135deg,#2563eb,#4f46e5)", t: "Питон для ИИ: быстрый старт без скуки", d: "Не «программирование с нуля», а именно тот Питон, который нужен для работы с ИИ. Переменные, структуры данных, функции, библиотеки — всё через задачи, связанные с нейросетями. Первые результаты — уже на первой встрече.", chips: [["ch-b","Питон"],["ch-c","NumPy"],["ch-g","Pandas"]], dur: "2–3 встречи" },
  { n: "02", g: "linear-gradient(135deg,#0891b2,#2563eb)", t: "Нейросеть изнутри: не магия, а математика", d: "Нейрон, слой, веса, активация, метод обратного распространения ошибки — через живые визуализации и эксперименты. Участники сами «тренируют» простую сеть и видят, как меняются её параметры в реальном времени.", chips: [["ch-v","Перцептрон"],["ch-b","Обратное распространение"],["ch-g","Визуализация"]], dur: "2 встречи" },
  { n: "03", g: "linear-gradient(135deg,#4f46e5,#7c3aed)", t: "Компьютерное зрение: ИИ с глазами", d: "Нейросеть для распознавания объектов на видеопотоке в реальном времени — прямо на сессии. Детекция предметов, распознавание поз, слежение за объектами. Каждый собирает свой пайплайн и уносит рабочий код домой.", chips: [["ch-v","Распознавание объектов"],["ch-b","Обработка видео"],["ch-g","Слежение"]], dur: "3 встречи" },
  { n: "04", g: "linear-gradient(135deg,#d97706,#f59e0b)", t: "Языковые модели: что внутри ГигаЧата и ChatGPT", d: "Трансформеры, токены, контекстное окно, инжиниринг инструкций. Запускаем языковую модель без подключения к интернету прямо на сессии. Понимаем, почему ИИ иногда «галлюцинирует» — и как это исправить.", chips: [["ch-a","Трансформеры"],["ch-b","Локальные модели"],["ch-g","Инструкции"]], dur: "2–3 встречи" },
  { n: "05", g: "linear-gradient(135deg,#059669,#0891b2)", t: "Бесплатные ИИ-инструменты: мастер-класс", d: "ГигаЧат, ЯндексGPT, Шедеврум, Кандинский, ChatGPT — учимся использовать весь арсенал бесплатных инструментов на профессиональном уровне. Автоматизация учёбы, создание контента, генерация кода.", chips: [["ch-g","ГигаЧат"],["ch-g","Шедеврум"],["ch-b","ChatGPT"]], dur: "1–2 встречи" },
  { n: "06", g: "linear-gradient(135deg,#7c3aed,#e11d48)", t: "Финальный проект: от идеи до презентации", d: "Детектор объектов, чат-бот с характером, классификатор изображений или что-то своё — участник сам выбирает тему. Защита проекта перед группой с вопросами. Настоящее портфолио, а не скриншот.", chips: [["ch-g","Проект"],["ch-b","Защита"],["ch-w","Портфолио"]], dur: "2–3 встречи" },
];

export default function TeensPage() {
  return (
    <>
      <div className="page-desc"><span className="page-desc-ico">⚡</span>Для подростков, которые хотят понимать технологии изнутри — не смотреть, как другие строят будущее, а строить его самим.</div>
      <div className="ph" style={{ background: "linear-gradient(135deg,#ede9fe 0%,#e0f2fe 100%)" }}>
        <div className="ph-in">
          <div className="ph-badge r-fade">⚡ Нейро 32 · Траектория «Разработчик»</div>
          <h1 className="r-up">ИИ для<br /><span style={{ background: "linear-gradient(135deg,#7c3aed,#0891b2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>подростков</span></h1>
          <p className="r-up d1">Язык Питон, нейросети, компьютерное зрение, языковые модели — настоящая инженерная база. Каждая встреча заканчивается работающим кодом, который можно показать и объяснить.</p>
          <div className="meta-row r-up d2">
            <div className="mpill"><span>🧑</span><span className="mpl">Возраст:</span><span className="mpv">13–17 лет</span></div>
            <div className="mpill"><span>👥</span><span className="mpv">до 8 человек</span></div>
            <div className="mpill"><span>⏱️</span><span className="mpv">90–120 мин</span></div>
            <div className="mpill"><span>💰</span><span className="mpl">от</span><span className="mpv">6 500 ₽/мес</span></div>
          </div>
        </div>
      </div>

      <section className="msec" style={{ paddingTop: 52 }}>
        <div className="s-tag r-up">Программа</div>
        <h2 className="s-h2 r-up">Что <span className="ac">прокачиваем</span></h2>
        {modules.map((m, i) => (
          <div key={m.n} className={`mitem r-up d${i + 1}`}>
            <div className="mn" style={{ background: m.g }}>{m.n}</div>
            <div>
              <div className="mt">{m.t}</div>
              <div className="md">{m.d}</div>
              <div className="mchips">{m.chips.map(([cls, label]) => <span key={label} className={`chip ${cls}`}>{label}</span>)}</div>
            </div>
            <div className="mdur">{m.dur}</div>
          </div>
        ))}
      </section>

      <section className="psec">
        <div className="s-tag r-up">Стоимость</div>
        <h2 className="s-h2 r-up">Форматы и <span className="ac">цены</span></h2>
        <div className="pgrid">
          <div className="pc card r-scale d1">
            <div className="pname">Групповой курс</div>
            <div className="pval"><span className="prub">6 500</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">12–14 встреч · все модули</div>
            <ul className="pfeats"><li>Все 6 модулей программы</li><li>До 8 человек · 4 компьютера</li><li>Финальный проект</li><li>Бесплатные ИИ-инструменты</li><li>Портфолио-проект</li></ul>
            <Link href="/contacts" className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>Записаться</Link>
          </div>
          <div className="pc card feat r-scale d2">
            <div className="pname">Интенсив + наставничество</div>
            <div className="pval"><span className="prub">10 000</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">Все модули + персональный разбор</div>
            <ul className="pfeats"><li>Все 6 модулей</li><li>Персональный разбор кода</li><li>Помощь с проектом между встречами</li><li>Рекомендательное письмо</li><li>Расширенное портфолио</li></ul>
            <Link href="/contacts" className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>Записаться</Link>
            <div className="psave">Максимальный результат</div>
          </div>
          <div className="pc card r-scale d3">
            <div className="pname">Индивидуально</div>
            <div className="pval"><span className="prub">2 000</span><span className="punit"> ₽/час</span></div>
            <div className="pper">Один на один · свой темп</div>
            <ul className="pfeats"><li>Программа под участника</li><li>Углубление в нужные темы</li><li>Гибкий график</li></ul>
            <Link href="/contacts" className="btn btn-s" style={{ width: "100%", justifyContent: "center" }}>Написать</Link>
          </div>
        </div>
      </section>

      <div className="cta-wrap"><div className="cta-box r-scale"><div className="cta-txt"><h3>Готовы к старту?</h3><p>Первая встреча бесплатна — оценим уровень и составим план.</p></div><div className="cta-action"><Link href="/contacts" className="btn btn-w">Записаться →</Link></div></div></div>
    </>
  );
}
