import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {SiteShell} from "@/components/site-shell";
import {ComparisonExperiment} from "@/components/comparison-experiment";
import {ComparisonCode} from "@/components/comparison-code";
import {comparisons,findComparison,type ComparisonMessages} from "@/data/comparisons";
import {comparisonScene} from "@/data/comparison-scenes";
import {getPatternExamples} from "@/code-examples/patterns/registry";
import {codeExamples} from "@/code-examples/registry";
import {Link,getPathname} from "@/i18n/navigation";
import {routing,localeOption} from "@/i18n/routing";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";

type Props={params:Promise<{locale:string;slug:string}>};
export function generateStaticParams(){return comparisons.map(({slug})=>({slug}));}
async function resolve({params}:Props){
  const {locale,slug}=await params,pair=findComparison(slug);
  if(!hasLocale(routing.locales,locale)||!pair)notFound();
  const messages=await getMessages({locale}),copy=messages.comparisons as ComparisonMessages;
  return {locale,pair,messages,copy,entry:copy.entries[pair.slug]};
}
export async function generateMetadata(props:Props):Promise<Metadata>{
  const {locale,pair,entry}=await resolve(props),href=`/comparisons/${pair.slug}`,url=getPathname({href,locale});
  return {title:entry.title,description:entry.summary,alternates:{canonical:url,languages:Object.fromEntries(routing.locales.map(locale=>[locale,getPathname({href,locale})]))},openGraph:{type:"article",url,locale:localeOption(locale)?.ogLocale,title:entry.title,description:entry.summary}};
}
export default async function Page(props:Props){
  const {locale,pair,messages,copy,entry}=await resolve(props),catalog=messages.catalog as typeof catalogMessages;
  const names=pair.patterns.map(slug=>catalog.patterns[slug].name);
  const examples=pair.patterns.map(slug=>slug==="strategy"?codeExamples.map(example=>({id:example.id,label:example.label,fileName:example.fileName,code:example.getStageCode(3).map(line=>line.text).join("\n")})):getPatternExamples(slug).map(example=>({id:example.id,label:example.label,fileName:example.fileName,code:example.stages[3]})));
  const lab=(messages.strategy as typeof strategyMessages).lab;
  const url=`${process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"}${getPathname({href:`/comparisons/${pair.slug}`,locale})}`;
  const schema={"@context":"https://schema.org","@type":"TechArticle",headline:entry.title,description:entry.summary,inLanguage:locale,url,about:names.map(name=>({"@type":"Thing",name}))};
  return <SiteShell locale={locale} common={messages.common as typeof commonMessages} directory={catalog} section="comparisons" current={pair.slug}>
    <main className="comparison-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
      <nav className="comparison-breadcrumb" aria-label={copy.labels.directory}><Link href="/comparisons">{copy.title}</Link><span aria-hidden="true">/</span><span>{entry.title}</span></nav>
      <header className="comparison-intro"><h1>{entry.title}</h1><p className="comparison-question">{entry.question}</p><div className="comparison-scenario"><span>{copy.labels.scenario}</span><p>{entry.scenario}</p></div></header>
      <ComparisonExperiment entry={entry} names={names} labels={copy.labels} scenes={entry.sides.map(side=>side.states.map(comparisonScene))}/>
      <section className="comparison-section"><h2>{copy.labels.differences}</h2><div className="comparison-table-scroll"><table className="comparison-table"><thead><tr><th scope="col">{copy.labels.differences}</th>{names.map(name=><th key={name} scope="col">{name}</th>)}</tr></thead><tbody>{entry.differences.map(row=><tr key={row.dimension}><th scope="row">{row.dimension}</th><td>{row.left}</td><td>{row.right}</td></tr>)}</tbody></table></div></section>
      <section className="comparison-section comparison-coexist"><h2>{copy.labels.coexist}</h2><p>{entry.coexist}</p></section>
      <section className="comparison-section"><h2>{copy.labels.code}</h2><p className="comparison-note">{copy.labels.codeNote}</p><ComparisonCode examples={examples} names={names} label={copy.labels.language} copyLabel={lab.copyable} copiedLabel={lab.copied} copyErrorLabel={lab.copyError}/></section>
      <nav className="comparison-lesson-links" aria-label={copy.labels.lesson}>{pair.patterns.map((slug,index)=><Link key={slug} href={`/patterns/${slug}`}>{copy.labels.lesson} · {names[index]}<span aria-hidden="true"> ↗</span></Link>)}</nav>
    </main>
  </SiteShell>;
}
