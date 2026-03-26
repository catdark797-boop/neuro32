import Link from "next/link";
import { Brain } from "lucide-react";

const footerLinks = {
  programs: [
    { href: "/kids", label: "Детям 7-12" },
    { href: "/teens", label: "Подросткам 13-17" },
    { href: "/adults", label: "Взрослым 18+" },
    { href: "/cybersecurity", label: "Кибербезопасность" },
  ],
  lab: [
    { href: "/about", label: "О лаборатории" },
    { href: "/programs", label: "Программы" },
    { href: "/expert", label: "О Денисе" },
  ],
  contact: [
    { href: "/contacts", label: "Контакты" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#27272a] bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-[#06B6D4]" />
              <span className="text-xl font-bold gradient-text">НЕЙРО32</span>
            </Link>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Практические встречи по освоению навыков работы с нейросетями и ИИ-технологиями. 
              Офлайн в Новозыбкове, Брянская область.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Программы</h3>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Лаборатория</h3>
            <ul className="space-y-3">
              {footerLinks.lab.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Контакт</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-[#27272a]">
              <p className="text-xs text-[#71717a]">
                ИП Марьянович Д.С.<br />
                Самозанятый<br />
                г. Новозыбков, Брянская обл.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#27272a] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#71717a]">
            © {new Date().getFullYear()} НЕЙРО32. Все права защищены.
          </p>
          <p className="text-xs text-[#71717a]">
            Лаборатория ИИ-технологий в Новозыбкове
          </p>
        </div>
      </div>
    </footer>
  );
}
