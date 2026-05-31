import React, { useEffect, useState } from 'react';
import { FiX, FiDownload, FiExternalLink } from 'react-icons/fi';
import useThemeStore from '../store/useThemeStore';

const DocViewerModal = ({ isOpen, onClose, docUrl, title }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const [publicUrl, setPublicUrl] = useState('');

    useEffect(() => {
        if (docUrl) {
            // For Microsoft Office Viewer to work, we need a fully qualified absolute URL
            // In development this won't load the actual document because localhost isn't accessible to MS servers
            const origin = window.location.origin;
            setPublicUrl(`${origin}${docUrl}`);
        }
    }, [docUrl]);

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

    const isPdf = docUrl && docUrl.toLowerCase().endsWith('.pdf');
    const msViewerEmbedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl)}`;

    const iframeSrc = isPdf ? publicUrl : msViewerEmbedUrl;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div 
                className={`relative w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${
                    isLight 
                        ? 'bg-[#F9F7F1] border-black/10' 
                        : 'bg-[#1a1a1a] border-white/10'
                }`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <h2 className={`font-mono text-sm tracking-widest font-bold uppercase ${isLight ? 'text-black' : 'text-white'}`}>
                            {title || 'Documentation'}
                        </h2>
                        
                        <a 
                            href={docUrl}
                            download
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                isLight 
                                    ? 'bg-black/5 hover:bg-black/10 text-black' 
                                    : 'bg-white/5 hover:bg-white/10 text-white'
                            }`}
                            style={{ pointerEvents: 'auto' }}
                        >
                            <FiDownload size={14} />
                            <span className="hidden sm:inline">Download</span>
                        </a>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={onClose}
                        className={`relative z-10 p-2 -mr-2 rounded-full cursor-pointer transition-colors ${
                            isLight ? 'hover:bg-black/5 text-black' : 'hover:bg-white/5 text-white'
                        }`}
                        style={{ pointerEvents: 'auto' }}
                        aria-label="Close modal"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-white">
                    <iframe 
                        src={iframeSrc}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Document Viewer"
                        className="w-full h-full"
                    >
                        This browser does not support inline document viewing. Please download the document to view it.
                    </iframe>
                </div>
            </div>
        </div>
    );
};

export default DocViewerModal;
