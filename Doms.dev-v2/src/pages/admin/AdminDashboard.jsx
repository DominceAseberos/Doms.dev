import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { LayoutGrid, User, FolderKanban, Music, Contact, GraduationCap, Github, ExternalLink, HardDrive } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-white/5 pb-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                            ADMIN PANEL
                        </h1>
                        <p className="text-xs uppercase tracking-widest opacity-50 font-mono">
                            System Management Interface
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 rounded-full border border-red-500/30 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                        Terminal Shutdown
                    </button>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Dashboard Manager - NEW */}
                    <div
                        onClick={() => navigate('/admin/dashboard')}
                        className="group p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer space-y-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LayoutGrid size={24} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Dashboard</h2>
                            <p className="text-[10px] opacity-50 uppercase tracking-widest font-mono">Bento / Socials / Stacks</p>
                        </div>
                    </div>

                    {/* Profile Manager */}
                    <div
                        onClick={() => navigate('/admin/profile')}
                        className="group p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer space-y-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User size={24} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Profile</h2>
                            <p className="text-[10px] opacity-50 uppercase tracking-widest font-mono">Identity / Persona</p>
                        </div>
                    </div>

                    {/* Project Manager */}
                    <div
                        onClick={() => navigate('/admin/projects')}
                        className="group p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer space-y-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FolderKanban size={24} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Projects</h2>
                            <p className="text-[10px] opacity-50 uppercase tracking-widest font-mono">Portfolio / Case Studies</p>
                        </div>
                    </div>

                    {/* Media Center */}
                    <div
                        onClick={() => navigate('/admin/media')}
                        className="group p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer space-y-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <HardDrive size={24} style={{ color: 'rgb(var(--contrast-rgb))' }} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Media</h2>
                            <p className="text-[10px] opacity-50 uppercase tracking-widest font-mono">Assets / Storage</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
