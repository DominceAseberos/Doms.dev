import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiLayout, FiCheckSquare, FiFileText } from 'react-icons/fi';

const AdminLayout = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin/landing', label: 'Landing', icon: <FiLayout /> },
        { path: '/admin/about', label: 'About', icon: <FiFileText /> },
        { path: '/admin/projects', label: 'Projects', icon: <FiCheckSquare /> },
    ];

    return (
        <div className="flex flex-col font-sans selection:bg-[#c8ff3e] selection:text-black">
            {/* Global Admin Navigation Tab Bar */}
            <div className="bg-[#0a0a0a] border-b border-white/5 py-3 px-6 sticky top-0 z-[60] flex items-center justify-center shadow-xl shadow-black/50">
                <div className="flex items-center gap-2 bg-[#161616] p-1.5 rounded-xl border border-white/10">
                    {navItems.map((item) => {
                        // Check if current path matches to highlight tab
                        // Exact match for /admin/projects so /admin/projects/:id doesn't confuse it,
                        // or prefix match
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-[#c8ff3e] text-black shadow-lg shadow-[#c8ff3e]/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {React.cloneElement(item.icon, { size: 14 })}
                                {item.label}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Page Content Rendering Area */}
            <div className="flex-1 w-full bg-[#0e0e0e]">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
