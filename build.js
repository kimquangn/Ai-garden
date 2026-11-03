import {STEPS,FINISHES,DEFAULT_FINISH} from './build-data.js';
import {DG} from './build-dg.js';
let fin=new URLSearchParams(location.search).get('finish')||DEFAULT_FINISH;
const stage=document.getElementById('stage'),wrap=document.getElementById('steps'),spot=document.getElementById('bspot'),tag=document.getElementById('tag'),fb=document.getElementById('fin');
const srcs=[...new Set(STEPS.flatMap(s=>s.stage.includes('{F}')?FINISHES.map(f=>s.stage.replace('{F}',f.key)):[s.stage]))];
const imgs={};for(const s of srcs){const i=new Image();i.className='bg';i.decoding='async';i.loading=s.startsWith('measure')?'eager':'lazy';i.src='build/'+s;i.alt='';stage.insertBefore(i,spot);imgs[s]=i;}
// Step numbers come from array order only, so headings, the render tag and cross-refs always agree.
const num=Object.fromEntries(STEPS.map((s,i)=>[s.id,i+1]));
const xref=t=>t.replace(/\{step:([\w-]+)\}/g,(m,id)=>`<a href="#step-${id}">${num[id]}</a>`);
// Phone (<=760px): the sticky #stage is hidden by CSS; each step gets its own inline render instead,
// clean by default, framed by the step's view.phone crop (see frame()), so the render never sits on top of the text.
function phoneFig(s){
  const f=s.stage.replace('{F}',fin),a=s.view?.aspect?` style="aspect-ratio:${s.view.aspect}"`:'';
  return `<figure class=bimg data-src="${s.stage}"${a}><img src="build/${f}" alt="" loading=lazy decoding=async></figure>`;
}
wrap.innerHTML=STEPS.map((s,i)=>`<section class=bs id="step-${s.id}" data-i=${i}><div class=card><div class=lab>Step ${i+1} · ${s.lab}</div><h2>${s.t}</h2>${phoneFig(s)}${xref(s.body)}${s.dg?DG[s.dg]:''}</div></section>`).join('');
fb.innerHTML=FINISHES.map(f=>`<button data-k=${f.key}>${f.label}</button>`).join('');
fb.onclick=e=>{const k=e.target.dataset.k;if(k){fin=k;apply(true);}};
const secs=[...wrap.querySelectorAll('.bs')];let cur=-1;
function src(s){return s.stage.replace('{F}',fin);}
const still=matchMedia('(prefers-reduced-motion: reduce)');
// Crop c=[x,y,w,h] in source px: scale so the whole crop fits the box (never below plain cover, at most 1.6x it),
// centre on the crop, clamp so no edge shows. No crop or hidden box: clear inline sizes so CSS gives the clean cover render.
function fit(im,box,c){
  const W=box.clientWidth,H=box.clientHeight,iw=im.naturalWidth||768,ih=im.naturalHeight||1024,st=im.style;
  if(!c||!W||!H){st.width=st.height=st.left=st.top='';return null;}
  const cov=Math.max(W/iw,H/ih),k=Math.min(Math.max(cov,Math.min(W/c[2],H/c[3])),cov*1.6);
  const cx=(c[0]+c[2]/2)*k,cy=(c[1]+c[3]/2)*k;
  st.width=iw*k+'px';st.height=ih*k+'px';
  st.left=Math.min(Math.max(W/2-cx,W-iw*k),0)+'px';st.top=Math.min(Math.max(H/2-cy,H-ih*k),0)+'px';
  return `${cx}px ${cy}px`;
}
// Frame a step's phone render, and the sticky render if it's the active step. Desktop crops count as detail steps:
// one small zoom on activation (CSS transition, not scroll-driven), skipped for reduced motion.
function frame(s){
  const fg=document.querySelector(`#step-${s.id} .bimg`);if(fg)fit(fg.firstChild,fg,s.view?.phone);
  if(s!==STEPS[cur])return;
  for(const k in imgs){const im=imgs[k];if(k!==src(s)){im.style.transform='';continue;}
    const o=fit(im,stage,s.view?.desk);im.style.transformOrigin=o||'';im.style.transform=o&&!still.matches?'scale(1.04)':'';}
}
function apply(force){
  const s=STEPS[cur];if(!s)return;
  for(const k in imgs)imgs[k].classList.toggle('on',k===src(s));
  tag.textContent=`Step ${cur+1} of ${STEPS.length} · ${s.t}`;
  wrap.querySelectorAll('.bimg').forEach(fg=>{const im=fg.firstChild,want='build/'+fg.dataset.src.replace('{F}',fin);if(!im.src.endsWith(want))im.src=want;});
  fb.style.display=(FINISHES.length>1&&s.stage.includes('{F}'))?'flex':'none';
  fb.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===fin));
  document.querySelectorAll('[data-show]').forEach(g=>g.style.display=g.dataset.show.includes(fin)?'':'none');
  document.querySelectorAll('[data-fin]').forEach(p=>p.textContent=FINISHES.find(f=>f.key===fin).desc);
  frame(s);
}
function tick(){
  const mid=innerWidth<=760?innerHeight*.72:innerHeight*.5;let best=0,bd=1e9;
  secs.forEach((el,i)=>{const r=el.getBoundingClientRect();const c=r.top+r.height/2,d=Math.abs(c-mid);if(d<bd){bd=d;best=i;}
    const p=Math.min(Math.max((innerHeight-r.top)/(innerHeight*.55+Math.min(r.height,innerHeight)*.25),0),1);
    el.style.setProperty('--p',p.toFixed(3));});
  if(best!==cur){cur=best;secs.forEach((e,i)=>e.classList.toggle('act',i===cur));apply();}
}
let q=0;addEventListener('scroll',()=>{if(!q){q=1;requestAnimationFrame(()=>{q=0;tick();});}},{passive:true});
wrap.querySelectorAll('.bimg img').forEach((im,i)=>im.addEventListener('load',()=>frame(STEPS[i])));
for(const k in imgs)imgs[k].addEventListener('load',()=>{if(STEPS[cur])frame(STEPS[cur]);});
still.addEventListener('change',()=>{if(STEPS[cur])frame(STEPS[cur]);});
addEventListener('resize',()=>{tick();apply();STEPS.forEach(frame);});tick();STEPS.forEach(frame);
// steps are rendered by JS, so jump to a #step-… hash once they exist
if(location.hash.startsWith('#step-')){const t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView();}
window.__ready=true;
