import {overlay} from './overlay.js';
export function initSheet(){
 const dialog=document.querySelector('.sheet-dialog'),panel=dialog.querySelector('.room-sheet'),backdrop=dialog.querySelector('.sheet-backdrop');
 const api=overlay({dialog,panel,closeButton:dialog.querySelector('.sheet-close'),makeTimeline:reduced=>{
  // M14 / M15: reversing this exact timeline preserves interrupted progress.
  const tl=gsap.timeline({paused:true,defaults:{ease:'house'}});
  if(reduced)return tl.fromTo(backdrop,{opacity:0},{opacity:.5,duration:.2},0).fromTo(panel,{opacity:0},{opacity:1,duration:.2},0);
  const phone=matchMedia('(max-width:767px)').matches;
  return tl.fromTo(backdrop,{opacity:0},{opacity:.5,duration:.4},0).fromTo(panel,phone?{yPercent:100}:{xPercent:100},phone?{yPercent:0,duration:.7}:{xPercent:0,duration:.7},0).fromTo('#sheet-content > *',{y:20,opacity:0},{y:0,opacity:1,duration:.15,stagger:.06},.25);
 }});
 document.querySelectorAll('.details').forEach(button=>button.addEventListener('click',e=>api.open(e,()=>{document.querySelector('#sheet-content').replaceChildren(document.querySelector(`#room-${button.dataset.room}`).content.cloneNode(true));panel.scrollTop=0;})));
 backdrop.addEventListener('click',api.close);
 return api;
}
