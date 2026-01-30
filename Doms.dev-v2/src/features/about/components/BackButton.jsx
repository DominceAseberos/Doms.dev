import { useButtonMotion } from '../../../hooks/useButtonMotion';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
const BackButton = () => {


    return (


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
    );
};

export default BackButton;
