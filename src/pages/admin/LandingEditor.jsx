import React, { useState, useRef } from 'react';
import { fetchLandingData, saveLandingData } from '../../shared/landingService';
import landingDataDefault from '../../data/landingData.json';
import { normalizeLandingData } from '../../lib/mergeLandingData';

const STORAGE_KEY = 'landingData';

const AVAILABLE_LINKS = [
    { value: '/projects', label: 'Projects Page' },
    { value: '/about', label: 'About Page' },
    { value: '/contact', label: 'Contact Page' },
];

const getStoredData = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return normalizeLandingData(landingDataDefault);
        return normalizeLandingData(JSON.parse(stored));
    } catch {
        return normalizeLandingData(landingDataDefault);
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
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [pickerImages, setPickerImages] = useState(null); // null means loading, array means loaded
    const saveTimerRef = useRef(null);

    // Sync from disk on mount
    React.useEffect(() => {
        const syncFromDisk = async () => {
            try {
                const diskData = await fetchLandingData();
                setDraft(() => {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (!stored) return normalizeLandingData(diskData);
                    const parsed = JSON.parse(stored);
                    return normalizeLandingData({
                        ...diskData,
                        ...parsed,
                        hero: { ...diskData.hero, ...(parsed.hero || {}) },
                    });
                });
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
            await saveLandingData(data);
            setSaveStatus('saved');
            localStorage.removeItem(STORAGE_KEY);
            setTimeout(() => setSaveStatus(null), 2000);
        } catch (e) {
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

    const story = draft.story;

    const setStoryHero = (patch) => updateDraft(prev => ({
        ...prev,
        story: { ...prev.story, hero: { ...prev.story.hero, ...patch } },
    }));
    const setStoryOrigin = (patch) => updateDraft(prev => ({
        ...prev,
        story: { ...prev.story, origin: { ...prev.story.origin, ...patch } },
    }));
    const setOriginParagraph = (i, text) => updateDraft(prev => {
        const paragraphs = [...prev.story.origin.paragraphs];
        paragraphs[i] = text;
        return { ...prev, story: { ...prev.story, origin: { ...prev.story.origin, paragraphs } } };
    });
    const setStoryArsenal = (patch) => updateDraft(prev => ({
        ...prev,
        story: { ...prev.story, arsenal: { ...prev.story.arsenal, ...patch } },
    }));
    const setStrength = (i, patch) => updateDraft(prev => {
        const strengths = [...prev.story.arsenal.strengths];
        strengths[i] = { ...strengths[i], ...patch };
        return {
            ...prev,
            story: {
                ...prev.story,
                arsenal: { ...prev.story.arsenal, strengths },
            },
        };
    });
    const setMarqueeItem = (i, val) => updateDraft(prev => {
        const marqueeItems = [...prev.story.arsenal.marqueeItems];
        marqueeItems[i] = val;
        return {
            ...prev,
            story: {
                ...prev.story,
                arsenal: { ...prev.story.arsenal, marqueeItems },
            },
        };
    });
    const addMarqueeTech = () => updateDraft(prev => ({
        ...prev,
        story: {
            ...prev.story,
            arsenal: {
                ...prev.story.arsenal,
                marqueeItems: [...prev.story.arsenal.marqueeItems, 'New'],
            },
        },
    }));
    const removeMarqueeTech = (i) => updateDraft(prev => ({
        ...prev,
        story: {
            ...prev.story,
            arsenal: {
                ...prev.story.arsenal,
                marqueeItems: prev.story.arsenal.marqueeItems.filter((_, idx) => idx !== i),
            },
        },
    }));
    const setStoryWork = (patch) => updateDraft(prev => ({
        ...prev,
        story: { ...prev.story, work: { ...prev.story.work, ...patch } },
    }));
    const setFeaturedProject = (i, patch) => updateDraft(prev => {
        const projects = [...prev.story.work.projects];
        projects[i] = { ...projects[i], ...patch };
        return {
            ...prev,
            story: {
                ...prev.story,
                work: { ...prev.story.work, projects },
            },
        };
    });
    const setStoryHuman = (patch) => updateDraft(prev => ({
        ...prev,
        story: { ...prev.story, human: { ...prev.story.human, ...patch } },
    }));
    const setHumanFact = (i, text) => updateDraft(prev => {
        const facts = [...prev.story.human.facts];
        facts[i] = text;
        return { ...prev, story: { ...prev.story, human: { ...prev.story.human, facts } } };
    });
    const setStoryConnect = (patch) => updateDraft(prev => ({
        ...prev,
        story: { ...prev.story, connect: { ...prev.story.connect, ...patch } },
    }));

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

                <div className="lg:col-span-12 space-y-6">
                    <div className="bg-[#121a16] border border-[#3d5a80]/35 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#98c1d9] uppercase tracking-[0.2em] mb-6">Scrollytelling homepage (/)</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Field label="Hero — Full name">
                                <input type="text" value={story.hero.fullName} onChange={e => setStoryHero({ fullName: e.target.value })} className={inputCls} />
                            </Field>
                            <Field label="Hero — Role">
                                <input type="text" value={story.hero.role} onChange={e => setStoryHero({ role: e.target.value })} className={inputCls} />
                            </Field>
                            <Field label="Hero — Tagline">
                                <textarea value={story.hero.tagline} onChange={e => setStoryHero({ tagline: e.target.value })} rows={2} className={inputCls + ' resize-none'} />
                            </Field>
                            <Field label="Hero — Scroll hint">
                                <input type="text" value={story.hero.scrollHint} onChange={e => setStoryHero({ scrollHint: e.target.value })} className={inputCls} />
                            </Field>
                        </div>

                        <div className="border-t border-white/10 pt-6 mb-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Chapter — Origin</h3>
                            <Field label="Headline">
                                <input type="text" value={story.origin.headline} onChange={e => setStoryOrigin({ headline: e.target.value })} className={inputCls} />
                            </Field>
                            {story.origin.paragraphs.map((para, i) => (
                                <Field key={i} label={`Paragraph ${i + 1}`}>
                                    <textarea value={para} onChange={e => setOriginParagraph(i, e.target.value)} rows={3} className={inputCls + ' resize-none'} />
                                </Field>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-6 mb-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Chapter — Arsenal</h3>
                            <Field label="Headline">
                                <input type="text" value={story.arsenal.headline} onChange={e => setStoryArsenal({ headline: e.target.value })} className={inputCls} />
                            </Field>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {story.arsenal.marqueeItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs">
                                        <input value={item} onChange={e => setMarqueeItem(i, e.target.value)} className="bg-transparent outline-none text-white w-28" />
                                        <button type="button" onClick={() => removeMarqueeTech(i)} className="text-red-400">×</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addMarqueeTech} className="px-2 py-1 text-[10px] bg-[#3d5a80]/40 rounded border border-white/10">+ Item</button>
                            </div>
                            {story.arsenal.strengths.map((s, i) => (
                                <div key={i} className="grid grid-cols-12 gap-2 mb-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="col-span-2">
                                        <label className="text-[9px] text-gray-600 block mb-1">Symbol</label>
                                        <input value={s.symbol} onChange={e => setStrength(i, { symbol: e.target.value })} className={inputCls} />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="text-[9px] text-gray-600 block mb-1">Title</label>
                                        <input value={s.title} onChange={e => setStrength(i, { title: e.target.value })} className={inputCls} />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[9px] text-gray-600 block mb-1">Description</label>
                                        <input value={s.description} onChange={e => setStrength(i, { description: e.target.value })} className={inputCls} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-6 mb-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Chapter — Work</h3>
                            <Field label="Section headline">
                                <input type="text" value={story.work.headline} onChange={e => setStoryWork({ headline: e.target.value })} className={inputCls} />
                            </Field>
                            {[0, 1].map((idx) => (
                                <div key={idx} className="mt-4 p-4 rounded-xl border border-white/10 bg-black/20">
                                    <p className="text-[10px] font-bold text-[#98c1d9] uppercase mb-3">Featured project {idx + 1}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Field label="Title">
                                            <input type="text" value={story.work.projects[idx].title} onChange={e => setFeaturedProject(idx, { title: e.target.value })} className={inputCls} />
                                        </Field>
                                        <Field label="Link (path or URL)">
                                            <input type="text" value={story.work.projects[idx].href} onChange={e => setFeaturedProject(idx, { href: e.target.value })} className={inputCls} />
                                        </Field>
                                        <Field label="Description">
                                            <textarea value={story.work.projects[idx].description} onChange={e => setFeaturedProject(idx, { description: e.target.value })} rows={2} className={inputCls + ' resize-none md:col-span-2'} />
                                        </Field>
                                        <Field label="Tags (comma-separated)">
                                            <input
                                                type="text"
                                                value={story.work.projects[idx].tags.join(', ')}
                                                onChange={e => setFeaturedProject(idx, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                                className={inputCls + ' md:col-span-2'}
                                            />
                                        </Field>
                                        <Field label="Gradient">
                                            <select value={story.work.projects[idx].gradient} onChange={e => setFeaturedProject(idx, { gradient: e.target.value })} className={inputCls}>
                                                <option value="alpha">Alpha (slate → sky)</option>
                                                <option value="beta">Beta (beige)</option>
                                            </select>
                                        </Field>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-6 mb-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Chapter — Human</h3>
                            <Field label="Quote">
                                <textarea value={story.human.quote} onChange={e => setStoryHuman({ quote: e.target.value })} rows={3} className={inputCls + ' resize-none'} />
                            </Field>
                            {story.human.facts.map((fact, i) => (
                                <Field key={i} label={`Fact ${i + 1}`}>
                                    <input type="text" value={fact} onChange={e => setHumanFact(i, e.target.value)} className={inputCls} />
                                </Field>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Chapter — Connect</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Headline">
                                    <input type="text" value={story.connect.headline} onChange={e => setStoryConnect({ headline: e.target.value })} className={inputCls} />
                                </Field>
                                <Field label="Email">
                                    <input type="text" value={story.connect.email} onChange={e => setStoryConnect({ email: e.target.value })} className={inputCls} />
                                </Field>
                                <Field label="Subtext">
                                    <textarea value={story.connect.subtext} onChange={e => setStoryConnect({ subtext: e.target.value })} rows={2} className={inputCls + ' resize-none md:col-span-2'} />
                                </Field>
                                <Field label="GitHub URL">
                                    <input type="text" value={story.connect.githubUrl} onChange={e => setStoryConnect({ githubUrl: e.target.value })} className={inputCls} />
                                </Field>
                                <Field label="LinkedIn URL">
                                    <input type="text" value={story.connect.linkedinUrl} onChange={e => setStoryConnect({ linkedinUrl: e.target.value })} className={inputCls} />
                                </Field>
                                <Field label="Portfolio URL">
                                    <input type="text" value={story.connect.portfolioUrl} onChange={e => setStoryConnect({ portfolioUrl: e.target.value })} className={inputCls} />
                                </Field>
                                <Field label="Portfolio link label">
                                    <input type="text" value={story.connect.portfolioLinkLabel} onChange={e => setStoryConnect({ portfolioLinkLabel: e.target.value })} className={inputCls} />
                                </Field>
                                <Field label="Footer line">
                                    <input type="text" value={story.connect.footerCopyright} onChange={e => setStoryConnect({ footerCopyright: e.target.value })} className={inputCls + ' md:col-span-2'} />
                                </Field>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Left Col: Hero Section */}
                <div className="lg:col-span-7 space-y-6">
                    {/* More Projects Image Gallery */}
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                            More Projects Gallery
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={async () => {
                                        setShowImagePicker(true);
                                        setPickerImages(null);
                                        try {
                                            const res = await fetch('/__list-uploads');
                                            const data = await res.json();
                                            if (data.ok) setPickerImages(data.images || []);
                                            else setPickerImages([]);
                                        } catch (e) {
                                            setPickerImages([]);
                                        }
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white/5 text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors"
                                >
                                    Browse Library
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setSaveStatus('saving');
                                            try {
                                                const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=landing&type=moreProjects`, {
                                                    method: 'POST', body: file
                                                });
                                                const data = await res.json();
                                                if (data.ok) {
                                                    updateDraft(prev => ({
                                                        ...prev,
                                                        moreProjectsImages: [...(prev.moreProjectsImages || []), data.url]
                                                    }));
                                                    setSaveStatus('saved');
                                                    setTimeout(() => setSaveStatus(null), 2000);
                                                }
                                            } catch(err) {
                                                setSaveStatus('error');
                                            }
                                        };
                                        input.click();
                                    }}
                                    className="px-3 py-1.5 text-xs bg-[#c8ff3e]/10 text-[#c8ff3e] font-bold rounded-lg hover:bg-[#c8ff3e] hover:text-black transition-colors"
                                >
                                    Upload New
                                </button>
                            </div>
                        </h2>
                        
                        {(draft.moreProjectsImages || []).length === 0 ? (
                            <div className="p-8 text-center rounded-xl border border-dashed border-white/10 text-white/30 text-sm">
                                No preview images added yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {draft.moreProjectsImages.map((src, i) => (
                                    <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await fetch(`/__delete-upload?path=${encodeURIComponent(src)}`, { method: 'DELETE' });
                                                } catch(e) {}
                                                updateDraft(prev => ({
                                                    ...prev,
                                                    moreProjectsImages: prev.moreProjectsImages.filter((_, idx) => idx !== i)
                                                }));
                                            }}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            ×
                                        </button>
                                        <span className="absolute bottom-2 left-2 text-[9px] font-bold bg-black/60 px-2 py-0.5 rounded text-white/70">
                                            #{i + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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

            {/* Image Picker Modal */}
            {showImagePicker && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Image Library</h3>
                                <p className="text-xs text-white/50 mt-1">Select an existing image to add to the More Projects gallery.</p>
                            </div>
                            <button 
                                onClick={() => setShowImagePicker(false)}
                                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {!pickerImages ? (
                                <div className="flex items-center justify-center h-48 text-white/40 text-sm font-mono tracking-widest uppercase">
                                    Loading Library...
                                </div>
                            ) : pickerImages.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-white/40 text-sm font-mono tracking-widest uppercase">
                                    No images found in uploads folder.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {pickerImages.map((src, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => {
                                                updateDraft(prev => ({
                                                    ...prev,
                                                    moreProjectsImages: [...(prev.moreProjectsImages || []), src]
                                                }));
                                                setShowImagePicker(false);
                                            }}
                                            className="group relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/40 text-left hover:border-[#c8ff3e]/50 focus:outline-none focus:ring-2 focus:ring-[#c8ff3e] transition-all"
                                        >
                                            <img src={src} alt="Library Item" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="absolute top-2 right-2 text-[9px] bg-[#c8ff3e] text-black font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                                SELECT
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingEditor;
