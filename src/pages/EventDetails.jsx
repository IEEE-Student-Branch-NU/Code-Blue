import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Undo2, Users, Ticket } from 'lucide-react';
import { getEventById } from '../data/carnivalData';
import TicketModal from '../components/TicketModal';

// Global events data with registration links
const allEvents = [
  { id: 1, title: 'Next Gen ITSS', link: 'https://konfhub.com/next-gen-intelligent-transportation-systems-expert-lecture' },
  { id: 2, title: 'Lumisense', link: 'https://konfhub.com/photonic-sensors-as-a-sustainable-technology-for-humanitarian-solutions' },
  { id: 5, title: 'FPGA FORGE', link: 'https://konfhub.com/fpga-forge' },
  { id: 9, title: 'FPGA FORGE', link: 'https://konfhub.com/fpga-forge' },
  { id: 6, title: 'Forged in Wire', link: 'https://konfhub.com/forged-in-wire' },
  { id: 7, title: 'Swarm Agentic AI', link: 'https://konfhub.com/swarm-agentic-ai' },
  { id: 8, title: 'Lambda Genie', link: 'https://konfhub.com/lambda-genie' },
  { id: 13, title: 'Prompt Verse', link: 'https://konfhub.com/prompt-verse-challenge' },
  { id: 14, title: 'Ideathon', link: 'https://konfhub.com/ideathon-open-innovation' },
  { id: 10, title: 'ROBOSUMO', link: 'https://konfhub.com/robosumo-competition' },
  { id: 11, title: 'Hire Your Research Agent', link: 'https://konfhub.com/hire-your-first-research-agent' },
  { id: 12, title: 'Bot Talks', link: 'https://konfhub.com/bot-talks' }
];

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const handleBack = () => {
    const fromTab = location.state?.fromTab;
    if (fromTab) {
      navigate(`/carnival?tab=${fromTab}`);
    } else {
      navigate('/carnival');
    }
  };

  // Dynamic Social Proof
  const regCount = Math.floor(75 + (parseInt(eventId) * 12.5) % 150);
  const seatsLeft = Math.max(5, Math.floor(40 - (parseInt(eventId) * 3.7) % 35));

  // Find the matching event
  const fullEventData = getEventById(eventId) || {};
  const matchingEventLink = allEvents.find(e => e.id === parseInt(eventId));
  
  const currentEvent = {
    ...fullEventData,
    link: matchingEventLink?.link || '#'
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
      
      {/* 🔙 COMPACT BACK BUTTON (Responsive Neo-Brutalist) */}
      <button 
        onClick={handleBack}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-[100] bg-white border-[3px] md:border-4 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] md:shadow-[10px_10px_0px_#1a1a1a] p-2.5 md:p-4 rounded-xl md:rounded-2xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[14px_14px_0px_#1a1a1a] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all group flex items-center justify-center cursor-pointer"
      >
        <Undo2 className="text-[#1a1a1a] group-hover:scale-110 transition-transform w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
      </button>

      {/* Main Grid Wrapper */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mt-6 md:mt-0 px-4 md:px-10 h-full">
        
        {/* Left Side: Poster (Wider but controlled height) */}
        <div className="w-full flex justify-center md:justify-end items-center">
          <div className="w-full max-w-[420px] lg:max-w-[480px] aspect-[1132/1600] bg-white border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] rounded-[2rem] flex flex-col items-center justify-center overflow-hidden transition-all hover:scale-[1.01] hover:shadow-[12px_12px_0px_#BAE1FF]">
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
        <div className="flex flex-col gap-4 md:gap-5 w-full max-w-[550px] mx-auto md:mx-0 justify-center">
          
          {/* Top Panel: Event Details (White/Glassmorphism block) */}
          <div className="flex-grow bg-white border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] rounded-[2rem] p-5 md:p-6 lg:p-8 flex flex-col items-start transition-all hover:shadow-[12px_12px_0px_#D656F6]">
            
            <div className="inline-block bg-[#D656F6] text-white border-2 border-black px-4 py-1 font-black text-sm uppercase self-start rotate-[-2deg] shadow-[4px_4px_0px_black] mb-6">
              Official IEEE Carnival Event
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black uppercase mb-6 tracking-tighter leading-[1] text-[#1a1a1a]">
              {currentEvent ? currentEvent.title : fullEventData?.title || 'Event Details'}
            </h1>
            
            <div className="flex flex-col gap-5 w-full">
              <div className="flex items-center gap-4 bg-[#fdf2f8] border-[2.5px] border-black p-3.5 shadow-[4px_4px_0px_black] rounded-xl w-full">
                <div className="bg-[#fbcfe8] border-2 border-black p-1.5 rounded-lg text-lg">📅</div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Date</span>
                  <span className="text-lg md:text-xl font-black leading-none">{fullEventData?.date || "April 3rd"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#eff6ff] border-[2.5px] border-black p-3.5 shadow-[4px_4px_0px_black] rounded-xl w-full">
                <div className="bg-[#bfdbfe] border-2 border-black p-1.5 rounded-lg text-lg">⏰</div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Time</span>
                  <span className="text-lg md:text-xl font-black leading-none">{fullEventData?.time || "TBD"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#f0fdf4] border-[2.5px] border-black p-3.5 shadow-[4px_4px_0px_black] rounded-xl w-full">
                <div className="bg-[#bbf7d0] border-2 border-black p-1.5 rounded-lg text-lg">📍</div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Location</span>
                  <span className="text-lg md:text-xl font-black leading-none">Nirma University Campus</span>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-8 text-left">
              <span className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1 leading-none">About</span>
              <p className="text-lg font-medium text-gray-700 leading-snug max-w-xl">
                {fullEventData?.description || "Get ready for an immersive experience at IEEE Carnival."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Bottom Panel: Register Button (Black) */}
            <button 
              onClick={() => currentEvent?.link && currentEvent.link !== '#' ? window.open(currentEvent.link, '_blank') : null}
              className="flex-grow bg-[#1a1a1a] text-white py-6 rounded-2xl font-black text-xl md:text-2xl tracking-widest hover:bg-[#333] hover:scale-[1.02] active:scale-95 transition-all shadow-[8px_8px_0px_#A7F3D0] relative overflow-hidden group cursor-pointer"
            >
              <span className="relative z-10">{currentEvent?.link && currentEvent.link !== '#' ? 'REGISTER NOW' : 'COMING SOON'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
            </button>

            {/* Delegate Post Generator Button (Pink Action) */}
            <button 
              onClick={() => setIsTicketModalOpen(true)}
              className="flex-shrink-0 flex items-center justify-center gap-4 bg-[#D656F6] text-white px-8 py-6 rounded-2xl font-[1000] uppercase tracking-widest text-sm hover:scale-[1.05] transition-all shadow-[8px_8px_0px_black] border-[3px] border-black group active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              <Ticket className="w-6 h-6 group-hover:rotate-12 transition-transform text-white fill-current" />
              <span className="block italic">GENERATE POST 🚀</span>
            </button>
          </div>
          
        </div>
      </div>

      <TicketModal 
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        eventTitle={currentEvent?.title || "Carnival Event"}
        eventDate={fullEventData?.date || "April 2026"}
        posterImg={currentEvent?.img}
        eventId={eventId}
      />

    </div>
  );
};

export default EventDetails;
