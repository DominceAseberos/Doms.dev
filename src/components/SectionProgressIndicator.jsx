import React, { useEffect, useState, useRef } from 'react';
import './SectionProgressIndicator.css';

const SectionProgressIndicator = ({ sections = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showActiveLabel, setShowActiveLabel] = useState(false);
  const rafRef = useRef(null);
  const hideTimeout = useRef(null);

  useEffect(() => {
    setShowActiveLabel(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowActiveLabel(false);
    }, 5000);
    
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [activeIndex]);

  useEffect(() => {
    let observer;
    let observedElements = new Set();
    const ratios = {};

    const updateObserver = () => {
      const elements = sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean);

      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              ratios[entry.target.id] = entry.intersectionRatio;
            });

            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
              // Find the section with the highest intersection ratio > 0
              let bestId = null;
              let maxRatio = 0;
              
              sections.forEach((s) => {
                const ratio = ratios[s.id] || 0;
                if (ratio > maxRatio) {
                  maxRatio = ratio;
                  bestId = s.id;
                }
              });

              if (bestId) {
                const idx = sections.findIndex((s) => s.id === bestId);
                if (idx >= 0) setActiveIndex(idx);
              }
            });
          },
          {
            rootMargin: '-40% 0px -40% 0px',
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          }
        );
      }

      elements.forEach((el) => {
        if (!observedElements.has(el)) {
          observer.observe(el);
          observedElements.add(el);
        }
      });
    };

    updateObserver();
    const interval = setInterval(updateObserver, 1000);

    return () => {
      clearInterval(interval);
      if (observer) observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sections]);

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
      {sections.map((section, i) => (
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
          <span className={`spi-label ${i === activeIndex && showActiveLabel ? 'show-label' : ''}`}>{section.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default SectionProgressIndicator;
