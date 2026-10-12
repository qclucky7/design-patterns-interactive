import {PatternReading} from "./pattern-reading";
import {getMessages} from "next-intl/server";
import {StrategyCodeLab} from "./strategy-code-lab";
import {codeExamples} from "@/code-examples/registry";
import type {SerializableExample} from "@/code-examples/patterns/registry";
import {SiteShell} from "@/components/site-shell";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import {Link, getPathname} from "@/i18n/navigation";
import type tutorialMessages from "@/i18n/messages/zh-CN/tutorial.json";
import type {SiteLocale} from "@/i18n/routing";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import type strategyMessages from "@/i18n/messages/zh-CN/strategy.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function StrategyLesson({ locale }: { locale: SiteLocale }) {
  const messages = await getMessages({locale});
  const common = messages.common as typeof commonMessages;
  const content = messages.strategy as typeof strategyMessages;
  const directory = messages.catalog as typeof catalogMessages;
  const tutorial = messages.tutorial as typeof tutorialMessages;
  const copy = content.lesson;
  const examples = codeExamples.map(example => ({
    id: example.id, label: example.label, fileName: example.fileName, outputs: example.outputs,
    stages: [0, 1, 2, 3].map(stage => example.getStageCode(stage).map(line => line.text).join("\n")) as SerializableExample["stages"],
    focusByStage: [0, 1, 2, 3].map(stage => {
      const lines = example.getStageCode(stage);
      return lines.flatMap((line, index) => example.focusByStage[stage].includes(line.sourceLine) ? [index + 1] : []);
    })
  }));
  const isEnglish = locale === "en";
  const path = getPathname({href: "/patterns/strategy", locale});
  const pageUrl = `${siteUrl}${path}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: content.seo.headline,
        description: content.seo.articleDescription,
        inLanguage: locale,
        mainEntityOfPage: pageUrl,
        author: { "@type": "Organization", name: common.brandName },
        about: { "@type": "Thing", name: "Strategy pattern" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: common.homeLabel, item: `${siteUrl}${getPathname({href: "/", locale})}` },
          { "@type": "ListItem", position: 2, name: common.breadcrumb[2], item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteShell locale={locale} common={common} directory={directory} current="strategy" reading>
      <div className={`page-shell pattern-lesson strategy-lesson ${isEnglish ? "locale-en" : ""}`}>
        <div className="breadcrumb"><Link href="/">{common.brandName}</Link><span>/</span><span>{directory.categories.behavioral.name}</span><span>/</span><strong>{directory.patterns.strategy.name}</strong></div>

        <main className="lesson-grid">
          <div className="lesson-reading">
          <PatternReading locale={locale} slug="strategy" lesson={copy} directory={directory} tutorial={tutorial}/>
          </div>
          <div className="lesson-lab"><StrategyCodeLab examples={examples} copy={content.lab} stages={content.stages} /></div>
        </main>
      </div>
      </SiteShell>
    </>
  );
}
