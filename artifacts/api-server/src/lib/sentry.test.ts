import { describe, it, expect } from "vitest";
import { scrub } from "./sentry";

describe("scrub()", () => {
  it("redacts password field", () => {
    const out = scrub({ email: "a@b.ru", password: "hunter2" });
    expect(out).toEqual({ email: "a@b.ru", password: "[REDACTED]" });
  });

  it("redacts case-insensitively", () => {
    const out = scrub({ Authorization: "Bearer xyz", Token: "abc" });
    expect(out).toEqual({ Authorization: "[REDACTED]", Token: "[REDACTED]" });
  });

  it("redacts nested objects", () => {
    const out = scrub({ user: { name: "x", passwordHash: "$2a$..." } });
    expect(out).toEqual({ user: { name: "x", passwordHash: "[REDACTED]" } });
  });

  it("handles arrays", () => {
    const out = scrub([{ password: "p1" }, { password: "p2" }]);
    expect(out).toEqual([{ password: "[REDACTED]" }, { password: "[REDACTED]" }]);
  });

  it("preserves non-sensitive primitives", () => {
    expect(scrub(42)).toBe(42);
    expect(scrub("safe")).toBe("safe");
    expect(scrub(null)).toBe(null);
  });

  it("caps recursion depth (no stack overflow)", () => {
    const a: Record<string, unknown> = {};
    let cur = a;
    for (let i = 0; i < 50; i++) {
      cur.next = {};
      cur = cur.next as Record<string, unknown>;
    }
    expect(() => scrub(a)).not.toThrow();
  });
});
