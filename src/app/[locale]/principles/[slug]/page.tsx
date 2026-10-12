import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {PrincipleLesson} from "@/components/principle-lesson";
import {principles,findPrinciple} from "@/data/principles";
import {getPathname} from "@/i18n/navigation";
import {routing,localeOption} from "@/i18n/routing";
import type principleMessages from "@/i18n/messages/zh-CN/principles.json";

type Props={params:Promise<{locale:string;slug:string}>};
export function generateStaticParams(){return principles.map(({slug})=>({slug}));}
async function resolve({params}:Props){
  const {locale,slug}=await params;
  const principle=findPrinciple(slug);
  if(!hasLocale(routing.locales,locale)||!principle)notFound();
  return {locale,principle};
}
export async function generateMetadata(props:Props):Promise<Metadata>{
  const {locale,principle}=await resolve(props);
  const messages=await getMessages({locale});
  const info=(messages.principles as typeof principleMessages).entries[principle.slug];
  const href=`/principles/${principle.slug}`;
  const url=getPathname({href,locale});
  return {title:info.name,description:info.summary,alternates:{canonical:url,languages:Object.fromEntries(routing.locales.map(locale=>[locale,getPathname({href,locale})]))},openGraph:{type:"article",url,locale:localeOption(locale)?.ogLocale,title:info.name,description:info.summary}};
}
export default async function Page(props:Props){return <PrincipleLesson {...await resolve(props)}/>;}
