import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {PatternLesson} from "@/components/pattern-lesson";
import {patterns, findPattern} from "@/data/patterns";
import type {NewPatternSlug} from "@/data/lesson-types";
import {getPathname} from "@/i18n/navigation";
import {localeOption, routing} from "@/i18n/routing";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
type Props = {params: Promise<{locale: string; slug: string}>};
export function generateStaticParams() {return patterns.filter(pattern => pattern.slug !== "strategy").map(({slug}) => ({slug}));}
async function resolve({params}: Props) {
  const {locale,slug} = await params;
  const pattern = findPattern(slug);
  if (!hasLocale(routing.locales,locale) || !pattern || pattern.slug === "strategy") notFound();
  return {locale,slug: pattern.slug as NewPatternSlug};
}
export async function generateMetadata(props: Props): Promise<Metadata> {
  const {locale,slug} = await resolve(props);
  const messages = await getMessages({locale});
  const info = (messages.catalog as typeof catalogMessages).patterns[slug];
  const href = `/patterns/${slug}`;
  const url = getPathname({href,locale});
  return {title:info.name,description:info.summary,alternates:{canonical:url,languages:Object.fromEntries(routing.locales.map(language => [language,getPathname({href,locale:language})]))},openGraph:{type:"article",url,locale:localeOption(locale)?.ogLocale,title:info.name,description:info.summary}};
}
export default async function Page(props: Props) {return <PatternLesson {...await resolve(props)} />;}
