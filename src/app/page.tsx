import Link from "next/link";

const directions = [
  { title: "ИИ для детей 7-12 лет", desc: "Нейросети глазами ребёнка, создание цифрового помощника, ИИ-арт, демо-день", price: "от 5,000₽/мес", href: "/neuro32/kids", gradient: "linear-gradient(135deg,#cffafe,#dbeafe)" },
  { title: "ИИ для подростков 13-17", desc: "Python для ИИ, внутренности нейросетей, компьютерное зрение, языковые модели", price: "от 6,500₽/мес", href: "/neuro32/teens", gradient: "linear-gradient(135deg,#ede9fe,#e0f2fe)" },
  { title: "ИИ для взрослых 18+", desc: "Языковые модели без интернета, база знаний на ваших данных, автоматизация", price: "от 8,000₽/мес", href: "/neuro32/adults", gradient: "linear-gradient(135deg,#ecfdf5,#dbeafe)" },
  { title: "Кибербезопасность + ИИ", desc: "Red Team / Blue Team, атаки на ИИ, пентестинг, обнаружение аномалий", price: "от 10,000₽/мес", href: "/neuro32/cyber", gradient: "linear-gradient(135deg,#fef2f2,#fdf4ff)" },
  { title: "Цифровые решения", desc: "Сайты, боты, контент — цифровые инструменты для бизнеса и самозанятых", price: "от 15,000₽", href: "/neuro32/contacts", gradient: "linear-gradient(135deg,#fff7ed,#eff6ff)" },
  { title: "Пакеты-траектории", desc: "Системный путь от нуля до эксперта. Семейный старт, Технарь+, Мастер ИИ", price: "от 9,000₽/мес", href: "/neuro32/packages", gradient: "linear-gradient(135deg,#fefce8,#ecfdf5)" },
];

const whyItems = [
  { ico: "🖥️", title: "Реальное оборудование, не симуляция", text: "4 рабочих ПК на занятие. Живые языковые модели и нейросети. Демонстрации в реальном времени." },
  { ico: "🆓", title: "Только бесплатные инструменты", text: "GigaChat, YandexGPT, ChatGPT (бесплатный), Shedevrum, Kandinsky. Российские и международные сервисы." },
  { ico: "🤝", title: "Партнёрство с АНО «Простые вещи»", text: "Комфортное помещение. Доступные цены. Профессиональная среда для практик." },
  { ico: "📄", title: "Официально: самозанятый, чек НПД", text: "Договор с клиентом. Чек через «Мой налог». Ставка 4-6%. Работа с физлицами, организациями, ИП." },
  { ico: "🛤️", title: "Один путь от 7 лет до кибербезопасника", text: "Прогрессивная программа. Целостная траектория развития от ребёнка до специалиста." },
];

const stats = [
  { num: "4+", label: "направления" },
  { num: "7+", label: "лет мин. возраст" },
  { num: "90", label: "минут сессия" },
  { num: "0₽", label: "первая встреча" },
];

