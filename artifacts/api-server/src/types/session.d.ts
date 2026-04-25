import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: "admin" | "user";
    /** Unix timestamp (ms) when this session was created — used for revocation checks. */
    createdAt: number;
  }
}
