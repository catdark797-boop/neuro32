"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  name: string;
  role?: string;
  direction?: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/neuro32/api/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/neuro32/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          direction: form.get("direction"),
          role: form.get("role"),
          rating,
          text: form.get("text"),
        }),
      });
      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setRating(5);
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
        <div className="s-tag r-up">ОТЗЫВЫ</div>
        <h1 className="s-h2 r-up d1" style={{ marginBottom: "20px" }}>
          Что <span className="ac">говорят</span> участники
        </h1>
        <p className="text-lg text-[var(--ink3)] r-up d2">
          Реальные отзывы от участников практик «Нейро 32».
        </p>
      </section>

      <section className="S">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Отзывы */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="card-glow" />
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-d)" }}>Пока нет отзывов</h3>
                <p className="text-[var(--ink3)]">Будьте первым! Оставьте отзыв после посещения практики.</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="card p-6">
                  <div className="card-glow" />
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-[var(--ink)]">{r.name}</div>
                      {r.role && <div className="text-sm text-[var(--ink4)]">{r.role}</div>}
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`text-lg ${s <= r.rating ? "text-amber-400" : "text-gray-300"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {r.direction && <span className="chip ch-b mb-3">{r.direction}</span>}
                  <p className="text-[var(--ink2)] leading-relaxed">{r.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Форма отзыва */}
          <div className="card p-6 h-fit sticky top-24 r-up">
            <div className="card-glow" />
            <h2 className="text-lg font-bold mb-4 text-[var(--ink)]" style={{ fontFamily: "var(--font-d)" }}>Оставить отзыв</h2>

            {status === "success" ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">✅</div>
                <p className="font-bold text-[var(--ink)]">Спасибо за отзыв!</p>
                <p className="text-sm text-[var(--ink3)] mt-1">Будет опубликован после проверки.</p>
                <button onClick={() => setStatus("idle")} className="btn btn-s mt-3 text-sm">Ещё один</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Имя *</label>
                  <input name="name" required className="form-input" placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="form-label">Направление</label>
                  <select name="direction" className="form-select">
                    <option value="">Выберите</option>
                    <option value="Детям">Детям</option>
                    <option value="Подросткам">Подросткам</option>
                    <option value="Взрослым">Взрослым</option>
                    <option value="Кибербез">Кибербез</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Кто вы</label>
                  <input name="role" className="form-input" placeholder="Родитель, ученик, специалист..." />
                </div>
                <div>
                  <label className="form-label">Оценка</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s} type="button"
                        onClick={() => setRating(s)}
                        className={`text-2xl transition-transform ${s <= rating ? "text-amber-400 scale-110" : "text-gray-300"}`}
                      >★</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label">Отзыв *</label>
                  <textarea name="text" required rows={4} className="form-input" placeholder="Расскажите о вашем опыте..." />
                </div>
                <button type="submit" className="btn btn-p w-full justify-center" disabled={status === "loading"}>
                  {status === "loading" ? "Отправка..." : "Отправить отзыв"}
                </button>
                {status === "error" && <p className="text-[var(--rose)] text-sm text-center">Ошибка отправки</p>}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
