"use client";
import {useState} from "react";
import {ReadingCodeBlock} from "./reading-code-block";
export type ComparisonCodeExample={id:string;label:string;fileName:string;code:string};
export function ComparisonCode({examples,names,label,copyLabel,copiedLabel,copyErrorLabel}:{examples:ComparisonCodeExample[][];names:string[];label:string;copyLabel:string;copiedLabel:string;copyErrorLabel:string}){
  const [language,setLanguage]=useState("typescript");
  return <div className="comparison-columns comparison-code">{examples.map((side,index)=>{
    const example=side.find(item=>item.id===language)??side[0];
    return <section key={index}><h3>{names[index]}</h3><ReadingCodeBlock key={language} code={example.code} fileName={example.fileName} label={label} languages={side.map(({id,label})=>({id,label}))} language={language} onLanguageChange={setLanguage} copyLabel={copyLabel} copiedLabel={copiedLabel} copyErrorLabel={copyErrorLabel}/></section>;
  })}</div>;
}
