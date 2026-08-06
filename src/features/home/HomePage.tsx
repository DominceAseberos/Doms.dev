import {useCallback,useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import portfolioJson from '../../data/portfolioData.json';
import landingJson from '../../data/landingData.json';
import type {PortfolioData} from '../../types/content';
import PolygonPreloader from './PolygonPreloader';
import GlobalHeader from '../../components/GlobalHeader';
import GlobalFooter from '../../components/GlobalFooter';
import './home.css';

const portfolio=portfolioJson as PortfolioData;
const featured=portfolio.projects.filter(project=>project.featuredInTunnel&&project.mainImage).slice(0,6);
const gallery=['Interface study','System thinking','Motion detail','Product story','Visual experiment','Build process'];



function AnimatedGlobe(){return <svg className="globe" viewBox="0 0 64 64" role="img" aria-label="Animated globe"><circle cx="32" cy="32" r="25"/><ellipse cx="32" cy="32" rx="11" ry="25"/><path d="M7 32h50M11 20h42M11 44h42"/><g className="globe__orbit"><circle cx="54" cy="23" r="3"/></g></svg>}
function GlassDebrisD(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const cv=canvas.current;if(!cv)return;const context=cv.getContext('2d');if(!context)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  type GlassShard={x:number;y:number;points:[number,number][];phase:number;speed:number;depth:number;rotation:number;color:string;magnetX:number;magnetY:number};
  let width=0,height=0,frame=0,letter:GlassShard[]=[],debris:GlassShard[]=[];
  const pointer={x:0,y:0,active:false};
  const drawShard=(shard:GlassShard,time:number,isDebris=false)=>{
   const drift=isDebris?8+shard.depth*13:.35+shard.depth*.7;
   const dx=Math.sin(time*shard.speed+shard.phase)*drift;
   const dy=Math.cos(time*shard.speed*.73+shard.phase)*drift*.72;
   const sourceX=shard.x+dx,sourceY=shard.y+dy,distance=Math.hypot(pointer.x-sourceX,pointer.y-sourceY),range=isDebris?190:145;
   const influence=pointer.active&&distance<range?Math.pow(1-distance/range,2):0;
   const pull=isDebris?.42:.075,targetX=(pointer.x-sourceX)*influence*pull,targetY=(pointer.y-sourceY)*influence*pull;
   shard.magnetX+=(targetX-shard.magnetX)*(influence?.16:.075);shard.magnetY+=(targetY-shard.magnetY)*(influence?.16:.075);
   const angle=isDebris?shard.rotation+Math.sin(time*.22+shard.phase)*.34:Math.sin(time*.18+shard.phase)*.006;
   context.save();context.translate(sourceX+shard.magnetX,sourceY+shard.magnetY);context.rotate(angle);
   context.beginPath();shard.points.forEach(([px,py],index)=>index?context.lineTo(px,py):context.moveTo(px,py));context.closePath();context.fillStyle=shard.color;context.fill();
   context.strokeStyle='rgba(236,245,255,.82)';context.lineWidth=isDebris?1:.55;context.stroke();
   context.beginPath();context.moveTo(...shard.points[0]);context.lineTo(...shard.points[1]);context.strokeStyle='rgba(255,255,255,.78)';context.lineWidth=1.15;context.stroke();context.restore();
  };
  const build=()=>{
   const bounds=(cv.parentElement??cv).getBoundingClientRect();const nextWidth=Math.min(1200,Math.max(280,bounds.width)),nextHeight=Math.min(900,Math.max(360,bounds.height));
   if(Math.abs(nextWidth-width)<1&&Math.abs(nextHeight-height)<1)return;width=nextWidth;height=nextHeight;const ratio=Math.min(devicePixelRatio||1,2);
   cv.width=Math.round(width*ratio);cv.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);letter=[];debris=[];
   const mask=document.createElement('canvas');mask.width=Math.round(width);mask.height=Math.round(height);const maskContext=mask.getContext('2d');if(!maskContext)return;
   const fontSize=Math.min(height*.78,width*.72);maskContext.font=`800 ${fontSize}px Manrope, Arial, sans-serif`;maskContext.textAlign='center';maskContext.textBaseline='middle';maskContext.fillStyle='#fff';maskContext.fillText('D',width*.5,height*.49);
   const pixels=maskContext.getImageData(0,0,mask.width,mask.height).data;const hit=(x:number,y:number)=>{const px=x|0,py=y|0;return px>=0&&px<mask.width&&py>=0&&py<mask.height&&pixels[(py*mask.width+px)*4+3]>120};
   const step=Math.max(19,Math.min(27,width/24));
   for(let row=0;row<=height/step;row++)for(let column=0;column<=width/step;column++){
    const left=column*step,top=row*step,right=left+step,bottom=top+step,cx=left+step*(.25+Math.random()*.5),cy=top+step*(.25+Math.random()*.5),corners:[[number,number],[number,number],[number,number],[number,number]]=[[left,top],[right,top],[right,bottom],[left,bottom]];
    for(let side=0;side<4;side++){const [ax,ay]=corners[side],[bx,by]=corners[(side+1)%4],centerX=(ax+bx+cx)/3,centerY=(ay+by+cy)/3;if(!hit(centerX,centerY))continue;letter.push({x:centerX,y:centerY,points:[[ax-centerX,ay-centerY],[bx-centerX,by-centerY],[cx-centerX,cy-centerY]],phase:Math.random()*Math.PI*2,speed:.2+Math.random()*.24,depth:Math.random(),rotation:0,magnetX:0,magnetY:0,color:`hsla(${202+Math.random()*28},${68+Math.random()*22}%,${55+Math.random()*24}%,${.48+Math.random()*.34})`});}
   }
   for(let index=0;index<44;index++){
    const angle=Math.random()*Math.PI*2,radiusX=width*(.31+Math.random()*.2),radiusY=height*(.28+Math.random()*.18),size=5+Math.random()*13,pointsCount=3+Math.floor(Math.random()*4),points:[number,number][]=[];
    for(let point=0;point<pointsCount;point++){const pointAngle=point/pointsCount*Math.PI*2+(Math.random()-.5)*.45,pointRadius=size*(.55+Math.random()*.65);points.push([Math.cos(pointAngle)*pointRadius,Math.sin(pointAngle)*pointRadius]);}
    debris.push({x:width/2+Math.cos(angle)*radiusX,y:height/2+Math.sin(angle)*radiusY,points,phase:Math.random()*Math.PI*2,speed:.2+Math.random()*.42,depth:Math.random(),rotation:Math.random()*Math.PI*2,magnetX:0,magnetY:0,color:`hsla(${196+Math.random()*42},82%,${55+Math.random()*25}%,${.34+Math.random()*.42})`});
   }
  };
  const render=(milliseconds=0)=>{context.clearRect(0,0,width,height);const time=milliseconds*.001;letter.forEach(shard=>drawShard(shard,time));debris.forEach(shard=>drawShard(shard,time,true));if(!reduced)frame=requestAnimationFrame(render)};
  const surface=cv.closest('.hero')??cv;
  const move=(event:Event)=>{const point=event as PointerEvent,bounds=cv.getBoundingClientRect();pointer.x=(point.clientX-bounds.left)*(width/bounds.width);pointer.y=(point.clientY-bounds.top)*(height/bounds.height);pointer.active=true};
  const leave=()=>{pointer.active=false};surface.addEventListener('pointermove',move);surface.addEventListener('pointerleave',leave);
  build();render();const observer=new ResizeObserver(()=>{build();if(reduced)render()});observer.observe(cv.parentElement??cv);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);surface.removeEventListener('pointermove',move);surface.removeEventListener('pointerleave',leave)};
 },[]);
 return <canvas className="glass-debris-d" ref={canvas} role="img" aria-label="A glass letter D surrounded by floating polygon debris"/>;
}
function RoleGlyph({role}:{role:string}){return <span className="motion-glyph" aria-hidden="true" key={role}>
 {role==='Frontend'?<svg viewBox="0 0 64 64"><rect x="8" y="11" width="48" height="35" rx="4"/><path d="M8 20h48M24 54h16M32 46v8M25 27l-7 6 7 6M39 27l7 6-7 6"/><circle cx="14" cy="15.5" r="1"/></svg>:<svg viewBox="0 0 64 64"><ellipse cx="32" cy="14" rx="21" ry="8"/><path d="M11 14v14c0 4.4 9.4 8 21 8s21-3.6 21-8V14M11 28v14c0 4.4 9.4 8 21 8s21-3.6 21-8V28"/><circle cx="45" cy="26" r="1.5"/><circle cx="45" cy="40" r="1.5"/></svg>}
 </span>}
