import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Undo2 } from 'lucide-react';
import { getEventById } from '../data/carnivalData';

// Global events data with registration links
const allEvents = [
  { id: 1, title: 'Next Gen ITSS', link: 'https://konfhub.com/next-gen-intelligent-transportation-systems-expert-lecture' },
  { id: 2, title: 'Lumisense', link: 'https://konfhub.com/photonic-sensors-as-a-sustainable-technology-for-humanitarian-solutions' },
  { id: 5, title: 'FPGA FORGE', link: 'https://konfhub.com/fpga-forge' },
  { id: 9, title: 'FPGA FORGE', link: 'https://konfhub.com/fpga-forge' },
  { id: 6, title: 'Forged in Wire', link: 'https://konfhub.com/forged-in-wire' },
  { id: 7, title: 'AgentVerse', link: 'https://konfhub.com/swarm-agentic-ai' },
  { id: 8, title: 'Lambda Genie', link: 'https://konfhub.com/lambda-genie' },
  { id: 13, title: 'Prompt Verse', link: 'https://konfhub.com/prompt-verse-challenge' },
  { id: 14, title: 'Ideathon', link: 'https://konfhub.com/ideathon-open-innovation' },
  { id: 10, title: 'ROBOSUMO', link: '#' },
  { id: 11, title: 'Hire Your Research Agent', link: '#' },
  { id: 12, title: 'Bot Talks', link: '#' }
];

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Find the matching event
  const fullEventData = getEventById(eventId) || {};
  const currentEvent = allEvents.find(e => e.id === parseInt(eventId)) || {
    id: parseInt(eventId),
    img: fullEventData.img,
    title: fullEventData.title
  };

  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className="min-h-screen text-[#1a1a1a] p-6 md:p-12 font-sans relative flex items-center justify-center overflow-x-hidden"
      style={{
        backgroundColor: '#f8f0ff', // Soft lavender base
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(214, 86, 246, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(147, 197, 253, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(251, 183, 213, 0.15) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(167, 243, 208, 0.15) 0px, transparent 50%),
          linear-gradient(rgba(214, 86, 246, 0.05) 1.5px, transparent 1.5px),
          linear-gradient(90deg, rgba(214, 86, 246, 0.05) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 50px 50px, 50px 50px'
      }}
    >
      
      {/* 🔙 Back Button Sticking Out */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 md:top-8 md:left-8 z-[100] bg-white border-4 border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] p-4 rounded-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#1a1a1a] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all group flex items-center justify-center cursor-pointer"
      >
        <Undo2 size={32} strokeWidth={3} className="text-[#1a1a1a] group-hover:scale-110 transition-transform" />
      </button>

      {/* Main Grid Wrapper */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 xl:gap-14 mt-16 md:mt-0">
        
        {/* Left Side: Poster (A4 size aspect ratio) */}
        <div className="w-full flex justify-center md:justify-end">
          <div className="w-full max-w-[380px] aspect-[1132/1600] bg-[#ffb3ba] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] rounded-3xl flex flex-col items-center justify-center overflow-hidden transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#1a1a1a]">
            {currentEvent && currentEvent.img ? (
              <img src={currentEvent.img} alt={currentEvent.title} className="w-full h-full object-cover" />
            ) : (
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wide p-8 text-center">
                {currentEvent ? currentEvent.title : `Poster ${eventId}`}
              </h2>
            )}
          </div>
        </div>

        {/* Right Side: Details & Register Stack */}
        <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[500px] mx-auto md:mx-0">
          
          {/* Top Panel: Event Details (White/Glassmorphism block) */}
          <div className="flex-grow bg-white border-4 border-[#1a1a1a] shadow-[10px_10px_0px_#1a1a1a] rounded-3xl p-8 md:p-10 flex flex-col items-start transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[14px_14px_0px_#1a1a1a]">
            
            <div className="inline-block bg-[#D656F6] text-white border-2 border-black px-4 py-1 font-black text-sm uppercase self-start rotate-[-2deg] shadow-[4px_4px_0px_black] mb-6">
              Official IEEE Carnival Event
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black uppercase mb-8 tracking-tighter leading-[1] text-[#1a1a1a]">
              {currentEvent ? currentEvent.title : fullEventData?.title || 'Event Details'}
            </h1>
            
            <div className="flex flex-col gap-5 w-full">
              <div className="flex items-center gap-4 bg-[#fdf2f8] border-[3px] border-black p-4 shadow-[4px_4px_0px_black] rounded-xl w-full">
                <div className="bg-[#fbcfe8] border-2 border-black p-2 rounded-lg text-lg">📅</div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date</span>
                  <span className="text-xl font-black">{fullEventData?.date || "March 27th-29th, 2026"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#eff6ff] border-[3px] border-black p-4 shadow-[4px_4px_0px_black] rounded-xl w-full">
                <div className="bg-[#bfdbfe] border-2 border-black p-2 rounded-lg text-lg">⏰</div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Time</span>
                  <span className="text-xl font-black">{fullEventData?.time || "TBD"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#f0fdf4] border-[3px] border-black p-4 shadow-[4px_4px_0px_black] rounded-xl w-full">
                <div className="bg-[#bbf7d0] border-2 border-black p-2 rounded-lg text-lg">📍</div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</span>
                  <span className="text-xl font-black">Nirma University Campus</span>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="mt-8 text-left">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">About the Event</span>
              <p className="text-lg font-medium text-gray-700 leading-relaxed">
                {fullEventData?.description || "Get ready for an immersive experience at IEEE Carnival. Join us for a day of technical innovation and skill-building."}
              </p>
            </div>
          </div>

          {/* Bottom Panel: Register Button (Black) */}
          <button 
            onClick={() => currentEvent?.link && currentEvent.link !== '#' ? window.open(currentEvent.link, '_blank') : null}
            className="w-full bg-[#1a1a1a] text-white py-6 md:py-8 rounded-2xl md:rounded-3xl font-black text-2xl md:text-3xl tracking-widest hover:bg-[#333] hover:scale-[1.02] active:scale-95 transition-all shadow-[8px_8px_0px_#A7F3D0] relative overflow-hidden group cursor-pointer"
          >
            <span className="relative z-10">{currentEvent?.link && currentEvent.link !== '#' ? 'REGISTER NOW' : 'COMING SOON'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
          </button>
          
        </div>
      </div>

    </div>
  );
};

export default EventDetails;
