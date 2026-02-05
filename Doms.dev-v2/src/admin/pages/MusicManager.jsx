import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@shared/services/dashboardService';
import { audiusService } from '@shared/services/audiusService';
import {
    ArrowLeft, Music,
    Plus, Trash2, Edit3, Save, X, RefreshCw,
    Search, Play, Pause, DownloadCloud, Sparkles
} from 'lucide-react';

import { useAdminStore } from '@admin/store/adminStore';
import strings from '@shared/config/adminStrings.json';

const DISCOVERY_MOODS = ['Melancholy', 'Upbeat', 'Aggressive', 'Defiant', 'Easygoing', 'Energize'];
const PORTFOLIO_CATEGORIES = ['chill', 'drift', 'moody', 'fierce', 'upbeat'];

const MusicManager = () => {
    const [activeTab, setActiveTab] = useState('registry'); // 'registry' | 'discovery'
    const { isAdminLoading, setAdminLoading } = useAdminStore();
    const [tracks, setTracks] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'registry') {
            fetchAllData(true);
        }
    }, [activeTab]);

    // Auto-fetch missing metadata from Audius
    useEffect(() => {
        const fetchMissingMetadata = async () => {
            const tracksWithMissingData = tracks.filter(
                t => !t.title || !t.artist || t.title === 'Untitled Track'
            );

            if (tracksWithMissingData.length === 0) return;

            console.log(`[MusicManager] Auto-fetching metadata for ${tracksWithMissingData.length} tracks...`);

            for (const track of tracksWithMissingData) {
                try {
                    const metadata = await audiusService.getTrackById(track.id);
                    if (metadata) {
                        // Update database with fetched metadata
                        await dashboardService.update('tracks', track.id, {
                            title: metadata.title,
                            artist: metadata.artist,
                            duration: metadata.duration,
                            genre: metadata.genre,
                            img_src: metadata.cover_url || track.img_src,
                            external_id: metadata.external_id
                        });
                        console.log(`[MusicManager] ✓ Updated track ${track.id}: ${metadata.title}`);
                    }
                } catch (error) {
                    console.error(`[MusicManager] Failed to fetch metadata for track ${track.id}:`, error);
                }
            }

            // Refresh the list after updating
            if (tracksWithMissingData.length > 0) {
                await fetchAllData(false);
            }
        };

        if (tracks.length > 0) {
            fetchMissingMetadata();
        }
    }, [tracks.length]); // Only run when tracks count changes

    const fetchAllData = async (showOverlay = false) => {
        if (showOverlay) setAdminLoading(true, 'FETCHING AUDIO INDEX');
        try {
            const data = await dashboardService.getAll('tracks');
            setTracks(data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            if (showOverlay) setAdminLoading(false);
        }
    };

    const handleSave = async (table, payload) => {
        setAdminLoading(true, 'SYNCHRONIZING AUDIO NODE');
        try {
            if (editingItem?.id && !editingItem.isNewIngest) {
                await dashboardService.update(table, editingItem.id, payload);
            } else {
                // If it was a new ingest, remove the temporary isNewIngest flag
                const { isNewIngest, ...cleanPayload } = payload;

                // Ensure ID exists (for manual creation)
                if (!cleanPayload.id) {
                    cleanPayload.id = Math.floor(Math.random() * 2000000000);
                }

                await dashboardService.create(table, cleanPayload);
            }
            await fetchAllData();
            setIsModalOpen(false);
            setEditingItem(null);
            setActiveTab('registry'); // Switch back to view result
        } catch (err) {
            alert('Save failed: ' + err.message);
        } finally {
            setAdminLoading(false);
        }
    };

    const handleDelete = async (table, id) => {
        if (!window.confirm('Delete this track permanently?')) return;
        setAdminLoading(true, 'DELETING AUDIO NODE');
        try {
            await dashboardService.delete(table, id);
            await fetchAllData();
        } catch (err) {
            alert('Delete failed: ' + err.message);
        } finally {
            setAdminLoading(false);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleIngest = (audiusTrack) => {
        const payload = {
            id: audiusTrack.id, // Keep Audius ID
            title: audiusTrack.title,
            artist: audiusTrack.artist,
            img_src: audiusTrack.cover_url, // Map Audius cover to our DB img_src
            audio_url: audiusService.getStreamUrl(audiusTrack.id),
            external_id: audiusTrack.external_id,
            duration: audiusTrack.duration,
            genre: audiusTrack.genre,
            isNewIngest: true, // Flag to identify new ingest vs edit
            category: 'chill' // Default portfolio category
        };
        openModal(payload);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter selection:bg-white/20">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity group cursor-pointer"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            {strings.common.backToHub}
                        </button>
                        <header className="space-y-1 border-l-4 border-primary pl-6">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                                Music <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">Station</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
                                Audio Registry Control
                            </p>
                        </header>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('registry')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-white uppercase tracking-widest transition-all
                                 ${activeTab === 'registry' ?
                                    'border-blue-500 border text-blue-500 shadow-lg'
                                    :
                                    'hover:border-blue-500 border  opacity-50'}`}
                        >
                            Registry
                        </button>
                        <button
                            onClick={() => setActiveTab('discovery')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-white uppercase tracking-widest transition-all flex items-center gap-2 
                                ${activeTab === 'discovery' ? 'border-blue-500 border  text-blue-500 shadow-lg' : 'hover:border-blue-500 border opacity-50'}`}
                        >
                            <Sparkles size={14} /> Discovery
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px] pb-20">
                    {activeTab === 'registry' ? (
                        <TracksTab items={tracks} onEdit={openModal} onDelete={(id) => handleDelete('tracks', id)} />
                    ) : (
                        <DiscoveryTab onIngest={handleIngest} />
                    )}
                </div>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <Modal
                    item={editingItem}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    isSaving={isAdminLoading}
                />
            )}
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

