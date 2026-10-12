import {defineRouting} from "next-intl/routing";

export const localeOptions = [
  {code: "zh-CN", label: "中文", shortLabel: "中文", ogLocale: "zh_CN"},
  {code: "en", label: "English", shortLabel: "EN", ogLocale: "en_US"}
] as const;

export const routing = defineRouting({
  locales: localeOptions.map((option) => option.code),
  defaultLocale: "zh-CN",
  localePrefix: "as-needed"
});

export type SiteLocale = (typeof localeOptions)[number]["code"];

export function localeOption(locale: string) {
  return localeOptions.find((option) => option.code === locale);
}
