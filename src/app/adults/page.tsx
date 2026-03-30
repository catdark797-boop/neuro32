import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ИИ для взрослых 18+" };

const modules = [
  { ico: "🎯", title: "Ваши задачи и цели", desc: "Стратегическая консультация. Определяем, как ИИ может помочь именно в вашей ситуации", sessions: "1 встреча" },
  { ico: "💬", title: "Языковые модели без интернета", desc: "Локальные LLM: как запустить ИИ на своём компьютере для конфиденциальной работы", sessions: "2-3 встречи" },
  { ico: "📚", title: "База знаний на ваших данных", desc: "RAG-системы: создание ИИ-помощника, который знает ваши документы и бизнес-процессы", sessions: "2-3 встречи" },
  { ico: "🛠️", title: "Мастер-класс по бесплатным инструментам", desc: "GigaChat, YandexGPT, ChatGPT, Kandinsky — полный арсенал для работы и бизнеса", sessions: "2 встречи" },
  { ico: "⚙️", title: "Тонкая настройка под специфику", desc: "Fine-tuning моделей для ваших конкретных задач: юриспруденция, медицина, бизнес", sessions: "2-3 встречи" },
];

export default function AdultsPage() {
  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="max-w-3xl">
          <div className="s-tag r-up">ВЗРОСЛЫМ 18+</div>
          <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
            ИИ <span className="ac">работает на вас</span>
          </h1>
          <p className="text-lg text-[var(--ink3)] leading-relaxed mb-6 r-up d2">
            Практическое освоение ИИ-инструментов для бизнеса и карьеры. Языковые модели,
            автоматизация, база знаний на ваших документах.
          </p>
          <div className="flex gap-2 flex-wrap mb-6 r-up d3">
            <span className="chip ch-g">от 8,000₽/мес</span>
            <span className="chip ch-b">Бизнес</span>
            <span className="chip ch-c">Локальные LLM</span>
            <span className="chip ch-a">Первая встреча бесплатно</span>
          </div>
          <Link href="/neuro32/contacts" className="btn btn-p r-up d4">Записаться →</Link>
        </div>
      </section>

      <section className="S">
        <div className="s-tag r-up">ПРОГРАММА</div>
        <h2 className="s-h2 r-up d1">Что <span className="ac">освоите</span></h2>
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
        <h2 className="text-3xl font-black mb-4 r-up" style={{ fontFamily: "var(--font-d)" }}>Результат: ИИ работает на вас</h2>
        <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto r-up d1">Вы владеете арсеналом ИИ-инструментов и умеете применять их в работе и бизнесе.</p>
        <Link href="/neuro32/contacts" className="btn btn-w r-up d2">Записаться бесплатно</Link>
      </section>
    </>
  );
}
