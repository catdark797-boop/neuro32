import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ИИ для детей 7-12 лет" };

const modules = [
  { ico: "🌍", title: "ИИ вокруг нас", desc: "Знакомство с искусственным интеллектом в жизни — голосовые помощники, рекомендации, фильтры", sessions: "1 встреча" },
  { ico: "👁️", title: "ИИ учится видеть", desc: "Компьютерное зрение: распознавание лиц, предметов, цветов. Практика с нейросетями", sessions: "1-2 встречи" },
  { ico: "🧠", title: "Создай свою нейросеть", desc: "Обучение простейшей нейросети. Понимание, как ИИ «думает» и принимает решения", sessions: "2 встречи" },
  { ico: "🤖", title: "Цифровой помощник", desc: "Создание своего ИИ-ассистента с помощью языковых моделей. Промпт-инжиниринг для детей", sessions: "1-2 встречи" },
  { ico: "🎨", title: "ИИ-арт", desc: "Генерация картинок с помощью Kandinsky и Shedevrum. Создание персонажей и миров", sessions: "1 встреча" },
  { ico: "🎉", title: "Демо-день", desc: "Презентация проектов. Ребёнок показывает чему научился родителям и друзьям", sessions: "1 встреча" },
];

export default function KidsPage() {
  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="max-w-3xl">
          <div className="s-tag r-up">ДЕТЯМ 7-12 ЛЕТ</div>
          <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
            ИИ для <span className="ac">юных исследователей</span>
          </h1>
          <p className="text-lg text-[var(--ink3)] leading-relaxed mb-6 r-up d2">
            Ваш ребёнок узнает, как работают нейросети, создаст своего цифрового помощника,
            нарисует картины с помощью ИИ и проведёт демо-день для родителей.
          </p>
          <div className="flex gap-2 flex-wrap mb-6 r-up d3">
            <span className="chip ch-b">7-12 лет</span>
            <span className="chip ch-g">от 5,000₽/мес</span>
            <span className="chip ch-c">4 ПК на занятие</span>
            <span className="chip ch-a">Первая встреча бесплатно</span>
          </div>
          <Link href="/neuro32/contacts" className="btn btn-p r-up d4">Записать ребёнка →</Link>
        </div>
      </section>

      <section className="S">
        <div className="s-tag r-up">ПРОГРАММА</div>
        <h2 className="s-h2 r-up d1">Чему <span className="ac">научится</span> ребёнок</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <div key={i} className={`card p-6 r-up d${Math.min(i + 1, 6)}`}>
              <div className="card-glow" />
              <div className="text-3xl mb-3">{m.ico}</div>
              <h3 className="text-lg font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-d)" }}>{m.title}</h3>
              <p className="text-[var(--ink3)] text-[0.95rem] leading-relaxed mb-3">{m.desc}</p>
              <span className="chip ch-w">{m.sessions}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="S text-center text-white" style={{ background: "var(--g1)" }}>
        <h2 className="text-3xl font-black mb-4 r-up" style={{ fontFamily: "var(--font-d)" }}>Результат: ребёнок-исследователь</h2>
        <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto r-up d1">Ребёнок понимает основы ИИ, умеет работать с нейросетями и готов к следующему уровню.</p>
        <Link href="/neuro32/contacts" className="btn btn-w r-up d2">Записать ребёнка бесплатно</Link>
      </section>
    </>
  );
}
