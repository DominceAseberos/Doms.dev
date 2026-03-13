import React from 'react';
import { Link } from 'react-router-dom';
import useLoadingStore from '../store/useLoadingStore';
import AnimatedNavBarLogo from './AnimatedNavBarLogo';

const NavBar = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);

    return (
        <nav className={`transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="nav-logo translate-y-[4px]">
                <Link to="/"><AnimatedNavBarLogo className="w-12 h-12" /></Link>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Work</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/lab">Lab</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;
