import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {chromium} from "playwright";
import {comparisons} from "../src/data/comparisons.ts";
import path from "node:path";
import os from "node:os";

const base=process.env.PATTERN_ATLAS_URL??"http://localhost:3000";
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
const errors=[];
try {
  for(const locale of ["zh-CN","en"]){
    const copy=JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/comparisons.json`,import.meta.url),"utf8"));
    const prefix=locale==="en"?"/en":"";
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    page.on("pageerror",error=>errors.push(error.message));
    const index=await page.goto(`${base}${prefix}/comparisons`,{waitUntil:"networkidle"});
    assert.equal(index.status(),200);
    assert.equal(await page.locator(".comparison-entry").count(),comparisons.length);
    assert.equal(await page.locator(".site-sidebar .section-navigation a[aria-current=page]").innerText(),copy.title);
    await page.screenshot({path:path.join(os.tmpdir(),`comparisons-${locale}-index.png`)});
    for(const pair of comparisons){
      const entry=copy.entries[pair.slug];
      const response=await page.goto(`${base}${prefix}/comparisons/${pair.slug}`,{waitUntil:"networkidle"});
      assert.equal(response.status(),200);
      assert.equal(await page.locator("h1").innerText(),entry.title);
      assert.equal(await page.locator(".site-sidebar .comparison-directory-link[aria-current=page]").innerText(),entry.title);
      assert.ok(await page.locator('link[rel="canonical"]').getAttribute("href"));
      assert.equal(await page.locator('script[type="application/ld+json"]').count(),1);
      const panels=page.locator(".comparison-desktop .comparison-demo");
      for(let side=0;side<2;side++){
        const panel=panels.nth(side),other=await panels.nth(1-side).locator(".comparison-result p").innerText();
        for(let step=0;step<entry.sides[side].states.length;step++){
          assert.equal(await panel.locator(".comparison-result p").innerText(),entry.sides[side].states[step].result);
          const paths=await panel.locator(".react-flow__edge-path").evaluateAll(edges=>edges.map(edge=>edge.getAttribute("d")));
          for(const svgPath of paths){
            const coordinates=svgPath.match(/-?\d+(?:\.\d+)?/g).map(Number);
            const xs=coordinates.filter((_,index)=>index%2===0);
            assert.ok(xs.every((x,index)=>!index||x>=xs[index-1]-.1),`${pair.slug}: backward bend in branch connector: ${svgPath}`);
          }
          await panel.locator(".comparison-actions button").first().click();
          assert.equal(await panels.nth(1-side).locator(".comparison-result p").innerText(),other);
        }
        await panel.locator(".comparison-reset").click();
        assert.equal(await panel.locator(".comparison-result p").innerText(),entry.sides[side].states[0].result);
      }
      for(let i=0;i<2;i++){
        const question=page.locator(".comparison-quiz fieldset").nth(i);
        await question.locator("button").nth(1-entry.quizzes[i].answer).click();
        assert.ok(await question.locator(".quiz-retry").isVisible());
        await question.locator("button").nth(entry.quizzes[i].answer).click();
        assert.ok(await question.locator(".quiz-correct").isVisible());
      }
      for(const language of ["Python","Java","Go","TypeScript"]){
        await page.locator(".comparison-code .code-language-trigger").first().click();
        await page.getByRole("option",{name:language,exact:true}).click();
        for(const trigger of await page.locator(".comparison-code .code-language-trigger").all())assert.match(await trigger.innerText(),new RegExp(language));
        for(const code of await page.locator(".comparison-code pre code").all())assert.ok((await code.innerText()).length>50);
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"desktop overflow");
      if(pair.slug==="strategy-state"){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(os.tmpdir(),`comparison-${locale}-desktop.png`),fullPage:true});}
    }
    await page.goto(`${base}${prefix}/comparisons/strategy-state`,{waitUntil:"networkidle"});
    await page.setViewportSize({width:390,height:844});
    assert.ok(await page.locator(".comparison-mobile").isVisible());
    const tabs=page.locator(".comparison-mobile [role=tab]");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(()=>document.querySelector('.comparison-mobile [role=tab][data-state=active]')?.getAttribute("data-state")==="active"&&document.querySelectorAll('.comparison-mobile [role=tab]')[1]?.getAttribute("aria-selected")==="true");
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"),"true");
    const visible=page.locator(".comparison-mobile [role=tabpanel][data-state=active]");
    await visible.locator(".comparison-actions button").first().click();
    assert.equal(await visible.locator(".comparison-result p").innerText(),copy.entries["strategy-state"].sides[1].states[1].result);
    await tabs.first().click();
    assert.equal(await visible.locator(".comparison-result p").innerText(),copy.entries["strategy-state"].sides[0].states[0].result);
    await tabs.nth(1).click();
    assert.equal(await visible.locator(".comparison-result p").innerText(),copy.entries["strategy-state"].sides[1].states[1].result);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"mobile overflow");
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:path.join(os.tmpdir(),`comparison-${locale}-mobile.png`),fullPage:true});
    await page.locator(".mobile-menu-trigger").click();
    const drawer=page.getByRole("dialog");
    await drawer.getByRole("searchbox",{name:copy.search}).fill("decorator");
    assert.equal(await drawer.locator(".comparison-directory-link").count(),2);
    await drawer.locator(".comparison-directory-link").first().click();
    await page.waitForURL(/decorator-proxy/);
    assert.equal(await page.getByRole("dialog").count(),0);
    await page.setViewportSize({width:768,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"tablet overflow");
    await page.locator(".locale-select-trigger").click();
    await page.getByRole("option",{name:locale==="en"?"中文":"English",exact:true}).click();
    await page.waitForURL(locale==="en"?/\/comparisons\/decorator-proxy$/:/\/en\/comparisons\/decorator-proxy$/);
    const notFound=await page.goto(`${base}${prefix}/comparisons/not-a-pair`);
    assert.equal(notFound.status(),404);
    await page.close();
  }
  const sitemap=await(await fetch(`${base}/sitemap.xml`)).text();
  for(const pair of comparisons)assert.ok(sitemap.includes(`/comparisons/${pair.slug}`));
  assert.deepEqual(errors,[]);
  console.log("20 localized comparisons passed: left navigation, independent demo transitions, resets, quizzes, synchronized four-language code, mobile tabs/drawer/search, locale switching, SEO, sitemap and 404.");
}finally{await browser.close();}
