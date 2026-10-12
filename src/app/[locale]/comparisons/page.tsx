import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {ArrowTopRightIcon} from "@radix-ui/react-icons";
import {SiteShell} from "@/components/site-shell";
import {comparisons,type ComparisonMessages} from "@/data/comparisons";
import {categories} from "@/data/patterns";
import {Link,getPathname} from "@/i18n/navigation";
import {routing,localeOption} from "@/i18n/routing";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";

type Props={params:Promise<{locale:string}>};
async function resolve({params}:Props){
  const {locale}=await params;
  if(!hasLocale(routing.locales,locale))notFound();
  const messages=await getMessages({locale});
  return {locale,messages,copy:messages.comparisons as ComparisonMessages};
}
export async function generateMetadata(props:Props):Promise<Metadata>{
  const {locale,copy}=await resolve(props),href="/comparisons",url=getPathname({href,locale});
  return {title:copy.title,description:copy.description,alternates:{canonical:url,languages:Object.fromEntries(routing.locales.map(locale=>[locale,getPathname({href,locale})]))},openGraph:{type:"website",url,locale:localeOption(locale)?.ogLocale,title:copy.title,description:copy.description}};
}
export default async function Page(props:Props){
  const {locale,messages,copy}=await resolve(props);
  return <SiteShell locale={locale} common={messages.common as typeof commonMessages} directory={messages.catalog as typeof catalogMessages} section="comparisons">
    <main className="catalog-page comparisons-page">
      <header className="principles-intro"><h1>{copy.title}</h1><p>{copy.description}</p></header>
      <div className="catalog-groups">{categories.map(group=><section key={group} className="catalog-group">
        <div className="catalog-group-heading"><h2>{copy.groups[group].name}<span>{comparisons.filter(pair=>pair.group===group).length}</span></h2><p>{copy.groups[group].description}</p></div>
        <div className="principle-entries">{comparisons.filter(pair=>pair.group===group).map(pair=>{
          const entry=copy.entries[pair.slug];
          return <Link key={pair.slug} href={`/comparisons/${pair.slug}`} className="principle-entry comparison-entry"><div className="principle-entry-heading"><h3>{entry.title}</h3><ArrowTopRightIcon aria-hidden="true"/></div><p>{entry.question}</p></Link>;
        })}</div>
      </section>)}</div>
    </main>
  </SiteShell>;
}
