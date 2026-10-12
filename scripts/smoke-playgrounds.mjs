import assert from "node:assert/strict";
import {chromium} from "playwright";
import {readFile, mkdir} from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const output=path.join(os.tmpdir(),"design-patterns-guided");
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true});
const errors=[];
try {
 for(const locale of ["zh-CN","en"]) {
  const messages=JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/playgrounds.json`,import.meta.url),"utf8"));
  const guidance=JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}/playground-guidance.json`,import.meta.url),"utf8"));
  const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:"reduce"});
  page.on("pageerror",error=>errors.push(error.message));
  for(const [slug,c] of Object.entries(messages.patterns)) {
   await page.goto(`http://localhost:3000${locale==="en"?"/en":""}/patterns/${slug}`,{waitUntil:"networkidle"});
   const demo=page.locator(".pattern-playground");
   assert.equal(await demo.locator(".playground-instruction").innerText(),guidance.patterns[slug].instruction);
   const action=key=>demo.getByRole("button",{name:c.controls[key],exact:true}).click();
   const text=()=>demo.innerText();
   const initialText=await text();
   const box=label=>demo.locator(".demo-object").filter({has:page.getByText(label,{exact:true})});
   async function range(value) {
    await demo.locator('input[type="range"]').fill(String(value));
   }
   switch(slug) {
    case "singleton":
     await action("cart");await action("job");await action("toggle");
     assert.equal(await demo.locator(".demo-reference-map code").allTextContents().then(values=>new Set(values).size),1);
     assert.ok((await box(c.labels.cart).innerText()).includes(c.labels.on));
     assert.ok((await box(c.labels.job).innerText()).includes(c.labels.on));break;
    case "factory-method":
     await action("sms");await action("send");
     assert.ok((await demo.locator(".demo-pipeline").innerText()).includes(c.controls.sms));
     assert.ok((await demo.locator(".demo-pipeline .demo-object").last().innerText()).includes("hello"));break;
    case "abstract-factory":
     await action("dark");assert.equal(await demo.locator(".demo-product-family").getAttribute("data-family"),"dark");break;
    case "builder":
     await demo.getByRole("checkbox",{name:c.controls.header}).check();await action("build");
     await demo.getByRole("checkbox",{name:c.controls.header}).uncheck();
     assert.ok((await box(c.labels.draft).innerText()).includes(`${c.controls.header}: ${c.labels.disabled}`));
     assert.ok((await box(c.labels.built).innerText()).includes(`${c.controls.header}: ${c.labels.enabled}`));break;
    case "prototype":
     await action("shallow");await action("edit");assert.ok((await box(c.labels.template).innerText()).includes("tag1"));
     await action("reset");await action("clone");await action("edit");
     assert.ok(!(await box(c.labels.template).innerText()).includes("tag1"));
     assert.ok((await box(c.labels.copy).innerText()).includes("tag1"));break;
    case "adapter":
     await range(25);assert.ok((await box(c.labels.sdk).innerText()).includes("2500"));break;
    case "bridge":
     await action("urgent");await action("sms");assert.ok((await demo.locator(".demo-output").innerText()).includes(c.labels.urgent));break;
    case "composite":
     await action("add");await action("nest");assert.equal(await demo.locator(".demo-output strong").innerText(),"40");break;
    case "decorator":
     await action("milk");await action("sugar");assert.equal(await demo.locator(".demo-output strong").innerText(),"8");
     await action("remove");assert.equal(await demo.locator(".demo-output strong").innerText(),"7");break;
    case "facade":
     await action("start");await demo.locator('.demo-sequence li[data-complete="true"]').last().waitFor();
     await page.waitForFunction(()=>document.querySelectorAll('.demo-sequence li[data-complete="true"]').length===3);break;
    case "flyweight":
     await action("plant");await action("plant");assert.equal(await demo.locator(".demo-type-pool .demo-object").count(),1);
     await action("pine");await action("plant");assert.equal(await demo.locator(".demo-type-pool .demo-object").count(),2);
     assert.equal(await demo.locator(".demo-tree-instances>div").count(),3);break;
    case "proxy":
     await action("create");assert.equal(await demo.locator(".demo-output strong").innerText(),"0");
     await action("display");await action("display");assert.equal(await demo.locator(".demo-output strong").innerText(),"1");break;
    case "chain-of-responsibility":
     await action("submit");assert.ok((await demo.locator(".handles").innerText()).includes(c.labels.supervisor));
     await range(6000);await action("submit");assert.ok((await text()).includes(c.labels.unhandled));break;
    case "command":
     await action("execute");assert.equal(await demo.locator(".demo-output strong").innerText(),"AB");
     await action("undo");assert.equal(await demo.locator(".demo-output strong").innerText(),"A");break;
    case "interpreter":
     await range(21);assert.ok((await demo.locator(".demo-expression>.demo-object").innerText()).includes(c.labels.yes));
     await demo.getByRole("checkbox").uncheck();assert.ok((await demo.locator(".demo-expression>.demo-object").innerText()).includes(c.labels.no));break;
    case "iterator":
     await action("reverse");await action("next");assert.equal(await demo.locator(".demo-output strong").innerText(),"C");break;
    case "mediator":
     await demo.getByRole("textbox").fill("design");assert.ok((await box(c.labels.results).innerText()).includes("design"));
     await action("clear");assert.equal(await demo.getByRole("textbox").inputValue(),"");break;
    case "memento":
     await action("save");await demo.getByRole("textbox").fill("ABC");await action("restore");
     assert.equal(await demo.getByRole("textbox").inputValue(),"A");break;
    case "observer":
     await demo.getByRole("checkbox",{name:c.controls.display,exact:true}).uncheck();await action("publish");
     assert.equal(await box(c.labels.display).locator(".demo-tags code").count(),0);
     assert.equal(await box(c.labels.email).locator(".demo-tags code").innerText(),"4");break;
    case "state":
     await action("click");assert.equal(await demo.locator('[data-current="true"]').innerText(),c.labels.playing);
     await action("click");assert.equal(await demo.locator('[data-current="true"]').innerText(),c.labels.paused);
     await action("click");assert.equal(await demo.locator('[data-current="true"]').innerText(),c.labels.playing);break;
    case "template-method":
     await action("json");await action("run");assert.ok((await demo.locator(".demo-output").last().innerText()).includes("saved:A|B"));break;
    case "visitor":
     await action("names");await action("visit");assert.ok((await text()).includes("notes,readme"));
     await action("size");await action("visit");assert.ok((await demo.locator(".demo-output").innerText()).includes("30"));break;
   }
   assert.ok(await demo.locator(".playground-feedback").isVisible(),`${slug}: no action feedback`);
   assert.equal(await page.locator(".lab-topline").count(),0,`${slug}: duplicated lab header`);
   assert.equal(await page.locator(".change-preview pre").count(),0,`${slug}: duplicated code preview`);
   assert.equal(await page.locator(".lesson-walkthrough[open]").count(),1);
   assert.equal(await page.locator(".code-window pre").isVisible(),true);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${slug}: horizontal overflow`);
   if(["builder","observer","state"].includes(slug)) await page.screenshot({path:path.join(output,`${slug}-${locale}-desktop.png`)});
   await demo.getByRole("button",{name:guidance.ui.reset,exact:true}).click();
   assert.equal(await demo.locator(".playground-feedback").count(),0,`${slug}: reset feedback`);
   assert.equal(await text(),initialText,`${slug}: reset experiment state`);
   await page.setViewportSize({width:390,height:844});
   await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth+1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${slug}: mobile overflow`);
   if(slug==="builder") await page.screenshot({path:path.join(output,`builder-${locale}-mobile.png`),fullPage:true});
   await page.setViewportSize({width:1440,height:960});
   console.log(`${locale}/${slug}: meaningful interaction, feedback, reset and readable layout passed`);
  }
  await page.close();
 }
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
