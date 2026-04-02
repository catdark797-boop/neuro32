import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, phone, direction, format, message } = await req.json();

    if (!name || !phone || !direction) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: { name, phone, direction, format: format || null, message: message || null },
    });

    return NextResponse.json({ booking, message: "Заявка отправлена! Мы свяжемся с вами." });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
