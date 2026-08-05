import {useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import portfolioJson from '../../data/portfolioData.json';
import landingJson from '../../data/landingData.json';
import type {PortfolioData} from '../../types/content';
import PolygonPreloader from './PolygonPreloader';
import './home.css';

const portfolio=portfolioJson as PortfolioData;
const featured=portfolio.projects.filter(project=>project.featuredInTunnel&&project.mainImage).slice(0,6);
const gallery=['Interface study','System thinking','Motion detail','Product story','Visual experiment','Build process'];

function MorphingBrand(){
 const brand=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{if(!brand.current)return;const words=brand.current.querySelectorAll('span');gsap.set(words[1],{yPercent:130,rotateX:-55,opacity:0});const timeline=gsap.timeline({repeat:-1,repeatDelay:.45});timeline.to(words[0],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},2).to(words[1],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<').to(words[1],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},'+=2').to(words[0],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<');return()=>timeline.kill()},[]);
 return <a className="brand" href="/" aria-label="Domince Aseberos home"><span className="brand__morph" ref={brand}><span>Domince</span><span>Developer</span></span></a>
}

function AnimatedGlobe(){return <svg className="globe" viewBox="0 0 64 64" role="img" aria-label="Animated globe"><circle cx="32" cy="32" r="25"/><ellipse cx="32" cy="32" rx="11" ry="25"/><path d="M7 32h50M11 20h42M11 44h42"/><g className="globe__orbit"><circle cx="54" cy="23" r="3"/></g></svg>}
function PolygonAnimal(){
 const shape=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  if(!shape.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const pieces=Array.from(shape.current.querySelectorAll<HTMLElement>('.polygon-animal__piece'));
  const field=shape.current.querySelector<HTMLElement>('.polygon-animal__pieces');
  const target='polygon(32% 0%, 33% 81%, 75% 44%, 9% 3%, 100% 45%, 18% 100%, 20% 32%)';
  gsap.set(pieces,{animationPlayState:'paused'});
  const timeline=gsap.timeline({delay:.3,onComplete:()=>gsap.set(pieces,{clearProps:'transform,opacity,animationPlayState'})});
  if(field)timeline.fromTo(field,{clipPath:'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%, 0% 0%, 100% 100%)'},{clipPath:target,duration:2.2,ease:'power3.inOut'},0);
  timeline.fromTo(pieces,{x:()=>gsap.utils.random(-220,220),y:()=>gsap.utils.random(-170,170),z:()=>gsap.utils.random(-160,180),rotation:()=>gsap.utils.random(-145,145),rotationX:()=>gsap.utils.random(-75,75),rotationY:()=>gsap.utils.random(-75,75),scale:()=>gsap.utils.random(.45,1.25),opacity:.12},{x:0,y:0,z:0,rotation:0,rotationX:0,rotationY:0,scale:1,opacity:1,duration:1.8,stagger:{each:.045,from:'random'},ease:'expo.inOut'},0);
  return()=>timeline.kill();
 },[]);
 return <div className="polygon-animal" ref={shape} role="img" aria-label="Floating polygon fragments assembling into a geometric form">
  <div className="polygon-animal__orbit" aria-hidden="true"/>
  <div className="polygon-animal__pieces" aria-hidden="true">{Array.from({length:18},(_,index)=><i className={`polygon-animal__piece polygon-animal__piece--${index+1}`} key={index}/>)}</div>
  <span className="polygon-animal__label">ASSEMBLED / FORM</span>
 </div>
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
 useLayoutEffect(()=>{if(!loop.current||!firstItem.current)return;const distance=firstItem.current.getBoundingClientRect().width;const tween=gsap.to(loop.current,{x:-distance,duration:distance/45,ease:'none',repeat:-1});const container=loop.current.parentElement;const pause=()=>tween.pause();const play=()=>tween.play();container?.addEventListener('mouseenter',pause);container?.addEventListener('mouseleave',play);container?.addEventListener('focusin',pause);container?.addEventListener('focusout',play);return()=>{tween.kill();container?.removeEventListener('mouseenter',pause);container?.removeEventListener('mouseleave',play);container?.removeEventListener('focusin',pause);container?.removeEventListener('focusout',play)}},[]);
 return <h1 className="hero__name-track" id="hero-title"><span className="hero__name-loop" ref={loop}><span className="hero__name-item" ref={firstItem} data-hero-reveal><span>Domince</span> <em>Aseberos</em> <i>✦</i></span><span className="hero__name-item" aria-hidden="true"><span>Domince</span> <em>Aseberos</em> <i>✦</i></span></span></h1>
}

