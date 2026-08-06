import React, { useEffect, useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import portfolioData from '../../data/portfolioData.json';
import aboutData from '../../data/aboutData.json';
import feedPostsData from '../../data/feedPosts.json';
import './portfolio-pages.css';

type AnyRecord = Record<string, any>;
const projects = portfolioData.projects as AnyRecord[];

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const dateLabel = (value?: string) => {
  if (!value) return 'In development';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};

function useReveal(dependency: unknown = null) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!root.current) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.fromTo(element, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%' } });
    });
    return () => {
      if (lenis && raf) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
    };
  }, { scope: root, dependencies: [dependency] });
  return root;
}

const Arrow = () => <span aria-hidden="true">↗</span>;

export function WorkPage() {
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.projectType).filter(Boolean)))], []);
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? projects : projects.filter((p) => p.projectType === active);
  const root = useReveal(active);
  return <div className="pp" ref={root}>
    <section className="pp-hero pp-hero--work">
      <p className="pp-kicker" data-reveal>Selected work · 2023—Present</p>
      <h1 data-reveal>Built to work.<br/><em>Made to feel.</em></h1>
      <p className="pp-hero__copy" data-reveal>{projects.length} projects across product engineering, interactive development, mobile, and applied AI.</p>
    </section>
    <div className="work-filter" data-reveal role="group" aria-label="Filter projects">
      {categories.map((category) => <button key={category} className={active === category ? 'is-active' : ''} onClick={() => setActive(category)}>{category}</button>)}
    </div>
    <section className="work-grid" aria-live="polite">
      {visible.map((project, index) => <a className="work-card" data-reveal href={`/projects/${project.id}`} key={project.id}>
        <div className="work-card__media">
          {project.mainImage ? <img src={project.mainImage} alt="" loading="lazy"/> : <span>Project image</span>}
          <span className="work-card__launch"><Arrow/></span>
        </div>
        <div className="work-card__meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{dateLabel(project.dateCreated)}</span></div>
        <h2>{project.title}</h2><p>{project.projectType}</p>
      </a>)}
    </section>
  </div>;
}

function Block({ block }: { block: AnyRecord }) {
  if (block.type === 'text') return <p className="case-copy">{block.content}</p>;
  if (block.type === 'heading') return <h4>{block.content}</h4>;
  if (block.type === 'list') return <ul>{(block.items || []).map((item: string) => <li key={item}>{item}</li>)}</ul>;
  if (block.type === 'chips') return <div className="case-chips">{(block.items || []).map((item: string) => <span key={item}>{item}</span>)}</div>;
  if (block.type === 'image') return block.src || block.url ? <img className="case-inline-image" src={block.src || block.url} alt={block.alt || ''}/> : null;
  if (block.type === 'link') return <a className="case-inline-link" href={block.url} target="_blank" rel="noreferrer">{block.label || block.url} <Arrow/></a>;
  if (block.type === 'color-palette') return <div className="case-palette">{(block.colors || []).map((color: string) => <span key={color} style={{ background: color }}><i>{color}</i></span>)}</div>;
  if (block.type === 'font-preview') return <div className="case-fonts">{(block.fonts || []).map((font: AnyRecord) => <div key={font.name} style={{ fontFamily: font.family }}><strong>{font.name}</strong><small>{font.role}</small></div>)}</div>;
  return null;
}

