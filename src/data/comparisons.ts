import type {Category, PatternSlug} from "./patterns";

const definitions = [
  {slug: "strategy-state", group: "behavioral", patterns: ["strategy", "state"]},
  {slug: "factory-method-abstract-factory", group: "creational", patterns: ["factory-method", "abstract-factory"]},
  {slug: "builder-factory-method", group: "creational", patterns: ["builder", "factory-method"]},
  {slug: "adapter-bridge", group: "structural", patterns: ["adapter", "bridge"]},
  {slug: "adapter-facade", group: "structural", patterns: ["adapter", "facade"]},
  {slug: "decorator-proxy", group: "structural", patterns: ["decorator", "proxy"]},
  {slug: "composite-decorator", group: "structural", patterns: ["composite", "decorator"]},
  {slug: "observer-mediator", group: "behavioral", patterns: ["observer", "mediator"]},
  {slug: "strategy-template-method", group: "behavioral", patterns: ["strategy", "template-method"]},
  {slug: "command-strategy", group: "behavioral", patterns: ["command", "strategy"]}
] as const satisfies readonly {slug: string; group: Category; patterns: readonly [PatternSlug, PatternSlug]}[];

export const comparisons = definitions;
export type Comparison = typeof comparisons[number];
export type ComparisonSlug = Comparison["slug"];
export function findComparison(slug: string) {return comparisons.find(pair => pair.slug === slug);}
export function comparisonsForPattern(slug: PatternSlug) {return comparisons.filter(pair => pair.patterns.some(pattern => pattern === slug));}

export type DemoState = {name: string; result: string; paths: string[][]; actions: {label: string; target: number}[]};
export type ComparisonEntry = {
  title: string; question: string; summary: string; scenario: string;
  sides: {intent: string; guide: string; states: DemoState[]}[];
  differences: {dimension: string; left: string; right: string}[];
  coexist: string;
  quizzes: {question: string; answer: number; explanation: string}[];
};
export type ComparisonMessages = {
  title: string; description: string; search: string; empty: string; menu: string; close: string;
  labels: {scenario: string; experiment: string; reset: string; differences: string; coexist: string; quiz: string; correct: string; retry: string; code: string; codeNote: string; lesson: string; result: string; diagramNote: string; language: string; directory: string; all: string};
  groups: Record<Category, {name: string; description: string}>;
  entries: Record<ComparisonSlug, ComparisonEntry>;
};
export type ComparisonDirectoryCopy = Pick<ComparisonMessages, "title" | "search" | "empty" | "menu" | "close" | "groups"> & {entries: Record<ComparisonSlug, {title: string; keywords: string}>};
