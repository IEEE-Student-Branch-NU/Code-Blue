import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carnival.css';
import CarnivalHero from '../components/CarnivalHero';
import Footer from './Footer';

const Carnival = () => {
  const [activeTab, setActiveTab] = useState(27);
  const navigate = useNavigate();

  // Data structure mapped directly from your wireframe
  const scheduleData = {
    27: { 
      label: '27th', 
      color: 'blue', 
      posters: [
        { id: 1, img: '/Carnival/ITSS.webp', title: 'ITSS' },
        { id: 2, img: '/Carnival/LUMISENSE.webp', title: 'Lumisense' }
      ] 
    },
    28: { 
      label: '28th', 
      color: 'green', 
      posters: [
        { id: 5, img: '/Carnival/FGPA WS.webp', title: 'FGPA WS' },
        { id: 6, img: '/Carnival/DECODE THE CIRCUIT_FORGED IN WIRES.webp', title: 'Decode the Circuit' },
        { id: 7, img: '/Carnival/AGENTVERSE.webp', title: 'Agentverse' },
        { id: 8, img: '/Carnival/LAMBDA-GENIE.webp', title: 'Lambda Genie' },
        { id: 13, img: '/Carnival/2.webp', title: 'Poster 5' }
      ] 
    },
    29: { 
      label: '29th', 
      color: 'yellow', 
      posters: [
        { id: 9, img: '/Carnival/FGPA WS.webp', title: 'FGPA WS' },
        { id: 10, img: '/Carnival/ROBOWARS.webp', title: 'Robowars' },
        { id: 11, img: '/Carnival/HIRE_YR_RESEARCH_AGENT.webp', title: 'Hire Your Research Agent' },
        { id: 12, img: '/Carnival/BOT-TALKS.webp', title: 'Bot Talks' }
      ] 
    },
  };

  return (
    <div className="carnival-page min-h-screen text-[#1a1a1a] font-sans">
      
      {/* 1. Hero Section (Top) */}
      <CarnivalHero />

      {/* Main Content Container */}
      <main className="carnival-main-content w-full max-w-[1400px] mx-auto px-4 md:px-12 py-6 md:py-12 flex flex-col gap-8 md:gap-12 relative z-10">
        
        {/* 2. Information Section */}
        <section className="info-section neo-panel">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-black mb-6 tracking-[0.1em] md:tracking-widest text-white uppercase bg-[#ff6b6b] border-2 md:border-4 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] inline-block px-4 md:px-6 py-2 rotate-[-1deg] mx-auto flex w-fit">
            The Extraordinary Awaits
          </h2>
          <p className="text-center text-lg md:text-xl text-gray-800 font-bold leading-relaxed max-w-4xl mx-auto mt-4">
            Welcome to the IEEE Carnival. Experience a dazzling fusion of technology, innovation, and entertainment. 
            Join us for three unforgettable days featuring exclusive technical workshops, 
            immersive networking events, and spectacular nighttime celebrations. 
            Step right up, the future is now.
          </p>
        </section>

        {/* 3. Schedule Section */}
        <section className="schedule-section neo-panel">
          <div className="text-center mb-6 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#1a1a1a] border-b-2 md:border-b-4 border-[#1a1a1a] inline-block pb-1 md:pb-2">
              Schedule
            </h3>
          </div>
          
          {/* Tabs matching the wireframe (Blue, Green, Yellow) */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-8 mb-8 md:mb-12">
            {[27, 28, 29].map((day) => (
              <button
                key={day}
                onClick={() => setActiveTab(day)}
                className={`schedule-tab font-black text-lg md:text-2xl px-6 py-2 md:px-10 md:py-3 ${activeTab === day ? `active-${scheduleData[day].color}` : 'inactive-tab'}`}
              >
                {scheduleData[day].label}
              </button>
            ))}
          </div>

          {/* 4. Posters Grid (2x2 layout per the wireframe) */}
          <div className="posters-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full mx-auto">
            {scheduleData[activeTab].posters.map((poster, idx) => (
              <div 
                key={poster.id} 
                onClick={() => navigate(`/carnival/${poster.id}`)}
                className="poster-card relative group aspect-[1/1.414] overflow-hidden flex flex-col items-center justify-center cursor-pointer"
              >
                {poster.img ? (
                  <img 
                    src={poster.img} 
                    alt={poster.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  /* Foreground textual content */
                  <div className="text-center z-10 p-4 md:p-6">
                    <h4 className="text-2xl md:text-4xl font-black text-[#1a1a1a] mb-2 tracking-wide uppercase">
                      {poster.title}
                    </h4>
                    <p className="text-gray-800 font-bold tracking-wider md:tracking-widest uppercase text-sm md:text-lg bg-white border-2 border-black inline-block px-2 py-1 md:px-3 shadow-[2px_2px_0px_#1a1a1a] transform -rotate-2">
                      Coming Soon
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 5. Footer (Bottom) */}
      <Footer />
    </div>
  );
};

export default Carnival;