export function CaseStudyPage({ project }: { project: AnyRecord }) {
  const root = useReveal(project.id);
  const gallery = [project.desktopImage || project.mainImage, ...(project.desktopGallery || []), ...(project.galleryImages || [])].filter(Boolean);
  const nextIndex = (projects.findIndex((item) => item.id === project.id) + 1) % projects.length;
  const next = projects[nextIndex];
  return <article className="pp case" ref={root}>
    <header className="case-hero">
      <div><p className="pp-kicker" data-reveal>{project.projectType} · {dateLabel(project.dateCreated)}</p><h1 data-reveal>{project.title}</h1></div>
      <p data-reveal>{project.shortDescription}</p>
    </header>
    <div className="case-actions" data-reveal>
      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live project <Arrow/></a>}
      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">Source <Arrow/></a>}
      {project.primaryBtnUrl && <a href={project.primaryBtnUrl} target="_blank" rel="noreferrer">{project.primaryBtnLabel || 'Documentation'} <Arrow/></a>}
    </div>
    <section className="case-cover" data-reveal>{gallery[0] ? <img src={gallery[0]} alt={`${project.title} interface`}/> : <span>Project image placeholder</span>}</section>
    {(project.proofPoints || []).length > 0 && <section className="case-proof" data-reveal>{project.proofPoints.map((point: AnyRecord) => <div key={point.label}><small>{point.label}</small><strong>{point.value}</strong></div>)}</section>}
    <div className="case-sections">
      {(project.contentSections || []).map((section: AnyRecord, sectionIndex: number) => <section className="case-section" data-reveal key={section.id || sectionIndex}>
        <div className="case-section__title"><span>{String(sectionIndex + 1).padStart(2, '0')}</span><h2>{section.sectionTitle || 'Details'}</h2></div>
        <div className={`case-columns case-columns--${(section.columns || []).length}`}>
          {(section.columns || []).map((column: AnyRecord, columnIndex: number) => <div className="case-column" key={column.id || columnIndex}>{column.columnTitle && <h3>{column.columnTitle}</h3>}{(column.blocks || []).map((block: AnyRecord, blockIndex: number) => <Block block={block} key={block.id || blockIndex}/>)}</div>)}
        </div>
      </section>)}
    </div>
    {gallery.slice(1).length > 0 && <section className="case-gallery">{gallery.slice(1).map((src: string, index: number) => <img data-reveal key={`${src}-${index}`} src={src} alt={`${project.title} detail ${index + 1}`} loading="lazy"/>)}</section>}
    <a className="case-next" data-reveal href={`/projects/${next.id}`}><small>Next project</small><strong>{next.title}</strong><Arrow/></a>
  </article>;
}

export function AboutPage() {
  const data = aboutData as AnyRecord;
  const root = useReveal();
  return <div className="pp about" ref={root}>
    <section className="pp-hero about-hero"><p className="pp-kicker" data-reveal>About · {data.hero.location}</p><h1 data-reveal>I turn complex systems into <em>clear experiences.</em></h1><p className="pp-hero__copy" data-reveal>{data.hero.bio}</p></section>
    <section className="about-intro" data-reveal><p>{data.about.intro}</p><aside><span>Currently</span><strong>{data.about.location}</strong><a href={data.resume}>Download résumé <Arrow/></a></aside></section>
    <section className="about-values">{data.about.blocks.map((block: AnyRecord, index: number) => <article data-reveal key={block.title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{block.title}</h2><p>{block.body}</p></article>)}</section>
    <section className="about-section" data-reveal><header><p className="pp-kicker">Experience</p><h2>How I got here.</h2></header><div className="about-timeline">{data.experience.map((item: AnyRecord) => <article key={item.period}><time>{item.period}</time><div><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.desc}</p></div></article>)}</div></section>
    <section className="about-section" data-reveal><header><p className="pp-kicker">Toolbox</p><h2>Built across the stack.</h2></header><div className="stack-grid">{data.techStack.map((group: AnyRecord) => <article key={group.group}><h3>{group.group}</h3><p>{group.items.join(' · ')}</p></article>)}</div></section>
    <section className="about-section" data-reveal><header><p className="pp-kicker">What I do</p><h2>From idea to launch.</h2></header><div className="service-grid">{data.services.map((service: AnyRecord, index: number) => <article key={service.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{service.title}</h3><p>{service.desc}</p></article>)}</div></section>
    <section className="testimonials" data-reveal><p className="pp-kicker">In collaboration</p>{data.testimonials.map((item: AnyRecord) => <blockquote key={item.author}><p>“{item.quote}”</p><footer>{item.author} · {item.role}</footer></blockquote>)}</section>
  </div>;
}

export function FeedPage() {
  const posts = useMemo(() => [...(feedPostsData as AnyRecord[])].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)), []);
  const root = useReveal(posts.length);
  return <div className="pp feed" ref={root}>
    <section className="pp-hero feed-hero"><p className="pp-kicker" data-reveal>Field notes · Work in progress</p><h1 data-reveal>Thinking,<br/><em>building, refining.</em></h1><p className="pp-hero__copy" data-reveal>Short notes from active builds, architecture decisions, experiments, and interface polish.</p></section>
    <section className="feed-list">{posts.map((post, index) => <article id={`post-${post.id}`} data-reveal key={post.id}>
      <div className="feed-index"><span>{String(index + 1).padStart(2, '0')}</span><time>{dateLabel(post.createdAt)}</time></div>
      <div className="feed-body"><p className="pp-kicker">{(post.tags || []).join(' · ')}</p><h2>{post.title}</h2><p>{post.body}</p>{post.fullDescription && <p>{post.fullDescription}</p>}
      {(post.images || []).length > 0 && <div className="feed-media">{post.images.map((src: string, i: number) => <img key={src} src={src} alt={`${post.title} ${i + 1}`} loading="lazy"/>)}</div>}</div>
    </article>)}</section>
  </div>;
}

