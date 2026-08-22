import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import StaggeredMenu from './components/StaggeredMenu'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import BoardMembers from './pages/BoardMembers'
import JoinUs from './pages/JoinUs'
import { Analytics } from "@vercel/analytics/react"
import CyberGateTransition from './components/CyberGateTransition'
import OdysseyGate from './components/OdysseyGate'
import TechnodysseyStrip from './components/TechnodysseyStrip'
import NotFound from './pages/NotFound'

const CodeBlue = React.lazy(() => import('./pages/CodeBlue'))
const CarnivalGallery = React.lazy(() => import('./pages/CarnivalGallery'))
const Technodyssey = React.lazy(() => import('./pages/Technodyssey'))

/* The two full-screen experiences stay uninterrupted. Home keeps the
 * bar but holds it back until the fest hero has scrolled away. */
const noFestStrip = ['/carnival-gallery', '/code-blue', '/technodyssey'];

const menuItems = [
  { label: "Home", link: "/" },
  { label: "Technodyssey", link: "/technodyssey" },
  { label: "About", link: "/about" },
  { label: "Join Us", link: "/join-us" },
  { label: "Contact", link: "/contact" },
  { label: "Board Members", link: "/board-members" },
  { label: "Gallery", link: "/gallery" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/ieeenirma" },
  { label: "LinkedIn", link: "https://www.linkedin.com/company/ieee-student-branch-nirma-university" },
];

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOdyssey, setIsOdyssey] = useState(false);

  const targetPathRef = useRef('/carnival-gallery');
  const odysseyTargetRef = useRef('/technodyssey');

  useEffect(() => {
    const handleTransition = (e) => {
      if (e.detail && e.detail.path) {
        targetPathRef.current = e.detail.path;
      } else {
        targetPathRef.current = '/carnival-gallery';
      }
      setIsTransitioning(prev => {
        if (!prev) return true;
        return prev;
      });
    };
    window.addEventListener('start-carnival-transition', handleTransition);
    return () => window.removeEventListener('start-carnival-transition', handleTransition);
  }, []);

  const handleGateClosed = useCallback(() => {
    navigate(targetPathRef.current);
  }, [navigate]);

  const handleComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  useEffect(() => {
    const handleOdyssey = (e) => {
      odysseyTargetRef.current = (e.detail && e.detail.path) || '/technodyssey';
      setIsOdyssey(prev => prev || true);
    };
    window.addEventListener('start-odyssey-transition', handleOdyssey);
    return () => window.removeEventListener('start-odyssey-transition', handleOdyssey);
  }, []);

  const handleOdysseyClosed = useCallback(() => {
    navigate(odysseyTargetRef.current);
    window.scrollTo(0, 0);
  }, [navigate]);

  const handleOdysseyComplete = useCallback(() => {
    setIsOdyssey(false);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative' }}>
      <Analytics />

      {/* Persistent Global Transition - Covers route changes */}
      <CyberGateTransition
        trigger={isTransitioning}
        onGateClosed={handleGateClosed}
        onComplete={handleComplete}
      />
      <OdysseyGate
        trigger={isOdyssey}
        onGateClosed={handleOdysseyClosed}
        onComplete={handleOdysseyComplete}
      />

      {/* StaggeredMenu Navigation */}
      <StaggeredMenu
        ref={menuRef}
        items={menuItems}
        socialItems={socialItems}
        colors={['#00629b', '#004d7a']}
        accentColor="#00629b"
        isFixed={true}
        position="right"
        displaySocials={true}
        displayItemNumbering={true}
        logoUrl=""
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
      />

      {/* Routes Wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/board-members" element={<BoardMembers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/code-blue" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
                <CodeBlue />
              </Suspense>
            } />
            <Route path="/carnival-gallery" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
                <CarnivalGallery />
              </Suspense>
            } />
            <Route path="/technodyssey" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#05070d' }} />}>
                <Technodyssey />
              </Suspense>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Outside the routes wrapper so it survives navigation rather
          than remounting — and animating — on every page change. */}
      {!noFestStrip.includes(location.pathname) && (
        <TechnodysseyStrip
          /* Remount only when crossing between Home and the rest, which
             is exactly where the reveal rule changes. Moving between two
             ordinary pages leaves the bar alone. */
          key={location.pathname === '/' ? 'home' : 'rest'}
          revealAfterHero={location.pathname === '/'}
        />
      )}
    </div>
  )
}

export default App
