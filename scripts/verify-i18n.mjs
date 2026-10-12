import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {localeOptions} from "../src/i18n/routing.ts";

async function load(locale, name) {
  return JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/${name}.json`, import.meta.url), "utf8"));
}

function compareShape(reference, translation, label) {
  assert.equal(Array.isArray(translation), Array.isArray(reference), `${label}: array mismatch`);
  assert.equal(typeof translation, typeof reference, `${label}: type mismatch`);
  if (Array.isArray(reference)) {
    assert.equal(translation.length, reference.length, `${label}: item count mismatch`);
    reference.forEach((item, index) => compareShape(item, translation[index], `${label}[${index}]`));
  } else if (reference && typeof reference === "object") {
    assert.deepEqual(Object.keys(translation).sort(), Object.keys(reference).sort(), `${label}: keys mismatch`);
    for (const key of Object.keys(reference)) compareShape(reference[key], translation[key], `${label}.${key}`);
  } else if (typeof reference === "string") {
    assert.ok(translation.length > 0, `${label}: empty translation`);
  }
}

for (const name of ["common", "strategy", "catalog", "tutorial", "creational", "structural", "behavioral", "playgrounds", "playground-guidance", "principles", "comparisons", "overengineering"]) {
  const reference = await load(localeOptions[0].code, name);
  for (const locale of localeOptions) compareShape(reference, await load(locale.code, name), `${locale.code}/${name}`);
}
console.log(`${localeOptions.length} locale catalogs have matching keys and content shapes`);

for (const {code} of localeOptions) {
  const catalog = await load(code, "catalog");
  const principles = await load(code, "principles");
  for (const control of ["next", "pause", "play"]) {
    assert.equal(principles.animation[control], catalog.animation[control], `${code}: shared animation control ${control} must use the same wording`);
  }
}
console.log("Pattern and principle animation controls use consistent translations");
