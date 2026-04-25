import { pgTable, varchar, json, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Express-session store table. Owned by `connect-pg-simple`, NOT the app —
 * but we declare it here so `drizzle-kit push --force` doesn't drop it.
 *
 * DDL matches `node_modules/connect-pg-simple/table.sql` verbatim.
 * Do NOT change columns here without also changing the library's expectations.
 */
export const sessionTable = pgTable(
  "session",
  {
    sid: varchar("sid").primaryKey().notNull(),
    // `json` (not jsonb) to match the library's canonical DDL.
    sess: json("sess").notNull(),
    expire: timestamp("expire", { precision: 6, mode: "date" }).notNull(),
  },
  (t) => [index("IDX_session_expire").on(t.expire)],
);
