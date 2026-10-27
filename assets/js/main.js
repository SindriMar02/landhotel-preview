import {initLenis,lenis} from './lenis.js';
import {initMotion} from './motion.js';
import {initMenu} from './menu.js';
import {initExplore} from './explore.js';
import {initSheet} from './sheet.js';
const {gsap,ScrollTrigger,CustomEase}=window;
if(gsap&&ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger,CustomEase);CustomEase.create('house','.625,.05,0,1');ScrollTrigger.config({ignoreMobileResize:true});
 initLenis(gsap,ScrollTrigger);
 const menu=initMenu(),sheet=initSheet();
 window.landhotel={menu,sheet,get lenis(){return lenis;}};
 initExplore();
 await initMotion(gsap,ScrollTrigger);
 const row=document.querySelector('.room-grid'),counter=document.querySelector('.room-counter');
 row?.addEventListener('scroll',()=>{const step=row.querySelector('.room-card-anchor').offsetWidth+parseFloat(getComputedStyle(row).gap);counter.textContent=`${Math.min(3,Math.round(row.scrollLeft/step)+1)} / 3`;},{passive:true});
 document.querySelectorAll('[aria-disabled="true"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
 document.documentElement.dataset.ready='true';
}
