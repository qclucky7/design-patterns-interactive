"use client";
import {useState} from "react";
import {Choices,Action,Output,ObjectBox,type DemoCopy} from "./shared";

export function ChainDemo({copy:c}: {copy:DemoCopy}) {
  const [amount,setAmount]=useState(800),[submitted,setSubmitted]=useState<number|null>(null);
  const handler=submitted===null?-1:submitted<=100?0:submitted<=1000?1:submitted<=5000?2:3;
  return <><label className="demo-slider">{c.controls.amount}: <strong>{amount}</strong><input type="range" min="0" max="6000" step="50" value={amount} onChange={e=>{setAmount(Number(e.target.value));setSubmitted(null);}}/></label><Action onClick={()=>setSubmitted(amount)}>{c.controls.submit}</Action><div className="demo-handler-chain">{["agent","supervisor","manager"].map((key,index)=><div key={key} className={handler===index?"handles":handler>index?"passes":""}><span>{c.labels[key]}</span><code>{handler>index?"→":handler===index?"✓":"·"}</code></div>)}</div><Output label={c.labels.result}>{handler<0?c.labels.pending:handler===3?c.labels.unhandled:c.labels[["agent","supervisor","manager"][handler]]}</Output></>;
}
export function CommandDemo({copy:c}: {copy:DemoCopy}) {
  const [value,setValue]=useState("B"),[text,setText]=useState("A"),[history,setHistory]=useState<{before:string;insert:string}[]>([]);
  function execute(){setHistory([...history,{before:text,insert:value}]);setText(text+value);}
  function undo(){const last=history.at(-1);if(last){setText(last.before);setHistory(history.slice(0,-1));}}
  return <><label className="demo-text-field">{c.controls.text}<input value={value} maxLength={20} onChange={e=>setValue(e.target.value)}/></label><div className="demo-toolbar"><Action onClick={execute} disabled={!value||history.length>=8}>{c.controls.execute}</Action><Action onClick={undo} disabled={!history.length}>{c.controls.undo}</Action></div><Output label={c.labels.editor}><strong>{text}</strong></Output><div className="demo-history"><span>{c.labels.history}</span>{history.length?history.map((item,i)=><code key={i}>Insert(&quot;{item.insert}&quot;) → {item.before+item.insert}</code>):<small>{c.labels.empty}</small>}</div></>;
}
export function InterpreterDemo({copy:c}: {copy:DemoCopy}) {
  const [age,setAge]=useState(16),[member,setMember]=useState(true);
  return <><label className="demo-slider">{c.controls.age}: <strong>{age}</strong><input type="range" min="0" max="50" value={age} onChange={e=>setAge(Number(e.target.value))}/></label><label className="demo-checkbox"><input type="checkbox" checked={member} onChange={e=>setMember(e.target.checked)}/>{c.controls.member}</label><div className="demo-expression"><ObjectBox label={c.labels.and} active={age>18&&member}>{age>18&&member?c.labels.yes:c.labels.no}</ObjectBox><div><ObjectBox label={c.labels.age} active={age>18}>{age>18?c.labels.yes:c.labels.no}</ObjectBox><ObjectBox label={c.labels.member} active={member}>{member?c.labels.yes:c.labels.no}</ObjectBox></div></div></>;
}
export function IteratorDemo({copy:c}: {copy:DemoCopy}) {
  const [direction,setDirection]=useState("forward"),[cursor,setCursor]=useState(0);
  const songs=["A","B","C"],order=direction==="forward"?songs:[...songs].reverse(),current=cursor?order[cursor-1]:null;
  return <><Choices label={c.labels.cursor} value={direction} options={["forward","reverse"].map(value=>({value,label:c.controls[value]}))} onChange={value=>{setDirection(value);setCursor(0);}}/><div className="demo-song-list" aria-label={c.labels.collection}>{songs.map(song=><span key={song} data-current={current===song}>{song}</span>)}</div><div className="demo-toolbar"><Action onClick={()=>setCursor(cursor+1)} disabled={cursor>=order.length}>{c.controls.next}</Action><Action onClick={()=>setCursor(0)}>{c.controls.reset}</Action></div><Output label={c.labels.value}><strong>{current??c.labels.empty}</strong><small>{c.labels.cursor}: {cursor} / {order.length}{cursor===order.length?` · ${c.labels.end}`:""}</small></Output></>;
}
export function MediatorDemo({copy:c}: {copy:DemoCopy}) {
  const [query,setQuery]=useState("book"),[events,setEvents]=useState<string[]>([]);
  function notify(text:string,event:string){setQuery(text);setEvents([...events.slice(-2),`${event === "clear" ? c.controls.clear : c.labels.search} → ${c.labels.mediator} → ${c.labels.results}`]);}
  return <><label className="demo-text-field">{c.controls.query}<input value={query} maxLength={30} onChange={e=>notify(e.target.value,"search")}/></label><Action onClick={()=>notify("","clear")}>{c.controls.clear}</Action><div className="demo-pipeline"><ObjectBox label={c.labels.search}>{query||"∅"}</ObjectBox><ObjectBox label={c.labels.results} active={!!query}>{query?`results:${query}`:c.labels.empty}</ObjectBox></div><div className="demo-history"><span>{c.labels.mediator}</span>{events.map((event,i)=><code key={i}>{event}</code>)}</div></>;
}
export function MementoDemo({copy:c}: {copy:DemoCopy}) {
  const [text,setText]=useState("A"),[snapshots,setSnapshots]=useState<{text:string;cursor:number}[]>([]);
  return <><label className="demo-text-field">{c.controls.text}<input value={text} maxLength={30} onChange={e=>setText(e.target.value)}/></label><Action onClick={()=>setSnapshots([...snapshots,{text,cursor:text.length}])} disabled={snapshots.length>=5}>{c.controls.save}</Action><div className="demo-snapshots"><span>{c.labels.history}</span>{snapshots.length?snapshots.map((snapshot,index)=><div key={index}><span>#{index+1} &quot;{snapshot.text}&quot;<small>{c.labels.cursor}: {snapshot.cursor}</small></span><Action onClick={()=>setText(snapshot.text)}>{c.controls.restore}</Action></div>):<small>{c.labels.empty}</small>}</div></>;
}
export function ObserverDemo({copy:c}: {copy:DemoCopy}) {
  const [subscribed,setSubscribed]=useState({display:true,email:true}),[stock,setStock]=useState(3),[received,setReceived]=useState<{display:number[];email:number[]}>({display:[],email:[]});
  function publish(){const next=stock+1;setStock(next);setReceived(r=>({display:subscribed.display?[...r.display.slice(-3),next]:r.display,email:subscribed.email?[...r.email.slice(-3),next]:r.email}));}
  return <><div className="demo-checkboxes">{(["display","email"] as const).map(key=><label key={key}><input type="checkbox" checked={subscribed[key]} onChange={e=>setSubscribed(s=>({...s,[key]:e.target.checked}))}/>{c.controls[key]}</label>)}</div><div className="demo-toolbar"><Action onClick={publish}>{c.controls.publish}</Action><Action onClick={()=>setReceived({display:[],email:[]})}>{c.controls.reset}</Action></div><ObjectBox label={c.labels.stock} active><strong>{stock}</strong></ObjectBox><div className="demo-subscriptions">{(["display","email"] as const).map(key=><ObjectBox label={c.labels[key]} key={key} active={subscribed[key]}><small>{subscribed[key]?c.labels.subscribed:c.labels.unsubscribed}</small><div className="demo-tags">{received[key].length?received[key].map((event,i)=><code key={i}>{event}</code>):c.labels.none}</div></ObjectBox>)}</div></>;
}
export function StateDemo({copy:c}: {copy:DemoCopy}) {
  const [state,setState]=useState("stopped"),[history,setHistory]=useState<string[]>([]);
  function transition(next:string){setHistory([...history.slice(-4),`${c.labels[state]} → ${c.labels[next]}`]);setState(next);}
  return <><div className="demo-state-machine">{["stopped","playing","paused"].map(value=><div key={value} data-current={state===value}>{c.labels[value]}</div>)}</div><div className="demo-toolbar"><Action onClick={()=>transition(state==="playing"?"paused":"playing")}>{c.controls.click}</Action><Action onClick={()=>transition("stopped")} disabled={state==="stopped"}>{c.controls.stop}</Action></div>{history.length>0&&<div className="demo-history"><span>{c.labels.transitions}</span>{history.map((item,index)=><p key={index}>{item}</p>)}</div>}</>;
}
export function TemplateDemo({copy:c}: {copy:DemoCopy}) {
  const [format,setFormat]=useState("csv"),[done,setDone]=useState(false);
  const source=format==="csv"?" A,B ":'["A","B"]',rows=format==="csv"?source.trim().split(","):JSON.parse(source) as string[];
  return <><Choices label={c.labels.source} value={format} options={["csv","json"].map(value=>({value,label:c.controls[value]}))} onChange={value=>{setFormat(value);setDone(false);}}/><Output label={c.labels.source}><code>{source}</code></Output><div className="demo-pipeline">{["read","transform","save"].map(key=><ObjectBox label={c.labels[key]} key={key} active={key==="transform"}><code>{key==="read"?"trim()":key==="save"?"save(rows)":format==="csv"?'split(",")':"JSON.parse()"}</code></ObjectBox>)}</div><Action onClick={()=>setDone(true)}>{c.controls.run}</Action><Output label={c.labels.output}>{done?<code>saved:{rows.join("|")}</code>:c.labels.waiting}</Output></>;
}
export function VisitorDemo({copy:c}: {copy:DemoCopy}) {
  const [visitor,setVisitor]=useState("size"),[result,setResult]=useState<string|null>(null);
  const files=[{name:"notes",size:10},{name:"readme",size:20}];
  function visit(){setResult(visitor==="size"?String(files.reduce((sum,file)=>sum+file.size,0)):files.map(file=>file.name).join(","));}
  return <><Choices label={c.labels.operation} value={visitor} options={["size","names"].map(value=>({value,label:c.controls[value]}))} onChange={value=>{setVisitor(value);setResult(null);}}/><div className="demo-visitor-tree"><span>{c.labels.folder}</span><div>{files.map(file=><ObjectBox label={c.labels.file} key={file.name}><code>{file.name}</code><small>{file.size}</small></ObjectBox>)}</div></div><Action onClick={visit}>{c.controls.visit}</Action><Output label={c.labels.result}>{result??c.labels.empty}</Output></>;
}
