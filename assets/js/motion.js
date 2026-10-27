import {initSky} from './sky.js';
export async function initMotion(gsap,ScrollTrigger){
 const hero=document.querySelector('.hero'),root=document.documentElement;
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 // Hold only enhancement layers while fonts/image decode; content remains interactive.
 const hold=hero&&scrollY<40&&!matchMedia('(prefers-reduced-motion: reduce)').matches?gsap.context(()=>{
  gsap.set('.hero-photo',{scale:1.08,opacity:0});gsap.set('.hero .wordmark-letters>span',{yPercent:105});
  gsap.set(['.hero-intro .eyebrow','.hero-intro>p:last-child','.hero-thumb','.hero-book','.site-header'],{y:16,opacity:0});
 }):null;
 await Promise.race([Promise.all([document.fonts.ready,hero?.querySelector('img')?.decode().catch(()=>{})]),wait(1400)]);
 hold?.revert();
 function fitWordmark(mark){
  mark.style.fontSize='';
  const letters=[...mark.querySelectorAll('.wordmark-letters>span')];
  const width=letters.reduce((sum,l)=>sum+l.getBoundingClientRect().width,0);
  mark.style.fontSize=`${parseFloat(getComputedStyle(mark).fontSize)*mark.clientWidth/width}px`;
  return letters;
 }
 function fit(){
  document.querySelectorAll('.wordmark').forEach(mark=>{
   const letters=fitWordmark(mark);
   if(!mark.closest('.hero'))return;
   const drift=document.querySelector('.wordmark-drift'),first=letters[0],probe=document.createElement('i');
   drift.style.bottom='';Object.assign(probe.style,{display:'inline-block',width:'0',height:'0'});first.append(probe);
   const baseline=probe.getBoundingClientRect().top-Number(gsap.getProperty(first,'y'))-Number(gsap.getProperty(first,'yPercent'))*first.offsetHeight/100-Number(gsap.getProperty(drift,'y'));
   const gap=parseFloat(getComputedStyle(drift).bottom),shift=hero.getBoundingClientRect().bottom-gap-baseline;
   probe.remove();drift.style.bottom=`${gap-shift}px`;
  });
  const spread=document.querySelector('.spread-word');if(spread){spread.style.fontSize='var(--display)';const total=[...spread.children].reduce((n,el)=>n+el.getBoundingClientRect().width,0);if(total>spread.clientWidth)spread.style.fontSize=`${parseFloat(getComputedStyle(spread).fontSize)*spread.clientWidth/total}px`;}
 }
 fit();document.fonts.ready.then(()=>{fit();ScrollTrigger.refresh();});
 let resize;addEventListener('resize',()=>{clearTimeout(resize);resize=setTimeout(()=>{fit();ScrollTrigger.refresh();},150);});
 const header=document.querySelector('.site-header');
 // M5 uses a stationary hero edge and stays independent from reduced motion.
 function headerState(){header.classList.toggle('is-paper',!hero||hero.getBoundingClientRect().bottom<=header.offsetHeight);}
 addEventListener('scroll',headerState,{passive:true});headerState();
 const mm=gsap.matchMedia();let arrived=false;
 mm.add({normal:'(prefers-reduced-motion: no-preference)',reduced:'(prefers-reduced-motion: reduce)',touch:'(pointer: coarse), (hover: none)'},ctx=>{
  if(ctx.conditions.reduced){root.classList.remove('js');return;}
  root.classList.add('js');const touch=ctx.conditions.touch;
  // Timed reveals keep a stable wrapper as their trigger. A fast pass completes them.
  function reveal(trigger,tl,start='top 85%'){
   const threshold=parseFloat(start.split(' ')[1])/100;
   if(trigger.getBoundingClientRect().top<innerHeight*threshold){tl.progress(1);return;}
   trigger.addEventListener('focusin',()=>tl.progress(1),{once:true});
   ScrollTrigger.create({trigger,start,end:'bottom top',onEnter:()=>tl.play(),onLeave:()=>tl.progress(1),onEnterBack:()=>tl.progress(1)});
  }
  if(hero){
   // M1-M3 load arrival. Controls use opacity, never visibility or pointer-events.
   if(!arrived&&scrollY<40){
    const arrival=gsap.timeline({defaults:{ease:'house'}});
    arrival.fromTo('.hero-photo',{scale:1.08,opacity:0},{scale:1,opacity:1,duration:1.6},0)
     .fromTo('.hero .wordmark-letters>span',{yPercent:105},{yPercent:0,duration:1,stagger:.035},.25)
     .fromTo(['.hero-intro .eyebrow','.hero-intro>p:last-child','.hero-thumb','.hero-book','.site-header'],{y:16,opacity:0},{y:0,opacity:1,duration:.7,stagger:.08,clearProps:'transform'},.7)
     .fromTo('.hero-thumb',{clipPath:'inset(0% 0% 100% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.7},.86);
    // Keyboard focus finishes arrival to keep focused controls visible.
    hero.addEventListener('focusin',()=>arrival.progress(1),{once:true});
   }
   arrived=true;
   // M4: arrival and scroll use separate layers; repeatable from/to endpoints.
   gsap.fromTo('.hero-drift',{yPercent:0},{yPercent:10,ease:'none',scrollTrigger:{id:'M4-photo',trigger:hero,start:'top top',end:'bottom top',scrub:.6}});
   if(!touch)gsap.fromTo('.wordmark-drift',{y:0,opacity:1},{y:()=>-innerHeight*.12,opacity:.2,ease:'none',scrollTrigger:{id:'M4-word',trigger:hero,start:'top top',end:'bottom top',scrub:.6,invalidateOnRefresh:true}});
  }
  // M22 / M6: authored line masks preserve accessible text and natural wrapping.
  document.querySelectorAll('[data-heading]').forEach(h=>reveal(h,gsap.fromTo(h.querySelectorAll('.line>*'),{yPercent:105},{yPercent:0,duration:.9,stagger:.08,ease:'house',paused:true})));
  // M22 / M7: body groups and integer facts, fixed labels.
  document.querySelectorAll('[data-rise]').forEach(el=>{
   const tl=gsap.timeline({paused:true}).fromTo(el,{y:24,opacity:0},{y:0,opacity:1,duration:.8,ease:'house',stagger:.08});
   el.querySelectorAll('[data-count]').forEach(n=>{const state={n:0};tl.to(state,{n:Number(n.dataset.count),duration:1.2,snap:{n:1},ease:'house',onUpdate:()=>n.textContent=state.n},0);});
   reveal(el.parentElement,tl);
  });
  // M8: paired curtain entrances, large first. M9 drift uses their outer layers.
  const collage=document.querySelector('.collage');
  if(collage){const curtains=collage.querySelectorAll('.photo-curtain');const tl=gsap.timeline({paused:true}).fromTo(curtains,{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.2,stagger:.15,ease:'house'},0).fromTo(collage.querySelectorAll('img'),{scale:1.15},{scale:1,duration:1.2,stagger:.15,ease:'house'},0);reveal(collage,tl,'top 80%');
   if(!touch){for(const [selector,from,to] of [['.collage-small',6,-6],['.collage-large',-3,3]])gsap.fromTo(selector,{yPercent:from},{yPercent:to,ease:'none',scrollTrigger:{id:`M9${selector}`,trigger:'.hotel',start:'top bottom',end:'bottom top',scrub:.8}});}
  }
  // M10: phone horizontal cards start visible, never await vertical triggers.
  const grid=document.querySelector('.room-grid');if(grid&&!matchMedia('(max-width:767px)').matches)reveal(grid,gsap.fromTo('.room-card',{y:40,opacity:0},{y:0,opacity:1,duration:.9,stagger:.12,ease:'house',paused:true}),'top 80%');
  const cleanSky=initSky({gsap,ScrollTrigger,touch,reveal});
  // M23: use the same M8 curtain choreography on the lower photo groups.
  document.querySelectorAll('[data-curtains]').forEach(group=>{
   const tl=gsap.timeline({paused:true})
    .fromTo(group.querySelectorAll('.photo-curtain'),{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.2,stagger:.15,ease:'house'},0)
    .fromTo(group.querySelectorAll('img'),{scale:1.15},{scale:1,duration:1.2,stagger:.15,ease:'house'},0);
   reveal(group,tl,'top 80%');
  });
  // M24: breakfast drift has its own wrapper, independent of the curtain.
  if(!touch&&document.querySelector('.dining-breakfast'))gsap.fromTo('.dining-breakfast',{yPercent:6},{yPercent:-6,ease:'none',scrollTrigger:{id:'M24',trigger:'#dining',start:'top bottom',end:'bottom top',scrub:.8}});
  // M25: draw each rule, then lift its text; capacity numbers remain static.
  document.querySelectorAll('[data-rule-row]').forEach((row)=>{
   const index=[...row.parentElement.children].indexOf(row);
   const tl=gsap.timeline({paused:true,delay:index*.08})
    .fromTo(row.querySelector('.row-rule'),{scaleX:0},{scaleX:1,duration:.9,ease:'house'})
    .fromTo(row.querySelectorAll('.row-text'),{y:12,opacity:0},{y:0,opacity:1,duration:.6,ease:'house'});
   reveal(row,tl);
  });
  // M26: individual stable row triggers, with the prescribed stagger.
  document.querySelectorAll('.service-row').forEach((row,i)=>reveal(row,gsap.fromTo(row,{y:24,opacity:0},{y:0,opacity:1,duration:.8,delay:i*.08,ease:'house',paused:true})));
  // M28: native horizontal place cards stay visible on phones.
  const places=document.querySelector('.place-row');if(places&&!matchMedia('(max-width:767px)').matches)reveal(places,gsap.fromTo('.place-card',{y:40,opacity:0},{y:0,opacity:1,duration:.9,stagger:.12,ease:'house',paused:true}),'top 80%');
  // M30: rating uses one decimal; the accessible final rating stays constant.
  const rating=document.querySelector('[data-rating]');if(rating){const state={n:0};reveal(rating.parentElement,gsap.to(state,{n:4.6,duration:1.2,ease:'house',paused:true,onUpdate:()=>rating.textContent=state.n.toFixed(1)}));}
  // M31: same reversible photo drift as M20, no touch parallax.
  if(!touch&&document.querySelector('.booking-photo'))gsap.fromTo('.booking-photo',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{id:'M31',trigger:'.booking-band',start:'top bottom',end:'bottom top',scrub:.8}});
  // M32: replaces M21; legal information is intentionally still.
  const footer=document.querySelector('.footer-columns');if(footer)reveal(footer,gsap.fromTo('.footer-column',{y:24,opacity:0},{y:0,opacity:1,duration:.7,stagger:.08,ease:'house',paused:true}),'top 90%');
  // M33: use the shared fitted letter masks, triggered independently of H1.
  const footerMark=document.querySelector('.footer-wordmark');if(footerMark)reveal(footerMark,gsap.fromTo(footerMark.querySelectorAll('.wordmark-letters>span'),{yPercent:105},{yPercent:0,duration:1,stagger:.035,ease:'house',paused:true}),'top 95%');
  ScrollTrigger.refresh();return()=>{cleanSky?.();if(rating)rating.textContent='4.6';document.querySelectorAll('[data-count]').forEach(n=>n.textContent=n.dataset.count);root.classList.remove('js');};
 });
 addEventListener('load',()=>ScrollTrigger.refresh());
 addEventListener('pageshow',()=>{fit();ScrollTrigger.refresh();headerState();});
 document.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true}));
 return mm;
}
