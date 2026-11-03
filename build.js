import {STEPS,FINISHES,DEFAULT_FINISH} from './build-data.js';
import {DG} from './build-dg.js';
let fin=new URLSearchParams(location.search).get('finish')||DEFAULT_FINISH;
const stage=document.getElementById('stage'),wrap=document.getElementById('steps'),spot=document.getElementById('bspot'),tag=document.getElementById('tag'),fb=document.getElementById('fin');
const srcs=[...new Set(STEPS.flatMap(s=>s.stage.includes('{F}')?FINISHES.map(f=>s.stage.replace('{F}',f.key)):[s.stage]))];
const imgs={};for(const s of srcs){const i=new Image();i.className='bg';i.decoding='async';i.loading=s.startsWith('measure')?'eager':'lazy';i.src='build/'+s;i.alt='';stage.insertBefore(i,spot);imgs[s]=i;}
wrap.innerHTML=STEPS.map((s,i)=>`<section class=bs data-i=${i}><div class=card><div class=lab>${s.lab}</div><h2>${s.t}</h2>${s.body}${s.dg?DG[s.dg]:''}</div></section>`).join('');
fb.innerHTML=FINISHES.map(f=>`<button data-k=${f.key}>${f.label}</button>`).join('');
fb.onclick=e=>{const k=e.target.dataset.k;if(k){fin=k;apply(true);}};
const secs=[...wrap.querySelectorAll('.bs')];let cur=-1;
function src(s){return s.stage.replace('{F}',fin);}
function focus(s){
  if(!s.focus){spot.style.opacity=s.soft?.35:0;spot.style.webkitMaskImage=spot.style.maskImage='none';return;}
  const r=stage.getBoundingClientRect(),sc=Math.max(r.width/768,r.height/1024);
  const ox=(r.width-768*sc)*.5,oy=(r.height-1024*sc)*(innerWidth<=760?.66:.55);
  const [x,y,rad]=s.focus,cx=ox+x*sc,cy=oy+y*sc,R=Math.max(rad*sc,70);
  const m=`radial-gradient(${R}px ${R*.8}px at ${cx}px ${cy}px,transparent 0,transparent 55%,#000 100%)`;
  spot.style.webkitMaskImage=spot.style.maskImage=m;spot.style.opacity=1;
}
function apply(force){
  const s=STEPS[cur];if(!s)return;
  for(const k in imgs)imgs[k].classList.toggle('on',k===src(s));
  tag.textContent=`${cur+1}/${STEPS.length} · ${s.t}`;
  fb.style.display=(FINISHES.length>1&&s.stage.includes('{F}'))?'flex':'none';
  fb.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===fin));
  document.querySelectorAll('[data-show]').forEach(g=>g.style.display=g.dataset.show.includes(fin)?'':'none');
  document.querySelectorAll('[data-fin]').forEach(p=>p.textContent=FINISHES.find(f=>f.key===fin).desc);
  focus(s);
}
function tick(){
  const mid=innerWidth<=760?innerHeight*.72:innerHeight*.5;let best=0,bd=1e9;
  secs.forEach((el,i)=>{const r=el.getBoundingClientRect();const c=r.top+r.height/2,d=Math.abs(c-mid);if(d<bd){bd=d;best=i;}
    const p=Math.min(Math.max((innerHeight-r.top)/(innerHeight*.55+Math.min(r.height,innerHeight)*.25),0),1);
    el.style.setProperty('--p',p.toFixed(3));});
  if(best!==cur){cur=best;secs.forEach((e,i)=>e.classList.toggle('act',i===cur));apply();}
}
let q=0;addEventListener('scroll',()=>{if(!q){q=1;requestAnimationFrame(()=>{q=0;tick();});}},{passive:true});
addEventListener('resize',()=>{tick();apply();});tick();window.__ready=true;
