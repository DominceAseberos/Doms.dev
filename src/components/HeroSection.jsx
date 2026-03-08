import React from 'react';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="marquee-wrap">
                <div className="marquee-track">
                    <span>Motion</span><span>·</span>
                    <span>Code</span><span>·</span>
                    <span>Design</span><span>·</span>
                    <span>Motion</span><span>·</span>
                    <span>Code</span><span>·</span>
                    <span>Design</span><span>·</span>
                </div>
            </div>

            <div className="hero-left">
                <div className="v-label">Developer × Motion Designer</div>

                <h1 className="hero-name">
                    <div className="eyebrow">Portfolio — Selected Work</div>
                    Domince<br />
                    <span className="line2">Aseberos</span>
                </h1>

                <p className="hero-desc">
                    Crafting high-performance web experiences<br />
                    where code meets motion. GSAP · WebGL · React.
                </p>

                <div className="hero-cta">
                    <button className="btn-primary">View Work</button>
                    <button className="btn-ghost">Get in Touch</button>
                </div>
            </div>

            <div className="hero-right">
                <div className="tags-grid">
                    <div className="tag-grid-item active">GSAP</div>
                    <div className="tag-grid-item">THREE.JS</div>
                    <div className="tag-grid-item">GLSL</div>
                    <div className="tag-grid-item">FRAMER</div>
                    <div className="tag-grid-item">WEBGL</div>
                    <div className="tag-grid-item">REACT</div>
                    <div className="tag-grid-item">MOTION</div>
                    <div className="tag-grid-item">NEXT.JS</div>
                    <div className="tag-grid-item">LOTTINS</div>
                </div>

                <div className="metrics">
                    <div className="metric">
                        <div className="metric-val">60<sup>fps</sup></div>
                        <div className="metric-lbl">Render</div>
                    </div>
                    <div className="metric">
                        <div className="metric-val">48<sup>+</sup></div>
                        <div className="metric-lbl">Projects</div>
                    </div>
                    <div className="metric">
                        <div className="metric-val">1<sup>yr</sup></div>
                        <div className="metric-lbl">Experience</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
