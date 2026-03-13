import React from 'react';
import NavBar from '../components/NavBar';
import ParticleBackground from '../components/ParticleBackground';

const LabPage = () => {
    return (
        <div className="relative min-h-screen bg-[#0c0c0c] text-white">
            <NavBar />
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <ParticleBackground />
            </div>

            <main className="relative z-10 pt-48 px-6 text-center">
                <span className="font-mono text-xs text-white/30 uppercase tracking-[0.6em] mb-8 block">
                    Experimental Hub
                </span>
                <h1 className="text-7xl sm:text-9xl font-black uppercase tracking-tighter mb-12">
                    The <span className="text-[#c8ff3e]">Lab</span>
                </h1>
                <p className="max-w-xl mx-auto text-white/50 text-lg sm:text-xl font-light leading-relaxed">
                    Under construction. This is where the code experiments live. Check back soon for interactive prototypes and architectural puzzles.
                </p>
            </main>
        </div>
    );
};

export default LabPage;
