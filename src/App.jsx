import React, { Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import StaggeredMenu from './components/StaggeredMenu'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import BoardMembers from './pages/BoardMembers'
import JoinUs from './pages/JoinUs'
import PreLaunch from './pages/PreLaunch'

const CodeBlue = React.lazy(() => import('./pages/CodeBlue'))

const TARGET_DATE = "2026-02-17T20:00:00+05:30";

const menuItems = [
  { label: "Home", link: "/" },
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
  const [isLocked, setIsLocked] = useState(new Date() < new Date(TARGET_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      if (new Date() >= new Date(TARGET_DATE)) {
        setIsLocked(false);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLocked) {
    return <PreLaunch onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', position: 'relative' }}>

      {/* StaggeredMenu Navigation */}
      <StaggeredMenu
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

      {/* Routes */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
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

        </Routes>
      </div>
    </div>
  )
}

export default App

