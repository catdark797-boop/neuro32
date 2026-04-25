/**
 * SVG → PNG post-image generator for VK community posts.
 * Brand: Нейро 32 (amber #f0a500, navy #0a0a12, cobalt #4a7cff).
 * Output: 1080×1080 PNG buffer (VK wall-friendly).
 */
import sharp from "sharp";

const AMBER = "#f0a500";
const AMBER_DIM = "#b87d00";
const NAVY = "#0a0a12";
const COBALT = "#4a7cff";
const WHITE = "#ffffff";

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Wrap a long string to multiple tspan lines by char-width. */
function wrap(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxCharsPerLine) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

interface TipPost {
  kind: "tip";
  emoji: string;       // big top emoji
  title: string;       // 1-2 lines, up to ~30 chars/line
  body: string;        // 2-4 lines, up to ~44 chars/line
  tag?: string;        // small label, e.g. "СОВЕТ ДНЯ"
}

interface ToolPost {
  kind: "tool";
  icon: string;        // emoji or short abbr
  name: string;        // tool name
  tagline: string;     // 1 line about it
  bullets: string[];   // 3 items
}

interface AnnouncePost {
  kind: "announce";
  headline: string;    // big text
  subline: string;     // small subtitle
  cta: string;         // e.g. "4 МАЯ 2026"
}

export type PostTemplate = TipPost | ToolPost | AnnouncePost;

