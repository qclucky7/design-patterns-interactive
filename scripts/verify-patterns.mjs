import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtemp,writeFile,readFile} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import ts from "typescript";
import {patterns} from "../src/data/patterns.ts";
import {getPatternScenes} from "../src/data/pattern-scenes.ts";
const temporary = await mkdtemp(path.join(os.tmpdir(),"design-patterns-all-"));
const sources = [];
const outputs = {};
const python = spawnSync("python",["--version"],{encoding:"utf8"});
assert.equal(python.status,0,"Python is required for the complete example verification");
for (const {slug,category} of patterns.filter(pattern => pattern.slug !== "strategy")) {
  const {default: examples} = await import(`../src/code-examples/patterns/${slug}.ts`);
  outputs[slug] = {typescript: [], python: []};
  assert.equal(examples.typescript.length,4);
  assert.equal(examples.python.length,4);
  const chinese = JSON.parse(await readFile(new URL(`../src/i18n/messages/zh-CN/${category}.json`,import.meta.url),"utf8"))[slug];
  const english = JSON.parse(await readFile(new URL(`../src/i18n/messages/en/${category}.json`,import.meta.url),"utf8"))[slug];
  assert.ok(chinese && english,`${slug}: missing lesson`);
  assert.equal(chinese.stages.length,4);
  const scenes = getPatternScenes(slug);
  assert.equal(scenes.length,4);
  for (const scene of scenes) {
    const ids = new Set(scene.nodes.map(node=>node.id));
    assert.equal(ids.size,scene.nodes.length,`${slug}: duplicate graph nodes`);
    for (const node of scene.nodes) {
      assert.ok(chinese.labels[node.id] && english.labels[node.id],`${slug}: untranslated node ${node.id}`);
      assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y),`${slug}: invalid layout`);
    }
    for (const edge of scene.edges) assert.ok(ids.has(edge.source) && ids.has(edge.target),`${slug}: dangling edge`);
  }
  for (const language of ["typescript","python"]) {
    assert.equal(new Set(examples[language]).size,4,`${slug}/${language}: stages must actually change`);
    for(let stage=0;stage<4;stage++) {
      const file=path.join(temporary,`${slug}-${stage}.${language==="typescript"?"ts":"py"}`);
      const code=examples[language][stage]+(language==="typescript"?"\nexport {};":"");
      await writeFile(file,code,"utf8");
      if(language==="typescript") sources.push(file);
      const run=spawnSync(language==="typescript"?"node":"python",[file],{encoding:"utf8",timeout:10000,env:{...process.env,PYTHONIOENCODING:"utf-8"}});
      assert.equal(run.status,0,`${slug}/${language}/${stage+1}: ${run.stderr || run.error?.message}`);
      assert.ok(run.stdout.toLowerCase().includes(examples.expected[stage].toLowerCase()),`${slug}/${language}/${stage+1}: unexpected output ${run.stdout}`);
      outputs[slug][language].push(run.stdout.replace(/\r/g,"").trim());
      if (!process.argv.includes("--json")) {
        const saved = JSON.parse(await readFile(new URL("../src/code-examples/patterns/outputs.json", import.meta.url),"utf8"));
        assert.equal(saved[slug][language][stage],run.stdout.replace(/\r/g,"").trim(),`${slug}: displayed output is stale`);
      }
      if(slug==="observer" && stage===3) assert.ok(!run.stdout.includes("display:"),"Unsubscribed listener must not run");
      if(slug==="prototype" && stage===3) assert.ok(run.stdout.replace(/\r/g,"").toLowerCase().startsWith("false\nbase\n"),"Clone must not mutate the template");
    }
  }
  console.log(`${slug}: eight stages executed`);
}
const program=ts.createProgram(sources,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.NodeNext,moduleResolution:ts.ModuleResolutionKind.NodeNext,strict:true,noEmit:true,skipLibCheck:true});
const diagnostics=ts.getPreEmitDiagnostics(program);
assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:file=>file,getNewLine:()=>"\n"}));
console.log(`Type-checked ${sources.length} TypeScript snapshots; all 176 new examples executed.`);
if (process.argv.includes("--json")) console.log(JSON.stringify(outputs));