/* --- SUB-COMPONENTS --- */

const CategoryFilter = ({ selected, onSelect, categories }) => (
    <div className="flex gap-2 overflow-x-auto p-4 custom-scrollbar">
        <button
            onClick={() => onSelect('ALL')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selected === 'ALL'
                ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-105'
                : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
        >
            ALL
        </button>
        {categories.map(cat => (
            <button
                key={cat}
                onClick={() => onSelect(cat)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selected === cat
                    ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-105'
                    : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
            >
                {cat}
            </button>
        ))}
    </div>
);

const DiscoveryTab = ({ onIngest }) => {
    const { setAdminLoading } = useAdminStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [playingPreview, setPlayingPreview] = useState(null);
    const [isBuffering, setIsBuffering] = useState(false);
    const [activeMood, setActiveMood] = useState('ALL');
    const audioRef = useRef(new Audio());

    useEffect(() => {
        loadTrending();

        // Setup audio event listeners
        const audio = audioRef.current;
        const handleCanPlay = () => setIsBuffering(false);
        const handleWaiting = () => setIsBuffering(true);

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('waiting', handleWaiting);

        return () => {
            audio.pause();
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('waiting', handleWaiting);
        };
    }, []);

    // Stop playback when results change (new search/trending)
    useEffect(() => {
        audioRef.current.pause();
        setPlayingPreview(null);
        setIsBuffering(false);
    }, [results]);

    const loadTrending = async () => {
        setAdminLoading(true, 'LOADING TRENDING TRACKS');
        const data = await audiusService.getTrending();
        setResults(data);
        setAdminLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setAdminLoading(true, 'SEARCHING AUDIUS LIBRARY');
        const data = await audiusService.searchTracks(query);
        setResults(data);
        setAdminLoading(false);
    };

    const togglePreview = async (url) => {
        try {
            if (playingPreview === url) {
                audioRef.current.pause();
                setPlayingPreview(null);
                setIsBuffering(false);
            } else {
                // Pause any currently playing audio first
                audioRef.current.pause();

                // Set state BEFORE starting playback so correct card shows spinner
                setPlayingPreview(url);
                setIsBuffering(true);
                audioRef.current.src = url;

                // Properly await play() to avoid AbortError
                await audioRef.current.play();
            }
        } catch (error) {
            // Ignore AbortError and other play interruptions
            setIsBuffering(false);
            setPlayingPreview(null);
            if (error.name !== 'AbortError') {
                console.error('Audio playback error:', error);
            }
        }
    };

    const handleMoodSelect = async (mood) => {
        setActiveMood(mood);
        if (mood === 'ALL') {
            loadTrending();
        } else {
            setAdminLoading(true, `EXPLORING ${mood.toUpperCase()} VIBES`);
            // Search Audius for the mood keyword
            const data = await audiusService.searchTracks(mood);
            setResults(data);
            setAdminLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Mood Filters */}
            <CategoryFilter selected={activeMood} onSelect={handleMoodSelect} categories={DISCOVERY_MOODS} />

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Audius Library..."
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-mono text-sm shadow-xl"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            </form>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(track => (
                    <div key={track.id} className="group p-5 bg-[#0f0f0f] border border-white/5 rounded-[2rem] hover:border-primary/30 transition-all hover:-translate-y-1 shadow-lg">
                        <div className="aspect-square rounded-2xl bg-black/50 mb-4 overflow-hidden relative flex items-center justify-center">
                            {track.cover_url ? (
                                <img
                                    src={track.cover_url}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                    alt={track.title}
                                />
                            ) : (
                                <Music size={48} className="opacity-10" />
                            )}
                            <button
                                onClick={() => togglePreview(audiusService.getStreamUrl(track.id))}
                                className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-all backdrop-blur-sm ${isBuffering && playingPreview === audiusService.getStreamUrl(track.id)
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-100'
                                    }`}
                            >
                                {isBuffering && playingPreview === audiusService.getStreamUrl(track.id) ? (
                                    <RefreshCw className="animate-spin text-white" size={32} />
                                ) : playingPreview === audiusService.getStreamUrl(track.id) ? (
                                    <Pause className="fill-white" size={32} />
                                ) : (
                                    <Play className="fill-white" size={32} />
                                )}
                            </button>
                        </div>
                        <div className="space-y-1 mb-4">
                            <h3 className="font-bold truncate text-sm">{track.title}</h3>
                            <p className="text-xs opacity-50 truncate">{track.artist}</p>
                        </div>
                        <button
                            onClick={() => onIngest(track)}
                            className="w-full py-3 rounded-xl bg-white/5 hover:bg-primary hover:text-black font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <DownloadCloud size={14} /> Add to Portfolio
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TracksTab = ({ items, onEdit, onDelete }) => {
    const [filterCategory, setFilterCategory] = useState('ALL');

    const filteredItems = filterCategory === 'ALL'
        ? items
        : items.filter(item => item.category === filterCategory);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Registry Filter */}
            <CategoryFilter selected={filterCategory} onSelect={setFilterCategory} categories={PORTFOLIO_CATEGORIES} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="p-6 rounded-[2rem] border border-white/5 bg-[#0f0f0f] flex gap-6 hover:border-primary/20 transition-all group admin-modal-gradient">
                        <div className="w-24 h-24 rounded-2xl bg-black/40 overflow-hidden shrink-0 border border-white/5 shadow-2xl relative">
                            {item.img_src ? <img src={item.img_src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} /> : <Music size={32} className="m-auto mt-8 opacity-10" />}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">
                                {item.category || 'Uncategorized'}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                            <h3 className="font-bold text-lg truncate uppercase italic group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-[10px] opacity-40 uppercase tracking-[0.3em] font-mono truncate">{item.artist}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/5 opacity-40">{item.duration || '0:00'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => onEdit(item)} className="p-2.5 hover:bg-white/5 rounded-xl cursor-pointer opacity-30 group-hover:opacity-100 transition-all"><Edit3 size={16} /></button>
                            <button onClick={() => onDelete(item.id)} className="p-2.5 hover:bg-red-500/10 text-red-500/50 rounded-xl cursor-pointer opacity-20 group-hover:opacity-60 transition-all"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {filteredItems.length === 0 && <EmptyState label="No Tracks Found in Cluster" />}
        </div>
    );
};

const EmptyState = ({ label }) => (
    <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] space-y-4 opacity-20 grayscale">
        <RefreshCw size={40} className="animate-spin-slow" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em]">{label}</span>
    </div>
);

const Modal = ({ item, onClose, onSave, isSaving }) => {
    const [formData, setFormData] = useState(item || {});

    const handleInternalSave = () => {
        // Always tracks
        onSave('tracks', formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#0f0f0f] rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(var(--theme-rgb),0.2)] flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 admin-modal-gradient">

                {/* Header - Fixed */}
                <div className="p-8 pb-4 flex-none border-b border-white/5 bg-[#0f0f0f]/50 backdrop-blur-md z-10">
                    <header className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-primary">
                                {item?.isNewIngest ? 'Ingest Sequence' : 'Reconfigure Node'}
                            </h2>
                            <p className="text-[9px] uppercase tracking-widest opacity-30 font-mono">Audio Node Configuration</p>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-white/10 transition-all">
                            <X size={24} />
                        </button>
                    </header>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleInternalSave(); }}>

                        {/* Artwork Preview */}
                        <div className="flex justify-center mb-6">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                                <img src={formData.img_src || '/placeholder.png'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] uppercase font-black tracking-widest">Preview</div>
                            </div>
                        </div>

                        {/* Mood Selector - NEW */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30 px-2 text-primary">Target Mood Cluster</label>
                            <div className="grid grid-cols-3 gap-2">
                                {PORTFOLIO_CATEGORIES.map(mood => (
                                    <button
                                        key={mood}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: mood })}
                                        className={`py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold border-2 transition-all ${formData.category === mood
                                            ? 'text-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] bg-cyan-950/30 scale-105 font-black'
                                            : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {mood}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30 px-2">Stream Title</label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/40 transition-all font-mono"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30 px-2">Creator</label>
                                <input
                                    type="text"
                                    value={formData.artist || ''}
                                    onChange={e => setFormData({ ...formData, artist: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/40 transition-all font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30 px-2">Duration</label>
                                <input
                                    type="text"
                                    value={formData.duration || ''}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/40 transition-all font-mono"
                                    required
                                />
                            </div>
                        </div>

                        {/* Hidden/ReadOnly Fields */}
                        <div className="opacity-30 pointer-events-none grayscale">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30 px-2">Data Stream (Source URL)</label>
                                <input
                                    type="text"
                                    value={formData.audio_url || ''}
                                    readOnly
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs font-mono truncate"
                                />
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer - Fixed */}
                <div className="p-8 pt-4 flex-none bg-[#0f0f0f] border-t border-white/5 z-20">
                    <button
                        onClick={handleInternalSave}
                        disabled={isSaving}
                        className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-[0.4em] text-[11px] hover:brightness-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-wait"
                    >
                        {isSaving ? (
                            <><RefreshCw size={20} className="animate-spin" /> SYNCHRONIZING...</>
                        ) : (
                            <><Save size={20} strokeWidth={3} /> Sync to Cloud Grid</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicManager;
