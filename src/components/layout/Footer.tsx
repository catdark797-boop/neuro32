import Link from "next/link";
import Logo from "@/components/ui/Logo";

export function Footer() {
  return (
    <>
      <footer className="relative z-[2]" style={{ background: "var(--ink)", color: "#fff", padding: "52px 60px 26px", display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 44 }}>
        {/* Бренд */}
        <div>
          <Link href="/" className="flex items-center gap-[9px] mb-2.5" style={{ fontFamily: "var(--font-d)", fontWeight: 900, fontSize: "1.06rem", letterSpacing: "-.01em" }}>
            <Logo size={28} />
            <span>НЕЙРО{" "}
              <span style={{ background: "var(--g2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>32</span>
            </span>
          </Link>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.42)", lineHeight: 1.75, maxWidth: 250 }}>
            Офлайн-практики по искусственному интеллекту в Новозыбкове.
          </p>
          <p style={{ fontSize: "0.96rem", color: "rgba(255,255,255,.3)", marginTop: 9, lineHeight: 1.6 }}>
            г. Новозыбков, Брянская обл.<br />
            ул. Коммунистическая, 22А
          </p>
        </div>

        {/* Программы */}
        <div>
          <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "rgba(255,255,255,.38)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 15 }}>Программы</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { href: "/kids", label: "Детям 7-12" },
              { href: "/teens", label: "Подросткам 13-17" },
              { href: "/adults", label: "Взрослым 18+" },
              { href: "/cyber", label: "Кибербезопасность" },
              { href: "/packages", label: "Пакеты-траектории" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={{ color: "rgba(255,255,255,.6)", fontSize: "1.04rem", transition: "color .2s" }} className="hover:!text-cyan-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* О проекте */}
        <div>
          <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "rgba(255,255,255,.38)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 15 }}>О проекте</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { href: "/about", label: "Эксперт" },
              { href: "/reviews", label: "Отзывы" },
              { href: "/safety", label: "Безопасность" },
              { href: "/contacts", label: "Контакты" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={{ color: "rgba(255,255,255,.6)", fontSize: "1.04rem", transition: "color .2s" }} className="hover:!text-cyan-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Контакты */}
        <div>
          <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "rgba(255,255,255,.38)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 15 }}>Контакты</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            <li>
              <a href="tel:+79019769810" style={{ color: "rgba(255,255,255,.6)", fontSize: "1.04rem" }} className="hover:!text-cyan-300">
                +7 (901) 976-98-10
              </a>
            </li>
            <li>
              <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.6)", fontSize: "1.04rem" }} className="hover:!text-cyan-300">
                Telegram: @DSM1322
              </a>
            </li>
            <li>
              <a href="mailto:d3stemar@yandex.ru" style={{ color: "rgba(255,255,255,.6)", fontSize: "1.04rem" }} className="hover:!text-cyan-300">
                d3stemar@yandex.ru
              </a>
            </li>
          </ul>
        </div>
      </footer>

      {/* Нижняя полоска */}
      <div className="relative z-[2]" style={{
        background: "rgba(0,0,0,.3)", padding: "14px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: "0.92rem", color: "rgba(255,255,255,.28)",
        borderTop: "1px solid rgba(255,255,255,.05)",
      }}>
        <span>© {new Date().getFullYear()} Нейро 32. Все права защищены.</span>
        <span>Денис Степан Марьянович · Самозанятый · НПД</span>
      </div>
    </>
  );
}
