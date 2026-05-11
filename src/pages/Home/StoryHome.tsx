import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import './story-home.css';
import rawLanding from '../../data/landingData.json';
import type { LandingData, LandingStory } from '../../types/landing';
import { normalizeLandingData } from '../../lib/mergeLandingData';
import { fetchLandingData } from '../../shared/landingService';

const STORAGE_KEY = 'landingData';

function readLocalLanding(): LandingData {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return normalizeLandingData(JSON.parse(s) as Partial<LandingData>);
  } catch {
    /* ignore */
  }
  return normalizeLandingData(rawLanding as LandingData);
}

function useLandingStory(): LandingStory {
  const [story, setStory] = useState<LandingStory>(() => readLocalLanding().story);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const disk = await fetchLandingData();
        if (!cancelled) setStory(normalizeLandingData(disk).story);
      } catch {
        /* keep bundled */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStory(readLocalLanding().story);
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  return story;
}

function useScrollProgress(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setP(height > 0 ? (scrollTop / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useChapterLabel(story: LandingStory): string {
  const [label, setLabel] = useState(story.chapters[0]?.stickyLabel ?? '');
  const ids = useMemo(() => story.chapters.map((c) => c.id), [story.chapters]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.querySelector(`[data-chapter="${id}"]`))
      .filter(Boolean) as Element[];

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('data-chapter');
          const found = story.chapters.find((c) => c.id === id);
          if (found) setLabel(found.stickyLabel);
        });
      },
      { threshold: [0.2, 0.35, 0.5], rootMargin: '-10% 0px -45% 0px' }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids, story.chapters]);

  return label;
}

function useReveal(): void {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.story-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('story-visible');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  });
}

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function ProjectCta({ href }: { href: string }) {
  const label = 'View Project →';
  const cls = 'story-link-arrow';
  if (/^https?:\/\//i.test(href)) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return (
    <Link className={cls} to={href}>
      {label}
    </Link>
  );
}

