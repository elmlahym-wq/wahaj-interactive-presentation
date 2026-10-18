'use strict';
(() => {
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let running=[],lastSlide=null;
 const allowed=()=>!reduced.matches&&!document.body.classList.contains('motion-off')&&!document.hidden;
 const easing='cubic-bezier(.22,1,.36,1)';
 function stop(){running.forEach(a=>a.cancel());running=[]}
 function move(el,frames,{duration=650,delay=0,iterations=1}={}){
  if(!el||!allowed()||typeof el.animate!=='function')return;
  const animation=el.animate(frames,{duration,delay,easing,iterations,fill:'backwards'});running.push(animation);return animation;
 }
 function arrive(el,delay=0,direction='up'){
  if(!el||el.classList.contains('pending'))return;
  const delta=direction==='side'?'translateX(18px)':'translateY(18px)';
  move(el,[{opacity:.25,transform:delta},{opacity:1,transform:'none'}],{duration:560,delay});
 }
 function openPicture(picture,delay=110){
  if(!picture)return;
  if(picture.classList.contains('portrait')){
   for(let i=0;i<2;i++){
    let panel=picture.querySelector('.shutter-'+i);
    if(!panel){panel=document.createElement('span');panel.className='shutter-piece shutter-'+i;panel.setAttribute('aria-hidden','true');picture.append(panel)}
    move(panel,[{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:850,delay});
   }
  }
  move(picture,[{opacity:.65,transform:'translateY(12px) scale(.98)'},{opacity:1,transform:'none'}],{duration:850,delay});
 }
 function drawGraphic(svg,delay=180){
  if(!svg)return;
  svg.querySelectorAll('path').forEach((path,i)=>{
   if(typeof path.getTotalLength!=='function')return;
   let length;try{length=path.getTotalLength()}catch{return}
   if(!Number.isFinite(length)||length===0)return;
   move(path,[{strokeDasharray:String(length),strokeDashoffset:String(length),opacity:.35},{strokeDasharray:String(length),strokeDashoffset:'0',opacity:1}],{duration:1050,delay:delay+i*55});
  });
 }
 function enter(slide){
  stop();lastSlide=slide;if(!allowed())return;
  // Each slide's motion follows its own reading order and material.
  const member=slide.classList.contains('member');
  if(member){
   const copy=slide.querySelector('.member-copy');
   [...copy.children].forEach((el,i)=>arrive(el,40+i*75,'side'));
   openPicture(slide.querySelector('.portrait'),120);arrive(slide.querySelector('.portrait-label'),400);
   drawGraphic(slide.querySelector('.role-graphic svg'),230);
   move(slide.querySelector('.badge'),[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:400,delay:490});
   return;
  }
  if(slide.classList.contains('all-team')){
   arrive(slide.querySelector('h1'),0);
   slide.querySelectorAll('.team-mini').forEach((card,i)=>{arrive(card,100+i*80,'side');openPicture(card.querySelector('.mini-pic'),130+i*60)});
   arrive(slide.querySelector('.team-note'),620);return;
  }
  if(slide.classList.contains('cover')){
   arrive(slide.querySelector('.eyebrow'),0);move(slide.querySelector('.big'),[{opacity:.25,transform:'translateY(24px) scale(.97)'},{opacity:1,transform:'none'}],{duration:900,delay:60});arrive(slide.querySelector('.lead'),230);arrive(slide.querySelector('.small'),340);return;
  }
  if(slide.classList.contains('a2z-movie')){
   arrive(slide.querySelector('.movie-copy'),0,'side');openPicture(slide.querySelector('.a2z-screen'),140);return;
  }
  arrive(slide.querySelector('.eyebrow'),0);arrive(slide.querySelector('h1'),75);
  const beats=[...slide.querySelectorAll('.story-beat')];
  if(!beats.length)slide.querySelectorAll('.lead,.small').forEach((p,i)=>arrive(p,170+i*65));
  beats.filter(el=>el.classList.contains('revealed')).forEach((el,i)=>revealBeat(el,130+i*60));
  slide.querySelectorAll('.light-art,.a2z-art,.a2z-orb,.hook-visual,.orbit-art').forEach((el,i)=>{
   openPicture(el,150+i*60);drawGraphic(el.querySelector('svg'),320+i*60);
  });
  slide.querySelectorAll('.graphic-caption,.a2z-sticker,.hook-bottom,.a2z-journey span,.a2z-cta').forEach((el,i)=>arrive(el,300+i*60));
 }
 function revealBeat(beat,delay=0){
  if(beat.matches('article')){
   arrive(beat,delay,'side');
   beat.querySelectorAll('h2,p').forEach((el,i)=>arrive(el,delay+60+i*65));
   drawGraphic(beat.querySelector('svg'),delay+150);
  }else arrive(beat,delay);
 }
 const previousUpdate=update;
 update=function(){
  const slide=slides[current],visible=new Set(slide.querySelectorAll('.story-beat.revealed'));
  previousUpdate();
  slide.querySelectorAll('.story-beat.revealed').forEach(beat=>{if(!visible.has(beat))revealBeat(beat)});
 };
 const previousShow=show;
 show=function(index){previousShow(index);enter(slides[current])};
 document.getElementById('deckMotion').addEventListener('click',()=>{if(!allowed())stop()});
 reduced.addEventListener?.('change',()=>{if(!allowed())stop()});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)running.forEach(a=>a.pause());else if(allowed())running.forEach(a=>a.play());else stop();
 });
 const cinema=document.getElementById('videoDialog');
 document.getElementById('openA2ZVideo').addEventListener('click',()=>move(cinema,[{opacity:.4,transform:'translateY(14px) scale(.985)'},{opacity:1,transform:'none'}],{duration:400}));
 enter(slides[current]);
})();
