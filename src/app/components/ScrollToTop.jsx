import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component that scrolls the window to top on every route change.
 * Place this inside the <Router> but outside <Routes>.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
