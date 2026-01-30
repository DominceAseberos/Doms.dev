import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, HardDrive, Image as ImageIcon, FileText,
    Database, Share2, Upload, Trash2, ExternalLink, RefreshCw, X
} from 'lucide-react';
import strings from '../../config/adminStrings.json';
import { useAdminStore } from '../../store/adminStore';
import mediaService from '../../services/mediaService';

const MediaCenter = () => {
    const navigate = useNavigate();
    const { setAdminLoading } = useAdminStore();
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState({ count: 0, size: '0 MB' });
    const [previewFile, setPreviewFile] = useState(null);

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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAdminLoading(true, 'UPLOADING ASSET');
        try {
            await mediaService.uploadFile(file);
            await fetchFiles(false);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Check permissions.');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleDelete = async (name, bucket) => {
        if (!window.confirm('Terminate this asset from cloud storage?')) return;
        setAdminLoading(true, 'PURGING ASSET');
        try {
            await mediaService.deleteFile(name, bucket);
            setPreviewFile(null);
            fetchFiles(false);
        } catch (err) {
            alert('Delete failed');
        } finally {
            setAdminLoading(false);
        }
    };

    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        alert('URL Copied to clipboard');
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
                        <div className="space-y-1 border-l-4 border-primary pl-6">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                                {strings.media.titlePrefix} <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">{strings.media.titleSuffix}</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
                                {strings.media.subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => fetchFiles(true)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw size={18} className="opacity-40" />
                        </button>
                        <label className="px-8 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer hover:brightness-110">
                            <Upload size={16} strokeWidth={3} />
                            Upload Asset
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Nodes" value={stats.count} icon={Database} />
                    <StatCard label="Memory Usage" value={stats.size} icon={HardDrive} />
                    <StatCard label="Optimized" value="100%" icon={ImageIcon} />
                    <StatCard label="CDN Status" value="Online" icon={Share2} />
                </div>

                {/* File Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {files.map((file) => (
                        <div
                            key={file.name}
                            onClick={() => setPreviewFile(file)}
                            className="group relative aspect-square rounded-2xl bg-[#0f0f0f] border border-white/10 overflow-hidden cursor-pointer hover:border-primary/40 transition-all p-1"
                        >
                            {file.type === 'image' ? (
                                <img src={file.url} alt="" className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-all" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-all">
                                    <FileText size={32} />
                                    <span className="text-[8px] uppercase font-bold tracking-widest truncate max-w-[80%]">{file.name}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}

                    {files.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-20 uppercase tracking-[0.4em] text-xs font-mono">
                            Storage Vault Empty
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setPreviewFile(null)} />
                    <div className="relative w-full max-w-xl rounded-3xl border border-white/10 p-8 space-y-8 animate-in fade-in zoom-in duration-300 admin-modal-gradient">
                        <header className="flex justify-between items-center">
                            <h2 className="text-2xl font-black tracking-tighter text-primary italic uppercase">Asset Inspector</h2>
                            <button onClick={() => setPreviewFile(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="aspect-video w-full rounded-2xl bg-black/40 overflow-hidden border border-white/5 flex items-center justify-center">
                            {previewFile.type === 'image' ? (
                                <img src={previewFile.url} alt="" className="w-full h-full object-contain" />
                            ) : (
                                <FileText size={64} className="opacity-20" />
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-30">Asset Name</p>
                                <p className="text-sm font-mono truncate">{previewFile.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-30">Metadata</p>
                                <p className="text-xs font-mono opacity-50">{(previewFile.metadata?.size / 1024).toFixed(1)} KB | {previewFile.metadata?.mimetype}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => copyUrl(previewFile.url)}
                                className="py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest transition-all active:scale-95"
                            >
                                <Share2 size={14} /> Copy Link
                            </button>
                            <button
                                onClick={() => handleDelete(previewFile.name, previewFile.bucket)}
                                className="py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-500 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest transition-all active:scale-95"
                            >
                                <Trash2 size={14} /> Purge Asset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon }) => (
    <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
            <Icon size={20} className="text-primary opacity-50" />
        </div>
        <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-30 leading-none">{label}</p>
            <p className="text-xl font-bold tracking-tight">{value}</p>
        </div>
    </div>
);

export default MediaCenter;
