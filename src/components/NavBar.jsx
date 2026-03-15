import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import useLoadingStore from '../store/useLoadingStore';
import useThemeStore from '../store/useThemeStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const location = useLocation();
    const currentPath = location.pathname;
    const [isScrolled, setIsScrolled] = useState(false);
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

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
        return (
            <Link
                to={to}
                className={`nav-link${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={isActive ? (e) => e.preventDefault() : undefined}
                tabIndex={isActive ? -1 : undefined}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav className={`transition-opacity duration-1000 ease-in-out ${isScrolled ? 'nav-scrolled' : ''} ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="nav-logo">
                <Link to="/" className="nav-link" aria-label="Go to home page">
                    <AnimatedNavBarLogo className="w-12 h-12" />
                </Link>
            </div>
            <div className="nav-right">
                <ul className="nav-links">
                    {navItems.map((item) => (
                        <li key={item.to}>{renderLink(item.to, item.label)}</li>
                    ))}
                </ul>
                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                >
                    {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
