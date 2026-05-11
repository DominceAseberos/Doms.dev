import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/Home/index';
import ProjectsPage from './pages/Projects/index';
import ProjectDetailsPage from './pages/Projects/components/ProjectDetailsPage';
import AboutPage from './pages/About/index';
import ContactPage from './pages/Contact/index';
import NotFoundPage from './pages/NotFound/index';

const AdminLayout = import.meta.env.DEV ? lazy(() => import('./pages/admin/AdminLayout')) : null;
const LandingEditor = import.meta.env.DEV ? lazy(() => import('./pages/admin/LandingEditor')) : null;
const AboutEditor = import.meta.env.DEV ? lazy(() => import('./pages/admin/AboutEditor')) : null;
const ProjectEditor = import.meta.env.DEV ? lazy(() => import('./pages/admin/ProjectEditor')) : null;

import GlobalLoader from './components/GlobalLoader';
import useLoadingStore from './store/useLoadingStore';
import useThemeStore from './store/useThemeStore';
import { HelmetProvider, Helmet } from 'react-helmet-async';

function InitialLoadTiming() {
  const location = useLocation();
  const setLoading = useLoadingStore((state: { setLoading: (value: boolean) => void }) => state.setLoading);

  useEffect(() => {
    const ms = location.pathname === '/' ? 500 : 1000;
    const timer = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return null;
}

function App() {
  const initTheme = useThemeStore((state: { initTheme: () => void }) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <HelmetProvider>
      <Router>
        <InitialLoadTiming />
        <Helmet>
          <title>Domince Aseberos - Portfolio</title>
          <meta name="description" content="Domince Aseberos - Selected Work and Portfolio." />
        </Helmet>
        <GlobalLoader />
        <div className="nav-hover-zone" aria-hidden="true" />
        <div id="smooth-wrapper" className="min-h-screen selection:bg-red-500/30">
          <div id="smooth-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
              {import.meta.env.DEV && AdminLayout && (
                <Route path="/admin" element={<Suspense fallback={null}><AdminLayout /></Suspense>}>
                  <Route index element={<Navigate to="/admin/landing" replace />} />
                  {LandingEditor && <Route path="landing" element={<Suspense fallback={null}><LandingEditor /></Suspense>} />}
                  {AboutEditor && <Route path="about" element={<Suspense fallback={null}><AboutEditor /></Suspense>} />}
                  {ProjectEditor && <Route path="projects" element={<Suspense fallback={null}><ProjectEditor /></Suspense>} />}
                </Route>
              )}
              {import.meta.env.DEV && ProjectEditor && (
                <Route path="/admin/projects/:projectId" element={<ProjectDetailsPage isAdmin={true} />} />
              )}
            </Routes>
          </div>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
