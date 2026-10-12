import assert from "node:assert/strict";
import {chromium} from "playwright";
import os from "node:os";
import path from "node:path";

const browser = await chromium.launch({executablePath: process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true});
const base = process.env.PATTERN_ATLAS_URL ?? "http://localhost:3000";
try {
  for (const section of ["patterns","principles"]) for (const locale of ["zh-CN", "en"]) {
    const page = await browser.newPage({viewport: {width:1440,height:900}});
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${base}/${locale}${section==="principles"?"/principles":""}`, {waitUntil:"networkidle"});
    await page.evaluate(() => document.fonts.ready);
    const figure = page.locator(".pattern-composition");
    assert.equal(await figure.locator("[data-module]").count(),4);
    await page.locator(".composition-toggle").click();
    const first = Number(await figure.getAttribute("data-scene"));
    for (let step=1; step<=4; step++) {
      await page.locator(".composition-next").click();
      await page.waitForTimeout(900);
      assert.equal(Number(await figure.getAttribute("data-scene")),(first+step)%4);
      const expectedLinks = (section==="principles"?[0,3,3,4]:[0,3,4,3])[(first+step)%4];
      assert.equal(await figure.locator("line").count(), expectedLinks);
    }
    await page.waitForTimeout(4700);
    assert.equal(Number(await figure.getAttribute("data-scene")), first);
    await page.screenshot({path:path.join(os.tmpdir(),`composition-${section}-${locale}.png`)});
    await page.locator(".composition-toggle").click();
    await page.waitForTimeout(2700);
    assert.notEqual(Number(await figure.getAttribute("data-scene")),first);
    assert.deepEqual(errors,[]);
    await page.close();
  }
  for(const section of ["patterns","principles"]){
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  await page.goto(`${base}/zh-CN${section==="principles"?"/principles":""}`,{waitUntil:"networkidle"});
  const figure = page.locator(".pattern-composition");
  await page.waitForTimeout(4800);
  assert.equal(await figure.getAttribute("data-scene"),"0");
  assert.equal(await page.locator(".composition-toggle").isVisible(),false);
  await page.locator(".composition-next").click();
  assert.equal(await figure.getAttribute("data-scene"),"1");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({path:path.join(os.tmpdir(),`composition-${section}-mobile.png`)});
  await page.close();
  }
  console.log("Pattern and principle SVG compositions: bilingual scenes, connections, pause/play, reduced motion and mobile layout passed.");
} finally {await browser.close();}
