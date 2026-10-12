"use client";

import {useEffect,useRef} from "react";

// Tocbot owns generation and scroll tracking; the article headings are the only source.
export function ChapterNavigation({label,enabled,onNavigate}: {label:string;enabled:boolean;onNavigate?:()=>void}) {
  const container=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!enabled || !container.current)return;
    let disposed=false;
    let cleanup=()=>{};
    void import("tocbot").then(({default:tocbot})=>{
      if(disposed || !container.current)return;
      const toc=container.current;
      const content=document.querySelector<HTMLElement>("main.lesson-grid");
      if(!content)return;
      const desktop=window.matchMedia("(min-width:1025px)");
      function prepareHeadings() {
        for(const heading of content!.querySelectorAll<HTMLElement>("h1,h2")) {
          if(heading.closest(".lesson-lab") || heading.id)continue;
          // Existing section anchors remain valid; additional headings receive stable IDs.
          const section=heading.closest<HTMLElement>("[id]");
          const base=section?.id ? `${section.id}-heading` : heading.innerText.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-");
          let id=base || "chapter",suffix=2;
          while(document.getElementById(id))id=`${base}-${suffix++}`;
          heading.id=id;
        }
      }
      function syncCurrent() {
        toc.querySelectorAll("a").forEach(link=>{
          if(link.classList.contains("is-active-link"))link.setAttribute("aria-current","location");
          else link.removeAttribute("aria-current");
        });
      }
      function initialize() {
        prepareHeadings();
        const pane=content!.querySelector<HTMLElement>(".lesson-reading");
        const scrollContainer=desktop.matches && pane ? ".lesson-reading" : null;
        tocbot.init({tocElement:toc,contentElement:content!,headingSelector:"h1,h2",ignoreSelector:".lesson-lab h1, .lesson-lab h2",collapseDepth:6,orderedList:false,hasInnerContainers:true,includeTitleTags:true,includeHtml:true,headingObjectCallback:obj=>{
          const text=document.createElement("span");
          text.className="chapter-label";
          text.textContent=(obj as {textContent:string}).textContent;
          return {...obj,childNodes:[text]};
        },scrollSmooth:false,disableTocScrollSync:true,scrollContainer,headingsOffset:scrollContainer ? pane!.getBoundingClientRect().top+window.scrollY+24 : 100,headingLabelCallback:text=>text.replace(/\s+/g," ").trim(),onClick:()=>onNavigate?.()});
        syncCurrent();
      }
      const linkObserver=new MutationObserver(syncCurrent);
      linkObserver.observe(toc,{subtree:true,attributes:true,attributeFilter:["class"]});
      const contentObserver=new MutationObserver(records=>{
        const headingChanged=records.some(record=>{
          const target=record.target instanceof Element ? record.target : record.target.parentElement;
          if(target?.closest(".lesson-lab"))return false;
          if(target?.closest("h1,h2"))return true;
          return [...record.addedNodes,...record.removedNodes].some(node=>node instanceof Element && !node.closest(".lesson-lab") && (node.matches("h1,h2") || node.querySelector("h1,h2")));
        });
        if(headingChanged)initialize();
      });
      contentObserver.observe(content,{subtree:true,childList:true,characterData:true});
      desktop.addEventListener("change",initialize);
      initialize();
      cleanup=()=>{contentObserver.disconnect();linkObserver.disconnect();desktop.removeEventListener("change",initialize);tocbot.destroy();};
    });
    return ()=>{disposed=true;cleanup();};
  },[enabled,label,onNavigate]);
  return <nav className="chapter-navigation" aria-label={label}><h2>{label}</h2><div ref={container}/></nav>;
}
