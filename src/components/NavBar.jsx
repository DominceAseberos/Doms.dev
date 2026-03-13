import React from 'react';
import { useLocation } from 'react-router-dom';
import useLoadingStore from '../store/useLoadingStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { label: 'Projects', to: '/projects' },
        { label: 'About', to: '/about' },
        { label: 'Lab', to: '/lab' },
        { label: 'Contact', to: '/contact' }
    ];

    const renderLink = (to, label) => {
        const isActive = currentPath === to;
        const commonProps = {
            className: `nav-link${isActive ? ' active' : ''}`,
            ...(isActive
                ? {
                      'aria-current': 'page',
                      onClick: (e) => e.preventDefault(),
                      tabIndex: -1
                  }
                : {
                      href: to,
                      target: '_blank',
                      rel: 'noopener noreferrer'
                  })
        };

        return <a {...commonProps}>{label}</a>;
    };

    return (
        <nav className={`transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="nav-logo translate-y-[4px]">
                {renderLink('/projects', <AnimatedNavBarLogo className="w-12 h-12" />)}
            </div>
            <ul className="nav-links">
                {navItems.map((item) => (
                    <li key={item.to}>{renderLink(item.to, item.label)}</li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
