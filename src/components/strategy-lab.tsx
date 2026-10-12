"use client";

import { useEffect, useState } from "react";
import {diffLines} from "diff";
import {ArrowRightIcon, ArrowLeftIcon, ReloadIcon, ChevronDownIcon} from "@radix-ui/react-icons";
import {ReadingCodeBlock} from "./reading-code-block";
import {PatternDiagram} from "@/components/pattern-diagram";
import {strategyScenes} from "@/data/scenes";
import type {Scene} from "@/data/scenes";
import type {CodeExample} from "@/code-examples/registry";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";

type LabCopy = typeof strategyMessages.lab;
type Stages = typeof strategyMessages.stages;

function Diagram({stage, copy}: {stage: number; copy: LabCopy}) {
  const labels = {checkout: copy.checkout, conditional: copy.decision, strategy: copy.strategy, card: copy.card, wallet: copy.wallet, points: copy.points};
  const notes = {checkout: stage === 0 ? copy.nodeOriginal : stage === 1 ? copy.nodeEdit : copy.nodeStable, conditional: stage === 1 ? copy.nodeEdit : "if / else", strategy: copy.nodeInterface, card: stage === 3 ? copy.nodeStable : copy.nodeStandalone, wallet: stage === 3 ? copy.nodeStable : copy.nodeStandalone, points: copy.nodeNew};
  return <PatternDiagram scene={strategyScenes[stage]} labels={labels} notes={notes} description={stage >= 2 ? copy.diagramNew : copy.diagramOld} />;
}

