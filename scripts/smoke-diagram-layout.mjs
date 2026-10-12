import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdir} from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const baseUrl = process.env.PATTERN_ATLAS_URL ?? "http://localhost:3000";
const output = path.join(os.tmpdir(), "design-patterns-diagram-layout");
await mkdir(output, {recursive: true});
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe"});
const errors = [];
const failures = [];
try {
  const page = await browser.newPage({viewport: {width: 1440, height: 960}});
  page.on("pageerror", error => errors.push(error.message));
  for (const locale of ["zh-CN", "en"]) {
    const prefix = locale === "en" ? "/en" : "";
    for (const viewport of [{width: 1440, height: 960}, {width: 390, height: 844}]) {
      await page.setViewportSize(viewport);
      let commonHeading;
      for (const slug of ["memento", "factory-method", "strategy", "observer", "abstract-factory"]) {
        await page.goto(`${baseUrl}${prefix}/patterns/${slug}`, {waitUntil: "networkidle"});
        await page.locator(".pattern-node").first().waitFor();
        const heading = await page.locator("h1").evaluate(element => {
          const style = getComputedStyle(element);
          return [style.fontFamily, style.fontSize, style.lineHeight, style.fontWeight];
        });
        if (slug === "memento") commonHeading = heading;
        if (slug === "strategy") {
          if (JSON.stringify(heading) !== JSON.stringify(commonHeading)) failures.push(`${locale}/${viewport.width}: Strategy heading differs from common styling`);
          if (await page.locator("h1 .title-outline").count()) failures.push("Strategy still has outlined title");
        }
        for (const stage of [0, 1, 2, 3, 2, 1, 0]) {
          await page.locator(".stage-tab").nth(stage).click();
          try {
            await page.waitForFunction(() => {
              const flow = document.querySelector(".pattern-flow");
              const frame = flow.getBoundingClientRect();
              const boxes = [...flow.querySelectorAll(".react-flow__node")].map(node => node.getBoundingClientRect());
              if (!boxes.length || boxes.some(box => !box.width)) return false;
              const left = Math.min(...boxes.map(box => box.left));
              const right = Math.max(...boxes.map(box => box.right));
              const top = Math.min(...boxes.map(box => box.top));
              const bottom = Math.max(...boxes.map(box => box.bottom));
              return Math.abs((left + right - frame.left - frame.right) / 2) < 2 && Math.abs((top + bottom - frame.top - frame.bottom) / 2) < 2 && left >= frame.left && right <= frame.right && top >= frame.top && bottom <= frame.bottom;
            }, null, {timeout: 3000});
          } catch {
            failures.push(`${locale}/${slug}/${viewport.width}/step ${stage}: diagram not centered or clipped`);
          }
          if (slug === "factory-method" && stage === 3) {
            const clearGap = await page.locator(".pattern-flow").evaluate(flow => {
              const creator = flow.querySelector('[data-id="creator"]');
              const target = flow.querySelector('[data-id="smsCreator"]');
              const scale = creator.getBoundingClientRect().width / creator.offsetWidth;
              return (target.getBoundingClientRect().left - creator.getBoundingClientRect().right) / scale;
            });
            if (clearGap < 40) failures.push(`${locale}/factory-method: connector offset has insufficient clearance (${clearGap}px)`);
          }
          if (stage === 3 && ["memento", "factory-method"].includes(slug)) {
            await page.locator(".pattern-flow").evaluate(element => Promise.all(element.getAnimations({subtree: true}).map(animation => animation.finished)));
            await page.locator(".pattern-flow").screenshot({path: path.join(output, `${slug}-${locale}-${viewport.width}.png`)});
          }
        }
        if (slug === "strategy") await page.screenshot({path: path.join(output, `${slug}-${locale}-${viewport.width}.png`)});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
      }
    }
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  console.log(`Heading and diagram layout regressions passed. Screenshots: ${output}`);
} finally {
  await browser.close();
}
