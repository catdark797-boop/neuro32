import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Об эксперте" };

export default function AboutPage() {
  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="why-grid">
          <div>
            <div className="s-tag r-up">ОБ ЭКСПЕРТЕ</div>
            <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
              Денис <span className="ac">Степан Марьянович</span>
            </h1>
            <p className="text-lg text-[var(--ink3)] leading-relaxed mb-6 r-up d2">
              Основатель лаборатории «Нейро 32». Практик в области искусственного интеллекта,
              нейросетей и кибербезопасности. Самозанятый, работает по договору с чеком НПД.
            </p>
            <div className="flex gap-2 flex-wrap mb-6 r-up d3">
              <span className="chip ch-b">ИИ-эксперт</span>
              <span className="chip ch-v">Нейросети</span>
              <span className="chip ch-c">Python</span>
              <span className="chip ch-r">Кибербезопасность</span>
              <span className="chip ch-g">Самозанятый</span>
            </div>
            <div className="flex gap-3 flex-wrap r-up d4">
              <Link href="/contacts" className="btn btn-p">Связаться →</Link>
              <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-s">Telegram</a>
            </div>
          </div>

          <div className="why-vis r-right">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-5xl">Д</div>
              <div className="text-xl font-bold" style={{ fontFamily: "var(--font-d)" }}>Денис С.М.</div>
              <div className="text-white/70 mt-1">Основатель · Эксперт</div>
            </div>
            <div className="space-y-3 text-white/80 text-[0.95rem]">
              <div className="flex items-center gap-2">📍 Новозыбков, Брянская обл.</div>
              <div className="flex items-center gap-2">📞 +7(901)976-98-10</div>
              <div className="flex items-center gap-2">✈️ @DSM1322</div>
              <div className="flex items-center gap-2">📧 d3stemar@yandex.ru</div>
            </div>
          </div>
        </div>
      </section>

      <section className="S">
        <div className="s-tag r-up">ПРИНЦИПЫ</div>
        <h2 className="s-h2 r-up d1">Как <span className="ac">работает</span> лаборатория</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { ico: "🎯", title: "Практика, не теория", desc: "Каждая встреча — руки на клавиатуре. Реальные задачи, живые нейросети, настоящие результаты." },
            { ico: "🆓", title: "Только бесплатные инструменты", desc: "Никаких платных подписок. GigaChat, YandexGPT, ChatGPT free, Kandinsky, Shedevrum." },
            { ico: "🤝", title: "Индивидуальный подход", desc: "Максимум 4 человека на встрече. Каждый работает на своём ПК, получает внимание эксперта." },
            { ico: "📄", title: "Всё официально", desc: "Договор, чек НПД, прозрачные условия. Работа с физлицами, организациями и самозанятыми." },
            { ico: "🔒", title: "Безопасность данных", desc: "Никакие персональные данные не отправляются в интернет без согласия. Локальные модели для конфиденциальной работы." },
            { ico: "🚀", title: "Актуальные технологии", desc: "Программа обновляется каждый месяц. Всё, что актуально в мире ИИ — попадает на занятия." },
          ].map((item, i) => (
            <div key={i} className={`card p-6 r-up d${Math.min(i + 1, 6)}`}>
              <div className="card-glow" />
              <div className="text-3xl mb-3">{item.ico}</div>
              <h3 className="text-lg font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-d)" }}>{item.title}</h3>
              <p className="text-[var(--ink3)] text-[0.95rem] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
