import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import landingJson from '../data/landingData.json';
import './global-footer.css';

export default function GlobalFooter() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo('.footer__wave--back',
        { xPercent: 2, yPercent: 4 },
        { xPercent: -2, yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top center', scrub: true } }
      );
      gsap.fromTo('.footer__wave--front',
        { xPercent: -2, yPercent: 8 },
        { xPercent: 2, yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top center', scrub: true } }
      );

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.from(element, { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%' } });
      });
    }, root);

    return () => {
      context.revert();
    };
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
        <a className="contact-orb" href="/contact">
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
