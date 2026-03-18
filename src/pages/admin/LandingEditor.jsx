import React, { useState } from 'react';
import landingDataDefault from '../../data/landingData.json';

const STORAGE_KEY = 'landingData';

const AVAILABLE_LINKS = [
    { value: '/projects', label: 'Projects Page' },
    { value: '/about', label: 'About Page' },
    { value: '/contact', label: 'Contact Page' },
    { value: '/lab', label: 'Lab Page' },
];

const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return landingDataDefault;
    
    const parsed = JSON.parse(stored);
    return {
        hero: { ...landingDataDefault.hero, ...parsed.hero },
        tags: parsed.tags || landingDataDefault.tags || [],
        metrics: parsed.metrics || landingDataDefault.metrics || []
    };
};

const inputCls = 'w-full px-3 py-1.5 text-sm bg-[#111] border border-white/10 rounded-lg focus:border-[#c8ff3e] outline-none transition-all cursor-not-allowed opacity-70';

const Field = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
);

const LandingEditor = () => {
    const [draft, setDraft] = useState(getStoredData);
    const [loading, setLoading] = useState(true);

    // UPDATED: Sync from disk on mount
    React.useEffect(() => {
        const syncFromDisk = async () => {
            try {
                const res = await fetch('/src/data/landingData.json');
                if (res.ok) {
                    const diskData = await res.json();
                    
                    // Merging logic: prefer disk structure, but keep any local storage overrides
                    setDraft(prev => {
                        const stored = localStorage.getItem(STORAGE_KEY);
                        if (!stored) return diskData;
                        const parsed = JSON.parse(stored);
                        return {
                            hero: { ...diskData.hero, ...parsed.hero },
                            tags: parsed.tags || diskData.tags || [],
                            metrics: parsed.metrics || diskData.metrics || []
                        };
                    });
                }
            } catch (e) {
                console.error("Failed to fetch live landingData.json", e);
            } finally {
                setLoading(false);
            }
        };
        syncFromDisk();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">Loading Landing Data...</div>;

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight">Main Page Editor</h1>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-red-500/50 text-red-500 bg-red-500/10 font-bold tracking-wider">
                        LOCKED (READ-ONLY)
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        No Edits Allowed
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 opacity-80 pointer-events-none grayscale-[0.3]">
                
                {/* Left Col: Hero Section */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e]/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             Hero Configuration
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <div className="md:col-span-2">
                                <Field label="Kicker (Main Role)">
                                    <input type="text" value={draft.hero.kicker} className={inputCls} disabled />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Display Kicker (Subheading)">
                                    <input type="text" value={draft.hero.displayKicker} className={inputCls} disabled />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Bio / Hero Description">
                                    <textarea value={draft.hero.bio} rows={3} className={inputCls + ' resize-none'} disabled />
                                </Field>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Action Buttons</h3>
                            {draft.hero.buttons.map((btn, i) => (
                                <div key={i} className="flex flex-wrap sm:flex-nowrap gap-3 mb-4 last:mb-0 bg-white/5 p-3 rounded-xl border border-white/5 opacity-70">
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="text-[9px] text-gray-600 block mb-1">Label</label>
                                        <input type="text" value={btn.label} className={inputCls} disabled />
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="text-[9px] text-gray-600 block mb-1">Route / Link</label>
                                        <select value={btn.link} className={inputCls} disabled>
                                            {AVAILABLE_LINKS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-full sm:w-auto self-end">
                                        <label className="text-[9px] text-gray-600 block mb-1">Primary</label>
                                        <button disabled className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${btn.variant === 'primary' ? 'bg-[#c8ff3e]/40 text-black border-transparent' : 'border-white/10 text-gray-700'}`}>
                                            {btn.variant === 'primary' ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 overflow-hidden">
                        <h2 className="text-xs font-bold text-[#c8ff3e]/40 uppercase tracking-[0.2em] mb-6">Marquee Words</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {draft.hero.marquee.map((w, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-500">
                                    <span>{w}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Tags & Metrics */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e]/40 uppercase tracking-[0.2em] mb-6">Skill Tags</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {draft.tags.map((t, i) => (
                                <div key={i} className="flex items-center gap-2 px-2 py-1 bg-[#c8ff3e]/5 border border-[#c8ff3e]/10 rounded text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e]/40 uppercase tracking-[0.2em] mb-6">Experience Metrics</h2>
                        {draft.metrics.map((m, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 mb-4 last:mb-0 p-3 bg-white/5 rounded-xl border border-white/5 opacity-70">
                                <div className="col-span-4">
                                    <label className="text-[9px] text-gray-600 block mb-1">Value</label>
                                    <input type="text" value={m.value} className={inputCls} disabled />
                                </div>
                                <div className="col-span-3">
                                    <label className="text-[9px] text-gray-600 block mb-1">Unit</label>
                                    <input type="text" value={m.unit} className={inputCls} disabled />
                                </div>
                                <div className="col-span-5">
                                    <label className="text-[9px] text-gray-600 block mb-1">Label</label>
                                    <input type="text" value={m.label} className={inputCls} disabled />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Locked Info Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-8 py-3 bg-red-600 text-white rounded-full shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                <span className="text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LOCKED (Read-Only)
                </span>
                <div className="w-px h-4 bg-white/20" />
                <span className="text-[11px] font-medium opacity-80 max-w-[200px] leading-tight text-center">
                    To edit, you must re-authorize landingData.json in vite.config.js
                </span>
            </div>
        </div>
    );
};

export default LandingEditor;