function SplitFlapRole(){
 const roles=['Frontend','Backend'];
 const [active,setActive]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setActive(value=>(value+1)%roles.length),2800);return()=>window.clearInterval(timer)},[]);
 return <><RoleGlyph role={roles[active]}/><div className="split-flap" aria-live="polite" aria-label={`${roles[active]} Developer`}>
   <span className="split-flap__word-window"><span className="split-flap__word" key={active}>{roles[active]}</span></span>
   <span className="split-flap__suffix">Developer</span>
  </div></>
}
function HeroMarquee(){
 const loop=useRef<HTMLSpanElement>(null);const firstItem=useRef<HTMLSpanElement>(null);
 useEffect(()=>{if(!loop.current||!firstItem.current)return;const distance=firstItem.current.getBoundingClientRect().width;const tween=gsap.to(loop.current,{x:-distance,duration:distance/45,ease:'none',repeat:-1});const container=loop.current.parentElement;const pause=()=>tween.pause();const play=()=>tween.play();container?.addEventListener('mouseenter',pause);container?.addEventListener('mouseleave',play);container?.addEventListener('focusin',pause);container?.addEventListener('focusout',play);return()=>{tween.kill();container?.removeEventListener('mouseenter',pause);container?.removeEventListener('mouseleave',play);container?.removeEventListener('focusin',pause);container?.removeEventListener('focusout',play)}},[]);
 return <h1 className="hero__name-track" id="hero-title"><span className="hero__name-loop" ref={loop}><span className="hero__name-item" ref={firstItem} data-hero-reveal><span>Domince</span> <em>Aseberos</em> <i>✦</i></span><span className="hero__name-item" aria-hidden="true"><span>Domince</span> <em>Aseberos</em> <i>✦</i></span></span></h1>
}

