import assert from "node:assert/strict";
import test from "node:test";
import { createUser, DatabaseRequiredError } from "./users";

// Regression: ISSUE-010, signup appeared successful without persistent storage
// Found by /qa on 2026-08-27
// Report: .gstack/qa-reports/qa-report-localhost-2026-08-27.md
test("account creation requires a configured database", async () => {
  await assert.rejects(
    createUser({
      id: "USRTEST000001",
      email: "test@example.com",
      passwordHash: "not-used",
      name: "Test User",
    }),
    DatabaseRequiredError,
  );
});
