import {spawn} from "node:child_process";
import {watch} from "node:fs";
import {mkdir,copyFile} from "node:fs/promises";
import {buildSearch} from "./build-search.mjs";

const args=process.argv.slice(2);
// Make the official UI available before the first crawl finishes on a clean checkout.
await mkdir("public/pagefind",{recursive:true});
await copyFile("node_modules/@pagefind/component-ui/npm_dist/mjs/component-ui.mjs","public/pagefind/pagefind-component-ui.js");
const next=spawn(process.execPath,["node_modules/next/dist/bin/next","dev",...args],{stdio:["inherit","pipe","inherit"]});
let baseUrl,stopped=false,running=false,pending=false,timer;
async function refresh() {
  if(stopped||!baseUrl)return;
  if(running){pending=true;return;}
  running=true;
  try {await buildSearch({baseUrl});}
  catch(error){console.error("Search indexing failed. Run npm run search:dev to retry:",error.message);}
  finally {running=false;if(pending){pending=false;void refresh();}}
}
let ready=false;
next.stdout.on("data",chunk=>{
  process.stdout.write(chunk);
  const text=chunk.toString().replace(/\x1b\[[0-9;]*m/g,"");
  const local=text.match(/Local:\s+(http:\/\/[^\s]+)/);
  if(local)baseUrl=local[1];
  if(!ready&&text.includes("Ready in")){ready=true;void refresh();}
});
const watchers=["src/i18n/messages","src/data","src/components","src/app"].map(directory=>watch(directory,{recursive:true},(_event,file)=>{
  if(!file||!/[.](json|tsx?|mjs)$/.test(file))return;
  clearTimeout(timer);timer=setTimeout(()=>void refresh(),1500);
}));
function stop(){stopped=true;clearTimeout(timer);watchers.forEach(watcher=>watcher.close());next.kill();}
process.on("SIGINT",stop);
process.on("SIGTERM",stop);
next.on("exit",code=>{stop();process.exitCode=code??0;});
