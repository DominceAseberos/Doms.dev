import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FiUser, FiCheckSquare, FiMessageCircle,
    FiPlus, FiTrash2, FiUpload, FiGlobe,
    FiFileText, FiCode, FiBriefcase, FiMail,
    FiExternalLink, FiImage, FiChevronDown, FiChevronUp,
} from 'react-icons/fi';

import { fetchAboutData, saveAboutData } from '../../shared/aboutService';
import { fetchPortfolioData, savePortfolioData } from '../../shared/portfolioService';
import { fetchFeedPosts, saveFeedPosts } from '../../shared/feedService';

import aboutDataDefault from '../../data/aboutData.json';
import portfolioDataDefault from '../../data/portfolioData.json';

// ── Shared UI ─────────────────────────────────────────────────────────────
const inputCls = 'w-full px-3 py-1.5 text-sm bg-[#111] border border-white/10 rounded-lg focus:border-[#c8ff3e] outline-none transition-all text-white placeholder-gray-700';
const textareaCls = inputCls + ' resize-none';

const Field = ({ label, children, className = '' }) => (
    <div className={`mb-4 ${className}`}>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
);

const Card = ({ title, icon, children, accent = '#c8ff3e' }) => (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 mb-5">
        {title && (
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2" style={{ color: accent }}>
                {icon && React.cloneElement(icon, { size: 13 })} {title}
            </h2>
        )}
        {children}
    </div>
);

