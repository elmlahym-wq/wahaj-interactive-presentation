'use strict';
(() => {
 const cues={"introVideo": [[0, 3, "We are Wahaj."], [3, 6, "Six personalities. Each with a different strength."], [6, 9, "An idea brought us together."], [9, 12, "Every one of us has a spark."], [12, 15, "We bring it to light."], [15, 18, "We called it Wahaj \u2014 a glow."], [18, 21, "Our light is stronger together."], [21, 24, "Created by Mohamed Elmalahi."]], "a2zVideo": [[0, 3, "Any skill you have in mind\u2026"], [3, 6, "Editing, design, marketing and AI filmmaking."], [6, 9, "Just one search away."], [9, 12, "One click to explore the course."], [12, 15, "The journey starts from zero."], [15, 19.5, "Learn. Apply. Build your experience."], [20, 25.5, "All the way to your first client."], [29, 32.5, "From an idea\u2026"], [32.5, 36, "to a skill."], [36, 39, "Your skills are your foundation."], [39, 41.5, "Register now: academy.a2zmarketing.tech | @a2z_.academy"]]};
 Object.entries(cues).forEach(([id,lines])=>{
  const video=document.getElementById(id),bar=document.getElementById(id+'Subtitle');
  function update(){const cue=lines.find(([a,b])=>video.currentTime>=a&&video.currentTime<b);bar.textContent=cue?cue[2]:'';}
  function hideNative(){for(const track of video.textTracks)track.mode='hidden';}
  video.addEventListener('loadedmetadata',()=>{hideNative();update()});
  video.textTracks.addEventListener('addtrack',hideNative);
  ['timeupdate','seeked','play','loadeddata'].forEach(name=>video.addEventListener(name,update));
  video.addEventListener('ended',()=>{bar.textContent=''});
  video.addEventListener('webkitbeginfullscreen',()=>{for(const track of video.textTracks)track.mode='showing'});
  video.addEventListener('webkitendfullscreen',hideNative);
  update();
 });
})();
