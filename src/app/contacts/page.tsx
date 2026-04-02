"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const directions = [
  "ИИ для детей 7-12",
  "ИИ для подростков 13-17",
  "ИИ для взрослых 18+",
  "Кибербезопасность + ИИ",
  "Цифровые решения",
  "Пакет-траектория",
  "Другое",
];

export default function ContactsPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      phone: form.get("phone") as string,
      direction: form.get("direction") as string,
      format: form.get("format") as string,
      message: form.get("message") as string,
    };

    try {
      const res = await fetch("/neuro32/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="S" style={{ background: "var(--g-hero)" }}>
        <div className="s-tag r-up">КОНТАКТЫ</div>
        <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
          <span className="ac">Запишитесь</span> на встречу
        </h1>
        <p className="text-lg text-[var(--ink3)] leading-relaxed max-w-2xl r-up d2">
          Первая встреча — бесплатно. Заполните форму или свяжитесь напрямую.
        </p>
      </section>

      <section className="S">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Форма */}
          <div className="card p-8 r-up">
            <div className="card-glow" />
            <h2 className="text-xl font-bold mb-6 text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>Заявка на запись</h2>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-d)" }}>Заявка отправлена!</h3>
                <p className="text-[var(--ink3)]">Мы свяжемся с вами в ближайшее время.</p>
                <button onClick={() => setStatus("idle")} className="btn btn-s mt-4">Отправить ещё</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Имя *</label>
                  <input name="name" required className="form-input" placeholder="Как к вам обращаться" />
                </div>
                <div>
                  <label className="form-label">Телефон / Telegram *</label>
                  <input name="phone" required className="form-input" placeholder="+7... или @username" />
                </div>
                <div>
                  <label className="form-label">Направление</label>
                  <select name="direction" className="form-select">
                    <option value="">Выберите направление</option>
                    {directions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Формат</label>
                  <select name="format" className="form-select">
                    <option value="offline">Офлайн (Новозыбков)</option>
                    <option value="online">Онлайн</option>
                    <option value="consultation">Консультация</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">О себе / задача</label>
                  <textarea name="message" rows={4} className="form-input" placeholder="Расскажите о себе или задаче (необязательно)" />
                </div>
                <button type="submit" className="btn btn-p w-full justify-center" disabled={status === "loading"}>
                  {status === "loading" ? "Отправка..." : "Записаться →"}
                </button>
                {status === "error" && <p className="text-[var(--rose)] text-sm text-center">Ошибка. Попробуйте позже или свяжитесь напрямую.</p>}
                <p className="text-xs text-[var(--ink4)] text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
              </form>
            )}
          </div>

          {/* Контактная информация */}
          <div className="space-y-6">
            <div className="card p-6 r-up d1">
              <div className="card-glow" />
              <h3 className="font-bold text-[var(--ink)] mb-4" style={{ fontFamily: "var(--font-d)" }}>Контактная информация</h3>
              <div className="space-y-3 text-[var(--ink2)]">
                <a href="tel:+79019769810" className="flex items-center gap-3 hover:text-[var(--blue)] transition-colors">
                  📞 <span>+7 (901) 976-98-10</span>
                </a>
                <a href="https://t.me/DSM1322" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--blue)] transition-colors">
                  ✈️ <span>Telegram: @DSM1322</span>
                </a>
                <a href="mailto:d3stemar@yandex.ru" className="flex items-center gap-3 hover:text-[var(--blue)] transition-colors">
                  📧 <span>d3stemar@yandex.ru</span>
                </a>
                <div className="flex items-center gap-3">
                  📍 <span>Новозыбков, ул. Коммунистическая 22А</span>
                </div>
              </div>
            </div>

            <div className="card p-6 r-up d2">
              <div className="card-glow" />
              <h3 className="font-bold text-[var(--ink)] mb-4" style={{ fontFamily: "var(--font-d)" }}>Оплата</h3>
              <div className="space-y-2 text-[var(--ink3)] text-[0.95rem]">
                <p>💳 СБП (Система быстрых платежей)</p>
                <p>📄 Договор с самозанятым</p>
                <p>🧾 Счёт для организаций / ИП</p>
                <p>📱 Чек НПД через «Мой налог»</p>
              </div>
            </div>

            {/* Карта */}
            <div className="card overflow-hidden r-up d3">
              <div className="card-glow" />
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=31.930000%2C52.540000&z=15&pt=31.930000%2C52.540000%2Cpm2blm"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Карта — Нейро 32, Новозыбков"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
