import Lenis from '../vendor/lenis.mjs';
export let lenis=null;
export function initLenis(gsap,ScrollTrigger){
 const media=matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
 let tick;
 const sync=()=>{
  if(lenis){gsap.ticker.remove(tick);lenis.destroy();lenis=null;}
  if(media.matches){lenis=new Lenis({lerp:.1,wheelMultiplier:1,autoRaf:false});lenis.on('scroll',ScrollTrigger.update);tick=t=>lenis?.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);}
 };
 sync();media.addEventListener('change',sync);
 document.addEventListener('click',e=>{
  const a=e.target.closest('a');if(!a||a.getAttribute('aria-disabled')==='true')return;
  const url=new URL(a.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
  const target=document.getElementById(url.hash.slice(1));if(!target)return;e.preventDefault();
  const top=url.hash==='#top';const move=()=>{if(lenis){lenis.resize();lenis.scrollTo(top?0:target,{offset:top?0:-76,immediate:e.detail===0});}else window.scrollTo({top:top?0:target.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header')),behavior:'instant'});};
  if(document.body.style.position==='fixed')window.addEventListener('overlay:closed',move,{once:true});else move();
  history.replaceState(null,'',url.hash);
 });
}
