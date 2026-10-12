import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "function setStock(value: number) {console.log(\"display:\" + value);}\nsetStock(3);",
    "function setStock(value: number) {\n  console.log(\"display:\" + value);\n  console.log(\"email:\" + value);\n}\nsetStock(3);",
    "type Listener = (value: number) => void;\nclass Stock {\n  private listeners = new Set<Listener>();\n  subscribe(listener: Listener) {\n    this.listeners.add(listener);\n    return () => this.listeners.delete(listener);\n  }\n  set(value: number) {\n    for (const listener of [...this.listeners]) listener(value);\n  }\n}\nconst stock = new Stock();\nconst unsubscribe = stock.subscribe(value => console.log(\"display:\" + value));\nstock.subscribe(value => console.log(\"email:\" + value));\nstock.set(3);",
    "type Listener = (value: number) => void;\nclass Stock {\n  private listeners = new Set<Listener>();\n  subscribe(listener: Listener) {\n    this.listeners.add(listener);\n    return () => this.listeners.delete(listener);\n  }\n  set(value: number) {\n    for (const listener of [...this.listeners]) listener(value);\n  }\n}\nconst stock = new Stock();\nconst unsubscribe = stock.subscribe(value => console.log(\"display:\" + value));\nstock.subscribe(value => console.log(\"email:\" + value));\nunsubscribe();\nstock.set(5);"
  ],
  "python": [
    "def set_stock(value):\n    print(f\"display:{value}\")\n\nset_stock(3)",
    "def set_stock(value):\n    print(f\"display:{value}\")\n    print(f\"email:{value}\")\n\nset_stock(3)",
    "class Stock:\n    def __init__(self):\n        self.listeners = []\n    def subscribe(self, listener):\n        self.listeners.append(listener)\n        def unsubscribe():\n            if listener in self.listeners:\n                self.listeners.remove(listener)\n        return unsubscribe\n    def set(self, value):\n        for listener in list(self.listeners):\n            listener(value)\n\nstock = Stock()\nunsubscribe = stock.subscribe(lambda value: print(f\"display:{value}\"))\nstock.subscribe(lambda value: print(f\"email:{value}\"))\nstock.set(3)",
    "class Stock:\n    def __init__(self):\n        self.listeners = []\n    def subscribe(self, listener):\n        self.listeners.append(listener)\n        def unsubscribe():\n            if listener in self.listeners:\n                self.listeners.remove(listener)\n        return unsubscribe\n    def set(self, value):\n        for listener in list(self.listeners):\n            listener(value)\n\nstock = Stock()\nunsubscribe = stock.subscribe(lambda value: print(f\"display:{value}\"))\nstock.subscribe(lambda value: print(f\"email:{value}\"))\nunsubscribe()\nstock.set(5)"
  ],
  "expected": [
    "display:3",
    "email:3",
    "email:3",
    "email:5"
  ]
} satisfies PatternExampleSet;
