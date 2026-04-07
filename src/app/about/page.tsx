import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Об эксперте" };

const certs = [
  { emoji: "🎓", bg: "#dbeafe", stroke: "#3b82f6", year: "РЭУ им. Плеханова · 2023", yearBg: "#dbeafe", yearColor: "#1d4ed8", title: "Веб-разработчик (Full Stack)", desc: "Полнофункциональная веб-разработка: клиентская часть, серверная логика, базы данных, программные интерфейсы.", tags: [["ch-b","HTML/CSS/JS"],["ch-b","Backend"]] },
  { emoji: "📊", bg: "#ede9fe", stroke: "#8b5cf6", year: "Финансовый университет при Правительстве РФ · 2022", yearBg: "#ede9fe", yearColor: "#6d28d9", title: "Аналитик больших данных", desc: "Анализ данных, машинное обучение, прикладная статистика и оптимизация бизнес-процессов.", tags: [["ch-v","Data Science"],["ch-v","ML"]] },
  { emoji: "🤖", bg: "#d1fae5", stroke: "#059669", year: "2023–2026 · Активная практика", yearBg: "#d1fae5", yearColor: "#065f46", title: "Промт-инжиниринг и языковые модели", desc: "ГигаЧат, ЯндексGPT, GPT-4, Claude, Llama. Системные инструкции, цепочки рассуждений, базы знаний.", tags: [["ch-g","ГигаЧат"],["ch-g","GPT-4"],["ch-c","Базы знаний"]] },
  { emoji: "👁️", bg: "#cffafe", stroke: "#0891b2", year: "Практическая специализация", yearBg: "#cffafe", yearColor: "#155e75", title: "Компьютерное зрение", desc: "Нейросети для распознавания изображений, анализ видеопотока, детекция и слежение за объектами.", tags: [["ch-c","Распознавание"],["ch-c","Видеоанализ"]] },
  { emoji: "🛡️", bg: "#fee2e2", stroke: "#e11d48", year: "Специализация · Защита ИИ", yearBg: "#fee2e2", yearColor: "#991b1b", title: "Красная и синяя команды ИИ", desc: "Атаки на нейросети, защита языковых моделей, аудит систем ИИ. Строго в рамках законодательства РФ.", tags: [["ch-r","Красная команда"],["ch-v","Синяя команда"]] },
  { emoji: "🎨", bg: "#fef3c7", stroke: "#d97706", year: "2022–2026 · Постоянно развиваю", yearBg: "#fef3c7", yearColor: "#92400e", title: "Генеративный ИИ и создание контента", desc: "Шедеврум, Кандинский, Midjourney, Stable Diffusion. Визуальный контент и брендинг.", tags: [["ch-a","Шедеврум"],["ch-a","Кандинский"]] },
];

const skills = [
  { name: "Промт-инжиниринг / Языковые модели", pct: 95 },
  { name: "Веб-разработка (Full Stack)", pct: 90 },
  { name: "Python для ИИ и анализа данных", pct: 88 },
  { name: "Генеративный ИИ", pct: 92 },
  { name: "Компьютерное зрение", pct: 85 },
  { name: "Базы знаний / LangChain", pct: 82 },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-desc"><span className="page-desc-ico">👤</span>Узнайте, кто стоит за Нейро 32 — опыт, квалификация и подход к работе.</div>
      <div className="ab-wrap">
        <div className="r-left">
          <div className="ab-photo">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-violet-50 h-[540px] flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl" style={{ background: "var(--g1)" }}>
                  <span className="text-white">Д</span>
                </div>
                <p className="font-bold text-lg text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>Денис Степан Марьянович</p>
                <p className="text-[var(--ink3)] text-sm mt-1">Практик ИИ · Промт-инженер · Веб-разработчик</p>
              </div>
            </div>
          </div>
        </div>
        <div className="r-right">
          <div className="ab-tag">Об эксперте</div>
          <h2 className="ab-h2">Степан<br />Денис</h2>
          <p className="ab-txt">Практик с многолетним опытом в области искусственного интеллекта, веб-разработки и анализа данных. Специализация — перевод сложных технологий на человеческий язык и их применение в реальных задачах.</p>
          <p className="ab-txt">Работаю только офлайн. 4 рабочих компьютера на каждой сессии — не рекламный текст, а рабочая лаборатория. Всё, что показываю, можно трогать руками, запускать и изменять прямо сейчас.</p>
          <p className="ab-txt">Официальный самозанятый. Работаю по договору, выдаю чек НПД. Партнёрство с АНО «Простые вещи» позволяет проводить сессии в комфортном помещении по доступным ценам.</p>
          <div className="ab-chips">
            <span className="chip ch-b">Промт-инжиниринг</span><span className="chip ch-b">Языковые модели</span>
            <span className="chip ch-v">Красная команда ИИ</span><span className="chip ch-v">Синяя команда ИИ</span>
            <span className="chip ch-g">Кибербезопасность</span><span className="chip ch-g">Анализ данных</span>
            <span className="chip ch-a">Python · JS · Java</span><span className="chip ch-w">Веб-разработка</span>
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 20 }}>
            <a href="tel:+79019769810" className="hc-link">📞 +7 (901) 976-98-10</a>
            <a href="https://t.me/DSM1322" className="hc-link" target="_blank" rel="noopener noreferrer">✈️ @DSM1322</a>
            <a href="https://vk.com/id1071554033" className="hc-link" target="_blank" rel="noopener noreferrer">🔵 ВКонтакте</a>
          </div>
        </div>
      </div>

      <section className="S" style={{ paddingTop: 0 }}>
        <div className="s-tag">Квалификация</div>
        <h2 className="s-h2 r-up">Документы и <span className="ac">компетенции</span></h2>
      </section>
      <div className="cert-grid">
        {certs.map((c, i) => (
          <div key={c.title} className={`cert-card card r-scale d${i + 1}`}>
            <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>{c.emoji}</div>
            <span className="cy" style={{ background: c.yearBg, color: c.yearColor }}>{c.year}</span>
            <div className="ct">{c.title}</div>
            <div className="co">{c.desc}</div>
            <div className="ctags">{c.tags.map(([cls, label]) => <span key={label} className={`chip ${cls}`}>{label}</span>)}</div>
          </div>
        ))}
      </div>

      <div className="sk-grid">
        {skills.map((s, i) => (
          <div key={s.name} className={`sk-item r-up d${i + 1}`}>
            <div className="sk-head"><span className="sk-name">{s.name}</span><span className="sk-pct">{s.pct}%</span></div>
            <div className="sk-bar"><div className="sk-fill" style={{ width: `${s.pct}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="partner-wrap r-scale">
        <div className="pt-ico">🤝</div>
        <div>
          <div className="pt-title">Партнёрство с АНО «Простые вещи»</div>
          <div className="pt-txt">Нейро 32 проводит сессии на базе АНО «Простые вещи» в Новозыбкове. Организация безвозмездно предоставляет помещение, мебель и оргтехнику. Это позволяет направить максимум ресурсов в качество практики — а не в аренду. Профессиональный уровень при ценах, доступных жителям Новозыбковского городского округа.</div>
        </div>
      </div>

      <div className="cta-wrap"><div className="cta-box r-scale"><div className="cta-txt"><h3>Хотите познакомиться?</h3><p>Первая встреча — диагностика уровня, личный план, знакомство с форматом. Без давления.</p></div><div className="cta-action"><Link href="/contacts" className="btn btn-w">Написать Степану →</Link></div></div></div>
    </>
  );
}
