import React, { useEffect, useState } from 'react';
import useLoadingStore from '../store/useLoadingStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const [currentPath, setCurrentPath] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

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
        { label: 'Contact', to: '/contact' }
    ];

    const renderLink = (to, label) => {
        const isActive = currentPath === to;
        return (
            <a
                href={to}
                className={`nav-link${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={isActive ? (e) => e.preventDefault() : undefined}
                tabIndex={isActive ? -1 : undefined}
            >
                {label}
            </a>
        );
    };

    return (
        <nav className={`main-nav transition-opacity duration-1000 ease-in-out ${isScrolled ? 'nav-scrolled' : ''} ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="nav-logo">
                <a href="/" className="nav-link" aria-label="Go to home page">
                    <AnimatedNavBarLogo className="w-9 h-9 md:w-12 md:h-12" />
                </a>
            </div>
            <div className="nav-right">
                <ul className="nav-links">
                    {navItems.map((item) => (
                        <li key={item.to}>{renderLink(item.to, item.label)}</li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
