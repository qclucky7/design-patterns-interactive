import {diffLines} from "diff";
import type {SerializableExample} from "./patterns/registry";
import type {CodeExample} from "./registry";

export function initialCodeFocus(code: string): number[] {
  const lines = code.split("\n");
  const entry = lines.findIndex(line => /public static void main|func main\(/.test(line));
  if (entry < 0) return [1, 2, 3, 4, 5];
  return lines.flatMap((line, index) => index > entry && line.trim() && line.trim() !== "}" ? [index + 1] : []).slice(0, 5);
}

export function buildCodeExamples(examples: SerializableExample[]): CodeExample[] {
  return examples.map(example => ({
    id: example.id, label: example.label, fileName: example.fileName, outputs: example.outputs,
    getStageCode: (stage: number) => example.stages[stage].split("\n").map((text, index) => ({text, sourceLine: index + 1})),
    focusByStage: example.focusByStage ?? example.stages.map((code, stage) => {
      if (stage === 0) return initialCodeFocus(code);
      let line = 1;
      const focus: number[] = [];
      for (const part of diffLines(example.stages[stage - 1], code)) {
        if (part.removed) continue;
        if (part.added) for (let index = 0; index < (part.count ?? 0); index++) focus.push(line + index);
        line += part.count ?? 0;
      }
      return focus;
    })
  }));
}
