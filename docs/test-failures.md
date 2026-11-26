# Test failure log

Every test failure that gets fixed is logged here, locally or in CI, by a human or an agent, for
two weeks: **2026-11-22 to 2026-12-06**. On 2026-12-06 the log decides which
test files stay.

For each failure, classify why the test failed:

- **regression**: the test caught a real bug. The code was wrong and was fixed.
- **change-detector**: the code was right and the test failed only because
  it pins an implementation detail. Examples: exact markup or class names,
  call order, a snapshot, copy text. The fix was to update the test.

After the window, delete the test files whose every logged failure was a
change detector, and add their pattern to "Banned test patterns" in
AGENTS.md. Never delete tests for authorization, privacy, migrations or
concurrency, whatever their log says. This repo has none of those today.

A flaky failure, one that passes on rerun without a change, is neither: it's a bug in the
test or the code. Fix it and log it as `flaky` with the cause.

| date       | test file › test                                                                                  | class           | what changed / root cause                                                                                                                                                  | commit                    |
| ---------- | ------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 2026-11-26 | src/routes/_home/-projects.test.tsx › project dialog › opens with the project's details and links | change-detector | The dialog's demo link copy changed from "Demo" to "Live demo" (shared label with the project page; package pages now read "npm package"). Updated the expected link name. | uncommitted (t3/9ae85e0b) |
