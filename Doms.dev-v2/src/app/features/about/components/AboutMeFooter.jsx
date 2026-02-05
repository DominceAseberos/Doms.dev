import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useButtonMotion } from '@shared/hooks/useButtonMotion';
import { getIconByName } from "@shared/utils/IconRegistry";

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
                 flex flex-col gap-4"

        >


            <div className="scroll-reveal flex justify-center gap-4" style={{ opacity: 0 }}>
                {Array.isArray(contacts) && contacts.map((contact, idx) => {
                    const Icon = getIconByName(contact.icon || 'Link');
                    return (
                        <AnimatedFooter key={idx} className="md:h-fit p-3 rounded-full border" style={{
                            borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                            background: 'rgba(var(--contrast-rgb), 0.05)'
                        }}>
                            <a href={contact.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                <Icon size={20} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                            </a>
                        </AnimatedFooter>
                    );
                })}
            </div>

            <p className="scroll-reveal text-center text-gray-400" style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', opacity: 0 }}>
                © 2026 {profile.name}
            </p>
        </div>
    );
};

export default AboutMeFooter;
