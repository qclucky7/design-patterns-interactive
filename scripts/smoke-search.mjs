import assert from "node:assert/strict";
import {chromium} from "playwright";
import os from "node:os";
import path from "node:path";
import {searchRoutes} from "./build-search.mjs";

const base=process.env.PATTERN_ATLAS_URL??"http://localhost:3000";
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true});
try {
  for(const locale of ["zh-CN","en"]) {
    const prefix=locale==="en"?"/en":"";
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    await page.goto(`${base}${prefix}/`,{waitUntil:"networkidle"});
    await page.locator("pagefind-modal-trigger button").waitFor();
    const alignment=await page.evaluate(()=>{
      const search=document.querySelector("pagefind-modal-trigger button").getBoundingClientRect();
      const locale=document.querySelector(".locale-select-trigger").getBoundingClientRect();
      return Math.abs(search.top-locale.top)+Math.abs(search.height-locale.height);
    });
    assert.ok(alignment<=1,"search and locale controls align");
    await page.keyboard.press("Control+k");
    const input=page.locator("pagefind-modal input");
    await input.waitFor({state:"visible"});
    assert.equal(await page.locator("pagefind-modal dialog").count(),1,"single official modal");
    assert.equal(await page.locator("pagefind-modal .pf-modal-close").count(),1,"single close control");
    for(const [query,target] of locale==="en"?[["Singleton","/patterns/singleton"],["open closed","/principles/open-closed"],["Strategy State","/comparisons/strategy-state"],["payment","/patterns/strategy"],["subscription cleanup","/patterns/observer"]]:[["单例","/patterns/singleton"],["开闭","/principles/open-closed"],["策略 状态","/comparisons/strategy-state"],["支付","/patterns/strategy"],["订阅遗留","/patterns/observer"]]) {
      await input.fill(query);
      await page.waitForFunction(query=>document.querySelector("pagefind-summary")?.textContent.includes(query),query);
      const match=page.locator(`pagefind-results a[href="${prefix}${target}"]`).first();
      await match.waitFor({timeout:30000});
      const links=await page.locator("pagefind-results a").evaluateAll(nodes=>nodes.map(node=>node.getAttribute("href")));
      assert.ok(links.every(href=>locale==="en"?href.startsWith("/en/"):!href.startsWith("/en/")),"locale isolation");
      assert.ok(await page.locator("pagefind-results mark").count(),"search highlight");
    }
    await page.screenshot({path:path.join(os.tmpdir(),`site-search-${locale}.png`)});
    await input.fill("zznotfound987654321");
    await page.waitForFunction(()=>document.querySelector("pagefind-summary")?.textContent.includes("zznotfound987654321"));
    assert.equal(await page.locator("pagefind-results a").count(),0);
    await page.keyboard.press("Escape");
    await page.waitForFunction(()=>document.querySelector("pagefind-modal-trigger button")===document.activeElement);
    assert.ok(await page.locator("pagefind-modal-trigger button").evaluate(node=>node===document.activeElement),"restore focus");
    await page.locator("pagefind-modal-trigger button").click();
    await input.fill(locale==="en"?"Singleton":"单例");
    await page.locator(`pagefind-results a[href="${prefix}/patterns/singleton"]`).first().click();
    await page.waitForURL(`**${prefix}/patterns/singleton`);
    await page.locator(".lesson-reading").waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),"reading has no outer scrollbar");
    assert.deepEqual(errors,[]);
    await page.close();
  }
  const mobile=await browser.newPage({viewport:{width:390,height:844}});
  await mobile.goto(`${base}/`,{waitUntil:"networkidle"});
  await mobile.locator("pagefind-modal-trigger button").click();
  await mobile.locator("pagefind-modal input").fill("观察者");
  await mobile.locator('pagefind-results a[href="/patterns/observer"]').first().waitFor();
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"mobile overflow");
  await mobile.screenshot({path:path.join(os.tmpdir(),"site-search-mobile.png")});
  await mobile.close();
  const switching=await browser.newPage({viewport:{width:390,height:844}});
  await switching.goto(`${base}/`,{waitUntil:"networkidle"});
  for(const [language,prefix,query] of [["English","/en","Singleton"],["中文","","单例"],["English","/en","Singleton"]]) {
    await switching.locator(".locale-select-trigger").click();
    await switching.getByRole("option",{name:language,exact:true}).click();
    await switching.waitForURL(`${base}${prefix}/`===`${base}/`?`${base}/`:`${base}${prefix}`);
    await switching.locator("pagefind-modal-trigger button").click();
    assert.equal(await switching.locator("pagefind-modal .pf-modal-close").count(),1,"locale changes retain one close button");
    await switching.locator("pagefind-modal input").fill(query);
    await switching.locator(`pagefind-results a[href="${prefix}/patterns/singleton"]`).first().waitFor();
    await switching.keyboard.press("Escape");
    await switching.locator("dialog[open]").waitFor({state:"hidden"});
  }
  await switching.close();
  console.log(`Search smoke passed: ${searchRoutes().length} indexed routes, both locales, all sections, body queries, highlights, empty results, modal controls and mobile.`);
} finally {await browser.close();}
