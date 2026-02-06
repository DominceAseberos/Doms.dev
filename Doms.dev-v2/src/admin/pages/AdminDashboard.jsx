import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutGrid, User, FolderKanban, HardDrive,
    Shield, Activity, Database, CheckCircle2, UserCircle, Rss, Music
} from 'lucide-react';
import { authService } from '@shared/services/authService';
import { profileService } from '@shared/services/profileService';
import { projectService } from '@shared/services/projectService';
import { dashboardService } from '@shared/services/dashboardService';
import mediaService from '@shared/services/mediaService';
import { diagnosticService } from '@shared/services/diagnosticService';
import { useAdminStore } from '@admin/store/adminStore';
import strings from '@shared/config/adminStrings.json';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { setAdminLoading } = useAdminStore();
    const [stats, setStats] = useState({
        projects: 0,
        tracks: 0,
        media: 0,
        errors: 0,
        visits: 0
    });
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setAdminLoading(true, 'INITIALIZING SYSTEM HUB');
            try {
                const [prof, projects, tracks, media, errors, visits] = await Promise.all([
                    profileService.getProfile(),
                    projectService.getProjects(),
                    dashboardService.getAll('tracks'),
                    mediaService.getFiles(),
                    diagnosticService.getUnresolvedCount(),
                    diagnosticService.getVisitCount()
                ]);

                setProfile(prof);
                setStats({
                    projects: projects.length,
                    tracks: tracks.length,
                    media: media.length,
                    errors: errors,
                    visits: visits
                });
            } catch (err) {
                console.error('Core sync failed:', err);
            } finally {
                setAdminLoading(false);
            }
        };

        fetchSummary();
    }, [setAdminLoading]);

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                {/* Header */}
                <header className="flex justify-between items-center border-b border-white/5 pb-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                            {strings.hub.titlePrefix} <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">{strings.hub.titleSuffix}</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-mono">
                            {strings.hub.subtitle}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 rounded-xl border border-red-500/40 text-red-500/80 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    >
                        {strings.common.terminateSession}
                    </button>
                </header>

                {/* Persona Overview Widget */}
                {profile && (
                    <div className="p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 admin-modal-gradient flex flex-col md:flex-row gap-8 items-center md:items-start group hover:border-primary/20 transition-all shadow-2xl">
                        <div className="w-32 h-32 rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle size={64} className="m-auto mt-8 opacity-10" />
                            )}
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tight uppercase italic text-primary">{profile.full_name}</h2>
                                <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40 font-mono">{profile.occupation}</p>
                            </div>
                            <p className="text-sm opacity-50 leading-relaxed max-w-2xl line-clamp-3 font-inter">{profile.about_me}</p>
                            <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                                <StatusBadge icon={Shield} label="Identity Verified" color="text-primary" />
                                <StatusBadge icon={CheckCircle2} label="Database Sync Active" color="text-green-500" />
                                <StatusBadge icon={Activity} label="Core Operational" color="text-blue-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AdminCard
                        onClick={() => navigate('/admin/music')}
                        icon={Music}
                        title="Music Station"
                        subtitle="Audio Registry Control"
                        count={stats.tracks}
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/profile')}
                        icon={User}
                        title={strings.hub.cards.identity.title}
                        subtitle="Identity Configuration"
                        status="Active"
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/projects')}
                        icon={FolderKanban}
                        title={strings.hub.cards.portfolio.title}
                        subtitle={`${stats.projects} Deployed Instances`}
                        count={stats.projects}
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/media')}
                        icon={HardDrive}
                        title={strings.hub.cards.storage.title}
                        subtitle={`${stats.media} Assets in Cloud Vault`}
                        count={stats.media}
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/feed')}
                        icon={Rss}
                        title="Feed Channel"
                        subtitle="Broadcast Updates"
                        status="Live"
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/diagnostics')}
                        icon={Activity}
                        title="Diagnostics"
                        subtitle={`${stats.errors} System Exceptions`}
                        count={stats.errors}
                        status={stats.errors > 0 ? 'Critical' : 'Healthy'}
                        pulse={stats.errors > 0}
                    />
                </section>
            </div>
        </div>
    );
};

const AdminCard = ({ onClick, icon: Icon, title, subtitle, count, status, pulse }) => (
    <div
        onClick={onClick}
        className="group p-8 rounded-[2rem] border border-white/10 bg-[#0f0f0f] hover:border-primary/40 transition-all cursor-pointer space-y-6 admin-modal-gradient shadow-2xl relative overflow-hidden"
    >
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500 border border-white/10 group-hover:border-primary/30">
            <Icon size={28} className={`text-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ${pulse ? 'animate-pulse' : ''}`} />
        </div>
        <div className="space-y-1 relative z-10">
            <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors uppercase italic">{title}</h2>
            <p className="text-[10px] opacity-60 uppercase tracking-[0.15em] font-mono group-hover:opacity-80 transition-opacity truncate">{subtitle}</p>
        </div>
        {count !== undefined && (
            <div className="absolute top-4 right-8 font-mono text-[10px] opacity-20 group-hover:opacity-60 transition-opacity flex items-center gap-1.5 font-black">
                <Database size={10} /> {count} NODES
            </div>
        )}
        {status && (
            <div className="absolute top-8 right-8 px-3 py-1 bg-primary/20 rounded-full border border-primary/40">
                <span className="text-[8px] font-black uppercase tracking-widest text-primary">{status}</span>
            </div>
        )}
    </div>
);

const StatusBadge = ({ icon: Icon, label, color }) => (
    <div className={`flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest ${color} shadow-sm transition-all hover:bg-white/10`}>
        <Icon size={12} strokeWidth={3} />
        <span className="opacity-80">{label}</span>
    </div>
);

export default AdminDashboard;
