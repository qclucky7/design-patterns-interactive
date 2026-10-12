import type { MetadataRoute } from "next";
import {getPathname} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";
import {availablePatterns} from "@/data/patterns";
import {principles} from "@/data/principles";
import {comparisons} from "@/data/comparisons";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/principles", "/comparisons", ...comparisons.map(({slug})=>`/comparisons/${slug}`), ...principles.map(({slug})=>`/principles/${slug}`), ...availablePatterns.map(slug => `/patterns/${slug}`)].flatMap(href => {
  const languages = Object.fromEntries(routing.locales.map((locale) => [locale, `${siteUrl}${getPathname({href, locale})}`]));
  return routing.locales.map((locale) => ({
    url: languages[locale], lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1,
    alternates: {languages}
  }));
  });
}
