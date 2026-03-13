import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import NavBar from '../components/NavBar';
import ParticleBackground from '../components/ParticleBackground';

const ContactPage = () => {
    const formRef = useRef(null);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Premium Entrance Animation
            gsap.from(".contact-header > *", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out",
                delay: 0.5
            });

            gsap.from(".contact-form-group", {
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 1
            });

            gsap.from(".contact-info > *", {
                x: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 1.2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we could add a "Success" state animation
        alert("Message sent! (Simulation)");
    };

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#0c0c0c] text-white">
            <NavBar />
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <ParticleBackground />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="contact-header mb-16 sm:mb-24">
                    <span className="font-mono text-[10px] sm:text-xs text-white/30 uppercase tracking-[0.6em] mb-4 block">
                        Available for Collaboration
                    </span>
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
                        Let's Talk <br />
                        <span className="text-[#c8ff3e] drop-shadow-[0_0_30px_rgba(200,255,62,0.3)]">Digital</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
                    {/* Form Section */}
                    <div className="w-full lg:w-3/5">
                        <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
                            <div className="contact-form-group border-b border-white/10 focus-within:border-[#c8ff3e] transition-colors pb-4">
                                <label className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em] mb-4 block">01 — Name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl font-light placeholder:text-white/10"
                                    required
                                />
                            </div>

                            <div className="contact-form-group border-b border-white/10 focus-within:border-[#c8ff3e] transition-colors pb-4">
                                <label className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em] mb-4 block">02 — Email</label>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl font-light placeholder:text-white/10"
                                    required
                                />
                            </div>

                            <div className="contact-form-group border-b border-white/10 focus-within:border-[#c8ff3e] transition-colors pb-4">
                                <label className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em] mb-4 block">03 — Message</label>
                                <textarea
                                    rows="1"
                                    placeholder="Your Message"
                                    className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl font-light placeholder:text-white/10 resize-none"
                                    onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                    required
                                />
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    className="group relative inline-flex items-center justify-center font-bold text-sm uppercase tracking-widest text-[#505255] bg-[#c8ff3e] px-12 py-5 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                                >
                                    Send Message ↗
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact details */}
                    <div className="w-full lg:w-2/5 flex flex-col justify-between py-4">
                        <div className="contact-info space-y-12">
                            <div>
                                <h3 className="font-mono text-[10px] text-white/20 uppercase tracking-[0.4em] mb-6">Contact Details</h3>
                                <a href="mailto:hello@domince.dev" className="text-xl sm:text-2xl hover:text-[#c8ff3e] transition-colors">hello@domince.dev</a>
                            </div>

                            <div>
                                <h3 className="font-mono text-[10px] text-white/20 uppercase tracking-[0.4em] mb-6">Socials</h3>
                                <div className="flex flex-col gap-3">
                                    <a href="#" className="text-lg hover:text-[#c8ff3e] transition-colors">Twitter (X)</a>
                                    <a href="#" className="text-lg hover:text-[#c8ff3e] transition-colors">LinkedIn</a>
                                    <a href="#" className="text-lg hover:text-[#c8ff3e] transition-colors">GitHub</a>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-mono text-[10px] text-white/20 uppercase tracking-[0.4em] mb-6">Location</h3>
                                <p className="text-lg text-white/60">Digital Space (Remote)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContactPage;
