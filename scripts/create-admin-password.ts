import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { hashPassword } from "../src/features/admin/auth-core";
if (!process.stdin.isTTY) throw new Error("Run this interactive setup from a terminal. Never pass a real password as a command argument.");
let muted = false;
const output = new Writable({ write(chunk, _encoding, callback) { if (!muted) process.stdout.write(chunk); callback(); } });
const rl = createInterface({ input: process.stdin, output, terminal: true });
try {
  const username = (await rl.question("Admin username: ")).trim();
  if (!/^[a-zA-Z0-9_-]{3,50}$/.test(username)) throw new Error("Use 3–50 letters, digits, underscores or hyphens.");
  process.stdout.write("Password (12–200 characters; hidden): "); muted = true;
  const password = await rl.question("");
  muted = false; process.stdout.write("\nConfirm password (hidden): "); muted = true;
  const confirm = await rl.question(""); muted = false; process.stdout.write("\n");
  if (password !== confirm) throw new Error("Passwords do not match.");
  const hash = hashPassword(password);
  const filename = ".env.local";
  let env = existsSync(filename) ? readFileSync(filename, "utf8") : "";
  const values: Record<string, string> = { ADMIN_USERNAME: username, ADMIN_PASSWORD_HASH: hash, ADMIN_SESSION_SECRET: randomBytes(32).toString("hex") };
  if (!/^BTS_DATABASE_PATH=.+$/m.test(env)) values.BTS_DATABASE_PATH = "./var/catalogue.sqlite";
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const re = new RegExp(`^${key}=.*$`, "m");
    env = re.test(env) ? env.replace(re, line) : `${env.trimEnd()}\n${line}\n`;
  }
  writeFileSync(filename, env, { mode: 0o600 });
  console.log("Private admin configuration saved; existing contact configuration retained. Run npm run admin:seed, then restart the server. No credentials were printed.");
} finally { muted = false; rl.close(); }
