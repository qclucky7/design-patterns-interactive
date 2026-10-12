import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "function handle(amount: number) {\n  if (amount <= 100) return \"agent\";\n  if (amount <= 1000) return \"supervisor\";\n  return \"unhandled\";\n}\nconsole.log(handle(800));",
    "function handle(amount: number) {\n  if (amount <= 100) return \"agent\";\n  if (amount <= 1000) return \"supervisor\";\n  if (amount <= 5000) return \"manager\";\n  return \"unhandled\";\n}\nconsole.log(handle(3000));",
    "class Handler {\n  name: string; limit: number; next: Handler | undefined;\n  constructor(name: string, limit: number) {this.name = name; this.limit = limit;}\n  setNext(next: Handler) {this.next = next; return next;}\n  handle(amount: number): string {\n    if (amount <= this.limit) return this.name;\n    return this.next?.handle(amount) ?? \"unhandled\";\n  }\n}\nconst agent = new Handler(\"agent\", 100);\nconst supervisor = new Handler(\"supervisor\", 1000);\nagent.setNext(supervisor);\nconsole.log(agent.handle(800));",
    "class Handler {\n  name: string; limit: number; next: Handler | undefined;\n  constructor(name: string, limit: number) {this.name = name; this.limit = limit;}\n  setNext(next: Handler) {this.next = next; return next;}\n  handle(amount: number): string {\n    if (amount <= this.limit) return this.name;\n    return this.next?.handle(amount) ?? \"unhandled\";\n  }\n}\nconst agent = new Handler(\"agent\", 100);\nconst supervisor = new Handler(\"supervisor\", 1000);\nagent.setNext(supervisor);\nsupervisor.setNext(new Handler(\"manager\", 5000));\nconsole.log(agent.handle(3000));"
  ],
  "python": [
    "def handle(amount):\n    if amount <= 100:\n        return \"agent\"\n    if amount <= 1000:\n        return \"supervisor\"\n    return \"unhandled\"\n\nprint(handle(800))",
    "def handle(amount):\n    if amount <= 100:\n        return \"agent\"\n    if amount <= 1000:\n        return \"supervisor\"\n    if amount <= 5000:\n        return \"manager\"\n    return \"unhandled\"\n\nprint(handle(3000))",
    "class Handler:\n    def __init__(self, name, limit):\n        self.name, self.limit, self.next = name, limit, None\n    def set_next(self, next_handler):\n        self.next = next_handler\n        return next_handler\n    def handle(self, amount):\n        if amount <= self.limit:\n            return self.name\n        return self.next.handle(amount) if self.next else \"unhandled\"\n\nagent = Handler(\"agent\", 100)\nsupervisor = Handler(\"supervisor\", 1000)\nagent.set_next(supervisor)\nprint(agent.handle(800))",
    "class Handler:\n    def __init__(self, name, limit):\n        self.name, self.limit, self.next = name, limit, None\n    def set_next(self, next_handler):\n        self.next = next_handler\n        return next_handler\n    def handle(self, amount):\n        if amount <= self.limit:\n            return self.name\n        return self.next.handle(amount) if self.next else \"unhandled\"\n\nagent = Handler(\"agent\", 100)\nsupervisor = Handler(\"supervisor\", 1000)\nagent.set_next(supervisor)\nsupervisor.set_next(Handler(\"manager\", 5000))\nprint(agent.handle(3000))"
  ],
  "expected": [
    "supervisor",
    "manager",
    "supervisor",
    "manager"
  ]
} satisfies PatternExampleSet;
