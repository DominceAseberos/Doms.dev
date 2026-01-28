import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HardDrive, Image as ImageIcon, FileText, Database, Share2 } from 'lucide-react';
import strings from '../../config/adminStrings.json';
import { useAdminStore } from '../../store/adminStore';
import mediaService from '../../services/mediaService';

const MediaCenter = () => {
    const navigate = useNavigate();
    const { setAdminLoading } = useAdminStore();
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState({ count: 0, size: '0 MB' });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    useEffect(() => {
        fetchFiles(true);
    }, []);

    const fetchFiles = async (showOverlay = false) => {
        if (showOverlay) setAdminLoading(true, 'FETCHING CLOUD ASSETS');
        try {
            const data = await mediaService.getFiles();
            setFiles(data);
            calculateStats(data);
        } catch (err) {
            console.error('Fetch failed:', err);
        } finally {
            if (showOverlay) setAdminLoading(false);
        }
    };

    const calculateStats = (fileList) => {
        const totalSize = fileList.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
        setStats({
            count: fileList.length,
            size: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
        });
    };

    const handleDelete = async (name) => {
        if (!window.confirm('Delete this asset?')) return;
        setAdminLoading(true, 'PURGING ASSET');
        try {
            await mediaService.deleteFile(name);
            fetchFiles(false);
        } catch (err) {
            alert('Delete failed');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleUploadComplete = () => {
        setIsUploadModalOpen(false);
        fetchFiles(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            {strings.common.backToAdmin}
                        </button>
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                                {strings.media.titlePrefix} <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">{strings.media.titleSuffix}</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
                                {strings.media.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-12 rounded-[2rem] bg-[#0f0f0f] border border-white/5 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] admin-modal-gradient">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center relative">
                        <HardDrive size={40} className="text-primary opacity-40" />
                        <div className="absolute inset-0 animate-pulse rounded-full border border-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Storage Syncing</h2>
                        <p className="max-w-sm text-xs opacity-40 leading-relaxed font-inter">The centralized media storage system is currently being optimized for high-performance asset delivery across all nodes.</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <ImageIcon size={16} className="opacity-30" />
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Assets</span>
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <Database size={16} className="opacity-30" />
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Schema</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaCenter;
