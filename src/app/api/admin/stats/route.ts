import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user as Record<string, unknown>).role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const [users, reviews, bookings, payments] = await Promise.all([
      prisma.user.count(),
      prisma.review.count(),
      prisma.booking.count(),
      prisma.payment.count(),
    ]);

    const pendingReviews = await prisma.review.count({ where: { approved: false } });
    const newBookings = await prisma.booking.count({ where: { status: "new" } });

    return NextResponse.json({
      users,
      reviews,
      bookings,
      payments,
      pendingReviews,
      newBookings,
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
