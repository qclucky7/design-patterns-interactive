import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {chromium} from "playwright";
import ts from "typescript";
import os from "node:os";
import path from "node:path";
import {principles} from "../src/data/principles.ts";

const base=process.env.PATTERN_ATLAS_URL??"http://localhost:3000";
assert.equal(principles.length,7);
for(const principle of principles)for(const stage of ["before","after"]){
  const source=ts.createSourceFile(`${principle.slug}-${stage}.ts`,principle[stage],ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  assert.equal(source.parseDiagnostics.length,0,`${principle.slug}/${stage} syntax`);
}
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true});
try{
  for(const locale of ["zh-CN","en"]){
    const prefix=locale==="en"?"/en":"";
    const copy=JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/principles.json`,import.meta.url),"utf8"));
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    await page.goto(`${base}/${locale}/principles`,{waitUntil:"networkidle"});
    assert.equal(await page.locator(".principle-entry").count(),7);
    assert.equal(await page.locator(".section-navigation a[aria-current=page]").getAttribute("href"),`${prefix}/principles`);
    await page.screenshot({path:path.join(os.tmpdir(),`principles-${locale}-index.png`)});
    const search=page.locator(".site-sidebar input[type=search]");
    await search.fill("OCP");
    assert.equal(await page.locator(".site-sidebar .directory-pattern").count(),1);
    await search.fill("unmatched-123");
    assert.equal(await page.locator(".directory-empty").innerText(),copy.empty);
    await search.fill("");
    for(const principle of principles){
      const response=await page.goto(`${base}/${locale}/principles/${principle.slug}`,{waitUntil:"networkidle"});
      assert.equal(response.status(),200);
      assert.equal(await page.locator("main h1").innerText(),copy.entries[principle.slug].name);
      assert.equal(new URL(await page.locator("link[rel=canonical]").getAttribute("href")).pathname,`${prefix}/principles/${principle.slug}`);
      assert.equal(await page.locator("link[rel=alternate][hreflang=en]").count(),1);
      assert.equal(await page.locator(".principle-code-example pre").count(),2);
      for (const stage of ["before", "after"]) assert.equal(await page.locator(`.principle-code-example.${stage} code`).evaluate(element => {const copy = element.cloneNode(true); copy.querySelectorAll('.linenumber').forEach(number => number.remove()); return copy.textContent;}), principle[stage]);
      assert.equal(await page.locator("#related a").count(),principle.patterns.length);
      assert.equal(await page.locator(".site-sidebar .directory-pattern[aria-current=page]").getAttribute("href"),`${prefix}/principles/${principle.slug}`);
      await page.locator(".site-sidebar .chapter-navigation a").first().waitFor();
      const headings=await page.locator(".lesson-reading h1,.lesson-reading h2").allTextContents();
      assert.deepEqual(await page.locator(".site-sidebar .chapter-navigation a").allTextContents(),headings);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      assert.equal(JSON.parse(await page.locator('script[type="application/ld+json"]').innerText()).inLanguage,locale);
      if(principle.slug==="open-closed")await page.screenshot({path:path.join(os.tmpdir(),`principles-${locale}-lesson.png`)});
    }
    assert.deepEqual(errors,[]);
    await page.goto(`${base}/${locale}/patterns/strategy`,{waitUntil:"networkidle"});
    assert.ok(await page.locator('#design-principles a[href$="/open-closed"]').count());
    const invalid=await page.goto(`${base}/${locale}/principles/not-a-principle`);
    assert.equal(invalid.status(),404);
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(`${base}/zh-CN/principles/open-closed`,{waitUntil:"networkidle"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole("button",{name:"打开目录"}).click();
  await page.getByRole("dialog").getByRole("link",{name:"迪米特法则",exact:true}).click();
  await page.waitForURL("**/principles/law-of-demeter");
  assert.equal(await page.getByRole("dialog").count(),0);
  await page.getByRole("combobox",{name:"网站语言"}).click();
  await page.getByRole("option",{name:"English"}).click();
  await page.waitForURL("**/en/principles/law-of-demeter");
  assert.equal(await page.locator("main h1").innerText(),"Law of Demeter");
  await page.screenshot({path:path.join(os.tmpdir(),"principles-mobile.png")});
  const sitemap=await(await fetch(`${base}/sitemap.xml`)).text();
  const {comparisons}=await import("../src/data/comparisons.ts");
  const {patterns}=await import("../src/data/patterns.ts");
  assert.equal((sitemap.match(/<loc>/g)??[]).length,(patterns.length+principles.length+comparisons.length+3)*2);
  for(const locale of ["zh-CN","en"])for(const principle of principles)assert.ok(sitemap.includes(`${locale==="en"?"/en":""}/principles/${principle.slug}`));
  console.log("Seven principles: bilingual lessons, code, SEO, TOC, cross-links, search, mobile navigation and locale switching passed.");
}finally{await browser.close();}
