import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiDownload, FiExternalLink, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import useThemeStore from '../store/useThemeStore';

const DocViewerModal = ({ isOpen, onClose, docUrl, title }) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const [publicUrl, setPublicUrl] = useState('');
    const [isMaximized, setIsMaximized] = useState(false);

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

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12" style={{ position: 'fixed' }}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div 
                className={`relative flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 ${
                    isMaximized 
                        ? 'w-[98vw] h-[98vh] max-w-none' 
                        : 'w-full max-w-5xl h-[85vh]'
                } ${
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
                    
                    <div className="flex items-center gap-1">
                        <button 
                            type="button"
                            onClick={() => setIsMaximized(!isMaximized)}
                            className={`relative z-10 p-2 rounded-full cursor-pointer transition-colors ${
                                isLight ? 'hover:bg-black/5 text-black' : 'hover:bg-white/5 text-white'
                            }`}
                            style={{ pointerEvents: 'auto' }}
                            title={isMaximized ? "Restore down" : "Maximize"}
                        >
                            {isMaximized ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
                        </button>
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
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-white relative">
                    {!isPdf && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#F9F7F1]">
                            <div className="max-w-md bg-white p-8 rounded-xl border border-black/10 shadow-sm">
                                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg mb-3">Development Mode</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Microsoft Office Viewer requires a publicly accessible URL to render `.docx` and `.pptx` documents. Because you are running on <strong>localhost</strong>, the viewer cannot reach your local file.
                                </p>
                                <p className="text-gray-900 font-medium text-sm">
                                    This will work normally in production. For now, please use the <strong>Download</strong> button above to view the file on your machine.
                                </p>
                            </div>
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default DocViewerModal;