export default function StoryHome() {
  const story = useLandingStory();
  const progress = useScrollProgress();
  const stickyLabel = useChapterLabel(story);
  useReveal();

  const [loadDone, setLoadDone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setLoadDone(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  const nameWords = story.hero.fullName.trim().split(/\s+/);

  const marqueeDup = useMemo(() => {
    const items = [...story.arsenal.marqueeItems, ...story.arsenal.marqueeItems];
    return items;
  }, [story.arsenal.marqueeItems]);

  return (
    <div className="story-home">
      <Helmet>
        <title>Domince Aseberos — Creative Full Stack Developer</title>
        <meta
          name="description"
          content="Creative Full Stack Developer in Davao, Philippines. Editorial portfolio — experiences, not templates."
        />
      </Helmet>

      <svg className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden>
        <defs>
          <filter id="story-grain-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.035 0"
            />
          </filter>
        </defs>
      </svg>

      <div className={`story-load-overlay ${loadDone ? 'story-load-done' : ''}`} aria-hidden />

      <div className="story-progress-bar" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} />

      <div className="story-chapter-rail" aria-live="polite">
        {stickyLabel}
      </div>

      <header className="story-hero" data-chapter="hero">
        <div className="story-hero-mesh" aria-hidden />
        <div className="story-grain" aria-hidden />
        <div className="story-hero-inner">
          <h1 className="story-name">
            {nameWords.map((w, i) => (
              <span key={`${w}-${i}`} className="story-name-word" style={{ animationDelay: `${i * 0.3}s` }}>
                {w}
              </span>
            ))}
          </h1>
          <p className="story-role">{story.hero.role}</p>
          <p className="story-tagline">{story.hero.tagline}</p>
        </div>
        <div className="story-scroll-hint">
          <span className="story-scroll-dot" />
          <span>{story.hero.scrollHint}</span>
        </div>
      </header>

      <main>
        <section className="story-section" data-chapter="origin" aria-labelledby="origin-headline">
          <span className="story-decorative-num" aria-hidden>
            01
          </span>
          <div className="story-origin-grid">
            <div>
              <h2 id="origin-headline" className="story-headline story-reveal">
                {story.origin.headline}
              </h2>
              <div className="story-prose">
                {story.origin.paragraphs.map((p, i) => (
                  <p key={i} className="story-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="story-geo story-reveal" aria-hidden>
              <div className="story-geo-plate" />
              <div className="story-geo-circle" />
              <div className="story-geo-bar" />
              <div className="story-geo-square" />
            </div>
          </div>
        </section>

        <div className="story-marquee-wrap" aria-hidden>
          <div className="story-marquee-track">
            {marqueeDup.map((item, i) => (
              <span key={`${item}-${i}`}>
                {item}
                <span style={{ opacity: 0.35 }}> · </span>
              </span>
            ))}
          </div>
        </div>

        <section className="story-section" data-chapter="arsenal" aria-labelledby="arsenal-headline">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 id="arsenal-headline" className="story-headline story-reveal">
              {story.arsenal.headline}
            </h2>
            <div className="story-cards-grid">
              {story.arsenal.strengths.map((card, i) => (
                <article
                  key={card.title}
                  className="story-card story-reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <h3 className="story-card-title">
                    <span aria-hidden>{card.symbol} </span>
                    {card.title}
                  </h3>
                  <p className="story-card-desc">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="story-section" data-chapter="work" aria-labelledby="work-headline">
          <h2 id="work-headline" className="story-headline story-reveal" style={{ maxWidth: 1200, margin: '0 auto 3rem' }}>
            {story.work.headline}
          </h2>

          <div className="story-work-block">
            <div className={`story-gradient-ph alpha story-reveal`} />
            <div className="story-reveal" style={{ transitionDelay: '0.1s' }}>
              <h3 className="story-project-title">{story.work.projects[0].title}</h3>
              <p>{story.work.projects[0].description}</p>
              <div className="story-pills">
                {story.work.projects[0].tags.map((t) => (
                  <span key={t} className="story-pill">
                    {t}
                  </span>
                ))}
              </div>
              <ProjectCta href={story.work.projects[0].href} />
            </div>
          </div>

          <div className="story-work-block story-work-reverse" style={{ marginTop: 'clamp(48px, 8vw, 96px)' }}>
            <div className="story-reveal" style={{ transitionDelay: '0.05s' }}>
              <h3 className="story-project-title">{story.work.projects[1].title}</h3>
              <p>{story.work.projects[1].description}</p>
              <div className="story-pills">
                {story.work.projects[1].tags.map((t) => (
                  <span key={t} className="story-pill">
                    {t}
                  </span>
                ))}
              </div>
              <ProjectCta href={story.work.projects[1].href} />
            </div>
            <div className={`story-gradient-ph beta story-reveal`} style={{ transitionDelay: '0.1s' }} />
          </div>
        </section>

        <section className="story-human" data-chapter="human">
          <blockquote className="story-quote story-reveal">{story.human.quote}</blockquote>
          <p className="story-facts story-reveal" style={{ transitionDelay: '0.12s' }}>
            {story.human.facts.join(' · ')}
          </p>
        </section>

        <section className="story-section" data-chapter="connect" style={{ paddingBottom: 24 }}>
          <h2 className="story-connect-head story-reveal">{story.connect.headline}</h2>
          <p className="story-reveal" style={{ maxWidth: '42ch', margin: '0 auto 2rem', textAlign: 'center' }}>
            {story.connect.subtext}
          </p>
          <p className="story-reveal" style={{ textAlign: 'center' }}>
            <a className="story-email" href={`mailto:${story.connect.email}`}>
              {story.connect.email}
            </a>
          </p>
          <div className="story-social story-reveal">
            <a href={story.connect.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon />
            </a>
            <a href={story.connect.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
          <div className="story-divider" />
          <p className="story-footer-note story-reveal">
            <a href={story.connect.portfolioUrl}>{story.connect.portfolioLinkLabel}</a>
          </p>
          <footer className="story-footer">{story.connect.footerCopyright}</footer>
        </section>
      </main>
    </div>
  );
}
