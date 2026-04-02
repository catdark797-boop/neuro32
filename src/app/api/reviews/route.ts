import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, direction, role, rating, text } = await req.json();

    if (!name || !text) {
      return NextResponse.json({ error: "Заполните имя и текст отзыва" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        name,
        direction: direction || null,
        role: role || null,
        rating: Math.min(5, Math.max(1, rating || 5)),
        text,
        approved: false,
      },
    });

    return NextResponse.json({ review, message: "Отзыв отправлен на модерацию" });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
