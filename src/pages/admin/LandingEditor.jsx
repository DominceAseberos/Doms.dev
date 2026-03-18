import React, { useState, useRef } from 'react';
import landingDataDefault from '../../data/landingData.json';

const STORAGE_KEY = 'landingData';

const AVAILABLE_LINKS = [
    { value: '/projects', label: 'Projects Page' },
    { value: '/about', label: 'About Page' },
    { value: '/contact', label: 'Contact Page' },
    { value: '/lab', label: 'Lab Page' },
];

const getStoredData = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return landingDataDefault;
        const parsed = JSON.parse(stored);
        return {
            hero: { ...landingDataDefault.hero, ...parsed.hero },
            tags: parsed.tags || landingDataDefault.tags || [],
            metrics: parsed.metrics || landingDataDefault.metrics || []
        };
    } catch {
        return landingDataDefault;
    }
};

const inputCls = 'w-full px-3 py-1.5 text-sm bg-[#111] border border-white/10 rounded-lg focus:border-[#c8ff3e] outline-none transition-all text-white placeholder-gray-700';

const Field = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
);

const LandingEditor = () => {
    const [draft, setDraft] = useState(getStoredData);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
    const saveTimerRef = useRef(null);

    // Sync from disk on mount
    React.useEffect(() => {
        const syncFromDisk = async () => {
            try {
                const res = await fetch('/src/data/landingData.json');
                if (res.ok) {
                    const diskData = await res.json();
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

    // Auto-save to disk (debounced 800ms)
    const saveToDisk = async (data) => {
        try {
            setSaveStatus('saving');
            const res = await fetch('/__write-json?file=landingData.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setSaveStatus('saved');
                localStorage.removeItem(STORAGE_KEY);
                setTimeout(() => setSaveStatus(null), 2000);
            } else {
                setSaveStatus('error');
            }
        } catch (e) {
            console.error(e);
            setSaveStatus('error');
        }
    };

    const updateDraft = (updater) => {
        setDraft(prev => {
            const next = updater(prev);
            // Sync to localStorage immediately
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            // Debounced auto-save to disk
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(() => saveToDisk(next), 800);
            return next;
        });
    };

    const setHero = (patch) => updateDraft(prev => ({ ...prev, hero: { ...prev.hero, ...patch } }));
    const setButtonProp = (i, key, val) => updateDraft(prev => {
        const buttons = [...prev.hero.buttons];
        buttons[i] = { ...buttons[i], [key]: val };
        return { ...prev, hero: { ...prev.hero, buttons } };
    });
    const addMarqueeWord = (word) => updateDraft(prev => ({ ...prev, hero: { ...prev.hero, marquee: [...prev.hero.marquee, word] } }));
    const removeMarqueeWord = (i) => updateDraft(prev => ({ ...prev, hero: { ...prev.hero, marquee: prev.hero.marquee.filter((_, idx) => idx !== i) } }));
    const addTag = (tag) => updateDraft(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    const removeTag = (i) => updateDraft(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }));
    const setMetricProp = (i, key, val) => updateDraft(prev => {
        const metrics = [...prev.metrics];
        metrics[i] = { ...metrics[i], [key]: val };
        return { ...prev, metrics };
    });

    if (loading) return <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">Loading Landing Data...</div>;

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight">Main Page Editor</h1>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-green-500/50 text-green-400 bg-green-500/10 font-bold tracking-wider">
                        LIVE EDIT
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {saveStatus && (
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                            saveStatus === 'saving' ? 'bg-white/10 text-white/60' :
                            saveStatus === 'saved'  ? 'bg-green-500/20 text-green-400' :
                                                      'bg-red-500/20 text-red-400'
                        }`}>
                            {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? '✓ Saved to disk' : '✗ Save Error'}
                        </span>
                    )}
                    <button
                        onClick={() => saveToDisk(draft)}
                        className="px-4 py-2 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-widest"
                    >
                        Save Now
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Col: Hero Section */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             Hero Configuration
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <div className="md:col-span-2">
                                <Field label="Kicker (Main Role)">
                                    <input type="text" value={draft.hero.kicker} onChange={e => setHero({ kicker: e.target.value })} className={inputCls} />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Display Kicker (Subheading)">
                                    <input type="text" value={draft.hero.displayKicker} onChange={e => setHero({ displayKicker: e.target.value })} className={inputCls} />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field label="Bio / Hero Description">
                                    <textarea value={draft.hero.bio} onChange={e => setHero({ bio: e.target.value })} rows={3} className={inputCls + ' resize-none'} />
                                </Field>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Action Buttons</h3>
                            {draft.hero.buttons.map((btn, i) => (
                                <div key={i} className="flex flex-wrap sm:flex-nowrap gap-3 mb-4 last:mb-0 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="text-[9px] text-gray-600 block mb-1">Label</label>
                                        <input type="text" value={btn.label} onChange={e => setButtonProp(i, 'label', e.target.value)} className={inputCls} />
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="text-[9px] text-gray-600 block mb-1">Route / Link</label>
                                        <select value={btn.link} onChange={e => setButtonProp(i, 'link', e.target.value)} className={inputCls}>
                                            {AVAILABLE_LINKS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-full sm:w-auto self-end">
                                        <label className="text-[9px] text-gray-600 block mb-1">Primary</label>
                                        <button
                                            onClick={() => setButtonProp(i, 'variant', btn.variant === 'primary' ? 'ghost' : 'primary')}
                                            className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${btn.variant === 'primary' ? 'bg-[#c8ff3e] text-black border-transparent' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                                        >
                                            {btn.variant === 'primary' ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Marquee Words */}
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 overflow-hidden">
                        <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] mb-6">Marquee Words</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {draft.hero.marquee.map((w, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 group">
                                    <span>{w}</span>
                                    <button onClick={() => removeMarqueeWord(i)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">×</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input id="marquee-add" type="text" placeholder="Add word..." className={inputCls} onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) { addMarqueeWord(e.target.value.trim()); e.target.value = ''; } }} />
                            <button onClick={() => { const el = document.getElementById('marquee-add'); if (el?.value.trim()) { addMarqueeWord(el.value.trim()); el.value = ''; } }} className="shrink-0 px-3 py-1.5 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors">Add</button>
                        </div>
                    </div>
                </div>

                {/* Right Col: Tags & Metrics */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Skill Tags */}
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] mb-6">Skill Tags</h2>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {draft.tags.map((t, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-[#c8ff3e]/10 border border-[#c8ff3e]/20 rounded text-[10px] text-[#c8ff3e] font-bold uppercase tracking-wider group">
                                    {t}
                                    <button onClick={() => removeTag(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400">×</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input id="tag-add" type="text" placeholder="Add tag..." className={inputCls} onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) { addTag(e.target.value.trim()); e.target.value = ''; } }} />
                            <button onClick={() => { const el = document.getElementById('tag-add'); if (el?.value.trim()) { addTag(el.value.trim()); el.value = ''; } }} className="shrink-0 px-3 py-1.5 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors">Add</button>
                        </div>
                    </div>

                    {/* Experience Metrics */}
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] mb-6">Experience Metrics</h2>
                        {draft.metrics.map((m, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 mb-4 last:mb-0 p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="col-span-4">
                                    <label className="text-[9px] text-gray-600 block mb-1">Value</label>
                                    <input type="text" value={m.value} onChange={e => setMetricProp(i, 'value', e.target.value)} className={inputCls} />
                                </div>
                                <div className="col-span-3">
                                    <label className="text-[9px] text-gray-600 block mb-1">Unit</label>
                                    <input type="text" value={m.unit} onChange={e => setMetricProp(i, 'unit', e.target.value)} className={inputCls} />
                                </div>
                                <div className="col-span-5">
                                    <label className="text-[9px] text-gray-600 block mb-1">Label</label>
                                    <input type="text" value={m.label} onChange={e => setMetricProp(i, 'label', e.target.value)} className={inputCls} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingEditor;
