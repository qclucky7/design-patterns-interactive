import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "class PlainCoffee {cost() {return 5;}}\nconsole.log(new PlainCoffee().cost());",
    "class PlainCoffee {cost() {return 5;}}\nclass MilkCoffee extends PlainCoffee {cost() {return super.cost() + 2;}}\nclass MilkSugarCoffee extends MilkCoffee {cost() {return super.cost() + 1;}}\nconsole.log(new MilkSugarCoffee().cost());",
    "interface Coffee {cost(): number;}\nclass PlainCoffee implements Coffee {cost() {return 5;}}\nclass Milk implements Coffee {\n  wrapped: Coffee;\n  constructor(wrapped: Coffee) {this.wrapped = wrapped;}\n  cost() {return this.wrapped.cost() + 2;}\n}\nclass Sugar implements Coffee {\n  wrapped: Coffee;\n  constructor(wrapped: Coffee) {this.wrapped = wrapped;}\n  cost() {return this.wrapped.cost() + 1;}\n}\nconsole.log(new Milk(new PlainCoffee()).cost());",
    "interface Coffee {cost(): number;}\nclass PlainCoffee implements Coffee {cost() {return 5;}}\nclass Milk implements Coffee {\n  wrapped: Coffee;\n  constructor(wrapped: Coffee) {this.wrapped = wrapped;}\n  cost() {return this.wrapped.cost() + 2;}\n}\nclass Sugar implements Coffee {\n  wrapped: Coffee;\n  constructor(wrapped: Coffee) {this.wrapped = wrapped;}\n  cost() {return this.wrapped.cost() + 1;}\n}\nconsole.log(new Sugar(new Milk(new PlainCoffee())).cost());"
  ],
  "python": [
    "class PlainCoffee:\n    def cost(self):\n        return 5\n\nprint(PlainCoffee().cost())",
    "class PlainCoffee:\n    def cost(self):\n        return 5\n\nclass MilkCoffee(PlainCoffee):\n    def cost(self):\n        return super().cost() + 2\n\nclass MilkSugarCoffee(MilkCoffee):\n    def cost(self):\n        return super().cost() + 1\n\nprint(MilkSugarCoffee().cost())",
    "class PlainCoffee:\n    def cost(self):\n        return 5\n\nclass Milk:\n    def __init__(self, wrapped):\n        self.wrapped = wrapped\n    def cost(self):\n        return self.wrapped.cost() + 2\n\nclass Sugar:\n    def __init__(self, wrapped):\n        self.wrapped = wrapped\n    def cost(self):\n        return self.wrapped.cost() + 1\n\nprint(Milk(PlainCoffee()).cost())",
    "class PlainCoffee:\n    def cost(self):\n        return 5\n\nclass Milk:\n    def __init__(self, wrapped):\n        self.wrapped = wrapped\n    def cost(self):\n        return self.wrapped.cost() + 2\n\nclass Sugar:\n    def __init__(self, wrapped):\n        self.wrapped = wrapped\n    def cost(self):\n        return self.wrapped.cost() + 1\n\nprint(Sugar(Milk(PlainCoffee())).cost())"
  ],
  "expected": [
    "5",
    "8",
    "7",
    "8"
  ]
} satisfies PatternExampleSet;
