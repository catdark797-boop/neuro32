import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Кибербезопасность + ИИ" };

const modules = [
  { ico: "⚖️", title: "Право и этика", desc: "Законодательство о кибербезопасности. Этические границы тестирования. Ответственное раскрытие", sessions: "1 встреча", team: "📘" },
  { ico: "🔴", title: "Red Team: атаки на ИИ", desc: "Prompt injection, jailbreak, adversarial attacks. Как обмануть нейросеть и найти уязвимости", sessions: "3-4 встречи", team: "🔴" },
  { ico: "🔵", title: "Blue Team: защита ИИ", desc: "Защита промптов, фильтрация входных данных, мониторинг аномалий в поведении моделей", sessions: "3 встречи", team: "🔵" },
  { ico: "🕵️", title: "Red Team: пентестинг", desc: "Тестирование на проникновение: сканирование, эксплуатация, пост-эксплуатация (в учебной среде)", sessions: "3-4 встречи", team: "🔴" },
  { ico: "🛡️", title: "Blue Team: обнаружение аномалий", desc: "SIEM, анализ логов, поведенческий анализ с помощью ИИ. Построение системы защиты", sessions: "3 встречи", team: "🔵" },
  { ico: "🎯", title: "Финальный проект: аудит системы", desc: "Полный аудит безопасности ИИ-системы от начала до отчёта", sessions: "2 встречи", team: "🏆" },
];

export default function CyberPage() {
  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="max-w-3xl">
          <div className="s-tag r-up">КИБЕРБЕЗОПАСНОСТЬ</div>
          <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
            <span className="ac">Кибербезопасность</span> + ИИ
          </h1>
          <p className="text-lg text-[var(--ink3)] leading-relaxed mb-6 r-up d2">
            Red Team vs Blue Team. Атаки на нейросети и защита от них. Пентестинг,
            обнаружение аномалий, полный аудит безопасности.
          </p>
          <div className="flex gap-2 flex-wrap mb-6 r-up d3">
            <span className="chip ch-r">от 10,000₽/мес</span>
            <span className="chip ch-b">Red Team</span>
            <span className="chip ch-c">Blue Team</span>
            <span className="chip ch-a">Первая встреча бесплатно</span>
          </div>
          <Link href="/neuro32/contacts" className="btn btn-p r-up d4">Записаться →</Link>
        </div>
      </section>

      <section className="S">
        <div className="s-tag r-up">МОДУЛИ</div>
        <h2 className="s-h2 r-up d1">Путь к <span className="ac">специалисту по защите ИИ</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <div key={i} className={`card p-6 r-up d${Math.min(i + 1, 6)}`}>
              <div className="card-glow" />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{m.ico}</span>
                <span className="text-lg">{m.team}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-d)" }}>{m.title}</h3>
              <p className="text-[var(--ink3)] text-[0.95rem] leading-relaxed mb-3">{m.desc}</p>
              <span className="chip ch-w">{m.sessions}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="S text-center text-white" style={{ background: "var(--g4)" }}>
        <h2 className="text-3xl font-black mb-4 r-up" style={{ fontFamily: "var(--font-d)" }}>Результат: специалист по защите ИИ</h2>
        <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto r-up d1">Вы умеете атаковать и защищать ИИ-системы, проводить аудит безопасности.</p>
        <Link href="/neuro32/contacts" className="btn btn-w r-up d2">Записаться бесплатно</Link>
      </section>
    </>
  );
}
