"use client";
import {useMemo} from "react";
import {buildCodeExamples} from "@/code-examples/build-examples";
import {StrategyLab} from "./strategy-lab";
import type {SerializableExample} from "@/code-examples/patterns/registry";
import type {PatternLessonContent} from "@/data/lesson-types";
import type {Scene} from "@/data/scenes";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";
import type {NewPatternSlug} from "@/data/lesson-types";
import {PatternPlayground} from "./playgrounds";
import type {DemoCopy} from "./playgrounds/shared";
import {ChevronDownIcon} from "@radix-ui/react-icons";

export function PatternLab({slug, playground, walkthrough, examples, scenes, content, copy}: {slug:NewPatternSlug;playground:DemoCopy;walkthrough:string;examples: SerializableExample[]; scenes: Scene[]; content: PatternLessonContent; copy: typeof strategyMessages.lab}) {
  const codeExamples = useMemo(() => buildCodeExamples(examples), [examples]);
  return <section className="interactive-workbench" id="lab">
    <PatternPlayground slug={slug} copy={playground}/>
    <details className="lesson-walkthrough" open><summary>{walkthrough}<ChevronDownIcon/></summary><StrategyLab compact id={`${slug}-walkthrough`} copy={copy} stages={content.stages} examples={codeExamples} scenes={scenes} labels={content.labels} annotations={content.annotations}/></details>
  </section>;
}
