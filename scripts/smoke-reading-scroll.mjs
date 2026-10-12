import assert from "node:assert/strict";
import {chromium} from "playwright";
import {patterns} from "../src/data/patterns.ts";

const base=process.env.PATTERN_ATLAS_URL??"http://localhost:3000";
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
const errors=[];
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.on("pageerror",error=>errors.push(error.message));
  for(const prefix of ["","/en"])for(const {slug} of patterns){
    await page.goto(`${base}${prefix}/patterns/${slug}`,{waitUntil:"networkidle"});
    for(const viewport of [{width:1440,height:900},{width:1280,height:720},{width:1025,height:540}]){
      await page.setViewportSize(viewport);
      const metrics=await page.evaluate(()=>{
        const root=document.scrollingElement;
        const panes=[...document.querySelectorAll(".lesson-reading,.lesson-lab")];
        const before=panes.map(p=>({height:p.clientHeight,scroll:p.scrollHeight,overflow:getComputedStyle(p).overflowY}));
        panes.forEach(p=>p.scrollTop=p.scrollHeight);
        return {document:root.scrollHeight,viewport:innerHeight,outerTop:root.scrollTop,before,after:panes.map(p=>p.scrollTop),horizontal:root.scrollWidth-innerWidth};
      });
      assert.ok(metrics.document<=metrics.viewport+1,`${prefix}/${slug}/${viewport.width}: outer document scrolls ${JSON.stringify(metrics)}`);
      assert.equal(metrics.outerTop,0);
      assert.ok(metrics.horizontal<=1);
      assert.equal(metrics.before.length,2);
      metrics.before.forEach((pane,index)=>{
        assert.equal(pane.overflow,"auto");
        assert.ok(pane.height>200);
        if(pane.scroll>pane.height)assert.ok(metrics.after[index]>0,"Internal pane must remain scrollable");
      });
    }
  }
  // Mouse wheel stays in the pane even at the end of the lesson.
  await page.setViewportSize({width:1440,height:900});
  await page.goto(`${base}/patterns/observer`,{waitUntil:"networkidle"});
  await page.locator(".lesson-reading").hover();
  await page.mouse.wheel(0,10000);
  await page.waitForFunction(()=>document.querySelector(".lesson-reading").scrollTop>0);
  await page.mouse.wheel(0,10000);
  assert.equal(await page.evaluate(()=>window.scrollY),0);
  await page.locator(".lesson-lab").hover();
  await page.mouse.wheel(0,10000);
  await page.waitForFunction(()=>document.querySelector(".lesson-lab").scrollTop>0);
  assert.equal(await page.evaluate(()=>window.scrollY),0);
  // Returning to document-scrolling routes must not inherit a scroll lock.
  for(const href of ["/","/principles","/comparisons","/comparisons/strategy-state"]){
    await page.goto(base+href,{waitUntil:"networkidle"});
    const metrics=await page.evaluate(()=>({height:document.scrollingElement.scrollHeight,viewport:innerHeight,overflow:getComputedStyle(document.documentElement).overflowY}));
    assert.notEqual(metrics.overflow,"hidden");
    if(metrics.height>metrics.viewport){await page.evaluate(()=>window.scrollTo(0,document.scrollingElement.scrollHeight));await page.waitForFunction(()=>scrollY>0);}
  }
  for(const width of [1024,768,390]){
    await page.setViewportSize({width,height:844});
    await page.goto(`${base}/patterns/observer`,{waitUntil:"networkidle"});
    assert.ok(await page.evaluate(()=>document.scrollingElement.scrollHeight>innerHeight));
    assert.equal(await page.locator(".lesson-lab").evaluate(e=>getComputedStyle(e).overflowY),"visible");
    await page.evaluate(()=>window.scrollTo(0,document.scrollingElement.scrollHeight));
    await page.waitForFunction(()=>scrollY>0);
    assert.ok(await page.evaluate(()=>document.scrollingElement.scrollWidth<=innerWidth+1));
  }
  assert.deepEqual(errors,[]);
  console.log("46 bilingual lessons × 3 desktop sizes: no outer scrollbar or blank tail; both panes scroll. Wheel, short viewport, mobile/tablet and document-scrolling routes passed.");
}finally{await browser.close();}
