import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * ProjectHeader component - displays back navigation button
 */
const ProjectHeader = () => {
    const navigate = useNavigate();
    const buttonRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: buttonRef });

    const handleHover = contextSafe((e) => {
        gsap.to(e.currentTarget, {
            rotation: -2,
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });

    const handleLeave = contextSafe((e) => {
        gsap.to(e.currentTarget, {
            rotation: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    return (
        <div className="max-w-7xl mx-auto mb-6">
            <button
                ref={buttonRef}
                onClick={() => navigate('/')}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
                onTouchStart={handleHover}
                onTouchEnd={handleLeave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-inter font-bold cursor-pointer transition-colors shadow-sm"
                style={{
                    background: 'rgb(var(--contrast-rgb))',
                    color: 'rgb(0,0,0)'
                }}
            >
                <ArrowLeft size={18} />
                <span>Back to Dashboard</span>
            </button>
        </div>
    );
};

export default ProjectHeader;
