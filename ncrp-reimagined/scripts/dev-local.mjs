import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { spawn } from "node:child_process";

// Explicit local-development precedence. Production keeps host-managed secrets.
let local = {};
try {
  local = parseEnv(await readFile(new URL("../.env.local", import.meta.url), "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const child = spawn(process.execPath, [
  "node_modules/next/dist/bin/next", "dev", ...process.argv.slice(2),
], { stdio: "inherit", env: { ...process.env, ...local } });
child.on("error", () => { console.error("Unable to start Next.js development server."); process.exitCode = 1; });
child.on("exit", (code) => { process.exitCode = code ?? 1; });
