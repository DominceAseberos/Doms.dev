import React, { Suspense } from 'react';
import AdminLoadingOverlay from './AdminLoadingOverlay';
import AdminSuccessOverlay from './AdminSuccessOverlay';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout selection:bg-white/20 min-h-screen bg-[#0a0a0a]">
            <AdminLoadingOverlay />
            <AdminSuccessOverlay />
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                    <p className="text-[10px] uppercase tracking-widest opacity-20 animate-pulse font-mono">
                        Initializing Environment..
                    </p>
                </div>
            }>
                {children}
            </Suspense>
        </div>
    );
};

export default AdminLayout;
