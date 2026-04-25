import { type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Необходима авторизация" });
    return;
  }

  // Check session revocation: if the admin called DELETE /auth/sessions,
  // sessionInvalidatedBefore is set to "now" — any session created before it is invalid.
  const sessionCreatedAt = req.session.createdAt ?? 0;
  const [user] = await db
    .select({
      id: usersTable.id,
      role: usersTable.role,
      sessionInvalidatedBefore: usersTable.sessionInvalidatedBefore,
      deletedAt: usersTable.deletedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId));

  if (!user) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Пользователь не найден" });
    return;
  }

  // GDPR soft-delete: user anonymized their account — treat as absent.
  // (sessionInvalidatedBefore is also set on delete, but defense in depth.)
  if (user.deletedAt) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Аккаунт удалён" });
    return;
  }

  if (
    user.sessionInvalidatedBefore &&
    sessionCreatedAt < user.sessionInvalidatedBefore.getTime()
  ) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Сессия завершена. Войдите снова." });
    return;
  }

  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  // requireAuth already handles revocation checks — call it first
  await requireAuth(req, res, async () => {
    if (req.session!.role !== "admin") {
      res.status(403).json({ error: "Доступ запрещён" });
      return;
    }
    next();
  });
}
