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
        <nav className={`main-nav transition-opacity duration-1000 ease-in-out ${isScrolled ? 'nav-scrolled' : ''} ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
            </div>
        </nav>
    );
};

export default NavBar;
