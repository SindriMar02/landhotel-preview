export function initSky({gsap,ScrollTrigger,touch,reveal}){
 const section=document.querySelector('.sky-section');if(!section)return;
 const word=section.querySelector('.spread-word'),letters=[...word.children];
 // M17: layout offsets are independent of each span's animated transform.
 gsap.fromTo(letters,{x:(_,el)=>word.clientWidth/2-el.offsetLeft-el.offsetWidth/2,opacity:.2},{x:0,opacity:1,ease:'none',scrollTrigger:{id:'M17',trigger:section,start:'top 100%',end:touch?'top 40%':'top 25%',scrub:.8,invalidateOnRefresh:true}});
 // M18: sample is prerendered; JS animates only its presentation.
 const card=section.querySelector('.sky-card'),count=card.querySelector('.kp-value'),value=Number(count.textContent),n={value:0};
 const tl=gsap.timeline({paused:true,defaults:{ease:'house'}}).fromTo(card,{clipPath:'inset(0% 0% 100% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.9},0).fromTo(card.querySelectorAll('.kp-bar .filled'),{backgroundColor:'var(--line-night)'},{backgroundColor:'var(--aurora)',duration:.08,stagger:.08},.9).to(n,{value,duration:.9,snap:{value:1},onUpdate:()=>count.textContent=n.value},0);
 reveal(card.parentElement,tl,'top 75%');
 // M19: full pulse cycle 2s, paused whenever off screen.
 const dot=card.querySelector('.live-dot'),pulse=gsap.fromTo(dot,{opacity:1},{opacity:.35,duration:1,ease:'sine.inOut',repeat:-1,yoyo:true,paused:true});
 const observer=new IntersectionObserver(([entry])=>entry.isIntersecting?pulse.play():pulse.pause());observer.observe(dot);
 // M20: touch uses the fixed, full photograph.
 if(!touch)gsap.fromTo('.sky-photo',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{id:'M20',trigger:section,start:'top bottom',end:'bottom top',scrub:.8}});
 return ()=>{observer.disconnect();count.textContent=value;};
}
