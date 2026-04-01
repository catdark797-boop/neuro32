import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ИИ для подростков 13-17 лет" };

const modules = [
  { ico: "🐍", title: "Python для ИИ", desc: "Основы Python, библиотеки для машинного обучения, первые скрипты", sessions: "2-3 встречи" },
  { ico: "🧠", title: "Внутренности нейросетей", desc: "Как устроены нейросети изнутри: слои, веса, обратное распространение ошибки", sessions: "2 встречи" },
  { ico: "👁️", title: "Компьютерное зрение", desc: "Распознавание объектов, классификация изображений, детекция в реальном времени", sessions: "3 встречи" },
  { ico: "💬", title: "Языковые модели", desc: "GPT, GigaChat, YandexGPT — как работают и как использовать для своих задач", sessions: "2-3 встречи" },
  { ico: "🛠️", title: "Арсенал бесплатных инструментов", desc: "Полный набор бесплатных ИИ-сервисов для создания, анализа и автоматизации", sessions: "1-2 встречи" },
  { ico: "🎯", title: "Финальный проект", desc: "Создание собственного ИИ-проекта от идеи до презентации", sessions: "2-3 встречи" },
];

export default function TeensPage() {
  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="max-w-3xl">
          <div className="s-tag r-up">ПОДРОСТКАМ 13-17 ЛЕТ</div>
          <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
            <span className="ac">Python + Нейросети</span> для подростков
          </h1>
          <p className="text-lg text-[var(--ink3)] leading-relaxed mb-6 r-up d2">
            Глубокое погружение в мир ИИ: от Python до компьютерного зрения и языковых моделей.
            Результат — Junior AI-разработчик с собственным проектом.
          </p>
          <div className="flex gap-2 flex-wrap mb-6 r-up d3">
            <span className="chip ch-v">13-17 лет</span>
            <span className="chip ch-g">от 6,500₽/мес</span>
            <span className="chip ch-b">Python</span>
            <span className="chip ch-a">Первая встреча бесплатно</span>
          </div>
          <Link href="/contacts" className="btn btn-p r-up d4">Записаться →</Link>
        </div>
      </section>

      <section className="S">
        <div className="s-tag r-up">МОДУЛИ</div>
        <h2 className="s-h2 r-up d1">Путь к <span className="ac">Junior AI-разработчику</span></h2>
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
        <h2 className="text-3xl font-black mb-4 r-up" style={{ fontFamily: "var(--font-d)" }}>Результат: Junior AI-разработчик</h2>
        <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto r-up d1">Подросток умеет писать код на Python, понимает нейросети и имеет портфолио-проект.</p>
        <Link href="/contacts" className="btn btn-w r-up d2">Записаться бесплатно</Link>
      </section>
    </>
  );
}
