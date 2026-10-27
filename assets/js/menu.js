import {overlay} from './overlay.js';
export function initMenu(){
 const dialog=document.querySelector('.menu-panel'),trigger=document.querySelector('.menu-toggle');
 const api=overlay({dialog,panel:dialog,trigger,closeButton:dialog.querySelector('.menu-close'),makeTimeline:reduced=>{
  // M16: mounted until reverse completes; native dialog keeps the background inert.
  const tl=gsap.timeline({paused:true,defaults:{ease:'house'}});
  if(reduced)return tl.fromTo(dialog,{opacity:0},{opacity:1,duration:.2});
  return tl.fromTo(dialog,{clipPath:'inset(0% 0% 100% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.7},0).fromTo(dialog.querySelectorAll('nav a'),{y:30,opacity:0},{y:0,opacity:1,duration:.4,stagger:.06},.12);
 }});
 trigger.addEventListener('click',e=>api.state==='closed'||api.state==='closing'?api.open(e):api.close());
 dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>api.close()));
 matchMedia('(min-width:768px)').addEventListener('change',e=>{if(e.matches)api.close();});return api;
}
