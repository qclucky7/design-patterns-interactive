import sharp from "sharp";
import pngToIco from "png-to-ico";
import {readFile,writeFile} from "node:fs/promises";

// Keep every logo size derived from the single editable vector source.
const source=new URL("../public/brand/logo.svg",import.meta.url);
const svg=await readFile(source,"utf8");
const sizes=[16,32,48];
const files=[];
for(const size of sizes) {
 const file=new URL(`../public/brand/icon-${size}.png`,import.meta.url);
 await sharp(Buffer.from(svg)).resize(size,size).png().toFile(file.pathname.replace(/^\/(\w:)/,"$1"));
 files.push(file.pathname.replace(/^\/(\w:)/,"$1"));
}
await writeFile(new URL("../src/app/favicon.ico",import.meta.url),await pngToIco(files));
await sharp(Buffer.from(svg)).resize(180,180).flatten({background:"#f7f8fa"}).png().toFile(new URL("../public/brand/apple-touch-icon.png",import.meta.url).pathname.replace(/^\/(\w:)/,"$1"));
await writeFile(new URL("../public/brand/favicon.svg",import.meta.url),svg.replace("<g transform",'<style>@media(prefers-color-scheme:dark){.ink{fill:#f3f5f7}.outline{stroke:#f3f5f7}}</style><g transform'));
console.log("Generated SVG favicon, 16/32/48px PNGs, multi-size ICO and 180px touch icon from brand/logo.svg");
