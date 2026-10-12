"use client";

import Image from "next/image";
import * as Select from "@radix-ui/react-select";
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from "@radix-ui/react-icons";
import {getCodeLanguage} from "@/code-examples/languages";

export function CodeLanguageSelect({label, value, languages, onValueChange}: {
  label: string; value: string; languages: {id: string; label: string}[]; onValueChange: (value: string) => void;
}) {
  return <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger className="code-language-trigger" aria-label={label}>
      <Select.Value />
      <Select.Icon className="code-language-chevron"><ChevronDownIcon /></Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="locale-select-content code-language-content" position="popper" align="end" sideOffset={6} collisionPadding={12}>
        <Select.ScrollUpButton className="locale-select-scroll"><ChevronUpIcon /></Select.ScrollUpButton>
        <Select.Viewport className="locale-select-viewport">
          <Select.Group>
            <Select.Label className="locale-select-label">{label}</Select.Label>
            {languages.map(language => <Select.Item key={language.id} value={language.id} textValue={language.label} className="locale-select-item code-language-item">
              <Select.ItemText><span className="code-language-name"><Image src={getCodeLanguage(language.id).icon} alt="" width={18} height={18} aria-hidden="true" />{language.label}</span></Select.ItemText>
              <Select.ItemIndicator className="locale-select-indicator"><CheckIcon /></Select.ItemIndicator>
            </Select.Item>)}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="locale-select-scroll"><ChevronDownIcon /></Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>;
}
