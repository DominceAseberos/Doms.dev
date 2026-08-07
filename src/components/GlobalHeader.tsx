import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './global-header.css';

 function MorphingBrand(){
  const brand=useRef<HTMLAnchorElement>(null);
  useGSAP(()=>{
    if(!brand.current)return;
    const words=brand.current.querySelectorAll('.brand__text');
    const blob=brand.current.querySelector('.brand__icon-blob');
    const heart=brand.current.querySelector('.brand__icon-heart');
    
    gsap.set(words[1],{yPercent:130,rotateX:-55,opacity:0});
    gsap.set(heart,{scale:0,opacity:0,rotation:-30});
    
    const overlay = document.getElementById('blob-transition-overlay');
    if (overlay && blob) {
      sessionStorage.removeItem('transition_from_blob');
      const rect = blob.getBoundingClientRect();
      gsap.to(overlay, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
        duration: 0.85,
        ease: 'power3.inOut',
        onComplete: () => overlay.remove()
      });
    }
    
    const timeline=gsap.timeline({repeat:-1,repeatDelay:.45});
    timeline.to(words[0],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},2)
      .to(words[1],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<')
      .to(blob,{scale:0,opacity:0,duration:.65,ease:'power3.inOut'},'<')
      .to(heart,{scale:1,opacity:1,rotation:0,duration:.65,ease:'back.out(1.5)'},'<')
      .to(words[1],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},'+=2')
      .to(words[0],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<')
      .to(heart,{scale:0,opacity:0,rotation:30,duration:.65,ease:'power3.inOut'},'<')
      .to(blob,{scale:1,opacity:1,duration:.65,ease:'back.out(1.5)'},'<');
      
    return()=>{timeline.kill()}
  },{scope:brand});
  
  return (
    <a className="brand" href="/" aria-label="Domince Aseberos home" ref={brand}>
      <div className="brand__icon">
        <div className="brand__icon-blob" />
        <svg className="brand__icon-heart" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <span className="brand__morph">
        <span className="brand__text">Domince</span>
        <span className="brand__text">Developer</span>
      </span>
    </a>
  );
 }

export default function GlobalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <MorphingBrand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/projects">Work</a>
          <a href="/about">About</a>
          <a href="/feed">Feed</a>
          <a href="/contact">Contact</a>
        </nav>
        <button 
          className={`menu-button ${menuOpen ? 'is-open' : ''}`} 
          type="button" 
          aria-expanded={menuOpen} 
          aria-label="Toggle navigation" 
          onClick={() => setMenuOpen(value => !value)}
        >
          <span /><span />
        </button>
      </header>
      <aside className={`menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button 
          className="menu-panel-close" 
          type="button" 
          aria-label="Close navigation" 
          onClick={() => setMenuOpen(false)}
        >
          <span /><span />
        </button>
        <span className="eyebrow">Navigation</span>
        <nav>
          <a href="/">Home</a>
          <a href="/projects">Work</a>
          <a href="/about">About</a>
          <a href="/feed">Feed</a>
          <a href="/contact">Contact</a>
        </nav>
      </aside>
    </>
  );
}
