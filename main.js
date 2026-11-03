let THREE;
// Dashboard texture is 3200x2000 (16:10). Stops in image-normalised coords (u right, v down) + zoom (1 = full view).
const STOPS=[
 {u:.5,v:.5,z:1},
 {u:.86,v:.18,z:2.05,t:'Next AI action',c:'The AI proposes one action at a time, like "water 12 min at 21:00", and you approve it. Autonomy runs from Watch → Ask → Act + tell → Auto.'},
 {u:.19,v:.86,z:1.95,t:'Soil moisture by depth',c:'Sensors at 10, 20 and 45 cm. It waters only when the deep layer drops below the 35–45% target, not when the surface looks dry.'},
 {u:.82,v:.86,z:2.0,t:'Weather-aware water plan',c:'Bureau of Meteorology (BoM) forecast + evapotranspiration (ET₀) set each day\'s litres. It skips watering when rain is due and adds more before a 37° day.'},
 {u:.50,v:.86,z:2.2,t:'Plant climate',c:'VPD (air dryness), DLI (daily light) and GDD (heat units) show whether the plants are growing fast or stressed.'},
 {u:.50,v:.90,z:2.25,t:'Disease & pest risk',c:'Early blight after wet nights, fruit fly from trap counts, blossom-end rot from moisture swings. You get an alert before it shows.'},
 {u:.40,v:.30,z:1.55,t:'Camera growth twin',c:'A camera matches each plant to the bed twin: trusses, flowers, fruit colour. Tap a plant to see its card.'},
 {u:.86,v:.62,z:2.05,t:'Harvest countdown & yield',c:'Days to first pick, fruit by ripeness stage, and an estimated season yield range.'},
 {u:.5,v:.5,z:1.05,t:'',c:''}];
const cv=document.getElementById('gl');
let renderer,backend='WebGPU';
try{
  THREE=await import('three/webgpu');
  renderer=new THREE.WebGPURenderer({canvas:cv,antialias:true,forceWebGL:!navigator.gpu||location.search.includes('webgl')});
  await renderer.init();
  backend=renderer.backend.isWebGPUBackend?'WebGPU':'WebGL2 (fallback)';
}catch(e){console.warn(e);THREE=await import('three');renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true});backend='WebGL2 (fallback)';}
document.getElementById('backend').textContent=backend;
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene();scene.background=new THREE.Color('#EFEFED');
const cam=new THREE.PerspectiveCamera(30,1,.01,50);
const tex=await new THREE.TextureLoader().loadAsync(document.getElementById('gl').dataset.src);
tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
const W=1.6,H=1.0;
const plane=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshBasicMaterial({map:tex}));scene.add(plane);
const fov=THREE.MathUtils.degToRad(30);
function fitDist(){const a=innerWidth/innerHeight;const dH=(H/2)/Math.tan(fov/2);return a>W/H?dH:dH*(W/H)/a;}
function resize(){renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
const cap=document.getElementById('cap'),spot=document.getElementById('spot'),hero=document.getElementById('hero');
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
let cur={u:.5,v:.5,z:1},last=-1,spotTarget=0,spotNow=0,spotStop=null;const _v=new THREE.Vector3();
function target(){
  const r=hero.getBoundingClientRect();const total=r.height-innerHeight;
  const p=Math.min(Math.max(-r.top/total,0),1)*(STOPS.length-1);
  const i=Math.min(Math.floor(p),STOPS.length-2),f=p-i;
  // hold at each stop for 45% of the segment, then travel
  const k=ease(Math.min(Math.max((f-.45)/.55,0),1));
  const a=STOPS[i],b=STOPS[i+1];
  const near=k<.5?a:b, show=(k<.15||k>.85);
  if(near!==last){last=near;cap.querySelector('h3').textContent=near.t;cap.dataset.pos=near.v>.7?'top':'bottom';cap.dataset.side=near.u<.4?'right':'left';cap.querySelector('p').textContent=near.c;}
  cap.style.opacity=(show&&near.t)?1:0;
  // spotlight strength: full while holding at a stop, fades while travelling
  const hold=near.t?Math.max(0,1-Math.min(k,1-k)*2/0.35):0; spotTarget=Math.min(1,Math.max(0,hold)); spotStop=near;
  return {u:a.u+(b.u-a.u)*k,v:a.v+(b.v-a.v)*k,z:a.z+(b.z-a.z)*k};
}
renderer.setAnimationLoop(()=>{
  const t=target();for(const q of['u','v','z'])cur[q]+=(t[q]-cur[q])*.12;
  const d=fitDist()/cur.z;
  // clamp so the edge of the image never shows
  const vh=2*d*Math.tan(fov/2),vw=vh*cam.aspect;
  let x=(cur.u-.5)*W,y=(.5-cur.v)*H;
  x=Math.max(-W/2+vw/2,Math.min(W/2-vw/2,x))||0;y=Math.max(-H/2+vh/2,Math.min(H/2-vh/2,y))||0;
  cam.position.set(x+ (cur.z>1.1?.02:0),y-(cur.z>1.1?.015:0),d);cam.lookAt(x,y,0); // slight parallax tilt when zoomed
  renderer.render(scene,cam);
  spotNow+=(spotTarget-spotNow)*.15;
  if(spotStop&&spotNow>.01){
    _v.set((spotStop.u-.5)*W,(.5-spotStop.v)*H,0).project(cam);
    const sx=(_v.x*.5+.5)*innerWidth,sy=(.5-_v.y*.5)*innerHeight;
    const R=Math.max(Math.min(innerWidth,innerHeight)*.30,120);
    const m=`radial-gradient(${R*1.25|0}px ${R|0}px at ${sx|0}px ${sy|0}px,transparent 0,transparent 50%,#000 100%)`;
    if(spot._m!==m){spot._m=m;spot.style.webkitMaskImage=m;spot.style.maskImage=m;}
  }
  spot.style.opacity=spotNow.toFixed(3);
});
window.__ready=true;
