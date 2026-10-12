import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {patterns} from "../src/data/patterns.ts";
import {localeOptions} from "../src/i18n/routing.ts";

for (const {code} of localeOptions) {
  const copy = JSON.parse(await readFile(new URL(`../src/i18n/messages/${code}/overengineering.json`, import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(copy.patterns).sort(), patterns.map(p => p.slug).sort(), `${code}: pattern coverage`);
  for (const field of ["title", "scenario", "excess", "cost", "simpler", "reconsider"]) {
    const values = patterns.map(({slug}) => {
      const value = copy.patterns[slug][field];
      assert.ok(typeof value === "string" && value.trim().length > 10, `${code}/${slug}/${field}: missing content`);
      assert.ok(!/TODO|TBD|—/.test(value), `${code}/${slug}/${field}: placeholder or unsupported punctuation`);
      return value;
    });
    assert.equal(new Set(values).size, patterns.length, `${code}/${field}: pattern-specific content required`);
  }
  console.log(`${code}: all ${patterns.length} patterns have distinct overengineering cases`);
}