export default function HomePage(){
 const root=useRef<HTMLDivElement>(null);const [loaded,setLoaded]=useState(false);const [menuOpen,setMenuOpen]=useState(false);const finishLoading=useCallback(()=>setLoaded(true),[]);
 useLayoutEffect(()=>{if(!loaded||!root.current)return;gsap.registerPlugin(ScrollTrigger);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const lenis=reduced?null:new Lenis({duration:1.15,smoothWheel:true});let frame=0;const raf=(time:number)=>{lenis?.raf(time);frame=requestAnimationFrame(raf)};if(lenis)frame=requestAnimationFrame(raf);lenis?.on('scroll',ScrollTrigger.update);
 const context=gsap.context(()=>{gsap.from('[data-hero-reveal]',{yPercent:110,duration:1.1,stagger:.08,ease:'power4.out'});if(!reduced){gsap.to('.hero__portrait',{yPercent:-14,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});gsap.to('.hero__name-window',{yPercent:-72,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.5}});gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element=>gsap.from(element,{y:70,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 88%'}}));gsap.fromTo('.gallery-row--one',{xPercent:0},{xPercent:-6,ease:'none',scrollTrigger:{trigger:'.gallery',start:'center bottom',end:'center top',scrub:true}});gsap.fromTo('.gallery-row--two',{xPercent:0},{xPercent:6,ease:'none',scrollTrigger:{trigger:'.gallery',start:'center bottom',end:'center top',scrub:true}});gsap.to('.footer__mountain--back',{xPercent:-3,yPercent:-10,ease:'none',scrollTrigger:{trigger:'.footer',start:'top bottom',end:'top center',scrub:true}});gsap.fromTo('.footer__mountain--front',{xPercent:-2,yPercent:8},{xPercent:2,yPercent:-8,ease:'none',scrollTrigger:{trigger:'.footer',start:'top bottom',end:'top center',scrub:true}})}},root);
 return()=>{cancelAnimationFrame(frame);lenis?.destroy();context.revert();ScrollTrigger.getAll().forEach(trigger=>trigger.kill())}},[loaded]);
 return <div className="home" ref={root}>
  {!loaded&&<PolygonPreloader onComplete={finishLoading}/>}
  <header className="site-header"><MorphingBrand/><nav className="desktop-nav" aria-label="Primary navigation"><a href="/projects">Work</a><a href="/about">About</a><a href="/feed">Feed</a><a href="/contact">Contact</a></nav><button className={`menu-button ${menuOpen?'is-open':''}`} type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={()=>setMenuOpen(value=>!value)}><span/><span/></button></header>
  <aside className={`menu-panel ${menuOpen?'is-open':''}`} aria-hidden={!menuOpen}><span className="eyebrow">Navigation</span><nav><a href="/">Home</a><a href="/projects">Work</a><a href="/about">About</a><a href="/feed">Feed</a><a href="/contact">Contact</a></nav></aside>
  <main>
   <section className="hero" aria-labelledby="hero-title"><div className="hero__location"><span className="hero__location-index">08° N · 125° E</span><strong>Based in<br/>Davao, Philippines</strong><div className="hero__globe"><AnimatedGlobe/></div></div><div className="hero__portrait"><PolygonAnimal/></div><div className="hero__role"><SplitFlapRole/></div><div className="hero__name-window"><HeroMarquee/></div></section>
   <section className="intro section-shell"><h2 data-reveal>I build digital experiences where systems, story, and interaction move as one.</h2><div data-reveal><p>{landingJson.hero.bio}</p><a className="round-link" href="/about"><span className="round-link__label">Discover<br/>my story</span><span className="round-link__arrow">↗</span></a></div></section>
   <section className="work section-shell" aria-labelledby="work-title"><div className="section-heading" data-reveal><span className="eyebrow">Selected work</span><h2 id="work-title">Built with intent.</h2></div><div className="work-grid">{featured.map((project,index)=><a className="project-card" href={`/projects/${project.id}`} key={project.id} data-reveal><div className={`project-card__media project-card__media--${index+1}`}><img src={project.mainImage} alt={`${project.title} project preview`} loading="lazy"/><b>{String(index+1).padStart(2,'0')}</b></div><h3>{project.title}</h3><div><span>{project.projectType}</span><time>{project.dateCreated?.slice(0,4)}</time></div></a>)}</div><a className="pill-link" href="/projects">View all projects <span>↗</span></a></section>
   <section className="gallery" aria-label="Visual experiments">{[0,1].map(row=><div className={`gallery-row gallery-row--${row?'two':'one'}`} key={row}>{gallery.slice(row*3,row*3+3).map((label,index)=><div className={`gallery-placeholder gallery-placeholder--${row}-${index}`} key={label}><span>{label}</span></div>)}</div>)}</section>
  </main>
  <footer className="footer"><div className="footer__mountains" aria-hidden="true"><div className="footer__mountain footer__mountain--back"/><div className="footer__mountain footer__mountain--front"/></div><div className="footer__inner section-shell"><div className="footer__title" data-reveal><span className="avatar-placeholder">DA</span><h2>Let’s build<br/>something meaningful.</h2></div><a className="contact-orb" href="/contact"><span>Start a<br/>conversation</span><i>↗</i></a><div className="footer__line"/><div className="footer__links"><a href={`mailto:${landingJson.story.connect.email}`}>{landingJson.story.connect.email}</a><a href={landingJson.story.connect.linkedinUrl}>LinkedIn</a><a href={landingJson.story.connect.githubUrl}>GitHub</a></div><div className="footer__meta"><span>© 2026 Domince Aseberos</span><span>Davao, Philippines</span><span>Local time · GMT+8</span></div></div></footer>
 </div>
}
