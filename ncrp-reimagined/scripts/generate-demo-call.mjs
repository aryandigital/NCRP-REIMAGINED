/**
 * Generates public/demo/call-1..6.mp3 — the synthetic scam-call voiceover
 * used by the Call Shield simulation. Synthetic voice, fictional script.
 *
 * Usage:  node scripts/generate-demo-call.mjs
 * Reads OPENAI_API_KEY from .env.local (or the environment).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Load key: prefer .env.local (what `next dev` uses); a stale system-level
//    OPENAI_API_KEY on this machine shadows it, so fall back on 401 too. ────
let envFileKey = null;
try {
  const env = readFileSync(join(root, ".env.local"), "utf8");
  const line = env.split(/\r?\n/).find((l) => l.startsWith("OPENAI_API_KEY="));
  envFileKey = line?.slice("OPENAI_API_KEY=".length).trim() || null;
} catch { /* fall through */ }
let apiKey = envFileKey ?? process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY not found in .env.local or environment");
  process.exit(1);
}

// ── Script (keep in sync with src/data/demoCall.ts) ─────────────────────────
const LINES = [
  { id: 1, text: "Hello, main Inspector Rajesh Verma bol raha hoon, Mumbai Crime Branch, Andheri se." },
  { id: 2, text: "Aapke naam pe ek parcel Mumbai customs pe pakda gaya hai, jisme 240 gram MDMA mila hai." },
  { id: 3, text: "Aapka Aadhaar number iss parcel ke saath registered hai. Yeh money laundering ka case hai." },
  { id: 4, text: "Aapko abhi video call pe rehna hoga, yeh digital arrest hai. Kisi ko mat batana, family ko bhi nahi." },
  { id: 5, text: "CBI ke officer aapse baat karenge. Aapko apne saare funds verification ke liye RBI ke government account me transfer karne honge." },
  { id: 6, text: "Agar aap cooperate nahi karenge to aaj hi arrest warrant issue hoga. Camera on rakho aur line pe rahiye." },
];

const INSTRUCTIONS =
  "Speak in a firm, authoritative Indian Hindi accent, like a police inspector on a phone call. " +
  "This is a Hinglish sentence (Hindi written in Roman script). Pronounce the Hindi words naturally. " +
  "Slightly stern, urgent tone. Phone-call pacing.";

const outDir = join(root, "public", "demo");
mkdirSync(outDir, { recursive: true });

async function synthesize(line, model) {
  const body = {
    model,
    voice: "onyx",
    input: line.text,
    response_format: "mp3",
  };
  if (model === "gpt-4o-mini-tts") body.instructions = INSTRUCTIONS;

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${model} failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return Buffer.from(await res.arrayBuffer());
}

for (const line of LINES) {
  const file = join(outDir, `call-${line.id}.mp3`);
  try {
    let buf;
    try {
      buf = await synthesize(line, "gpt-4o-mini-tts");
    } catch (err) {
      console.warn(`call-${line.id}: gpt-4o-mini-tts unavailable (${err.message}); falling back to tts-1`);
      buf = await synthesize(line, "tts-1");
    }
    writeFileSync(file, buf);
    console.log(`call-${line.id}.mp3  ${(buf.length / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error(`call-${line.id}: FAILED — ${err.message}`);
    process.exitCode = 1;
  }
}
console.log("Done. Files in public/demo/");
