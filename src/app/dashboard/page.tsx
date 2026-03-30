"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const panels = [
  { id: "dash", label: "📊 Дашборд" },
  { id: "sched", label: "📅 Расписание" },
  { id: "pay", label: "💳 Оплата" },
  { id: "prof", label: "👤 Профиль" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [activePanel, setActivePanel] = useState("dash");
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="S flex items-center justify-center min-h-[60vh]">
        <div className="text-[var(--ink3)]">Загрузка...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/neuro32/auth");
    return null;
  }

  const user = session.user as Record<string, unknown>;

  return (
    <div className="flex min-h-[calc(100vh-var(--nav-h))]">
      {/* Сайдбар */}
      <div className="dash-sidebar">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3" style={{ background: "var(--g1)" }}>
            {(user.name as string)?.[0] || "U"}
          </div>
          <div className="font-bold text-[var(--ink)] text-sm">{user.name as string}</div>
          <div className="text-xs text-[var(--ink4)]">{user.email as string}</div>
        </div>

        {panels.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePanel(p.id)}
            className={`dash-nav-item ${activePanel === p.id ? "active" : ""}`}
          >
            {p.label}
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-[var(--border)]">
          {(user.role as string) === "admin" && (
            <Link href="/neuro32/admin" className="dash-nav-item text-[var(--blue)]">🔧 Админ-панель</Link>
          )}
          <button onClick={() => signOut({ callbackUrl: "/neuro32" })} className="dash-nav-item text-[var(--rose)]">
            🚪 Выйти
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 p-8 bg-[var(--bg)]">
        {activePanel === "dash" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>
              Добро пожаловать, {(user.name as string)?.split(" ")[0]}!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Занятий пройдено", value: "0", ico: "📚" },
                { label: "Следующее занятие", value: "—", ico: "📅" },
                { label: "Баланс", value: "0₽", ico: "💰" },
                { label: "Достижений", value: "0", ico: "🏆" },
              ].map((s) => (
                <div key={s.label} className="dash-card">
                  <div className="text-2xl mb-2">{s.ico}</div>
                  <div className="text-2xl font-black text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>{s.value}</div>
                  <div className="text-sm text-[var(--ink3)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="dash-card">
              <h3 className="font-bold text-[var(--ink)] mb-3" style={{ fontFamily: "var(--font-d)" }}>Быстрые действия</h3>
              <div className="flex gap-3 flex-wrap">
                <Link href="/neuro32/contacts" className="btn btn-p !text-sm !py-2 !px-4">Записаться на встречу</Link>
                <Link href="/neuro32/packages" className="btn btn-s !text-sm !py-2 !px-4">Выбрать пакет</Link>
              </div>
            </div>
          </div>
        )}

        {activePanel === "sched" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Расписание</h1>
            <div className="dash-card text-center py-12">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-d)" }}>Нет запланированных занятий</h3>
              <p className="text-[var(--ink3)] mb-4">Запишитесь на встречу, и она появится здесь.</p>
              <Link href="/neuro32/contacts" className="btn btn-p !text-sm">Записаться →</Link>
            </div>
          </div>
        )}

        {activePanel === "pay" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Оплата</h1>
            <div className="dash-card mb-6">
              <h3 className="font-bold text-[var(--ink)] mb-4" style={{ fontFamily: "var(--font-d)" }}>Способы оплаты</h3>
              <div className="space-y-2 text-[var(--ink3)]">
                <p>💳 СБП — Система быстрых платежей</p>
                <p>📄 Договор с самозанятым</p>
                <p>🧾 Счёт для организаций</p>
                <p>📱 Чек НПД через «Мой налог»</p>
              </div>
            </div>
            <div className="dash-card text-center py-8">
              <p className="text-[var(--ink3)]">История платежей пуста</p>
            </div>
          </div>
        )}

        {activePanel === "prof" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Профиль</h1>
            <div className="dash-card max-w-lg">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Имя</label>
                  <input className="form-input" defaultValue={user.name as string} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" defaultValue={user.email as string} readOnly />
                </div>
                <div>
                  <label className="form-label">Телефон</label>
                  <input className="form-input" placeholder="+7..." />
                </div>
                <div>
                  <label className="form-label">Telegram</label>
                  <input className="form-input" placeholder="@username" />
                </div>
                <div>
                  <label className="form-label">О себе / цели</label>
                  <textarea className="form-input" rows={3} placeholder="Расскажите о своих целях в ИИ..." />
                </div>
                <button className="btn btn-p">Сохранить →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
