export const codeLanguages = [
  {id: "typescript", label: "TypeScript", icon: "/icons/languages/typescript.svg", extension: "ts"},
  {id: "python", label: "Python", icon: "/icons/languages/python.svg", extension: "py"},
  {id: "java", label: "Java", icon: "/icons/languages/java.svg", extension: "java", fileName: "Main.java"},
  {id: "go", label: "Go", icon: "/icons/languages/go.svg", extension: "go", fileName: "main.go"}
] as const;

export type CodeLanguage = {id: string; label: string; icon: string};
export function getCodeLanguage(id: string): CodeLanguage {
  const language = codeLanguages.find(language => language.id === id);
  if (!language) throw new Error(`Unregistered code language: ${id}`);
  return language;
}
