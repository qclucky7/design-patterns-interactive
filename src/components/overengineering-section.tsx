import {getMessages} from "next-intl/server";
import type {OverengineeringCopy} from "@/data/overengineering";
import type {PatternSlug} from "@/data/patterns";
import type {SiteLocale} from "@/i18n/routing";

export async function OverengineeringSection({slug, locale}: {slug: PatternSlug; locale: SiteLocale}) {
  const messages = await getMessages({locale});
  const {labels, patterns} = messages.overengineering as OverengineeringCopy;
  const entry = patterns[slug];

  return (
    <section id="overengineering" className="article-section overengineering-section">
      <h2>{labels.heading}</h2>
      <div className="overengineering-case">
        <h3>{entry.title}</h3>
        <p>{entry.scenario}</p>
      </div>
      <dl className="overengineering-options">
        <div>
          <dt>{labels.excess}</dt>
          <dd>{entry.excess}</dd>
          <dd className="overengineering-cost"><span>{labels.cost}</span>{entry.cost}</dd>
        </div>
        <div>
          <dt>{labels.simpler}</dt>
          <dd>{entry.simpler}</dd>
        </div>
      </dl>
      <div className="overengineering-trigger">
        <h3>{labels.reconsider}</h3>
        <p>{entry.reconsider}</p>
      </div>
    </section>
  );
}
