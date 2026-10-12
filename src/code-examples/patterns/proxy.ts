import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "let loads = 0;\nclass RealImage {\n  constructor() {loads++;}\n  display() {return \"image\";}\n}\nconst image = new RealImage();\nconsole.log(image.display());\nconsole.log(\"loads:\" + loads);",
    "let loads = 0;\nclass RealImage {\n  constructor() {loads++;}\n  display() {return \"image\";}\n}\nconst image = new RealImage();\n\nconsole.log(\"loads:\" + loads);",
    "let loads = 0;\ninterface ImageView {display(): string;}\nclass RealImage implements ImageView {\n  constructor() {loads++;}\n  display() {return \"image\";}\n}\nclass ImageProxy implements ImageView {\n  private real: RealImage | undefined;\n  display() {\n    this.real ??= new RealImage();\n    return this.real.display();\n  }\n}\nconst image = new ImageProxy();\nconsole.log(\"loads:\" + loads);",
    "let loads = 0;\ninterface ImageView {display(): string;}\nclass RealImage implements ImageView {\n  constructor() {loads++;}\n  display() {return \"image\";}\n}\nclass ImageProxy implements ImageView {\n  private real: RealImage | undefined;\n  display() {\n    this.real ??= new RealImage();\n    return this.real.display();\n  }\n}\nconst image = new ImageProxy();\nconsole.log(\"loads:\" + loads);\nconsole.log(image.display(), image.display());\nconsole.log(\"loads:\" + loads);"
  ],
  "python": [
    "loads = 0\n\nclass RealImage:\n    def __init__(self):\n        global loads\n        loads += 1\n    def display(self):\n        return \"image\"\n\nimage = RealImage()\nprint(image.display())\nprint(f\"loads:{loads}\")",
    "loads = 0\n\nclass RealImage:\n    def __init__(self):\n        global loads\n        loads += 1\n    def display(self):\n        return \"image\"\n\nimage = RealImage()\n\nprint(f\"loads:{loads}\")",
    "loads = 0\n\nclass RealImage:\n    def __init__(self):\n        global loads\n        loads += 1\n    def display(self):\n        return \"image\"\n\nclass ImageProxy:\n    def __init__(self):\n        self.real = None\n    def display(self):\n        if self.real is None:\n            self.real = RealImage()\n        return self.real.display()\n\nimage = ImageProxy()\nprint(f\"loads:{loads}\")",
    "loads = 0\n\nclass RealImage:\n    def __init__(self):\n        global loads\n        loads += 1\n    def display(self):\n        return \"image\"\n\nclass ImageProxy:\n    def __init__(self):\n        self.real = None\n    def display(self):\n        if self.real is None:\n            self.real = RealImage()\n        return self.real.display()\n\nimage = ImageProxy()\nprint(f\"loads:{loads}\")\nprint(image.display(), image.display())\nprint(f\"loads:{loads}\")"
  ],
  "expected": [
    "loads:1",
    "loads:1",
    "loads:0",
    "loads:1"
  ]
} satisfies PatternExampleSet;
