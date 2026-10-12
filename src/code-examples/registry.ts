import {pythonExample} from "./python";
import {focusByStage, getStageCode} from "./typescript";
import {javaPatternStages} from "./java";
import {goPatternStages} from "./go";
import {codeLanguages} from "./languages";
import {diffLines} from "diff";
import {initialCodeFocus} from "./build-examples";

export type CodeExample = {
  id: string;
  label: string;
  fileName: string;
  outputs?: string[];
  focusByStage: number[][];
  getStageCode: (stage: number) => {text: string; sourceLine: number}[];
};

export const codeExamples: CodeExample[] = [
  {id: "typescript", label: "TypeScript", fileName: "checkout.ts", focusByStage, getStageCode},
  pythonExample,
  ...codeLanguages.filter(language => language.id === "java" || language.id === "go").map(language => {
    const stages = language.id === "java" ? javaPatternStages.strategy : goPatternStages.strategy;
    return {
      id: language.id, label: language.label, fileName: language.fileName,
      outputs: ["Card payment ¥100", "Points redeemed ¥100", "Card payment ¥100", "Points redeemed ¥100"],
      getStageCode: (stage: number) => stages[stage].split("\n").map((text, index) => ({text, sourceLine: index + 1})),
      focusByStage: stages.map((code, stage) => {
        if (stage === 0) return initialCodeFocus(code);
        let line = 1;
        const focus: number[] = [];
        for (const part of diffLines(stages[stage - 1], code)) {
          if (part.removed) continue;
          if (part.added) for (let index = 0; index < (part.count ?? 0); index++) focus.push(line + index);
          line += part.count ?? 0;
        }
        return focus;
      })
    };
  })
];
