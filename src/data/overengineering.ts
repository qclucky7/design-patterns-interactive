import type {PatternSlug} from "./patterns";

export type OverengineeringEntry = {
  title: string;
  scenario: string;
  excess: string;
  cost: string;
  simpler: string;
  reconsider: string;
};

export type OverengineeringCopy = {
  labels: {heading: string; excess: string; cost: string; simpler: string; reconsider: string};
  patterns: Record<PatternSlug, OverengineeringEntry>;
};
