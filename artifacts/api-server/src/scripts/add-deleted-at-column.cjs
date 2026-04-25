// One-shot migration: add users.deleted_at column.
// Run via: railway run --service <postgres-service-id> -- node <path-to-this>
// Uses Railway's public TCP proxy so it works from any machine that has
// RAILWAY_TCP_PROXY_DOMAIN + POSTGRES_USER/PASSWORD in env.
const { Client } = require("pg");

const host = process.env.RAILWAY_TCP_PROXY_DOMAIN;
const port = process.env.RAILWAY_TCP_PROXY_PORT;
const user = process.env.POSTGRES_USER;
const pw = process.env.POSTGRES_PASSWORD;
const db = process.env.POSTGRES_DB;

if (!host || !port || !user || !pw || !db) {
  console.error("Missing env. Expected RAILWAY_TCP_PROXY_DOMAIN, RAILWAY_TCP_PROXY_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB");
  process.exit(1);
}

const url = `postgres://${user}:${encodeURIComponent(pw)}@${host}:${port}/${db}`;

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();
  const r = await c.query(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at timestamptz",
  );
  console.log("ALTER users.deleted_at:", r.command);
  const v = await c.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'deleted_at'",
  );
  console.log("verify:", JSON.stringify(v.rows));
  // Also ensure payments.idempotency_key + index (from Step 5)
  await c.query(
    "ALTER TABLE payments ADD COLUMN IF NOT EXISTS idempotency_key text",
  );
  await c.query(
    "CREATE INDEX IF NOT EXISTS payments_user_idem_idx ON payments(user_id, idempotency_key)",
  );
  console.log("payments.idempotency_key ensured");
  await c.end();
})().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
