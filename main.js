// Scroll story over the dashboard image. Plain CSS transforms: works in every browser incl. iPhone Safari, no WebGL.
(function(){
const IW=3200,IH=2000;
const STOPS=[
 {u:.5,v:.5,z:1},
 {u:.86,v:.18,z:2.05,t:'One suggested action at a time',c:'The app proposes, e.g. "water 12 min at 21:00", and you approve. Autonomy steps up from Watch → Ask → Act + tell → Auto as it earns trust.'},
 {u:.19,v:.86,z:1.95,t:'Soil moisture, not guesswork',c:'Probes in the bed and in the sweet-tomato bags. Water goes on when the root zone needs it, which is how controlled water stress is run.'},
 {u:.82,v:.86,z:2.0,t:'Weather-aware water plan',c:'The Bureau of Meteorology forecast and evaporation set each day\'s litres. The clear roof keeps rain off, so the drip line decides every drop.'},
 {u:.50,v:.86,z:2.2,t:'Plant climate',c:'Air dryness, daily light and heat units show whether plants are growing fast or stressed, and time the reminders to prune and thin.'},
 {u:.40,v:.30,z:1.55,t:'Camera: rough timing prompts (planned)',c:'A daily photo shows growth. The app gives a heads-up when it\'s about time to thin fruit or pinch side shoots. A nudge, not per-fruit instructions.'},
 {u:.86,v:.62,z:2.05,t:'Harvest, Brix and records',c:'Days to first pick, then every harvest logged with weight and Brix, so next season copies what made the sweetest fruit.'},
 {u:.5,v:.5,z:1.0,t:'',c:''}];
const img=document.getElementById('dash'),hero=document.getElementById('hero'),cap=document.getElementById('cap'),spot=document.getElementById('spot'),intro=document.getElementById('intro');
if(!img)return;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let cur={u:.5,v:.5,z:1},last=null,raf=0,sp=0;
function tgt(){const r=hero.getBoundingClientRect(),tot=r.height-innerHeight;const pr=Math.min(Math.max(-r.top/tot,0),1);
 intro.style.opacity=Math.max(0,1-pr*14);
 const p=pr*(STOPS.length-1),i=Math.min(Math.floor(p),STOPS.length-2),f=p-i,k=ease(Math.min(Math.max((f-.45)/.55,0),1));
 const a=STOPS[i],b=STOPS[i+1],near=k<.5?a:b;
 if(near!==last){last=near;cap.querySelector('h3').textContent=near.t;cap.querySelector('p').textContent=near.c;cap.dataset.side=near.u<.45?'right':'left';cap.dataset.pos=near.v>.7?'top':'bottom';}
 const show=(k<.15||k>.85)&&!!near.t;cap.style.opacity=show?1:0;
 return {t:{u:a.u+(b.u-a.u)*k,v:a.v+(b.v-a.v)*k,z:a.z+(b.z-a.z)*k},near,hold:near.t?Math.max(0,1-Math.min(k,1-k)*2/.35):0};}
function frame(){raf=0;const W=innerWidth,H=innerHeight,{t,near,hold}=tgt();
 for(const q of['u','v','z'])cur[q]+=reduce?(t[q]-cur[q]):(t[q]-cur[q])*.14;
 const phone=W<760, s0=phone?Math.max(W/IW,H*.5/IH):Math.min(W/IW,H/IH), s=s0*cur.z, w=IW*s,h=IH*s;
 let tx=W/2-cur.u*w,ty=H/2-cur.v*h;
 tx=w>W?Math.min(0,Math.max(W-w,tx)):(W-w)/2; ty=h>H?Math.min(0,Math.max(H-h,ty)):(H-h)/2;
 img.style.transform=`translate3d(${tx}px,${ty}px,0) scale(${s})`;
 sp+=(hold-sp)*.15;
 if(near.t&&sp>.01){const sx=tx+near.u*w,sy=ty+near.v*h,R=Math.max(Math.min(W,H)*.3,120);
  const m=`radial-gradient(${R*1.25|0}px ${R|0}px at ${sx|0}px ${sy|0}px,transparent 0,transparent 50%,#000 100%)`;spot.style.webkitMaskImage=m;spot.style.maskImage=m;}
 spot.style.opacity=sp.toFixed(3);
 if(Math.abs(t.z-cur.z)>.002||Math.abs(t.u-cur.u)>.001||Math.abs(t.v-cur.v)>.001||Math.abs(hold-sp)>.01)raf=requestAnimationFrame(frame);}
const kick=()=>{if(!raf)raf=requestAnimationFrame(frame)};
addEventListener('scroll',kick,{passive:true});addEventListener('resize',kick);
if(img.complete)kick();else img.onload=kick;kick();window.__ready=true;
})();
