import * as rootParams from "next/root-params";
import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "./routing";

export default getRequestConfig(async ({locale}) => {
  if (!locale) {
    const value = await rootParams.locale();
    if (!hasLocale(routing.locales, value)) notFound();
    locale = value;
  }

  const [common, strategy, catalog, tutorial, creational, structural, behavioral, playgrounds, playgroundGuidance, principles, comparisons, overengineering] = await Promise.all([
    import(`./messages/${locale}/common.json`),
    import(`./messages/${locale}/strategy.json`),
    import(`./messages/${locale}/catalog.json`),
    import(`./messages/${locale}/tutorial.json`),
    import(`./messages/${locale}/creational.json`),
    import(`./messages/${locale}/structural.json`),
    import(`./messages/${locale}/behavioral.json`),
    import(`./messages/${locale}/playgrounds.json`),
    import(`./messages/${locale}/playground-guidance.json`),
    import(`./messages/${locale}/principles.json`),
    import(`./messages/${locale}/comparisons.json`),
    import(`./messages/${locale}/overengineering.json`)
  ]);

  return {locale, messages: {common: common.default, strategy: strategy.default, catalog: catalog.default, tutorial: tutorial.default, playgrounds: playgrounds.default, playgroundGuidance:playgroundGuidance.default, principles:principles.default, comparisons:comparisons.default, overengineering:overengineering.default, lessons: {...creational.default,...structural.default,...behavioral.default}}};
});
