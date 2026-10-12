"use client";
import {useEffect,useState} from "react";
import {Choices,Action,Output,ObjectBox,type DemoCopy} from "./shared";

export function AdapterDemo({copy:c}: {copy:DemoCopy}) {
  const [amount,setAmount]=useState(10);
  return <><label className="demo-slider">{c.controls.amount}<input type="range" min="1" max="100" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><div className="demo-conversion"><ObjectBox label={c.labels.business}><strong>{amount}</strong><small>{c.labels.yuan}</small></ObjectBox><div className="demo-conversion-arrow">×100 →</div><ObjectBox label={c.labels.sdk} active><strong>{amount*100}</strong><small>{c.labels.cents}</small></ObjectBox></div></>;
}
export function BridgeDemo({copy:c}: {copy:DemoCopy}) {
  const [form,setForm]=useState("normal"),[channel,setChannel]=useState("email");
  return <><div className="demo-independent-choices"><Choices label={c.labels.form} value={form} options={["normal","urgent"].map(value=>({value,label:c.controls[value]}))} onChange={setForm}/><Choices label={c.labels.channel} value={channel} options={["email","sms"].map(value=>({value,label:c.controls[value]}))} onChange={setChannel}/></div><Output label={c.labels.message}>{c.controls[channel]}: {form==="urgent"?`[${c.labels.urgent}] `:""}{c.labels.hello}</Output></>;
}
type Tree={id:number;price?:number;children?:Tree[]};
const initialTree:Tree={id:0,children:[{id:1,price:10},{id:2,price:20}]};
function total(tree:Tree):number{return tree.children?tree.children.reduce((sum,child)=>sum+total(child),0):tree.price??0;}
function TreeView({tree,c}: {tree:Tree;c:DemoCopy}) {return <div className={`demo-tree-node ${tree.children?"branch":"leaf"}`}><span>{tree.children?c.labels.bundle:`${c.labels.item} ${tree.price}`}</span>{tree.children&&<div>{tree.children.map(child=><TreeView key={child.id} tree={child} c={c}/>)}</div>}</div>;}
export function CompositeDemo({copy:c}: {copy:DemoCopy}) {
  const [tree,setTree]=useState(initialTree),[nextId,setNextId]=useState(3),[depth,setDepth]=useState(1);
  function add(){setTree(t=>({...t,children:[...(t.children??[]),{id:nextId,price:10}]}));setNextId(nextId+1);}
  function nest(){setTree(t=>({id:nextId,children:[t]}));setNextId(nextId+1);setDepth(depth+1);}
  return <><div className="demo-toolbar"><Action onClick={add} disabled={nextId>=15}>{c.controls.add}</Action><Action onClick={nest} disabled={depth>=4}>{c.controls.nest}</Action><Action onClick={()=>{setTree(initialTree);setDepth(1);setNextId(3);}}>{c.controls.reset}</Action></div><div className="demo-tree"><TreeView tree={tree} c={c}/></div><Output label={c.labels.total}><strong>{total(tree)}</strong><small>{c.labels.depth}: {depth}</small></Output></>;
}
export function DecoratorDemo({copy:c}: {copy:DemoCopy}) {
  const [layers,setLayers]=useState<string[]>([]);
  const price=5+layers.reduce((sum,layer)=>sum+(layer==="milk"?2:1),0);
  let preview=<div className="demo-coffee-core">{c.labels.coffee}<code>5</code></div>;
  layers.forEach((layer,i)=>{preview=<div className="demo-wrapper" key={i}><span>{c.labels[layer]} <code>+{layer==="milk"?2:1}</code></span>{preview}</div>;});
  return <><div className="demo-toolbar"><Action onClick={()=>setLayers([...layers,"milk"])} disabled={layers.length>=5}>{c.controls.milk}</Action><Action onClick={()=>setLayers([...layers,"sugar"])} disabled={layers.length>=5}>{c.controls.sugar}</Action><Action onClick={()=>setLayers(layers.slice(0,-1))} disabled={!layers.length}>{c.controls.remove}</Action><Action onClick={()=>setLayers([])} disabled={!layers.length}>{c.controls.reset}</Action></div><div className="demo-wrapper-canvas">{preview}</div><Output label={c.labels.cost}><strong>{price}</strong><small>{c.labels.delegates}</small></Output></>;
}
export function FacadeDemo({copy:c}: {copy:DemoCopy}) {
  const [step,setStep]=useState(-1),[running,setRunning]=useState(false);
  useEffect(()=>{if(!running)return;const timer=setTimeout(()=>{if(step>=2)setRunning(false);else setStep(step+1);},window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:450);return()=>clearTimeout(timer);},[step,running]);
  return <><div className="demo-toolbar"><Action onClick={()=>{setStep(-1);setRunning(true);}} disabled={running}>{c.controls.start}</Action><Action onClick={()=>{setRunning(false);setStep(-1);}}>{c.controls.reset}</Action></div><ObjectBox label={c.labels.facade} active={running}><code>start()</code></ObjectBox><ol className="demo-sequence">{["db","cache","log"].map((key,i)=><li key={key} data-complete={step>=i}><span>{i+1}</span><strong>{c.labels[key]}</strong><small>{step>=i?c.labels.done:c.labels.waiting}</small></li>)}</ol></>;
}
export function FlyweightDemo({copy:c}: {copy:DemoCopy}) {
  const [kind,setKind]=useState("oak"),[trees,setTrees]=useState<string[]>([]);
  const types=[...new Set(trees)];
  return <><Choices label={c.labels.types} value={kind} options={["oak","pine"].map(value=>({value,label:c.controls[value]}))} onChange={setKind}/><div className="demo-toolbar"><Action onClick={()=>setTrees([...trees,kind])} disabled={trees.length>=12}>{c.controls.plant}</Action><Action onClick={()=>setTrees([])}>{c.controls.reset}</Action></div><div className="demo-type-pool">{types.map(type=><ObjectBox label={c.controls[type]} key={type} active><code>TreeType #{types.indexOf(type)+1}</code><strong>{trees.filter(tree=>tree===type).length}</strong></ObjectBox>)}</div><div className="demo-tree-instances">{trees.map((type,index)=><div key={index} data-species={type}><span>{c.controls[type]}</span><code>→ #{types.indexOf(type)+1}</code><small>{c.labels.position}: {index+1}</small></div>)}</div><Output label={c.labels.trees}>{trees.length} <span> / {c.labels.types}: {types.length}</span></Output></>;
}
export function ProxyDemo({copy:c}: {copy:DemoCopy}) {
  const [created,setCreated]=useState(false),[displays,setDisplays]=useState(0);
  return <><div className="demo-toolbar"><Action onClick={()=>setCreated(true)} disabled={created}>{c.controls.create}</Action><Action onClick={()=>setDisplays(displays+1)} disabled={!created}>{c.controls.display}</Action><Action onClick={()=>{setCreated(false);setDisplays(0);}}>{c.controls.reset}</Action></div><div className="demo-builder-preview"><ObjectBox label={c.labels.proxy} active={created}>{created?<code>ImageProxy #1</code>:c.labels.empty}</ObjectBox><ObjectBox label={c.labels.real} active={displays>0}>{displays>0?<><code>RealImage #1</code><small>{c.labels.loaded}</small></>:c.labels.pending}</ObjectBox></div><Output label={c.labels.loads}><strong>{displays>0?1:0}</strong><small>{c.labels.displays}: {displays}</small></Output></>;
}
