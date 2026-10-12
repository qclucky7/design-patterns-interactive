import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {chromium} from "playwright";
import sharp from "sharp";
import {patterns} from "../src/data/patterns.ts";

const base = process.env.PATTERN_ATLAS_URL ?? "http://localhost:3000";
const assets = new Set();
for (const pattern of patterns) {
  const svg = await readFile(path.join(process.cwd(), "public", pattern.icon), "utf8");
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert.match(svg, /<desc>.+<\/desc>/);
  assert.doesNotMatch(svg, /<(script|image|foreignObject)|\bon\w+=|\bhref=/i);
  assert.ok(!assets.has(svg), `Duplicate mark: ${pattern.slug}`);
  assets.add(svg);
  await sharp(Buffer.from(svg)).resize(40, 40).png().toBuffer();
  const response = await fetch(`${base}${pattern.icon}`);
  assert.equal(response.status, 200, pattern.icon);
  assert.match(response.headers.get("content-type"), /image\/svg\+xml/);
}
assert.equal(assets.size, 23);
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless:true});
try {
  for (const locale of ["zh-CN", "en"]) {
    for (const width of [1440, 1024, 820, 390]) {
      const page = await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${base}/${locale}`, {waitUntil:"networkidle"});
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator(".catalog-start").getAttribute("href"), await page.locator("a.catalog-entry").first().getAttribute("href"), "Start learning follows the first published directory entry");
      assert.equal(await page.locator(".catalog-pattern-icon").count(), 23);
      for (const icon of await page.locator(".catalog-pattern-icon").all()) {
        await icon.scrollIntoViewIfNeeded();
        await page.waitForFunction(src => {
          const image = [...document.images].find(image => image.getAttribute("src") === src);
          return image?.complete && image.naturalWidth === 64;
        }, await icon.getAttribute("src"));
        assert.equal(await icon.getAttribute("alt"), "");
      }
      const overflow = await page.locator(".catalog-entry").evaluateAll(entries => entries.filter(entry => entry.scrollWidth > entry.clientWidth + 1).map(entry => entry.textContent));
      assert.deepEqual(overflow, [], `${locale} at ${width}px`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, [], "No hydration or runtime errors");
      await page.locator(".catalog-groups").scrollIntoViewIfNeeded();
      if (width === 1440 || width === 390) await page.screenshot({path:path.join(os.tmpdir(),`pattern-icons-${locale}-${width}.png`)});
      await page.close();
    }
  }
  console.log("23 distinct safe SVG assets: render, delivery, bilingual directory and four viewport widths passed.");
} finally {await browser.close();}
