"use client";
import {useState} from "react";
import {Choices,Action,Output,ObjectBox,type DemoCopy} from "./shared";

export function SingletonDemo({copy:c}: {copy:DemoCopy}) {
  const [refs,setRefs]=useState({cart:false,job:false});
  const [flag,setFlag]=useState(false);
  const value=flag?c.labels.on:c.labels.off;
  return <><div className="demo-toolbar"><Action onClick={()=>setRefs(r=>({...r,cart:true}))}>{c.controls.cart}</Action><Action onClick={()=>setRefs(r=>({...r,job:true}))}>{c.controls.job}</Action><Action onClick={()=>setFlag(!flag)} disabled={!refs.cart&&!refs.job}>{c.controls.toggle}</Action></div>
    <div className="demo-reference-map"><ObjectBox label={c.labels.cart} active={refs.cart}>{refs.cart?<><code>Settings #1</code><small>{value}</small></>:c.labels.waiting}</ObjectBox><ObjectBox label={c.labels.job} active={refs.job}>{refs.job?<><code>Settings #1</code><small>{value}</small></>:c.labels.waiting}</ObjectBox><div className="demo-shared-object"><ObjectBox label={c.labels.instance} active={refs.cart||refs.job}><strong>{refs.cart||refs.job?1:0}</strong><small>{c.labels.flag}: {value}</small></ObjectBox></div></div>
    {refs.cart&&refs.job&&<Output label={c.labels.instance}>{c.labels.same}</Output>}
  </>;
}
export function FactoryMethodDemo({copy:c}: {copy:DemoCopy}) {
  const [channel,setChannel]=useState("email"),[sent,setSent]=useState(false);
  return <><Choices label={c.labels.product} value={channel} options={["email","sms"].map(value=>({value,label:c.controls[value]}))} onChange={value=>{setChannel(value);setSent(false);}}/><div className="demo-pipeline">{[c.labels.prepare,c.labels.create,c.labels.send].map((label,i)=><ObjectBox key={label} label={label} active={i===1}>{i===1?c.controls[channel]:i===0?"hello":sent?"hello":c.labels.idle}</ObjectBox>)}</div><Action onClick={()=>setSent(true)}>{c.controls.send}</Action></>;
}
export function AbstractFactoryDemo({copy:c}: {copy:DemoCopy}) {
  const [family,setFamily]=useState("light");
  return <><Choices label={c.labels.factory} value={family} options={["light","dark"].map(value=>({value,label:c.controls[value]}))} onChange={setFamily}/><div className="demo-product-family" data-family={family}><ObjectBox label={c.labels.button}><span className="product-button">{c.labels.sample}</span></ObjectBox><ObjectBox label={c.labels.checkbox}><label className="product-checkbox"><input type="checkbox" defaultChecked />{c.labels.select}</label></ObjectBox></div></>;
}
export function BuilderDemo({copy:c}: {copy:DemoCopy}) {
  const [draft,setDraft]=useState({format:"csv",header:false,compressed:false}),[built,setBuilt]=useState<typeof draft|null>(null);
  const describe=(task:typeof draft)=><><strong>{task.format.toUpperCase()}</strong><small>{c.controls.header}: {task.header?c.labels.enabled:c.labels.disabled}</small><small>{c.controls.compress}: {task.compressed?c.labels.enabled:c.labels.disabled}</small></>;
  return <><Choices label={c.controls.format} value={draft.format} options={["csv","pdf"].map(value=>({value,label:value.toUpperCase()}))} onChange={format=>setDraft(d=>({...d,format}))}/><div className="demo-checkboxes"><label><input type="checkbox" checked={draft.header} onChange={e=>setDraft(d=>({...d,header:e.target.checked}))}/>{c.controls.header}</label><label><input type="checkbox" checked={draft.compressed} onChange={e=>setDraft(d=>({...d,compressed:e.target.checked}))}/>{c.controls.compress}</label></div><div className="demo-builder-preview"><ObjectBox label={c.labels.draft}>{describe(draft)}</ObjectBox><ObjectBox label={c.labels.built} active={!!built}>{built?describe(built):c.labels.empty}</ObjectBox></div><Action onClick={()=>setBuilt({...draft})}>{c.controls.build}</Action></>;
}
export function PrototypeDemo({copy:c}: {copy:DemoCopy}) {
  const [objects,setObjects]=useState<{template:string[];copy:string[]|null}>({template:["base"],copy:null});
  const shared=objects.copy===objects.template;
  function edit() {setObjects(o=>{if(!o.copy)return o;const changed=[...o.copy,`tag${o.copy.length}`];return {template:o.copy===o.template?changed:o.template,copy:changed};});}
  return <><div className="demo-toolbar"><Action onClick={()=>setObjects(o=>({...o,copy:o.template}))}>{c.controls.shallow}</Action><Action onClick={()=>setObjects(o=>({...o,copy:[...o.template]}))}>{c.controls.clone}</Action><Action onClick={edit} disabled={!objects.copy}>{c.controls.edit}</Action><Action onClick={()=>setObjects({template:["base"],copy:null})}>{c.controls.reset}</Action></div><div className="demo-builder-preview">{(["template","copy"] as const).map(key=><ObjectBox key={key} label={c.labels[key]} active={key==="copy"&&!!objects.copy}><div className="demo-tags">{objects[key]?.map((tag,i)=><code key={i}>{tag}</code>)??c.labels.empty}</div></ObjectBox>)}</div>{objects.copy&&<Output label={c.labels.tags}>{shared?c.labels.shared:c.labels.independent}</Output>}</>;
}
