import type {PatternSlug} from "./patterns";
export type NewPatternSlug = Exclude<PatternSlug, "strategy">;
export type LessonStage = {number: string; label: string; title: string; description: string; insight: string; action: string; graphNote: string; codeNote: string};
export type PatternLessonContent = {
  scenario: string; request: string; problem: string; solution: string;
  benefits: [string, string, string]; when: string; avoid: string; tradeoff: string; remember: string;
  principleTitle: string; keyIdeas: string[]; distinction: string;
  stages: [LessonStage, LessonStage, LessonStage, LessonStage];
  labels: Record<string, string>;
  annotations: [Record<string,string>,Record<string,string>,Record<string,string>,Record<string,string>];
};
export type LessonCollection = Record<NewPatternSlug, PatternLessonContent>;
export type PatternReadingContent = Omit<PatternLessonContent, "stages" | "labels" | "annotations" | "benefits"> & {benefits: string[]};
