import { useState, useCallback } from 'react';
import '../css/LabSection.css';


const EXPERIMENTS = [
  {
    id: 'particles',
    num: '01',
    badge: 'live',
    title: ['Particle', 'Network'],
    desc: 'Real-time particle network with proximity-based edge connections. Each node drifts on its own velocity vector, forming a living web of light.',
    tags: ['Canvas 2D', 'RequestAnimationFrame', 'Generative'],
    stats: [{ v: '90', l: 'Nodes' }, { v: '60fps', l: 'Target' }, { v: '<1ms', l: 'Draw call' }, { v: '2D', l: 'Renderer' }],
    info: 'Each particle moves independently. Every frame, all pairs are checked — if distance < threshold, a line is drawn with opacity proportional to closeness. No physics library needed.',
    file: '/experiments/01-particles.html',
    lightBg: false,
  },
  {
    id: 'rdiffusion',
    num: '02',
    badge: 'live',
    title: ['Reaction', 'Diffusion'],
    desc: 'Turing morphogenesis patterns computed in real-time using the Gray-Scott model. Tunable feed/kill rates produce coral, stripes, or labyrinthine networks.',
    tags: ['Canvas 2D', 'Gray-Scott', 'Generative', 'Pixel Math'],
    stats: [{ v: '160²', l: 'Grid' }, { v: '8x', l: 'Steps/frame' }, { v: 'f=.055', l: 'Feed rate' }, { v: 'k=.062', l: 'Kill rate' }],
    info: 'Gray-Scott model: two chemicals A and B react and diffuse. Feed rate replenishes A, kill rate removes B. The balance between them determines pattern topology.',
    file: '/experiments/02-rdiffusion.html',
    lightBg: false,
  },

];

const BADGE_LABELS = {
  live: 'Live',
  wip: 'In Progress',
  concept: 'Concept',
  archived: 'Archived',
};

// ── SANDBOX CURSOR INJECTION ──────────────────────────
const CURSOR_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAxMSAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMi43ODI4NSIgeT0iMi44NDY3NSIgd2lkdGg9IjAuNjkyMjk0IiBoZWlnaHQ9IjcuMjQ2MDUiIHJ4PSIwLjM0NjE0NyIgdHJhbnNmb3JtPSJyb3RhdGUoLTQwLjI1MjMgMi43ODI4NSAyLjg0Njc1KSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPHJlY3QgeD0iMi44NDY1MyIgeT0iNy45OTMzOCIgd2lkdGg9IjAuNjkyMjk0IiBoZWlnaHQ9IjcuMjQ2MDUiIHJ4PSIwLjM0NjE0NyIgdHJhbnNmb3JtPSJyb3RhdGUoLTEzMC4yNTIgMi44NDY1MyA3Ljk5MzM4KSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KPC9zdmc+';

const injectCursorStyle = (e) => {
  try {
    const iframe = e.target;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;

    const styleId = 'ls-custom-cursor-style';
    if (doc.getElementById(styleId)) return;

    const style = doc.createElement('style');
    style.id = styleId;
    style.textContent = `
      * { 
        cursor: url('${CURSOR_SVG}') 12 12, auto !important; 
      }
    `;
    doc.head.appendChild(style);
  } catch (err) {
    // Silent fail if cross-origin or other issues
  }
};

// ── SANDBOX MODAL ─────────────────────────────────────
function SandboxModal({ exp, onClose }) {
  if (!exp) return null;

  return (
    <div className="ls-overlay" onClick={onClose}>
      <div className="ls-sandbox" onClick={e => e.stopPropagation()}>

        {/* title bar */}
        <div className="ls-sandbox-bar">
          <div className="ls-win-dots">
            <button className="ls-win-dot ls-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
          <span className="ls-sandbox-title">
            {exp.title.join(' ')} — Sandbox
          </span>
        </div>

        {/* body */}
        <div className="ls-sandbox-body">

          {/* live iframe — pointer-events ON so user can interact */}
          <div className="ls-sandbox-frame-wrap">
            <iframe
              src={exp.file}
              title={`${exp.title.join(' ')} sandbox`}
              sandbox="allow-scripts allow-same-origin"
              onLoad={injectCursorStyle}
            />
          </div>

          {/* info sidebar */}
          <div className="ls-sandbox-info">
            <div>
              <p className="ls-info-heading">About</p>
              <p className="ls-info-text">{exp.info}</p>
            </div>

            <div>
              <p className="ls-info-heading">Stats</p>
              <div className="ls-stat-grid">
                {exp.stats.map((s, i) => (
                  <div key={i} className="ls-stat-box">
                    <div className="ls-stat-val">{s.v}</div>
                    <div className="ls-stat-lbl">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="ls-info-heading">Tags</p>
              <div className="ls-tag-row">
                {exp.tags.map(tag => (
                  <span key={tag} className="ls-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── LAB CARD ──────────────────────────────────────────
function LabCard({ exp, onOpen }) {
  return (
    <article className="ls-card">

      {/* left panel */}
      <div className="ls-card-left">
        <div className="ls-card-meta">
          <span className="ls-card-num">{exp.num}</span>
          <span className={`ls-badge ls-badge-${exp.badge}`}>
            {BADGE_LABELS[exp.badge] ?? exp.badge}
          </span>
        </div>

        <h2 className="ls-card-title">
          {exp.title.map((line, i) => (
            <span key={i}>{line}{i < exp.title.length - 1 && <br />}</span>
          ))}
        </h2>

        <p className="ls-card-desc">{exp.desc}</p>

        <div className="ls-tag-row">
          {exp.tags.map(tag => (
            <span key={tag} className="ls-tag">{tag}</span>
          ))}
        </div>

        <div className="ls-card-actions">
          <button className="ls-btn ls-btn-primary" onClick={() => onOpen(exp)}>
            ↗ Open Sandbox
          </button>
          <button className="ls-btn ls-btn-ghost">
            ≡ Source
          </button>
        </div>
      </div>

      {/* right panel — iframe preview, pointer-events off */}
      <div className={`ls-card-preview${exp.lightBg ? ' ls-light' : ''}`}>
        <span className={`ls-preview-label${exp.lightBg ? ' ls-dark-text' : ''}`}>
          Live Preview
        </span>
        <iframe
          className="ls-preview-iframe"
          src={exp.file}
          title={`${exp.title.join(' ')} preview`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          onLoad={injectCursorStyle}
        />
      </div>

    </article>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────
export default function LabSection() {
  const [activeExp, setActiveExp] = useState(null);

  const openModal = useCallback(exp => {
    setActiveExp(exp);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lab-sandbox-open');
  }, []);

  const closeModal = useCallback(() => {
    setActiveExp(null);
    document.body.style.overflow = '';
    document.body.classList.remove('lab-sandbox-open');
  }, []);

  // close on Escape
  const handleKey = useCallback(e => {
    if (e.key === 'Escape') closeModal();
  }, [closeModal]);

  return (
    <section className="ls-page" onKeyDown={handleKey}>

      {EXPERIMENTS.map(exp => (
        <LabCard key={exp.id} exp={exp} onOpen={openModal} />
      ))}

      {activeExp && (
        <SandboxModal exp={activeExp} onClose={closeModal} />
      )}

    </section>
  );
}
