import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, User, FolderKanban, HardDrive } from 'lucide-react';
import { authService } from '../../services/authService';
import strings from '../../config/adminStrings.json';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex justify-between items-center border-b border-white/5 pb-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
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

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AdminCard
                        onClick={() => navigate('/admin/dashboard')}
                        icon={LayoutGrid}
                        title={strings.hub.cards.dashboard.title}
                        subtitle={strings.hub.cards.dashboard.subtitle}
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/profile')}
                        icon={User}
                        title={strings.hub.cards.identity.title}
                        subtitle={strings.hub.cards.identity.subtitle}
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/projects')}
                        icon={FolderKanban}
                        title={strings.hub.cards.portfolio.title}
                        subtitle={strings.hub.cards.portfolio.subtitle}
                    />

                    <AdminCard
                        onClick={() => navigate('/admin/media')}
                        icon={HardDrive}
                        title={strings.hub.cards.storage.title}
                        subtitle={strings.hub.cards.storage.subtitle}
                    />
                </section>
            </div>
        </div>
    );
};

const AdminCard = ({ onClick, icon: Icon, title, subtitle }) => (
    <div
        onClick={onClick}
        className="group p-8 rounded-2xl border border-white/5 bg-[#0f0f0f] hover:border-primary/40 transition-all cursor-pointer space-y-6 admin-modal-gradient shadow-2xl relative overflow-hidden"
    >
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500 border border-white/5 group-hover:border-primary/30">
            <Icon size={24} className="text-primary opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        </div>
        <div className="space-y-1 relative z-10">
            <h2 className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">{title}</h2>
            <p className="text-[10px] opacity-30 uppercase tracking-[0.15em] font-mono group-hover:opacity-60 transition-opacity">{subtitle}</p>
        </div>
    </div>
);

export default AdminDashboard;