export default function HomePage() {
  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="hero">
        <div className="relative z-[1]">
          <div className="hero-eyebrow r-up">
            <span className="eyedot" />
            <span className="text-[0.96rem] font-medium text-[var(--ink3)]">Набор открыт · Новозыбков</span>
          </div>

          <h1 className="r-up d1">
            <span className="h1-plain">Живые</span>
            <span className="h1-grad">практики ИИ</span>
            <span className="h1-outline">в Новозыбкове</span>
          </h1>

          <p className="hero-sub r-up d2">
            Офлайн-сессии по искусственному интеллекту для детей с 7 лет, подростков и взрослых.
            Нейросети, языковые модели, кибербезопасность.
          </p>

          <div className="flex flex-wrap gap-[7px] mb-7 r-up d3">
            <span className="chip ch-b">ИИ-практики</span>
            <span className="chip ch-v">Нейросети</span>
            <span className="chip ch-c">Python</span>
            <span className="chip ch-r">Кибербез</span>
            <span className="chip ch-g">Дети 7+</span>
          </div>

          <div className="flex gap-3 flex-wrap mb-5 r-up d4">
            <Link href="/neuro32/contacts" className="btn btn-p">Записаться →</Link>
            <Link href="/neuro32/packages" className="btn btn-s">О программах</Link>
          </div>

          <div className="flex gap-2 flex-wrap r-up d5">
            <a href="tel:+79019769810" className="inline-flex items-center gap-[7px] bg-white/80 border border-[var(--border)] rounded-[9px] px-3 py-2 text-[0.96rem] font-medium text-[var(--ink2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-white transition-all backdrop-blur-lg">
              📞 +7(901)976-98-10
            </a>
            <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[7px] bg-white/80 border border-[var(--border)] rounded-[9px] px-3 py-2 text-[0.96rem] font-medium text-[var(--ink2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-white transition-all backdrop-blur-lg">
              ✈️ @DSM1322
            </a>
          </div>
        </div>

        {/* Правая часть — фото-блок */}
        <div className="relative z-[1] hero-r-wrap">
          <div className="rounded-3xl overflow-hidden shadow-[var(--sh3)] border border-[var(--border)] relative bg-gradient-to-br from-blue-50 to-violet-50 h-[500px] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl" style={{ background: "var(--g1)" }}>
                <span className="text-white">Д</span>
              </div>
              <p className="font-bold text-lg text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>Денис Степан Марьянович</p>
              <p className="text-[var(--ink3)] text-sm mt-1">Основатель · Эксперт по ИИ</p>
              <div className="flex gap-1.5 justify-center mt-4 flex-wrap">
                {["ИИ", "Нейросети", "Python", "Кибербез"].map((t) => (
                  <span key={t} className="bg-white/80 border border-white/40 rounded-md px-2 py-1 text-xs font-semibold text-[var(--ink2)]">{t}</span>
                ))}
              </div>
            </div>

            {/* Плавающие пиллы */}
            <div className="fpill absolute -top-4 -right-5 z-10" style={{ animation: "fp 4s ease-in-out infinite" }}>
              <div className="fp-label">Возраст</div>
              <div className="fp-val">7+</div>
            </div>
            <div className="fpill absolute bottom-28 -right-6 z-10" style={{ animation: "fp 4s ease-in-out infinite 1.6s" }}>
              <div className="fp-label">На занятие</div>
              <div className="fp-val">4 ПК</div>
            </div>
            <div className="fpill absolute -bottom-2 -left-5 z-10" style={{ animation: "fp 4s ease-in-out infinite .9s" }}>
              <div className="fp-label">Первая встреча</div>
              <div className="fp-val">бесплатно</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.label} className="stat-box">
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ══════ НАПРАВЛЕНИЯ ══════ */}
      <section className="S">
        <div className="s-tag r-up">НАПРАВЛЕНИЯ</div>
        <h2 className="s-h2 r-up d1">Выберите <span className="ac">свой путь</span> в ИИ</h2>

        <div className="dir-grid">
          {directions.map((d, i) => (
            <Link key={d.title} href={d.href} className={`card dc r-up d${i + 1}`}>
              <div className="card-glow" />
              <div className="dc-illus" style={{ background: d.gradient }}>
                <span className="text-4xl opacity-60">
                  {["🧒", "🧑‍💻", "👨‍💼", "🛡️", "💡", "📦"][i]}
                </span>
              </div>
              <div className="dc-body">
                <div className="dc-title">{d.title}</div>
                <div className="dc-desc">{d.desc}</div>
                <div className="dc-footer">
                  <span className="dc-price">{d.price}</span>
                  <span className="dc-arr">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════ ПОЧЕМУ МЫ ══════ */}
      <section className="S" style={{ background: "var(--bg2)" }}>
        <div className="s-tag r-up">ПОЧЕМУ МЫ</div>
        <h2 className="s-h2 r-up d1">Почему выбирают <span className="ac">Нейро 32</span></h2>

        <div className="why-grid">
          <div className="flex flex-col gap-0">
            {whyItems.map((w, i) => (
              <div key={i} className={`why-item r-up d${i + 1}`}>
                <div className="why-ico">{w.ico}</div>
                <div>
                  <div className="why-title">{w.title}</div>
                  <div className="why-text">{w.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="why-vis r-right">
            <div className="text-lg font-bold mb-6" style={{ fontFamily: "var(--font-d)" }}>Нейро 32 в цифрах</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "4+", l: "Направления" },
                { v: "90 мин", l: "Длительность" },
                { v: "4 ПК", l: "На занятие" },
                { v: "0₽", l: "Первая встреча" },
              ].map((s) => (
                <div key={s.l} className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-black" style={{ fontFamily: "var(--font-d)" }}>{s.v}</div>
                  <div className="text-sm text-white/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white/80 text-[0.95rem] leading-relaxed">
                Единственная лаборатория ИИ в Новозыбкове. Реальное оборудование, живые нейросети, только бесплатные инструменты.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="S text-center text-white" style={{ background: "var(--g1)" }}>
        <h2 className="text-3xl md:text-5xl font-black mb-5 r-up" style={{ fontFamily: "var(--font-d)", letterSpacing: "-.03em" }}>
          Начните путь в ИИ сегодня
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto r-up d1">
          Первая встреча — бесплатно. Запишитесь и убедитесь сами.
        </p>
        <div className="flex gap-3 justify-center flex-wrap r-up d2">
          <Link href="/neuro32/contacts" className="btn btn-w">Записаться бесплатно</Link>
          <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="btn btn-outline-w">Связаться в Telegram</a>
        </div>
      </section>
    </>
  );
}