function svgTip(p: TipPost): string {
  const titleLines = wrap(p.title, 26);
  const bodyLines = wrap(p.body, 40);
  const tagText = p.tag ?? "СОВЕТ ДНЯ";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <radialGradient id="bg" cx="30%" cy="20%" r="95%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.22"/>
      <stop offset="50%" stop-color="${COBALT}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${NAVY}" stop-opacity="1"/>
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="1080" height="1080" fill="${NAVY}"/>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <!-- Brand bar -->
  <rect x="64" y="64" width="80" height="4" fill="${AMBER}"/>
  <text x="170" y="76" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="${AMBER}" letter-spacing="4">НЕЙРО 32</text>
  <text x="170" y="104" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#ffffff" opacity="0.5" letter-spacing="2">ОФЛАЙН-ПРАКТИКА ИИ · НОВОЗЫБКОВ</text>

  <!-- Tag -->
  <g transform="translate(64, 200)">
    <rect x="0" y="0" width="${tagText.length * 14 + 36}" height="40" rx="20" fill="${AMBER}" opacity="0.14"/>
    <text x="18" y="27" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="${AMBER}" letter-spacing="3">${escape(tagText)}</text>
  </g>

  <!-- Big emoji -->
  <text x="540" y="370" text-anchor="middle" font-size="160">${p.emoji}</text>

  <!-- Title -->
  <g font-family="Arial, Helvetica, sans-serif" font-weight="800" fill="${WHITE}">
    ${titleLines.map((line, idx) => `<text x="540" y="${470 + idx * 80}" text-anchor="middle" font-size="64">${escape(line)}</text>`).join("\n    ")}
  </g>

  <!-- Body -->
  <g font-family="Arial, Helvetica, sans-serif" font-weight="400" fill="${WHITE}" opacity="0.75">
    ${bodyLines.map((line, idx) => `<text x="540" y="${720 + idx * 48}" text-anchor="middle" font-size="34">${escape(line)}</text>`).join("\n    ")}
  </g>

  <!-- Footer watermark -->
  <line x1="64" y1="980" x2="1016" y2="980" stroke="${AMBER}" stroke-width="1" opacity="0.3"/>
  <text x="64" y="1020" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${AMBER}" font-weight="700" letter-spacing="4">НЕЙРО32.РФ</text>
  <text x="1016" y="1020" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="${WHITE}" opacity="0.5">@DSM1322</text>
</svg>`;
}

function svgTool(p: ToolPost): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="${NAVY}"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="${NAVY}"/>
  <rect width="1080" height="1080" fill="url(#bg)"/>

  <!-- Brand bar -->
  <rect x="64" y="64" width="80" height="4" fill="${AMBER}"/>
  <text x="170" y="76" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="${AMBER}" letter-spacing="4">НЕЙРО 32</text>
  <text x="170" y="104" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#ffffff" opacity="0.5" letter-spacing="2">РАЗБОР ИНСТРУМЕНТА</text>

  <!-- Icon block -->
  <rect x="64" y="180" width="180" height="180" rx="30" fill="${AMBER}" opacity="0.15"/>
  <rect x="64" y="180" width="180" height="180" rx="30" fill="none" stroke="${AMBER}" stroke-width="2" opacity="0.6"/>
  <text x="154" y="306" text-anchor="middle" font-size="110">${escape(p.icon)}</text>

  <!-- Name -->
  <text x="270" y="240" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="${WHITE}">${escape(p.name)}</text>
  ${wrap(p.tagline, 30).map((line, idx) => `<text x="270" y="${296 + idx * 38}" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${WHITE}" opacity="0.7">${escape(line)}</text>`).join("\n  ")}

  <!-- Bullets -->
  <g transform="translate(64, 480)" font-family="Arial, Helvetica, sans-serif">
    ${p.bullets.map((b, i) => `
    <g transform="translate(0, ${i * 130})">
      <circle cx="30" cy="30" r="24" fill="${AMBER}"/>
      <text x="30" y="39" text-anchor="middle" font-size="26" font-weight="800" fill="${NAVY}">${i + 1}</text>
      ${wrap(b, 46).slice(0, 2).map((line, li) => `<text x="85" y="${24 + li * 36}" font-size="30" fill="${WHITE}">${escape(line)}</text>`).join("\n      ")}
    </g>`).join("")}
  </g>

  <line x1="64" y1="980" x2="1016" y2="980" stroke="${AMBER}" stroke-width="1" opacity="0.3"/>
  <text x="64" y="1020" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${AMBER}" font-weight="700" letter-spacing="4">НЕЙРО32.РФ</text>
  <text x="1016" y="1020" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="${WHITE}" opacity="0.5">ПРОБНОЕ 500 ₽</text>
</svg>`;
}

function svgAnnounce(p: AnnouncePost): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${AMBER}"/>
      <stop offset="100%" stop-color="${AMBER_DIM}"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="${NAVY}"/>
  <rect x="64" y="64" width="952" height="952" rx="36" fill="url(#bg)"/>

  <text x="540" y="250" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="${NAVY}" letter-spacing="8">НЕЙРО 32 · НОВЫЙ НАБОР</text>

  <!-- CTA date -->
  <text x="540" y="440" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="900" fill="${NAVY}">${escape(p.cta)}</text>

  <!-- Headline -->
  ${wrap(p.headline, 20).map((line, idx) => `<text x="540" y="${580 + idx * 78}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="800" fill="${NAVY}">${escape(line)}</text>`).join("\n  ")}

  <!-- Sub -->
  ${wrap(p.subline, 38).map((line, idx) => `<text x="540" y="${790 + idx * 44}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${NAVY}" opacity="0.8">${escape(line)}</text>`).join("\n  ")}

  <text x="540" y="960" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="${NAVY}" letter-spacing="4">ПРОБНОЕ ЗА 500 ₽ · НЕЙРО32.РФ</text>
</svg>`;
}

function renderSvg(tpl: PostTemplate): string {
  if (tpl.kind === "tip") return svgTip(tpl);
  if (tpl.kind === "tool") return svgTool(tpl);
  if (tpl.kind === "announce") return svgAnnounce(tpl);
  throw new Error("unknown template kind");
}

/** Render a post template to a PNG Buffer (1080x1080). */
export async function renderPostImage(tpl: PostTemplate): Promise<Buffer> {
  const svg = renderSvg(tpl);
  const png = await sharp(Buffer.from(svg, "utf-8"))
    .png({ compressionLevel: 8 })
    .toBuffer();
  return png;
}

/** Render a VK cover 1590×400. */
export async function renderVKCover(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1590 400" width="1590" height="400">
  <defs>
    <radialGradient id="bg" cx="20%" cy="50%" r="90%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="${COBALT}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </radialGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${AMBER}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1590" height="400" fill="${NAVY}"/>
  <rect width="1590" height="400" fill="url(#bg)"/>
  <!-- Logo triangle -->
  <g transform="translate(120, 130)">
    <line x1="70" y1="0" x2="0" y2="140" stroke="${AMBER}" stroke-width="3" opacity="0.65"/>
    <line x1="70" y1="0" x2="140" y2="140" stroke="${COBALT}" stroke-width="3" opacity="0.55"/>
    <line x1="0" y1="140" x2="140" y2="140" stroke="${WHITE}" stroke-width="3" opacity="0.25"/>
    <circle cx="70" cy="0" r="14" fill="${AMBER}"/>
    <circle cx="0" cy="140" r="10" fill="${COBALT}"/>
    <circle cx="140" cy="140" r="10" fill="${WHITE}"/>
    <circle cx="70" cy="80" r="6" fill="${AMBER}" opacity="0.8"/>
  </g>

  <text x="350" y="160" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="900" fill="${WHITE}">НЕЙРО <tspan fill="${AMBER}">32</tspan></text>
  <text x="350" y="215" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${WHITE}" opacity="0.8">Офлайн-лаборатория ИИ · Новозыбков</text>
  <line x1="350" y1="240" x2="800" y2="240" stroke="url(#line)" stroke-width="2"/>
  <text x="350" y="290" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${AMBER}" letter-spacing="6" font-weight="700">ChatGPT · MIDJOURNEY · CLAUDE · SORA · SUNO · KALI</text>

  <!-- Right: pack -->
  <g transform="translate(1080, 120)">
    <rect x="0" y="0" width="420" height="160" rx="16" fill="${AMBER}" opacity="0.12"/>
    <rect x="0" y="0" width="420" height="160" rx="16" fill="none" stroke="${AMBER}" stroke-width="1.5" opacity="0.6"/>
    <text x="30" y="50" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="${AMBER}" letter-spacing="3">ПРОБНОЕ ЗА 500 ₽</text>
    <text x="30" y="95" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${WHITE}" opacity="0.85">4 мая · 3 места свободно</text>
    <text x="30" y="130" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${WHITE}" opacity="0.7">нейро32.рф · @DSM1322</text>
  </g>
</svg>`;
  return await sharp(Buffer.from(svg, "utf-8")).png().toBuffer();
}

/** Render a VK avatar 400×400 in brand style. */
export async function renderVKAvatar(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bg" cx="35%" cy="30%" r="85%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" rx="40" fill="${NAVY}"/>
  <rect width="400" height="400" rx="40" fill="url(#bg)"/>
  <!-- triangle glyph -->
  <g transform="translate(200, 120)">
    <line x1="0" y1="0" x2="-90" y2="180" stroke="${AMBER}" stroke-width="6"/>
    <line x1="0" y1="0" x2="90" y2="180" stroke="${COBALT}" stroke-width="6"/>
    <line x1="-90" y1="180" x2="90" y2="180" stroke="${WHITE}" stroke-width="6" opacity="0.3"/>
    <circle cx="0" cy="0" r="18" fill="${AMBER}"/>
    <circle cx="-90" cy="180" r="14" fill="${COBALT}"/>
    <circle cx="90" cy="180" r="14" fill="${WHITE}"/>
    <circle cx="0" cy="100" r="8" fill="${AMBER}" opacity="0.75"/>
  </g>
  <text x="200" y="370" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="900" fill="${AMBER}" letter-spacing="10">НЕЙРО 32</text>
</svg>`;
  return await sharp(Buffer.from(svg, "utf-8")).png().toBuffer();
}
