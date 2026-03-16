import React, { forwardRef, useState, useEffect } from 'react';
import './NarrativeSection.css';

const NarrativeSection = forwardRef((props, ref) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date, timeZone = undefined) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: timeZone
        });
    };

    const SparkleIcon = ({ size = 14 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
            <path d="M19,1L17.74,3.76L15,5L17.74,6.24L19,9L20.26,6.24L23,5L20.26,3.76L19,1M9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5L9,4M19,15L17.74,17.76L15,19L17.74,20.24L19,23L20.26,20.24L23,19L20.26,17.76L19,15Z" />
        </svg>
    );

    return (
        <section ref={ref} className="narrative-section relative z-10 pt-8 md:pt-16 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto text-white">
            <h2 
                className="font-black uppercase tracking-tight mb-12 lg:mb-16 text-left leading-[1.1] text-[#f2ede6]"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', fontFamily: "'Bebas Neue', sans-serif" }}
            >
                Engineering <span className="text-[var(--accent)] font-bold">Digital Poetry</span>
            </h2>
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Main Narrative Content - Prioritized on Mobile */}
                <div className="order-1 lg:order-2 lg:col-span-8 space-y-20 lg:space-y-32">
                    <section className="space-y-8">
                        <p className="text-2xl md:text-3xl lg:text-4xl ui-body-copy max-w-4xl leading-tight">
                            I'm Domince Aseberos, a technical architect specializing in the transition from static logic to immersive, motion-driven web systems.
                        </p>
                    </section>

                    {/* Secondary Content - Now inside the right column */}
                    <div className="space-y-20 lg:space-y-32 w-full">
                        <section className="ns-divider space-y-20">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold uppercase tracking-wider text-[var(--accent)]">The Philosophy</h3>
                                <p className="text-lg ui-body-copy leading-relaxed">
                                    I believe that the modern web belongs to those who move the fastest. By integrating AI-driven logic into my architectural workflow, I bypass manual friction to focus on what truly matters: creating high-performance, immersive systems that respond to user intent with surgical precision.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold uppercase tracking-wider text-[var(--accent)]">The Approach</h3>
                                <p className="text-lg ui-body-copy leading-relaxed">
                                    I don't believe in manual friction for the sake of it. I leverage AI-augmented development to accelerate the architectural process, allowing me to focus on high-level logic, complex motion sequencing, and scalability. By integrating intelligent tools into my workflow, I transform ideas into high-performance, cinematic experiences with surgical speed and precision.
                                </p>
                            </div>
                        </section>

                        <section className="ns-info-card space-y-12 p-8 md:p-16 rounded-[3rem]">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold uppercase tracking-wider text-[var(--accent)]">Beyond the Browser</h3>
                                <p className="text-lg ui-body-copy leading-relaxed">
                                    When the GSAP timeline stops and I exit dev mode, the focus shifts to personal optimization and exploration. You'll usually find me recalibrating through high-intensity training, engaging in competitive online gaming, or catching up on the latest anime. I balance this creative downtime with the same surgical precision I apply to my code—ensuring all academic milestones and architectural projects are executed to my standards.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Sticky Sidebar Info - Becomes Compact Grid on Mobile */}
                <div className="order-2 lg:order-1 lg:col-span-4 lg:sticky lg:top-32 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-0 lg:space-y-12">
                        <div className="space-y-4">
                            <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Location</p>
                            <p className="ns-sidebar-text text-xl lg:text-3xl ui-body-copy font-normal">Worldwide / Remote</p>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-8 lg:gap-12">
                            <div className="space-y-4">
                                <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Visitor Time</p>
                                <p className="ns-sidebar-text text-xl lg:text-3xl ui-body-copy font-mono tabular-nums">{formatTime(time)}</p>
                            </div>

                            <div className="space-y-4">
                                <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Manila / PH</p>
                                <p className="ns-sidebar-text text-xl lg:text-3xl ui-body-copy font-mono tabular-nums">{formatTime(time, 'Asia/Manila')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Social</p>
                            <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
                                {[
                                    { name: 'Instagram', url: '#' },
                                    { name: 'Twitter (X)', url: '#' },
                                    { name: 'LinkedIn', url: '#' }
                                ].map((link) => (
                                    <a 
                                        key={link.name}
                                        href={link.url} 
                                        className="ns-social-link text-lg lg:text-3xl transition-all duration-300 flex items-center group"
                                    >
                                        {link.name}
                                        <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Capabilities</p>
                            <div className="flex flex-wrap gap-2 text-xs lg:text-base">
                                {['Creative Development', 'Interaction Design', 'Technical Architecture', 'Custom Animation', 'Full-stack'].map(item => (
                                    <span key={item} className="ns-pill px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full cursor-default font-medium">{item}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">AI-Augmented Stack</p>
                            <div className="flex flex-wrap gap-2 text-xs lg:text-base">
                                {['GPT-4o', 'Claude 3.7', 'Gemini', 'Cursor', 'Perplexity'].map(tool => (
                                    <span key={tool} className="ns-ai-pill px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full flex items-center gap-2 cursor-default font-medium">
                                        <SparkleIcon size={12} className="lg:w-4 lg:h-4" />
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Design & UI/UX</p>
                            <div className="flex flex-wrap gap-2 text-xs lg:text-base">
                                {['Figma', 'Principle', 'Spline', 'Canva'].map(item => (
                                    <span key={item} className="ns-pill px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full cursor-default font-medium">{item}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Motion & SVG</p>
                            <div className="flex flex-wrap gap-2 text-xs lg:text-base">
                                {['GSAP', 'LottieFiles', 'Framer', 'SVG Editor'].map(item => (
                                    <span key={item} className="ns-pill px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full cursor-default font-medium">{item}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="ns-sidebar-label ui-sub-label text-base uppercase tracking-widest">Assets & Optimization</p>
                            <div className="flex flex-wrap gap-2 text-xs lg:text-base">
                                {['Nano Banana', 'ImageOptim', 'Vercel', 'AWS'].map(item => (
                                    <span key={item} className="ns-pill px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full cursor-default font-medium">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
});

export default NarrativeSection;
