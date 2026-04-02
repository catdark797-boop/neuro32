import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Ты — ИИ-ассистент лаборатории «Нейро 32» в Новозыбкове. Помогаешь с вопросами о программах, расписании, ценах. Отвечай дружелюбно и по делу на русском языке.

Основатель — Денис Степан Марьянович (самозанятый, НПД).
Адрес: Новозыбков, ул. Коммунистическая 22А (помещение АНО «Простые вещи»).
Телефон: +7(901)976-98-10, Telegram: @DSM1322, Email: d3stemar@yandex.ru

Направления:
• ИИ для детей 7-12 лет — от 5,000₽/мес
• ИИ для подростков 13-17 лет — от 6,500₽/мес
• ИИ для взрослых 18+ — от 8,000₽/мес
• Кибербезопасность + ИИ — от 10,000₽/мес
• Цифровые решения (B2B/B2C) — от 15,000₽
• Пакеты-траектории — от 9,000₽/мес

Первая встреча — бесплатно. 4 ПК на занятие. Только бесплатные инструменты (GigaChat, YandexGPT, ChatGPT free, Shedevrum, Kandinsky). Оплата: СБП, договор, счёт для организаций.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Некорректный формат сообщений" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Если ключ не настроен — отвечаем моковым ответом
    if (!apiKey || apiKey.includes("placeholder")) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      const mockReply = generateMockReply(lastMsg);
      return NextResponse.json({ reply: mockReply });
    }

    // Реальный вызов OpenAI-совместимого API
    const { streamText } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch {
    return NextResponse.json({ error: "Ошибка ИИ-сервиса" }, { status: 500 });
  }
}

function generateMockReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("цен") || lower.includes("стоим") || lower.includes("сколько")) {
    return "Стоимость занятий:\n• Дети 7-12: от 5,000₽/мес\n• Подростки 13-17: от 6,500₽/мес\n• Взрослые 18+: от 8,000₽/мес\n• Кибербезопасность: от 10,000₽/мес\n\nПервая встреча — бесплатно! Записаться: +7(901)976-98-10 или @DSM1322";
  }

  if (lower.includes("адрес") || lower.includes("где") || lower.includes("карт")) {
    return "Мы находимся по адресу: Новозыбков, ул. Коммунистическая 22А (помещение АНО «Простые вещи»). Приходите на бесплатную первую встречу!";
  }

  if (lower.includes("дет") || lower.includes("ребён") || lower.includes("7")) {
    return "Программа для детей 7-12 лет включает: знакомство с ИИ, нейросети глазами ребёнка, создание цифрового помощника, ИИ-арт и демо-день. Всё на реальном оборудовании, 4 ПК на занятие. От 5,000₽/мес.";
  }

  if (lower.includes("подрост") || lower.includes("13") || lower.includes("тинейдж")) {
    return "Для подростков 13-17: Python для ИИ, внутренности нейросетей, компьютерное зрение, языковые модели, финальный проект. Результат — Junior AI-разработчик. От 6,500₽/мес.";
  }

  if (lower.includes("взросл") || lower.includes("18") || lower.includes("бизнес")) {
    return "Для взрослых 18+: языковые модели без интернета, база знаний на ваших документах, арсенал бесплатных инструментов, тонкая настройка под вашу специфику. От 8,000₽/мес.";
  }

  if (lower.includes("кибер") || lower.includes("безопас") || lower.includes("хакер")) {
    return "Кибербезопасность + ИИ: право и этика, Red Team (атаки на ИИ), Blue Team (защита ИИ), пентестинг, обнаружение аномалий, финальный аудит. От 10,000₽/мес.";
  }

  if (lower.includes("привет") || lower.includes("здравст") || lower.includes("добр")) {
    return "Здравствуйте! 👋 Я ИИ-ассистент лаборатории «Нейро 32». Помогу с информацией о программах, ценах и расписании. Что вас интересует?";
  }

  return "Спасибо за вопрос! В лаборатории «Нейро 32» мы проводим офлайн-практики по ИИ для всех возрастов. Первая встреча бесплатно! Для записи: +7(901)976-98-10 или Telegram @DSM1322. Что именно вас интересует?";
}
