'use strict';
(() => {
 const button=document.getElementById('deckSound');
 let enabled=true,context;
 const blocked=()=>document.hidden||!!document.querySelector('.cinema-dialog[open]');
 function label(){button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Mute transition effects':'Enable transition effects');button.querySelector('span').textContent=enabled?'Mute effects':'تشغيل المؤثرات';}
 function unlock(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){context??=new Audio();context.resume().catch(()=>{})}}catch{}}
 document.addEventListener('pointerdown',unlock,{capture:true});
 document.addEventListener('keydown',unlock,{capture:true});
 button.addEventListener('click',()=>{enabled=!enabled;label()});
 function swish(backward=false){
  if(!enabled||blocked())return;
  try{
   const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
   context??=new Audio();context.resume().catch(()=>{});
   const count=Math.floor(context.sampleRate*.18),buffer=context.createBuffer(1,count,context.sampleRate),data=buffer.getChannelData(0);
   for(let i=0;i<count;i++)data[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/count);
   const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
   source.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(1600,context.currentTime);filter.frequency.exponentialRampToValueAtTime(350,context.currentTime+.18);gain.gain.value=.36;
   source.connect(filter).connect(gain).connect(context.destination);source.start();
   source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
   // A rounded tonal tap adds definition without a harsh click.
   const tone=context.createOscillator(),tap=context.createGain(),now=context.currentTime;
   tone.type='sine';tone.frequency.setValueAtTime(backward?640:820,now);
   tone.frequency.exponentialRampToValueAtTime(backward?420:540,now+.09);
   tap.gain.setValueAtTime(0,now);tap.gain.linearRampToValueAtTime(.20,now+.008);tap.gain.exponentialRampToValueAtTime(.0001,now+.14);
   tone.connect(tap).connect(context.destination);tone.start(now);tone.stop(now+.15);
   tone.onended=()=>{tone.disconnect();tap.disconnect()};
  }catch{}
 }
 const previous=show;
 show=function(index){const before=current;previous(index);if(before!==current)swish(current<before)};
 label();
})();
