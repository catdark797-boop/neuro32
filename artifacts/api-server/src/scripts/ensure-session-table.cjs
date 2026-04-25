// Restore the `session` table that connect-pg-simple needs.
// Not in our Drizzle schema (owned by the library), so `drizzle-kit push --force`
// drops it. We also add it to schema now so this never happens again.
const { Client } = require("pg");

const host = process.env.RAILWAY_TCP_PROXY_DOMAIN;
const port = process.env.RAILWAY_TCP_PROXY_PORT;
const user = process.env.POSTGRES_USER;
const pw = process.env.POSTGRES_PASSWORD;
const db = process.env.POSTGRES_DB;

if (!host || !port || !user || !pw || !db) {
  console.error("Missing env");
  process.exit(1);
}

const url = `postgres://${user}:${encodeURIComponent(pw)}@${host}:${port}/${db}`;

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();
  // Canonical DDL from connect-pg-simple/table.sql
  await c.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    ) WITH (OIDS=FALSE);
  `);
  await c.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
        ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
      END IF;
    END $$;
  `);
  await c.query(`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");`);
  const v = await c.query(
    "SELECT table_name FROM information_schema.tables WHERE table_name = 'session'",
  );
  console.log("session table:", JSON.stringify(v.rows));
  await c.end();
})().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
