import React from 'react';
import useLoadingStore from '../store/useLoadingStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    // Fix: the store uses 'isLoading', not 'loading'
    const isLoading = useLoadingStore((state) => state.isLoading);

    return (
        <nav className={`transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="nav-logo translate-y-[4px]">
                <AnimatedNavBarLogo className="w-12 h-12" />
            </div>
            <ul className="nav-links">
                <li><a href="#">Work</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Lab</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    );
};

export default NavBar;
