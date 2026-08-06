import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './global-header.css';

function MorphingBrand(){
 const brand=useRef<HTMLSpanElement>(null);
 useEffect(()=>{if(!brand.current)return;const words=brand.current.querySelectorAll('span');gsap.set(words[1],{yPercent:130,rotateX:-55,opacity:0});const timeline=gsap.timeline({repeat:-1,repeatDelay:.45});timeline.to(words[0],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},2).to(words[1],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<').to(words[1],{yPercent:-130,rotateX:55,opacity:0,duration:.65,ease:'power3.inOut'},'+=2').to(words[0],{yPercent:0,rotateX:0,opacity:1,duration:.65,ease:'power3.inOut'},'<');return()=>{timeline.kill()}},[]);
 return <a className="brand" href="/" aria-label="Domince Aseberos home"><span className="brand__morph" ref={brand}><span>Domince</span><span>Developer</span></span></a>
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
