import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield, Key, Bell, ShieldCheck } from 'lucide-react';

import strings from '../../config/adminStrings.json';

const ProfileManager = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="space-y-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        {strings.common.backToAdmin}
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {strings.profile.titlePrefix} <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">{strings.profile.titleSuffix}</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    <div className="p-8 rounded-[2rem] bg-[#0f0f0f] border border-white/5 space-y-6 admin-modal-gradient">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <User size={24} className="opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Public Signature</h2>
                            <p className="text-xs opacity-40 leading-relaxed font-inter">Update your name, occupation, and about me summary that appears on the public grid.</p>
                        </div>
                        <div className="pt-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 rounded-full opacity-30 border border-white/5">Locked Protocol</span>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-[#0f0f0f] border border-white/5 space-y-6 admin-modal-gradient">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Security Core</h2>
                            <p className="text-xs opacity-40 leading-relaxed font-inter">Manage your encrypted login credentials and authentication sessions.</p>
                        </div>
                        <div className="pt-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">Active Encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileManager;
