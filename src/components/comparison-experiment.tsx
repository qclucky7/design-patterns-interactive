"use client";

import {useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {ResetIcon} from "@radix-ui/react-icons";
import {PatternDiagram} from "./pattern-diagram";
import type {ComparisonEntry,ComparisonMessages} from "@/data/comparisons";
import type {Scene} from "@/data/scenes";

export function ComparisonExperiment({entry,names,labels,scenes}:{entry:ComparisonEntry;names:string[];labels:ComparisonMessages["labels"];scenes:{scene:Scene;labels:Record<string,string>}[][]}){
  const [steps,setSteps]=useState([0,0]),[answers,setAnswers]=useState<Record<number,number>>({});
  function panel(side:number){
    const copy=entry.sides[side],state=copy.states[steps[side]],drawing=scenes[side][steps[side]];
    return <section className="comparison-demo" aria-label={names[side]}>
      <header><span className="comparison-side-number">0{side+1}</span><h3>{names[side]}</h3><button type="button" className="comparison-reset" aria-label={`${labels.reset} ${names[side]}`} onClick={()=>setSteps(prev=>prev.map((n,i)=>i===side?0:n))}><ResetIcon/></button></header>
      <h4>{copy.intent}</h4><p className="comparison-guide">{copy.guide}</p>
      <PatternDiagram key={steps[side]} {...drawing} description={state.name}/>
      <div className="comparison-actions">{state.actions.map(action=><button key={action.label} type="button" onClick={()=>setSteps(prev=>prev.map((n,i)=>i===side?action.target:n))}>{action.label}<span aria-hidden="true"> →</span></button>)}</div>
      <div className="comparison-result" role="status" aria-live="polite"><small>{labels.result}</small><p>{state.result}</p></div>
    </section>;
  }
  return <>
    <section className="comparison-section" aria-labelledby="experiment"><h2 id="experiment">{labels.experiment}</h2>
      <div className="comparison-desktop comparison-columns">{panel(0)}{panel(1)}</div>
      <Tabs.Root defaultValue="0" className="comparison-mobile"><Tabs.List className="comparison-tabs" aria-label={labels.experiment}>{names.map((name,i)=><Tabs.Trigger key={name} value={String(i)}>{name}</Tabs.Trigger>)}</Tabs.List>{names.map((name,i)=><Tabs.Content key={name} value={String(i)}>{panel(i)}</Tabs.Content>)}</Tabs.Root>
      <p className="comparison-note">{labels.diagramNote}</p>
    </section>
    <section className="comparison-section comparison-quiz" aria-labelledby="quiz"><h2 id="quiz">{labels.quiz}</h2>
      {entry.quizzes.map((quiz,index)=><fieldset key={quiz.question}><legend>{quiz.question}</legend><div className="comparison-choices">{names.map((name,side)=><button key={name} type="button" aria-pressed={answers[index]===side} onClick={()=>setAnswers(prev=>({...prev,[index]:side}))}>{name}</button>)}</div>
        {answers[index]!==undefined&&<p role="status" className={answers[index]===quiz.answer?"quiz-correct":"quiz-retry"}>{answers[index]===quiz.answer?labels.correct:labels.retry} · {quiz.explanation}</p>}
      </fieldset>)}
    </section>
  </>;
}
