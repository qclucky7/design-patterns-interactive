import {PatternReading} from "./pattern-reading";
import {getMessages} from "next-intl/server";
import {SiteShell} from "./site-shell";
import {PatternLab} from "./pattern-lab";
import {getPatternScenes} from "@/data/pattern-scenes";
import {getPatternExamples} from "@/code-examples/patterns/registry";
import {findPattern} from "@/data/patterns";
import type {LessonCollection, NewPatternSlug} from "@/data/lesson-types";
import {Link, getPathname} from "@/i18n/navigation";
import type {SiteLocale} from "@/i18n/routing";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import type tutorialMessages from "@/i18n/messages/zh-CN/tutorial.json";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";
import type playgroundMessages from "@/i18n/messages/zh-CN/playgrounds.json";
import type guidanceMessages from "@/i18n/messages/zh-CN/playground-guidance.json";

export async function PatternLesson({locale,slug}: {locale: SiteLocale;slug: NewPatternSlug}) {
  const messages = await getMessages({locale});
  const common = messages.common as typeof commonMessages;
  const directory = messages.catalog as typeof catalogMessages;
  const tutorial = messages.tutorial as typeof tutorialMessages;
  const lesson = (messages.lessons as LessonCollection)[slug];
  const playgrounds = messages.playgrounds as typeof playgroundMessages;
  const guidance = messages.playgroundGuidance as typeof guidanceMessages;
  const info = directory.patterns[slug];
  const pattern = findPattern(slug)!;
  const sharedLab = (messages.strategy as typeof strategyMessages).lab;
  const copy = {...sharedLab,...tutorial.lab,region: `${info.name}: ${tutorial.lab.region}`};
  const examples = getPatternExamples(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = siteUrl + getPathname({href: `/patterns/${slug}`,locale});
  const structuredData = {"@context": "https://schema.org","@type":"TechArticle",headline:info.name,description:info.summary,inLanguage:locale,mainEntityOfPage:pageUrl,author:{"@type":"Organization",name:common.brandName},about:{"@type":"Thing",name:info.englishName}};
  return <SiteShell locale={locale} common={common} directory={directory} current={slug} reading>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}} />
    <div className={`page-shell pattern-lesson ${locale === "en" ? "locale-en" : ""}`}>
      <div className="breadcrumb"><Link href="/">{common.brandName}</Link><span>/</span><span>{directory.categories[pattern.category].name}</span><span>/</span><strong>{info.name}</strong></div>
      <main className="lesson-grid">
        <div className="lesson-reading">
        <PatternReading locale={locale} slug={slug} lesson={lesson} directory={directory} tutorial={tutorial}/>
        </div>
        <div className="lesson-lab"><PatternLab slug={slug} playground={{...playgrounds.patterns[slug],guidance:guidance.patterns[slug],ui:guidance.ui}} walkthrough={playgrounds.walkthrough} key={`${locale}-${slug}`} examples={examples} scenes={getPatternScenes(slug)} content={lesson} copy={copy} /></div>
      </main>
    </div>
  </SiteShell>;
}
