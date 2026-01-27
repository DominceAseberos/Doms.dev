import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

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

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                        <h2 className="text-xl font-bold">Profile Manager</h2>
                        <p className="text-xs opacity-50">Edit your name, bio, and live status.</p>
                        <div className="pt-4">
                            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/10 rounded-full opacity-50">Coming Soon</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                        <h2 className="text-xl font-bold">Project Manager</h2>
                        <p className="text-xs opacity-50">Add, move, or delete portfolio projects.</p>
                        <div className="pt-4">
                            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/10 rounded-full opacity-50">Coming Soon</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4 opacity-50">
                        <h2 className="text-xl font-bold">Media Center</h2>
                        <p className="text-xs">Manage project assets and optimizations.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
