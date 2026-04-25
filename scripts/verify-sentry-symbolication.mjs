// End-to-end verification that source-map upload actually symbolicates.
// 1. Loads prod site in headless Chromium.
// 2. Throws an unhandled error → Sentry's global handler captures it.
// 3. Polls Sentry API for the event by unique marker message.
// 4. Asserts at least one stack frame has a symbolicated filename
//    (`*.tsx` / `*.ts` / src path) instead of `assets/index-*.js`.
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";

const SENTRY_ENV = path.join(homedir(), ".claude", "secrets", "sentry.env");
const TOKEN = Object.fromEntries(
  readFileSync(SENTRY_ENV, "utf8")
    .split("\n").filter(l => l.includes("="))
    .map(l => l.split("=", 2))
)["SENTRY_AUTH_TOKEN"];

if (!TOKEN) { console.error("no SENTRY_AUTH_TOKEN"); process.exit(1); }

const ORG = "neuro-32";
const PROJECT = "neuro32-frontend";
const PROD_URL = "https://xn--32-mlcqsin.xn--p1ai/";
const MARKER = `sourcemap-verify-${Date.now()}`;

console.log(`-> opening ${PROD_URL}`);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

page.on("console", msg => { if (msg.type() === "error") console.log(`[console.error] ${msg.text()}`); });
page.on("pageerror", err => { console.log(`[pageerror] ${err.message?.slice(0,80)}`); });

// Watch for the Sentry envelope POST so we know the SDK actually fired.
let envelopePosted = false;
page.on("requestfinished", req => {
  const url = req.url();
  if (url.includes("sentry.io") && url.includes("/envelope/")) {
    envelopePosted = true;
    console.log(`-> envelope POST → ${url.split("?")[0]}`);
  }
});

await page.goto(PROD_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
// Give Sentry init time + main bundle eval.
await page.waitForTimeout(4000);

console.log(`-> throwing unhandled error with marker "${MARKER}"`);
await page.evaluate((marker) => {
  // Schedule on next tick so the throw is unhandled (not in promise/page eval).
  setTimeout(() => {
    function alphaFn() { betaFn(); }
    function betaFn() { throw new Error(marker); }
    alphaFn();
  }, 50);
}, MARKER);

// Wait for the envelope to actually leave the browser before closing.
for (let i = 0; i < 20 && !envelopePosted; i++) await page.waitForTimeout(500);
await page.waitForTimeout(2000);
await browser.close();

if (!envelopePosted) {
  console.error("FAIL: Sentry envelope POST never observed — SDK not firing.");
  process.exit(2);
}

console.log(`-> polling Sentry issues API for marker "${MARKER}"`);
// Use issues endpoint with proper Sentry QL: message:"<marker>"
const issuesUrl = `https://sentry.io/api/0/projects/${ORG}/${PROJECT}/issues/?query=${encodeURIComponent(`"${MARKER}"`)}&statsPeriod=1h`;
let event = null;
for (let i = 0; i < 24; i++) {
  await new Promise(r => setTimeout(r, 5000));
  const res = await fetch(issuesUrl, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (res.ok) {
    const list = await res.json();
    if (Array.isArray(list) && list.length > 0) {
      const issue = list[0];
      // Fetch latest event for this issue with full stacktrace.
      const full = await fetch(`https://sentry.io/api/0/issues/${issue.id}/events/latest/`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (full.ok) { event = await full.json(); break; }
    }
  }
  process.stdout.write(".");
}
process.stdout.write("\n");

if (!event) { console.error("FAIL: event not visible in Sentry API after 2 minutes."); process.exit(3); }

const frames = event.entries
  ?.find(e => e.type === "exception")
  ?.data?.values?.[0]?.stacktrace?.frames ?? [];

console.log(`\n-> stack has ${frames.length} frames; top 8 (closest to throw first):`);
const topFrames = frames.slice(-8).reverse();
let symbolicated = 0;
for (const f of topFrames) {
  const fn = f.function || "<anon>";
  const file = f.filename || f.absPath || f.abs_path || "<no filename>";
  const line = f.lineNo ?? f.lineno;
  // Symbolicated frames point to .tsx/.ts/.js source files NOT in /assets/.
  const isSymb = /\.(tsx?|jsx?)$/.test(file) && !file.includes("/assets/");
  if (isSymb) symbolicated++;
  console.log(`   ${isSymb ? "OK " : "   "} ${fn} @ ${file}${line ? ":" + line : ""}`);
}

if (symbolicated > 0) {
  console.log(`\nSUCCESS: ${symbolicated}/${topFrames.length} top frames are symbolicated.`);
  console.log(`Sentry: https://${ORG}.sentry.io/issues/?project=&query=${encodeURIComponent(MARKER)}`);
  process.exit(0);
} else {
  console.error(`\nFAIL: 0 symbolicated frames — source-map upload didn't take.`);
  console.error(`First raw frame for diagnosis: ${JSON.stringify(topFrames[0], null, 2)}`);
  process.exit(4);
}
