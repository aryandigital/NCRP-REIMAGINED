import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";

let local = {};
try {
  local = parseEnv(await readFile(new URL("../.env.local", import.meta.url), "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const env = { ...process.env, ...local };
const set = (key) => Boolean(env[key]?.trim());
console.log("Local configuration presence only; credentials and provider connectivity are not verified.");
for (const key of ["OPENAI_API_KEY", "SARVAM_API_KEY", "DATABASE_URL", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER", "ALERT_ALLOWLIST"]) {
  console.log(`${key}: ${set(key) ? "configured" : "missing"}`);
}
console.log(`DEMO_MODE: ${env.DEMO_MODE === "true" ? "enabled" : "disabled"}`);
console.log(`OPENAI_MODEL: ${set("OPENAI_MODEL") ? "custom value configured" : "default gpt-4o-mini"}`);
if (local.OPENAI_API_KEY && process.env.OPENAI_API_KEY && local.OPENAI_API_KEY !== process.env.OPENAI_API_KEY) {
  console.log("NOTICE: inherited OpenAI key differs from .env.local. npm run dev prefers .env.local; production uses host settings.");
}
console.log(set("DATABASE_URL") ? "Database connectivity still needs checking." : "Storage: local temporary file; not durable across serverless instances.");
if (!set("TWILIO_ACCOUNT_SID") || !set("TWILIO_AUTH_TOKEN") || !set("TWILIO_PHONE_NUMBER")) {
  console.log("Demo calls: unavailable (Twilio not configured). Use email/WhatsApp sharing as fallback.");
} else {
  console.log("Demo calls: Twilio configured. Verify recipient is allowed in Twilio console for trial accounts.");
}
console.log("PUBLIC-USE BLOCKER: case ownership/authentication is not implemented. Use fictional data only.");
