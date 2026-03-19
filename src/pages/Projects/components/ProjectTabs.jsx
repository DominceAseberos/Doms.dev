import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import portfolioData from '../../../data/portfolioData.json';
import '../Projects.css';
import './ProjectTabs.css';

gsap.registerPlugin(ScrollTrigger);

// ── Per-project visual theme ──────────────────────────────────────────────
const PROJECT_THEMES = {
    'banana-leaf-detection': {
        c1: '#061508', c2: '#0b2210',
        glow: 'rgba(50,190,65,.1)',
        icon: '🍃',
        barColor: 'rgba(55,190,65,',
        mockTag: 'Python · OpenCV · scikit-learn · Flask',
        displayType: 'Machine Learning · Image Processing',
        cat: 'ai',
        gridClass: 'pg-wide',
        ovDesc: 'ML web app built with Python, OpenCV, scikit-learn and Flask. Detects whether a banana leaf is Healthy, Unhealthy, or Not a Leaf using image processing and KNN classification.',
    },
    'focus-quest': {
        c1: '#0d0618', c2: '#170a30',
        glow: 'rgba(120,70,240,.12)',
        icon: '⚔️',
        barColor: 'rgba(130,70,240,',
        mockTag: 'RPG · XP · Quests · Full Stack',
        displayType: 'Productivity · RPG · Full Stack',
        cat: 'fullstack',
        gridClass: 'pg-mid',
        ovDesc: 'A productivity RPG app turning tasks into quests with XP and stats. Gamifies your workflow so every completed task feels like levelling up.',
    },
    'baylora': {
        c1: '#08091a', c2: '#0e102c',
        glow: 'rgba(55,110,240,.1)',
        icon: '⌚',
        barColor: 'rgba(55,110,240,',
        mockTag: 'Marketplace · Auth · Bidding',
        displayType: 'Marketplace · Trading Platform',
        cat: 'fullstack',
        gridClass: 'pg-mid',
        ovDesc: 'A modern marketplace and trading platform. Users can sell, trade, or mix transactions with bidding, verified profiles, and secure authentication.',
    },
    'templyx': {
        c1: '#0c0e16', c2: '#151a28',
        glow: 'rgba(70,190,240,.09)',
        icon: '💻',
        barColor: 'rgba(70,190,240,',
        mockTag: 'Portfolio · Auth · Realtime · Community',
        displayType: 'Portfolio Platform · Developer Tool',
        cat: 'portfolio',
        gridClass: 'pg-wide',
        ovDesc: 'A modern portfolio platform for developers with authentication, real-time features, and community interaction. Built for devs who want presence without the fuss.',
    },
    'ai-text-summarizer': {
        c1: '#0e0612', c2: '#1a0c22',
        glow: 'rgba(190,70,240,.1)',
        icon: '🤖',
        barColor: 'rgba(190,70,240,',
        mockTag: 'NLP · AI · Summarizer · FastAPI',
        displayType: 'AI · NLP · Web Application',
        cat: 'ai',
        gridClass: 'pg-half',
        ovDesc: 'A web app that generates concise summaries from long text or articles using an AI-powered NLP API. Fast, clean, and surprisingly accurate.',
    },
};

const dynamicCategories = Array.from(new Set([
    ...(portfolioData.customCategories || []),
    ...portfolioData.projects.map(p => p.projectType)
])).filter(Boolean);

const FILTERS = [
    { id: 'all', label: 'All Projects' },
    ...dynamicCategories.map(cat => ({ id: cat, label: cat }))
];

// Mock data for category testing: landing-page only for now.
const MOCK_LABEL_DATA = {
    landing: {
        label: 'Landing Page',
        keywords: 'landing page marketing campaign hero cta conversion funnel',
        sample: 'Landing-page narrative focused on hero messaging and CTA conversion.',
    },
};

const MOCK_PROJECT_LABELS = {
    'banana-leaf-detection': ['landing'],
    'focus-quest': ['landing'],
    'baylora': ['landing'],
    'templyx': ['landing'],
    'ai-text-summarizer': ['landing'],
};

