import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {chromium} from "playwright";
import {patterns} from "../src/data/patterns.ts";

const base = process.env.PATTERN_ATLAS_URL ?? "http://localhost:3000";
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
const errors = [];
try {
  const page = await browser.newPage({viewport: {width: 1440, height: 960}, reducedMotion: "reduce"});
  page.on("pageerror", error => errors.push(error.message));
  for (const locale of ["zh-CN", "en"]) {
    const copy = JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/overengineering.json`, import.meta.url), "utf8"));
    for (const {slug} of patterns) {
      const url = `${base}${locale === "en" ? "/en" : ""}/patterns/${slug}`;
      const response = await page.goto(url, {waitUntil: "networkidle"});
      assert.equal(response.status(), 200, url);
      const section = page.locator("#overengineering");
      assert.equal(await section.count(), 1);
      assert.equal(await section.locator("h2").textContent(), copy.labels.heading);
      for (const value of Object.values(copy.patterns[slug])) {
        assert.ok((await section.textContent()).includes(value), `${locale}/${slug}: missing localized content`);
      }
      assert.equal(await page.locator("#when-to-use .decision-card.muted").count(), 0, "Avoidance must not be duplicated");
      const chapter = page.locator('.site-sidebar .toc-link[href="#overengineering-heading"]');
      await chapter.waitFor();
      assert.equal(await chapter.getAttribute("title"), copy.labels.heading);
      const metrics = await page.evaluate(() => ({height: document.scrollingElement.scrollHeight, width: document.scrollingElement.scrollWidth, vh: innerHeight, vw: innerWidth}));
      assert.ok(metrics.height <= metrics.vh + 1, `${locale}/${slug}: outer scrollbar`);
      assert.ok(metrics.width <= metrics.vw + 1, `${locale}/${slug}: horizontal overflow`);
      if (["strategy", "singleton", "observer"].includes(slug)) {
        await chapter.click();
        await page.waitForFunction(() => document.querySelector('.site-sidebar .toc-link[href="#overengineering-heading"]')?.getAttribute("aria-current") === "location");
        const screenshot = join(tmpdir(), `overengineering-${locale}-${slug}.png`);
        await page.screenshot({path: screenshot});
        console.log(`Screenshot: ${screenshot}`);
      }
      console.log(`${locale}/${slug}: content, automatic chapter and split scrolling passed`);
    }
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(`${base}${locale === "en" ? "/en" : ""}/patterns/singleton`, {waitUntil: "networkidle"});
    await page.getByRole("button", {name: locale === "en" ? "Open directory" : "打开目录", exact: true}).click();
    const dialog = page.getByRole("dialog");
    await dialog.locator('.toc-link[href="#overengineering-heading"]').click();
    await dialog.waitFor({state: "hidden"});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({path: join(tmpdir(), `overengineering-${locale}-mobile.png`)});
    await page.setViewportSize({width: 1440, height: 960});
  }
  assert.deepEqual(errors, []);
  console.log("All 46 localized lessons and both mobile directories passed.");
} finally {
  await browser.close();
}
