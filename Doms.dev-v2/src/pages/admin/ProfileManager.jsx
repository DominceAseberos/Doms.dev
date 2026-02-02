import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, Save, RefreshCw, Upload, Image as ImageIcon, FileText, GraduationCap, Trash2, Plus, Image, Code2, Globe, Grid, X, ExternalLink } from 'lucide-react';

import strings from '../../config/adminStrings.json';
import { useAdminStore } from '../../store/adminStore';
import { profileService } from '../../services/profileService';
import { educationService } from '../../services/educationService';
import { projectService } from '../../services/projectService';
import { dashboardService } from '../../services/dashboardService';
import MediaPickerModal from '../../components/MediaPickerModal';
import { getAvailableIconNames, getIconByName, BrandColors } from '../../utils/IconRegistry';
import { compressImage } from '../../utils/imageUtils';

const ProfileManager = () => {
    const navigate = useNavigate();
    const { setAdminLoading, setSuccessMessage, setErrorMessage } = useAdminStore();

    // State
    const [profile, setProfile] = useState({
        name: '',
        role: '',
        bio: '',
        avatar_url: '',
        hero_img_url: '',
        cv_url: '',
        cv_img_url: '',
        birthday: '',
        location: ''
    });
    const [education, setEducation] = useState({
        school: '',
        degree: '',
        level: '',
        year_level: '',
        logo_url: ''
    });

    const [techStack, setTechStack] = useState([]);
    const [socials, setSocials] = useState([]);
    const [originalData, setOriginalData] = useState({ tech: [], socials: [] });

    // Media Picker State
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'avatar' | 'hero' | 'cv' | 'edu_logo'
    const [dragTarget, setDragTarget] = useState(null); // 'avatar' | 'hero' | 'cv' | 'cv_img' | 'edu_logo'

    // Icon Registry
    const availableStacks = getAvailableIconNames().filter(name =>
        !['Github', 'Linkedin', 'Mail', 'ExternalLink', 'MessageCircle', 'Facebook', 'Youtube'].includes(name)
    );
    const availableIcons = getAvailableIconNames().sort();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setAdminLoading(true, 'FETCHING IDENTITY DATA');
        try {
            const [profileData, educationData, tech, contactsData] = await Promise.all([
                profileService.getProfile(),
                educationService.getEducation(),
                dashboardService.getAll('tech_stacks'),
                dashboardService.getAll('contacts')
            ]);
            setProfile({
                ...profileData,
                hero_img_url: profileData.hero_img_url || '',
                cv_img_url: profileData.cv_img_url || ''
            });
            setEducation(educationData || {});
            setTechStack(tech || []);

            // Direct List Mapping
            setSocials(contactsData || []);
            setOriginalData({
                tech: tech || [],
                socials: contactsData || []
            });
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setErrorMessage('Failed to load identity data.');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setAdminLoading(true, 'SYNCHRONIZING IDENTITY');
        try {
            if (!profile.id) throw new Error('Profile ID missing. Database initialization required.');

            // 1. Sync Profile & Education
            const updates = [
                profileService.updateProfile(profile.id, {
                    ...profile,
                    name: profile.name,
                    role: profile.role,
                    bio: profile.bio
                }),
                education.id ? educationService.updateEducation(education.id, education) : Promise.resolve()
            ];

            // 2. Sync Tech Stack
            // Additions
            const newTech = techStack.filter(t => !originalData.tech.find(ot => ot.name?.toLowerCase().trim() === t.name?.toLowerCase().trim()));
            newTech.forEach(t => updates.push(dashboardService.create('tech_stacks', {
                name: t.name,
                icon_name: t.icon_name,
                color: t.color,
                type: t.type,
                display_order: t.display_order
            })));

            // Deletions
            const removedTech = originalData.tech.filter(ot => !techStack.find(t => t.name?.toLowerCase().trim() === ot.name?.toLowerCase().trim()));
            removedTech.forEach(t => updates.push(dashboardService.delete('tech_stacks', t.id)));

            // 3. Sync Socials (List Update)
            // Additions
            const newSocials = socials.filter(s => !s.id);
            newSocials.forEach(s => updates.push(dashboardService.create('contacts', {
                platform: s.platform,
                url: s.url,
                icon: s.icon,
                display_order: s.display_order
            })));

            // Updates
            const updatedSocials = socials.filter(s => s.id && (
                s.platform !== originalData.socials.find(os => os.id === s.id)?.platform ||
                s.url !== originalData.socials.find(os => os.id === s.id)?.url ||
                s.icon !== originalData.socials.find(os => os.id === s.id)?.icon
            ));
            updatedSocials.forEach(s => updates.push(dashboardService.update('contacts', s.id, {
                platform: s.platform,
                url: s.url,
                icon: s.icon
            })));

            // Deletions
            const removedSocials = originalData.socials.filter(os => !socials.find(s => s.id === os.id));
            removedSocials.forEach(s => updates.push(dashboardService.delete('contacts', s.id)));

            await Promise.all(updates);

            // Refresh data to get new IDs
            fetchData();
            setSuccessMessage('Identity Node synchronized successfully!');
        } catch (err) {
            console.error('Save failed:', err);
            setErrorMessage(err.message || 'Save failed. Check your data and permissions.');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;
        setAdminLoading(true, `UPLOADING ${type.toUpperCase()}`);
        try {
            let uploadFile = file;

            // Apply compression only for images, skip for documents (CV)
            if (type !== 'cv') {
                try {
                    uploadFile = await compressImage(file);
                } catch (compErr) {
                    console.warn('Compression failed, falling back to original', compErr);
                }
            }

            const fileName = `${type}_${Date.now()}_${uploadFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const publicUrl = await projectService.uploadProjectImage(uploadFile, fileName);

            if (type === 'avatar') {
                setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            } else if (type === 'hero') {
                setProfile(prev => ({ ...prev, hero_img_url: publicUrl }));
            } else if (type === 'cv') {
                setProfile(prev => ({ ...prev, cv_url: publicUrl }));
            } else if (type === 'cv_img') {
                setProfile(prev => ({ ...prev, cv_img_url: publicUrl }));
            } else if (type === 'edu_logo') {
                setEducation(prev => ({ ...prev, logo_url: publicUrl }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setErrorMessage(`${type} upload failed.`);
        } finally {
            setAdminLoading(false);
        }
    };

    // Drag and Drop Handlers
    const handleDragOver = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setDragTarget(type);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragTarget(null);
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setDragTarget(null);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0], type);
        }
    };

    // Media Picker Handlers
    const openMediaPicker = (target) => {
        setMediaPickerTarget(target);
        setIsMediaPickerOpen(true);
    };

    const handleMediaSelect = (url) => {
        const selectedUrl = Array.isArray(url) ? url[0] : url;
        if (!selectedUrl) return;

        if (mediaPickerTarget === 'avatar') {
            setProfile(prev => ({ ...prev, avatar_url: selectedUrl }));
        } else if (mediaPickerTarget === 'hero') {
            setProfile(prev => ({ ...prev, hero_img_url: selectedUrl }));
        } else if (mediaPickerTarget === 'cv') {
            setProfile(prev => ({ ...prev, cv_url: selectedUrl }));
        } else if (mediaPickerTarget === 'cv_img') {
            setProfile(prev => ({ ...prev, cv_img_url: selectedUrl }));
        } else if (mediaPickerTarget === 'edu_logo') {
            setEducation(prev => ({ ...prev, logo_url: selectedUrl }));
        }

        setIsMediaPickerOpen(false);
    };

    const removeIdentityImage = (index) => {
        setProfile(prev => ({
            ...prev,
            identity_images: prev.identity_images.filter((_, i) => i !== index)
        }));
    };

    // --- HELPER FUNCTIONS ---

    const IconWrapper = ({ name, className }) => {
        const Icon = getIconByName(name);
        return <Icon size={12} className={className || "text-primary opacity-80"} />;
    };

    // Tech Stack Logic
    const toggleStack = (stackName) => {
        const exists = techStack.find(t => t.name?.toLowerCase().trim() === stackName.toLowerCase().trim());
        if (exists) {
            setTechStack(prev => prev.filter(t => t.name?.toLowerCase().trim() !== stackName.toLowerCase().trim()));
        } else {
            // Add new stack item with full metadata
            const iconName = stackName; // The stack name IS the icon name key
            const brandColor = BrandColors[stackName] || '#ffffff';

            setTechStack(prev => [...prev, {
                name: stackName,
                icon_name: iconName,
                color: brandColor,
                type: 'core', // Default type
                display_order: prev.length + 1
            }]);
        }
    };

    // Socials Logic
    const addSocial = () => {
        setSocials(prev => [...prev, { platform: '', url: 'https://', icon: 'Globe', display_order: prev.length + 1 }]);
    };

    const removeSocial = (index) => {
        setSocials(prev => prev.filter((_, i) => i !== index));
    };

    const updateSocial = (index, field, value) => {
        setSocials(prev => {
            const newSocials = [...prev];
            newSocials[index] = { ...newSocials[index], [field]: value };
            return newSocials;
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                {/* HEADER */}
                <header className="space-y-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-6 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest hover:border-white/10 cursor-pointer group text-white"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        {strings.common.backToAdmin}
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1 border-l-4 border-primary pl-6">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                                IDENTITY <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">NODE</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
                                Persona Security Interface
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 item-center">
                            <button
                                onClick={fetchData}
                                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                            >
                                <RefreshCw size={18} className="opacity-40" />
                            </button>
                            <button
                                onClick={handleSave}
                                className="h-12 px-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2 shadow-lg hover:shadow-white/20"
                            >
                                <Save size={16} strokeWidth={3} />
                                <span className="hidden md:inline">Sync Changes</span>
                            </button>
                        </div>
                    </div>
                </header>

                <form id="profile-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: AVATAR, HERO (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Avatar Card */}
                        <div
                            className={`p-8 rounded-[2.5rem] bg-[#0f0f0f] border space-y-8 admin-modal-gradient flex flex-col items-center text-center transition-colors ${dragTarget === 'avatar' ? 'border-primary bg-primary/5' : 'border-white/5'
                                }`}
                            onDragOver={(e) => handleDragOver(e, 'avatar')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 'avatar')}
                        >
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden pointer-events-none">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <User size={60} className="opacity-10" />
                                    )}
                                    {dragTarget === 'avatar' && (
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
                                            <span className="text-primary font-black text-[10px] uppercase tracking-widest">Drop to Upload</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-4 flex gap-2">
                                    <label className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                        <Upload size={14} className="text-black" />
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'avatar')} accept="image/*" />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => openMediaPicker('avatar')}
                                        className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform text-white/70 hover:text-white"
                                        title="Select from Vault"
                                    >
                                        <Grid size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mt-4 pointer-events-none">
                                <h2 className="text-xl font-bold tracking-tight">{profile.full_name || 'System Owner'}</h2>
                                <p className="text-[10px] opacity-30 uppercase tracking-widest font-mono">UID: {profile.id?.substring(0, 13)}...</p>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary pointer-events-none">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Verified Identity</span>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div
                            className={`p-8 rounded-[2.5rem] bg-[#0f0f0f] border space-y-6 admin-modal-gradient transition-colors ${dragTarget === 'hero' ? 'border-primary bg-primary/5' : 'border-white/5'
                                }`}
                            onDragOver={(e) => handleDragOver(e, 'hero')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 'hero')}
                        >
                            <div className="flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-3 text-primary">
                                    <Image size={18} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Hero Visual</h3>
                                </div>
                                <div className="flex gap-2 pointer-events-auto">
                                    <button
                                        type="button"
                                        onClick={() => openMediaPicker('hero')}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-white/60 hover:text-white"
                                        title="Select from Vault"
                                    >
                                        <Grid size={14} />
                                    </button>
                                    <label className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                        <Upload size={14} />
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'hero')} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                            <div className="aspect-video rounded-xl bg-black/50 border border-white/5 overflow-hidden relative group pointer-events-none">
                                {profile.hero_img_url ? (
                                    <img src={profile.hero_img_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20"><Image size={32} /></div>
                                )}
                                {dragTarget === 'hero' && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
                                        <span className="text-primary font-black text-xs uppercase tracking-widest">Drop Visual to Upload</span>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Save Button */}
                        <button
                            type="submit"
                            className="w-full py-5 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] transition-all active:scale-[0.98] shadow-2xl hover:brightness-110 flex items-center justify-center gap-3"
                        >
                            <Save size={18} strokeWidth={3} />
                            Sync Identity to Grid
                        </button>
                    </div>

                    {/* RIGHT COLUMN: DETAILS, EDUC, TECH, SOCIALS (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Core Info */}
                        <section className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-8 admin-modal-gradient">
                            <div className="flex items-center gap-3 text-primary mb-6">
                                <User size={18} />
                                <h3 className="text-xs font-black uppercase tracking-widest">Core Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Full Name (Copyright)</label>
                                    <input
                                        type="text"
                                        value={profile.name || ''}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                        placeholder="System Owner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Occupation</label>
                                    <input
                                        type="text"
                                        value={profile.role || ''}
                                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Birthday / Era</label>
                                    <input
                                        type="text"
                                        value={profile.birthday || ''}
                                        onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                        placeholder="e.g. Sept 1999"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Base Location</label>
                                    <input
                                        type="text"
                                        value={profile.location || ''}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                        placeholder="e.g. Manila, PH"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">About Me / Personal Bio</label>
                                <textarea
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={6}
                                    className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-6 text-sm leading-relaxed focus:outline-none focus:border-white/20 transition-all font-inter resize-none"
                                    placeholder="Describe your architectural existence..."
                                />
                            </div>

                            {/* CV Upload Section */}
                            <div className="space-y-6">
                                {/* CV Document (File) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Curriculum Vitae (Document)</label>
                                    <div
                                        className={`flex items-center gap-4 border rounded-2xl p-2 transition-colors relative overflow-hidden ${dragTarget === 'cv' ? 'border-primary bg-primary/5' : 'border-transparent'
                                            }`}
                                        onDragOver={(e) => handleDragOver(e, 'cv')}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, 'cv')}
                                    >
                                        {dragTarget === 'cv' && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
                                                <span className="text-primary font-black text-xs uppercase tracking-widest">Drop Document to Upload</span>
                                            </div>
                                        )}
                                        <div className="flex-1 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between pointer-events-none">
                                            <div className="flex items-center gap-3 opacity-60">
                                                <FileText size={16} />
                                                <span className="text-xs truncate font-mono">{profile.cv_url ? 'Active CV File' : 'No CV Uploaded'}</span>
                                            </div>
                                            {profile.cv_url && (
                                                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wider hover:text-primary transition-colors pointer-events-auto">
                                                    View
                                                </a>
                                            )}
                                        </div>
                                        <label className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2">
                                            <Upload size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Upload File</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'cv')} accept=".pdf,.doc,.docx,.jpg,.png" />
                                        </label>
                                    </div>
                                </div>

                                {/* CV Visual (Image) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">CV Visual Preview (Image)</label>
                                    <div
                                        className={`flex items-center gap-4 border rounded-2xl p-2 transition-colors ${dragTarget === 'cv_img' ? 'border-primary bg-primary/5' : 'border-transparent'
                                            }`}
                                        onDragOver={(e) => handleDragOver(e, 'cv_img')}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, 'cv_img')}
                                    >
                                        <div className="w-20 h-24 rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden flex items-center justify-center relative group pointer-events-none">
                                            {profile.cv_img_url ? (
                                                <img src={profile.cv_img_url} className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" alt="CV Preview" />
                                            ) : (
                                                <Image size={24} className="opacity-20" />
                                            )}
                                            {dragTarget === 'cv_img' && (
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm font-black text-primary text-[8px] uppercase text-center p-1">
                                                    Drop Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2">
                                                <Upload size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Upload Image</span>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'cv_img')} accept="image/*" />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => openMediaPicker('cv_img')}
                                                className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2"
                                            >
                                                <Grid size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Select from Vault</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Education Section */}
                        <section className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-8 admin-modal-gradient">
                            <div className="flex items-center gap-3 text-primary mb-6">
                                <GraduationCap size={18} />
                                <h3 className="text-xs font-black uppercase tracking-widest">Education Module</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">School / Institution</label>
                                    <input
                                        type="text"
                                        value={education.school || ''}
                                        onChange={(e) => setEducation({ ...education, school: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                        placeholder="University Name"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Degree / Course</label>
                                    <input
                                        type="text"
                                        value={education.degree || ''}
                                        onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                        placeholder="Bachelor of Science..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">School Logo</label>
                                <div
                                    className={`flex items-center gap-4 border rounded-2xl p-2 transition-colors ${dragTarget === 'edu_logo' ? 'border-primary bg-primary/5' : 'border-transparent'
                                        }`}
                                    onDragOver={(e) => handleDragOver(e, 'edu_logo')}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, 'edu_logo')}
                                >
                                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/5 p-2 flex items-center justify-center pointer-events-none relative overflow-hidden">
                                        {education.logo_url ? <img src={education.logo_url} className="w-full h-full object-contain" alt="Logo" /> : <ImageIcon size={24} className="opacity-20" />}
                                        {dragTarget === 'edu_logo' && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm font-black text-primary text-[8px] uppercase text-center p-1">
                                                Drop Logo
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2">
                                            <Upload size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Upload Logo</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'edu_logo')} accept="image/*" />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => openMediaPicker('edu_logo')}
                                            className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2"
                                        >
                                            <Grid size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Select from Vault</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Tech & Socials Editors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tech Stack Editor */}
                            <section className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-6 admin-modal-gradient bg-grid-white/[0.02]">
                                <div className="flex items-center gap-3 text-primary mb-2">
                                    <Code2 size={18} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Tech Stack</h3>
                                </div>

                                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {availableStacks.map(stack => (
                                        <button
                                            key={stack}
                                            type="button"
                                            onClick={() => toggleStack(stack)}
                                            className={`px-3 py-2 rounded-lg text-[9px] uppercase font-black tracking-widest border transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${techStack.find(t => t.name?.toLowerCase().trim() === stack.toLowerCase().trim())
                                                ? 'bg-blue-600 border-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                                                : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20 hover:text-white/60'
                                                }`}
                                        >
                                            <IconWrapper name={stack} className={techStack.find(t => t.name?.toLowerCase().trim() === stack.toLowerCase().trim()) ? "text-white" : "text-white opacity-40"} />
                                            {stack}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-white/20 italic text-center">Select technologies to display in your profile.</p>
                            </section>

                            {/* Socials Editor */}
                            <section className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-6 admin-modal-gradient bg-grid-white/[0.02]">
                                <div className="flex items-center gap-3 text-primary mb-2">
                                    <Globe size={18} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Social Matrix</h3>
                                </div>

                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {socials.map((social, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all animate-in slide-in-from-right-2 duration-300">
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={social.platform}
                                                    onChange={(e) => updateSocial(idx, 'platform', e.target.value)}
                                                    placeholder="Platform (e.g. GitHub)"
                                                    className="w-1/3 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-white/30 text-white"
                                                />
                                                <select
                                                    value={social.icon || ''}
                                                    onChange={(e) => updateSocial(idx, 'icon', e.target.value)}
                                                    className="w-1/3 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-white/30 text-white/70 [&>option]:bg-black"
                                                >
                                                    <option value="" disabled>Icon</option>
                                                    {availableIcons.map(icon => (
                                                        <option key={icon} value={icon}>{icon}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSocial(idx)}
                                                    className="ml-auto w-8 h-8 rounded-lg bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 border border-red-500/10 flex items-center justify-center transition-all cursor-pointer"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <div className="w-8 h-8 flex items-center justify-center text-white/40">
                                                    <IconWrapper name={social.icon || 'HelpCircle'} size={14} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={social.url}
                                                    onChange={(e) => updateSocial(idx, 'url', e.target.value)}
                                                    placeholder="https://..."
                                                    className="flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:border-white/30 text-primary/80"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addSocial}
                                        className="w-full py-3 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest opacity-30 hover:opacity-100 hover:bg-white/[0.02] transition-all cursor-pointer group"
                                    >
                                        <Plus size={12} className="group-hover:rotate-90 transition-transform" /> Add Connection
                                    </button>
                                </div>
                            </section>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="w-full py-5 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 lg:hidden hover:bg-gray-200"
                        >
                            <Save size={18} strokeWidth={3} />
                            Sync Identity to Grid
                        </button>
                    </div>
                </form>
            </div>

            {/* FLOATING SYNC BUTTON */}
            <button
                onClick={() => document.getElementById('profile-form').requestSubmit()}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center hover:scale-110 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer border-4 border-black/50"
                title="Sync Identity to Grid"
            >
                <Save size={24} strokeWidth={3} />
            </button>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
            />
        </div>
    );
};

export default ProfileManager;
