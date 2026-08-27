import assert from "node:assert/strict";
import test from "node:test";
import { compare } from "bcryptjs";
import { getUserByEmail, getUserById } from "./users";

// Regression: ISSUE-002 — auth crashed when DATABASE_URL was not configured
// Found by /qa on 2026-08-27
// Report: .gstack/qa-reports/qa-report-localhost-2026-08-27.md
test("documented demo users remain available without a database", async () => {
  const user = await getUserByEmail("USER1@EMAIL.COM");

  assert.ok(user);
  assert.equal(user.id, "USRDEMO000001");
  assert.equal(user.name, "User One");
  assert.equal(await compare("Password1@123", user.passwordHash), true);
  assert.deepEqual(await getUserById(user.id), user);
});
