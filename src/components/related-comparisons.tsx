import {getMessages} from "next-intl/server";
import {comparisonsForPattern,type ComparisonMessages} from "@/data/comparisons";
import type {PatternSlug} from "@/data/patterns";
import type {SiteLocale} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
export async function RelatedComparisons({slug,locale}:{slug:PatternSlug;locale:SiteLocale}){
  const pairs=comparisonsForPattern(slug);
  if(!pairs.length)return null;
  const copy=(await getMessages({locale})).comparisons as ComparisonMessages;
  return <section className="article-section related-patterns" id="pattern-comparisons"><h2>{copy.title}</h2>{pairs.map(pair=><Link key={pair.slug} href={`/comparisons/${pair.slug}`}>{copy.entries[pair.slug].title}<span aria-hidden="true">↗</span></Link>)}</section>;
}
