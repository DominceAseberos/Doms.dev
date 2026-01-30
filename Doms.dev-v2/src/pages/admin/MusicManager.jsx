import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import {
    ArrowLeft, Music,
    Plus, Trash2, Edit3, Save, X, RefreshCw
} from 'lucide-react';

import { useAdminStore } from '../../store/adminStore';
import strings from '../../config/adminStrings.json';

const MusicManager = () => {
    const [activeTab, setActiveTab] = useState('tracks');
    const { isAdminLoading, setAdminLoading } = useAdminStore();
    const [tracks, setTracks] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData(true);
    }, []);

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
            if (editingItem?.id) {
                await dashboardService.update(table, editingItem.id, payload);
            } else {
                await dashboardService.create(table, payload);
            }
            await fetchAllData();
            setIsModalOpen(false);
            setEditingItem(null);
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

                    <div className="flex gap-4">
                        <button
                            onClick={() => fetchAllData(true)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 group relative"
                        >
                            <RefreshCw size={18} className="opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all" />
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="px-8 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                        >
                            <Plus size={16} strokeWidth={3} />
                            Ingest Audio Track
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px] pb-20">
                    <TracksTab items={tracks} onEdit={openModal} onDelete={(id) => handleDelete('tracks', id)} />
                </div>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <Modal
                    tab={activeTab}
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

const TracksTab = ({ items, onEdit, onDelete }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map(item => (
            <div key={item.id} className="p-6 rounded-[2rem] border border-white/5 bg-[#0f0f0f] flex gap-6 hover:border-primary/20 transition-all group admin-modal-gradient">
                <div className="w-24 h-24 rounded-2xl bg-black/40 overflow-hidden shrink-0 border border-white/5 shadow-2xl relative">
                    {item.cover_url ? <img src={item.cover_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} /> : <Music size={32} className="m-auto mt-8 opacity-10" />}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        {items.length === 0 && <EmptyState label="Audio Registry Depleted" />}
    </div>
);

const EmptyState = ({ label }) => (
    <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] space-y-4 opacity-20 grayscale">
        <RefreshCw size={40} className="animate-spin-slow" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em]">{label}</span>
    </div>
);

const Modal = ({ tab, item, onClose, onSave, isSaving }) => {
    const [formData, setFormData] = useState(item || {});

    const getFields = () => {
        return [
            { name: 'title', label: 'Stream Title', type: 'text' },
            { name: 'artist', label: 'Creator (Artist)', type: 'text' },
            { name: 'cover_url', label: 'Thumbnail Endpoint (URL)', type: 'text' },
            { name: 'audio_url', label: 'Data Stream (File URL)', type: 'text' },
            { name: 'duration', label: 'Temporal Length (m:ss)', type: 'text' }
        ];
    };

    const handleInternalSave = () => {
        // Always tracks
        onSave('tracks', formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#0f0f0f] rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(var(--theme-rgb),0.2)] overflow-hidden animate-in zoom-in-95 duration-300 admin-modal-gradient">
                <div className="p-10 space-y-8">
                    <header className="flex justify-between items-center border-b border-white/5 pb-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-primary">
                                {item ? 'Reconfigure' : 'Initialize'} Sequence
                            </h2>
                            <p className="text-[9px] uppercase tracking-widest opacity-30 font-mono">Audio Node Configuration</p>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-white/10 transition-all">
                            <X size={24} />
                        </button>
                    </header>

                    <form className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar" onSubmit={(e) => { e.preventDefault(); handleInternalSave(); }}>
                        {getFields().map(field => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30 px-2">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/40 transition-all font-mono min-h-[120px] resize-none"
                                        required
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                        placeholder={field.placeholder}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/40 transition-all font-mono"
                                        required
                                    />
                                )}
                            </div>
                        ))}
                    </form>

                    <button
                        onClick={handleInternalSave}
                        disabled={isSaving}
                        className="w-full py-6 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.4em] text-[11px] hover:brightness-110 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-wait"
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
