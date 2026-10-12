import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getStageCode } from "../src/code-examples/typescript.ts";
import { pythonExample } from "../src/code-examples/python.ts";

const tempDir = await mkdtemp(path.join(os.tmpdir(), "pattern-atlas-examples-"));
const expected = ["Card payment", "Points redeemed", "Card payment", "Points redeemed"];

for (let stage = 0; stage < 4; stage += 1) {
  const code = getStageCode(stage).map((line) => line.text).join("\n");
  await writeFile(path.join(tempDir, "example.ts"), code, "utf8");
  const run = spawnSync("node", ["example.ts"], { cwd: tempDir, encoding: "utf8", timeout: 60000 });
  assert.equal(run.status, 0, `TypeScript stage ${stage + 1}: ${run.stderr || run.error?.message}`);
  assert.ok(run.stdout.includes(expected[stage]), `TypeScript stage ${stage + 1}: unexpected output ${run.stdout}`);
}
console.log("TypeScript: all four stages executed");

const python = spawnSync("python", ["--version"], {encoding: "utf8"});
if (python.status === 0) {
  for (let stage = 0; stage < 4; stage += 1) {
    const code = pythonExample.getStageCode(stage).map((line) => line.text).join("\n");
    await writeFile(path.join(tempDir, "example.py"), code, "utf8");
    const run = spawnSync("python", ["example.py"], {cwd: tempDir, encoding: "utf8", timeout: 60000, env: {...process.env, PYTHONIOENCODING: "utf-8"}});
    assert.equal(run.status, 0, `Python stage ${stage + 1}: ${run.stderr || run.error?.message}`);
    assert.ok(run.stdout.includes(expected[stage]), `Python stage ${stage + 1}: unexpected output ${run.stdout}`);
  }
  console.log("Python: all four stages executed");
} else {
  console.log("Python interpreter unavailable; Python execution check skipped");
}
