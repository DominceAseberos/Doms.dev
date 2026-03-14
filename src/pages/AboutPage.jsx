import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import ParticleBackground from '../components/ParticleBackground';

const AboutPage = () => {
    useEffect(() => {
        // Ensure page starts at top
        window.scrollTo(0, 0);

        // Stop Lenis on mount if needed, or just let it handle the new content
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
        }
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-[#c8ff3e]/30">
            <ParticleBackground />
            <NavBar />

            <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Sticky Sidebar Info */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-12">
                        <div className="space-y-4">
                            <p className="text-[#c8ff3e] ui-sub-label text-sm mb-2">Location</p>
                            <p className="text-2xl ui-body-copy">Worldwide / Remote</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[#c8ff3e] ui-sub-label text-sm mb-2">Social</p>
                            <div className="flex flex-col space-y-2">
                                <a href="#" className="text-xl text-white/82 hover:text-white transition-colors duration-300">Instagram</a>
                                <a href="#" className="text-xl text-white/82 hover:text-white transition-colors duration-300">Twitter (X)</a>
                                <a href="#" className="text-xl text-white/82 hover:text-white transition-colors duration-300">LinkedIn</a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[#c8ff3e] ui-sub-label text-sm mb-2">Capabilities</p>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {['Creative Development', 'Interaction Design', 'Technical Architecture', 'Custom Animation', 'Full-stack Systems'].map(item => (
                                    <span key={item} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Narrative Content */}
                    <div className="lg:col-span-8 space-y-24">
                        <section className="space-y-8">
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.9]">
                                Engineering <br />
                                <span className="text-[#c8ff3e]">Digital Poetry</span>
                            </h1>
                            <p className="text-2xl md:text-3xl ui-body-copy max-w-4xl">
                                I'm Domince, a multi-disciplinary craftsman dedicated to pushing the technical boundaries of what's possible on the web.
                            </p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase tracking-wider">The Philosophy</h3>
                                <p className="ui-body-copy">
                                    I believe the best digital experiences aren't just seen—they're felt. My work focuses on creating fluid, visceral interactions that respond to user intent with surgical precision.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase tracking-wider">The Approach</h3>
                                <p className="ui-body-copy">
                                    I avoid the "templated" mindset. Every line of code is handwritten to serve a specific purpose, prioritizing efficiency, scalability, and that elusive 'wow' factor.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-12 bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem] backdrop-blur-md">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase tracking-wider text-[#c8ff3e]">Beyond the browser</h3>
                                <p className="text-xl ui-body-copy">
                                    When I'm not deep in a GSAP timeline or refining a React component, you'll probably find me exploring the latest in creative technology, contributing to open-source experiments, or searching for the perfect cup of coffee.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <a href="mailto:hello@doms.dev" className="inline-block py-4 px-10 border border-[#c8ff3e] text-[#c8ff3e] font-bold uppercase tracking-widest rounded-full hover:bg-[#c8ff3e] hover:text-black transition-all duration-500 text-center">
                                    Let's build something ↗
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutPage;
