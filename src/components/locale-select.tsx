"use client";

import {useTransition} from "react";
import * as Select from "@radix-ui/react-select";
import {CheckIcon, ChevronDownIcon, ChevronUpIcon, GlobeIcon} from "@radix-ui/react-icons";
import {hasLocale, useLocale} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";
import {localeOptions, routing} from "@/i18n/routing";

export function LocaleSelect({label}: {label: string}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const current = localeOptions.find((option) => option.code === locale);

  function changeLocale(value: string) {
    if (!hasLocale(routing.locales, value) || value === locale) return;
    const href = `${pathname}${window.location.search}${window.location.hash}`;
    startTransition(() => router.replace(href, {locale: value, scroll: false}));
  }

  return (
    <Select.Root value={locale} onValueChange={changeLocale} disabled={pending}>
      <Select.Trigger className="locale-select-trigger" aria-label={label} aria-busy={pending}>
        <GlobeIcon className="locale-globe" aria-hidden="true" />
        <Select.Value><span lang={locale}>{current?.label}</span></Select.Value>
        <Select.Icon className="locale-select-chevron"><ChevronDownIcon /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="locale-select-content" position="popper" align="end" sideOffset={10} collisionPadding={16}>
          <Select.ScrollUpButton className="locale-select-scroll"><ChevronUpIcon /></Select.ScrollUpButton>
          <Select.Viewport className="locale-select-viewport">
            <Select.Group>
              <Select.Label className="locale-select-label">{label}</Select.Label>
              {localeOptions.map((option) => (
                <Select.Item key={option.code} value={option.code} className="locale-select-item" textValue={option.label}>
                  <Select.ItemText><span lang={option.code}>{option.label}</span></Select.ItemText>
                  <Select.ItemIndicator className="locale-select-indicator"><CheckIcon /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="locale-select-scroll"><ChevronDownIcon /></Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