// Tag chip input — add/remove string items
const TagInput = ({ items = [], onChange, placeholder = 'Add item...' }) => {
    const [val, setVal] = useState('');
    const add = () => {
        const t = val.trim();
        if (t && !items.includes(t)) { onChange([...items, t]); setVal(''); }
    };
    return (
        <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
                {items.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white">
                        {item}
                        <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 leading-none">×</button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
                    className={inputCls} placeholder={placeholder} />
                <button type="button" onClick={add} className="px-3 py-1.5 bg-white/5 hover:bg-[#c8ff3e] hover:text-black text-white rounded-lg text-xs font-bold transition-all shrink-0">
                    <FiPlus />
                </button>
            </div>
        </div>
    );
};

// Save status badge
const SaveBadge = ({ status }) => {
    if (!status) return null;
    const map = {
        saving: 'bg-white/10 text-white/60',
        saved:  'bg-green-500/20 text-green-400',
        error:  'bg-red-500/20 text-red-400',
    };
    const label = { saving: '⏳ Saving...', saved: '✓ Saved', error: '✗ Error' };
    return <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${map[status]}`}>{label[status]}</span>;
};

// ── TABS ──────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'profile',  label: 'Profile',   icon: <FiUser /> },
    { id: 'projects', label: 'Projects',  icon: <FiCheckSquare /> },
    { id: 'feed',     label: 'Feed',      icon: <FiMessageCircle /> },
];

// ══════════════════════════════════════════════════════════════════════════
// PROFILE TAB — aboutData.json (hero, about, experience, techStack, socials, contact)
// ══════════════════════════════════════════════════════════════════════════
const ProfileTab = () => {
    const [d, setD] = useState(aboutDataDefault);
    const [status, setStatus] = useState(null);
    const timer = useRef(null);

    useEffect(() => {
        fetchAboutData().then(setD).catch(() => {});
    }, []);

    const save = async (next) => {
        setStatus('saving');
        try { await saveAboutData(next); setStatus('saved'); setTimeout(() => setStatus(null), 2000); }
        catch { setStatus('error'); }
    };

    const update = (updater) => {
        setD(prev => {
            const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => save(next), 800);
            return next;
        });
    };

    const setHero   = (p) => update(prev => ({ ...prev, hero:    { ...prev.hero,    ...p } }));
    const setAbout  = (p) => update(prev => ({ ...prev, about:   { ...prev.about,   ...p } }));
    const setContact= (p) => update(prev => ({ ...prev, contact: { ...prev.contact, ...p } }));

    // Experience CRUD
    const addExp = () => update(prev => ({ ...prev, experience: [...(prev.experience||[]), { role:'', company:'', period:'', desc:'' }] }));
    const setExp = (i, p) => update(prev => { const a=[...(prev.experience||[])]; a[i]={...a[i],...p}; return {...prev,experience:a}; });
    const delExp = (i) => update(prev => ({ ...prev, experience: prev.experience.filter((_,idx)=>idx!==i) }));

    // Tech stack CRUD
    const addGroup = () => update(prev => ({ ...prev, techStack: [...(prev.techStack||[]), { group:'New Group', items:[] }] }));
    const setGroup = (i, p) => update(prev => { const a=[...(prev.techStack||[])]; a[i]={...a[i],...p}; return {...prev,techStack:a}; });
    const delGroup = (i) => update(prev => ({ ...prev, techStack: prev.techStack.filter((_,idx)=>idx!==i) }));

    // About blocks CRUD
    const addBlock = () => update(prev => ({ ...prev, about: { ...prev.about, blocks: [...(prev.about?.blocks||[]), { title:'', body:'' }] } }));
    const setBlock = (i, p) => update(prev => { const a=[...(prev.about?.blocks||[])]; a[i]={...a[i],...p}; return {...prev,about:{...prev.about,blocks:a}}; });
    const delBlock = (i) => update(prev => ({ ...prev, about: { ...prev.about, blocks: prev.about.blocks.filter((_,idx)=>idx!==i) } }));

    // Metrics CRUD
    const addMetric = () => update(prev => ({ ...prev, hero: { ...prev.hero, metrics: [...(prev.hero?.metrics||[]), { value:'', unit:'', label:'' }] } }));
    const setMetric = (i, p) => update(prev => { const a=[...(prev.hero?.metrics||[])]; a[i]={...a[i],...p}; return {...prev,hero:{...prev.hero,metrics:a}}; });
    const delMetric = (i) => update(prev => ({ ...prev, hero: { ...prev.hero, metrics: prev.hero.metrics.filter((_,idx)=>idx!==i) } }));

    // Socials CRUD
    const addSocial = () => update(prev => ({ ...prev, socials: [...(prev.socials||[]), { label:'', href:'', external:true }] }));
    const setSocial = (i, p) => update(prev => { const a=[...(prev.socials||[])]; a[i]={...a[i],...p}; return {...prev,socials:a}; });
    const delSocial = (i) => update(prev => ({ ...prev, socials: prev.socials.filter((_,idx)=>idx!==i) }));

    // Education CRUD
    const addEdu = () => update(prev => ({ ...prev, education: [...(prev.education||[]), { institution:'', degree:'', period:'', skills:[] }] }));
    const setEdu = (i, p) => update(prev => { const a=[...(prev.education||[])]; a[i]={...a[i],...p}; return {...prev,education:a}; });
    const delEdu = (i) => update(prev => ({ ...prev, education: prev.education.filter((_,idx)=>idx!==i) }));
    const hero   = d.hero   || {};
    const about  = d.about  || {};
    const contact= d.contact|| {};

    return (
        <div className="space-y-0">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Profile & About Page</h2>
                <div className="flex items-center gap-3">
                    <SaveBadge status={status} />
                    <button onClick={() => save(d)} className="px-4 py-2 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-widest">Save Now</button>
                </div>
            </div>

            {/* ── HERO ── */}
            <Card title="Hero Section" icon={<FiUser />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <Field label="Full Name"><input value={hero.fullName||''} onChange={e=>setHero({fullName:e.target.value})} className={inputCls} placeholder="Domince Aseberos" /></Field>
                    <Field label="Role"><input value={hero.role||''} onChange={e=>setHero({role:e.target.value})} className={inputCls} /></Field>
                    <Field label="Location Badge"><input value={hero.location||''} onChange={e=>setHero({location:e.target.value})} className={inputCls} placeholder="📍 Davao, Philippines" /></Field>
                    <Field label="GitHub URL"><input value={hero.githubUrl||''} onChange={e=>setHero({githubUrl:e.target.value})} className={inputCls} /></Field>
                    <Field label="LinkedIn URL"><input value={hero.linkedinUrl||''} onChange={e=>setHero({linkedinUrl:e.target.value})} className={inputCls} /></Field>
                    <Field label="Resume URL / Path"><input value={d.resume||''} onChange={e=>update({resume:e.target.value})} className={inputCls} placeholder="/resume.pdf" /></Field>
                    <Field label="Bio" className="md:col-span-2"><textarea value={hero.bio||''} onChange={e=>setHero({bio:e.target.value})} rows={3} className={textareaCls} /></Field>
                    <Field label="Badges" className="md:col-span-2">
                        <TagInput items={hero.badges||[]} onChange={v=>setHero({badges:v})} placeholder="Add badge..." />
                    </Field>
                </div>
                <div className="border-t border-white/5 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metrics</span>
                        <button onClick={addMetric} className="flex items-center gap-1 px-2 py-1 text-[10px] bg-white/5 hover:bg-[#c8ff3e] hover:text-black text-white rounded-lg font-bold transition-all"><FiPlus size={10}/> Add</button>
                    </div>
                    {(hero.metrics||[]).map((m,i)=>(
                        <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <div className="col-span-4"><input value={m.value} onChange={e=>setMetric(i,{value:e.target.value})} className={inputCls} placeholder="60" /></div>
                            <div className="col-span-3"><input value={m.unit} onChange={e=>setMetric(i,{unit:e.target.value})} className={inputCls} placeholder="fps" /></div>
                            <div className="col-span-4"><input value={m.label} onChange={e=>setMetric(i,{label:e.target.value})} className={inputCls} placeholder="Render" /></div>
                            <button onClick={()=>delMetric(i)} className="col-span-1 flex justify-center text-red-400 hover:text-red-300"><FiTrash2 size={13}/></button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* ── ABOUT ── */}
            <Card title="About Section" icon={<FiFileText />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <Field label="Heading"><input value={about.heading||''} onChange={e=>setAbout({heading:e.target.value})} className={inputCls} /></Field>
                    <Field label="Heading Accent (colored)"><input value={about.headingAccent||''} onChange={e=>setAbout({headingAccent:e.target.value})} className={inputCls} /></Field>
                    <Field label="Location (sidebar)" className="md:col-span-2"><input value={about.location||''} onChange={e=>setAbout({location:e.target.value})} className={inputCls} /></Field>
                    <Field label="Intro Paragraph" className="md:col-span-2"><textarea value={about.intro||''} onChange={e=>setAbout({intro:e.target.value})} rows={3} className={textareaCls} /></Field>
                    <Field label="Capabilities" className="md:col-span-2">
                        <TagInput items={about.capabilities||[]} onChange={v=>setAbout({capabilities:v})} placeholder="Add capability..." />
                    </Field>
                    <Field label="AI Tools" className="md:col-span-2">
                        <TagInput items={about.aiTools||[]} onChange={v=>setAbout({aiTools:v})} placeholder="Add AI tool..." />
                    </Field>
                </div>
                <div className="border-t border-white/5 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">About Blocks</span>
                        <button onClick={addBlock} className="flex items-center gap-1 px-2 py-1 text-[10px] bg-white/5 hover:bg-[#c8ff3e] hover:text-black text-white rounded-lg font-bold transition-all"><FiPlus size={10}/> Add Block</button>
                    </div>
                    {(about.blocks||[]).map((b,i)=>(
                        <div key={i} className="mb-3 p-3 bg-black/30 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <input value={b.title} onChange={e=>setBlock(i,{title:e.target.value})} className={inputCls} placeholder="Block title" />
                                <button onClick={()=>delBlock(i)} className="text-red-400 hover:text-red-300 shrink-0"><FiTrash2 size={13}/></button>
                            </div>
                            <textarea value={b.body} onChange={e=>setBlock(i,{body:e.target.value})} rows={3} className={textareaCls} placeholder="Block body..." />
                        </div>
                    ))}
                </div>
            </Card>

            {/* ── EXPERIENCE ── */}
            <Card title="Experience Timeline" icon={<FiBriefcase />}>
                <div className="flex justify-end mb-3">
                    <button onClick={addExp} className="flex items-center gap-1 px-3 py-1.5 text-[10px] bg-[#c8ff3e]/10 text-[#c8ff3e] hover:bg-[#c8ff3e] hover:text-black rounded-lg font-bold transition-all"><FiPlus size={10}/> Add Entry</button>
                </div>
                {(d.experience||[]).map((e,i)=>(
                    <div key={i} className="mb-3 p-4 bg-black/30 rounded-xl border border-white/5 group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                            <input value={e.role} onChange={ev=>setExp(i,{role:ev.target.value})} className={inputCls} placeholder="Role / Title" />
                            <input value={e.company} onChange={ev=>setExp(i,{company:ev.target.value})} className={inputCls} placeholder="Company / Institution" />
                            <input value={e.period} onChange={ev=>setExp(i,{period:ev.target.value})} className={inputCls} placeholder="2024 — Present" />
                            <button onClick={()=>delExp(i)} className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all"><FiTrash2 size={12}/> Remove</button>
                        </div>
                        <textarea value={e.desc} onChange={ev=>setExp(i,{desc:ev.target.value})} rows={2} className={textareaCls} placeholder="Description..." />
                    </div>
                ))}
            </Card>

            {/* ── TECH STACK ── */}
            <Card title="Tech Stack" icon={<FiCode />}>
                <div className="flex justify-end mb-3">
                    <button onClick={addGroup} className="flex items-center gap-1 px-3 py-1.5 text-[10px] bg-[#c8ff3e]/10 text-[#c8ff3e] hover:bg-[#c8ff3e] hover:text-black rounded-lg font-bold transition-all"><FiPlus size={10}/> Add Group</button>
                </div>
                {(d.techStack||[]).map((g,i)=>(
                    <div key={i} className="mb-3 p-4 bg-black/30 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <input value={g.group} onChange={e=>setGroup(i,{group:e.target.value})} className={inputCls} placeholder="Group name" />
                            <button onClick={()=>delGroup(i)} className="text-red-400 hover:text-red-300 shrink-0"><FiTrash2 size={13}/></button>
                        </div>
                        <TagInput items={g.items||[]} onChange={v=>setGroup(i,{items:v})} placeholder="Add tech..." />
                    </div>
                ))}
                <div className="border-t border-white/5 pt-4 mt-2">
                    <Field label="Also comfortable with (extra pills)">
                        <TagInput items={d.techStackExtra||[]} onChange={v=>update({techStackExtra:v})} placeholder="Add tool..." />
                    </Field>
                </div>
            </Card>

            {/* ── EDUCATION ── */}
            <Card title="Academic Background" icon={<FiFileText />}>
                <div className="flex justify-end mb-3">
                    <button onClick={addEdu} className="flex items-center gap-1 px-3 py-1.5 text-[10px] bg-[#c8ff3e]/10 text-[#c8ff3e] hover:bg-[#c8ff3e] hover:text-black rounded-lg font-bold transition-all"><FiPlus size={10}/> Add Entry</button>
                </div>
                {(d.education||[]).map((e,i)=>(
                    <div key={i} className="mb-3 p-4 bg-black/30 rounded-xl border border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            <Field label="Institution" className="md:col-span-2">
                                <input value={e.institution||''} onChange={ev=>setEdu(i,{institution:ev.target.value})} className={inputCls} placeholder="University name" />
                            </Field>
                            <Field label="Degree">
                                <input value={e.degree||''} onChange={ev=>setEdu(i,{degree:ev.target.value})} className={inputCls} placeholder="BS Computer Science" />
                            </Field>
                            <Field label="Period">
                                <input value={e.period||''} onChange={ev=>setEdu(i,{period:ev.target.value})} className={inputCls} placeholder="2021 — Present" />
                            </Field>
                        </div>
                        <Field label="Skills / Subjects (pills)">
                            <TagInput items={e.skills||[]} onChange={v=>setEdu(i,{skills:v})} placeholder="Add skill..." />
                        </Field>
                        <div className="flex justify-end mt-2">
                            <button onClick={()=>delEdu(i)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all"><FiTrash2 size={12}/> Remove</button>
                        </div>
                    </div>
                ))}
            </Card>

            {/* ── CONTACT ── */}
            <Card title="Contact Section" icon={<FiMail />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <Field label="Heading"><input value={contact.heading||''} onChange={e=>setContact({heading:e.target.value})} className={inputCls} /></Field>
                    <Field label="Subtext" className="md:col-span-2"><textarea value={contact.subtext||''} onChange={e=>setContact({subtext:e.target.value})} rows={2} className={textareaCls} /></Field>
                </div>
            </Card>

            {/* ── SOCIALS ── */}
            <Card title="Social Links" icon={<FiGlobe />}>
                <div className="flex justify-end mb-3">
                    <button onClick={addSocial} className="flex items-center gap-1 px-3 py-1.5 text-[10px] bg-[#c8ff3e]/10 text-[#c8ff3e] hover:bg-[#c8ff3e] hover:text-black rounded-lg font-bold transition-all"><FiPlus size={10}/> Add Link</button>
                </div>
                {(d.socials||[]).map((s,i)=>(
                    <div key={i} className="flex items-center gap-2 mb-2 p-2 bg-black/30 rounded-xl border border-white/5">
                        <input value={s.label} onChange={e=>setSocial(i,{label:e.target.value})} className={inputCls + ' w-28 shrink-0'} placeholder="Label" />
                        <input value={s.href} onChange={e=>setSocial(i,{href:e.target.value})} className={inputCls} placeholder="https://..." />
                        <button onClick={()=>delSocial(i)} className="text-red-400 hover:text-red-300 shrink-0"><FiTrash2 size={13}/></button>
                    </div>
                ))}
            </Card>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════════
// PROJECTS TAB — portfolioData.json
// ══════════════════════════════════════════════════════════════════════════
const ProjectsTab = () => {
    const [data, setData] = useState({ projects: [], customCategories: [], categories: [] });
    const [status, setStatus] = useState(null);
    const [newCat, setNewCat] = useState('');
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        fetchPortfolioData().then(setData).catch(() => setData(portfolioDataDefault));
    }, []);

    const persist = async (next) => {
        setData(next);
        setStatus('saving');
        try { await savePortfolioData(next); setStatus('saved'); setTimeout(() => setStatus(null), 2000); }
        catch { setStatus('error'); }
    };

    const updateProject = (i, patch) => {
        const projects = [...data.projects];
        projects[i] = { ...projects[i], ...patch };
        persist({ ...data, projects });
    };

    const addProject = () => {
        const p = { id: `project-${Date.now()}`, title: 'New Project', shortDescription: '', projectType: '', dateCreated: new Date().toISOString().split('T')[0], images: [], mainImage: '', desktopImage: '', mobileImage: '', desktopGallery: [], mobileGallery: [], contentSections: [], liveUrl: '', githubUrl: '' };
        persist({ ...data, projects: [...data.projects, p] });
        setExpanded(data.projects.length);
    };

    const removeProject = async (i) => {
        if (!window.confirm('Delete this project?')) return;
        const id = data.projects[i].id;
        try { await fetch(`/__delete-folder?projectId=${encodeURIComponent(id)}`, { method: 'DELETE' }); } catch {}
        persist({ ...data, projects: data.projects.filter((_,idx)=>idx!==i) });
    };

    const addCategory = () => {
        const t = newCat.trim();
        if (!t) return;
        persist({ ...data, customCategories: [...(data.customCategories||[]), t] });
        setNewCat('');
    };

    const removeCategory = (cat) => {
        persist({ ...data, customCategories: (data.customCategories||[]).filter(c=>c!==cat), projects: data.projects.map(p=>p.projectType===cat?{...p,projectType:''}:p) });
    };

    const uploadImage = async (file, projectId, field, i) => {
        const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=${projectId}&type=imgs`, { method: 'POST', body: file });
        const json = await res.json();
        if (json.ok) updateProject(i, { [field]: json.url });
    };

    const categories = Array.from(new Set([...(data.customCategories||[]), ...data.projects.map(p=>p.projectType).filter(Boolean)]));

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Projects</h2>
                <div className="flex items-center gap-3">
                    <SaveBadge status={status} />
                    <button onClick={addProject} className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-widest"><FiPlus size={12}/> Add Project</button>
                </div>
            </div>

            {/* Categories */}
            <Card title="Categories" icon={<FiCheckSquare />}>
                <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map(cat=>(
                        <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white">
                            {cat}
                            <button onClick={()=>removeCategory(cat)} className="text-red-400 hover:text-red-300">×</button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCategory()} className={inputCls} placeholder="New category name..." />
                    <button onClick={addCategory} className="px-3 py-1.5 bg-white/5 hover:bg-[#c8ff3e] hover:text-black text-white rounded-lg text-xs font-bold transition-all shrink-0"><FiPlus /></button>
                </div>
            </Card>

            {/* Project list */}
            {data.projects.map((p, i) => (
                <div key={p.id} className="mb-3 bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
                    <button onClick={()=>setExpanded(expanded===i?null:i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors">
                        <div className="flex items-center gap-3">
                            {p.mainImage||p.desktopImage ? <img src={p.mainImage||p.desktopImage} className="w-10 h-7 object-cover rounded border border-white/10" /> : <div className="w-10 h-7 bg-white/5 rounded border border-white/10" />}
                            <div>
                                <p className="text-sm font-bold text-white">{p.title||'Untitled'}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{p.projectType||'No category'} · {p.dateCreated||'No date'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="text-[#c8ff3e] hover:text-white"><FiExternalLink size={13}/></a>}
                            <Link to={`/admin/projects/${p.id}`} onClick={e=>e.stopPropagation()} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg">Full Editor</Link>
                            <button onClick={e=>{e.stopPropagation();removeProject(i);}} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={13}/></button>
                            {expanded===i ? <FiChevronUp size={14} className="text-gray-400"/> : <FiChevronDown size={14} className="text-gray-400"/>}
                        </div>
                    </button>

                    {expanded===i && (
                        <div className="px-5 pb-5 border-t border-white/5 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <Field label="Title"><input value={p.title||''} onChange={e=>updateProject(i,{title:e.target.value})} className={inputCls} /></Field>
                                <Field label="Project Type / Category">
                                    <select value={p.projectType||''} onChange={e=>updateProject(i,{projectType:e.target.value})} className={inputCls}>
                                        <option value="">Select...</option>
                                        {categories.map(c=><option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Field>
                                <Field label="Date Created"><input type="date" value={p.dateCreated?.split('T')[0]||''} onChange={e=>updateProject(i,{dateCreated:e.target.value})} className={inputCls} /></Field>
                                <Field label="Live URL"><input value={p.liveUrl||''} onChange={e=>updateProject(i,{liveUrl:e.target.value})} className={inputCls} placeholder="https://..." /></Field>
                                <Field label="GitHub URL"><input value={p.githubUrl||''} onChange={e=>updateProject(i,{githubUrl:e.target.value})} className={inputCls} placeholder="https://github.com/..." /></Field>
                                <Field label="Short Description" className="md:col-span-2"><textarea value={p.shortDescription||''} onChange={e=>updateProject(i,{shortDescription:e.target.value})} rows={3} className={textareaCls} /></Field>
                            </div>

                            {/* Main image */}
                            <div className="border-t border-white/5 pt-4 mt-2">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Main / Desktop Image</p>
                                <div className="flex items-center gap-3">
                                    {(p.mainImage||p.desktopImage) && <img src={p.mainImage||p.desktopImage} className="h-16 w-auto rounded border border-white/10 object-cover" />}
                                    <label className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-[#c8ff3e] hover:text-black text-white rounded-lg text-xs font-bold cursor-pointer transition-all">
                                        <FiUpload size={12}/> Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) uploadImage(f,p.id,'mainImage',i);}} />
                                    </label>
                                    <input value={p.mainImage||''} onChange={e=>updateProject(i,{mainImage:e.target.value})} className={inputCls} placeholder="Or paste URL..." />
                                </div>
                            </div>

                            <div className="mt-3 text-center">
                                <Link to={`/admin/projects/${p.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8ff3e]/10 text-[#c8ff3e] hover:bg-[#c8ff3e] hover:text-black rounded-lg text-xs font-bold transition-all">
                                    <FiExternalLink size={12}/> Open Full Content Builder
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════════
// FEED TAB — feedPosts.json
// ══════════════════════════════════════════════════════════════════════════
const FeedTab = () => {
    const [posts, setPosts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState('');
    const timer = useRef(null);

    useEffect(() => {
        fetchFeedPosts().then(p => { setPosts(p||[]); if(p?.length) setSelected(p[0].id); }).catch(()=>{});
    }, []);

    const save = async (next) => {
        setStatus('saving');
        try { await saveFeedPosts(next); setStatus('saved'); setTimeout(()=>setStatus(null),2000); }
        catch { setStatus('error'); }
    };

    const update = (updater) => {
        setPosts(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => save(next), 800);
            return next;
        });
    };

    const addPost = () => {
        const p = { id:`post-${Date.now()}`, type:'text', title:'New Post', body:'', createdAt:new Date().toISOString().split('T')[0], tags:[], images:[] };
        update(prev => [p, ...prev]);
        setSelected(p.id);
    };

    const deletePost = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        const post = posts.find(p=>p.id===id);
        for (const img of [...(post?.images||[])]) {
            if (img?.includes('/assets/uploads/')) try { await fetch(`/__delete-upload?path=${encodeURIComponent(img)}`,{method:'DELETE'}); } catch {}
        }
        update(prev => prev.filter(p=>p.id!==id));
        setSelected(posts.find(p=>p.id!==id)?.id||null);
    };

    const updatePost = (patch) => update(prev => prev.map(p=>p.id===selected?{...p,...patch}:p));

    const uploadImage = async (file) => {
        const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=about&type=imgs`,{method:'POST',body:file});
        const json = await res.json();
        if (json.ok) {
            const post = posts.find(p=>p.id===selected);
            updatePost({ images:[...(post?.images||[]),json.url], type:'image' });
        }
    };

    const removeImage = async (src, idx) => {
        if (src?.includes('/assets/uploads/')) try { await fetch(`/__delete-upload?path=${encodeURIComponent(src)}`,{method:'DELETE'}); } catch {}
        const post = posts.find(p=>p.id===selected);
        const images = (post?.images||[]).filter((_,i)=>i!==idx);
        updatePost({ images, type: images.length?'image':'text' });
    };

    const filtered = posts.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.body?.toLowerCase().includes(search.toLowerCase()));
    const post = posts.find(p=>p.id===selected);

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Feed & Posts</h2>
                <div className="flex items-center gap-3">
                    <SaveBadge status={status} />
                    <button onClick={addPost} className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-widest"><FiPlus size={12}/> New Post</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[600px]">
                {/* List */}
                <div className="md:col-span-4 bg-[#161616] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-white/5">
                        <input value={search} onChange={e=>setSearch(e.target.value)} className={inputCls} placeholder="Search posts..." />
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                        {filtered.length===0 && <p className="p-6 text-center text-xs text-gray-600 italic">No posts found.</p>}
                        {filtered.map(p=>(
                            <button key={p.id} onClick={()=>setSelected(p.id)} className={`w-full text-left p-4 transition-all hover:bg-white/5 ${selected===p.id?'bg-[#c8ff3e]/10 border-l-2 border-[#c8ff3e]':'border-l-2 border-transparent'}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{p.createdAt}</span>
                                    {p.type==='image'&&<FiImage size={10} className="text-[#c8ff3e]"/>}
                                </div>
                                <p className={`text-xs font-bold truncate ${selected===p.id?'text-[#c8ff3e]':'text-white/80'}`}>{p.title||'Untitled'}</p>
                                <p className="text-[10px] text-white/40 line-clamp-2 mt-0.5">{p.body}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="md:col-span-8 bg-[#161616] border border-white/5 rounded-2xl p-5 overflow-y-auto">
                    {post ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Edit Post</h3>
                                <button onClick={()=>deletePost(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><FiTrash2 size={12}/> Delete</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Field label="Title"><input value={post.title||''} onChange={e=>updatePost({title:e.target.value})} className={inputCls} /></Field>
                                <Field label="Date"><input type="date" value={post.createdAt||''} onChange={e=>updatePost({createdAt:e.target.value})} className={inputCls} /></Field>
                            </div>
                            <Field label="Body">
                                <textarea value={post.body||''} onChange={e=>updatePost({body:e.target.value})} rows={6} className={textareaCls} placeholder="Write your post..." />
                            </Field>
                            <Field label="Tags (comma-separated)">
                                <input value={(post.tags||[]).join(', ')} onChange={e=>updatePost({tags:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)})} className={inputCls} placeholder="UI, Motion, Update" />
                            </Field>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Images</label>
                                    <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 hover:bg-[#c8ff3e] hover:text-black text-white rounded-lg font-bold cursor-pointer transition-all">
                                        <FiPlus size={11}/> Add Image
                                        <input type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)uploadImage(f);}} />
                                    </label>
                                </div>
                                {(!post.images||post.images.length===0) ? (
                                    <div className="p-6 border-2 border-dashed border-white/5 rounded-xl text-center text-xs text-white/20 italic">No images attached.</div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {post.images.map((src,idx)=>(
                                            <div key={idx} className="group relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                                                <img src={src} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                                                <button onClick={()=>removeImage(src,idx)} className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                            <FiMessageCircle size={40} className="mb-3"/>
                            <p className="text-xs font-mono uppercase tracking-widest">Select a post to edit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════════
// ROOT — AdminCMS (single page, tabbed)
// ══════════════════════════════════════════════════════════════════════════
const AdminCMS = () => {
    const [tab, setTab] = useState('profile');

    const tabContent = {
        profile:  <ProfileTab />,
        projects: <ProjectsTab />,
        feed:     <FeedTab />,
    };

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white font-sans selection:bg-[#c8ff3e] selection:text-black">
            {/* Top bar */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-6 py-3 flex items-center justify-between shadow-xl shadow-black/50">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#c8ff3e] uppercase tracking-widest">Doms.dev</span>
                    <span className="text-white/20">·</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">CMS</span>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-xl border border-white/10">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                                tab === t.id ? 'bg-[#c8ff3e] text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}>
                            {React.cloneElement(t.icon, { size: 13 })}
                            {t.label}
                        </button>
                    ))}
                </div>

                <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                    <FiExternalLink size={12}/> View Site
                </a>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                {tabContent[tab]}
            </main>
        </div>
    );
};

export default AdminCMS;
