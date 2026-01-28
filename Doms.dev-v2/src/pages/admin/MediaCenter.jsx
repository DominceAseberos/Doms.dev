import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HardDrive, Image as ImageIcon, FileText, Database, Share2 } from 'lucide-react';

const MediaCenter = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="space-y-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <ArrowLeft size={14} /> Hub
                    </button>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        MEDIA <span className="opacity-20 text-white italic font-light">CENTER</span>
                    </h1>
                </header>

                <div className="p-12 rounded-[3.5rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center relative">
                        <HardDrive size={40} className="opacity-20" />
                        <div className="absolute inset-0 animate-ping rounded-full border border-white/10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Storage Initializing</h2>
                        <p className="max-w-sm text-sm opacity-40 leading-relaxed text-balance">The centralized media storage system is currently being optimized for high-performance asset delivery.</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <ImageIcon size={16} className="opacity-30" />
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Images</span>
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <Database size={16} className="opacity-30" />
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Database</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaCenter;
