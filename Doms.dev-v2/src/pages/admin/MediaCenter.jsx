import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, HardDrive, Trash2, FileText, Image as ImageIcon, ExternalLink, RefreshCw, Upload, Search, X } from 'lucide-react';

const MediaCenter = () => {
    const [buckets, setBuckets] = useState(['project-images', 'avatars', 'music-covers']);
    const [selectedBucket, setSelectedBucket] = useState('project-images');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const navigate = useNavigate();

    useEffect(() => {
        fetchFiles();
    }, [selectedBucket]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.storage.from(selectedBucket).list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });
            if (error) throw error;
            setFiles(data);
        } catch (err) {
            console.error('Failed to fetch files:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const { error } = await supabase.storage.from(selectedBucket).upload(fileName, file);
            if (error) throw error;
            fetchFiles();
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileName) => {
        if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;

        try {
            const { error } = await supabase.storage.from(selectedBucket).remove([fileName]);
            if (error) throw error;
            fetchFiles();
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Delete failed: ' + err.message);
        }
    };

    const getPublicUrl = (fileName) => {
        const { data } = supabase.storage.from(selectedBucket).getPublicUrl(fileName);
        return data.publicUrl;
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const isImage = (name) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    <label className="px-6 py-3 rounded-full flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer shadow-lg bg-white text-black hover:bg-gray-200">
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                        {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? 'Processing...' : 'Upload Asset'}
                    </label>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                    <header className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                            MEDIA CENTER
                        </h1>
                        <p className="text-xs uppercase tracking-widest opacity-50 font-mono">
                            Supabase Storage Management
                        </p>
                    </header>

                    <div className="flex flex-wrap gap-2">
                        {buckets.map(b => (
                            <button
                                key={b}
                                onClick={() => setSelectedBucket(b)}
                                className={`px-4 py-2 rounded-xl text-[10px] uppercase font-bold tracking-widest border transition-all ${selectedBucket === b
                                        ? 'bg-white/10 border-white/20 text-white'
                                        : 'bg-transparent border-white/5 text-white/40 hover:border-white/10 hover:text-white/60'
                                    }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-white/5 py-6">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                        <input
                            type="text"
                            placeholder="Filter files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all font-mono"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30'}`}
                            >
                                List
                            </button>
                        </div>
                        <button onClick={fetchFiles} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-white/5 border-t-white rounded-full animate-spin" />
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <HardDrive size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm opacity-30 font-mono uppercase tracking-widest">No assets found in "{selectedBucket}"</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        : "space-y-2"
                    }>
                        {filteredFiles.map((file) => {
                            const url = getPublicUrl(file.name);
                            const isImg = isImage(file.name);

                            if (viewMode === 'grid') {
                                return (
                                    <div key={file.id} className="group aspect-square rounded-2xl border border-white/5 bg-white/5 overflow-hidden flex flex-col hover:border-white/20 transition-all relative">
                                        <div className="flex-1 bg-black/40 flex items-center justify-center relative overflow-hidden">
                                            {isImg ? (
                                                <img src={url} alt={file.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                                    <FileText size={48} />
                                                    <span className="text-[10px] font-mono uppercase">{file.name.split('.').pop()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 bg-white/5 backdrop-blur-md relative">
                                            <p className="text-[10px] font-mono truncate opacity-60 mb-2">{file.name}</p>
                                            <div className="flex justify-between items-center">
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button onClick={() => handleDelete(file.name)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-red-500/40 hover:text-red-500">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={file.id} className="group flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden shrink-0">
                                        {isImg ? <img src={url} className="w-full h-full object-cover" /> : <FileText size={18} className="opacity-20" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-mono truncate text-white/80">{file.name}</p>
                                        <p className="text-[10px] opacity-30 uppercase font-mono">{(file.metadata?.size / 1024).toFixed(1)} KB • {new Date(file.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/30 hover:text-white">
                                            <ExternalLink size={16} />
                                        </a>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(url);
                                                alert('URL copied to clipboard!');
                                            }}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-all"
                                        >
                                            Copy Link
                                        </button>
                                        <button onClick={() => handleDelete(file.name)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500/40 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaCenter;
