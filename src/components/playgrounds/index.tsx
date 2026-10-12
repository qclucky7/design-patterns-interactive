"use client";
import type {NewPatternSlug} from "@/data/lesson-types";
import {DemoFrame,type DemoCopy} from "./shared";
import {SingletonDemo,FactoryMethodDemo,AbstractFactoryDemo,BuilderDemo,PrototypeDemo} from "./creational";
import {AdapterDemo,BridgeDemo,CompositeDemo,DecoratorDemo,FacadeDemo,FlyweightDemo,ProxyDemo} from "./structural";
import {ChainDemo,CommandDemo,InterpreterDemo,IteratorDemo,MediatorDemo,MementoDemo,ObserverDemo,StateDemo,TemplateDemo,VisitorDemo} from "./behavioral";
const demos={singleton:SingletonDemo,"factory-method":FactoryMethodDemo,"abstract-factory":AbstractFactoryDemo,builder:BuilderDemo,prototype:PrototypeDemo,adapter:AdapterDemo,bridge:BridgeDemo,composite:CompositeDemo,decorator:DecoratorDemo,facade:FacadeDemo,flyweight:FlyweightDemo,proxy:ProxyDemo,"chain-of-responsibility":ChainDemo,command:CommandDemo,interpreter:InterpreterDemo,iterator:IteratorDemo,mediator:MediatorDemo,memento:MementoDemo,observer:ObserverDemo,state:StateDemo,"template-method":TemplateDemo,visitor:VisitorDemo};
export function PatternPlayground({slug,copy}: {slug:NewPatternSlug;copy:DemoCopy}) {const Demo=demos[slug];return <DemoFrame copy={copy}><Demo key={slug} copy={copy}/></DemoFrame>;}
