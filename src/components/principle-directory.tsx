"use client";

import {useId, useState} from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {ChevronDownIcon, MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {Link} from "@/i18n/navigation";
import {principles, principleGroups} from "@/data/principles";
import {ChapterNavigation} from "./chapter-navigation";
import type principleMessages from "@/i18n/messages/zh-CN/principles.json";

export type PrincipleDirectoryCopy = Pick<typeof principleMessages,"title"|"patternSection"|"search"|"empty"|"onThisPage"|"menu"|"close"|"groups"> & {
  entries: Record<keyof typeof principleMessages.entries, {name:string;englishName:string}>;
};

export function PrincipleDirectory({copy,current,onNavigate,tocEnabled}: {copy:PrincipleDirectoryCopy;current?:string;onNavigate?:()=>void;tocEnabled:boolean}) {
  const [query,setQuery] = useState("");
  const id = useId();
  const normalized = query.trim().toLocaleLowerCase();
  const matching = principles.filter(principle => `${copy.entries[principle.slug].name} ${copy.entries[principle.slug].englishName} ${principle.acronym}`.toLocaleLowerCase().includes(normalized));
  return <>
    <div className="directory-top principle-directory-top"><label className="directory-search" htmlFor={id}><MagnifyingGlassIcon/><input id={id} type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search}/></label></div>
    <nav className="directory-scroll" aria-label={copy.title}>
      {!matching.length ? <p className="directory-empty">{copy.empty}</p> : <Accordion.Root key={normalized ? "search":"browse"} type="multiple" defaultValue={[...principleGroups]}>
        {principleGroups.map(group => {
          const items = matching.filter(principle=>principle.group===group);
          if (!items.length) return null;
          return <Accordion.Item key={group} value={group} className="directory-group">
            <Accordion.Header><Accordion.Trigger className="directory-trigger"><span>{copy.groups[group].name}</span><span className="directory-count">{items.length}</span><ChevronDownIcon/></Accordion.Trigger></Accordion.Header>
            <Accordion.Content className="directory-items">{items.map(({slug})=><Link className="directory-pattern" key={slug} href={`/principles/${slug}`} onClick={onNavigate} aria-current={current===slug?"page":undefined}>{copy.entries[slug].name}</Link>)}</Accordion.Content>
          </Accordion.Item>;
        })}
      </Accordion.Root>}
    </nav>
    {current && <ChapterNavigation label={copy.onThisPage} enabled={tocEnabled} onNavigate={onNavigate}/>}
  </>;
}
