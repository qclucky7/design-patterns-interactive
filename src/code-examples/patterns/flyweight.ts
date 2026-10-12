import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const a = {type: {species: \"oak\", color: \"green\"}, x: 1};\nconst b = {type: {species: \"oak\", color: \"green\"}, x: 2};\nconsole.log(a.type === b.type);",
    "const a = {type: {species: \"oak\", color: \"green\"}, x: 1};\nconst b = {type: {species: \"oak\", color: \"green\"}, x: 2};\nconsole.log(a.type === b.type);\nconst c = {type: {species: \"oak\", color: \"green\"}, x: 3};\nconsole.log(b.type === c.type);",
    "type TreeType = Readonly<{species: string; color: string}>;\nclass TreeTypeFactory {\n  private types = new Map<string, TreeType>();\n  get(species: string, color: string): TreeType {\n    const key = JSON.stringify([species, color]);\n    if (!this.types.has(key)) this.types.set(key, Object.freeze({species, color}));\n    return this.types.get(key)!;\n  }\n}\nconst factory = new TreeTypeFactory();\nconst a = {type: factory.get(\"oak\", \"green\"), x: 1};\nconst b = {type: factory.get(\"oak\", \"green\"), x: 2};\nconsole.log(a.type === b.type);",
    "type TreeType = Readonly<{species: string; color: string}>;\nclass TreeTypeFactory {\n  private types = new Map<string, TreeType>();\n  get(species: string, color: string): TreeType {\n    const key = JSON.stringify([species, color]);\n    if (!this.types.has(key)) this.types.set(key, Object.freeze({species, color}));\n    return this.types.get(key)!;\n  }\n}\nconst factory = new TreeTypeFactory();\nconst a = {type: factory.get(\"oak\", \"green\"), x: 1};\nconst b = {type: factory.get(\"oak\", \"green\"), x: 2};\nconsole.log(a.type === b.type);\nconst c = {type: factory.get(\"oak\", \"green\"), x: 3};\nconsole.log(a.type === c.type);\nconsole.log([a.x,b.x,c.x].join(\",\"));"
  ],
  "python": [
    "a = {\"type\": {\"species\": \"oak\", \"color\": \"green\"}, \"x\": 1}\nb = {\"type\": {\"species\": \"oak\", \"color\": \"green\"}, \"x\": 2}\nprint(a[\"type\"] is b[\"type\"])",
    "a = {\"type\": {\"species\": \"oak\", \"color\": \"green\"}, \"x\": 1}\nb = {\"type\": {\"species\": \"oak\", \"color\": \"green\"}, \"x\": 2}\nprint(a[\"type\"] is b[\"type\"])\nc = {\"type\": {\"species\": \"oak\", \"color\": \"green\"}, \"x\": 3}\nprint(b[\"type\"] is c[\"type\"])",
    "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass TreeType:\n    species: str\n    color: str\n\nclass TreeTypeFactory:\n    def __init__(self):\n        self.types = {}\n    def get(self, species, color):\n        key = (species, color)\n        if key not in self.types:\n            self.types[key] = TreeType(species, color)\n        return self.types[key]\n\nfactory = TreeTypeFactory()\na = {\"type\": factory.get(\"oak\", \"green\"), \"x\": 1}\nb = {\"type\": factory.get(\"oak\", \"green\"), \"x\": 2}\nprint(a[\"type\"] is b[\"type\"])",
    "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass TreeType:\n    species: str\n    color: str\n\nclass TreeTypeFactory:\n    def __init__(self):\n        self.types = {}\n    def get(self, species, color):\n        key = (species, color)\n        if key not in self.types:\n            self.types[key] = TreeType(species, color)\n        return self.types[key]\n\nfactory = TreeTypeFactory()\na = {\"type\": factory.get(\"oak\", \"green\"), \"x\": 1}\nb = {\"type\": factory.get(\"oak\", \"green\"), \"x\": 2}\nprint(a[\"type\"] is b[\"type\"])\nc = {\"type\": factory.get(\"oak\", \"green\"), \"x\": 3}\nprint(a[\"type\"] is c[\"type\"])\nprint(a[\"x\"], b[\"x\"], c[\"x\"])"
  ],
  "expected": [
    "false",
    "false",
    "true",
    "true"
  ]
} satisfies PatternExampleSet;