function detectProjectMeta(project, themeCat, mockSignalText = '') {
    const source = [
        project.title,
        project.projectType,
        project.shortDescription,
        project.about,
        (project.stacks || []).join(' '),
        mockSignalText,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const categories = new Set(['all']);
    const labels = [];

    const add = (category, label) => {
        if (!categories.has(category)) categories.add(category);
        if (!labels.includes(label)) labels.push(label);
    };

    if (themeCat) categories.add(themeCat);

    if (/(landing|marketing|campaign|promo|hero section|cta)/.test(source)) add('landing', 'Landing Page');

    if (labels.length === 0) {
        add('landing', 'Landing Page');
    }

    return {
        categories: Array.from(categories),
        labels,
        displayType: labels.slice(0, 2).join(' · ') || project.projectType,
    };
}

// ── Format date → "NOV 2023" ──────────────────────────────────────────────
function fmtDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}
function fmtOverlayDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ── Enrich projects with theme + index ────────────────────────────────────
const projects = portfolioData.projects.map((p, i) => {
    const mockLabels = MOCK_PROJECT_LABELS[p.id] || [];
    const mockLabelPayload = mockLabels.map((label) => MOCK_LABEL_DATA[label]).filter(Boolean);
    const mockSignalText = mockLabelPayload
        .map((item) => `${item.keywords} ${item.sample}`)
        .join(' ');

    return {
        ...p,
        theme: PROJECT_THEMES[p.id] || {},
        mockLabelPayload,
        ...detectProjectMeta(p, PROJECT_THEMES[p.id]?.cat, mockSignalText),
        num: String(i + 1).padStart(2, '0'),
        displayDate: fmtDate(p.dateCreated),
        overlayDate: fmtOverlayDate(p.dateCreated),
    };
});

// ── Component ─────────────────────────────────────────────────────────────
const ProjectTabs = ({ onView }) => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [scrollPct, setScrollPct] = useState(0);
    const gridRef = useRef(null);
    const breathFillRef = useRef(null);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'all') return projects;
        return projects.filter((project) =>
            project.projectType === activeFilter ||
            project.categories?.includes(activeFilter)
        );
    }, [activeFilter]);

    const handleProjectView = (project) => {
        if (typeof onView === 'function') {
            onView(project);
            return;
        }
        navigate(`/projects/${project.id}`);
    };

    // Scroll → breathing bar
    useEffect(() => {
        const onScroll = () => {
            const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
            setScrollPct(Math.round(p * 100));
            if (breathFillRef.current) breathFillRef.current.style.width = (p * 100) + '%';
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // GSAP card reveal on scroll
    useGSAP(() => {
        const cards = gsap.utils.toArray('.pg-card');
        cards.forEach((card, i) => {
            gsap.to(card, {
                opacity: 1, y: 0,
                duration: 0.7,
                ease: 'power3.out',
                delay: (i % 3) * 0.07,
                scrollTrigger: { trigger: card, start: 'top 90%' },
            });
        });
    }, { scope: gridRef, dependencies: [activeFilter], revertOnUpdate: true });

    // Filter handler
    const handleFilter = (filterId) => {
        setActiveFilter(filterId);
    };

    return (
        <div className="proj-page">
            {/* ── Header ── */}
            <div className="proj-header">
                <div className="proj-inner">
                    <div className="ph-left">
                        <div className="ph-eyebrow pg-label-lg">Selected Work</div>
                        <div className="ph-title">Pro<em>jects</em></div>
                    </div>
                    <div className="ph-right pg-subtitle-lg">
                        <strong>{projects.length} Projects — 2023–2024</strong>
                        Browse a curated set of work. Each one built with intention, shipped without compromise.
                    </div>
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="proj-controls">
                <div className="proj-inner">
                    <div className="filters">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                className={`f-btn pg-label-lg${activeFilter === f.id ? ' active' : ''}`}
                                onClick={() => handleFilter(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div className="breath-wrap">
                        <span className="breath-label pg-label-lg">Scroll</span>
                        <div className="breath-track">
                            <div className="breath-fill" ref={breathFillRef}></div>
                            <div className="breath-dot"></div>
                        </div>
                        <span className="breath-pct pg-label-lg">{scrollPct}%</span>
                    </div>
                </div>
            </div>

            {/* ── Grid ── */}
            <div className="proj-grid" ref={gridRef}>
                {filteredProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} onView={handleProjectView} />
                ))}

                {/* Stat cell */}
                {filteredProjects.length > 0 && (
                    <div className="pg-card pg-half" data-cat="all" style={{ opacity: 1, transform: 'none' }}>
                        <div className="pg-stat">
                            <div>
                                <div className="pg-stat-num">{projects.length}</div>
                                <div className="pg-stat-label pg-label-lg">Projects Shipped</div>
                            </div>
                            <div className="pg-stat-div"></div>
                            <div>
                                <div className="pg-stat-year">2023–24</div>
                                <div className="pg-stat-label pg-label-lg">Active Period</div>
                            </div>
                            <div className="pg-stat-div"></div>
                            <div>
                                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: 'var(--paper)', lineHeight: 1 }}>4+</div>
                                <div className="pg-stat-label pg-label-lg">Tech Stacks</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectTabs;
