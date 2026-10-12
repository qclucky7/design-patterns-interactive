"use client";

import {useEffect, useRef, useState} from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import theme from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import {CheckIcon, ClipboardIcon} from "@radix-ui/react-icons";
import {writeText} from "clipboard-polyfill";
import {CodeLanguageSelect} from "./code-language-select";

for (const [name, grammar] of Object.entries({typescript, python, java, go})) SyntaxHighlighter.registerLanguage(name, grammar);

export function ReadingCodeBlock({code, focus = [], fileName, label, languages, language = "typescript", onLanguageChange, copyLabel, copiedLabel, copyErrorLabel}: {
  code: string; focus?: number[]; fileName: string; label: string; copyLabel: string; copiedLabel: string; copyErrorLabel: string;
  languages?: {id: string; label: string}[]; language?: string; onLanguageChange?: (language: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyCode() {
    clearTimeout(timer.current);
    try {
      await writeText(code);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 1500);
    } catch { setStatus("error"); }
  }
  const buttonLabel = status === "copied" ? copiedLabel : copyLabel;
  return <figure className="code-window" data-line-numbers>
    <div className="code-toolbar">
      <figcaption><span className="code-file-name" title={fileName}>{fileName}</span></figcaption>
      <div className="code-window-tools">
        {languages && onLanguageChange && <CodeLanguageSelect label={label} value={language} languages={languages} onValueChange={onLanguageChange} />}
        <button type="button" onClick={copyCode} title={buttonLabel} aria-label={buttonLabel} data-checked={status === "copied" ? "" : undefined}>
          {status === "copied" ? <CheckIcon aria-hidden="true" /> : <ClipboardIcon aria-hidden="true" />}<span className="code-copy-label">{buttonLabel}</span>
        </button>
      </div>
    </div>
    <div className="code-viewport" tabIndex={0} role="region" aria-label={label}>
      <SyntaxHighlighter language={language} style={theme} showLineNumbers wrapLines className="code-highlight"
        customStyle={{background: "transparent", margin: 0, padding: 0, fontSize: "inherit", lineHeight: "inherit"}}
        lineNumberStyle={{minWidth: "3.5em", paddingRight: "1em", color: "#8993a0", userSelect: "none"}}
        lineProps={line => ({className: `code-line${focus.includes(line) ? " focused" : ""}`, style: {display: "block"}})}>{code}</SyntaxHighlighter>
    </div>
    <span className={status === "error" ? "code-copy-error" : "code-copy-label"} role="status">{status === "error" ? copyErrorLabel : status === "copied" ? copiedLabel : ""}</span>
  </figure>;
}
