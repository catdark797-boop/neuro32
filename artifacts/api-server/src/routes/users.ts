import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  UpdateUserParams,
  UpdateUserBody,
  DeleteUserParams,
  ListUsersResponse,
  UpdateUserResponse,
} from "@workspace/api-zod";
import { requireAdmin, requireAuth } from "../middlewares/auth";
import { logAudit } from "./auditLogs";
import { asyncHandler } from "../lib/asyncHandler";

const ChangePasswordBody = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Новый пароль — минимум 8 символов"),
});

const AvatarBody = z.object({
  avatarUrl: z
    .string()
    .url()
    .max(2048)
    .refine((url) => /^https?:\/\//i.test(url), "URL must start with http:// or https://")
    .nullable(),
});

const router: IRouter = Router();

function rowToUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    telegram: u.telegram,
    role: u.role,
    direction: u.direction,
    goals: u.goals,
    registeredAt: u.createdAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
  };
}

router.get("/users", requireAdmin, asyncHandler(async (_req, res) => {
  const rows = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(ListUsersResponse.parse(rows.map(rowToUser)));
}));

router.patch("/users/:id", requireAuth, asyncHandler(async (req, res) => {
  const params = UpdateUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }

  // Allow users to update only themselves, admins can update anyone
  if (req.session!.role !== "admin" && req.session!.userId !== params.data.id) {
    res.status(403).json({ error: "Доступ запрещён" });
    return;
  }

  const body = UpdateUserBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (body.data.name !== undefined) updateData.name = body.data.name;
  if (body.data.telegram !== undefined) updateData.telegram = body.data.telegram;
  if (body.data.direction !== undefined) updateData.direction = body.data.direction;
  if (body.data.goals !== undefined) updateData.goals = body.data.goals;
  // Only admin can change role
  if (body.data.role !== undefined && req.session!.role === "admin") updateData.role = body.data.role;

  const [row] = await db.update(usersTable).set(updateData).where(eq(usersTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Пользователь не найден" });
    return;
  }

  // Update session role if updating self
  if (req.session!.userId === row.id) {
    req.session!.role = row.role as "admin" | "user";
  }

  res.json(UpdateUserResponse.parse(rowToUser(row)));
}));

// GDPR right-to-be-forgotten. Users can self-delete their account. We
// soft-anonymize: PII is wiped but the user row (and any payment history)
// stays for accounting obligations. Payment-related data is legally required
// to be kept for 4 years in RU, so hard-delete would break compliance.
router.delete("/users/me", requireAuth, asyncHandler(async (req, res) => {
  const userId = req.session!.userId!;
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!existing) {
    res.status(404).json({ error: "Пользователь не найден" });
    return;
  }
  if (existing.role === "admin") {
    res.status(400).json({ error: "Админ не может удалить свой аккаунт через эту ручку" });
    return;
  }
  if (existing.deletedAt) {
    // Already deleted — idempotent.
    await new Promise<void>((r) => req.session.destroy(() => r()));
    res.sendStatus(204);
    return;
  }

  const tombstone = `deleted-${existing.id}-${Date.now()}@anon.local`;
  // Hash password OUTSIDE the transaction — bcrypt is CPU-bound (~200ms at
  // cost 10) and we don't want to hold a DB row lock that long.
  const deadHash = await bcrypt.hash(`deleted-${existing.id}-${Math.random()}`, 10);
  // Wrap the anonymise step in a transaction so a concurrent `PUT
  // /users/me/avatar` (or another profile mutation) can't race in and rewrite
  // avatarUrl / name between our column updates.
  await db.transaction(async (tx) => {
    await tx
      .update(usersTable)
      .set({
        name: "Удалённый пользователь",
        email: tombstone,
        phone: "",
        telegram: "",
        direction: "",
        goals: "",
        avatarUrl: null,
        passwordHash: deadHash,
        // Invalidate all active sessions.
        sessionInvalidatedBefore: new Date(),
        deletedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));
  });

  await logAudit(userId, "DELETE_SELF", {
    targetTable: "users",
    targetId: userId,
    before: { emailWasPresent: true },
  });

  await new Promise<void>((r) => req.session.destroy(() => r()));
  res.sendStatus(204);
}));

router.delete("/users/:id", requireAdmin, asyncHandler(async (req, res) => {
  const params = DeleteUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Пользователь не найден" });
    return;
  }
  if (existing.role === "admin") {
    res.status(400).json({ error: "Нельзя удалить администратора" });
    return;
  }

  await db.delete(usersTable).where(eq(usersTable.id, params.data.id));

  await logAudit(req.session!.userId!, "DELETE_USER", {
    targetTable: "users",
    targetId: params.data.id,
    before: { name: existing.name, email: existing.email, role: existing.role },
  });

  res.sendStatus(204);
}));

// Change password — requires current password verification
router.post("/users/:id/change-password", requireAuth, asyncHandler(async (req, res) => {
  const idParsed = z.object({ id: z.coerce.number().int().positive() }).safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }

  // Users can only change their own password; admins can change anyone's
  if (req.session!.role !== "admin" && req.session!.userId !== idParsed.data.id) {
    res.status(403).json({ error: "Доступ запрещён" });
    return;
  }

  const body = ChangePasswordBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.errors[0]?.message ?? "Неверный формат данных" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, idParsed.data.id));
  if (!user) {
    res.status(404).json({ error: "Пользователь не найден" });
    return;
  }

  const valid = await bcrypt.compare(body.data.currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Текущий пароль неверен" });
    return;
  }

  const newHash = await bcrypt.hash(body.data.newPassword, 12);
  await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, user.id));
  res.json({ ok: true });
}));

// Update avatar URL
router.patch("/users/:id/avatar", requireAuth, asyncHandler(async (req, res) => {
  const idParsed = z.object({ id: z.coerce.number().int().positive() }).safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }

  if (req.session!.role !== "admin" && req.session!.userId !== idParsed.data.id) {
    res.status(403).json({ error: "Доступ запрещён" });
    return;
  }

  const body = AvatarBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Неверный формат данных" });
    return;
  }

  const [row] = await db
    .update(usersTable)
    .set({ avatarUrl: body.data.avatarUrl })
    .where(eq(usersTable.id, idParsed.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Пользователь не найден" });
    return;
  }

  res.json({ avatarUrl: row.avatarUrl });
}));

export default router;
