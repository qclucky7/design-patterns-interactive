import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "function importCsv(source: string) {\n  const read = source.trim();\n  const rows = read.split(\",\");\n  return \"saved:\" + rows.join(\"|\");\n}\nconsole.log(importCsv(\" A,B \"));",
    "function importCsv(source: string) {\n  const read = source.trim();\n  const rows = read.split(\",\");\n  return \"saved:\" + rows.join(\"|\");\n}\nconsole.log(importCsv(\" A,B \"));\nfunction importJson(source: string) {\n  const read = source.trim();\n  const rows: string[] = JSON.parse(read);\n  return \"saved:\" + rows.join(\"|\");\n}\nconsole.log(importJson('[\"A\",\"B\"]'));",
    "abstract class Importer {\n  importData(source: string) {\n    const read = source.trim();\n    const rows = this.transform(read);\n    return \"saved:\" + rows.join(\"|\");\n  }\n  protected abstract transform(source: string): string[];\n}\nclass CsvImporter extends Importer {\n  protected transform(source: string) {return source.split(\",\");}\n}\nclass JsonImporter extends Importer {\n  protected transform(source: string): string[] {return JSON.parse(source);}\n}\nconsole.log(new CsvImporter().importData(\" A,B \"));",
    "abstract class Importer {\n  importData(source: string) {\n    const read = source.trim();\n    const rows = this.transform(read);\n    return \"saved:\" + rows.join(\"|\");\n  }\n  protected abstract transform(source: string): string[];\n}\nclass CsvImporter extends Importer {\n  protected transform(source: string) {return source.split(\",\");}\n}\nclass JsonImporter extends Importer {\n  protected transform(source: string): string[] {return JSON.parse(source);}\n}\nconsole.log(new JsonImporter().importData('[\"A\",\"B\"]'));"
  ],
  "python": [
    "def import_csv(source):\n    read = source.strip()\n    rows = read.split(\",\")\n    return \"saved:\" + \"|\".join(rows)\n\nprint(import_csv(\" A,B \"))",
    "def import_csv(source):\n    read = source.strip()\n    rows = read.split(\",\")\n    return \"saved:\" + \"|\".join(rows)\n\nprint(import_csv(\" A,B \"))\nimport json\ndef import_json(source):\n    read = source.strip()\n    rows = json.loads(read)\n    return \"saved:\" + \"|\".join(rows)\n\nprint(import_json('[\"A\",\"B\"]'))",
    "from abc import ABC, abstractmethod\nimport json\n\nclass Importer(ABC):\n    def import_data(self, source):\n        read = source.strip()\n        rows = self.transform(read)\n        return \"saved:\" + \"|\".join(rows)\n    @abstractmethod\n    def transform(self, source):\n        pass\n\nclass CsvImporter(Importer):\n    def transform(self, source):\n        return source.split(\",\")\n\nclass JsonImporter(Importer):\n    def transform(self, source):\n        return json.loads(source)\n\nprint(CsvImporter().import_data(\" A,B \"))",
    "from abc import ABC, abstractmethod\nimport json\n\nclass Importer(ABC):\n    def import_data(self, source):\n        read = source.strip()\n        rows = self.transform(read)\n        return \"saved:\" + \"|\".join(rows)\n    @abstractmethod\n    def transform(self, source):\n        pass\n\nclass CsvImporter(Importer):\n    def transform(self, source):\n        return source.split(\",\")\n\nclass JsonImporter(Importer):\n    def transform(self, source):\n        return json.loads(source)\n\nprint(JsonImporter().import_data('[\"A\",\"B\"]'))"
  ],
  "expected": [
    "saved:A|B",
    "saved:A|B",
    "saved:A|B",
    "saved:A|B"
  ]
} satisfies PatternExampleSet;
