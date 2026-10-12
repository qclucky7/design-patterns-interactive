import assert from "node:assert/strict";
import {chromium} from "playwright";
import {patterns} from "../src/data/patterns.ts";
import {principles} from "../src/data/principles.ts";
import {routing} from "../src/i18n/routing.ts";
import {readFile,mkdir} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
const baseUrl=process.env.PATTERN_ATLAS_URL ?? "http://localhost:3000";
const output=path.join(os.tmpdir(),"design-patterns-complete");
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true});
const exceptions=[];
try {
  for(const locale of ["zh-CN","en"]) {
    const catalog=JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/catalog.json`,import.meta.url),"utf8"));
    const page=await browser.newPage({viewport:{width:1440,height:960}});
    page.on("pageerror",error=>exceptions.push(error.message));
    for(const {slug,category} of patterns.filter(pattern=>pattern.slug!=="strategy")) {
      const url=`${baseUrl}${locale==="en"?"/en":""}/patterns/${slug}`;
      const response=await page.goto(url,{waitUntil:"networkidle"});
      assert.equal(response.status(),200,url);
      assert.equal(await page.locator("h1").innerText(),catalog.patterns[slug].name);
      assert.equal(await page.locator("html").getAttribute("lang"),locale);
      assert.equal(await page.locator("link[rel=canonical]").getAttribute("href"),url);
      assert.equal(await page.locator("link[hreflang=en]").count(),1);
      const ld=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
      assert.equal(ld.about.name,catalog.patterns[slug].englishName);
      assert.equal(await page.locator(".directory-pattern[aria-current=page]").innerText(),catalog.patterns[slug].name);
      assert.equal(await page.locator(".stage-tab").count(),4);
      const languageSelect = page.locator(".code-language-trigger");
      assert.match(await languageSelect.innerText(), /TypeScript/);
      await languageSelect.click();
      assert.equal(await page.locator(".code-language-item").count(), 4);
      await page.keyboard.press("Escape");
      const initial=await page.locator(".change-preview").innerText();
      for(let stage=1;stage<4;stage++) {
        await page.getByRole("button",{name:locale==="en"?"Next step":"下一步",exact:true}).click();
        assert.equal(await page.locator(".diagram-frame").getAttribute("data-stage"),String(stage));
        assert.ok(await page.locator(".pattern-node").count()>0);
        assert.ok(await page.locator(".code-line.focused").count()>0);
      }
      assert.notEqual(await page.locator(".change-preview").innerText(),initial);
      assert.ok(await page.locator(".lesson-walkthrough").getAttribute("open")!==null);
      await languageSelect.click();
      await page.getByRole("option",{name:"Python",exact:true}).click();
      assert.match(await languageSelect.innerText(), /Python/);
      const disclosure=page.locator(".code-details").filter({has:page.locator("summary").getByText(locale==="en"?"Full code":"完整代码",{exact:true})});
      assert.ok(await disclosure.getAttribute("open")!==null);
      await page.locator(".code-window pre").waitFor({state:"visible"});
      assert.equal(await page.locator(".code-file-name").innerText(),`${slug}.py`);
      for (const [language, filename, signature] of [["Java", "Main.java", "public class Main"], ["Go", "main.go", "package main"]]) {
        await languageSelect.click();
        await page.getByRole("option", {name: language, exact: true}).click();
        assert.match(await languageSelect.innerText(), new RegExp(language));
        assert.equal(await page.locator(".code-file-name").innerText(), filename);
        assert.ok((await page.locator(".code-window pre").innerText()).includes(signature));
        assert.equal(await page.locator(".diagram-frame").getAttribute("data-stage"), "3");
        assert.ok(await page.locator(".code-line.focused").count() > 0);
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),`${slug}: desktop overflow`);
      if(["builder","decorator","observer","visitor"].includes(slug)) {
        await page.locator(".stage-tab").first().click();
        await page.locator(".lesson-lab").evaluate(element=>element.scrollTo({top:0,behavior:"instant"}));
        await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
        await page.locator(".change-preview").evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));
        await page.screenshot({path:path.join(output,`${slug}-${locale}-desktop.png`)});
      }
      await page.setViewportSize({width:390,height:844});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),`${slug}: mobile overflow`);
      assert.equal(await page.getByRole("button",{name:locale==="en"?"Open directory":"打开目录"}).isVisible(),true);
      if(["builder","decorator","observer","visitor"].includes(slug)) await page.screenshot({path:path.join(output,`${slug}-${locale}-mobile.png`),fullPage:true});
      await page.setViewportSize({width:1440,height:960});
      console.log(`${locale}/${slug}: page, four stages, four code languages, SEO, ${category} navigation and responsive layout passed`);
    }
    const bad=await page.goto(`${baseUrl}${locale==="en"?"/en":""}/patterns/not-a-pattern`);
    assert.equal(bad.status(),404);
    await page.close();
  }
  assert.deepEqual(exceptions,[]);
  const sitemap=await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  const {comparisons}=await import("../src/data/comparisons.ts");
  const urlCount=(patterns.length+principles.length+comparisons.length+3)*routing.locales.length;
  assert.equal((sitemap.match(/<loc>/g)||[]).length,urlCount);
  console.log(`All 44 new bilingual pattern pages passed. Sitemap contains ${urlCount} URLs.`);
} finally {await browser.close();}
