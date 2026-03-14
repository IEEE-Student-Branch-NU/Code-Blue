import React, { useState } from 'react';
import './Carnival.css';
import CarnivalHero from '../components/CarnivalHero';
import Footer from './Footer';

const Carnival = () => {
  const [activeTab, setActiveTab] = useState(27);

  // Data structure mapped directly from your wireframe
  const scheduleData = {
    27: { label: '27th', color: 'blue', posters: [1, 2, 3, 4] },
    28: { label: '28th', color: 'green', posters: [5, 6, 7, 8] },
    29: { label: '29th', color: 'yellow', posters: [9, 10, 11, 12] },
  };

  return (
    <div className="carnival-page bg-[#0b0c10] min-h-screen text-white font-sans">
      
      {/* 1. Hero Section (Top) */}
      <CarnivalHero />

      {/* Main Content Container */}
      <main className="carnival-main-content max-w-5xl mx-auto px-4 py-8 flex flex-col gap-12 relative z-10 w-full">
        
        {/* 2. Information Section */}
        <section className="info-section glass-panel">
          <h2 className="text-center text-3xl font-black mb-6 tracking-widest text-[#F22C8D] uppercase">
            The Extraordinary Awaits
          </h2>
          <p className="text-center text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            Welcome to the IEEE Carnival. Experience a dazzling fusion of technology, innovation, and entertainment. 
            Join us for three unforgettable days featuring exclusive technical workshops, 
            immersive networking events, and spectacular nighttime celebrations. 
            Step right up, the future is now.
          </p>
        </section>

        {/* 3. Schedule Section */}
        <section className="schedule-section glass-panel">
          <h3 className="text-center text-2xl font-bold mb-8 uppercase tracking-[0.2em] text-gray-400">
            Schedule
          </h3>
          
          {/* Tabs matching the wireframe (Blue, Green, Yellow) */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {[27, 28, 29].map((day) => (
              <button
                key={day}
                onClick={() => setActiveTab(day)}
                className={`schedule-tab font-bold text-xl md:text-2xl px-10 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${activeTab === day ? `active-${scheduleData[day].color}` : 'inactive-tab'}`}
              >
                {scheduleData[day].label}
              </button>
            ))}
          </div>

          {/* 4. Posters Grid (2x2 layout per the wireframe) */}
          <div className="posters-grid grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {scheduleData[activeTab].posters.map((posterNum, idx) => (
              <div 
                key={posterNum} 
                className="poster-card relative group rounded-2xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
              >
                {/* Stunning gradient hover glow matching the pinks of the carnival */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F22C8D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Foreground textual content */}
                <div className="text-center z-10 p-6">
                  <h4 className="text-3xl font-black text-white mb-2 tracking-wide drop-shadow-md">
                    Poster {idx + 1}
                  </h4>
                  <p className="text-[#ff99cc] font-mono tracking-widest uppercase text-sm drop-shadow-md">
                    Coming Soon
                  </p>
                </div>
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
