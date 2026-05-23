import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiX, FiExternalLink } from 'react-icons/fi';
import useThemeStore from '../../../store/useThemeStore';

/**
 * Converts a standard GitHub URL to a raw user content URL
 * @param {string} url - e.g., https://github.com/DominceAseberos/Vayora/blob/main/SKILLS.md
 * @returns {string} - e.g., https://raw.githubusercontent.com/DominceAseberos/Vayora/main/SKILLS.md
 */
const getRawGithubUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/')) return url; // Support local public files
    if (url.includes('raw.githubusercontent.com')) return url;
    
    // Replace domain and remove /blob/
    return url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
};

const MarkdownViewerModal = ({ isOpen, onClose, githubUrl, title = "Documentation" }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const [markdownContent, setMarkdownContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !githubUrl) return;

        let isMounted = true;
        setIsLoading(true);
        setError(null);
        setMarkdownContent('');

        const fetchMarkdown = async () => {
            try {
                const rawUrl = getRawGithubUrl(githubUrl);
                const response = await fetch(rawUrl);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                
                const text = await response.text();
                if (isMounted) {
                    setMarkdownContent(text);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load markdown content. Please try opening the link directly.');
                    setIsLoading(false);
                }
            }
        };

        fetchMarkdown();

        return () => {
            isMounted = false;
        };
    }, [isOpen, githubUrl]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div 
                className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${
                    isLight 
                        ? 'bg-[#FAF6EF] border-black/10' 
                        : 'bg-[#0f1115] border-white/10'
                }`}
                style={{
                    animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
            >
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <h2 className="font-medium tracking-wide opacity-80">{title}</h2>
                        <a 
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`opacity-50 transition-opacity hover:opacity-100 ${isLight ? 'hover:text-black' : 'hover:text-white'}`}
                            title="Open in GitHub"
                        >
                            <FiExternalLink size={14} />
                        </a>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose}
                        className={`relative z-10 p-2 -mr-2 rounded-full cursor-pointer transition-colors ${
                            isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                        }`}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-4 opacity-50">
                            <div className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin ${isLight ? 'border-black/50' : 'border-white/50'}`} />
                            <p className="text-sm tracking-wide">Fetching from GitHub...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 opacity-70">
                            <p className="mb-4">{error}</p>
                            <a 
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-4"
                            >
                                Open on GitHub Instead
                            </a>
                        </div>
                    ) : (
                        <div className="prose-custom w-full max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdownContent}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                @keyframes modalSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'};
                }
            `}</style>
        </div>
    );
};

export default MarkdownViewerModal;
