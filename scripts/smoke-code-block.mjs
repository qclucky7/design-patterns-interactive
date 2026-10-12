import assert from "node:assert/strict";
import {chromium} from "playwright";
import os from "node:os";
import path from "node:path";
import {readFile} from "node:fs/promises";

const {dependencies} = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
for (const name of ["fumadocs-ui", "fumadocs-core", "@fuma-translate/react"]) assert.equal(dependencies[name], undefined, `Do not install a documentation framework for a code block: ${name}`);
for (const name of ["react-code-block", "use-clipboard-copy", "shiki"]) assert.equal(dependencies[name], undefined);
assert.ok(dependencies["react-syntax-highlighter"]);

const baseUrl = process.env.PATTERN_ATLAS_URL ?? "http://localhost:3000";
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
const errors = [];
try {
  for (const locale of ["zh-CN", "en"]) for (const width of [1440, 390]) {
    const context = await browser.newContext({viewport: {width, height: 900}, permissions: ["clipboard-read", "clipboard-write"]});
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(`${baseUrl}${locale === "en" ? "/en" : ""}/patterns/strategy`, {waitUntil: "networkidle"});
    const initialHTML = await response.text();
    assert.ok(initialHTML.includes("code-highlight"), "Code must also be rendered in initial HTML");
    const selector = page.locator(".code-language-trigger");
    const block = page.locator("figure.code-window");
    const copy = block.locator(".code-window-tools>button:not(.code-language-trigger)");
    assert.ok(await block.locator(".linenumber").count() > 0, "Use SyntaxHighlighter's built-in line numbers");
    assert.equal(await page.locator(".code-head .code-language-trigger").count(), 0);
    for (let stage = 0; stage < 4; stage++) {
      await page.locator(".stage-tab").nth(stage).click();
      for (const [language, file] of [["TypeScript", "checkout.ts"], ["Python", "checkout.py"], ["Java", "Main.java"], ["Go", "main.go"]]) {
        await selector.click();
        assert.equal(await page.locator(".code-language-item").count(), 4);
        assert.equal(await page.locator(".code-language-item img").count(), 4);
        await page.waitForFunction(() => [...document.querySelectorAll('.code-language-item img')].every(image => image.complete && image.naturalWidth > 0));
        await page.getByRole("option", {name: language, exact: true}).click();
        assert.match(await selector.innerText(), new RegExp(language));
        const alignment = await block.locator(".code-window-tools").evaluate(element => {
          const icon = element.querySelector(".code-language-name img").getBoundingClientRect();
          const arrow = element.querySelector(".code-language-chevron").getBoundingClientRect();
          const copy = element.querySelector("button:not(.code-language-trigger)").getBoundingClientRect();
          return {icon: icon.y + icon.height / 2, arrow: arrow.y + arrow.height / 2, copy: copy.y + copy.height / 2};
        });
        assert.ok(Math.abs(alignment.icon - alignment.arrow) <= 0.5 && Math.abs(alignment.copy - alignment.arrow) <= 0.5, `${language}: toolbar misaligned`);
        assert.equal(await block.locator(".code-file-name").innerText(), file);
        assert.equal(await page.locator(".diagram-frame").getAttribute("data-stage"), String(stage));
        assert.ok(await block.locator('pre span[style*="color"]').count() > 10);
        const expected = await block.locator("pre code").evaluate(element => {const copy = element.cloneNode(true); copy.querySelectorAll('.linenumber').forEach(number => number.remove()); return copy.textContent;});
        assert.equal(await copy.innerText(), locale === "en" ? "Copy code" : "复制代码");
        await copy.click();
        await page.waitForFunction(() => document.querySelector('.code-window-tools>button[data-checked]'));
        assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r/g, ""), expected, `${locale}/${width}/${stage}/${language}: copied code mismatch`);
      }
    }
    await page.waitForFunction(() => !document.querySelector('.code-window-tools>button[data-checked]'));
    await selector.focus();
    await page.keyboard.press("ArrowDown");
    await page.getByRole("listbox").waitFor();
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement?.classList.contains("code-language-trigger"));
    assert.equal(await selector.evaluate(element => element === document.activeElement), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
    await selector.click();
    await page.locator(".code-language-content").evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
    await page.screenshot({path: path.join(os.tmpdir(), `code-block-${locale}-${width}.png`), fullPage: width < 600});
    await context.close();
    console.log(`${locale}/${width}: four languages, four stages, custom toolbar copy, highlighting, icons, keyboard and layout passed`);
  }
  const failureContext = await browser.newContext();
  await failureContext.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: () => Promise.reject(new Error('Denied by test')), write: () => Promise.reject(new Error('Denied by test'))}});
    document.execCommand = () => false;
  });
  const failurePage = await failureContext.newPage();
  await failurePage.goto(`${baseUrl}/en/patterns/strategy`, {waitUntil: 'networkidle'});
  await failurePage.locator('.code-window-tools>button:not(.code-language-trigger)').click();
  await failurePage.locator('.code-copy-error').waitFor();
  assert.equal(await failurePage.locator('.code-window-tools>button[data-checked]').count(), 0);
  await failureContext.close();
  console.log('Clipboard rejection: localized error shown without false success');
  if (process.env.PATTERN_LAN_URL) {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${process.env.PATTERN_LAN_URL}/en/patterns/strategy`, {waitUntil: "networkidle"});
    assert.equal(await page.evaluate(() => isSecureContext), false);
    await page.locator(".code-language-trigger").click();
    await page.getByRole("option", {name: "Go", exact: true}).click();
    await page.locator(".code-window-tools>button:not(.code-language-trigger)").click();
    await page.waitForFunction(() => document.querySelector('.code-window-tools>button[data-checked]'));
    await context.close();
    console.log("LAN HTTP: dropdown and custom copy with clipboard polyfill passed");
  }
  assert.deepEqual(errors, []);
} finally {await browser.close();}
