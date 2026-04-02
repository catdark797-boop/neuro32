"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/neuro32/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          phone: form.get("phone"),
          password: form.get("password"),
          direction: form.get("direction"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        setLoading(false);
        return;
      }

      // Автоматический вход
      await signIn("credentials", {
        email: form.get("email") as string,
        password: form.get("password") as string,
        redirect: false,
      });
      router.push("/dashboard");
    } catch {
      setError("Ошибка сервера");
    }
    setLoading(false);
  }

  return (
    <section className="S min-h-[calc(100vh-var(--nav-h))] flex items-center justify-center" style={{ background: "var(--g-hero)" }}>
      <div className="card p-8 w-full max-w-md r-up">
        <div className="card-glow" />
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Logo size={40} /></div>
          <h1 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>
            {tab === "login" ? "Вход в кабинет" : "Регистрация"}
          </h1>
        </div>

        {/* Переключатель */}
        <div className="flex mb-6 bg-[var(--bg2)] rounded-xl p-1">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "login" ? "bg-white text-[var(--blue)] shadow-sm" : "text-[var(--ink3)]"}`}
          >Вход</button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "register" ? "bg-white text-[var(--blue)] shadow-sm" : "text-[var(--ink3)]"}`}
          >Регистрация</button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">{error}</div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" required className="form-input" placeholder="email@example.com" />
            </div>
            <div>
              <label className="form-label">Пароль</label>
              <input name="password" type="password" required className="form-input" placeholder="Минимум 6 символов" />
            </div>
            <button type="submit" className="btn btn-p w-full justify-center" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </button>
            <p className="text-xs text-center text-[var(--ink4)]">
              Демо: demo@neuro32.ru / demo123
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Имя *</label>
                <input name="firstName" required className="form-input" placeholder="Имя" />
              </div>
              <div>
                <label className="form-label">Фамилия</label>
                <input name="lastName" className="form-input" placeholder="Фамилия" />
              </div>
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input name="email" type="email" required className="form-input" placeholder="email@example.com" />
            </div>
            <div>
              <label className="form-label">Телефон</label>
              <input name="phone" type="tel" className="form-input" placeholder="+7..." />
            </div>
            <div>
              <label className="form-label">Пароль *</label>
              <input name="password" type="password" required minLength={6} className="form-input" placeholder="Минимум 6 символов" />
            </div>
            <div>
              <label className="form-label">Направление</label>
              <select name="direction" className="form-select">
                <option value="">Выберите</option>
                <option value="kids">Детям</option>
                <option value="teens">Подросткам</option>
                <option value="adults">Взрослым</option>
                <option value="cyber">Кибербезопасность</option>
              </select>
            </div>
            <button type="submit" className="btn btn-p w-full justify-center" disabled={loading}>
              {loading ? "Регистрация..." : "Создать аккаунт"}
            </button>
            <p className="text-xs text-center text-[var(--ink4)]">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
          </form>
        )}
      </div>
    </section>
  );
}
