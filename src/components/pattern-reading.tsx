import {Link} from "@/i18n/navigation";
import type {SiteLocale} from "@/i18n/routing";
import {findPattern, type PatternSlug} from "@/data/patterns";
import type {PatternReadingContent} from "@/data/lesson-types";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import type tutorialMessages from "@/i18n/messages/zh-CN/tutorial.json";
import {OverengineeringSection} from "./overengineering-section";
import {RelatedComparisons} from "./related-comparisons";
import {RelatedPrinciples} from "./related-principles";

// All patterns share the reading hierarchy, not the teaching content or lab.
export function PatternReading({locale, slug, lesson, directory, tutorial}: {
  locale: SiteLocale;
  slug: PatternSlug;
  lesson: PatternReadingContent;
  directory: typeof catalogMessages;
  tutorial: typeof tutorialMessages;
}) {
  const info = directory.patterns[slug];
  const pattern = findPattern(slug)!;
  return <>
    <div className="lesson-intro" id="overview">
      <h1>{info.name}</h1>
      <p className="hero-description">{info.summary}</p>
      <a className="start-link" href="#lab">{tutorial.start}<span aria-hidden="true">↗</span></a>
      <div className="scenario-card" id="problem"><h2>{lesson.request}</h2><p>{lesson.scenario}</p></div>
    </div>
    <article className="lesson-content">
      <section className="article-section" id="principle"><h2>{lesson.principleTitle}</h2><p>{lesson.problem}</p><p>{lesson.solution}</p><div className="pattern-key-ideas">{lesson.keyIdeas.map(idea=><p key={idea}>{idea}</p>)}</div></section>
      <section className="article-section" id="why-it-works"><h2>{tutorial.benefits}</h2><div className="reason-list">{lesson.benefits.map((benefit,index) => <div key={benefit}><span className="reason-number">{String(index+1).padStart(2,"0")}</span><p>{benefit}</p></div>)}</div><h3 className="tradeoff-heading">{tutorial.tradeoff}</h3><p>{lesson.tradeoff}</p></section>
      <section className="article-section" id="when-to-use"><h2>{directory.chapters[4]}</h2><div className="decision-card"><div><h3>{tutorial.suitable}</h3><p>{lesson.when}</p></div></div></section>
      <OverengineeringSection slug={slug} locale={locale}/>
      <section className="article-section recap" id="recap"><h2>{tutorial.remember}</h2><p>{lesson.remember}</p><a href="#lab" className="back-to-lab">{tutorial.back}<span aria-hidden="true">↗</span></a></section>
      <section className="article-section related-patterns"><h2>{tutorial.related}</h2><p>{lesson.distinction}</p>{pattern.related.map(related => <Link key={related} href={`/patterns/${related}`}>{directory.patterns[related].name}<span aria-hidden="true">↗</span></Link>)}</section>
      <RelatedComparisons slug={slug} locale={locale}/>
      <RelatedPrinciples slug={slug} locale={locale}/>
    </article>
  </>;
}
