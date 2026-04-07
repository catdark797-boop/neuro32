import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Кибербезопасность + ИИ" };

const modules = [
  { n: "К1", g: "linear-gradient(135deg,#e11d48,#f97316)", t: "Красная команда: атаки на системы ИИ", d: "Изучаем, как злоумышленники атакуют нейросети. Состязательные примеры, атаки через инструкции против языковых моделей. Отравление обучающих данных. Разбираем на изолированном стенде — безопасно и законно.", chips: [["ch-r","Состязательный МО"],["ch-a","Атаки через инструкции"],["ch-v","Извлечение модели"]], dur: "3–4 встречи", prefix: "🔴 " },
  { n: "С1", g: "linear-gradient(135deg,#2563eb,#0891b2)", t: "Синяя команда: защита систем ИИ", d: "Обучение устойчивости моделей, фильтрация входных данных, мониторинг аномальных запросов, укрепление архитектуры. Аудит систем ИИ на уязвимости.", chips: [["ch-b","Устойчивое обучение"],["ch-g","Фильтрация"],["ch-c","Мониторинг"]], dur: "3 встречи", prefix: "🔵 " },
  { n: "К2", g: "linear-gradient(135deg,#e11d48,#7c3aed)", t: "Красная команда: тестирование с ИИ-инструментами", d: "Использование языковых моделей в тестировании на проникновение — автоматизация разведки, анализ кода, генерация векторов атаки. Только на разрешённых тестовых стендах.", chips: [["ch-r","Разведка + ИИ"],["ch-a","Нечёткое тестирование"],["ch-v","Анализ уязвимостей"]], dur: "3–4 встречи", prefix: "🔴 " },
  { n: "С2", g: "linear-gradient(135deg,#4f46e5,#0891b2)", t: "Синяя команда: обнаружение аномалий с помощью МО", d: "Система обнаружения вторжений на базе машинного обучения. Анализ сетевого трафика, поиск аномалий методом «изолирующего леса», автоматическая классификация событий безопасности.", chips: [["ch-b","Изолирующий лес"],["ch-g","Поиск аномалий"],["ch-c","Журналы событий"]], dur: "3 встречи", prefix: "🔵 " },
  { n: "⚖️", g: "linear-gradient(135deg,#059669,#0891b2)", t: "Закон, этика и личная ответственность", d: "Статьи 272–274 УК РФ — где граница между легальным тестированием и уголовным делом. Ответственное раскрытие уязвимостей, программы поиска ошибок. Обязательный блок — без исключений.", chips: [["ch-a","УК РФ 272–274"],["ch-g","Ответственное раскрытие"],["ch-b","Программы ошибок"]], dur: "1 встреча", prefix: "" },
];

export default function CyberPage() {
  return (
    <>
      <div className="page-desc"><span className="page-desc-ico">🛡️</span>Для тех, кто хочет не просто использовать ИИ — но и понимать его уязвимости, защищать системы и строить карьеру в информационной безопасности.</div>
      <div className="ph" style={{ background: "linear-gradient(135deg,#fef2f2 0%,#fdf4ff 100%)" }}>
        <div className="ph-in">
          <div className="ph-badge r-fade">🛡️ Нейро 32 · Траектория «Специалист»</div>
          <h1 className="r-up">Кибербезопасность<br /><span style={{ background: "linear-gradient(135deg,#e11d48,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>и защита ИИ</span></h1>
          <p className="r-up d1">Красная и синяя команды — реальные атаки и защита ИИ-систем. Только на изолированных стендах. Только в рамках законодательства РФ. Никакого хулиганства — только профессиональный подход.</p>
          <div className="meta-row r-up d2">
            <div className="mpill"><span>🎯</span><span className="mpl">Уровень:</span><span className="mpv">Продвинутый</span></div>
            <div className="mpill"><span>👥</span><span className="mpv">до 6 / 1 на 1</span></div>
            <div className="mpill"><span>⏱️</span><span className="mpv">2–3 ч / встреча</span></div>
            <div className="mpill"><span>💰</span><span className="mpl">от</span><span className="mpv">10 000 ₽/мес</span></div>
            <div className="mpill"><span>⚖️</span><span className="mpv">Только легально</span></div>
          </div>
        </div>
      </div>

      <section className="msec" style={{ paddingTop: 52 }}>
        <div className="s-tag r-up">Программа</div>
        <h2 className="s-h2 r-up">Красная и синяя команды <span className="ac">для мира ИИ</span></h2>
        {modules.map((m, i) => (
          <div key={m.n} className={`mitem r-up d${i + 1}`}>
            <div className="mn" style={{ background: m.g, fontSize: "0.88rem" }}>{m.n}</div>
            <div>
              <div className="mt">{m.prefix}{m.t}</div>
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
            <div className="pname">Один блок</div>
            <div className="pval"><span className="prub">10 000</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">К1 или С1 · 3–4 встречи</div>
            <ul className="pfeats"><li>Один тематический блок</li><li>Изолированный стенд</li><li>Только легальные сценарии</li></ul>
            <Link href="/contacts" className="btn btn-s" style={{ width: "100%", justifyContent: "center" }}>Написать</Link>
          </div>
          <div className="pc card feat r-scale d2">
            <div className="pname">Красная + Синяя команды</div>
            <div className="pval"><span className="prub">18 000</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">Все блоки · 13–16 встреч</div>
            <ul className="pfeats"><li>К1 + С1 + К2 + С2 + Закон</li><li>Реальные атаки и защита</li><li>До 6 участников</li><li>Тестовая инфраструктура</li><li>Закон — обязательно</li></ul>
            <Link href="/contacts" className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>Записаться</Link>
          </div>
          <div className="pc card r-scale d3">
            <div className="pname">Индивидуально</div>
            <div className="pval"><span className="prub">3 500</span><span className="punit"> ₽/час</span></div>
            <div className="pper">Персональная программа</div>
            <ul className="pfeats"><li>Под вашу специализацию</li><li>Глубже и быстрее</li><li>Гибкий темп</li></ul>
            <Link href="/contacts" className="btn btn-s" style={{ width: "100%", justifyContent: "center" }}>Написать</Link>
          </div>
        </div>
      </section>

      <div className="cta-wrap"><div className="cta-box r-scale" style={{ background: "linear-gradient(135deg,#7c3aed,#e11d48)" }}><div className="cta-txt"><h3>Важно: только легально</h3><p>Все практики — на изолированных стендах. Применение знаний за пределами разрешённых сценариев — личная ответственность участника перед законодательством РФ.</p></div><div className="cta-action"><Link href="/contacts" className="btn btn-w">Записаться →</Link></div></div></div>
    </>
  );
}
