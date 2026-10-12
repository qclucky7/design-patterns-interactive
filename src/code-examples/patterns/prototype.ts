import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const template = {title: \"Welcome\", tags: [\"base\"]};\nconst copy = {...template};\nconsole.log(copy.tags === template.tags);",
    "const template = {title: \"Welcome\", tags: [\"base\"]};\nconst copy = {...template};\nconsole.log(copy.tags === template.tags);\ncopy.tags.push(\"new\");\nconsole.log(template.tags.join(\",\"));",
    "class Card {\n  title: string;\n  tags: string[];\n  constructor(title: string, tags: string[]) {\n    this.title = title; this.tags = tags;\n  }\n  clone() {return new Card(this.title, [...this.tags]);}\n}\nconst template = new Card(\"Welcome\", [\"base\"]);\nconst copy = template.clone();\nconsole.log(copy.tags === template.tags);",
    "class Card {\n  title: string;\n  tags: string[];\n  constructor(title: string, tags: string[]) {\n    this.title = title; this.tags = tags;\n  }\n  clone() {return new Card(this.title, [...this.tags]);}\n}\nconst template = new Card(\"Welcome\", [\"base\"]);\nconst copy = template.clone();\nconsole.log(copy.tags === template.tags);\ncopy.tags.push(\"new\");\nconsole.log(template.tags.join(\",\"));\nconsole.log(copy.tags.join(\",\"));"
  ],
  "python": [
    "template = {\"title\": \"Welcome\", \"tags\": [\"base\"]}\ncopy = dict(template)\nprint(copy[\"tags\"] is template[\"tags\"])",
    "template = {\"title\": \"Welcome\", \"tags\": [\"base\"]}\ncopy = dict(template)\nprint(copy[\"tags\"] is template[\"tags\"])\ncopy[\"tags\"].append(\"new\")\nprint(\",\".join(template[\"tags\"]))",
    "class Card:\n    def __init__(self, title, tags):\n        self.title = title\n        self.tags = tags\n    def clone(self):\n        return Card(self.title, list(self.tags))\n\ntemplate = Card(\"Welcome\", [\"base\"])\ncopy = template.clone()\nprint(copy.tags is template.tags)",
    "class Card:\n    def __init__(self, title, tags):\n        self.title = title\n        self.tags = tags\n    def clone(self):\n        return Card(self.title, list(self.tags))\n\ntemplate = Card(\"Welcome\", [\"base\"])\ncopy = template.clone()\nprint(copy.tags is template.tags)\ncopy.tags.append(\"new\")\nprint(\",\".join(template.tags))\nprint(\",\".join(copy.tags))"
  ],
  "expected": [
    "true",
    "base,new",
    "false",
    "base"
  ]
} satisfies PatternExampleSet;
