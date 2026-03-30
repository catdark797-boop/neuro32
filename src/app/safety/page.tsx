import type { Metadata } from "next";

export const metadata: Metadata = { title: "Цифровая безопасность" };

const topics = [
  {
    ico: "🔐", title: "Пароли: ваша первая линия обороны",
    tips: [
      "Используйте разные пароли для каждого сайта",
      "Длина важнее сложности — фраза из 4+ слов надёжнее",
      "Менеджер паролей (Bitwarden — бесплатный)",
      "Двухфакторная аутентификация везде, где есть",
      "Никогда не вводите пароль по ссылке из email",
    ],
  },
  {
    ico: "📧", title: "Фишинг: как не попасться на крючок",
    tips: [
      "Проверяйте адрес отправителя полностью",
      "Распознавайте тактику срочности и страха",
      "Наводите курсор на ссылку — не кликайте сразу",
      "При звонке «из банка» — кладите трубку и звоните сами",
      "Будьте осторожны с QR-кодами в общественных местах",
    ],
  },
  {
    ico: "📱", title: "Смартфон: карман с вашей жизнью",
    tips: [
      "Блокировка: минимум 6-значный PIN + биометрия",
      "Обновляйте ОС и приложения — это закрывает уязвимости",
      "Приложения только из официальных магазинов",
      "Проверяйте разрешения приложений",
      "Публичный Wi-Fi → используйте VPN",
    ],
  },
  {
    ico: "🤖", title: "ИИ и ваши данные",
    tips: [
      "Не отправляйте паспорт/СНИЛС/карты в чатботы",
      "Фото детей могут использоваться для обучения моделей",
      "Российские сервисы подчиняются российскому законодательству",
      "Для конфиденциальных документов — локальные модели",
      "Учитесь проверять дипфейки",
    ],
  },
  {
    ico: "👨‍👩‍👧", title: "Дети в интернете",
    tips: [
      "Разговаривайте открыто об интернете",
      "Используйте родительский контроль",
      "Онлайн-друзья ≠ реальная безопасность",
      "Личные данные и фото — только после обсуждения с родителями",
      "Кибербуллинг — это серьёзно",
    ],
  },
  {
    ico: "💳", title: "Финансовая безопасность онлайн",
    tips: [
      "Отдельная карта для онлайн-покупок с лимитом",
      "Никогда не сообщайте CVV и SMS-коды",
      "Проверяйте URL и HTTPS перед оплатой",
      "Включите уведомления о транзакциях",
      "Подозрительно выгодная сделка = мошенничество",
    ],
  },
];

const tools = [
  { name: "Bitwarden", desc: "Менеджер паролей", chip: "ch-b" },
  { name: "Госуслуги ID", desc: "Двухфакторная аутентификация", chip: "ch-g" },
  { name: "Have I Been Pwned", desc: "Проверка утечек email", chip: "ch-r" },
  { name: "Kaspersky VPN", desc: "VPN для публичного Wi-Fi", chip: "ch-v" },
];

export default function SafetyPage() {
  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="max-w-3xl">
          <div className="s-tag r-up">БЕЗОПАСНОСТЬ</div>
          <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
            Гид по <span className="ac">цифровой безопасности</span>
          </h1>
          <p className="text-lg text-[var(--ink3)] leading-relaxed r-up d2">
            Простые правила, которые защитят вас и вашу семью в цифровом мире.
            Бесплатные инструменты и конкретные действия.
          </p>
        </div>
      </section>

      <section className="S">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {topics.map((t, i) => (
            <div key={i} className={`card p-6 r-up d${Math.min(i + 1, 6)}`}>
              <div className="card-glow" />
              <div className="text-3xl mb-3">{t.ico}</div>
              <h3 className="text-lg font-bold text-[var(--ink)] mb-4" style={{ fontFamily: "var(--font-d)" }}>{t.title}</h3>
              <ul className="space-y-2.5">
                {t.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-[var(--ink3)] text-[0.95rem]">
                    <span className="text-[var(--green)] mt-0.5 flex-shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="S" style={{ background: "var(--bg2)" }}>
        <div className="s-tag r-up">ИНСТРУМЕНТЫ</div>
        <h2 className="s-h2 r-up d1">Бесплатные <span className="ac">инструменты защиты</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <div key={i} className={`card p-5 text-center r-up d${i + 1}`}>
              <div className="card-glow" />
              <div className="font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-d)" }}>{tool.name}</div>
              <span className={`chip ${tool.chip}`}>{tool.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
