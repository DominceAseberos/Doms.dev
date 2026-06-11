import React, { useEffect, useState } from 'react';
import useLoadingStore from '../store/useLoadingStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const [currentPath, setCurrentPath] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            setIsScrolled(currentScrollY > 20);
            
            // Hide on scroll down past 100px, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsHidden(true);
            } else if (currentScrollY < lastScrollY.current) {
                setIsHidden(false);
            }
            
            lastScrollY.current = currentScrollY;
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'About', to: '/about' },
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
        <nav className={`main-nav ${isScrolled ? 'nav-scrolled' : ''} ${isHidden ? 'nav-hidden opacity-0' : 'opacity-100'} ${isLoading ? 'hidden pointer-events-none' : ''}`}>
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
