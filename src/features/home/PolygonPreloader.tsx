import { useEffect, useRef } from 'react';
import gsap from 'gsap';
const forms=['50,8 62,32 90,28 70,50 91,68 62,66 50,93 38,66 9,68 30,50 10,28 38,32','50,5 72,11 89,28 95,50 89,72 72,89 50,95 28,89 11,72 5,50 11,28 28,11','18,10 79,50 55,57 68,88 54,94 42,61 22,78 18,10 18,10 18,10 18,10 18,10','12,18 32,18 32,32 22,50 32,68 32,82 12,82 12,68 22,50 12,32 68,18 88,18','28,10 55,10 76,20 88,42 88,61 76,82 55,92 28,92 28,72 52,72 66,61 66,41 52,30 28,30'];
interface Props{onComplete:()=>void}
export default function PolygonPreloader({onComplete}:Props){
 const root=useRef<HTMLDivElement>(null);const polygon=useRef<SVGPolygonElement>(null);
 useEffect(()=>{if(!root.current||!polygon.current)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){onComplete();return}document.documentElement.classList.add('is-loading');const tl=gsap.timeline({defaults:{ease:'power3.inOut'},onComplete:()=>{document.documentElement.classList.remove('is-loading');onComplete()}});forms.slice(1).forEach((points,index)=>tl.to(polygon.current,{attr:{points},duration:index===forms.length-2?.55:.34,rotation:index%2?42:-24,transformOrigin:'50% 50%'}));tl.to('.preloader__orbit',{scale:1.35,opacity:0,duration:.45},'-=.25').to(root.current,{clipPath:'inset(0 0 100% 0)',duration:.85,ease:'power4.inOut'},'-=.1');return()=>{tl.kill();document.documentElement.classList.remove('is-loading')}} ,[onComplete]);
 return <div className="preloader" ref={root} aria-hidden="true"><div className="preloader__orbit"><svg viewBox="0 0 100 100"><polygon ref={polygon} points={forms[0]}/></svg></div></div>
}
