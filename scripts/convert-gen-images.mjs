// One-shot image conversion: downscale + WebP + JPEG fallback.
// Run once to shrink public/gen/*.png → public/gen/*.webp + *.jpg.
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve("artifacts/neuro32/public/gen");

// target dimensions per image family
const JOBS = [
  // Decorative backgrounds shown at low opacity — aggressive downscale.
  { pattern: /^(hero-bg|about-bg)\.png$/, width: 1600, webpQ: 72, jpgQ: 78 },
  // 220px-tall header strips — cap at 700px height.
  { pattern: /^(kids-bg|teens-bg|adults-bg|cyber-bg)\.png$/, width: 1600, height: 700, webpQ: 78, jpgQ: 82, fit: "cover" },
  // Avatars shown at ~56×56 in testimonials — cap at 256×256.
  { pattern: /^avatar-\d+\.png$/, width: 256, height: 256, webpQ: 82, jpgQ: 86, fit: "cover" },
];

function jobFor(name) {
  for (const j of JOBS) if (j.pattern.test(name)) return j;
  return null;
}

const files = await readdir(DIR);
let totalOld = 0, totalNew = 0;
for (const name of files) {
  if (!name.endsWith(".png")) continue;
  const job = jobFor(name);
  if (!job) { console.log(`skip (no job): ${name}`); continue; }
  const src = path.join(DIR, name);
  const base = name.replace(/\.png$/, "");
  const webpOut = path.join(DIR, `${base}.webp`);
  const jpgOut = path.join(DIR, `${base}.jpg`);

  const { size: oldSize } = await stat(src);
  totalOld += oldSize;

  const resized = sharp(src).resize({
    width: job.width,
    height: job.height,
    fit: job.fit ?? "inside",
    withoutEnlargement: true,
  });

  await resized.clone().webp({ quality: job.webpQ }).toFile(webpOut);
  await resized.clone().jpeg({ quality: job.jpgQ, mozjpeg: true }).toFile(jpgOut);

  const { size: wSize } = await stat(webpOut);
  const { size: jSize } = await stat(jpgOut);
  totalNew += wSize + jSize;
  console.log(
    `${name}: ${(oldSize/1024).toFixed(0)} KB → ${base}.webp ${(wSize/1024).toFixed(0)} KB + ${base}.jpg ${(jSize/1024).toFixed(0)} KB`,
  );
}
console.log(`\nTotal PNG: ${(totalOld/1024/1024).toFixed(2)} MB → WebP+JPG: ${(totalNew/1024/1024).toFixed(2)} MB`);
