import { describe, it, expect, vi } from "vitest";
import { asyncHandler } from "./asyncHandler";
import type { Request, Response, NextFunction } from "express";

function mkCtx() {
  return {
    req: {} as Request,
    res: {} as Response,
    next: vi.fn() as unknown as NextFunction,
  };
}

describe("asyncHandler()", () => {
  it("forwards resolved handler output (no next called with error)", async () => {
    const handler = vi.fn(async () => {});
    const wrapped = asyncHandler(handler);
    const { req, res, next } = mkCtx();
    await wrapped(req, res, next);
    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards thrown errors to next()", async () => {
    const err = new Error("boom");
    const wrapped = asyncHandler(async () => {
      throw err;
    });
    const { req, res, next } = mkCtx();
    await wrapped(req, res, next);
    // next is called asynchronously — give the Promise.catch a tick.
    await new Promise((r) => setImmediate(r));
    expect(next).toHaveBeenCalledWith(err);
  });
});
