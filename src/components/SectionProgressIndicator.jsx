import React, { useEffect, useState, useRef } from 'react';
import './SectionProgressIndicator.css';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'feed', label: 'Dev Feed' },
  { id: 'github', label: 'GitHub' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

const SectionProgressIndicator = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const elements = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length > 0) {
            const id = visible[0].target.id;
            const idx = SECTIONS.findIndex((s) => s.id === id);
            if (idx >= 0) setActiveIndex(idx);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="spi-root" aria-label="Section navigation">
      {SECTIONS.map((section, i) => (
        <button
          key={section.id}
          type="button"
          className={`spi-dot${i === activeIndex ? ' is-active' : ''}`}
          onClick={() => scrollTo(section.id)}
          title={section.label}
          aria-label={`Scroll to ${section.label}`}
          aria-current={i === activeIndex ? 'true' : undefined}
        >
          <span className="spi-dot-ring" />
          <span className="spi-label">{section.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default SectionProgressIndicator;
