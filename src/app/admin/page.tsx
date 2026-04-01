"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Stats {
  users: number;
  reviews: number;
  bookings: number;
  payments: number;
  pendingReviews: number;
  newBookings: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/neuro32/api/admin/stats");
      if (res.ok) {
        setStats(await res.json());
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (session && (session.user as Record<string, unknown>)?.role === "admin") {
      loadStats();
    }
  }, [session, loadStats]);

  if (status === "loading") {
    return <div className="S flex items-center justify-center min-h-[60vh]"><p className="text-[var(--ink3)]">Загрузка...</p></div>;
  }

  if (!session || (session.user as Record<string, unknown>)?.role !== "admin") {
    router.push("/auth");
    return null;
  }

  const tabs = [
    { id: "stats", label: "📊 Статистика" },
    { id: "bookings", label: "📋 Заявки" },
    { id: "reviews", label: "💬 Отзывы" },
    { id: "users", label: "👥 Пользователи" },
    { id: "content", label: "📝 Контент" },
    { id: "ai", label: "🤖 ИИ-секретарь" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-var(--nav-h))]">
      <div className="dash-sidebar">
        <div className="mb-6">
          <div className="font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>Админ-панель</div>
          <div className="text-xs text-[var(--ink4)]">Нейро 32</div>
        </div>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`dash-nav-item ${activeTab === t.id ? "active" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 bg-[var(--bg)]">
        {activeTab === "stats" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Статистика</h1>
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Пользователей", value: stats.users, ico: "👥" },
                  { label: "Отзывов", value: stats.reviews, ico: "💬" },
                  { label: "Заявок", value: stats.bookings, ico: "📋" },
                  { label: "Платежей", value: stats.payments, ico: "💳" },
                  { label: "На модерации", value: stats.pendingReviews, ico: "⏳", color: "var(--amber)" },
                  { label: "Новых заявок", value: stats.newBookings, ico: "🔔", color: "var(--rose)" },
                ].map((s) => (
                  <div key={s.label} className="dash-card">
                    <div className="text-2xl mb-2">{s.ico}</div>
                    <div className="text-3xl font-black" style={{ fontFamily: "var(--font-d)", color: s.color || "var(--ink)" }}>{s.value}</div>
                    <div className="text-sm text-[var(--ink3)] mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--ink3)]">Загрузка статистики...</p>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Заявки</h1>
            <div className="dash-card">
              <p className="text-[var(--ink3)] text-center py-8">
                Управление заявками будет доступно после первых записей.
                Новые заявки будут появляться здесь автоматически.
              </p>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Модерация отзывов</h1>
            <div className="dash-card">
              <p className="text-[var(--ink3)] text-center py-8">
                Здесь будут отображаться отзывы на модерации.
                Вы сможете одобрять, редактировать или удалять отзывы.
              </p>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Пользователи</h1>
            <div className="dash-card">
              <p className="text-[var(--ink3)] text-center py-8">
                Список зарегистрированных пользователей.
                После регистрации первых пользователей здесь появится таблица.
              </p>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>Управление контентом</h1>
            <div className="dash-card">
              <p className="text-[var(--ink3)] text-center py-8">
                CMS для управления страницами, FAQ и объявлениями.
                Создавайте и редактируйте контент сайта.
              </p>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)] mb-6" style={{ fontFamily: "var(--font-d)" }}>🤖 ИИ-секретарь</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="dash-card">
                <h3 className="font-bold text-[var(--ink)] mb-3" style={{ fontFamily: "var(--font-d)" }}>Возможности</h3>
                <ul className="space-y-2 text-[var(--ink3)]">
                  <li>✅ Отвечает на вопросы о программах и ценах</li>
                  <li>✅ Помогает посетителям сайта 24/7</li>
                  <li>✅ Знает все направления и пакеты</li>
                  <li>✅ Направляет к форме записи</li>
                  <li>🔜 Автоответы в Telegram</li>
                  <li>🔜 Рассылка уведомлений</li>
                  <li>🔜 Аналитика вопросов</li>
                </ul>
              </div>
              <div className="dash-card">
                <h3 className="font-bold text-[var(--ink)] mb-3" style={{ fontFamily: "var(--font-d)" }}>Настройки ИИ</h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">API-ключ OpenAI</label>
                    <input type="password" className="form-input" placeholder="sk-..." />
                  </div>
                  <div>
                    <label className="form-label">Модель</label>
                    <select className="form-select">
                      <option>gpt-4o-mini (экономичная)</option>
                      <option>gpt-4o (мощная)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Системный промпт</label>
                    <textarea className="form-input" rows={4} placeholder="Дополнительные инструкции для ИИ..." />
                  </div>
                  <button className="btn btn-p !text-sm">Сохранить настройки</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
