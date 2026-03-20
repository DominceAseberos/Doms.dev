import React, { useState, useEffect, useRef } from 'react';
import { fetchAboutData, saveAboutData } from '../../shared/aboutService';
import { fetchFeedPosts, saveFeedPosts } from '../../shared/feedService';
import { FiUpload, FiTrash2, FiPlus, FiGlobe, FiFileText, FiInstagram, FiTwitter, FiLinkedin, FiFacebook, FiMessageCircle, FiLink, FiImage, FiSettings } from 'react-icons/fi';

const STORAGE_KEY_ABOUT = 'aboutDataDraft';
const STORAGE_KEY_FEED = 'feedPostsDraft';

const inputCls = 'w-full px-3 py-1.5 text-sm bg-[#111] border border-white/10 rounded-lg focus:border-[#c8ff3e] outline-none transition-all text-white placeholder-gray-700';

const Field = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
);

const AboutEditor = () => {
    const [aboutDraft, setAboutDraft] = useState(null);
    const [feedDraft, setFeedDraft] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
    
    // Feed editing state
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const saveTimerRef = useRef(null);

    // Initial load
    useEffect(() => {
        const loadAll = async () => {
            try {
                const [about, feed] = await Promise.all([fetchAboutData(), fetchFeedPosts()]);
                
                // Sync with local storage if exists
                const storedAbout = localStorage.getItem(STORAGE_KEY_ABOUT);
                const storedFeed = localStorage.getItem(STORAGE_KEY_FEED);
                
                setAboutDraft(storedAbout ? JSON.parse(storedAbout) : about);
                setFeedDraft(storedFeed ? JSON.parse(storedFeed) : feed);
                
                if (feed.length > 0 && !selectedPostId) {
                    setSelectedPostId(feed[0].id);
                }
            } catch (err) {
                console.error("Failed to load editor data", err);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const saveToDisk = async (aboutData, feedData) => {
        setSaveStatus('saving');
        try {
            await Promise.all([
                saveAboutData(aboutData),
                saveFeedPosts(feedData)
            ]);
            setSaveStatus('saved');
            localStorage.removeItem(STORAGE_KEY_ABOUT);
            localStorage.removeItem(STORAGE_KEY_FEED);
            setTimeout(() => setSaveStatus(null), 2000);
        } catch (err) {
            setSaveStatus('error');
        }
    };

    const triggerAutoSave = (newAbout, newFeed) => {
        localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(newAbout));
        localStorage.setItem(STORAGE_KEY_FEED, JSON.stringify(newFeed));

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => saveToDisk(newAbout, newFeed), 800);
    };

    const updateAbout = (updater) => {
        setAboutDraft(prev => {
            const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
            triggerAutoSave(next, feedDraft);
            return next;
        });
    };

    const updateFeed = (updater) => {
        setFeedDraft(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            triggerAutoSave(aboutDraft, next);
            return next;
        });
    };

    // --- Social Handlers ---
    const addSocial = () => {
        updateAbout(prev => ({
            ...prev,
            socials: [...prev.socials, { label: 'New Social', href: '', external: true }]
        }));
    };

    const updateSocial = (idx, patch) => {
        updateAbout(prev => {
            const socials = [...prev.socials];
            socials[idx] = { ...socials[idx], ...patch };
            return { ...prev, socials };
        });
    };

    const removeSocial = (idx) => {
        updateAbout(prev => ({
            ...prev,
            socials: prev.socials.filter((_, i) => i !== idx)
        }));
    };

    // --- Feed Handlers ---
    const addNewPost = () => {
        const newPost = {
            id: `post-${Date.now()}`,
            type: 'text',
            title: 'New Post',
            body: '',
            createdAt: new Date().toISOString().split('T')[0],
            tags: [],
            images: []
        };
        updateFeed([newPost, ...feedDraft]);
        setSelectedPostId(newPost.id);
    };

    const deletePost = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        const post = feedDraft.find(p => p.id === id);
        // Delete images from server if they exist in uploads
        if (post) {
            const mediaToDelete = [];
            if (post.image) mediaToDelete.push(post.image);
            if (Array.isArray(post.images)) mediaToDelete.push(...post.images);

            for (const img of mediaToDelete) {
                if (typeof img === 'string' && img.includes('/assets/uploads/')) {
                    try { 
                        await fetch(`/__delete-upload?path=${encodeURIComponent(img)}`, { method: 'DELETE' }); 
                    } catch(e) {
                        console.error("Failed to delete post image", e);
                    }
                }
            }
        }

        const nextFeed = feedDraft.filter(p => p.id !== id);
        updateFeed(nextFeed);
        if (selectedPostId === id) {
            setSelectedPostId(nextFeed[0]?.id || null);
        }
    };

    const updateSelectedPost = (patch) => {
        updateFeed(prev => prev.map(p => p.id === selectedPostId ? { ...p, ...patch } : p));
    };

    // --- File Utils ---
    const handleFileUpload = async (e, type, target) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Cleanup old file if it's an upload
        if (target === 'resume' || target === 'cv') {
            const oldPath = aboutDraft[target];
            if (oldPath && oldPath.includes('/assets/uploads/')) {
                try { 
                    await fetch(`/__delete-upload?path=${encodeURIComponent(oldPath)}`, { method: 'DELETE' }); 
                } catch(e) {
                    console.error("Failed to delete old asset", e);
                }
            }
        }

        setSaveStatus('saving');
        try {
            const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=about&type=${type}`, {
                method: 'POST',
                body: file
            });
            const data = await res.json();
            if (data.ok) {
                if (target === 'resume' || target === 'cv') {
                    updateAbout({ [target]: data.url });
                } else if (target === 'post-image') {
                    const post = feedDraft.find(p => p.id === selectedPostId);
                    const images = [...(post.images || []), data.url];
                    updateSelectedPost({ images, type: 'image' });
                }
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus(null), 2000);
            }
        } catch (err) {
            setSaveStatus('error');
        }
    };

    const removeFile = async (target, path, idx = null) => {
        if (path.includes('/assets/uploads/')) {
            try { await fetch(`/__delete-upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' }); } catch(e) {}
        }

        if (target === 'resume' || target === 'cv') {
            updateAbout({ [target]: '' });
        } else if (target === 'post-image') {
            const post = feedDraft.find(p => p.id === selectedPostId);
            const images = (post.images || []).filter((_, i) => i !== idx);
            updateSelectedPost({ 
                images, 
                image: images.length === 0 ? '' : post.image, // Clear legacy image if no images left
                type: images.length > 0 ? 'image' : 'text' 
            });
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center font-mono uppercase tracking-[0.2em] animate-pulse">Initializing Data...</div>;

    const selectedPost = feedDraft.find(p => p.id === selectedPostId);
    const filteredPosts = feedDraft.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col font-sans selection:bg-[#c8ff3e] selection:text-black">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight">About Page Editor</h1>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-green-500/50 text-green-400 bg-green-500/10 font-bold tracking-wider">
                        ONE SOURCE OF TRUTH
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
                        onClick={() => saveToDisk(aboutDraft, feedDraft)}
                        className="px-4 py-2 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-widest"
                    >
                        Save Now
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: About Details (3 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Resume & CVSection */}
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             <FiFileText /> Assets & Downloads
                        </h2>
                        
                        <div className="space-y-4">
                            <Field label="Main Resume (PDF)">
                                <div className="flex items-center gap-3">
                                    <input type="text" value={aboutDraft.resume} onChange={e => updateAbout({ resume: e.target.value })} className={inputCls} placeholder="/resume.pdf" />
                                    <div className="flex items-center gap-2">
                                        <label className="shrink-0 w-9 h-9 flex items-center justify-center bg-[#c8ff3e]/10 text-[#c8ff3e] rounded-lg cursor-pointer hover:bg-[#c8ff3e] hover:text-black transition-all">
                                            <FiUpload />
                                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'assets', 'resume')} />
                                        </label>
                                        {aboutDraft.resume && (
                                            <button 
                                                onClick={() => removeFile('resume', aboutDraft.resume)}
                                                className="shrink-0 w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete File"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Field>

                            <Field label="Full CV (PDF)">
                                <div className="flex items-center gap-3">
                                    <input type="text" value={aboutDraft.cv} onChange={e => updateAbout({ cv: e.target.value })} className={inputCls} placeholder="/cv.pdf" />
                                    <div className="flex items-center gap-2">
                                        <label className="shrink-0 w-9 h-9 flex items-center justify-center bg-[#c8ff3e]/10 text-[#c8ff3e] rounded-lg cursor-pointer hover:bg-[#c8ff3e] hover:text-black transition-all">
                                            <FiUpload />
                                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'assets', 'cv')} />
                                        </label>
                                        {aboutDraft.cv && (
                                            <button 
                                                onClick={() => removeFile('cv', aboutDraft.cv)}
                                                className="shrink-0 w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete File"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1.5 italic">
                                    <FiSettings /> Tip: You can paste a direct URL or upload a local file.
                                </p>
                            </Field>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] flex items-center gap-2">
                                <FiGlobe /> Social Links
                            </h2>
                            <button onClick={addSocial} className="w-6 h-6 flex items-center justify-center bg-white/5 text-white/50 hover:bg-[#c8ff3e] hover:text-black rounded-full transition-all">
                                <FiPlus />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {aboutDraft.socials.map((s, i) => (
                                <div key={i} className="group relative bg-black/40 p-3 rounded-xl border border-white/5 space-y-2 hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            value={s.label} 
                                            onChange={e => updateSocial(i, { label: e.target.value })}
                                            className="flex-1 bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-[#c8ff3e] outline-none" 
                                            placeholder="LABEL"
                                        />
                                        <button onClick={() => removeSocial(i)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all">
                                            <FiTrash2 size={12} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-all">
                                        <FiLink className="text-[10px] text-gray-500 shrink-0" />
                                        <input 
                                            value={s.href} 
                                            onChange={e => updateSocial(i, { href: e.target.value })}
                                            className="w-full bg-transparent border-none text-xs text-white outline-none" 
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Feed Section (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-[#161616] border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden">
                        <div className="border-b border-white/5 p-4 flex items-center justify-between bg-black/20">
                            <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-[0.2em] flex items-center gap-2">
                                <FiMessageCircle /> Feed & Updates
                            </h2>
                            <div className="flex items-center gap-4 flex-1 max-w-sm mx-8">
                                <div className="relative w-full">
                                    <input 
                                        type="text" 
                                        placeholder="Search posts..." 
                                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/40 border border-white/5 rounded-lg outline-none focus:border-[#c8ff3e]/30"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <FiGlobe size={12} />
                                    </div>
                                </div>
                            </div>
                            <button onClick={addNewPost} className="flex items-center gap-2 px-3 py-1.5 bg-[#c8ff3e] text-black font-bold text-[10px] rounded-lg hover:bg-white transition-all">
                                <FiPlus /> NEW POST
                            </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-full min-h-[600px]">
                            {/* Feed List (Left col of feed editor) */}
                            <div className="md:col-span-4 border-r border-white/5 overflow-y-auto bg-black/20">
                                {filteredPosts.length === 0 ? (
                                    <div className="p-8 text-center text-white/20 text-xs italic">
                                        No posts found.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {filteredPosts.map(p => (
                                            <button 
                                                key={p.id}
                                                onClick={() => setSelectedPostId(p.id)}
                                                className={`w-full text-left p-4 transition-all hover:bg-white/5 ${selectedPostId === p.id ? 'bg-[#c8ff3e]/10 border-l-2 border-[#c8ff3e]' : 'border-l-2 border-transparent'}`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{p.createdAt}</span>
                                                    {p.type === 'image' && <FiImage size={10} className="text-[#c8ff3e]" />}
                                                </div>
                                                <h4 className={`text-xs font-bold truncate ${selectedPostId === p.id ? 'text-[#c8ff3e]' : 'text-white/80'}`}>{p.title || 'Untitled Post'}</h4>
                                                <p className="text-[10px] text-white/40 line-clamp-2 mt-1">{p.body}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Feed Detail (Right col of feed editor) */}
                            <div className="md:col-span-8 overflow-y-auto p-6 bg-black/40">
                                {selectedPost ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Edit Post</h3>
                                            <button onClick={() => deletePost(selectedPost.id)} className="flex items-center gap-2 px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/10 rounded transition-all">
                                                <FiTrash2 /> DELETE
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Post Title">
                                                <input value={selectedPost.title} onChange={e => updateSelectedPost({ title: e.target.value })} className={inputCls} placeholder="Post Title" />
                                            </Field>
                                            <Field label="Publish Date">
                                                <input type="date" value={selectedPost.createdAt} onChange={e => updateSelectedPost({ createdAt: e.target.value })} className={inputCls} />
                                            </Field>
                                        </div>

                                        <Field label="Body Content">
                                            <textarea 
                                                value={selectedPost.body} 
                                                onChange={e => updateSelectedPost({ body: e.target.value })} 
                                                className={inputCls + ' min-h-[150px] resize-none'} 
                                                placeholder="Write your update here..."
                                            />
                                        </Field>

                                        <Field label="Tags (Comma separated)">
                                            <input 
                                                value={(selectedPost.tags || []).join(', ')} 
                                                onChange={e => updateSelectedPost({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} 
                                                className={inputCls} 
                                                placeholder="UI, Motion, Experiment"
                                            />
                                        </Field>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Post Images</label>
                                                <label className="flex items-center gap-2 px-3 py-1 text-[10px] bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all">
                                                    <FiPlus /> ADD IMAGE
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'imgs', 'post-image')} />
                                                </label>
                                            </div>

                                            {(!selectedPost.images || selectedPost.images.length === 0) ? (
                                                <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center">
                                                    <p className="text-xs text-white/20 italic">No images attached to this post.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {selectedPost.images.map((src, idx) => (
                                                        <div key={idx} className="group relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                                                            <img src={src} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                                                            <button 
                                                                onClick={() => removeFile('post-image', src, idx)}
                                                                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                        <FiMessageCircle size={48} className="mb-4" />
                                        <p className="text-sm font-mono tracking-widest uppercase">Select a post to edit</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutEditor;
