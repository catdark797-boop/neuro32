"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/neuro32", label: "Главная" },
  { href: "/neuro32/about", label: "Эксперт" },
  { href: "/neuro32/kids", label: "Детям" },
  { href: "/neuro32/teens", label: "Подросткам" },
  { href: "/neuro32/adults", label: "Взрослым" },
  { href: "/neuro32/cyber", label: "Кибербез" },
  { href: "/neuro32/packages", label: "Пакеты" },
  { href: "/neuro32/safety", label: "Безопасность" },
  { href: "/neuro32/reviews", label: "Отзывы" },
  { href: "/neuro32/contacts", label: "Контакты" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[990] flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
          scrolled
            ? "bg-white/96 shadow-[var(--sh1)]"
            : "bg-[rgba(247,248,253,.88)] backdrop-blur-[24px] saturate-[160%]"
        }`}
        style={{ height: "var(--nav-h)", borderBottom: "1px solid var(--border)" }}
      >
        {/* Логотип */}
        <Link href="/neuro32" className="flex items-center gap-2.5 font-[var(--font-d)] font-black text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>
          <Logo size={34} />
          <span>НЕЙРО <span className="gradient-text">32</span></span>
        </Link>

        {/* Центр: навигация */}
        <div className="hidden xl:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2.5 py-1.5 rounded-lg text-[0.96rem] font-medium text-[var(--ink3)] hover:bg-[var(--bg2)] hover:text-[var(--blue)] hover:font-bold transition-all whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Правая часть */}
        <div className="hidden xl:flex items-center gap-3">
          {session ? (
            <Link
              href={
                (session.user as Record<string, unknown>)?.role === "admin"
                  ? "/neuro32/admin"
                  : "/neuro32/dashboard"
              }
              className="btn btn-s !py-2 !px-4 !text-sm"
            >
              {(session.user as Record<string, unknown>)?.role === "admin" ? "Админка" : "Кабинет"}
            </Link>
          ) : null}
          <Link href="/neuro32/contacts" className="btn btn-p !py-2 !px-4 !text-sm shadow-[0_4px_14px_rgba(37,99,235,.35)]">
            Записаться →
          </Link>
        </div>

        {/* Гамбургер */}
        <button
          className="xl:hidden flex flex-col gap-[5px] p-1.5 bg-transparent border-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          <span className={`block w-[22px] h-[2px] bg-[var(--ink2)] rounded-sm transition-all ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-[var(--ink2)] rounded-sm transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-[var(--ink2)] rounded-sm transition-all ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Мобильное меню */}
      <div
        className={`fixed top-[var(--nav-h)] left-0 right-0 bottom-0 z-[989] bg-white/97 backdrop-blur-[24px] flex flex-col p-6 gap-1 transition-all duration-[450ms] overflow-y-auto ${
          mobileOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between px-[18px] py-4 rounded-xl text-[var(--ink2)] text-[1.06rem] font-semibold hover:bg-[var(--bg2)] hover:text-[var(--blue)] border border-transparent hover:border-[var(--border)] transition-all"
            onClick={() => setMobileOpen(false)}
          >
            {link.label} <span>→</span>
          </Link>
        ))}
        <div className="h-px bg-[var(--border)] my-2" />
        {session && (
          <Link
            href={(session.user as Record<string, unknown>)?.role === "admin" ? "/neuro32/admin" : "/neuro32/dashboard"}
            className="flex items-center justify-between px-[18px] py-4 rounded-xl text-[var(--ink2)] text-[1.06rem] font-semibold hover:bg-[var(--bg2)] transition-all"
            onClick={() => setMobileOpen(false)}
          >
            {(session.user as Record<string, unknown>)?.role === "admin" ? "Админ-панель" : "Личный кабинет"} <span>→</span>
          </Link>
        )}
        <Link
          href="/neuro32/contacts"
          className="text-center py-4 rounded-xl font-bold text-white mt-3"
          style={{ background: "var(--g1)", boxShadow: "0 4px 14px rgba(37,99,235,.3)" }}
          onClick={() => setMobileOpen(false)}
        >
          Записаться →
        </Link>
      </div>
    </>
  );
}
