import {getMessages} from "next-intl/server";
import {SiteShell} from "./site-shell";
import {ReadingCodeBlock} from "./reading-code-block";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";
import {Link,getPathname} from "@/i18n/navigation";
import type {SiteLocale} from "@/i18n/routing";
import type {principles} from "@/data/principles";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import type principleMessages from "@/i18n/messages/zh-CN/principles.json";

export async function PrincipleLesson({locale,principle}:{locale:SiteLocale;principle:typeof principles[number]}) {
  const messages=await getMessages({locale});
  const common=messages.common as typeof commonMessages;
  const directory=messages.catalog as typeof catalogMessages;
  const copy=messages.principles as typeof principleMessages;
  const info=copy.entries[principle.slug];
  const codeCopy=(messages.strategy as typeof strategyMessages).lab;
  const url=(process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000")+getPathname({href:`/principles/${principle.slug}`,locale});
  const data={"@context":"https://schema.org","@type":"TechArticle",headline:info.name,description:info.summary,inLanguage:locale,mainEntityOfPage:url,author:{"@type":"Organization",name:common.brandName}};
  return <SiteShell locale={locale} common={common} directory={directory} current={principle.slug} reading section="principles">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>
    <div className={`page-shell principle-lesson ${locale==="en"?"locale-en":""}`}>
      <div className="breadcrumb"><Link href="/">{common.brandName}</Link><span>/</span><Link href="/principles">{copy.title}</Link><span>/</span><strong>{info.name}</strong></div>
      <main className="lesson-grid">
        <div className="lesson-reading">
          <div className="lesson-intro" id="overview"><h1>{info.name}</h1><p className="hero-description">{info.summary}</p><div className="scenario-card" id="problem"><h2>{info.question}</h2><p>{info.scenario}</p></div></div>
          <article className="lesson-content">
            <section className="article-section" id="meaning"><h2>{copy.labels.meaning}</h2><p>{info.meaning}</p></section>
            <section className="article-section" id="why"><h2>{copy.labels.why}</h2><p>{info.why}</p></section>
            <section className="article-section" id="when"><h2>{copy.labels.when}</h2><p>{info.when}</p><h3>{copy.labels.caution}</h3><p>{info.caution}</p></section>
            <section className="article-section recap" id="remember"><h2>{copy.labels.remember}</h2><p>{info.remember}</p></section>
            <section className="article-section related-patterns" id="related"><h2>{copy.labels.related}</h2><p>{info.connection}</p>{principle.patterns.map(slug=><Link key={slug} href={`/patterns/${slug}`}>{directory.patterns[slug].name}<span aria-hidden="true">↗</span></Link>)}</section>
          </article>
        </div>
        <aside className="lesson-lab principle-examples" aria-label={copy.labels.codeTitle}>
          <div className="principle-code-intro"><h2>{copy.labels.codeTitle}</h2><p>{copy.labels.codeHint}</p></div>
          {(["before","after"] as const).map(stage=><section key={stage} className={`principle-code-example ${stage}`}>
            <div className="principle-code-heading"><h3>{copy.labels[stage]}</h3><span>{copy.labels.codeLanguage}</span></div>
            <p>{info[`${stage}Note`]}</p><ReadingCodeBlock code={principle[stage]} fileName={`${stage}.ts`} label={copy.labels.codeLanguage} copyLabel={codeCopy.copyable} copiedLabel={codeCopy.copied} copyErrorLabel={codeCopy.copyError}/>
          </section>)}
        </aside>
      </main>
    </div>
  </SiteShell>;
}
