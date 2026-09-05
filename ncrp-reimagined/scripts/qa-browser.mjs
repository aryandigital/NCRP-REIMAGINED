import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("../../docs/node_modules/puppeteer-core");
const artifacts = await mkdtemp(join(tmpdir(), "opencode", "raksha-browser-"));
const port = 3126;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], {
  env: { ...process.env, OPENAI_API_KEY: "", SARVAM_API_KEY: "", DATABASE_URL: "", DEMO_MODE: "false", VAPI_PRIVATE_KEY: "", RAKSHA_STORE_PATH: join(artifacts, "incidents.json") },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", (data) => { serverLog += data; });
server.stderr.on("data", (data) => { serverLog += data; });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${serverLog}`);
    try { if ((await fetch(`${base}/shield`, { signal: AbortSignal.timeout(3000) })).ok) { ready = true; break; } } catch { /* starting */ }
    await sleep(500);
  }
  assert.ok(ready, "isolated production server starts");
  console.log("Production smoke server ready; providers disabled.");
  browser = await puppeteer.launch({
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless: true, userDataDir: join(artifacts, "profile"),
  });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  async function clickText(text) {
    const elements = await page.$$("button, a");
    for (const element of elements) {
      if ((await element.evaluate((node) => node.textContent.trim())).includes(text)) {
        await element.click();
        return;
      }
    }
    throw new Error(`Control not found: ${text}`);
  }
  async function noOverflow(label) {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${label}: no horizontal overflow`);
  }
  for (const width of [375, 1440]) {
    await page.setViewport({ width, height: width === 375 ? 812 : 1000 });
    for (const route of ["/", "/check", "/atlas", "/track", "/operator", "/shield", "/check/DEMO0001", "/act/DEMO0001", "/report/DEMO0001", "/recover/DEMO0001"]) {
      const response = await page.goto(base + route, { waitUntil: "networkidle0" });
      assert.equal(response.status(), 200, `${route} loads`);
      await noOverflow(`${route} ${width}`);
      assert.ok(await page.$("#main-content"), `${route}: skip link destination`);
      console.log(`Checked ${route} at ${width}px`);
    }
    await page.goto(base + "/shield", { waitUntil: "networkidle0" });
    await page.screenshot({ path: join(artifacts, `shield-idle-${width}.png`), fullPage: true });
  }
  console.log("PASS: 10 routes at desktop and mobile sizes");

  // Deterministic browser mocks exercise capture lifecycle, not recognition accuracy.
  await page.evaluateOnNewDocument(() => {
    window.SpeechRecognition = class {
      constructor() { window.qaRecognition = this; }
      start() {}
      stop() { this.onend?.(); }
    };
    window.Audio = class {
      play() { this.timer = setTimeout(() => this.onended?.(), 20); return Promise.resolve(); }
      pause() { clearTimeout(this.timer); }
    };
  });
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(base + "/shield", { waitUntil: "networkidle0" });
  await clickText("Listen to the call");
  await page.evaluate(() => {
    window.qaRecognition.onresult({ results: [{ isFinal: true, 0: { transcript: "You are under digital arrest." } }] });
  });
  await sleep(100);
  await page.evaluate(() => {
    window.qaRecognition.onend();
    window.qaRecognition.onresult({ results: [{ isFinal: true, 0: { transcript: "Transfer money to a safe account." } }] });
  });
  await page.waitForFunction(() => document.body.innerText.includes("SCAM SCRIPT"));
  await sleep(1600);
  assert.ok(await page.evaluate(() => document.body.innerText.includes("digital arrest") && document.body.innerText.includes("safe account")), "transcript survives recognition restart");
  await noOverflow("listening mobile");
  await page.screenshot({ path: join(artifacts, "shield-listening-mobile.png"), fullPage: true });
  await clickText("Stop screening");
  const stoppedAt = Date.now();
  await page.waitForSelector("#victim-name");
  await page.type("#victim-name", "Fictional Tester");
  await sleep(1200);
  await clickText("Prepare draft brief");
  await page.waitForFunction(() => location.pathname.startsWith("/act/"));
  const id = new URL(page.url()).pathname.split("/").pop();
  const incident = (await (await fetch(`${base}/api/incidents/${id}`)).json()).incident;
  assert.ok(Date.parse(incident.shield.endedAt) <= stoppedAt + 100, "screening end does not include confirmation delay");
  assert.equal(incident.shield.source, "mic");
  assert.equal(incident.shield.answers.moneyMoved, null);
  assert.match(incident.shield.brief.readAloud, /has not been confirmed/);
  assert.equal(incident.syntheticOnly, false);
  assert.ok((await page.content()).includes("Fictional Tester"));
  await noOverflow("action mobile");
  await page.screenshot({ path: join(artifacts, "action-mobile.png"), fullPage: true });
  await page.goto(`${base}/report/${id}`, { waitUntil: "networkidle0" });
  await clickText("Back to action board");
  await page.waitForFunction(() => location.pathname.startsWith("/act/"));
  assert.ok((await page.content()).includes("Your saved brief"), "brief survives return without query hint");
  console.log("PASS: restart-safe mic -> unknown-preserving brief -> report/back continuity");

  await page.goto(base + "/shield", { waitUntil: "networkidle0" });
  await clickText("Simulate a scam call");
  await page.waitForFunction(() => document.body.textContent.includes("Demo complete"));
  assert.equal(await page.$eval(".caller-bubble", (node) => Boolean(node.textContent)), true);
  await clickText("Stop screening");
  await clickText("Yes — I am in danger");
  await noOverflow("confirm mobile");
  await page.screenshot({ path: join(artifacts, "shield-confirm-mobile.png"), fullPage: true });
  await clickText("Prepare draft brief");
  await page.waitForFunction(() => location.pathname.startsWith("/act/"));
  const simId = new URL(page.url()).pathname.split("/").pop();
  const sim = (await (await fetch(`${base}/api/incidents/${simId}`)).json()).incident;
  assert.equal(sim.syntheticOnly, true);
  assert.equal(sim.shield.brief.escalation, "112");
  assert.match(sim.shield.brief.readAloud, /^This is a simulation/);
  assert.match(sim.shield.brief.readAloud, /Immediate danger/);
  for (let i = 1; i <= 6; i++) {
    const audio = await fetch(`${base}/demo/call-${i}.mp3`);
    assert.equal(audio.status, 200);
    assert.ok((await audio.arrayBuffer()).byteLength > 1000);
  }
  console.log("PASS: scripted demo completes, preserves simulation label, routes danger to 112; all six audio assets load");

  await page.goto(base + "/shield", { waitUntil: "networkidle0" });
  await clickText("Listen to the call");
  await page.evaluate(() => window.qaRecognition.onerror());
  await page.waitForSelector("#heard-text");
  await page.type("#heard-text", "Never share your OTP or CVV.");
  await clickText("Add to screening");
  assert.equal(await page.evaluate(() => document.body.innerText.includes("SCAM SCRIPT")), false);
  await clickText("Stop screening");
  await clickText("Prepare draft brief");
  await page.waitForFunction(() => location.pathname.startsWith("/act/"));
  console.log("PASS: microphone failure -> text fallback; benign credential advice is not a scam");

  const demo = await (await fetch(`${base}/api/demo`, { method: "POST" })).json();
  assert.notEqual(demo.id, "DEMO0001");
  assert.equal((await fetch(`${base}/api/incidents/DEMO0001`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submitMock: true }) })).status, 409);
  assert.equal((await fetch(`${base}/api/shield/alert`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })).status, 403);
  assert.deepEqual(errors, [], "no browser runtime errors");
  console.log("PASS: isolated demo copy, immutable fixture, disabled outbound calls, no browser runtime errors");
  console.log(`Screenshots: ${artifacts}`);
} finally {
  await browser?.close();
  server.kill();
}
