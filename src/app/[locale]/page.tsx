import {getMessages} from "next-intl/server";
import Image from "next/image";
import {Link, getPathname} from "@/i18n/navigation";
import {SiteShell} from "@/components/site-shell";
import {PatternComposition} from "@/components/pattern-composition";
import {categories, patterns, isPatternAvailable} from "@/data/patterns";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";

type Props = {params: Promise<{locale: string}>};
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return {alternates: {canonical: getPathname({href: "/", locale}), languages: Object.fromEntries(routing.locales.map(language => [language, getPathname({href: "/", locale: language})]))}};
}
export default async function Home({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({locale});
  const common = messages.common as typeof commonMessages;
  const copy = messages.catalog as typeof catalogMessages;
  const firstPattern = categories.flatMap(category => patterns.filter(pattern => pattern.category === category))
    .find(pattern => isPatternAvailable(pattern.slug));
  return <SiteShell locale={locale} common={common} directory={copy}>
    <main className="catalog-page">
      <div className="catalog-hero">
        <div className="catalog-intro"><h1>{copy.title}</h1><p>{copy.description}</p>{firstPattern && <Link className="catalog-start" href={`/patterns/${firstPattern.slug}`}>{copy.available} · {copy.patterns[firstPattern.slug].name}<span aria-hidden="true">↗</span></Link>}</div>
        <PatternComposition copy={copy.animation} />
      </div>
      <div className="catalog-groups">{categories.map(category => <section key={category} className="catalog-group">
        <div className="catalog-group-heading"><h2>{copy.categories[category].name}<span>{patterns.filter(pattern => pattern.category === category).length}</span></h2><p>{copy.categories[category].description}</p></div>
        <div className="catalog-entries">{patterns.filter(pattern => pattern.category === category).map(({slug, icon}) => {
          const item = copy.patterns[slug];
          const body = <><Image className="catalog-pattern-icon" src={icon} width={40} height={40} alt="" unoptimized /><div><h3>{item.name}</h3>{locale !== "en" && <span className="catalog-english">{item.englishName}</span>}<p>{item.summary}</p></div><span className="catalog-entry-status">{isPatternAvailable(slug) ? copy.available : copy.pending}</span></>;
          return isPatternAvailable(slug) ? <Link key={slug} href={`/patterns/${slug}`} className="catalog-entry available">{body}</Link> : <div key={slug} className="catalog-entry">{body}</div>;
        })}</div>
      </section>)}</div>
    </main>
  </SiteShell>;
}
