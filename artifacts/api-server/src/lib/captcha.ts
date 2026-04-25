// hCaptcha token verification. Free, GDPR-friendly alternative to reCAPTCHA.
// Uses a test secret by default so local dev / preview builds pass without
// real keys; prod must set HCAPTCHA_SECRET to its real value.
//
// https://docs.hcaptcha.com/#verify-the-user-response-server-side
import { logger } from "./logger";

const VERIFY_URL = "https://api.hcaptcha.com/siteverify";
// hCaptcha publishes a test secret that always passes. Good for dev + CI.
const TEST_SECRET = "0x0000000000000000000000000000000000000000";

export async function verifyHcaptcha(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET ?? TEST_SECRET;
  if (!token) return false;
  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.set("remoteip", remoteIp);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "hCaptcha verify HTTP error");
      return false;
    }
    const json = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!json.success) {
      logger.info({ errors: json["error-codes"] }, "hCaptcha verify rejected");
    }
    return json.success === true;
  } catch (err) {
    logger.warn({ err }, "hCaptcha verify failed");
    return false;
  }
}

export const hcaptchaEnabled = () => Boolean(process.env.HCAPTCHA_SECRET);
