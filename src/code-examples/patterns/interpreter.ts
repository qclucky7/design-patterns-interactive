import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const context = {age: 21, member: true};\nconsole.log(context.age > 18);",
    "const context = {age: 21, member: true};\nconsole.log(context.age > 18 && context.member);",
    "type Context = {age: number; member: boolean};\ninterface Expression {interpret(context: Context): boolean;}\nclass Adult implements Expression {\n  interpret(context: Context) {return context.age > 18;}\n}\nclass Member implements Expression {\n  interpret(context: Context) {return context.member;}\n}\nclass And implements Expression {\n  left: Expression; right: Expression;\n  constructor(left: Expression, right: Expression) {this.left = left; this.right = right;}\n  interpret(context: Context) {\n    return this.left.interpret(context) && this.right.interpret(context);\n  }\n}\nconst context = {age: 21, member: true};\nconsole.log(new Adult().interpret(context));",
    "type Context = {age: number; member: boolean};\ninterface Expression {interpret(context: Context): boolean;}\nclass Adult implements Expression {\n  interpret(context: Context) {return context.age > 18;}\n}\nclass Member implements Expression {\n  interpret(context: Context) {return context.member;}\n}\nclass And implements Expression {\n  left: Expression; right: Expression;\n  constructor(left: Expression, right: Expression) {this.left = left; this.right = right;}\n  interpret(context: Context) {\n    return this.left.interpret(context) && this.right.interpret(context);\n  }\n}\nconst context = {age: 21, member: true};\nconsole.log(new And(new Adult(), new Member()).interpret(context));"
  ],
  "python": [
    "context = {\"age\": 21, \"member\": True}\nprint(context[\"age\"] > 18)",
    "context = {\"age\": 21, \"member\": True}\nprint(context[\"age\"] > 18 and context[\"member\"])",
    "class Adult:\n    def interpret(self, context):\n        return context[\"age\"] > 18\n\nclass Member:\n    def interpret(self, context):\n        return context[\"member\"]\n\nclass And:\n    def __init__(self, left, right):\n        self.left, self.right = left, right\n    def interpret(self, context):\n        return self.left.interpret(context) and self.right.interpret(context)\n\ncontext = {\"age\": 21, \"member\": True}\nprint(Adult().interpret(context))",
    "class Adult:\n    def interpret(self, context):\n        return context[\"age\"] > 18\n\nclass Member:\n    def interpret(self, context):\n        return context[\"member\"]\n\nclass And:\n    def __init__(self, left, right):\n        self.left, self.right = left, right\n    def interpret(self, context):\n        return self.left.interpret(context) and self.right.interpret(context)\n\ncontext = {\"age\": 21, \"member\": True}\nprint(And(Adult(), Member()).interpret(context))"
  ],
  "expected": [
    "true",
    "true",
    "true",
    "true"
  ]
} satisfies PatternExampleSet;
