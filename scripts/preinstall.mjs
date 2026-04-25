import fs from "node:fs";

// Cross-platform replacement for the previous `sh -c ...` preinstall.
// - Removes npm/yarn lockfiles to avoid mixed package managers
// - Enforces pnpm usage

for (const file of ["package-lock.json", "yarn.lock"]) {
  try {
    fs.rmSync(new URL(`../${file}`, import.meta.url), { force: true });
  } catch {
    // ignore
  }
}

const ua = process.env.npm_config_user_agent ?? "";
if (!ua.startsWith("pnpm/")) {
  process.stderr.write("Use pnpm instead\n");
  process.exit(1);
}

