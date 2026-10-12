export const categories = ["creational", "structural", "behavioral"] as const;
export type Category = (typeof categories)[number];

const patternDefinitions = [
  {slug: "singleton", category: "creational", related: ["prototype", "abstract-factory"]},
  {slug: "factory-method", category: "creational", related: ["abstract-factory", "template-method"]},
  {slug: "abstract-factory", category: "creational", related: ["factory-method", "bridge"]},
  {slug: "builder", category: "creational", related: ["abstract-factory", "prototype"]},
  {slug: "prototype", category: "creational", related: ["builder", "singleton"]},
  {slug: "adapter", category: "structural", related: ["bridge", "facade"]},
  {slug: "bridge", category: "structural", related: ["adapter", "strategy"]},
  {slug: "composite", category: "structural", related: ["decorator", "visitor"]},
  {slug: "decorator", category: "structural", related: ["proxy", "composite"]},
  {slug: "facade", category: "structural", related: ["adapter", "mediator"]},
  {slug: "flyweight", category: "structural", related: ["singleton", "prototype"]},
  {slug: "proxy", category: "structural", related: ["decorator", "facade"]},
  {slug: "chain-of-responsibility", category: "behavioral", related: ["command", "decorator"]},
  {slug: "command", category: "behavioral", related: ["memento", "strategy"]},
  {slug: "interpreter", category: "behavioral", related: ["composite", "visitor"]},
  {slug: "iterator", category: "behavioral", related: ["composite", "visitor"]},
  {slug: "mediator", category: "behavioral", related: ["observer", "facade"]},
  {slug: "memento", category: "behavioral", related: ["command", "prototype"]},
  {slug: "observer", category: "behavioral", related: ["mediator", "chain-of-responsibility"]},
  {slug: "state", category: "behavioral", related: ["strategy", "command"]},
  {slug: "strategy", category: "behavioral", related: ["state", "template-method"]},
  {slug: "template-method", category: "behavioral", related: ["strategy", "factory-method"]},
  {slug: "visitor", category: "behavioral", related: ["composite", "iterator"]}
] as const satisfies readonly {slug: string; category: Category; related: readonly string[]}[];

// The directory supplies the icon; views do not maintain a second slug-to-icon map.
// Add public/icons/patterns/<slug>.svg when registering another pattern.
export const patterns = patternDefinitions.map(pattern => ({
  ...pattern,
  icon: `/icons/patterns/${pattern.slug}.svg`,
}));

export type PatternSlug = (typeof patterns)[number]["slug"];
export function findPattern(slug: string) {return patterns.find((pattern) => pattern.slug === slug);}

// Availability is independent of the directory: publish a lesson here when it is ready.
export const availablePatterns: readonly PatternSlug[] = patterns.map(pattern => pattern.slug);
export function isPatternAvailable(slug: PatternSlug) {return availablePatterns.includes(slug);}
