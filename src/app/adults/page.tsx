import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ИИ для взрослых 18+" };

const modules = [
  { n: "А", g: "linear-gradient(135deg,#2563eb,#4f46e5)", t: "Языковые модели без интернета: ваши данные остаются у вас", d: "Устанавливаем и настраиваем языковые модели, которые работают полностью на вашем компьютере — без отправки данных в облако. Сравниваем разные модели, выбираем оптимальную под задачи и железо.", chips: [["ch-b","Локальные модели"],["ch-c","Без облака"],["ch-g","Безопасность данных"]], dur: "1–2 встречи" },
  { n: "Б", g: "linear-gradient(135deg,#059669,#0891b2)", t: "База знаний: языковая модель на ваших документах", d: "Настраиваем систему, которая «читает» ваши документы, договоры, инструкции — и отвечает на вопросы по ним точно и без придумывания. Корпоративный ИИ-ассистент без утечки данных в интернет.", chips: [["ch-g","База знаний"],["ch-b","Умный поиск"],["ch-c","Ваши документы"]], dur: "2–3 встречи" },
  { n: "В", g: "linear-gradient(135deg,#4f46e5,#7c3aed)", t: "Мастер бесплатных ИИ-инструментов", d: "ГигаЧат, ЯндексGPT, ChatGPT, Шедеврум, Кандинский, Gamma — полный арсенал. Учимся писать точные инструкции, создавать контент, автоматизировать рутину и генерировать материалы для бизнеса.", chips: [["ch-v","ГигаЧат"],["ch-v","Шедеврум"],["ch-b","ChatGPT"],["ch-g","Gamma"]], dur: "2–3 встречи" },
  { n: "Г", g: "linear-gradient(135deg,#d97706,#f59e0b)", t: "Тонкая настройка: модель под вашу специфику", d: "Когда готовая модель даёт недостаточно точные ответы — её «дообучают» на специализированных данных. На выходе — модель, которая понимает вашу терминологию и отраслевую специфику.", chips: [["ch-a","Тонкая настройка"],["ch-b","Набор данных"],["ch-g","Специализация"]], dur: "2–4 встречи" },
  { n: "Д", g: "linear-gradient(135deg,#7c3aed,#e11d48)", t: "Цифровые решения: сайт, бот, контент — под ключ", d: "Разрабатываем сайт, чат-бота на базе языковой модели или цифровой контент с помощью ИИ-инструментов. Официальный договор, чек НПД. Для физлиц, организаций и ИП.", chips: [["ch-r","Сайт"],["ch-v","Чат-бот"],["ch-a","Контент"],["ch-g","Договор + чек"]], dur: "По проекту" },
];

export default function AdultsPage() {
  return (
    <>
      <div className="page-desc"><span className="page-desc-ico">🧠</span>Для тех, кто хочет использовать ИИ как рабочий инструмент — в бизнесе, карьере или повседневной жизни.</div>
      <div className="ph" style={{ background: "linear-gradient(135deg,#ecfdf5 0%,#dbeafe 100%)" }}>
        <div className="ph-in">
          <div className="ph-badge r-fade">🧠 Нейро 32 · Траектории «Профессионал» и Бизнес</div>
          <h1 className="r-up">ИИ для взрослых<br /><span style={{ background: "linear-gradient(135deg,#059669,#2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>и бизнеса</span></h1>
          <p className="r-up d1">Языковые модели без интернета, базы знаний на ваших данных, автоматизация рутины, создание сайтов и цифрового контента — всё это доступно бесплатно, если знать как.</p>
          <div className="meta-row r-up d2">
            <div className="mpill"><span>🎯</span><span className="mpl">Для:</span><span className="mpv">18+ / Бизнес</span></div>
            <div className="mpill"><span>👥</span><span className="mpv">до 8 / 1 на 1</span></div>
            <div className="mpill"><span>📋</span><span className="mpv">Договор + Чек НПД</span></div>
            <div className="mpill"><span>💰</span><span className="mpl">от</span><span className="mpv">8 000 ₽/мес</span></div>
          </div>
        </div>
      </div>

      <section className="msec" style={{ paddingTop: 52 }}>
        <div className="s-tag r-up">Блоки практик</div>
        <h2 className="s-h2 r-up">ИИ-практики и <span className="ac">цифровые инструменты</span></h2>
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
        <div className="s-tag r-up">Стоимость</div>
        <h2 className="s-h2 r-up">Форматы и <span className="ac">цены</span></h2>
        <div className="pgrid">
          <div className="pc card r-scale d1">
            <div className="pname">Групповая программа</div>
            <div className="pval"><span className="prub">8 000</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">Блоки А–В · 10–12 встреч</div>
            <ul className="pfeats"><li>Блоки А + Б + В</li><li>До 8 человек · 4 компьютера</li><li>Бесплатный арсенал ИИ</li><li>Практические задания</li></ul>
            <Link href="/contacts" className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>Записаться</Link>
          </div>
          <div className="pc card feat r-scale d2">
            <div className="pname">Полная программа</div>
            <div className="pval"><span className="prub">12 000</span><span className="punit"> ₽/мес</span></div>
            <div className="pper">Все блоки · 14–18 встреч</div>
            <ul className="pfeats"><li>Блоки А + Б + В + Г</li><li>Личный проект на выходе</li><li>До 8 человек · 4 компьютера</li><li>Материалы и ресурсы</li><li>Чек НПД</li></ul>
            <Link href="/contacts" className="btn btn-p" style={{ width: "100%", justifyContent: "center" }}>Записаться</Link>
            <div className="psave">Самый полный пакет</div>
          </div>
          <div className="pc card r-scale d3">
            <div className="pname">Цифровые услуги</div>
            <div className="pval"><span className="prub">от 15к</span><span className="punit"> ₽</span></div>
            <div className="pper">Сайт / бот / контент</div>
            <ul className="pfeats"><li>Официальный договор</li><li>Чек НПД обязательно</li><li>Для юрлиц и ИП</li><li>Поддержка после сдачи</li></ul>
            <Link href="/contacts" className="btn btn-s" style={{ width: "100%", justifyContent: "center" }}>Обсудить</Link>
          </div>
        </div>
      </section>

      <div className="cta-wrap"><div className="cta-box r-scale"><div className="cta-txt"><h3>Есть конкретная задача?</h3><p>Напишите — за 15 минут разберём, какой инструмент ИИ подойдёт именно вам.</p></div><div className="cta-action"><Link href="/contacts" className="btn btn-w">Написать →</Link></div></div></div>
    </>
  );
}
