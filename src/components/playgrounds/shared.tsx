"use client";
import {createContext, useContext, useState, type ReactNode} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";
export type DemoCopy = {title: string; instruction: string; controls: Record<string,string>; labels: Record<string,string>; explanation: string; guidance?: {instruction:string;feedback:Record<string,string>}; ui?: {observe:string;reset:string}};
const FeedbackContext = createContext<(label:string)=>void>(()=>{});
export function DemoFrame({copy,children}: {copy: DemoCopy;children: ReactNode}) {
  const [feedback,setFeedback] = useState("");
  const [version,setVersion] = useState(0);
  function report(label:string) {
    const key=Object.keys(copy.controls).find(key=>copy.controls[key]===label);
    if(key && copy.guidance?.feedback[key]) setFeedback(copy.guidance.feedback[key]);
  }
  return <section className="pattern-playground" aria-label={copy.title}>
    <div className="playground-heading"><h2>{copy.title}</h2><button type="button" className="playground-reset" onClick={()=>{setVersion(version+1);setFeedback("");}} aria-label={copy.ui?.reset}><ReloadIcon aria-hidden="true"/></button></div>
    <p className="playground-instruction">{copy.guidance?.instruction ?? copy.instruction}</p>
    <FeedbackContext.Provider value={report}><div key={version} className="playground-experiment" onChangeCapture={event=>{
      const label=event.target.closest("label");
      if(label) {
        const text=label.textContent ?? "";
        const key=Object.keys(copy.controls).find(key=>text.includes(copy.controls[key]));
        if(key) report(copy.controls[key]);
      }
    }}>{children}</div></FeedbackContext.Provider>
    {feedback && <p className="playground-feedback" role="status"><span>{copy.ui?.observe}</span>{feedback}</p>}
  </section>;
}
export function Choices({label,value,options,onChange}: {label: string;value: string;options: {value:string;label:string}[];onChange: (value:string)=>void}) {
  const report=useContext(FeedbackContext);
  return <div className="demo-choice-field"><span>{label}</span><div className="demo-choices" role="group" aria-label={label}>{options.map(option=><button type="button" key={option.value} aria-pressed={value===option.value} onClick={()=>{onChange(option.value);report(option.label);report(label);}}>{option.label}</button>)}</div></div>;
}
export function Action({children,onClick,disabled=false}: {children:ReactNode;onClick:()=>void;disabled?:boolean}) {const report=useContext(FeedbackContext);return <button type="button" className="demo-action" onClick={()=>{onClick();if(typeof children==="string")report(children);}} disabled={disabled}>{children}</button>;}
export function Output({label,children}: {label:string;children:ReactNode}) {return <div className="demo-output" role="status"><span>{label}</span><div>{children}</div></div>;}
export function ObjectBox({label,children,active=false}: {label:string;children:ReactNode;active?:boolean}) {return <div className={`demo-object ${active?"active":""}`}><span>{label}</span><div>{children}</div></div>;}
