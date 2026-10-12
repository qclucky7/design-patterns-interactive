import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "class Settings {\n  flags = new Map<string, boolean>();\n}\nconst cart = new Settings();\nconst job = new Settings();\ncart.flags.set(\"sale\", true);\nconsole.log(job.flags.get(\"sale\") ?? false);",
    "class Settings {\n  flags = new Map<string, boolean>();\n}\nconst cart = new Settings();\nconst job = cart;\ncart.flags.set(\"sale\", true);\nconsole.log(job.flags.get(\"sale\") ?? false);",
    "class Settings {\n  static #instance: Settings | undefined;\n  flags = new Map<string, boolean>();\n  private constructor() {}\n  static getInstance() {\n    return this.#instance ??= new Settings();\n  }\n}\nconst cart = Settings.getInstance();\nconst job = Settings.getInstance();\ncart.flags.set(\"sale\", true);\nconsole.log(job.flags.get(\"sale\"));",
    "class Settings {\n  static #instance: Settings | undefined;\n  flags = new Map<string, boolean>();\n  private constructor() {}\n  static getInstance() {\n    return this.#instance ??= new Settings();\n  }\n}\nconst cart = Settings.getInstance();\nconst job = Settings.getInstance();\ncart.flags.set(\"sale\", true);\nconsole.log(job.flags.get(\"sale\"));\nconsole.log(cart === job);"
  ],
  "python": [
    "class Settings:\n    def __init__(self):\n        self.flags = {}\n\ncart = Settings()\njob = Settings()\ncart.flags[\"sale\"] = True\nprint(job.flags.get(\"sale\", False))",
    "class Settings:\n    def __init__(self):\n        self.flags = {}\n\ncart = Settings()\njob = cart\ncart.flags[\"sale\"] = True\nprint(job.flags.get(\"sale\", False))",
    "class Settings:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n            cls._instance.flags = {}\n        return cls._instance\n\n    @classmethod\n    def get_instance(cls):\n        return cls()\n\ncart = Settings.get_instance()\njob = Settings.get_instance()\ncart.flags[\"sale\"] = True\nprint(job.flags.get(\"sale\"))",
    "class Settings:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n            cls._instance.flags = {}\n        return cls._instance\n\n    @classmethod\n    def get_instance(cls):\n        return cls()\n\ncart = Settings.get_instance()\njob = Settings.get_instance()\ncart.flags[\"sale\"] = True\nprint(job.flags.get(\"sale\"))\nprint(cart is job)"
  ],
  "expected": [
    "false",
    "true",
    "true",
    "true"
  ]
} satisfies PatternExampleSet;
