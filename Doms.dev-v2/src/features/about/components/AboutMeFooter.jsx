import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import { useButtonMotion } from '../../../hooks/useButtonMotion';

const AnimatedFooter = ({ children, className = '', style = {} }) => {
    const motion = useButtonMotion();
    return (
        <span
            ref={motion.ref}
            onMouseEnter={motion.onEnter}
            onMouseLeave={motion.onLeave}
            onMouseDown={motion.onTap}
            className={`inline-block cursor-pointer select-none ${className}`}
            style={style}
        >
            {children}
        </span>
    );
};

const AboutMeFooter = ({ footerRef, contacts, profile }) => {
    return (
        <div
            ref={footerRef}
            className="
                items-center
                md:col-span-12 md:h-fit md:flex md:flex-row md:justify-between  
                md:items-center
                rounded-2xl p-6 border border-white/5 flex flex-col gap-4"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <AnimatedFooter>
                <Link to="/">
                    <button
                        className="
                            px-6
                            md:py-3 md:w-full md:px-3    
                            scroll-reveal w-full py-3 rounded-xl font-semibold flex flex-row justify-between gap-2 hover:cursor-pointer border"
                        style={{
                            color: 'rgb(var(--contrast-rgb))',
                            borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                            fontSize: 'clamp(12px, 2.2vw, 14px)'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>
                </Link>
            </AnimatedFooter>

            <div className="scroll-reveal flex justify-center gap-4">
                <AnimatedFooter className="md:h-fit p-3 rounded-full border" style={{
                    borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                    background: 'rgba(var(--contrast-rgb), 0.05)'
                }}>
                    <a href={contacts.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <Github size={20} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                    </a>
                </AnimatedFooter>

                <AnimatedFooter className="md:h-fit p-3 rounded-full border" style={{
                    borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                    background: 'rgba(var(--contrast-rgb), 0.05)'
                }}>
                    <a href="#" className="flex items-center justify-center">
                        <Linkedin size={20} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                    </a>
                </AnimatedFooter>

                <AnimatedFooter className="md:h-fit p-3 rounded-full border" style={{
                    borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                    background: 'rgba(var(--contrast-rgb), 0.05)'
                }}>
                    <a href={`mailto:${contacts.email}`} className="flex items-center justify-center">
                        <Mail size={20} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                    </a>
                </AnimatedFooter>

                <AnimatedFooter className="md:h-fit p-3 rounded-full border" style={{
                    borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                    background: 'rgba(var(--contrast-rgb), 0.05)'
                }}>
                    <a href={contacts.messenger} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <MessageCircle size={20} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                    </a>
                </AnimatedFooter>
            </div>

            <p className="scroll-reveal text-center text-gray-400" style={{ fontSize: 'clamp(10px, 1.5vw, 11px)' }}>
                © 2026 {profile.name}
            </p>
        </div>
    );
};

export default AboutMeFooter;
