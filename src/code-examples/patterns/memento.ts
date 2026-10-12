import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const editor = {text: \"A\", cursor: 1};\nconst history = {...editor};\nconsole.log(history.text + \":\" + history.cursor);",
    "const editor = {text: \"A\", cursor: 1};\nconst history = {...editor};\nconsole.log(history.text + \":\" + history.cursor);\neditor.text = \"ABC\"; editor.cursor = 3;\nObject.assign(editor, history);\nconsole.log(editor.text + \":\" + editor.cursor);",
    "type Snapshot = Readonly<{restore(): void}>;\nclass Editor {\n  #text = \"A\"; #cursor = 1;\n  edit(text: string) {this.#text = text; this.#cursor = text.length;}\n  view() {return this.#text + \":\" + this.#cursor;}\n  save(): Snapshot {\n    const text = this.#text, cursor = this.#cursor;\n    return Object.freeze({restore: () => {this.#text = text; this.#cursor = cursor;}});\n  }\n  restore(snapshot: Snapshot) {snapshot.restore();}\n}\nconst editor = new Editor();\nconst history = [editor.save()];\neditor.edit(\"ABC\");\nconsole.log(editor.view());",
    "type Snapshot = Readonly<{restore(): void}>;\nclass Editor {\n  #text = \"A\"; #cursor = 1;\n  edit(text: string) {this.#text = text; this.#cursor = text.length;}\n  view() {return this.#text + \":\" + this.#cursor;}\n  save(): Snapshot {\n    const text = this.#text, cursor = this.#cursor;\n    return Object.freeze({restore: () => {this.#text = text; this.#cursor = cursor;}});\n  }\n  restore(snapshot: Snapshot) {snapshot.restore();}\n}\nconst editor = new Editor();\nconst history = [editor.save()];\neditor.edit(\"ABC\");\nconsole.log(editor.view());\neditor.restore(history.pop()!);\nconsole.log(editor.view());"
  ],
  "python": [
    "editor = {\"text\": \"A\", \"cursor\": 1}\nhistory = dict(editor)\nprint(f'{history[\"text\"]}:{history[\"cursor\"]}')",
    "editor = {\"text\": \"A\", \"cursor\": 1}\nhistory = dict(editor)\nprint(f'{history[\"text\"]}:{history[\"cursor\"]}')\neditor.update(text=\"ABC\", cursor=3)\neditor.update(history)\nprint(f'{editor[\"text\"]}:{editor[\"cursor\"]}')",
    "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Snapshot:\n    _text: str\n    _cursor: int\n\nclass Editor:\n    def __init__(self):\n        self._text, self._cursor = \"A\", 1\n    def edit(self, text):\n        self._text, self._cursor = text, len(text)\n    def view(self):\n        return f\"{self._text}:{self._cursor}\"\n    def save(self):\n        return Snapshot(self._text, self._cursor)\n    def restore(self, snapshot):\n        self._text, self._cursor = snapshot._text, snapshot._cursor\n\neditor = Editor()\nhistory = [editor.save()]\neditor.edit(\"ABC\")\nprint(editor.view())",
    "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Snapshot:\n    _text: str\n    _cursor: int\n\nclass Editor:\n    def __init__(self):\n        self._text, self._cursor = \"A\", 1\n    def edit(self, text):\n        self._text, self._cursor = text, len(text)\n    def view(self):\n        return f\"{self._text}:{self._cursor}\"\n    def save(self):\n        return Snapshot(self._text, self._cursor)\n    def restore(self, snapshot):\n        self._text, self._cursor = snapshot._text, snapshot._cursor\n\neditor = Editor()\nhistory = [editor.save()]\neditor.edit(\"ABC\")\nprint(editor.view())\neditor.restore(history.pop())\nprint(editor.view())"
  ],
  "expected": [
    "A:1",
    "A:1",
    "ABC:3",
    "A:1"
  ]
} satisfies PatternExampleSet;
