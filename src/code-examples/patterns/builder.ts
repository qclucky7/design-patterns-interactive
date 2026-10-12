import type {PatternExampleSet} from "./types";
export default {
  "typescript": [
    "function exportJob(format: string, header: boolean, compressed: boolean) {\n  return {format, header, compressed};\n}\nconsole.log(JSON.stringify(exportJob(\"csv\", false, false)));",
    "function exportJob(format: string, header: boolean, compressed: boolean) {\n  return {format, header, compressed};\n}\nconsole.log(JSON.stringify(exportJob(\"pdf\", true, true)));",
    "type ExportJob = {format: string; header: boolean; compressed: boolean};\nclass ExportBuilder {\n  private options: ExportJob = {format: \"csv\", header: false, compressed: false};\n  format(value: string) {this.options.format = value; return this;}\n  header() {this.options.header = true; return this;}\n  compress() {this.options.compressed = true; return this;}\n  build(): ExportJob {return {...this.options};}\n}\nconsole.log(JSON.stringify(new ExportBuilder().format(\"pdf\").header().build()));",
    "type ExportJob = {format: string; header: boolean; compressed: boolean};\nclass ExportBuilder {\n  private options: ExportJob = {format: \"csv\", header: false, compressed: false};\n  format(value: string) {this.options.format = value; return this;}\n  header() {this.options.header = true; return this;}\n  compress() {this.options.compressed = true; return this;}\n  build(): ExportJob {return {...this.options};}\n}\nfunction reportRecipe(builder: ExportBuilder) {\n  return builder.format(\"pdf\").header().compress().build();\n}\nconst builder = new ExportBuilder();\nconst first = reportRecipe(builder);\nbuilder.format(\"csv\");\nconsole.log(JSON.stringify(first));\nconsole.log(first.format === \"pdf\");"
  ],
  "python": [
    "def export_job(format, header, compressed):\n    return {\"format\": format, \"header\": header, \"compressed\": compressed}\n\nprint(export_job(\"csv\", False, False))",
    "def export_job(format, header, compressed):\n    return {\"format\": format, \"header\": header, \"compressed\": compressed}\n\nprint(export_job(\"pdf\", True, True))",
    "class ExportBuilder:\n    def __init__(self):\n        self.options = {\"format\": \"csv\", \"header\": False, \"compressed\": False}\n    def format(self, value):\n        self.options[\"format\"] = value\n        return self\n    def header(self):\n        self.options[\"header\"] = True\n        return self\n    def compress(self):\n        self.options[\"compressed\"] = True\n        return self\n    def build(self):\n        return dict(self.options)\n\nprint(ExportBuilder().format(\"pdf\").header().build())",
    "class ExportBuilder:\n    def __init__(self):\n        self.options = {\"format\": \"csv\", \"header\": False, \"compressed\": False}\n    def format(self, value):\n        self.options[\"format\"] = value\n        return self\n    def header(self):\n        self.options[\"header\"] = True\n        return self\n    def compress(self):\n        self.options[\"compressed\"] = True\n        return self\n    def build(self):\n        return dict(self.options)\n\ndef report_recipe(builder):\n    return builder.format(\"pdf\").header().compress().build()\n\nbuilder = ExportBuilder()\nfirst = report_recipe(builder)\nbuilder.format(\"csv\")\nprint(first)\nprint(first[\"format\"] == \"pdf\")"
  ],
  "expected": [
    "csv",
    "pdf",
    "pdf",
    "pdf"
  ]
} satisfies PatternExampleSet;
