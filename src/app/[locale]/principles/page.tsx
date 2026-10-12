import type {Metadata} from "next";
import Image from "next/image";
import {hasLocale} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {ArrowTopRightIcon} from "@radix-ui/react-icons";
import {SiteShell} from "@/components/site-shell";
import {PatternComposition} from "@/components/pattern-composition";
import {principles,principleGroups} from "@/data/principles";
import {Link,getPathname} from "@/i18n/navigation";
import {routing,localeOption} from "@/i18n/routing";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import type principleMessages from "@/i18n/messages/zh-CN/principles.json";

type Props = {params:Promise<{locale:string}>};
async function resolve({params}:Props) {
  const {locale}=await params;
  if(!hasLocale(routing.locales,locale))notFound();
  const messages=await getMessages({locale});
  return {locale,messages,copy:messages.principles as typeof principleMessages};
}
export async function generateMetadata(props:Props):Promise<Metadata> {
  const {locale,copy}=await resolve(props);
  const url=getPathname({href:"/principles",locale});
  return {title:copy.title,description:copy.description,alternates:{canonical:url,languages:Object.fromEntries(routing.locales.map(locale=>[locale,getPathname({href:"/principles",locale})]))},openGraph:{type:"website",url,locale:localeOption(locale)?.ogLocale,title:copy.title,description:copy.description}};
}
export default async function Page(props:Props) {
  const {locale,messages,copy}=await resolve(props);
  return <SiteShell locale={locale} common={messages.common as typeof commonMessages} directory={messages.catalog as typeof catalogMessages} section="principles">
    <main className="catalog-page principles-page">
      <div className="catalog-hero"><div className="principles-intro catalog-intro"><h1>{copy.title}</h1><p>{copy.description}</p><Link className="catalog-start" href={`/principles/${principles[0].slug}`}>{copy.start}<ArrowTopRightIcon aria-hidden="true"/></Link></div><PatternComposition copy={copy.animation} variant="principles"/></div>
      <section className="principles-distinction"><h2>{copy.definitionTitle}</h2><div><p>{copy.principlesMeaning}</p><p>{copy.patternsMeaning}</p></div></section>
      <div className="catalog-groups">{principleGroups.map(group=><section className="catalog-group" key={group}>
        <div className="catalog-group-heading"><h2>{copy.groups[group].name}<span>{principles.filter(principle=>principle.group===group).length}</span></h2><p>{copy.groups[group].description}</p></div>
        <div className="principle-entries">{principles.filter(principle=>principle.group===group).map(principle=>{
          const item=copy.entries[principle.slug];
          return <Link className="principle-entry principle-entry-with-icon" key={principle.slug} href={`/principles/${principle.slug}`}><Image className="catalog-principle-icon" src={principle.icon} width={40} height={40} alt="" unoptimized/><div className="principle-entry-copy"><div className="principle-entry-heading"><h3>{item.name}</h3><ArrowTopRightIcon aria-hidden="true"/></div>{locale!=="en"&&<span className="catalog-english">{item.englishName}</span>}<p>{item.summary}</p></div></Link>;
        })}</div>
      </section>)}</div>
    </main>
  </SiteShell>;
}
