import React from 'react';
import { useAdminStore } from '../../../store/adminStore';

const AdminLoadingOverlay = () => {
    const { isAdminLoading, loadingText } = useAdminStore();

    if (!isAdminLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 selection:bg-none pointer-events-auto backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-6">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] animate-pulse text-primary font-mono">
                    {loadingText}
                </p>
                <div className="flex space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    );
};

export default AdminLoadingOverlay;
