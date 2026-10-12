import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {comparisons} from "../src/data/comparisons.ts";
import {patterns} from "../src/data/patterns.ts";
import {localeOptions} from "../src/i18n/routing.ts";

assert.ok(comparisons.length >= 10);
assert.equal(new Set(comparisons.map(pair => pair.slug)).size, comparisons.length);
for (const {code:locale} of localeOptions) {
  const copy = JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/comparisons.json`, import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(copy.entries).sort(), comparisons.map(pair => pair.slug).sort());
  for (const pair of comparisons) {
    assert.ok(pair.patterns.every(slug => patterns.some(pattern => pattern.slug === slug)));
    const entry = copy.entries[pair.slug];
    for (const key of ["title", "question", "summary", "scenario", "coexist"]) assert.ok(entry[key].length > 8, `${pair.slug}/${key}`);
    assert.equal(entry.differences.length, 3);
    assert.equal(entry.sides.length, 2);
    assert.deepEqual(entry.quizzes.map(quiz => quiz.answer).sort(), [0, 1]);
    for (const side of entry.sides) {
      const reachable = new Set([0]), queue = [0];
      while (queue.length) for (const action of side.states[queue.shift()].actions) {
        assert.ok(Number.isInteger(action.target) && action.target >= 0 && action.target < side.states.length);
        if (!reachable.has(action.target)) {reachable.add(action.target); queue.push(action.target);}
      }
      assert.equal(reachable.size, side.states.length, `${pair.slug}: unreachable state`);
      assert.ok(new Set(side.states.map(state => state.result)).size > 1);
      for (const state of side.states) assert.ok(state.paths.length > 0 && state.paths.every(path => path.length > 1));
    }
  }
}
console.log(`${comparisons.length} comparisons in ${localeOptions.length} locales: registry, scenarios, independent reachable demonstrations and quiz answers passed.`);
