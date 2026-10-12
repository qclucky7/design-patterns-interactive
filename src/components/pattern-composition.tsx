"use client";

import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion, useInView, useReducedMotion} from "motion/react";
import {PauseIcon, PlayIcon, UpdateIcon} from "@radix-ui/react-icons";
import type catalogMessages from "@/i18n/messages/zh-CN/catalog.json";

type Point = {x: number; y: number; rotate: number};
type Scene = {points: Point[]; links: [number, number][]};
// The same four modules retain their identity as their relationships change.
const scenes: Scene[] = [
  {points: [{x:142,y:108,rotate:-12},{x:204,y:95,rotate:-12},{x:155,y:170,rotate:-12},{x:217,y:157,rotate:-12}], links: []},
  {points: [{x:60,y:136,rotate:0},{x:140,y:136,rotate:0},{x:220,y:136,rotate:0},{x:300,y:136,rotate:0}], links: [[0,1],[1,2],[2,3]]},
  {points: [{x:104,y:88,rotate:0},{x:256,y:88,rotate:0},{x:104,y:188,rotate:0},{x:256,y:188,rotate:0}], links: [[0,1],[0,2],[1,3],[2,3]]},
  {points: [{x:268,y:56,rotate:0},{x:90,y:136,rotate:0},{x:268,y:136,rotate:0},{x:268,y:216,rotate:0}], links: [[1,0],[1,2],[1,3]]},
];

// Principle stories retain the brand's four modules but change the relations:
// independent responsibilities, extension, shared abstraction, composition.
const principleScenes: Scene[] = [
  {points:[{x:105,y:85,rotate:0},{x:255,y:85,rotate:0},{x:105,y:195,rotate:0},{x:255,y:195,rotate:0}],links:[]},
  {points:[{x:90,y:136,rotate:0},{x:268,y:56,rotate:0},{x:268,y:136,rotate:0},{x:268,y:216,rotate:0}],links:[[0,1],[0,2],[0,3]]},
  {points:[{x:72,y:198,rotate:0},{x:180,y:66,rotate:0},{x:180,y:198,rotate:0},{x:288,y:198,rotate:0}],links:[[0,1],[2,1],[3,1]]},
  {points:[{x:136,y:94,rotate:0},{x:224,y:94,rotate:0},{x:136,y:182,rotate:0},{x:224,y:182,rotate:0}],links:[[0,1],[0,2],[1,3],[2,3]]},
];

export function PatternComposition({copy,variant="patterns"}: {copy: typeof catalogMessages.animation;variant?:"patterns"|"principles"}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, {amount: 0.3});
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const compositions=variant==="principles"?principleScenes:scenes;
  const scene = compositions[index];
  const advance = () => setIndex(current => (current + 1) % compositions.length);

  useEffect(() => {
    if (!visible || !playing || reduce !== false) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(current => (current + 1) % compositions.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [visible, playing, reduce, index, compositions.length]);

  return <figure ref={ref} className="pattern-composition" aria-label={copy.label} data-scene={index} data-kind={variant}>
    <svg viewBox="0 0 360 272" className="composition-stage" aria-hidden="true">
      <AnimatePresence>
        <motion.g key={index} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.5}}>
          {scene.links.map(([from, to]) => <line key={`${from}-${to}`} x1={scene.points[from].x} y1={scene.points[from].y} x2={scene.points[to].x} y2={scene.points[to].y} stroke="var(--composition-link)" strokeWidth="1.5" />)}
        </motion.g>
      </AnimatePresence>
      {scene.points.map((point, id) => <motion.g key={id} data-module={id} initial={false} animate={point} transition={reduce ? {duration: 0} : {type: "spring", stiffness: 85, damping: 22}}>
        <rect x={-23} y={-23} width={46} height={46} fill={id === 1 ? "#315dce" : id === 2 ? "var(--paper)" : "#191d22"} stroke={id === 2 ? "#191d22" : "none"} strokeWidth={id === 2 ? 5 : 0} />
      </motion.g>)}
    </svg>
    <figcaption className="composition-caption">
      <div className="composition-copy"><strong>{copy.scenes[index].title}</strong><p>{copy.scenes[index].description}</p></div>
      <div className="composition-controls">
        <button type="button" className="composition-next" onClick={advance}><UpdateIcon aria-hidden="true" />{copy.next}</button>
        <button type="button" className="composition-toggle" aria-label={playing ? copy.pause : copy.play} title={playing ? copy.pause : copy.play} aria-pressed={!playing} onClick={() => setPlaying(current => !current)}>{playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}</button>
      </div>
    </figcaption>
  </figure>;
}
