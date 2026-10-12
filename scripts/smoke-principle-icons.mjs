import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {chromium} from "playwright";
import sharp from "sharp";
import path from "node:path";
import os from "node:os";
import {principles} from "../src/data/principles.ts";

const base=process.env.PATTERN_ATLAS_URL??"http://localhost:3000",marks=new Set();
for(const principle of principles){
  const svg=await readFile(path.join(process.cwd(),"public",principle.icon),"utf8");
  assert.match(svg,/viewBox="0 0 64 64"/);
  assert.match(svg,/<desc>.+<\/desc>/);
  assert.doesNotMatch(svg,/<(script|image|foreignObject)|\bon\w+=|\bhref=/i);
  assert.ok(!marks.has(svg),principle.slug);
  marks.add(svg);
  await sharp(Buffer.from(svg)).resize(40,40).png().toBuffer();
  assert.equal((await fetch(base+principle.icon)).status,200);
}
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
try{
  for(const prefix of ["","/en"])for(const width of [1440,820,390]){
    const page=await browser.newPage({viewport:{width,height:900}});
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    await page.goto(base+prefix+"/principles",{waitUntil:"networkidle"});
    const icons=page.locator(".catalog-principle-icon");
    assert.equal(await icons.count(),principles.length);
    for(const icon of await icons.all()){
      await icon.scrollIntoViewIfNeeded();
      await page.waitForFunction(src=>[...document.images].some(image=>image.getAttribute("src")===src&&image.complete&&image.naturalWidth===64),await icon.getAttribute("src"));
      assert.equal(await icon.getAttribute("alt"),"");
      const box=await icon.boundingBox();
      assert.equal(box.width,40);
      assert.equal(box.height,40);
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.ok(await page.locator(".principle-entry").evaluateAll(items=>items.every(item=>item.scrollWidth<=item.clientWidth+1)));
    assert.deepEqual(errors,[]);
    await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
    if(width!==820)await page.screenshot({path:path.join(os.tmpdir(),`principle-icons-${prefix?"en":"zh"}-${width}.png`),fullPage:true});
    await page.locator(".principle-entry").first().click();
    await page.waitForURL(/principles\/single-responsibility/);
    await page.locator("h1").waitFor();
    await page.close();
  }
  console.log("Seven distinct SVG principle icons: rendering, local delivery, bilingual layouts at 1440/820/390px, accessibility and lesson navigation passed.");
}finally{await browser.close();}
