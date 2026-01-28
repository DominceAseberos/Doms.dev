import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield, Key, Bell, ShieldCheck } from 'lucide-react';

const ProfileManager = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="space-y-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <ArrowLeft size={14} /> Hub
                    </button>
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        PROFILE <span className="opacity-20 text-white italic font-light">IDENTITY</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <User size={24} className="opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Public Info</h2>
                            <p className="text-sm opacity-40 leading-relaxed text-balance">Update your name, occupation, and about me summary that appears on the main site.</p>
                        </div>
                        <div className="pt-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 rounded-full opacity-30">Module Locked</span>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-green-500">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Security</h2>
                            <p className="text-sm opacity-40 leading-relaxed text-balance">Manage your login credentials and authentication sessions.</p>
                        </div>
                        <div className="pt-4 text-green-500">
                            <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">System Encrypted</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileManager;
