"use client";

import {useId, useState} from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import {ChevronDownIcon, Cross2Icon, HamburgerMenuIcon, MagnifyingGlassIcon, ReaderIcon, LayersIcon, MixIcon} from "@radix-ui/react-icons";
import {Link} from "@/i18n/navigation";
import {categories, patterns, isPatternAvailable} from "@/data/patterns";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";
import {ChapterNavigation} from "./chapter-navigation";
import {PrincipleDirectory,type PrincipleDirectoryCopy} from "./principle-directory";
import {ComparisonDirectory} from "./comparison-directory";
import type {ComparisonDirectoryCopy} from "@/data/comparisons";

export type DirectoryCopy = typeof catalogMessages;

function Directory({copy, current, onNavigate, tocEnabled=true}: {copy: DirectoryCopy; current?: string; onNavigate?: () => void;tocEnabled?:boolean}) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const normalized = query.trim().toLocaleLowerCase();
  const matching = patterns.filter(({slug}) => {
    const item = copy.patterns[slug];
    return `${item.name} ${item.englishName}`.toLocaleLowerCase().includes(normalized);
  });
  return <>
    <div className="directory-top">
      <label className="directory-search" htmlFor={searchId}><MagnifyingGlassIcon /><input id={searchId} value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} type="search" /></label>
    </div>
    <nav className="directory-scroll" aria-label={copy.directory}>
      {matching.length === 0 ? <p className="directory-empty">{copy.empty}</p> :
        <Accordion.Root key={normalized ? "search" : "browse"} type="multiple" defaultValue={normalized || !current ? [...categories] : [patterns.find(pattern => pattern.slug === current)?.category ?? "behavioral"]}>
          {categories.map(category => {
            const items = matching.filter(pattern => pattern.category === category);
            if (!items.length) return null;
            return <Accordion.Item key={category} value={category} className="directory-group">
              <Accordion.Header><Accordion.Trigger className="directory-trigger"><span>{copy.categories[category].name}</span><span className="directory-count">{items.length}</span><ChevronDownIcon /></Accordion.Trigger></Accordion.Header>
              <Accordion.Content className="directory-items">{items.map(({slug}) => <div key={slug}>
                {isPatternAvailable(slug) ? <Link href={`/patterns/${slug}`} onClick={onNavigate} aria-current={slug === current ? "page" : undefined} className="directory-pattern">{copy.patterns[slug].name}</Link>
                  : <span className="directory-pattern pending" title={copy.pending}><span>{copy.patterns[slug].name}</span><span className="pending-label">{copy.pending}</span></span>}
              </div>)}</Accordion.Content>
            </Accordion.Item>;
          })}
        </Accordion.Root>}
    </nav>
    {current && <ChapterNavigation label={copy.onThisPage} enabled={tocEnabled} onNavigate={onNavigate}/>}
  </>;
}

export function SiteNavigation({copy, current, principlesCopy, comparisonsCopy, section="patterns"}: {copy: DirectoryCopy; current?: string;principlesCopy:PrincipleDirectoryCopy;comparisonsCopy:ComparisonDirectoryCopy;section?:"patterns"|"principles"|"comparisons"}) {
  const [open, setOpen] = useState(false);
  const activeCopy = section === "comparisons" ? comparisonsCopy : section === "principles" ? principlesCopy : copy;
  function directory(tocEnabled:boolean,onNavigate?:()=>void) {
    return <>
      <nav className="section-navigation" aria-label={`${principlesCopy.patternSection} / ${principlesCopy.title}`}>
        <Link href="/" onClick={onNavigate} aria-current={section==="patterns"?"page":undefined}><ReaderIcon aria-hidden="true"/>{principlesCopy.patternSection}</Link>
        <Link href="/principles" onClick={onNavigate} aria-current={section==="principles"?"page":undefined}><LayersIcon aria-hidden="true"/>{principlesCopy.title}</Link>
        <Link href="/comparisons" onClick={onNavigate} aria-current={section==="comparisons"?"page":undefined}><MixIcon aria-hidden="true"/>{comparisonsCopy.title}</Link>
      </nav>
      {section==="comparisons"?<ComparisonDirectory key={current??"comparisons"} copy={comparisonsCopy} current={current} onNavigate={onNavigate}/>:section === "principles" ? <PrincipleDirectory key={current??"principles"} copy={principlesCopy} current={current} onNavigate={onNavigate} tocEnabled={tocEnabled}/> : <Directory key={current??"catalog"} copy={copy} current={current} onNavigate={onNavigate} tocEnabled={tocEnabled}/>}
    </>;
  }
  return <>
    <aside className="site-sidebar">{directory(!open)}</aside>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="mobile-menu-trigger" aria-label={activeCopy.menu}><HamburgerMenuIcon /></Dialog.Trigger>
      <Dialog.Portal><Dialog.Overlay className="directory-overlay" /><Dialog.Content className="directory-drawer" aria-describedby={undefined}>
        <div className="drawer-heading"><Dialog.Title>{section==="comparisons"?comparisonsCopy.title:section==="principles"?principlesCopy.title:copy.directory}</Dialog.Title><Dialog.Close aria-label={activeCopy.close}><Cross2Icon /></Dialog.Close></div>
        {directory(true,()=>setOpen(false))}
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
  </>;
}
