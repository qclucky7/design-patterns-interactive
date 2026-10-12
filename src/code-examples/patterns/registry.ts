import type {NewPatternSlug} from "@/data/lesson-types";
import {codeLanguages} from "../languages";
import {javaPatternStages} from "../java";
import {goPatternStages} from "../go";
import type {PatternExampleSet} from "./types";
import verifiedOutputs from "./outputs.json";
import example0 from "./singleton";
import example1 from "./factory-method";
import example2 from "./abstract-factory";
import example3 from "./builder";
import example4 from "./prototype";
import example5 from "./adapter";
import example6 from "./bridge";
import example7 from "./composite";
import example8 from "./decorator";
import example9 from "./facade";
import example10 from "./flyweight";
import example11 from "./proxy";
import example12 from "./chain-of-responsibility";
import example13 from "./command";
import example14 from "./interpreter";
import example15 from "./iterator";
import example16 from "./mediator";
import example17 from "./memento";
import example18 from "./observer";
import example19 from "./state";
import example20 from "./template-method";
import example21 from "./visitor";
export const patternExampleSets: Record<NewPatternSlug,PatternExampleSet> = {
  "singleton": example0,
  "factory-method": example1,
  "abstract-factory": example2,
  "builder": example3,
  "prototype": example4,
  "adapter": example5,
  "bridge": example6,
  "composite": example7,
  "decorator": example8,
  "facade": example9,
  "flyweight": example10,
  "proxy": example11,
  "chain-of-responsibility": example12,
  "command": example13,
  "interpreter": example14,
  "iterator": example15,
  "mediator": example16,
  "memento": example17,
  "observer": example18,
  "state": example19,
  "template-method": example20,
  "visitor": example21
};
export type SerializableExample = {id: string; label: string; fileName: string; stages: [string,string,string,string]; outputs?: string[]; focusByStage?: number[][]};
export function getPatternExamples(slug: NewPatternSlug): SerializableExample[] {
  const examples: PatternExampleSet = {...patternExampleSets[slug], java: javaPatternStages[slug], go: goPatternStages[slug]};
  return codeLanguages.filter(language => language.id in examples).map(language => ({
    id: language.id, label: language.label,
    fileName: "fileName" in language ? language.fileName : `${slug}.${language.extension}`,
    stages: examples[language.id],
    outputs: (verifiedOutputs[slug] as Record<string,string[]>)[language.id]
  }));
}
