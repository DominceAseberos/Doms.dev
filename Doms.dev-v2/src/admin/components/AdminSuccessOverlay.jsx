import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@admin/store/adminStore';

const AdminSuccessOverlay = () => {
    const { notification } = useAdminStore();

    if (!notification) return null;

    const isError = notification.type === 'error';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

            {/* Content */}
            <div className="relative z-10 animate-in fade-in zoom-in-95 duration-300">
                <div className={`bg-[#0f0f0f] border ${isError ? 'border-red-500/20' : 'border-white/10'} rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl max-w-sm mx-4 text-center`}>
                    <div className={`w-16 h-16 rounded-full ${isError ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'} flex items-center justify-center`}>
                        {isError ? <AlertCircle size={32} strokeWidth={3} /> : <CheckCircle size={32} strokeWidth={3} />}
                    </div>

                    <div className="space-y-2">
                        <h3 className={`text-xl font-black uppercase italic tracking-tighter ${isError ? 'text-red-500' : 'text-white'}`}>
                            {isError ? 'Systems Failure' : 'Success'}
                        </h3>
                        <p className="text-xs text-white/60 font-mono tracking-wide uppercase leading-relaxed">
                            {notification.message}
                        </p>
                    </div>

                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${isError ? 'bg-red-500' : 'bg-green-500'} animate-[progress_3s_linear_forwards]`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSuccessOverlay;
