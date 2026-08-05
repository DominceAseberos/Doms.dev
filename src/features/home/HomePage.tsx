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
const featured=portfolio.projects.filter(project=>project.featuredInTunnel).slice(0,2);
const gallery=['Interface study','System thinking','Motion detail','Product story','Visual experiment','Build process'];

function MorphingBrand(){
 const brand=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{if(!brand.current)return;const words=brand.current.querySelectorAll('span');gsap.set(words[1],{yPercent:130,rotateX:-55,opacity:0});const timeline=gsap.timeline({repeat:-1,repeatDelay:.45});timeline.to(words[0],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},2).to(words[1],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<').to(words[1],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},'+=2').to(words[0],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<');return()=>timeline.kill()},[]);
 return <a className="brand" href="/" aria-label="Domince Aseberos home"><span className="brand__morph" ref={brand}><span>Domince</span><span>Developer</span></span></a>
}

function AnimatedGlobe(){return <svg className="globe" viewBox="0 0 64 64" role="img" aria-label="Animated globe"><circle cx="32" cy="32" r="25"/><ellipse cx="32" cy="32" rx="11" ry="25"/><path d="M7 32h50M11 20h42M11 44h42"/><g className="globe__orbit"><circle cx="54" cy="23" r="3"/></g></svg>}
function MotionGlyph(){return <span className="motion-glyph" aria-hidden="true"><svg viewBox="0 0 56 56"><circle className="motion-glyph__track" cx="28" cy="28" r="20"/><path className="motion-glyph__arrow" d="M18 19 37 38m0-10v10H27"/><g className="motion-glyph__orbiter"><circle className="motion-glyph__dot" cx="28" cy="8" r="3"/></g></svg></span>}
function SplitFlapRole(){
 const roles=[['Frontend','Developer'],['Backend','Developer'],['Creative','']];
 const [active,setActive]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setActive(value=>(value+1)%roles.length),2800);return()=>window.clearInterval(timer)},[]);
 return <div className="split-flap" aria-live="polite" aria-label={roles[active].filter(Boolean).join(' ')} key={active}>
  {roles[active].filter(Boolean).map((line,rowIndex)=><span className="split-flap__row" key={`${active}-${rowIndex}`}>
   {line.toUpperCase().split('').map((letter,letterIndex)=><span className="split-flap__letter" style={{animationDelay:`${rowIndex*120+letterIndex*75}ms`}} key={`${active}-${rowIndex}-${letterIndex}`}><span>{letter}</span></span>)}
  </span>)}
 </div>
}
function HeroMarquee(){
 const loop=useRef<HTMLSpanElement>(null);const firstItem=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{if(!loop.current||!firstItem.current)return;const distance=firstItem.current.getBoundingClientRect().width;const tween=gsap.to(loop.current,{x:-distance,duration:distance/45,ease:'none',repeat:-1});const container=loop.current.parentElement;const pause=()=>tween.pause();const play=()=>tween.play();container?.addEventListener('mouseenter',pause);container?.addEventListener('mouseleave',play);container?.addEventListener('focusin',pause);container?.addEventListener('focusout',play);return()=>{tween.kill();container?.removeEventListener('mouseenter',pause);container?.removeEventListener('mouseleave',play);container?.removeEventListener('focusin',pause);container?.removeEventListener('focusout',play)}},[]);
 return <h1 className="hero__name-track" id="hero-title"><span className="hero__name-loop" ref={loop}><span className="hero__name-item" ref={firstItem} data-hero-reveal><span>Domince</span> <em>Aseberos</em> <i>✦</i></span><span className="hero__name-item" aria-hidden="true"><span>Domince</span> <em>Aseberos</em> <i>✦</i></span></span></h1>
}

