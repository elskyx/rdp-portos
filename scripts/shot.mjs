#!/usr/bin/env node
/**
 * Headless screenshot helper (dev only). Uses the locally installed Edge or
 * Chrome with SwiftShader so WebGL renders without a GPU.
 *
 *   node scripts/shot.mjs <path-or-url> <out.png> [width=1440] [height=900] [waitMs=7000]
 *
 * Example:
 *   node scripts/shot.mjs /lab/car C:/tmp/car.png 1600 1000 8000
 *
 * The dev server must be running (npm run dev → http://localhost:3000).
 * The route is warmed with a GET first so compile time doesn't eat the budget.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

const [, , target, out, w = "1440", h = "900", wait = "7000"] = process.argv;
if (!target || !out) {
  console.error("usage: node scripts/shot.mjs <path-or-url> <out.png> [width] [height] [waitMs]");
  process.exit(1);
}

const base = process.env.SHOT_BASE ?? "http://localhost:3000";
const url = /^https?:|^file:/.test(target) ? target : base + (target.startsWith("/") ? target : "/" + target);

const browsers = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
];
const browser = browsers.find((b) => existsSync(b));
if (!browser) {
  console.error("No Edge/Chrome found");
  process.exit(1);
}

// Warm the route (dev compile) — up to ~3 minutes.
if (url.startsWith("http")) {
  const deadline = Date.now() + 180_000;
  let ok = false;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.status < 500) {
        ok = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 1500));
  }
  if (!ok) console.warn("warning: route did not respond OK before timeout");
}

const outPath = resolve(out);
mkdirSync(dirname(outPath), { recursive: true });

// Global mutex: only one headless browser at a time (RAM is limited and
// several agents may call this concurrently). Stale locks (>4 min) are broken.
const lockDir = resolve(process.env.TEMP ?? process.env.TMPDIR ?? ".", "rdp-shot.lock");
const lockDeadline = Date.now() + 15 * 60_000;
for (;;) {
  try {
    mkdirSync(lockDir);
    break;
  } catch {
    try {
      if (Date.now() - statSync(lockDir).mtimeMs > 240_000) rmSync(lockDir, { recursive: true, force: true });
    } catch {}
    if (Date.now() > lockDeadline) {
      console.error("timed out waiting for screenshot lock");
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 700));
  }
}
const release = () => {
  try {
    rmSync(lockDir, { recursive: true, force: true });
  } catch {}
};
process.on("exit", release);

try {
execFileSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu-sandbox",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--hide-scrollbars",
    "--mute-audio",
    "--force-device-scale-factor=1",
    `--window-size=${w},${h}`,
    `--virtual-time-budget=${wait}`,
    `--screenshot=${outPath}`,
    url,
  ],
  { stdio: ["ignore", "ignore", "ignore"], timeout: 200_000 },
);
} finally {
  release();
}

console.log(existsSync(outPath) ? `saved ${outPath}` : `FAILED: no screenshot written to ${outPath}`);
