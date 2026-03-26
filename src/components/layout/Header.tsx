"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О лаборатории" },
  { href: "/programs", label: "Программы" },
  { href: "/kids", label: "Детям" },
  { href: "/teens", label: "Подросткам" },
  { href: "/adults", label: "Взрослым" },
  { href: "/cybersecurity", label: "Кибербезопасность" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-[#06B6D4]" />
            <span className="text-xl font-bold gradient-text">НЕЙРО32</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-[#a1a1aa] hover:text-white transition-colors rounded-lg hover:bg-[#27272a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/contacts">
              <Button size="sm">Записаться</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-[#a1a1aa] hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#27272a] bg-[#09090b]">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-3 text-sm text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/contacts" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Записаться</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
