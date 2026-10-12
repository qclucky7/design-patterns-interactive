import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {StrategyLesson} from "@/components/strategy-lesson";
import {getPathname} from "@/i18n/navigation";
import {localeOption, routing} from "@/i18n/routing";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";

type Props = {params: Promise<{locale: string}>};
const path = "/patterns/strategy";

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({locale});
  const seo = (messages.strategy as typeof strategyMessages).seo;
  const url = getPathname({href: path, locale});
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(routing.locales.map((option) => [option, getPathname({href: path, locale: option})]))
    },
    openGraph: {type: "article", url, locale: localeOption(locale)?.ogLocale, title: seo.title, description: seo.ogDescription}
  };
}

export default async function StrategyPage({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <StrategyLesson locale={locale} />;
}
