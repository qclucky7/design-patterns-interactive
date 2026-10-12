import assert from "node:assert/strict";
import {chromium} from "playwright";
import {patterns} from "../src/data/patterns.ts";

const browser=await chromium.launch({executablePath:process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true});
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:"reduce"});
 page.on("pageerror",error=>errors.push(error.message));
 for(const locale of ["zh-CN","en"]) {
  for(const {slug} of patterns) {
   await page.goto(`http://localhost:3000${locale==="en"?"/en":""}/patterns/${slug}`,{waitUntil:"networkidle"});
   await page.locator(".site-sidebar .toc-link").first().waitFor();
   const headings=await page.locator("main.lesson-grid h1, main.lesson-grid h2").evaluateAll(nodes=>nodes.filter(node=>!node.closest(".lesson-lab")).map(node=>({label:node.innerText.replace(/\s+/g," ").trim(),href:`#${node.id}`})));
   const links=await page.locator(".site-sidebar .toc-link").evaluateAll(nodes=>nodes.map(node=>({label:node.textContent,href:node.getAttribute("href")})));
   assert.deepEqual(links,headings,`${locale}/${slug}: menu differs from article`);
   assert.ok(await page.locator(".site-sidebar .chapter-label").evaluateAll(nodes=>nodes.every(node=>node.clientHeight<=parseFloat(getComputedStyle(node).lineHeight)*2+1)),`${locale}/${slug}: label exceeds two lines`);
   assert.equal(await page.locator(".site-sidebar .toc-link").first().getAttribute("title"),headings[0].label);
   const principle=page.locator('.site-sidebar .toc-link[href="#principle-heading"]');
   await principle.click();
   await page.waitForFunction(()=>document.querySelector('.site-sidebar .toc-link[href="#principle-heading"]')?.getAttribute("aria-current")==="location");
   console.log(`${locale}/${slug}: titles, order, anchor and active section passed`);
  }
 }
 // Changes are discovered from the article, not a second chapter configuration.
 await page.context().clearCookies();
 await page.goto("http://localhost:3000/patterns/builder",{waitUntil:"networkidle"});
 await page.locator(".site-sidebar .toc-link").first().waitFor();
 await page.locator("#principle h2").evaluate(heading=>{heading.textContent="Updated lesson title";});
 await page.locator('.site-sidebar .toc-link[title="Updated lesson title"]').waitFor();
 await page.locator(".lesson-content").evaluate(article=>{
  const section=document.createElement("section");section.id="new-section";
  const heading=document.createElement("h2");heading.textContent="New chapter";section.append(heading);article.prepend(section);
 });
 await page.locator('.site-sidebar .toc-link[href="#new-section-heading"]').waitFor();
 await page.locator("#new-section").evaluate(section=>section.remove());
 await page.locator('.site-sidebar .toc-link[href="#new-section-heading"]').waitFor({state:"detached"});
 await page.setViewportSize({width:390,height:844});
 await page.getByRole("button",{name:"打开目录",exact:true}).click();
 const dialog=page.getByRole("dialog");
 await dialog.locator('.toc-link[href="#principle-heading"]').click();
 await dialog.waitFor({state:"hidden"});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.deepEqual(errors,[]);
 console.log("Automatic title changes, chapter insertion/removal and mobile navigation passed");
} finally {await browser.close();}
