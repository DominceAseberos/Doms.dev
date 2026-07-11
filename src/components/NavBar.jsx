import React, { useEffect, useState } from 'react';
import useLoadingStore from '../store/useLoadingStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const [currentPath, setCurrentPath] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        const updateStateOnNav = () => {
            if (typeof window !== 'undefined') {
                setCurrentPath(window.location.pathname);
                setIsScrolled(window.scrollY > 20);
                setIsHidden(false);
                setIsMobileMenuOpen(false);
                lastScrollY.current = window.scrollY;
            }
        };
        updateStateOnNav();
        document.addEventListener('astro:page-load', updateStateOnNav);
        return () => document.removeEventListener('astro:page-load', updateStateOnNav);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            setIsScrolled(currentScrollY > 20);
            
            // Hide on scroll down past 100px, show on scroll up (don't hide if mobile menu is open)
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    const navItems = [
        { label: 'Home', to: '/' },
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
                onClick={isActive ? (e) => { e.preventDefault(); setIsMobileMenuOpen(false); } : () => setIsMobileMenuOpen(false)}
                tabIndex={isActive ? -1 : undefined}
            >
                {label}
            </a>
        );
    };

    return (
        <>
            <nav className={`main-nav ${isScrolled ? 'nav-scrolled' : ''} ${isHidden && !isMobileMenuOpen ? 'nav-hidden opacity-0' : 'opacity-100'} ${isLoading ? 'hidden pointer-events-none' : ''}`}>
                <div className="nav-logo">
                    <a href="/" className="nav-link" aria-label="Go to home page">
                        <AnimatedNavBarLogo className="w-9 h-9 md:w-12 md:h-12" />
                    </a>
                </div>
                <div className="nav-right desktop-nav">
                    <ul className="nav-links">
                        {navItems.map((item) => (
                            <li key={item.to}>{renderLink(item.to, item.label)}</li>
                        ))}
                    </ul>
                </div>

                <button 
                    className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <ul className="mobile-nav-links">
                    {navItems.map((item) => (
                        <li key={item.to}>{renderLink(item.to, item.label)}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default NavBar;
