import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ИИ для детей 7-12 лет" };

const modules = [
  { n: "01", g: "linear-gradient(135deg,#2563eb,#4f46e5)", t: "Первое знакомство: ИИ вокруг нас", d: "Разбираем, где ИИ уже помогает нам каждый день — в играх, приложениях, умных колонках. Каждый ребёнок за своим компьютером пробует управлять простой программой с ИИ. Никакой теории без практики — сразу за клавиатуру.", chips: [["ch-b","Что умеет ИИ"],["ch-w","Как «думает»"],["ch-g","Первый запуск"]], dur: "1 встреча" },
  { n: "02", g: "linear-gradient(135deg,#0891b2,#2563eb)", t: "ИИ учится видеть: распознавание изображений", d: "Загружаем фотографии, обучаем нейросеть различать предметы — и она начинает «видеть». Дети фотографируют игрушки, рисунки, предметы с парты — и наблюдают, как ИИ учится их узнавать. Восторг гарантирован.", chips: [["ch-c","Зрение ИИ"],["ch-b","Фотонаборы"],["ch-g","Живой результат"]], dur: "1–2 встречи" },
  { n: "03", g: "linear-gradient(135deg,#4f46e5,#7c3aed)", t: "Создай собственную нейросеть", d: "Каждый участник создаёт личный набор данных, называет категории и обучает свою нейросеть прямо на сессии. В конце — ИИ узнаёт именно то, чему его научили конкретный ребёнок. Первый собственный ИИ-проект в жизни.", chips: [["ch-v","Своя нейросеть"],["ch-b","Набор данных"],["ch-g","Обучение"]], dur: "2 встречи" },
  { n: "04", g: "linear-gradient(135deg,#d97706,#f59e0b)", t: "Разговорный ИИ: создаём цифрового помощника", d: "Знакомимся с языковыми моделями — ГигаЧат, ЯндексGPT. Каждый придумывает своему ассистенту имя, характер и правила. Учимся писать чёткие инструкции и понимаем, почему ИИ иногда «фантазирует».", chips: [["ch-a","Языковые модели"],["ch-w","Инструкции"],["ch-b","ГигаЧат"]], dur: "1–2 встречи" },
  { n: "05", g: "linear-gradient(135deg,#7c3aed,#e11d48)", t: "ИИ-арт: создаём картины словами", d: "Пробуем нейросети для создания изображений — Шедеврум, Кандинский. Дети учатся описывать то, что хотят увидеть, и получают уникальные картины по своим текстовым описаниям. Можно распечатать и забрать домой.", chips: [["ch-v","Шедеврум"],["ch-v","Кандинский"],["ch-w","Генерация картин"]], dur: "1 встреча" },
  { n: "06", g: "linear-gradient(135deg,#059669,#0891b2)", t: "Демо-день: покажи родителям!", d: "Финальная встреча — каждый участник представляет свой проект. Можно пригласить родителей. Живой показ обученной нейросети, своего ассистента или ИИ-арта. Лучший способ закрепить результат.", chips: [["ch-g","Демо-день"],["ch-b","Личный проект"],["ch-w","Презентация"]], dur: "1 встреча" },
];

export default function KidsPage() {
  return (
    <>
      <div className="page-desc"><span className="page-desc-ico">🤖</span>Для родителей: здесь ваш ребёнок не «учится» в привычном смысле — он создаёт, экспериментирует и удивляется.</div>
      <div className="ph" style={{ background: "linear-gradient(135deg,#eff6ff 0%,#ede9fe 100%)" }}>
        <div className="ph-in">
          <div className="ph-badge r-fade">🤖 Нейро 32 · Траектория «Исследователь»</div>
          <h1 className="r-up">ИИ для детей<br /><span className="gradient-text">7–12 лет</span></h1>
          <p className="r-up d1">Первое знакомство с нейросетями не через видеоурок — а через личный опыт. Ребёнок запустит ИИ, научит его распознавать предметы, создаст своего цифрового ассистента и представит проект на демо-дне.</p>
          <div className="meta-row r-up d2">
            <div className="mpill"><span>👶</span><span className="mpl">Возраст:</span><span className="mpv">7–12 лет</span></div>
            <div className="mpill"><span>👥</span><span className="mpl">Группа:</span><span className="mpv">до 8 чел</span></div>
            <div className="mpill"><span>⏱️</span><span className="mpv">60–90 мин</span></div>
            <div className="mpill"><span>💰</span><span className="mpl">от</span><span className="mpv">5 000 ₽/мес</span></div>
          </div>
        </div>
      </div>

      <section className="msec" style={{ paddingTop: 52 }}>
        <div className="s-tag r-up">Чем мы занимаемся</div>
        <h2 className="s-h2 r-up">Программа встреч — <span className="ac">каждая лучше предыдущей</span></h2>
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
        <div className="s-tag r-up">Форматы участия</div>
        <h2 className="s-h2 r-up">Выберите <span className="ac">подходящий формат</span></h2>
        <div className="pgrid">
          <div className="pc card r-scale d1">
            <div className="pname">Групповые сессии</div>
            <div className="pval"><span className="prub">5 000</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">8 встреч · до 8 человек</div>
            <ul className="pfeats"><li>Все 6 модулей программы</li><li>4 компьютера · по 2 человека</li><li>Демо-день с родителями</li><li>Личный ИИ-проект каждого</li><li>Оплата через СБП · чек НПД</li></ul>
            <Link href="/contacts" className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>Записаться</Link>
          </div>
          <div className="pc card feat r-scale d2">
            <div className="pname">Расширенная программа</div>
            <div className="pval"><span className="prub">7 500</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">12 встреч · углублённый курс</div>
            <ul className="pfeats"><li>Все 6 базовых модулей</li><li>+ Создание ИИ-игры</li><li>+ Работа с голосовым ИИ</li><li>Индивидуальный проект</li></ul>
            <Link href="/contacts" className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>Записаться</Link>
            <div className="psave">Самый полный курс</div>
          </div>
          <div className="pc card r-scale d3">
            <div className="pname">Индивидуально</div>
            <div className="pval"><span className="prub">1 500</span><span className="punit"> ₽/час</span></div>
            <div className="pper">Один на один · личный темп</div>
            <ul className="pfeats"><li>Программа под ребёнка</li><li>Удобный график</li><li>Максимум внимания</li><li>Углублённые темы</li></ul>
            <Link href="/contacts" className="btn btn-s" style={{ width: "100%", justifyContent: "center" }}>Написать</Link>
          </div>
        </div>
      </section>

      <div className="cta-wrap"><div className="cta-box r-scale"><div className="cta-txt"><h3>Для родителей</h3><p>Первая встреча бесплатна. Посмотрите формат, задайте вопросы и убедитесь сами — без обязательств.</p></div><div className="cta-action"><Link href="/contacts" className="btn btn-w">Записать ребёнка →</Link></div></div></div>
    </>
  );
}
