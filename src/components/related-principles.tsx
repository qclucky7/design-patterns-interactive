import {getMessages} from "next-intl/server";
import {principlesForPattern} from "@/data/principles";
import type {PatternSlug} from "@/data/patterns";
import type {SiteLocale} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
import type principleMessages from "@/i18n/messages/zh-CN/principles.json";

export async function RelatedPrinciples({slug,locale}:{slug:PatternSlug;locale:SiteLocale}) {
  const related=principlesForPattern(slug);
  if(!related.length)return null;
  const messages=await getMessages({locale});
  const copy=messages.principles as typeof principleMessages;
  return <section className="article-section related-patterns" id="design-principles"><h2>{copy.labels.relatedPrinciples}</h2><p>{copy.labels.relationHint}</p>{related.map(principle=><Link key={principle.slug} href={`/principles/${principle.slug}`}>{copy.entries[principle.slug].name}<span aria-hidden="true">↗</span></Link>)}</section>;
}
