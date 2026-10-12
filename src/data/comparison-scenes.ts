import dagre from "@dagrejs/dagre";
import type {DemoState} from "./comparisons";
import type {Scene} from "./scenes";

// Compute layouts on the server; the client receives only serializable scenes.
export function comparisonScene(state:DemoState):{scene:Scene;labels:Record<string,string>}{
  const names=[...new Set(state.paths.flat())], labels=Object.fromEntries(names.map((name,index)=>[`n${index}`,name]));
  const id=(name:string)=>`n${names.indexOf(name)}`;
  const edges=[...new Set(state.paths.flatMap(path=>path.slice(1).map((target,index)=>`${id(path[index])}>${id(target)}`)))].map(edge=>{const [source,target]=edge.split(">");return {source,target,active:true};});
  // React Flow smoothstep reserves 20px at each end. Leave more than 40px
  // between measured nodes to prevent its two offsets crossing on branches.
  const graph=new dagre.graphlib.Graph().setGraph({rankdir:"LR",nodesep:24,ranksep:72}).setDefaultEdgeLabel(()=>({}));
  Object.keys(labels).forEach(id=>graph.setNode(id,{width:146,height:68}));
  edges.forEach(({source,target})=>graph.setEdge(source,target));
  dagre.layout(graph);
  return {labels,scene:{nodes:Object.keys(labels).map(id=>{const p=graph.node(id);return {id,x:p.x-73,y:p.y-34,active:true};}),edges}};
}
