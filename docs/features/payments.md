# Feature · Payments (YooMoney + webhook)

## Цель и ценность
Приём платежей за пробное занятие (500 ₽) и абонементы (5 500–11 000 ₽). Через СБП/карту → автоматический чек через «Мой налог» (самозанятый).

## User stories
1. Как ученик, я выбираю тариф в ЛК → перенаправляюсь в YooMoney → оплачиваю → возвращаюсь в ЛК с success.
2. Как админ, я вижу историю платежей в /admin/payments.
3. Как система, я получаю webhook от YooMoney → меняю status на succeeded/failed.

## Functional requirements
- `POST /api/payments {amount, description}` (auth required) → 201 + `{redirectUrl}`.
- `POST /api/payments/webhook` (public, проверка SHA-1 подписи) → 200.
- `GET /api/payments` (auth) — собственные платежи user'а.
- `GET /api/admin/payments` (admin) — все платежи.
- Label уникален на каждый платёж (UUID + userId).
- Amount > 0 проверка (`z.number().positive()`).

## UX/UI
- LK/payment tab: карточки тарифов + кнопка «Оплатить → СБП» = redirect.
- После success: статус «Оплачено ✓» + ссылка на чек.
- При webhook error: status 'failed', notify admin.

## API контракт
```typescript
CreatePaymentBody      { amount: number.positive(), description: string }
CreatePaymentResponse  { redirectUrl: string, paymentId: number }
WebhookBody            { notification_type, operation_id, amount, label, sha1_hash, ... }
```

## Data модель
`payments`: id, user_id (FK), amount (decimal), status ('pending'|'succeeded'|'failed'), label (UNIQUE!), ymoney_operation_id, description, created_at, paid_at.

## Идемпотентность
**Критично**: YooMoney может отправить webhook дважды. Решение:
1. `label` UNIQUE constraint.
2. При повторном webhook с тем же `operation_id` → log + return 200 without side effects.

## Acceptance criteria
- [x] Создание платежа → redirect на YooMoney
- [x] Webhook с правильной подписью → status='succeeded'
- [ ] Webhook с неправильной подписью → 403
- [ ] Double-webhook → нет дублей в БД
- [ ] Amount <= 0 → 400
- [ ] Rate-limit 5/мин на POST /payments

## Test cases
| TC | Шаги | Ожидание |
|---|---|---|
| TC-PAY-01 | POST с amount=500 | 201 + redirectUrl |
| TC-PAY-02 | POST с amount=0 | 400 |
| TC-PAY-03 | Webhook с валидной подписью | 200 + status updated |
| TC-PAY-04 | Webhook с битой подписью | 403 |
| TC-PAY-05 | Double-webhook | 200 × 2 но status не меняется повторно |

## Риски
- SHA-1 подпись YooMoney устарела — если заменят на HMAC-SHA-256, нужна миграция.
- Нет rate-limit → attacker может создавать кучу pending платежей.
- Нет timeout на pending → висят вечно (cron-job для cleanup > 24ч).
