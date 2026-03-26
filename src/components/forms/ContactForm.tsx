"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus("success");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle className="h-16 w-16 text-[#06B6D4] mx-auto" />
        <h3 className="text-xl font-semibold">Заявка отправлена!</h3>
        <p className="text-[#a1a1aa]">
          Мы свяжемся с вами в ближайшее время для уточнения деталей.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Отправить ещё одну заявку
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Ваше имя
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#06B6D4] transition-colors"
          placeholder="Как вас зовут?"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Телефон
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#06B6D4] transition-colors"
          placeholder="+7 (___) ___-__-__"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#06B6D4] transition-colors"
          placeholder="example@mail.ru"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Сообщение
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#06B6D4] transition-colors resize-none"
          placeholder="Расскажите о себе и ваших интересах..."
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-[#ef4444] text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Что-то пошло не так. Попробуйте ещё раз.</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Отправить заявку
          </>
        )}
      </Button>

      <p className="text-xs text-[#71717a] text-center">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  );
}
