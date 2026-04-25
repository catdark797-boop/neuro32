"""Deploy artifacts/neuro32/dist/public/* to reg.ru shared hosting via FTPS.

Reads credentials from ~/.claude/secrets/regru.env (NOT stored in repo):
  REGRU_FTP_HOST, REGRU_FTP_USER, REGRU_FTP_PASSWORD, REGRU_SITE_PATH

Usage:  python scripts/deploy-regru.py

Behavior:
  * Walks dist/public/ recursively.
  * Skips ANY *.map file (defense-in-depth — sentryVitePlugin already wipes
    them locally and .htaccess denies them, this is a third belt).
  * Creates remote dirs as needed (assets/, gen/, etc).
  * Overwrites existing files (so new index.html + bundle hashes go live).
  * Does NOT delete obsolete files — old hashed bundles are harmless and
    cleaning them is a separate concern (run a clean-orphans script).
"""
from __future__ import annotations

import os
import ssl
import sys
from ftplib import FTP_TLS
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DIST = REPO_ROOT / "artifacts" / "neuro32" / "dist" / "public"
SECRETS = Path.home() / ".claude" / "secrets" / "regru.env"


def load_env(path: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        out[k.strip()] = v.strip()
    return out


def main() -> int:
    if not DIST.exists():
        print(f"x dist not found: {DIST} — run pnpm build first", file=sys.stderr)
        return 1
    if not SECRETS.exists():
        print(f"x creds not found: {SECRETS}", file=sys.stderr)
        return 1

    cfg = load_env(SECRETS)
    host = cfg["REGRU_FTP_HOST"]
    user = cfg["REGRU_FTP_USER"]
    pwd = cfg["REGRU_FTP_PASSWORD"]
    site_path = cfg["REGRU_SITE_PATH"].rstrip("/")

    print(f"-> connecting FTPS to {host} as {user}")
    ctx = ssl.create_default_context()
    # reg.ru shared hosting uses self-signed inside their network — relax
    # hostname check but keep encryption. Same as previous deploy flow.
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    ftp = FTP_TLS(host, user, pwd, context=ctx, timeout=60)
    ftp.prot_p()
    ftp.cwd(site_path)
    print(f"-> cwd to {site_path}")

    seen_dirs: set[str] = set()

    def ensure_dir(rel: str) -> None:
        if not rel or rel in seen_dirs:
            return
        # Create parent first.
        parent = rel.rsplit("/", 1)[0] if "/" in rel else ""
        if parent:
            ensure_dir(parent)
        try:
            ftp.mkd(rel)
        except Exception:
            pass  # already exists
        seen_dirs.add(rel)

    uploaded = skipped = 0
    for fp in sorted(DIST.rglob("*")):
        if fp.is_dir():
            continue
        if fp.suffix == ".map":
            skipped += 1
            print(f"   skip .map: {fp.relative_to(DIST)}")
            continue
        rel = str(fp.relative_to(DIST)).replace("\\", "/")
        rel_dir = rel.rsplit("/", 1)[0] if "/" in rel else ""
        if rel_dir:
            ensure_dir(rel_dir)
        with fp.open("rb") as fh:
            ftp.storbinary(f"STOR {rel}", fh)
        uploaded += 1
        print(f"   ok {rel}")

    ftp.quit()
    print(f"\n-> uploaded {uploaded} files, skipped {skipped} .map files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
