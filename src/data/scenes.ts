export type SceneNode = {id: string; x: number; y: number; active?: boolean; parentId?: string; container?: boolean};
export type SceneEdge = {source: string; target: string; active?: boolean};
export type Scene = {nodes: SceneNode[]; edges: SceneEdge[]};

const node = (id: string, x: number, y: number, active = false): SceneNode => ({id,x,y,active});
const edge = (source: string, target: string, active = false): SceneEdge => ({source,target,active});
export const strategyScenes: [Scene, Scene, Scene, Scene] = [
  {nodes: [{...node("checkout",0,65),container: true},{...node("conditional",175,62),parentId: "checkout"},node("card",440,0),node("wallet",440,100)], edges: [edge("conditional","card"),edge("conditional","wallet")]},
  {nodes: [{...node("checkout",0,65,true),container: true},{...node("conditional",175,62,true),parentId: "checkout"},node("card",440,0),node("wallet",440,100),node("points",440,200,true)], edges: [edge("conditional","card"),edge("conditional","wallet"),edge("conditional","points",true)]},
  {nodes: [node("checkout",0,100),node("strategy",220,100,true),node("card",440,0),node("wallet",440,100)], edges: [edge("checkout","strategy",true),edge("strategy","card"),edge("strategy","wallet")]},
  {nodes: [node("checkout",0,100),node("strategy",220,100),node("card",440,0),node("wallet",440,100),node("points",440,200,true)], edges: [edge("checkout","strategy"),edge("strategy","card"),edge("strategy","wallet"),edge("strategy","points",true)]}
];
