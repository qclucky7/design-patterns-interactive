import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "class Database {connect() {return \"db\";}}\nclass Cache {start() {return \"cache\";}}\nclass Logger {open() {return \"log\";}}\nconst db = new Database(), cache = new Cache(), log = new Logger();\nconsole.log([db.connect(), cache.start(), log.open()].join(\">\"));",
    "class Database {connect() {return \"db\";}}\nclass Cache {start() {return \"cache\";}}\nclass Logger {open() {return \"log\";}}\nconst db = new Database(), cache = new Cache(), log = new Logger();\nconsole.log([db.connect(), cache.start(), log.open()].join(\">\"));\nconsole.log([db.connect(), cache.start(), log.open()].join(\">\"));",
    "class Database {connect() {return \"db\";}}\nclass Cache {start() {return \"cache\";}}\nclass Logger {open() {return \"log\";}}\nclass StartupFacade {\n  private db = new Database();\n  private cache = new Cache();\n  private log = new Logger();\n  start() {\n    return [this.db.connect(), this.cache.start(), this.log.open()].join(\">\");\n  }\n}\nconsole.log(new StartupFacade().start());",
    "class Database {connect() {return \"db\";}}\nclass Cache {start() {return \"cache\";}}\nclass Logger {open() {return \"log\";}}\nclass StartupFacade {\n  private db = new Database();\n  private cache = new Cache();\n  private log = new Logger();\n  start() {\n    const valid = true;\n    if (!valid) throw new Error(\"invalid settings\");\n    return [\"validated\", this.db.connect(), this.cache.start(), this.log.open()].join(\">\");\n  }\n}\nconsole.log(new StartupFacade().start());"
  ],
  "python": [
    "class Database:\n    def connect(self):\n        return \"db\"\n\nclass Cache:\n    def start(self):\n        return \"cache\"\n\nclass Logger:\n    def open(self):\n        return \"log\"\n\ndb, cache, log = Database(), Cache(), Logger()\nprint(\">\".join([db.connect(), cache.start(), log.open()]))",
    "class Database:\n    def connect(self):\n        return \"db\"\n\nclass Cache:\n    def start(self):\n        return \"cache\"\n\nclass Logger:\n    def open(self):\n        return \"log\"\n\ndb, cache, log = Database(), Cache(), Logger()\nprint(\">\".join([db.connect(), cache.start(), log.open()]))\nprint(\">\".join([db.connect(), cache.start(), log.open()]))",
    "class Database:\n    def connect(self):\n        return \"db\"\n\nclass Cache:\n    def start(self):\n        return \"cache\"\n\nclass Logger:\n    def open(self):\n        return \"log\"\n\nclass StartupFacade:\n    def __init__(self):\n        self.db, self.cache, self.log = Database(), Cache(), Logger()\n    def start(self):\n        return \">\".join([self.db.connect(), self.cache.start(), self.log.open()])\n\nprint(StartupFacade().start())",
    "class Database:\n    def connect(self):\n        return \"db\"\n\nclass Cache:\n    def start(self):\n        return \"cache\"\n\nclass Logger:\n    def open(self):\n        return \"log\"\n\nclass StartupFacade:\n    def __init__(self):\n        self.db, self.cache, self.log = Database(), Cache(), Logger()\n    def start(self):\n        valid = True\n        if not valid:\n            raise ValueError(\"invalid settings\")\n        return \">\".join([\"validated\", self.db.connect(), self.cache.start(), self.log.open()])\n\nprint(StartupFacade().start())"
  ],
  "expected": [
    "db>cache>log",
    "db>cache>log",
    "db>cache>log",
    "validated>db>cache>log"
  ]
} satisfies PatternExampleSet;
