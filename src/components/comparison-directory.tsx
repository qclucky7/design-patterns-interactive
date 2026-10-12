"use client";

import {useId,useState} from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {ChevronDownIcon,MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {comparisons,type ComparisonDirectoryCopy} from "@/data/comparisons";
import {categories} from "@/data/patterns";
import {Link} from "@/i18n/navigation";

export function ComparisonDirectory({copy,current,onNavigate}:{copy:ComparisonDirectoryCopy;current?:string;onNavigate?:()=>void}){
  const [query,setQuery]=useState("");
  const id=useId(), normalized=query.trim().toLocaleLowerCase();
  const matching=comparisons.filter(pair=>`${copy.entries[pair.slug].title} ${copy.entries[pair.slug].keywords}`.toLocaleLowerCase().includes(normalized));
  return <>
    <div className="directory-top"><label className="directory-search" htmlFor={id}><MagnifyingGlassIcon/><input id={id} type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search}/></label></div>
    <nav className="directory-scroll" aria-label={copy.title}>
      {!matching.length?<p className="directory-empty">{copy.empty}</p>:<Accordion.Root key={normalized?"search":"browse"} type="multiple" defaultValue={normalized||!current?[...categories]:[comparisons.find(pair=>pair.slug===current)?.group??"behavioral"]}>
        {categories.map(group=>{
          const items=matching.filter(pair=>pair.group===group);
          return items.length>0&&<Accordion.Item key={group} value={group} className="directory-group">
            <Accordion.Header><Accordion.Trigger className="directory-trigger"><span>{copy.groups[group].name}</span><span className="directory-count">{items.length}</span><ChevronDownIcon/></Accordion.Trigger></Accordion.Header>
            <Accordion.Content className="directory-items">{items.map(pair=><Link key={pair.slug} href={`/comparisons/${pair.slug}`} className="directory-pattern comparison-directory-link" onClick={onNavigate} aria-current={current===pair.slug?"page":undefined}>{copy.entries[pair.slug].title}</Link>)}</Accordion.Content>
          </Accordion.Item>;
        })}
      </Accordion.Root>}
    </nav>
  </>;
}
