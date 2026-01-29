import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, Save, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import strings from '../../config/adminStrings.json';
import { useAdminStore } from '../../store/adminStore';
import { profileService } from '../../services/profileService';
import { projectService } from '../../services/projectService';

const ProfileManager = () => {
    const navigate = useNavigate();
    const { setAdminLoading } = useAdminStore();
    const [profile, setProfile] = useState({
        full_name: '',
        occupation: '',
        about_me: '',
        avatar_url: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setAdminLoading(true, 'FETCHING IDENTITY DATA');
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        } finally {
            setAdminLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setAdminLoading(true, 'SYNCHRONIZING IDENTITY');
        try {
            await profileService.updateProfile(profile.id, profile);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Save failed:', err);
            alert('Save failed. Check your data and permissions.');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAdminLoading(true, 'UPLOADING AVATAR');
        try {
            const fileName = `avatar_${Date.now()}`;
            // Re-using projectService upload logic since it uses the same bucket layout
            const publicUrl = await projectService.uploadProjectImage(file, fileName);
            setProfile({ ...profile, avatar_url: publicUrl });
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Avatar upload failed.');
        } finally {
            setAdminLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
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
                                {strings.profile.titlePrefix} <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">{strings.profile.titleSuffix}</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
                                {strings.profile.subtitle}
                            </p>
                        </div>
                        <button
                            onClick={fetchProfile}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw size={18} className="opacity-40" />
                        </button>
                    </div>
                </header>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AVATAR COLUMN */}
                    <div className="lg:col-span-1 space-y-6">
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
                                    <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-bold tracking-tight">Identity Node</h2>
                                <p className="text-[10px] opacity-30 uppercase tracking-widest font-mono">UID: {profile.id?.substring(0, 13)}...</p>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Verified Identity</span>
                            </div>
                        </div>
                    </div>

                    {/* DATA COLUMN */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 space-y-8 admin-modal-gradient">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.full_name || ''}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                            placeholder="System Owner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">Occupation</label>
                                        <input
                                            type="text"
                                            value={profile.occupation || ''}
                                            onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                            placeholder="Core Function"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 px-1">About Me / Personal Bio</label>
                                    <textarea
                                        value={profile.about_me || ''}
                                        onChange={(e) => setProfile({ ...profile, about_me: e.target.value })}
                                        rows={8}
                                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-6 text-sm leading-relaxed focus:outline-none focus:border-white/20 transition-all font-inter resize-none"
                                        placeholder="Describe your architectural existence..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] transition-all active:scale-[0.98] shadow-2xl hover:brightness-110 flex items-center justify-center gap-3"
                            >
                                <Save size={18} strokeWidth={3} />
                                Sync Identity to Grid
                            </button>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileManager;
