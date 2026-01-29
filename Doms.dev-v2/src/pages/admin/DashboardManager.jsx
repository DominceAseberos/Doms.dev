import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import {
    ArrowLeft, LayoutGrid, Contact, GraduationCap, Music,
    Plus, Trash2, Edit3, Save, X, RefreshCw, ExternalLink,
    Code2, Globe, Github, Linkedin, Twitter, MessageSquare
} from 'lucide-react';

import { useAdminStore } from '../../store/adminStore';
import strings from '../../config/adminStrings.json';

const DashboardManager = () => {
    const [activeTab, setActiveTab] = useState('socials');
    const { isAdminLoading, setAdminLoading } = useAdminStore();
    const [data, setData] = useState({ socials: [], tech: [], education: [], tracks: [] });
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        fetchAllData(true);
    }, []);

    const fetchAllData = async (showOverlay = false) => {
        if (showOverlay) setAdminLoading(true, 'FETCHING ECOSYSTEM DATA');
        try {
            const [socials, tech, education, tracks] = await Promise.all([
                dashboardService.getAll('contacts'),
                dashboardService.getAll('tech_stacks'),
                dashboardService.getAll('education'),
                dashboardService.getAll('tracks')
            ]);
            setData({ socials, tech, education, tracks });
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            if (showOverlay) setAdminLoading(false);
        }
    };

    const handleSave = async (table, payload) => {
        setAdminLoading(true, 'SYNCHRONIZING CHANGES');
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
        if (!window.confirm('Terminate this node?')) return;
        setAdminLoading(true, 'DELETING NODE');
        try {
            await dashboardService.delete(table, id);
            await fetchAllData();
        } catch (err) {
            alert('Delete failed: ' + err.message);
        } finally {
            setAdminLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'socials': return <SocialsTab items={data.socials} onEdit={openModal} onDelete={(id) => handleDelete('contacts', id)} />;
            case 'tech': return <TechTab items={data.tech} onEdit={openModal} onDelete={(id) => handleDelete('tech_stacks', id)} />;
            case 'education': return <EducationTab items={data.education} onEdit={openModal} onDelete={(id) => handleDelete('education', id)} />;
            case 'tracks': return <TracksTab items={data.tracks} onEdit={openModal} onDelete={(id) => handleDelete('tracks', id)} />;
            default: return null;
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter selection:bg-white/20" ref={containerRef}>
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
                                {strings.dashboard.titlePrefix} <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">{strings.dashboard.titleSuffix}</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
                                {strings.dashboard.subtitle}
                            </p>
                        </header>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => fetchAllData(true)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw size={18} className="opacity-40" />
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="px-8 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                        >
                            <Plus size={16} strokeWidth={3} />
                            Deploy New Node
                        </button>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-wrap gap-2 border-b border-white/5 pb-6">
                    {[
                        { id: 'socials', label: 'Social Nodes', icon: Contact },
                        { id: 'tech', label: 'Tech Stack', icon: Code2 },
                        { id: 'education', label: 'Career Index', icon: GraduationCap },
                        { id: 'tracks', label: 'Music Catalog', icon: Music },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all border ${activeTab === tab.id
                                ? 'bg-white/10 border-white/30 text-white shadow-lg'
                                : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="min-h-[400px] pb-20">
                    {renderTabContent()}
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

const SocialsTab = ({ items, onEdit, onDelete }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map(item => (
            <div key={item.id} className="p-8 rounded-[2rem] border border-white/10 bg-[#0f0f0f] hover:border-primary/20 transition-all group flex flex-col justify-between h-56 admin-modal-gradient shadow-xl">
                <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 transition-all">
                        <Globe size={24} className="opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(item)} className="p-2.5 hover:bg-white/5 rounded-xl transition-colors cursor-pointer opacity-60 group-hover:opacity-100"><Edit3 size={16} /></button>
                        <button onClick={() => onDelete(item.id)} className="p-2.5 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors cursor-pointer opacity-40 group-hover:opacity-80"><Trash2 size={16} /></button>
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight uppercase italic">{item.platform}</h3>
                    <p className="text-[10px] opacity-50 truncate font-mono uppercase tracking-[0.2em]">{item.url}</p>
                </div>
            </div>
        ))}
        {items.length === 0 && <EmptyState label="No Social Nodes Connected" />}
    </div>
);

const TechTab = ({ items, onEdit, onDelete }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {items.map(item => (
            <div key={item.id} className="aspect-square p-6 rounded-[2rem] border border-white/5 bg-[#0f0f0f] hover:border-primary/20 transition-all group flex flex-col items-center justify-center relative admin-modal-gradient">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2 group-hover:bg-primary/5 transition-all">
                    {item.icon_url ? (
                        <img src={item.icon_url} alt={item.name} className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100" />
                    ) : (
                        <Code2 size={32} className="opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    )}
                </div>
                <span className="text-[9px] uppercase font-black tracking-[0.2em] opacity-30 group-hover:opacity-100 transition-opacity text-center px-2">{item.name}</span>
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => onEdit(item)} className="p-2 bg-black/40 hover:bg-white/5 border border-white/5 rounded-lg transition-colors cursor-pointer"><Edit3 size={12} /></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-black/40 hover:bg-red-500/10 border border-white/5 text-red-500/50 hover:text-red-500 rounded-lg transition-colors cursor-pointer"><Trash2 size={12} /></button>
                </div>
            </div>
        ))}
        {items.length === 0 && <div className="col-span-full"><EmptyState label="Tech Stack Depleted" /></div>}
    </div>
);

const EducationTab = ({ items, onEdit, onDelete }) => (
    <div className="space-y-6">
        {items.map(item => (
            <div key={item.id} className="p-8 rounded-[2.5rem] border border-white/5 bg-[#0f0f0f] hover:border-primary/20 transition-all group flex items-center justify-between admin-modal-gradient">
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex flex-col items-center justify-center border border-white/5 font-mono shadow-inner group-hover:bg-primary/5 transition-all">
                        <span className="text-[10px] font-bold opacity-20">{item.start_year}</span>
                        <div className="h-px w-4 bg-white/10 my-1 group-hover:bg-primary/20" />
                        <span className="text-[10px] font-black group-hover:text-primary">{item.end_year || 'NOW'}</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight uppercase italic group-hover:text-primary transition-colors">{item.institution}</h3>
                        <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-mono">{item.degree}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => onEdit(item)} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all active:scale-95"><Edit3 size={14} /> Edit</button>
                    <button onClick={() => onDelete(item.id)} className="p-3 text-red-500/30 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors cursor-pointer"><Trash2 size={20} /></button>
                </div>
            </div>
        ))}
        {items.length === 0 && <EmptyState label="Career History Empty" />}
    </div>
);

const TracksTab = ({ items, onEdit, onDelete }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
            <div key={item.id} className="p-6 rounded-[2rem] border border-white/5 bg-[#0f0f0f] flex gap-6 hover:border-primary/20 transition-all group admin-modal-gradient">
                <div className="w-24 h-24 rounded-2xl bg-black/40 overflow-hidden shrink-0 border border-white/5 shadow-2xl relative">
                    {item.cover_url ? <img src={item.cover_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <Music size={32} className="m-auto mt-8 opacity-10" />}
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
        {items.length === 0 && <div className="col-span-full"><EmptyState label="Musical Repository Depleted" /></div>}
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
        switch (tab) {
            case 'socials': return [
                { name: 'platform', label: 'Platform Platform', type: 'text', placeholder: 'e.g. GitHub, LinkedIn' },
                { name: 'url', label: 'Access Endpoint (URL)', type: 'text', placeholder: 'https://...' },
                { name: 'icon', label: 'System Icon Tag', type: 'text', placeholder: 'github, linkedin, twitter, globe' }
            ];
            case 'tech': return [
                { name: 'name', label: 'Node Spec (Name)', type: 'text', placeholder: 'e.g. React, Node.js' },
                { name: 'type', label: 'Classification (core/tool/learning)', type: 'text', placeholder: 'core' },
                { name: 'iconName', label: 'Icon Registry Identifier', type: 'text', placeholder: 'ReactLogo' },
                { name: 'proficiency', label: 'Optimization Level (0-100)', type: 'number' }
            ];
            case 'education': return [
                { name: 'institution', label: 'Environment (Institution)', type: 'text' },
                { name: 'degree', label: 'Designation (Degree / Role)', type: 'text' },
                { name: 'start_year', label: 'Initialization Year (Start)', type: 'text' },
                { name: 'end_year', label: 'Termination Year (End)', type: 'text', placeholder: 'Empty for Active' },
                { name: 'description', label: 'System Objective (Summary)', type: 'textarea' }
            ];
            case 'tracks': return [
                { name: 'title', label: 'Stream Title', type: 'text' },
                { name: 'artist', label: 'Creator (Artist)', type: 'text' },
                { name: 'cover_url', label: 'Thumbnail Endpoint (URL)', type: 'text' },
                { name: 'audio_url', label: 'Data Stream (File URL)', type: 'text' },
                { name: 'duration', label: 'Temporal Length (m:ss)', type: 'text' }
            ];
            default: return [];
        }
    };

    const handleInternalSave = () => {
        const table = tab === 'socials' ? 'contacts' :
            tab === 'tech' ? 'tech_stacks' :
                tab === 'education' ? 'education' : 'tracks';
        onSave(table, formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#0f0f0f] rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(var(--theme-rgb),0.2)] overflow-hidden animate-in zoom-in-95 duration-300 admin-modal-gradient">
                <div className="p-10 space-y-8">
                    <header className="flex justify-between items-center border-b border-white/5 pb-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-primary">
                                {item ? 'Reconfigure' : 'Initialize'} Node
                            </h2>
                            <p className="text-[9px] uppercase tracking-widest opacity-30 font-mono">Configuration Sequence: {tab}</p>
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

export default DashboardManager;
