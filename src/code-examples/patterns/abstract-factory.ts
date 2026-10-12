import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "const button = {theme: \"light\", render: () => \"light button\"};\nconst checkbox = {theme: \"light\", render: () => \"light checkbox\"};\nconsole.log(button.render() + \" / \" + checkbox.render());",
    "const button = {theme: \"dark\", render: () => \"dark button\"};\nconst checkbox = {theme: \"light\", render: () => \"light checkbox\"};\nconsole.log(button.render() + \" / \" + checkbox.render());",
    "interface Widget {render(): string;}\ninterface ThemeFactory {\n  createButton(): Widget;\n  createCheckbox(): Widget;\n}\nclass LightFactory implements ThemeFactory {\n  createButton() {return {render: () => \"light button\"};}\n  createCheckbox() {return {render: () => \"light checkbox\"};}\n}\nclass DarkFactory implements ThemeFactory {\n  createButton() {return {render: () => \"dark button\"};}\n  createCheckbox() {return {render: () => \"dark checkbox\"};}\n}\nfunction renderPage(factory: ThemeFactory) {\n  return factory.createButton().render() + \" / \" +\n    factory.createCheckbox().render();\n}\nconsole.log(renderPage(new LightFactory()));",
    "interface Widget {render(): string;}\ninterface ThemeFactory {\n  createButton(): Widget;\n  createCheckbox(): Widget;\n}\nclass LightFactory implements ThemeFactory {\n  createButton() {return {render: () => \"light button\"};}\n  createCheckbox() {return {render: () => \"light checkbox\"};}\n}\nclass DarkFactory implements ThemeFactory {\n  createButton() {return {render: () => \"dark button\"};}\n  createCheckbox() {return {render: () => \"dark checkbox\"};}\n}\nfunction renderPage(factory: ThemeFactory) {\n  return factory.createButton().render() + \" / \" +\n    factory.createCheckbox().render();\n}\nconsole.log(renderPage(new DarkFactory()));"
  ],
  "python": [
    "button = \"light button\"\ncheckbox = \"light checkbox\"\nprint(button + \" / \" + checkbox)",
    "button = \"dark button\"\ncheckbox = \"light checkbox\"\nprint(button + \" / \" + checkbox)",
    "from typing import Protocol\n\nclass ThemeFactory(Protocol):\n    def create_button(self) -> str: ...\n    def create_checkbox(self) -> str: ...\n\nclass LightFactory:\n    def create_button(self):\n        return \"light button\"\n    def create_checkbox(self):\n        return \"light checkbox\"\n\nclass DarkFactory:\n    def create_button(self):\n        return \"dark button\"\n    def create_checkbox(self):\n        return \"dark checkbox\"\n\ndef render_page(factory: ThemeFactory):\n    return factory.create_button() + \" / \" + factory.create_checkbox()\n\nprint(render_page(LightFactory()))",
    "from typing import Protocol\n\nclass ThemeFactory(Protocol):\n    def create_button(self) -> str: ...\n    def create_checkbox(self) -> str: ...\n\nclass LightFactory:\n    def create_button(self):\n        return \"light button\"\n    def create_checkbox(self):\n        return \"light checkbox\"\n\nclass DarkFactory:\n    def create_button(self):\n        return \"dark button\"\n    def create_checkbox(self):\n        return \"dark checkbox\"\n\ndef render_page(factory: ThemeFactory):\n    return factory.create_button() + \" / \" + factory.create_checkbox()\n\nprint(render_page(DarkFactory()))"
  ],
  "expected": [
    "light button / light checkbox",
    "dark button / light checkbox",
    "light button / light checkbox",
    "dark button / dark checkbox"
  ]
} satisfies PatternExampleSet;
