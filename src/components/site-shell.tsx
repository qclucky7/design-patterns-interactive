import {LocaleSelect} from "@/components/locale-select";
import {SiteSearch} from "@/components/site-search";
import Image from "next/image";
import {SiteNavigation, type DirectoryCopy} from "@/components/site-navigation";
import {Link} from "@/i18n/navigation";
import type {SiteLocale} from "@/i18n/routing";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type principleMessages from "@/i18n/messages/zh-CN/principles.json";
import type {PrincipleDirectoryCopy} from "./principle-directory";
import {getMessages} from "next-intl/server";
import {comparisons,type ComparisonMessages,type ComparisonDirectoryCopy} from "@/data/comparisons";

export async function SiteShell({locale, common, directory, current, children, reading=false,section="patterns"}: {locale: SiteLocale; common: typeof commonMessages; directory: DirectoryCopy; current?: string; children: React.ReactNode;reading?:boolean;section?:"patterns"|"principles"|"comparisons"}) {
  const messages = await getMessages({locale});
  const {title,patternSection,search,empty,onThisPage,menu,close,groups,entries} = messages.principles as typeof principleMessages;
  const principlesCopy:PrincipleDirectoryCopy = {title,patternSection,search,empty,onThisPage,menu,close,groups,entries:Object.fromEntries(Object.entries(entries).map(([slug,{name,englishName}])=>[slug,{name,englishName}])) as PrincipleDirectoryCopy["entries"]};
  const compare=messages.comparisons as ComparisonMessages;
  const comparisonsCopy:ComparisonDirectoryCopy={title:compare.title,search:compare.search,empty:compare.empty,menu:compare.menu,close:compare.close,groups:compare.groups,entries:Object.fromEntries(comparisons.map(pair=>[pair.slug,{title:compare.entries[pair.slug].title,keywords:pair.patterns.map(slug=>directory.patterns[slug].englishName).join(" ")}])) as ComparisonDirectoryCopy["entries"]};
  return <>
    <header className="site-header" id="top">
      <Link href="/" locale={locale} className="brand" aria-label={common.brandHomeLabel} title={common.brandName}><Image src="/brand/logo.svg" width={30} height={30} alt="" className="brand-logo" unoptimized/><span className="brand-name">{common.brandName}</span></Link>
      <div className="site-header-actions"><SiteSearch key={locale} locale={locale} label={common.searchLabel}/><div className="locale-switch"><LocaleSelect label={common.siteLanguageLabel} /></div></div>
    </header>
    <SiteNavigation copy={directory} current={current} principlesCopy={principlesCopy} comparisonsCopy={comparisonsCopy} section={section}/>
    <div className={`site-workspace ${reading?"reading-workspace":""}`} data-pagefind-body data-pagefind-meta={`section:${section==="principles"?principlesCopy.title:section==="comparisons"?comparisonsCopy.title:principlesCopy.patternSection}`}>{children}</div>
  </>;
}
