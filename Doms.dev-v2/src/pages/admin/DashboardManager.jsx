import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import {
    ArrowLeft, LayoutGrid, Contact, GraduationCap, Music,
    Plus, Trash2, Edit3, Save, X, RefreshCw, ExternalLink,
    Code2, Globe, Github, Linkedin, Twitter, MessageSquare
} from 'lucide-react';

const DashboardManager = () => {
    const [activeTab, setActiveTab] = useState('socials');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({ socials: [], tech: [], education: [], tracks: [] });
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const handleSave = async (table, payload) => {
        setSaving(true);
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
            setSaving(false);
        }
    };

    const handleDelete = async (table, id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await dashboardService.delete(table, id);
            await fetchAllData();
        } catch (err) {
            alert('Delete failed: ' + err.message);
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
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans selection:bg-white/20" ref={containerRef}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity group cursor-pointer"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            System Hub
                        </button>
                        <header className="space-y-1">
                            <h1 className="text-5xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                                DASHBOARD <span className="opacity-20 text-white italic font-light">MANAGER</span>
                            </h1>
                            <p className="text-xs uppercase tracking-[0.3em] opacity-40 font-mono">Bento Ecosystem Control / V2.0</p>
                        </header>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Add New Entry
                    </button>
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
                                ? 'bg-white/10 border-white/20 text-white shadow-lg'
                                : 'bg-transparent border-white/5 text-white/30 hover:text-white/60 hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-40">
                            <RefreshCw className="animate-spin opacity-20" size={48} />
                        </div>
                    ) : renderTabContent()}
                </div>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <Modal
                    tab={activeTab}
                    item={editingItem}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    isSaving={saving}
                />
            )}
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const SocialsTab = ({ items, onEdit, onDelete }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map(item => (
            <div key={item.id} className="p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 transition-all group flex flex-col justify-between h-48">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Globe size={20} className="opacity-50" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(item)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={14} /></button>
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">{item.platform}</h3>
                    <p className="text-[10px] opacity-40 truncate font-mono">{item.url}</p>
                </div>
            </div>
        ))}
    </div>
);

const TechTab = ({ items, onEdit, onDelete }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map(item => (
            <div key={item.id} className="aspect-square p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 transition-all group flex flex-col items-center justify-center relative">
                {item.icon_url ? (
                    <img src={item.icon_url} alt={item.name} className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all brightness-200 group-hover:brightness-100" />
                ) : (
                    <Code2 size={32} className="opacity-20" />
                )}
                <span className="text-[9px] uppercase font-black tracking-widest mt-4 opacity-40 group-hover:opacity-100 transition-opacity">{item.name}</span>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacityScale">
                    <button onClick={() => onEdit(item)} className="p-1.5 bg-black/40 hover:bg-white/10 rounded-lg transition-colors"><Edit3 size={10} /></button>
                    <button onClick={() => onDelete(item.id)} className="p-1.5 bg-black/40 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 size={10} /></button>
                </div>
            </div>
        ))}
    </div>
);

const EducationTab = ({ items, onEdit, onDelete }) => (
    <div className="space-y-4">
        {items.map(item => (
            <div key={item.id} className="p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/5 font-mono">
                        <span className="text-[10px] font-bold opacity-30">{item.start_year}</span>
                        <span className="text-[10px] font-bold">{item.end_year || 'NOW'}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{item.institution}</h3>
                        <p className="text-[10px] opacity-40 uppercase tracking-widest font-mono">{item.degree}</p>
                    </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => onEdit(item)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Edit3 size={14} /> Edit</button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                </div>
            </div>
        ))}
    </div>
);

const TracksTab = ({ items, onEdit, onDelete }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
            <div key={item.id} className="p-4 rounded-3xl border border-white/5 bg-white/5 flex gap-4 hover:border-white/10 transition-all group">
                <div className="w-20 h-20 rounded-2xl bg-black/40 overflow-hidden shrink-0 border border-white/5">
                    {item.cover_url ? <img src={item.cover_url} className="w-full h-full object-cover" /> : <Music size={24} className="m-auto mt-7 opacity-10" />}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold truncate">{item.title}</h3>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest truncate">{item.artist}</p>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-2 hover:bg-white/10 rounded-xl"><Edit3 size={14} /></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-xl"><Trash2 size={14} /></button>
                </div>
            </div>
        ))}
    </div>
);

const Modal = ({ tab, item, onClose, onSave, isSaving }) => {
    const [formData, setFormData] = useState(item || {});

    const getFields = () => {
        switch (tab) {
            case 'socials': return [
                { name: 'platform', label: 'Platform', type: 'text', placeholder: 'e.g. GitHub, LinkedIn' },
                { name: 'url', label: 'URL', type: 'text', placeholder: 'https://...' },
                { name: 'icon', label: 'Icon Tag (Optional)', type: 'text', placeholder: 'github, twitter' }
            ];
            case 'tech': return [
                { name: 'name', label: 'Stack Name', type: 'text', placeholder: 'e.g. React, Node.js' },
                { name: 'category', label: 'Category', type: 'text', placeholder: 'Frontend, Backend' },
                { name: 'icon_url', label: 'Icon URL / SVG', type: 'text' },
                { name: 'proficiency', label: 'Proficiency (0-100)', type: 'number' }
            ];
            case 'education': return [
                { name: 'institution', label: 'Institution', type: 'text' },
                { name: 'degree', label: 'Degree / Role', type: 'text' },
                { name: 'start_year', label: 'Start Year', type: 'text' },
                { name: 'end_year', label: 'End Year (Empty for Present)', type: 'text' },
                { name: 'description', label: 'Summary', type: 'textarea' }
            ];
            case 'tracks': return [
                { name: 'title', label: 'Song Title', type: 'text' },
                { name: 'artist', label: 'Artist', type: 'text' },
                { name: 'cover_url', label: 'Cover Image URL', type: 'text' },
                { name: 'audio_url', label: 'Audio File URL', type: 'text' },
                { name: 'duration', label: 'Duration (m:ss)', type: 'text' }
            ];
            default: return [];
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black tracking-tight uppercase italic opacity-80">
                            {item ? 'Configure Node' : 'Initialize Node'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full opacity-40 hover:opacity-100 transition-all"><X size={20} /></button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {getFields().map(field => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono min-h-[100px]"
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                        placeholder={field.placeholder}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => onSave(
                            tab === 'socials' ? 'contacts' :
                                tab === 'tech' ? 'tech_stacks' :
                                    tab === 'education' ? 'education' : 'tracks',
                            formData
                        )}
                        disabled={isSaving}
                        className="w-full py-5 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? 'Synchronizing...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardManager;
