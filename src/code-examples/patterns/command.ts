import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const editor = {text: \"A\"};\neditor.text += \"B\";\nconsole.log(editor.text);",
    "const editor = {text: \"A\"};\nconst previous = editor.text;\neditor.text += \"B\";\neditor.text = previous;\nconsole.log(editor.text);",
    "class Editor {text = \"A\";}\ninterface Command {execute(): void; undo(): void;}\nclass InsertCommand implements Command {\n  editor: Editor; value: string; previous = \"\";\n  constructor(editor: Editor, value: string) {this.editor = editor; this.value = value;}\n  execute() {this.previous = this.editor.text; this.editor.text += this.value;}\n  undo() {this.editor.text = this.previous;}\n}\nconst editor = new Editor();\nconst history: Command[] = [];\nconst command = new InsertCommand(editor, \"B\");\ncommand.execute();\nhistory.push(command);\nconsole.log(editor.text);",
    "class Editor {text = \"A\";}\ninterface Command {execute(): void; undo(): void;}\nclass InsertCommand implements Command {\n  editor: Editor; value: string; previous = \"\";\n  constructor(editor: Editor, value: string) {this.editor = editor; this.value = value;}\n  execute() {this.previous = this.editor.text; this.editor.text += this.value;}\n  undo() {this.editor.text = this.previous;}\n}\nconst editor = new Editor();\nconst history: Command[] = [];\nconst command = new InsertCommand(editor, \"B\");\ncommand.execute();\nhistory.push(command);\nconsole.log(editor.text);\nhistory.pop()?.undo();\nconsole.log(editor.text);"
  ],
  "python": [
    "editor = {\"text\": \"A\"}\neditor[\"text\"] += \"B\"\nprint(editor[\"text\"])",
    "editor = {\"text\": \"A\"}\nprevious = editor[\"text\"]\neditor[\"text\"] += \"B\"\neditor[\"text\"] = previous\nprint(editor[\"text\"])",
    "class Editor:\n    def __init__(self):\n        self.text = \"A\"\n\nclass InsertCommand:\n    def __init__(self, editor, value):\n        self.editor, self.value, self.previous = editor, value, \"\"\n    def execute(self):\n        self.previous = self.editor.text\n        self.editor.text += self.value\n    def undo(self):\n        self.editor.text = self.previous\n\neditor = Editor()\nhistory = []\ncommand = InsertCommand(editor, \"B\")\ncommand.execute()\nhistory.append(command)\nprint(editor.text)",
    "class Editor:\n    def __init__(self):\n        self.text = \"A\"\n\nclass InsertCommand:\n    def __init__(self, editor, value):\n        self.editor, self.value, self.previous = editor, value, \"\"\n    def execute(self):\n        self.previous = self.editor.text\n        self.editor.text += self.value\n    def undo(self):\n        self.editor.text = self.previous\n\neditor = Editor()\nhistory = []\ncommand = InsertCommand(editor, \"B\")\ncommand.execute()\nhistory.append(command)\nprint(editor.text)\nhistory.pop().undo()\nprint(editor.text)"
  ],
  "expected": [
    "AB",
    "A",
    "AB",
    "A"
  ]
} satisfies PatternExampleSet;
