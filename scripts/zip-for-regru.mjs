// Build a reg.ru deploy zip from artifacts/neuro32/dist/public, **excluding
// every .map file**. Source-maps are uploaded to Sentry by sentryVitePlugin
// and must never reach the public host.
//
// Usage:
//   node scripts/zip-for-regru.mjs              # → neuro32-<gitsha>.zip
//   node scripts/zip-for-regru.mjs v25          # → neuro32-v25.zip
//
// Output goes next to the existing neuro32-vN.zip files in artifacts/neuro32/.
// Defense-in-depth layers (any one of which catches a leaked .map):
//   1. vite.config.ts → sourcemap: 'hidden'   (no //# sourceMappingURL line)
//   2. sentryVitePlugin filesToDeleteAfterUpload (wipes .map after upload)
//   3. THIS SCRIPT (zips only non-.map files)
//   4. .htaccess <FilesMatch "\.map$"> Require all denied
import AdmZip from "adm-zip";
import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const distDir = path.join(repoRoot, "artifacts", "neuro32", "dist", "public");

if (!existsSync(distDir)) {
  console.error(`✗ dist not found at ${distDir} — run pnpm build first`);
  process.exit(1);
}

let label = process.argv[2];
if (!label) {
  try {
    const sha = execSync("git rev-parse --short HEAD", { cwd: repoRoot }).toString().trim();
    label = sha;
  } catch {
    label = new Date().toISOString().slice(0, 10);
  }
}

const outZip = path.join(repoRoot, "artifacts", "neuro32", `neuro32-${label}.zip`);

const zip = new AdmZip();
let included = 0;
let skipped = 0;

function walk(dir, baseInZip) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const inZipPath = baseInZip ? `${baseInZip}/${entry}` : entry;
    const st = statSync(fullPath);
    if (st.isDirectory()) {
      walk(fullPath, inZipPath);
    } else if (entry.endsWith(".map")) {
      skipped++;
      // Loud log so user can verify the strip-step actually fires.
      console.log(`  skip  ${inZipPath}`);
    } else {
      zip.addLocalFile(fullPath, baseInZip || "");
      included++;
    }
  }
}

walk(distDir, "");
zip.writeZip(outZip);

const sizeKb = (statSync(outZip).size / 1024).toFixed(0);
console.log(`\n✓ ${path.relative(repoRoot, outZip)}`);
console.log(`  files included: ${included}`);
console.log(`  .map files stripped: ${skipped}`);
console.log(`  size: ${sizeKb} KB`);
