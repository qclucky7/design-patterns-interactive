import assert from "node:assert/strict";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {mkdtemp, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {javaPatternStages} from "../src/code-examples/java.ts";
import {goPatternStages} from "../src/code-examples/go.ts";

const execute = promisify(execFile);
const temporary = await mkdtemp(path.join(os.tmpdir(), "pattern-language-check-"));
const java = process.env.JAVA_BIN ?? (process.platform === "win32" ? "D:/java17/bin/java.exe" : "java");
const go = process.env.GO_BIN ?? (process.platform === "win32" ? "D:/go/bin/go.exe" : "go");
const jobs = [];
const output = {};
for (const [language, examples] of [["java", javaPatternStages], ["go", goPatternStages]]) {
  for (const [slug, stages] of Object.entries(examples)) {
    assert.equal(stages.length, 4);
    assert.equal(new Set(stages).size, 4, `${slug}/${language}: stages must differ`);
    const expected = slug === "strategy" ? ["Card payment ¥100", "Points redeemed ¥100", "Card payment ¥100", "Points redeemed ¥100"] : (await import(`../src/code-examples/patterns/${slug}.ts`)).default.expected;
    output[slug] ??= {};
    output[slug][language] = [];
    for (let stage = 0; stage < 4; stage++) jobs.push(async () => {
      const directory = path.join(temporary, `${slug}-${language}-${stage}`);
      await mkdir(directory);
      const file = path.join(directory, language === "java" ? "Main.java" : "main.go");
      await writeFile(file, stages[stage]);
      const result = await execute(language === "java" ? java : go, language === "java" ? ["-Dfile.encoding=UTF-8", file] : ["run", file], {timeout: 90000, env: {...process.env, GOTOOLCHAIN: "local", GO111MODULE: "off"}, maxBuffer: 1024 * 1024}).catch(error => {throw new Error(`${slug}/${language}/${stage}: ${error.stderr || error.message}`);});
      const actual = result.stdout.replace(/\r/g, "").trim();
      assert.ok(actual.toLowerCase().includes(expected[stage].toLowerCase()), `${slug}/${language}/${stage}: ${actual}`);
      if (slug === "observer" && stage === 3) assert.ok(!actual.includes("display:"));
      if (slug === "prototype" && stage === 3) assert.ok(actual.toLowerCase().startsWith("false\nbase\n"));
      output[slug][language][stage] = actual;
      console.log(`${slug}/${language}/${stage + 1}: passed`);
    });
  }
}
let next = 0;
await Promise.all(Array.from({length: 4}, async () => {while (next < jobs.length) await jobs[next++]();}));
const cachePath = new URL("../src/code-examples/patterns/outputs.json", import.meta.url);
const cached = JSON.parse(await readFile(cachePath, "utf8"));
if (process.argv.includes("--update")) {
  for (const [slug, result] of Object.entries(output)) {
    if (slug !== "strategy") Object.assign(cached[slug], result);
  }
  await writeFile(cachePath, JSON.stringify(cached, null, 2) + "\n");
} else {
  for (const [slug, result] of Object.entries(output)) if (slug !== "strategy") {
    for (const language of ["java", "go"]) assert.deepEqual(cached[slug][language], result[language], `${slug}/${language}: stale display output`);
  }
}
console.log(`All ${jobs.length} Java/Go snapshots compiled and executed.`);
