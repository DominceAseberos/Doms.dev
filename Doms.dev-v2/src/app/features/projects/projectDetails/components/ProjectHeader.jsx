import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useButtonMotion } from '@shared/hooks/useButtonMotion';

/**
 * ProjectHeader component - displays back navigation button
 */
const ProjectHeader = () => {
    const navigate = useNavigate();
    const { ref, onEnter, onLeave, onTap } = useButtonMotion();

    const handleClick = () => {
        onTap();
        // Small delay to allow animation to play before navigating? 
        // Or just let it happen. onTap is async but doesn't block.
        // Actually onTap has a timeout for restore.
        // For navigation it might be instant.
        navigate('/');
    };

    return (
        <div className="max-w-7xl mx-auto mb-6">
            <button
                ref={ref}
                onClick={handleClick}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
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
