import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import * as Sentry from "@sentry/node";
import { asyncHandler } from "../lib/asyncHandler";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ChatMessage = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});
const ChatBody = z.object({
  messages: z.array(ChatMessage).min(1).max(20),
});

const SYSTEM_PROMPT = `Ты — Нейра, дружелюбный и умный AI-ассистент школы «Нейро 32» в Новозыбкове.

О школе:
— Офлайн-лаборатория ИИ-практик по адресу: г. Новозыбков, ул. Коммунистическая, 22А (АНО «Простые вещи»).
— Преподаватель: Степан Денис (@DSM1322 в Telegram).
— 4 направления: «Дети 7–12», «Подростки 13–17», «Взрослые 18+», «Кибербезопасность».
— Цены: дети 5 500 ₽/мес, подростки 7 000 ₽/мес, взрослые 8 500 ₽/мес, кибер 11 000 ₽/мес. Пробное занятие — 500 ₽.
— 4 ПК на площадке, группы до 4 человек, 2 занятия в неделю по 60–90 минут.
— Ближайший набор: 4 мая 2026, осталось 3 места.
— Инструменты, которым учим: ChatGPT, Claude, Midjourney, DALL-E, Sora, Kling AI, Suno AI, ElevenLabs, ЯндексGPT, ГигаЧат, Make.com, Gamma.app, Notion AI, Python, Scratch, Telegram Bot API, Kali Linux, DVWA.
— Результат с первого занятия: ученики уходят с рабочим проектом (бот, автоматизация, визуал, видео).
— Оплата по СБП на +7 (901) 976-98-10, чек через «Мой налог» автоматически.

Правила ответа:
1. Отвечай по-русски, кратко (до 4 коротких предложений). Без воды.
2. Если вопрос про конкретную программу/цены/запись — отвечай точно по фактам выше.
3. Если спрашивают про ИИ в целом или какой-то инструмент — дай короткое практическое объяснение и свяжи с тем, чему у нас учат.
4. Если вопрос вообще не о школе и не об ИИ — мягко верни в контекст: «Я — помощник школы Нейро 32, могу рассказать про занятия, ИИ-инструменты, записать на пробное».
5. Никогда не придумывай цены, адреса, даты, имена. Если не знаешь — скажи «Степан уточнит, напишите ему @DSM1322».
6. Говори на «ты» с детьми, на «вы» с взрослыми — если не видно возраста, используй «вы».
7. НЕ используй markdown (звёздочки, решётки) — только обычный текст и emoji 🤖✨📚💡.`;

const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов. Подождите минуту." },
});

const YANDEX_ENDPOINT = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

async function callYandexGPT(messages: Array<{ role: string; content: string }>): Promise<string | null> {
  const apiKey = process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;
  if (!apiKey || !folderId) return null;

  // Prepend system prompt as 'system' role (YandexGPT supports role "system")
  const ygptMessages = [
    { role: "system", text: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      text: m.content,
    })),
  ];

  const body = {
    modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
    completionOptions: {
      stream: false,
      temperature: 0.35,
      maxTokens: 400,
    },
    messages: ygptMessages,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(YANDEX_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Api-Key ${apiKey}`,
        "x-folder-id": folderId,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      // Don't echo the raw upstream body to console — it can contain
      // request id / token hints that we never want in logs. Status code
      // is enough for ops; full payload goes to Sentry where PII is
      // scrubbed by `beforeSend`.
      logger.warn({ status: res.status }, "[yandexgpt] non-2xx response");
      Sentry.captureMessage("YandexGPT non-2xx", {
        level: "warning",
        tags: { feature: "ai-chat", upstream: "yandexgpt" },
        extra: { status: res.status },
      });
      return null;
    }
    const json = (await res.json()) as {
      result?: { alternatives?: Array<{ message?: { text?: string } }> };
    };
    const text = json?.result?.alternatives?.[0]?.message?.text?.trim();
    return text && text.length > 0 ? text : null;
  } catch (err) {
    clearTimeout(timeout);
    logger.warn({ err: err instanceof Error ? err.message : String(err) }, "[yandexgpt] call error");
    Sentry.captureException(err, { tags: { feature: "ai-chat", upstream: "yandexgpt" } });
    return null;
  }
}

router.post(
  "/ai-chat",
  chatLimiter,
  asyncHandler(async (req, res) => {
    const parsed = ChatBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Неверный формат сообщений" });
      return;
    }
    // Drop any 'system' messages from client — we use our own
    const msgs = parsed.data.messages.filter((m) => m.role !== "system");
    const reply = await callYandexGPT(msgs);
    if (!reply) {
      // Let the client fall back to its built-in regex
      res.status(503).json({ reply: null });
      return;
    }
    res.json({ reply });
  }),
);

export default router;
