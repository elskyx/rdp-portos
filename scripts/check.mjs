#!/usr/bin/env node
/**
 * Typecheck + lint only the given files (dev helper).
 *
 *   node scripts/check.mjs components/foo.tsx components/bar/*.tsx
 *
 * Runs `tsc --noEmit` on the whole project (types need the full graph) but
 * prints only diagnostics for the listed files, then ESLint on those files.
 * Serialised through a lock so parallel callers don't exhaust RAM.
 * Exit code 1 if any listed file has a TS or ESLint error.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node scripts/check.mjs <file> [file...]");
  process.exit(2);
}

const lockDir = resolve(process.env.TEMP ?? process.env.TMPDIR ?? ".", "rdp-check.lock");
const deadline = Date.now() + 20 * 60_000;
for (;;) {
  try {
    mkdirSync(lockDir);
    break;
  } catch {
    try {
      if (Date.now() - statSync(lockDir).mtimeMs > 300_000) rmSync(lockDir, { recursive: true, force: true });
    } catch {}
    if (Date.now() > deadline) {
      console.error("timed out waiting for check lock");
      process.exit(2);
    }
    await new Promise((r) => setTimeout(r, 800));
  }
}
const release = () => {
  try {
    rmSync(lockDir, { recursive: true, force: true });
  } catch {}
};
process.on("exit", release);

const norm = (p) => p.replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase();
const wanted = files.map(norm);

let failed = false;

const tsc = spawnSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit", "-p", "."], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
const tsLines = (tsc.stdout + tsc.stderr).split(/\r?\n/);
const mine = [];
let keep = false;
for (const line of tsLines) {
  const m = /^(.+?)\(\d+,\d+\): error/.exec(line);
  if (m) keep = wanted.some((w) => norm(m[1]).endsWith(w) || norm(m[1]) === w);
  if (keep && line.trim()) mine.push(line);
}
if (mine.length) {
  failed = true;
  console.log(`TypeScript: ${mine.filter((l) => / error /.test(l)).length} error(s) in listed files\n` + mine.join("\n"));
} else {
  console.log("TypeScript: OK for listed files");
}

const eslint = spawnSync(process.execPath, ["node_modules/eslint/bin/eslint.js", ...files], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
const out = (eslint.stdout + eslint.stderr).trim();
if (eslint.status !== 0) {
  failed = /\d+ error/.test(out) || eslint.status === 2;
  console.log("ESLint:\n" + out);
} else {
  console.log("ESLint: OK" + (out ? "\n" + out : ""));
}

release();
process.exit(failed ? 1 : 0);
