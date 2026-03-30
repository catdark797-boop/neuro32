"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Здравствуйте! 👋 Я ИИ-ассистент «Нейро 32». Помогу с информацией о программах, ценах и расписании. Спрашивайте!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/neuro32/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      const reply = data.reply || "Извините, произошла ошибка. Попробуйте позже.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ошибка соединения. Попробуйте позже." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Плавающая кнопка */}
      <button
        className="ai-chat-fab"
        onClick={() => setOpen(!open)}
        aria-label="ИИ-ассистент"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Панель чата */}
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <span>🤖 ИИ-ассистент Нейро 32</span>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-lg bg-transparent border-none">✕</button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role === "user" ? "ai-msg-user" : "ai-msg-bot"}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai-msg-bot">
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--blue)] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--blue)] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--blue)] animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Задайте вопрос..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