export default function HomePage(){
 const root=useRef<HTMLDivElement>(null);const [loaded,setLoaded]=useState(false);const [menuOpen,setMenuOpen]=useState(false);const finishLoading=useCallback(()=>setLoaded(true),[]);
 useLayoutEffect(()=>{if(!loaded||!root.current)return;gsap.registerPlugin(ScrollTrigger);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const lenis=reduced?null:new Lenis({duration:1.15,smoothWheel:true});let frame=0;const raf=(time:number)=>{lenis?.raf(time);frame=requestAnimationFrame(raf)};if(lenis)frame=requestAnimationFrame(raf);lenis?.on('scroll',ScrollTrigger.update);
 const context=gsap.context(()=>{gsap.from('[data-hero-reveal]',{yPercent:110,duration:1.1,stagger:.08,ease:'power4.out'});if(!reduced){gsap.to('.hero__portrait',{yPercent:-14,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element=>gsap.from(element,{y:70,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 88%'}}));gsap.to('.gallery-row--one',{xPercent:-9,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top bottom',end:'bottom top',scrub:true}});gsap.fromTo('.gallery-row--two',{xPercent:-9},{xPercent:0,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top bottom',end:'bottom top',scrub:true}})}},root);
 return()=>{cancelAnimationFrame(frame);lenis?.destroy();context.revert();ScrollTrigger.getAll().forEach(trigger=>trigger.kill())}},[loaded]);
 return <div className="home" ref={root}>
  {!loaded&&<PolygonPreloader onComplete={finishLoading}/>}
  <header className="site-header"><MorphingBrand/><nav className="desktop-nav" aria-label="Primary navigation"><a href="/projects">Work</a><a href="/about">About</a><a href="/feed">Feed</a><a href="/contact">Contact</a></nav><button className={`menu-button ${menuOpen?'is-open':''}`} type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={()=>setMenuOpen(value=>!value)}><span/><span/></button></header>
  <aside className={`menu-panel ${menuOpen?'is-open':''}`} aria-hidden={!menuOpen}><span className="eyebrow">Navigation</span><nav><a href="/">Home</a><a href="/projects">Work</a><a href="/about">About</a><a href="/feed">Feed</a><a href="/contact">Contact</a></nav></aside>
  <main>
   <section className="hero" aria-labelledby="hero-title"><div className="hero__location"><span className="hero__location-index">08° N · 125° E</span><strong>Based in<br/>Davao, Philippines</strong><div className="hero__globe"><AnimatedGlobe/></div></div><div className="hero__portrait" aria-label="Portrait placeholder"><span>Portrait<br/>placeholder</span></div><div className="hero__role"><MotionGlyph/><SplitFlapRole/></div><div className="hero__name-window"><HeroMarquee/></div></section>
   <section className="intro section-shell"><h2 data-reveal>I build digital experiences where systems, story, and interaction move as one.</h2><div data-reveal><p>{landingJson.hero.bio}</p><a className="round-link" href="/about">About me <span>↗</span></a></div></section>
   <section className="work section-shell" aria-labelledby="work-title"><div className="section-heading" data-reveal><span className="eyebrow">Selected work</span><h2 id="work-title">Built with intent.</h2></div><div className="work-grid">{featured.map((project,index)=><a className="project-card" href={`/projects/${project.id}`} key={project.id} data-reveal><div className={`project-card__media project-card__media--${index+1}`}><span>Project image placeholder</span><b>0{index+1}</b></div><h3>{project.title}</h3><div><span>{project.projectType}</span><time>{project.dateCreated?.slice(0,4)}</time></div></a>)}</div><a className="pill-link" href="/projects">View all 14 projects <span>↗</span></a></section>
   <section className="gallery" aria-label="Visual experiments">{[0,1].map(row=><div className={`gallery-row gallery-row--${row?'two':'one'}`} key={row}>{gallery.slice(row*3,row*3+3).map((label,index)=><div className={`gallery-placeholder gallery-placeholder--${row}-${index}`} key={label}><span>{label}</span></div>)}</div>)}</section>
  </main>
  <footer className="footer"><div className="footer__curve"/><div className="footer__inner section-shell"><div className="footer__title" data-reveal><span className="avatar-placeholder">DA</span><h2>Let’s build<br/>something meaningful.</h2></div><a className="contact-orb" href="/contact">Get in touch <span>↗</span></a><div className="footer__line"/><div className="footer__links"><a href={`mailto:${landingJson.story.connect.email}`}>{landingJson.story.connect.email}</a><a href={landingJson.story.connect.linkedinUrl}>LinkedIn</a><a href={landingJson.story.connect.githubUrl}>GitHub</a></div><div className="footer__meta"><span>© 2026 Domince Aseberos</span><span>Davao, Philippines</span><span>Local time · GMT+8</span></div></div></footer>
 </div>
}
