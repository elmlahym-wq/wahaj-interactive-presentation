'use strict';
(() => {
 const dialog=document.getElementById('introDialog'),video=document.getElementById('introVideo'),open=document.getElementById('openIntroVideo');
 let opener;
 function close(){
  video.pause();if(document.fullscreenElement===dialog)document.exitFullscreen().catch(()=>{});
  if(dialog.open)dialog.close();document.body.classList.remove('cinema-open');opener?.focus({preventScroll:true});
 }
 open.addEventListener('click',()=>{
  opener=document.activeElement;dialog.showModal();document.body.classList.add('cinema-open');video.play().catch(()=>{});
  if(dialog.requestFullscreen)dialog.requestFullscreen().catch(()=>{});
 });
 document.getElementById('closeIntroVideo').addEventListener('click',close);
 dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
 dialog.addEventListener('close',()=>{video.pause();document.body.classList.remove('cinema-open')});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
 window.addEventListener('pagehide',()=>video.pause());
})();
