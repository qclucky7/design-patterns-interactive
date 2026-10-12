"use client";

import {useEffect,useRef,useState} from "react";
import Script from "next/script";
import "@pagefind/component-ui/css";
import type {SiteLocale} from "@/i18n/routing";
import type {getInstanceManager} from "@pagefind/component-ui";

const resultTemplate=`<li class="pf-result">
  <div class="pf-result-card"><div class="pf-result-content">
    <p class="search-result-section">{{ meta.section }}</p>
    <p class="pf-result-title"><a class="pf-result-link" href="{{ meta.url | default(url) | safeUrl }}">{{ meta.title }}</a></p>
    {{#if excerpt}}<p class="pf-result-excerpt">{{+ excerpt +}}</p>{{/if}}
  </div></div>
  {{#if sub_results}}<ul class="pf-heading-chips">{{#each sub_results as sub}}
    <li class="pf-heading-chip"><a class="pf-heading-link" href="{{ sub.url | safeUrl }}">{{ sub.title }}</a><p class="pf-heading-excerpt">{{+ sub.excerpt +}}</p></li>
  {{/each}}</ul>{{/if}}
</li>`;

// The official web components own focus, shortcuts, result rendering and search state.
// Mount after hydration so their DOM enhancements do not compete with React.
export function SiteSearch({locale,label}:{locale:SiteLocale;label:string}) {
  const host=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const container=host.current;
    if(!container||!ready)return;
      const instance=`site-${locale}`;
      function component(tag:string) {
        const element=document.createElement(tag);
        element.setAttribute("instance",instance);
        return element;
      }
      const config=document.createElement("pagefind-config");
      config.setAttribute("instance",instance);
      config.setAttribute("bundle-path","/pagefind/");
      config.setAttribute("lang",locale);
      const trigger=document.createElement("pagefind-modal-trigger");
      trigger.setAttribute("instance",instance);
      trigger.setAttribute("placeholder",label);
      const modal=document.createElement("pagefind-modal");
      modal.setAttribute("instance",instance);
      const header=component("pagefind-modal-header");
      header.appendChild(component("pagefind-input"));
      const results=component("pagefind-results");
      const template=document.createElement("script");
      template.type="text/pagefind-template";
      template.textContent=resultTemplate;
      results.appendChild(template);
      // Configure before connecting UI so translations cannot remount an open modal.
      container.replaceChildren(config);
      container.append(trigger,modal);
      // Enhance the official default structure after it connects. Passing live
      // children into the modal causes repeated connected callbacks in browsers.
      modal.querySelector("pagefind-modal-header")?.replaceWith(header);
      modal.querySelector("pagefind-results")?.replaceWith(results);
      return ()=>{
        container.replaceChildren();
        const api=(window as Window & {PagefindComponents?:{getInstanceManager:typeof getInstanceManager}}).PagefindComponents;
        api?.getInstanceManager().removeInstance(instance);
      };
  },[locale,label,ready]);
  // Keep Pagefind's runtime outside Turbopack: its dynamic import resolves a
  // generated URL, not a module in Next's bundle. Next Script loads it once.
  return <><div ref={host} className="site-search" aria-label={label}/><Script src="/pagefind/pagefind-component-ui.js" type="module" onReady={()=>setReady(true)}/></>;
}
