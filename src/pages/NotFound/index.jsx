import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFoundPage = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        // Generate random stars on mount
        const starCount = 55;
        const newStars = Array.from({ length: starCount }).map((_, i) => {
            const size = Math.random() * 2 + 0.5;
            return {
                id: i,
                size,
                top: Math.random() * 88,
                left: Math.random() * 100,
                duration: (Math.random() * 2 + 1.5).toFixed(1),
                delay: -(Math.random() * 3).toFixed(1),
                opacity: Math.random() * 0.7 + 0.3
            };
        });
        setStars(newStars);
    }, []);

    return (
        <div className="not-found-body">
            <span className="side-text">DEVELOPER &times; MOTION DESIGNER</span>

            <div className="not-found-container">
                {/* LEFT: CONTENT */}
                <div className="nf-content">
                    <p className="nf-eyebrow">PORTFOLIO &mdash; ERROR PAGE</p>
                    <span className="nf-hero-num">404</span>
                    <span className="nf-hero-outline">NOT FOUND</span>
                    <p className="nf-desc">
                        The link you followed <strong>doesn't exist</strong> or has been moved somewhere else.<br /><br />
                        Our astronaut is out there searching for it — but even he can't find this page. Head back home.
                    </p>
                    <div className="nf-actions">
                        <Link to="/" className="nf-btn-primary">GO HOME</Link>
                        <Link to="/projects" className="nf-btn-ghost">VIEW PROJECTS</Link>
                    </div>
                </div>

                {/* RIGHT: PANEL */}
                <div className="nf-panel">
                    {/* Space GIF scene */}
                    <div className="gif-wrap">
                        {/* Stars */}
                        <div className="stars">
                            {stars.map((star) => (
                                <div
                                    key={star.id}
                                    className="star"
                                    style={{
                                        width: `${star.size}px`,
                                        height: `${star.size}px`,
                                        top: `${star.top}%`,
                                        left: `${star.left}%`,
                                        opacity: star.opacity,
                                        '--d': `${star.duration}s`,
                                        '--delay': `${star.delay}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Planet & ring */}
                        <div className="planet-ring"></div>
                        <div className="planet"></div>

                        {/* Tether */}
                        <div className="tether"></div>

                        {/* Floating astronaut */}
                        <div className="astro-wrap">
                            <svg className="astro-svg" width="72" height="100" viewBox="0 0 72 100" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                {/* Helmet */}
                                <ellipse cx="36" cy="28" rx="22" ry="24" fill="#e8e8e8" />
                                <ellipse cx="36" cy="28" rx="22" ry="24" fill="none" stroke="#bbb" stroke-width="1.5" />
                                {/* Visor */}
                                <ellipse cx="36" cy="27" rx="14" ry="13" fill="#111c35" />
                                <ellipse cx="36" cy="27" rx="14" ry="13" fill="url(#visorGrad)" opacity="0.6" />
                                {/* Visor reflection */}
                                <ellipse cx="30" cy="22" rx="4" ry="2.5" fill="rgba(255,255,255,0.18)"
                                    transform="rotate(-20 30 22)" />
                                {/* Helmet ring */}
                                <ellipse cx="36" cy="49" rx="20" ry="5" fill="#ccc" />
                                {/* Body suit */}
                                <rect x="16" y="48" width="40" height="34" rx="8" fill="#ddd" />
                                <rect x="16" y="48" width="40" height="34" rx="8" fill="none" stroke="#bbb" stroke-width="1" />
                                {/* Chest panel */}
                                <rect x="27" y="55" width="18" height="12" rx="3" fill="#c8c8c8" />
                                {/* Chest lights */}
                                <circle cx="31" cy="59" r="2" fill="var(--accent)" />
                                <circle cx="36" cy="59" r="2" fill="#ff5555" opacity="0.9">
                                    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="41" cy="59" r="2" fill="#5599ff" />
                                {/* Left arm */}
                                <rect x="2" y="50" width="14" height="22" rx="7" fill="#ddd" stroke="#bbb" stroke-width="1" />
                                {/* Right arm (waving) */}
                                <g style={{ transformOrigin: '58px 55px', animation: 'wave 1.8s ease-in-out infinite' }}>
                                    <rect x="56" y="48" width="14" height="22" rx="7" fill="#ddd" stroke="#bbb"
                                        stroke-width="1" />
                                    {/* Glove right */}
                                    <ellipse cx="63" cy="71" rx="7" ry="5.5" fill="#ccc" stroke="#bbb" stroke-width="1" />
                                </g>
                                {/* Left glove */}
                                <ellipse cx="9" cy="73" rx="7" ry="5.5" fill="#ccc" stroke="#bbb" stroke-width="1" />
                                {/* Legs */}
                                <rect x="19" y="78" width="14" height="18" rx="6" fill="#d5d5d5" stroke="#bbb"
                                    stroke-width="1" />
                                <rect x="39" y="78" width="14" height="18" rx="6" fill="#d5d5d5" stroke="#bbb"
                                    stroke-width="1" />
                                {/* Boots */}
                                <ellipse cx="26" cy="96" rx="9" ry="5" fill="#bbb" />
                                <ellipse cx="46" cy="96" rx="9" ry="5" fill="#bbb" />
                                {/* Backpack */}
                                <rect x="54" y="52" width="10" height="20" rx="4" fill="#ccc" stroke="#bbb" stroke-width="1" />
                                <defs>
                                    <radialGradient id="visorGrad" cx="40%" cy="35%">
                                        <stop offset="0%" stop-color="#5588ff" stop-opacity="0.4" />
                                        <stop offset="100%" stop-color="#000820" stop-opacity="0" />
                                    </radialGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Glitch scanline */}
                        <div className="glitch-line"></div>
                        {/* Screen flicker */}
                        <div className="nf-flicker"></div>

                        {/* Signal */}
                        <div className="signal-text">NO SIGNAL</div>
                        <div className="signal-bar">
                            <span></span><span></span><span></span><span></span>
                        </div>
                    </div>

                    {/* Bottom info */}
                    <div className="panel-info">
                        <div className="panel-row">
                            <div>
                                <div className="stat-num">0<span className="sup">pg</span></div>
                                <div className="stat-label">PAGES FOUND</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="stat-num">∞<span className="sup">?</span></div>
                                <div className="stat-label">PATHS LOST</div>
                            </div>
                        </div>

                        <div className="panel-divider"></div>

                        <div className="skills-grid">
                            <div className="skill-tag">REACT</div>
                            <div className="skill-tag">NEXT.JS</div>
                            <div className="skill-tag">MOTION</div>
                            <div className="skill-tag">SPLINE</div>
                            <div className="skill-tag">WEBGL</div>
                            <div className="skill-tag">GLSL</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
