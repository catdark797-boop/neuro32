// Russian phone-number mask & validator.
//
// Shape as user types:  +7 (XXX) XXX-XX-XX
// Accepts paste of any format — extracts 10 digits after country code
// (handles 7/8 prefixes and naked 10-digit RU numbers).

const DIGITS_ONLY = /\D+/g;

/**
 * Normalize any input into canonical E.164 (+7XXXXXXXXXX).
 * Returns null if we can't build a valid 11-digit RU number.
 */
export function normalizeRuPhone(raw: string): string | null {
  let digits = raw.replace(DIGITS_ONLY, "");
  // Most common: leading 8 → replace with 7.
  if (digits.length === 11 && digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  }
  // Bare 10 digits → prepend 7.
  if (digits.length === 10) {
    digits = "7" + digits;
  }
  // Must be 11 and start with 7.
  if (digits.length !== 11 || !digits.startsWith("7")) return null;
  return "+" + digits;
}

/**
 * Pretty-format whatever is in the input as the user types.
 * Always shows `+7 (` prefix so the user knows the country.
 */
export function formatRuPhone(raw: string): string {
  let digits = raw.replace(DIGITS_ONLY, "");
  // Strip leading 7/8 so we always render the 10 "subscriber" digits.
  if (digits.startsWith("8") || digits.startsWith("7")) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10); // cap at 10 subscriber digits
  let out = "+7";
  if (digits.length === 0) return out + " (";
  out += " (" + digits.slice(0, 3);
  if (digits.length >= 3) out += ")";
  if (digits.length > 3) out += " " + digits.slice(3, 6);
  if (digits.length > 6) out += "-" + digits.slice(6, 8);
  if (digits.length > 8) out += "-" + digits.slice(8, 10);
  return out;
}

/** True if the value is a complete, well-formed RU phone. */
export function isValidRuPhone(raw: string): boolean {
  return normalizeRuPhone(raw) !== null;
}
