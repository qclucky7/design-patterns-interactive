import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const bundle = {items: [{price: 10}, {price: 20}]};\nconsole.log(bundle.items.reduce((sum, item) => sum + item.price, 0));",
    "const bundle = {items: [{price: 20}, {items: [{price: 10}]}]};\nlet total = 0;\nfor (const item of bundle.items) {\n  if (\"price\" in item) total += item.price ?? 0;\n  else for (const nested of item.items) total += nested.price;\n}\nconsole.log(total);",
    "interface Component {total(): number;}\nclass Item implements Component {\n  price: number;\n  constructor(price: number) {this.price = price;}\n  total() {return this.price;}\n}\nclass Bundle implements Component {\n  children: Component[];\n  constructor(children: Component[]) {this.children = children;}\n  total(): number {\n    return this.children.reduce((sum, child) => sum + child.total(), 0);\n  }\n}\nconst basket = new Bundle([new Item(10), new Item(20)]);\nconsole.log(basket.total());",
    "interface Component {total(): number;}\nclass Item implements Component {\n  price: number;\n  constructor(price: number) {this.price = price;}\n  total() {return this.price;}\n}\nclass Bundle implements Component {\n  children: Component[];\n  constructor(children: Component[]) {this.children = children;}\n  total(): number {\n    return this.children.reduce((sum, child) => sum + child.total(), 0);\n  }\n}\nconst basket = new Bundle([new Bundle([new Item(10)]), new Item(20)]);\nconsole.log(basket.total());"
  ],
  "python": [
    "bundle = [{\"price\": 10}, {\"price\": 20}]\nprint(sum(item[\"price\"] for item in bundle))",
    "bundle = [{\"price\": 20}, {\"items\": [{\"price\": 10}]}]\ntotal = 0\nfor item in bundle:\n    if \"price\" in item:\n        total += item[\"price\"]\n    else:\n        total += sum(child[\"price\"] for child in item[\"items\"])\nprint(total)",
    "class Item:\n    def __init__(self, price):\n        self.price = price\n    def total(self):\n        return self.price\n\nclass Bundle:\n    def __init__(self, children):\n        self.children = children\n    def total(self):\n        return sum(child.total() for child in self.children)\n\nbasket = Bundle([Item(10), Item(20)])\nprint(basket.total())",
    "class Item:\n    def __init__(self, price):\n        self.price = price\n    def total(self):\n        return self.price\n\nclass Bundle:\n    def __init__(self, children):\n        self.children = children\n    def total(self):\n        return sum(child.total() for child in self.children)\n\nbasket = Bundle([Bundle([Item(10)]), Item(20)])\nprint(basket.total())"
  ],
  "expected": [
    "30",
    "30",
    "30",
    "30"
  ]
} satisfies PatternExampleSet;