const EMAILJS_SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_OWNER_TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_OWNER_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID;
const EMAILJS_AUTOREPLY_TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le-rPksAAAAAGjZyU9RoImL18m2WCc9m0UxsKiR';
const clean = (value: string, max: number) => value.replace(/[<>]/g, '').slice(0, max).trim();

export function ContactPage() {
  const mounted = useRef(Date.now()); const captcha = useRef<ReCAPTCHA>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [token, setToken] = useState<string | null>(null); const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle'); const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (status === 'sending') return; setStatus('sending'); setError('');
    try {
      if (form.website) { setStatus('sent'); return; }
      if (Date.now() - mounted.current < 2500) throw new Error('Please take a moment before sending your message.');
      const last = Number(localStorage.getItem('domsdev:last-contact-submit') || 0); if (Date.now() - last < 60000) throw new Error('Please wait a minute before sending another message.');
      if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_OWNER_TEMPLATE_ID) throw new Error('The contact form is not configured yet.');
      if (RECAPTCHA_SITE_KEY && !token) throw new Error('Please complete the reCAPTCHA check.');
      const params = { from_name: clean(form.name,80), from_email: clean(form.email,120), reply_to: clean(form.email,120), message: clean(form.message,1500), to_name:'Domince', 'g-recaptcha-response':token };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY });
      if (EMAILJS_AUTOREPLY_TEMPLATE_ID) await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, { ...params, to_email: params.from_email, to_name: params.from_name }, { publicKey: EMAILJS_PUBLIC_KEY });
      localStorage.setItem('domsdev:last-contact-submit', String(Date.now())); setStatus('sent');
    } catch (cause) { captcha.current?.reset(); setToken(null); setStatus('error'); setError(cause instanceof Error ? cause.message : 'Could not send your message.'); }
  };
  return <div className="pp contact">
    <section className="contact-head"><p className="pp-kicker">Start a conversation</p><h1>Have an idea?<br/><em>Tell me everything.</em></h1><p>Freelance projects, collaborations, and full-time opportunities. I usually reply within two working days.</p></section>
    <section className="contact-grid">
      <aside><div><small>Email</small><a href="mailto:daseberos@gmail.com">daseberos@gmail.com</a></div><div><small>Based in</small><strong>Tagum City, Philippines</strong></div><div><small>Availability</small><strong>Open to remote work</strong></div></aside>
      {status === 'sent' ? <div className="contact-success"><span>✓</span><h2>Message received.</h2><p>Thanks for reaching out. I’ll get back to you soon.</p></div> : <form onSubmit={submit}>
        <input className="contact-honeypot" tabIndex={-1} aria-hidden="true" autoComplete="off" value={form.website} onChange={(e)=>setForm({...form,website:e.target.value})}/>
        <label><span>01 · Your name</span><input required minLength={2} maxLength={80} placeholder="What should I call you?" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/></label>
        <label><span>02 · Your email</span><input required type="email" maxLength={120} placeholder="you@company.com" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/></label>
        <label><span>03 · Tell me about it</span><textarea required minLength={10} maxLength={1500} rows={5} placeholder="Project, timeline, goals—whatever you know so far." value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})}/></label>
        <ReCAPTCHA ref={captcha} sitekey={RECAPTCHA_SITE_KEY} theme="light" onChange={setToken}/>{status === 'error' && <p className="contact-error" role="alert">{error}</p>}
        <button disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send inquiry'} <Arrow/></button>
      </form>}
    </section>
  </div>;
}

export function NotFoundPage() { return <div className="pp notfound"><p className="pp-kicker">Error · 404</p><div className="notfound-number">4<span></span>4</div><h1>This page wandered off.</h1><p>The address may have changed, but the work is still here.</p><div><a href="/">Back home <Arrow/></a><a href="/projects">View work <Arrow/></a></div></div>; }
