import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so that any thrown error is forwarded
 * to Express's next(err) — picked up by the global error handler in app.ts.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
