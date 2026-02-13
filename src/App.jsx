import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import StaggeredMenu from './components/StaggeredMenu'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import BoardMembers from './pages/BoardMembers'
import JoinUs from './pages/JoinUs'


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
  const location = useLocation();
  const isHome = location.pathname === '/';

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

        </Routes>
      </div>
    </div>
  )
}

export default App