export function StrategyLab({ copy, stages, examples, scenes, labels, annotations, id="lab", compact=false }: { copy: LabCopy; stages: Stages; examples: CodeExample[]; scenes?: Scene[]; labels?: Record<string,string>; annotations?: Record<string,string>[];id?:string;compact?:boolean }) {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exampleId, setExampleId] = useState(examples[0].id);

  useEffect(() => {
    if (!playing) return;
    if (stage === stages.length - 1) {
      const reset = window.setTimeout(() => setPlaying(false), 500);
      return () => window.clearTimeout(reset);
    }
    const timer = window.setTimeout(() => setStage((current) => current + 1), 2200);
    return () => window.clearTimeout(timer);
  }, [playing, stage, stages.length]);

  function chooseStage(next: number) {
    setStage(next);
    setPlaying(false);
  }

  const current = stages[stage];
  const example = examples.find((item) => item.id === exampleId) ?? examples[0];
  const lines = example.getStageCode(stage);
  const focus = example.focusByStage[stage];
  const changes = stage > 0 ? diffLines(example.getStageCode(stage - 1).map(line => line.text).join("\n"), lines.map(line => line.text).join("\n")).filter(change => change.added || change.removed) : [];
  const diffRows = changes.flatMap(change => change.value.trimEnd().split("\n").map(text => ({text, added: !!change.added})));
  const firstFocus = Math.max(0, lines.findIndex(line => focus.includes(line.sourceLine)));
  const preview = stage === 0 ? lines.slice(firstFocus, firstFocus + 5).map(line => ({text: line.text, added: false})) : [...diffRows.filter(line => !line.added).slice(0, 1), ...diffRows.filter(line => line.added).slice(0, 4)];
  const addedCount = changes.filter(change => change.added).reduce((total, change) => total + (change.count ?? 0), 0);
  const removedCount = changes.filter(change => change.removed).reduce((total, change) => total + (change.count ?? 0), 0);

  return (
    <section className={`lab ${compact ? "lab-compact" : ""}`} id={id} aria-label={copy.region}>
      {!compact && <><div className="lab-topline">
        <div className="lab-label">{copy.label}</div>
        <span className="lab-count">{copy.count}</span>
      </div>

      <div className="lab-heading-row">
        <div>
          <div className="lab-kicker">{current.label}</div>
          <h2 aria-live="polite">{current.title}</h2>
        </div>
        <button className="replay-button" type="button" onClick={() => { setStage(0); setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches); }} aria-label={copy.replayLabel}>
          <ReloadIcon aria-hidden="true" /> {copy.replay}
        </button>
      </div>
      <p className="lab-description">{current.description}</p>
      <p className="lab-guide">{copy.guide}</p></>}

      <div className="stage-controls" aria-label={copy.stepsLabel}>
        <div className="stage-tabs">
          {stages.map((item, index) => (
            <button key={item.number} type="button" className={`stage-tab ${stage === index ? "active" : ""}`} onClick={() => chooseStage(index)} aria-current={stage === index ? "step" : undefined} aria-label={`${copy.stepPrefix}${index + 1}${copy.stepSuffix}${item.label}`}>
              <span className="stage-tab-number">{item.number}</span><span className="stage-tab-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="diagram-frame" data-stage={stage}>
        {scenes && labels ? <PatternDiagram scene={scenes[stage]} labels={labels} notes={annotations?.[stage]} description={current.graphNote} /> : <Diagram stage={stage} copy={copy} />}
        {!compact && <p className="graph-change-note" key={stage}>{current.graphNote}</p>}
      </div>

      <div className="code-head">
        <div><h3>{stage === 0 ? copy.baseline : copy.changes}</h3></div>
      </div>
      <div className="change-preview" key={`${stage}-${exampleId}`}>
        <div className="change-summary" role="status"><p>{current.codeNote}</p>{stage > 0 && <span>{copy.added} {addedCount} / {copy.removed} {removedCount}</span>}</div>
        {!compact && <pre aria-label={copy.changes}><code>{preview.map((line,index) => <span className={`change-row ${stage > 0 ? line.added ? "added" : "removed" : "context"}`} key={index}><span aria-hidden="true">{stage > 0 ? line.added ? "+" : "-" : " "}</span>{line.text || " "}</span>)}<span className="change-row context">…</span></code></pre>}
      </div>
      {!compact && example.outputs && <div className="example-result"><span>{copy.resultLabel}</span><pre key={`${stage}-${exampleId}-result`} aria-live="polite">{example.outputs[stage]}</pre></div>}
      <div className="lab-actions">
        <button type="button" className="lab-previous" onClick={() => chooseStage(Math.max(0,stage-1))} disabled={stage === 0} aria-label={copy.prev}><ArrowLeftIcon />{copy.prev}</button>
        <button type="button" className="lab-next" onClick={() => chooseStage(stage === stages.length-1 ? 0 : stage+1)} aria-label={stage === stages.length-1 ? copy.restart : copy.next}>{current.action}<ArrowRightIcon /></button>
      </div>
      {!compact && stage === stages.length-1 && <p className="lab-complete">{copy.done}</p>}
      {stage > 0 && <details className="code-details"><summary>{copy.fullDiff}<ChevronDownIcon /></summary><pre className="full-diff" aria-label={copy.fullDiff}><code>{diffRows.map((row,index) => <span className={`change-row ${row.added ? "added" : "removed"}`} key={index}><span aria-hidden="true">{row.added ? "+" : "-"}</span>{row.text || " "}</span>)}</code></pre></details>}
      <details className="code-details" open><summary>{copy.fullCode}<ChevronDownIcon /></summary>
      <ReadingCodeBlock key={`${example.id}-${stage}`} code={lines.map(line => line.text).join("\n")} focus={lines.flatMap((line, index) => focus.includes(line.sourceLine) ? [index + 1] : [])} fileName={example.fileName} label={copy.codeLanguagesLabel} languages={examples} language={example.id} onLanguageChange={setExampleId} copyLabel={copy.copyable} copiedLabel={copy.copied} copyErrorLabel={copy.copyError} />
      {!compact && <p className="code-footnote">{copy.note}</p>}
      </details>
    </section>
  );
}
