import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { profileService } from '../../services/profileService';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

const ProfileManager = () => {
    const [profile, setProfile] = useState({ name: '', bio: '', live_feed_status: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    const formRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                setProfile({
                    id: data.id,
                    name: data.name || '',
                    bio: data.bio || '',
                    live_feed_status: data.live_feed_status || ''
                });
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setStatus({ type: 'error', message: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(formRef.current?.children || [],
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            await profileService.updateProfile(profile.id, {
                name: profile.name,
                bio: profile.bio,
                live_feed_status: profile.live_feed_status
            });
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <header className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        PROFILE MANAGER
                    </h1>
                    <p className="text-xs uppercase tracking-widest opacity-50 font-mono">
                        Identity & Live Status Management
                    </p>
                </header>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-6 p-8 rounded-3xl border border-white/5"
                    style={{
                        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
                    }}
                >
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Full Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Bio / About</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                            placeholder="Tell your story..."
                            required
                        />
                        <div className="flex justify-end">
                            <span className="text-[9px] opacity-40 font-mono uppercase">{profile.bio.length} / 500</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Live Status Feed</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profile.live_feed_status}
                                onChange={(e) => setProfile({ ...profile, live_feed_status: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                                placeholder="Active Now, Working on..."
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                        </div>
                    </div>

                    {status && (
                        <div className={`flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {status.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                            <span className="text-xs font-medium">{status.message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 disabled:opacity-50 hover:cursor-pointer shadow-lg"
                        style={{
                            background: `rgb(var(--contrast-rgb))`,
                            color: '#000'
                        }}
                    >
                        {saving ? 'Synchronizing...' : 'Update Identity'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileManager;