export default function HomePage(){
 const root=useRef<HTMLDivElement>(null);const [loaded,setLoaded]=useState(false);const finishLoading=useCallback(()=>setLoaded(true),[]);
 useEffect(()=>{if(!loaded||!root.current)return;gsap.registerPlugin(ScrollTrigger);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const lenis=reduced?null:new Lenis({duration:1.15,smoothWheel:true});let frame=0;const raf=(time:number)=>{lenis?.raf(time);frame=requestAnimationFrame(raf)};if(lenis)frame=requestAnimationFrame(raf);lenis?.on('scroll',ScrollTrigger.update);
 const context=gsap.context(()=>{gsap.from('[data-hero-reveal]',{yPercent:110,duration:1.1,stagger:.08,ease:'power4.out'});if(!reduced){gsap.to('.hero__portrait',{yPercent:-14,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});gsap.to('.hero__name-window',{yPercent:-72,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.5}});gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element=>gsap.from(element,{y:70,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 88%'}}));gsap.fromTo('.gallery-row--one',{xPercent:0},{xPercent:-6,ease:'none',scrollTrigger:{trigger:'.gallery',start:'center bottom',end:'center top',scrub:true}});gsap.fromTo('.gallery-row--two',{xPercent:0},{xPercent:6,ease:'none',scrollTrigger:{trigger:'.gallery',start:'center bottom',end:'center top',scrub:true}});}},root);
 return()=>{cancelAnimationFrame(frame);lenis?.destroy();context.revert();ScrollTrigger.getAll().forEach(trigger=>trigger.kill())}},[loaded]);
 return <div className="home" ref={root}>
  {!loaded&&<PolygonPreloader onComplete={finishLoading}/>}
  <GlobalHeader />
  <main>
   <section className="hero" aria-labelledby="hero-title"><div className="hero__location"><span className="hero__location-index">08° N · 125° E</span><strong>Based in<br/>Davao, Philippines</strong><div className="hero__globe"><AnimatedGlobe/></div></div><div className="hero__portrait"><GlassDebrisD/></div><div className="hero__role"><SplitFlapRole/></div><div className="hero__name-window"><HeroMarquee/></div></section>
   <section className="intro section-shell"><h2 data-reveal>I build digital experiences where systems, story, and interaction move as one.</h2><div data-reveal><p>{landingJson.hero.bio}</p></div><div data-reveal className="intro__link-wrapper"><div className="blobs" aria-hidden="true"><div className="blob blob--1"/><div className="blob blob--2"/><div className="blob blob--3"/></div><a className="round-link" href="/about"><span className="round-link__label">Discover<br/>my story</span><span className="round-link__arrow">↗</span></a></div></section>
   <section className="work section-shell" aria-labelledby="work-title"><div className="section-heading" data-reveal><span className="eyebrow">Selected work</span><h2 id="work-title">Built with intent.</h2></div><div className="work-grid">{featured.map((project,index)=><a className="project-card" href={`/projects/${project.id}`} key={project.id} data-reveal><div className={`project-card__media project-card__media--${index+1}`}><img src={project.mainImage} alt={`${project.title} project preview`} loading="lazy"/><b>{String(index+1).padStart(2,'0')}</b></div><h3>{project.title}</h3><div><span>{project.projectType}</span><time>{project.dateCreated?.slice(0,4)}</time></div></a>)}</div><a className="pill-link" href="/projects">View all projects <span>↗</span></a></section>
   <section className="gallery" aria-label="Visual experiments">{[0,1].map(row=><div className={`gallery-row gallery-row--${row?'two':'one'}`} key={row}>{gallery.slice(row*3,row*3+3).map((label,index)=><div className={`gallery-placeholder gallery-placeholder--${row}-${index}`} key={label}><span>{label}</span></div>)}</div>)}</section>
  </main>
  <GlobalFooter />
 </div>
}
