import { useButtonMotion } from '../../../hooks/useButtonMotion';

const AnimatedResume = ({ children, className = '', style = {} }) => {
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
const DownloadCvButton = ({ profile }) => {


    return (


        <AnimatedResume>
            {profile?.cv ? (
                <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                >
                    <button
                        className="w-full h-fit py-4 px-4 rounded-xl flex-nowrap font-bold uppercase tracking-widest transition-all hover:cursor-pointer"
                        style={{
                            background: 'rgb(var(--contrast-rgb))',
                            color: '#000',
                            fontSize: 'clamp(10px, 2vw, 12px)'
                        }}
                    >
                        Download CV
                    </button>
                </a>
            ) : (
                <button
                    className="w-full h-fit py-4 px-4 rounded-xl flex-nowrap font-bold uppercase tracking-widest transition-all opacity-50 cursor-not-allowed"
                    style={{
                        background: 'rgb(var(--contrast-rgb))',
                        color: '#000',
                        fontSize: 'clamp(10px, 2vw, 12px)'
                    }}
                >
                    No CV Available
                </button>
            )}
        </AnimatedResume>
    );
};

export default DownloadCvButton;
