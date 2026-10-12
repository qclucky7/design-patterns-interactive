import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const outputDir = process.env.PATTERN_ATLAS_SCREENSHOT_DIR ?? path.join(os.tmpdir(), "pattern-atlas-check");
const executablePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.PATTERN_ATLAS_URL ?? "http://localhost:3000";

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
try {
  for (const locale of ["zh", "en"]) {
    const catalog = JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale === "en" ? "en" : "zh-CN"}/catalog.json`, import.meta.url), "utf8"));
    for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      await page.goto(`${baseUrl}${locale === "en" ? "/en" : ""}/patterns/strategy`, { waitUntil: "networkidle" });
      assert.equal(await page.locator("html").getAttribute("lang"), locale === "en" ? "en" : "zh-CN");
      assert.equal(await page.locator("link[rel='alternate'][hreflang='en']").count(), 1);
      await page.getByRole("heading", { level: 1, name: catalog.patterns.strategy.name, exact: true }).waitFor();
      assert.equal(await page.locator(".lesson-intro > .hero-description").count(), 1, "One catalog summary, matching other patterns");
      assert.equal(await page.locator(".lesson-reading h2 br, .lesson-reading h2 em").count(), 0, "No special forced breaks or italic headings");
      assert.equal(await page.locator(".pattern-key-ideas").count(), 1);
      assert.equal(await page.locator(".tradeoff-heading").count(), 1);
      assert.equal(await page.locator(".reason-list h3").count(), 0);
      assert.equal(await page.locator(".related-patterns").first().locator(":scope > p").count(), 1);
      assert.equal(await page.locator(".lesson-reading > .site-footer").count(), 0);
      await page.evaluate(() => document.fonts.ready);
      const session = await page.context().newCDPSession(page);
      await session.send("DOM.enable");
      await session.send("CSS.enable");
      const {root} = await session.send("DOM.getDocument");
      const {nodeId} = await session.send("DOM.querySelector", {nodeId: root.nodeId, selector: ".lesson-intro h1"});
      const {fonts} = await session.send("CSS.getPlatformFontsForNode", {nodeId});
      assert.ok(fonts.some((font) => locale === "en" ? font.familyName === "Georgia" : font.isCustomFont && font.familyName.includes("Noto Serif SC")), `${locale} ${name}: wrong rendered heading fonts ${JSON.stringify(fonts)}`);
      await session.detach();
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(horizontalOverflow <= 1, `${locale} ${name}: horizontal overflow ${horizontalOverflow}px`);
      const shot = path.join(outputDir, `strategy-${locale}-${name}.png`);
      await page.screenshot({ path: shot, fullPage: name === "mobile" });

      assert.equal(await page.locator(".brand").innerText(), locale === "en" ? "Design Patterns" : "设计模式");
      if (name === "mobile") {
        await page.getByRole("button", {name: locale === "en" ? "Open directory" : "打开目录"}).click();
        await page.getByRole("dialog").waitFor();
        await page.getByRole("dialog").locator('.chapter-navigation a[href="#principle-heading"]').click();
        await page.getByRole("dialog").waitFor({state: "hidden"});
      } else {
        const sidebar = page.locator(".site-sidebar");
        await sidebar.getByRole("searchbox").fill("observer");
        assert.equal(await sidebar.locator(".directory-pattern").count(), 1);
        await sidebar.getByRole("searchbox").fill("");
        await sidebar.locator('.chapter-navigation a[href="#principle-heading"]').click();
        await page.waitForFunction(() => document.querySelector('.chapter-navigation a[href="#principle-heading"]')?.getAttribute("aria-current") === "location");
        const box = await sidebar.boundingBox();
        assert.equal(Math.round(box.y), 64);
      }
      await page.evaluate(() => window.scrollTo({top: 0, behavior: "instant"}));

      await page.getByRole("button", { name: locale === "en" ? "Next step" : "下一步" }).click();
      await page.getByRole("heading", { name: locale === "en" ? "Add points as a payment method" : "再加一种积分支付" }).waitFor();
      assert.ok(await page.locator(".change-preview .change-row.added").count() > 0);
      await page.locator(".change-summary").getByText(locale === "en" ? "A new points branch changes the checkout function." : "新增积分分支：改动进入了结算函数。").waitFor();
      assert.equal(await page.locator(".pattern-node.module-container.active").count(), 1);
      const codeDisclosure = page.locator(".code-details").filter({has: page.locator("summary").getByText(locale === "en" ? "View full code" : "展开完整代码", {exact:true})});
      assert.ok(await codeDisclosure.getAttribute("open") !== null);
      await page.locator(".code-window pre").waitFor({state:"visible"});
      await codeDisclosure.locator("summary").click();
      await page.locator(".code-window pre").waitFor({state:"hidden"});
      await codeDisclosure.locator("summary").click();
      await page.locator(".change-preview").evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
      if (name === "desktop") await page.screenshot({path: path.join(outputDir, `strategy-${locale}-change.png`)});
      const codeLanguage = page.locator(".code-language-trigger");
      assert.match(await codeLanguage.innerText(), /TypeScript/);
      await codeLanguage.click();
      await page.getByRole("option", {name: "Python", exact: true}).click();
      assert.equal(await page.locator(".code-file-name").getByText("checkout.py").count(), 1);
      assert.match(await codeLanguage.innerText(), /Python/);
      await codeLanguage.click();
      await page.getByRole("option", {name: "TypeScript", exact: true}).click();
      if (name === "desktop") {
        await page.getByRole("button", { name: locale === "en" ? "Step 3: Extract a strategy" : "第3步：抽出策略" }).click();
        assert.equal(await page.locator(".code-window").getByText("class PointsPayment implements PaymentStrategy {").count(), 0);
        await page.getByRole("button", { name: locale === "en" ? "Step 4: Extend again" : "第4步：再次扩展" }).click();
        assert.equal(await page.locator(".code-window").getByText("class PointsPayment implements PaymentStrategy {").count(), 1);
        await page.locator(".change-summary").getByText(locale === "en" ? "Add PointsPayment. The checkout function is unchanged." : "新增 PointsPayment；checkout 函数未改动。").waitFor();
        assert.equal(await page.locator(".pattern-node.module-container").count(), 0);
        await page.locator(".change-preview").evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
        await page.screenshot({path: path.join(outputDir, `strategy-${locale}-extension.png`)});
      }
      const languageSelect = page.getByRole("combobox", {name: locale === "en" ? "Site language" : "网站语言"});
      await languageSelect.click();
      await page.getByRole("option", {name: "中文", exact: true}).waitFor();
      await page.getByRole("option", {name: "English", exact: true}).waitFor();
      assert.equal(await page.getByRole("option", {name: locale === "en" ? "English" : "中文", exact: true}).getAttribute("aria-selected"), "true");
      await page.locator(".locale-select-content").evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
      if (name === "desktop") await page.screenshot({path: path.join(outputDir, `strategy-${locale}-language-menu.png`)});
      await page.keyboard.press("Escape");
      await languageSelect.focus();
      await page.keyboard.press("ArrowDown");
      await page.getByRole("listbox").waitFor();
      await page.getByRole("option", {name: locale === "en" ? "中文" : "English", exact: true}).click();
      await page.waitForURL(url => url.pathname === (locale === "en" ? "/patterns/strategy" : "/en/patterns/strategy"));
      assert.equal(await page.locator("html").getAttribute("lang"), locale === "en" ? "zh-CN" : "en");
      await page.goto(`${baseUrl}${locale === "en" ? "/en" : ""}/`, {waitUntil: "networkidle"});
      assert.equal(await page.locator(".catalog-entry").count(), 23);
      assert.equal(await page.locator(".catalog-entry.available").count(), 23);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
      await page.screenshot({path: path.join(outputDir, `catalog-${locale}-${name}.png`), fullPage: name === "mobile"});
      await page.close();
      console.log(`${locale} ${name}: layout and interaction passed; screenshot ${shot}`);
    }
  }
} finally {
  await browser.close();
}
