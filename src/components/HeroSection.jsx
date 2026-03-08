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

                <div className="eyebrow">Portfolio — Selected Work</div>

                <h1 className="hero-name">
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
                <div className="tags">
                    <div className="tag active">GSAP</div>
                    <div className="tag">WebGL</div>
                    <div className="tag">Three.js</div>
                    <div className="tag">React</div>
                    <div className="tag">GLSL</div>
                    <div className="tag">Motion</div>
                    <div className="tag">Next.js</div>
                </div>

                <div className="metrics">
                    <div className="metric">
                        <div className="metric-val">60<sup>fps</sup></div>
                        <div className="metric-lbl">Render</div>
                    </div>
                    <div className="metric" style={{ paddingLeft: '24px' }}>
                        <div className="metric-val">48<sup>+</sup></div>
                        <div className="metric-lbl">Projects</div>
                    </div>
                    <div className="metric" style={{ paddingLeft: '24px' }}>
                        <div className="metric-val">5<sup>yr</sup></div>
                        <div className="metric-lbl">Experience</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
