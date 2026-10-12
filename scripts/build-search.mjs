import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
import path from "node:path";
import * as pagefind from "pagefind";
import {localeOptions,routing} from "../src/i18n/routing.ts";
import {patterns} from "../src/data/patterns.ts";
import {principles} from "../src/data/principles.ts";
import {comparisons} from "../src/data/comparisons.ts";

export function searchRoutes() {
  const paths=["/","/principles","/comparisons",...patterns.map(({slug})=>`/patterns/${slug}`),...principles.map(({slug})=>`/principles/${slug}`),...comparisons.map(({slug})=>`/comparisons/${slug}`)];
  return localeOptions.flatMap(({code})=>paths.map(href=>({
    // Next prerenders locale-prefixed files even when the public default URL is unprefixed.
    file:path.join(".next/server/app",`${code}${href==="/"?"":href}.html`),
    url:`${code===routing.defaultLocale?"":`/${code}`}${href}`
  })));
}

function checked(result,label) {
  if(result.errors?.length)throw new Error(`${label}: ${result.errors.join("; ")}`);
  return result;
}

export async function buildSearch({baseUrl}={}) {
  const {index}=checked(await pagefind.createIndex({excludeSelectors:["pre","svg","button","select","nav",".react-flow","[aria-hidden='true']",".breadcrumb",".comparison-breadcrumb",".lesson-lab",".pattern-composition",".catalog-composition",".comparison-code",".comparison-lesson-links"]}),"Create search index");
  if(!index)throw new Error("Pagefind did not create an index");
  try {
    for(const route of searchRoutes()) {
      let content;
      if(baseUrl) {
        const response=await fetch(new URL(route.url,baseUrl),{signal:AbortSignal.timeout(60000)});
        if(!response.ok)throw new Error(`${route.url}: HTTP ${response.status}`);
        content=await response.text();
      } else content=await readFile(route.file,"utf8");
      if(!content.includes("data-pagefind-body"))throw new Error(`${route.url}: missing searchable content boundary`);
      const result=checked(await index.addHTMLFile({url:route.url,content}),route.url);
      if(!result.file)throw new Error(`${route.url}: no indexed content`);
    }
    checked(await index.writeFiles({outputPath:"public/pagefind"}),"Write search bundle");
    console.log(`Search indexed ${searchRoutes().length} pages across ${localeOptions.length} languages.`);
  } finally {
    await index.deleteIndex();
    await pagefind.close();
  }
}

if(import.meta.url===pathToFileURL(process.argv[1]).href) {
  const dev=process.argv.includes("--dev");
  await buildSearch({baseUrl:dev?(process.env.PATTERN_ATLAS_URL??"http://localhost:3000"):undefined});
}
