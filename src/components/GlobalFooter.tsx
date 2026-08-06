import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import landingJson from '../data/landingData.json';
import './global-footer.css';

export default function GlobalFooter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.footer__wave--back',
      { xPercent: 2, yPercent: 4 },
      { xPercent: -2, yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top center', scrub: true } }
    );
    gsap.fromTo('.footer__wave--front',
      { xPercent: -2, yPercent: 8 },
      { xPercent: 2, yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top center', scrub: true } }
    );

    gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current).forEach(element => {
      gsap.from(element, { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%' } });
    });
  }, { scope: root });

  const navigateWithOrb = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const href = target.href;
    
    const wrapper = target.closest('.footer__inner') as HTMLElement;
    if (wrapper) {
      wrapper.style.zIndex = '9999';
    }
    const footer = target.closest('.footer') as HTMLElement;
    if (footer) {
      footer.style.zIndex = '9999';
    }
    
    target.style.animation = 'none';
    target.style.transition = 'none';
    
    sessionStorage.setItem('transition_from_blob', 'true');
    
    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = href;
      }
    });

    tl.to(['.contact-orb span', '.contact-orb i'], {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out'
    })
    .to(target, {
      scale: 60,
      duration: 0.85,
      ease: 'power3.inOut'
    }, 0);
  };

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        gsap.set(['.contact-orb span', '.contact-orb i'], { clearProps: 'all' });
        gsap.set('.contact-orb', { clearProps: 'all' });
        
        const target = document.querySelector('.contact-orb') as HTMLElement;
        if (target) {
          target.style.animation = '';
          target.style.transition = '';
        }
        
        const wrapper = document.querySelector('.footer__inner') as HTMLElement;
        if (wrapper) {
          wrapper.style.zIndex = '';
        }
        const footer = document.querySelector('.footer') as HTMLElement;
        if (footer) {
          footer.style.zIndex = '';
        }
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <footer className="footer" ref={root}>
      <div className="footer__waves" aria-hidden="true">
        <div className="footer__wave footer__wave--back" />
        <div className="footer__wave footer__wave--front" />
      </div>
      <div className="footer__inner section-shell">
        <div className="footer__title" data-reveal>
          <span className="avatar-placeholder">DA</span>
          <h2>Let’s build<br />something meaningful.</h2>
        </div>
        <a className="contact-orb" href="/contact" onClick={navigateWithOrb}>
          <span>Start a<br />conversation</span><i>↗</i>
        </a>
        <div className="footer__line" />
        <div className="footer__links">
          <a href={`mailto:${landingJson.story.connect.email}`}>{landingJson.story.connect.email}</a>
          <a href={landingJson.story.connect.linkedinUrl}>LinkedIn</a>
          <a href={landingJson.story.connect.githubUrl}>GitHub</a>
        </div>
        <div className="footer__meta">
          <span>© {new Date().getFullYear()} Domince Aseberos</span>
          <span>Davao, Philippines</span>
          <span>Local time · GMT+8</span>
        </div>
      </div>
    </footer>
  );
}
