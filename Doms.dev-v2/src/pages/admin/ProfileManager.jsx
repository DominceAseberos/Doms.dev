import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, Save, RefreshCw, Upload, Image as ImageIcon, FileText, GraduationCap, Trash2, Plus } from 'lucide-react';
import strings from '../../config/adminStrings.json';
import { useAdminStore } from '../../store/adminStore';
import { profileService } from '../../services/profileService';
import { educationService } from '../../services/educationService';
import { projectService } from '../../services/projectService';

const ProfileManager = () => {
    const navigate = useNavigate();
    const { setAdminLoading, setSuccessMessage } = useAdminStore();
    const [profile, setProfile] = useState({
        name: '',
        role: '',
        bio: '',
        avatar_url: '',
        cv_url: '',
        identity_images: []
    });
    const [education, setEducation] = useState({
        school: '',
        degree: '',
        level: '',
        year_level: '',
        logo_url: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setAdminLoading(true, 'FETCHING IDENTITY DATA');
        try {
            const [profileData, educationData] = await Promise.all([
                profileService.getProfile(),
                educationService.getEducation()
            ]);
            setProfile({
                ...profileData,
                identity_images: profileData.identity_images || []
            });
            setEducation(educationData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setAdminLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setAdminLoading(true, 'SYNCHRONIZING IDENTITY');
        try {
            await Promise.all([
                profileService.updateProfile(profile.id, {
                    ...profile,
                    name: profile.name,
                    role: profile.role,
                    bio: profile.bio
                }),
                educationService.updateEducation(education.id, education)
            ]);
            setSuccessMessage('Identity Node synchronized successfully!');
        } catch (err) {
            console.error('Save failed:', err);
            alert('Save failed. Check your data and permissions.');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;
        setAdminLoading(true, `UPLOADING ${type.toUpperCase()}`);
        try {
            const fileName = `${type}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const publicUrl = await projectService.uploadProjectImage(file, fileName); // Reuse bucket logic

            if (type === 'avatar') {
                setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            } else if (type === 'cv') {
                setProfile(prev => ({ ...prev, cv_url: publicUrl }));
            } else if (type === 'identity') {
                setProfile(prev => ({
                    ...prev,
                    identity_images: [...(prev.identity_images || []), publicUrl]
                }));
            } else if (type === 'edu_logo') {
                setEducation(prev => ({ ...prev, logo_url: publicUrl }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert(`${type} upload failed.`);
        } finally {
            setAdminLoading(false);
        }
    };

    const removeIdentityImage = (index) => {
        setProfile(prev => ({
            ...prev,
            identity_images: prev.identity_images.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                {/* HEADER */}
                <header className="space-y-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
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
                        <button
                            onClick={fetchData}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw size={18} className="opacity-40" />
                        </button>
                    </div>
                </header>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: AVATAR & IDENTITY IMAGES (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Avatar Card */}
                        <div className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-8 admin-modal-gradient flex flex-col items-center text-center">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <User size={60} className="opacity-10" />
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full backdrop-blur-sm">
                                    <Upload size={24} className="text-primary" />
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'avatar')} accept="image/*" />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-bold tracking-tight">{profile.full_name || 'System Owner'}</h2>
                                <p className="text-[10px] opacity-30 uppercase tracking-widest font-mono">UID: {profile.id?.substring(0, 13)}...</p>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Verified Identity</span>
                            </div>
                        </div>

                        {/* Identity Images */}
                        <div className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-6 admin-modal-gradient">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-primary">
                                    <ImageIcon size={18} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Identity Images</h3>
                                </div>
                                <label className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                    <Plus size={14} />
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'identity')} accept="image/*" multiple />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {profile.identity_images?.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/5">
                                        <img src={img} alt={`Identity ${idx}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => removeIdentityImage(idx)}
                                                className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!profile.identity_images || profile.identity_images.length === 0) && (
                                    <div className="col-span-2 py-8 text-center border border-dashed border-white/10 rounded-xl">
                                        <p className="text-[10px] opacity-30 uppercase tracking-widest">No extra images</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button (Mobile/Tablet usually sticky, but here inline) */}
                        <button
                            type="submit"
                            className="w-full py-5 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] transition-all active:scale-[0.98] shadow-2xl hover:brightness-110 flex items-center justify-center gap-3"
                        >
                            <Save size={18} strokeWidth={3} />
                            Sync Identity to Grid
                        </button>
                    </div>

                    {/* RIGHT COLUMN: DETAILS & EDUC (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Core Info */}
                        <section className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-8 admin-modal-gradient">
                            <div className="flex items-center gap-3 text-primary mb-6">
                                <User size={18} />
                                <h3 className="text-xs font-black uppercase tracking-widest">Core Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Full Name</label>
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
                                        placeholder="Core Function"
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

                            {/* CV Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Curriculum Vitae (CV)</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3 opacity-60">
                                            <FileText size={16} />
                                            <span className="text-xs truncate font-mono">{profile.cv_url ? 'CV_Document.pdf' : 'No CV Uploaded'}</span>
                                        </div>
                                        {profile.cv_url && (
                                            <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wider hover:text-primary transition-colors">
                                                View
                                            </a>
                                        )}
                                    </div>
                                    <label className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2">
                                        <Upload size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'cv')} accept=".pdf,.doc,.docx" />
                                    </label>
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
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/5 p-2 flex items-center justify-center">
                                        {education.logo_url ? <img src={education.logo_url} className="w-full h-full object-contain" alt="Logo" /> : <ImageIcon size={24} className="opacity-20" />}
                                    </div>
                                    <label className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center gap-2">
                                        <Upload size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Upload Logo</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'edu_logo')} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileManager;
