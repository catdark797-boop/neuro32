import Link from "next/link";
import Logo from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Бренд */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4" style={{ fontFamily: "var(--font-d)" }}>
              <Logo size={30} />
              <span className="font-black text-[var(--ink)]">НЕЙРО <span className="gradient-text">32</span></span>
            </Link>
            <p className="text-[0.95rem] text-[var(--ink3)] leading-relaxed max-w-sm">
              Офлайн-практики по искусственному интеллекту в Новозыбкове.
              Для детей с 7 лет, подростков и взрослых. Первая встреча — бесплатно.
            </p>
          </div>

          {/* Программы */}
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)] mb-4 uppercase tracking-wider">Программы</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/kids", label: "Детям 7-12" },
                { href: "/teens", label: "Подросткам 13-17" },
                { href: "/adults", label: "Взрослым 18+" },
                { href: "/cyber", label: "Кибербезопасность" },
                { href: "/packages", label: "Пакеты-траектории" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.95rem] text-[var(--ink3)] hover:text-[var(--blue)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* О проекте */}
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)] mb-4 uppercase tracking-wider">О проекте</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "Эксперт" },
                { href: "/reviews", label: "Отзывы" },
                { href: "/safety", label: "Безопасность" },
                { href: "/contacts", label: "Контакты" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.95rem] text-[var(--ink3)] hover:text-[var(--blue)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)] mb-4 uppercase tracking-wider">Контакты</h3>
            <ul className="space-y-2.5 text-[0.95rem] text-[var(--ink3)]">
              <li>
                <a href="tel:+79019769810" className="hover:text-[var(--blue)] transition-colors">
                  +7 (901) 976-98-10
                </a>
              </li>
              <li>
                <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blue)] transition-colors">
                  Telegram: @DSM1322
                </a>
              </li>
              <li>
                <a href="mailto:d3stemar@yandex.ru" className="hover:text-[var(--blue)] transition-colors">
                  d3stemar@yandex.ru
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--ink4)]">
                Денис Степан Марьянович<br />
                Самозанятый · НПД<br />
                г. Новозыбков, Брянская обл.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--ink4)]">
            © {new Date().getFullYear()} Нейро 32. Все права защищены.
          </p>
          <p className="text-xs text-[var(--ink4)]">
            Лаборатория ИИ-технологий · Новозыбков
          </p>
        </div>
      </div>
    </footer>
  );
}
