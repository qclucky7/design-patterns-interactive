"use client";
import {useMemo} from "react";
import {StrategyLab} from "./strategy-lab";
import {buildCodeExamples} from "@/code-examples/build-examples";
import type {SerializableExample} from "@/code-examples/patterns/registry";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";

export function StrategyCodeLab({examples, copy, stages}: {examples: SerializableExample[]; copy: typeof strategyMessages.lab; stages: typeof strategyMessages.stages}) {
  const codeExamples = useMemo(() => buildCodeExamples(examples), [examples]);
  return <StrategyLab examples={codeExamples} copy={copy} stages={stages} />;
}
