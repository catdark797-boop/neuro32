import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Пакеты-траектории" };

const packages = [
  {
    title: "Семейный старт", color: "#2563eb", price: "от 9,000₽",
    steps: ["Бесплатная консультация", "Основы ИИ для ребёнка (3-4 встречи)", "Языковые модели для родителя (3-4 встречи)", "ИИ-арт вместе (1-2 встречи)", "Демо-день"],
    result: "Вся семья в ИИ",
  },
  {
    title: "Технарь+", color: "#7c3aed", price: "от 12,000₽",
    steps: ["Python для ИИ (2-3 встречи)", "Внутренности нейросетей (2 встречи)", "Компьютерное зрение (3 встречи)", "Языковые модели (2 встречи)", "Red Team: атаки на ИИ (2-3 встречи)", "Blue Team: защита (2 встречи)"],
    result: "Готовый технарь",
  },
  {
    title: "Профессионал 360°", color: "#059669", price: "от 15,000₽",
    steps: ["Стратегическая консультация", "Языковые модели без интернета (2-3 встречи)", "База знаний на ваших документах (2-3 встречи)", "Арсенал бесплатных инструментов (2 встречи)", "Red Team: кибербез (2-3 встречи)", "Blue Team: кибербез (2-3 встречи)"],
    result: "Специалист 360°",
  },
  {
    title: "Мастер ИИ — Всё включено", color: "#d97706", price: "от 25,000₽",
    steps: ["Персональная стратегия", "Основы нейросетей (4-6 встреч)", "Языковые модели (4-5 встреч)", "Полный арсенал инструментов (2-3 встречи)", "Кибербез: Red & Blue Team (6-8 встреч)", "Персональные консультации"],
    result: "Мастер искусственного интеллекта",
  },
];

export default function PackagesPage() {
  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="max-w-3xl">
          <div className="s-tag r-up">ПАКЕТЫ-ТРАЕКТОРИИ</div>
          <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
            Системный <span className="ac">путь роста</span>
          </h1>
          <p className="text-lg text-[var(--ink3)] leading-relaxed r-up d2">
            Выберите готовый маршрут от нуля до эксперта. Каждый пакет — пошаговая траектория
            с конкретным результатом.
          </p>
        </div>
      </section>

      <section className="S">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packages.map((pkg, i) => (
            <div key={i} className={`card r-up d${Math.min(i + 1, 6)}`}>
              <div className="card-glow" />
              <div className="p-1.5" style={{ background: `linear-gradient(135deg, ${pkg.color}15, ${pkg.color}05)` }}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-d)", color: pkg.color }}>{pkg.title}</h3>
                    <span className="dc-price">{pkg.price}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {pkg.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ background: pkg.color }}
                        >
                          {j + 1}
                        </div>
                        <span className="text-[var(--ink2)] text-[0.95rem]">{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl p-4 text-center" style={{ background: `${pkg.color}10`, border: `1px solid ${pkg.color}20` }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: pkg.color }}>РЕЗУЛЬТАТ</div>
                    <div className="font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>{pkg.result}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/neuro32/contacts" className="btn btn-p">Выбрать пакет →</Link>
        </div>
      </section>
    </>
  );
}
