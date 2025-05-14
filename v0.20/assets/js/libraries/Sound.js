/**
* @author Slender303YT, josebarriav2011@gmai.com
*/

!function(e){"use strict";let a=e.Sound={},l=new Map,t=e=>{let a=new Audio;return a.src=e,a};a.path="./",a.load_sound=e=>{let a=t(`${Sound.path}/${e}`);l.set(e,a)},a.play_sound=(e,a=1,t=1)=>{let p=l.get(e);p.volume=t,p.playbackRate=a,p.play()},a.play_music=(e,a=!1,t=1,p=1)=>{let u=l.get(e);u.loop=a,u.volume=p,u.playbackRate=t,u.play()},a.pause_sound=e=>{l.get(e).pause()},a.resume_sound=e=>{l.get(e).play()},a.loadplay_sound=(e,a=1,l=1)=>{let t=new Audio;t.src=`${Sound.path}/${e}`,t.volume=l,t.playbackRate=a,t.play()}}(this);