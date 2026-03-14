import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useLoadingStore from '../store/useLoadingStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const location = useLocation();
    const currentPath = location.pathname;
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <nav className={`transition-opacity duration-1000 ease-in-out ${isScrolled ? 'nav-scrolled' : ''} ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="nav-logo">
                <Link to="/" className="nav-link" aria-label="Go to home page">
                    <AnimatedNavBarLogo className="w-12 h-12" />
                </Link>
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
