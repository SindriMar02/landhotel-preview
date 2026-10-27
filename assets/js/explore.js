// M29: native scrolling, one card per button press, no wheel/touch hijack.
export function initExplore(){
 const row=document.querySelector('.place-row');if(!row)return;
 const cards=[...row.querySelectorAll('.place-card-anchor')];
 const previous=document.querySelector('[data-explore-prev]'),next=document.querySelector('[data-explore-next]'),counter=document.querySelector('.place-counter');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const step=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(row).gap);
 const maximum=()=>Math.max(0,row.scrollWidth-row.clientWidth);
 // The counter names the leading card. At desktop end this is 3 / 6 (cards 3–6 visible).
 function update(){
  const index=Math.min(cards.length-1,Math.round(row.scrollLeft/step()));
  counter.textContent=`${index+1} / ${cards.length}`;
  previous.disabled=row.scrollLeft<=1;next.disabled=row.scrollLeft>=maximum()-1;
 }
 let requested=null,timer;
 function move(direction){
  const current=requested??row.scrollLeft;
  requested=Math.max(0,Math.min(maximum(),(Math.round(current/step())+direction)*step()));
  row.scrollTo({left:requested,behavior:reduced.matches?'auto':'smooth'});
 }
 function finish(){requested=null;update();}
 previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 row.addEventListener('scrollend',finish);
 row.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(finish,120);},{passive:true});
 for(const type of ['pointerdown','touchstart','wheel'])row.addEventListener(type,()=>{requested=null;},{passive:true});
 new ResizeObserver(update).observe(row);update();
}
