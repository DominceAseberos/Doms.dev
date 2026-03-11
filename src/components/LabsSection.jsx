import React from 'react';
import './LabsSection.css';

const LabsSection = () => {
    return (
        <div className="labs-wrapper">
            {/* Header */}
            <div className="section-header">
                <h2 className="section-title">La<span>b</span>s<span className="cursor"></span></h2>
                <span className="section-meta">// experimental_work</span>
            </div>

            <div className="divider"></div>

            {/* Card 01 — Physics Cloth Sim */}
            <article className="lab-card card--green">
                <div className="card-inner">
                    <div className="card-top">
                        <span className="card-num">01</span>
                        <span className="badge badge--active">Active</span>
                    </div>
                    <h3 className="card-title">Physics Cloth Simulation</h3>
                    <p className="card-desc">
                        Real-time verlet-integration cloth sim running on the GPU via WebGL compute shaders.
                        Wind, gravity, and pin constraints. Fully interactive — grab and tear fabric in browser.
                    </p>
                    <div className="card-stats">
                        <div className="stat">
                            <span className="stat-val">60fps</span>
                            <span className="stat-label">Sustained</span>
                        </div>
                        <div className="stat">
                            <span className="stat-val">4096</span>
                            <span className="stat-label">Particles</span>
                        </div>
                        <div className="stat">
                            <span className="stat-val">WebGL2</span>
                            <span className="stat-label">Renderer</span>
                        </div>
                    </div>
                    <div className="tag-row">
                        <span className="tag">GLSL</span>
                        <span className="tag">WebGL</span>
                        <span className="tag">Three.js</span>
                        <span className="tag">Verlet</span>
                    </div>
                </div>
                <div className="action-row">
                    <button className="action-btn"><span className="icon">↗</span> Run Experiment</button>
                    <button className="action-btn"><span className="icon">≡</span> Source</button>
                </div>
            </article>

            {/* Card 02 — Motion Language */}
            <article className="lab-card card--yellow">
                <div className="card-inner">
                    <div className="card-top">
                        <span className="card-num">02</span>
                        <span className="badge badge--wip">In Progress</span>
                    </div>
                    <h3 className="card-title">Motion Design System</h3>
                    <p className="card-desc">
                        A composable token-based animation language. Define entrance, exit, and state transitions
                        as semantic primitives — compile to CSS, Framer Motion, or GSAP targets.
                    </p>
                    <div className="progress-wrap">
                        <div className="progress-label">
                            <span>Completion</span>
                            <span>67%</span>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: '67%' }}></div>
                        </div>
                    </div>
                    <div className="tag-row">
                        <span className="tag">TypeScript</span>
                        <span className="tag">Framer Motion</span>
                        <span className="tag">GSAP</span>
                        <span className="tag">Design Tokens</span>
                    </div>
                </div>
                <div className="action-row">
                    <button className="action-btn"><span className="icon">↗</span> Preview</button>
                    <button className="action-btn"><span className="icon">≡</span> Details</button>
                </div>
            </article>

            {/* Card 03 — Reaction-Diffusion */}
            <article className="lab-card card--cyan">
                <div className="card-inner">
                    <div className="card-top">
                        <span className="card-num">03</span>
                        <span className="badge badge--active">Active</span>
                    </div>
                    <h3 className="card-title">Reaction-Diffusion Explorer</h3>
                    <p className="card-desc">
                        Turing morphogenesis patterns computed in real-time. Tunable feed/kill rates, brush
                        input seeding, and palette remapping. Exports as 4K video or animated WebP sequences.
                    </p>
                    <div className="card-stats">
                        <div className="stat">
                            <span className="stat-val">512²</span>
                            <span className="stat-label">Grid res.</span>
                        </div>
                        <div className="stat">
                            <span className="stat-val">∞</span>
                            <span className="stat-label">Pattern variants</span>
                        </div>
                    </div>
                    <div className="tag-row">
                        <span className="tag">Canvas 2D</span>
                        <span className="tag">WebWorkers</span>
                        <span className="tag">Generative</span>
                        <span className="tag">Export</span>
                    </div>
                </div>
                <div className="action-row">
                    <button className="action-btn"><span className="icon">↗</span> Run Experiment</button>
                    <button className="action-btn"><span className="icon">≡</span> Details</button>
                </div>
            </article>

            {/* Card 04 — Concept */}
            <article className="lab-card card--purple">
                <div className="card-inner">
                    <div className="card-top">
                        <span className="card-num">04</span>
                        <span className="badge badge--concept">Concept</span>
                    </div>
                    <h3 className="card-title">Spatial Audio UI</h3>
                    <p className="card-desc">
                        Interface elements positioned in 3D audio space using Web Audio API panners.
                        Hover triggers binaural depth cues — navigation by sound topology, not visual hierarchy.
                    </p>
                    <div className="progress-wrap">
                        <div className="progress-label">
                            <span>Prototyped</span>
                            <span>22%</span>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: '22%' }}></div>
                        </div>
                    </div>
                    <div className="tag-row">
                        <span className="tag">Web Audio</span>
                        <span className="tag">HRTF</span>
                        <span className="tag">React</span>
                        <span className="tag">Experimental</span>
                    </div>
                </div>
                <div className="action-row">
                    <button className="action-btn"><span className="icon">↗</span> Preview</button>
                    <button className="action-btn"><span className="icon">≡</span> Details</button>
                </div>
            </article>

            {/* Footer */}
            <div className="section-footer">
                <span className="footer-note">4 experiments · updated 2025</span>
                <button className="view-all">All experiments</button>
            </div>
        </div>
    );
};

export default LabsSection;
