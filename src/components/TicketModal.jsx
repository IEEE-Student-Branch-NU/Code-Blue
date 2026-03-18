import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Ticket } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, eventTitle, eventDate, posterImg, eventId }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const ticketRef = useRef(null);

  // Generate a pseudo-random hash for the QR pattern based on time/event
  const dayEventsHash = (parseInt(eventId) || 0) + 123;

  const handleDownload = useCallback(() => {
    if (ticketRef.current === null) return;
    setIsGenerating(true);
    
    // Give it a tiny delay to ensure heavy layout/fonts are ready
    setTimeout(() => {
      toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `IEEE-Carnival-${eventTitle.replace(/\s+/g, '-')}-Ticket.png`;
          link.href = dataUrl;
          link.click();
          setIsGenerating(false);
        })
        .catch((err) => {
          console.error('Oops, something went wrong!', err);
          setIsGenerating(false);
        });
    }, 100);
  }, [ticketRef, eventTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white border-4 border-black shadow-[16px_16px_0px_black] rounded-[2rem] overflow-hidden flex flex-col items-center p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Build Your Ticket! 🎟️</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Personalize your attendee post & share the hype on WhatsApp/Instagram!
          </p>
        </div>

        {/* Input Field */}
        <div className="w-full mb-10 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-gray-400">Enter Your Name</label>
          <input 
            type="text" 
            placeholder="Jane Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_black] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none font-black text-lg bg-[#fafafa]"
          />
        </div>

        {/* Ticket Canvas (What will be downloaded) */}
        <div className="w-full flex justify-center mb-8 pb-4">
          <div 
            ref={ticketRef}
            className="w-[360px] aspect-[10/16] bg-white border-[6px] border-black shadow-[20px_20px_0px_rgba(0,0,0,0.9)] rounded-[2.8rem] relative overflow-hidden flex flex-col items-center"
          >
            {/* Holographic Overlays & Texture */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')` }}></div>
            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.08] bg-gradient-to-tr from-[#D656F6] via-transparent to-[#BAE1FF]"></div>
            
            {/* Top Pattern Header */}
            <div className="w-full h-14 bg-black flex items-center justify-between px-8 relative z-20">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] leading-none">IEEE SB NIRMA</span>
              <div className="flex gap-1.5">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D656F6]"></div>)}
              </div>
            </div>

            {/* Event Header Section */}
            <div className="w-full p-8 flex flex-col items-center text-center relative z-20">
              <div className="w-24 h-24 rounded-full border-4 border-black bg-white mb-5 flex items-center justify-center shadow-[6px_6px_0px_black] rotate-[-7deg] relative group">
                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D656F6] to-[#BAE1FF] opacity-10"></div>
                 <Ticket className="w-12 h-12 text-black relative z-10" />
              </div>
              <h3 className="text-4xl font-black uppercase leading-[0.85] tracking-tighter mb-4 break-words max-w-[280px] drop-shadow-[2px_2px_0px_#A7F3D0]">
                {eventTitle}
              </h3>
              <div className="px-5 py-2 rounded-xl border-[3px] border-black bg-[#FEF3C7] shadow-[4px_4px_0px_black] -rotate-1">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none block">NIRMA CAMPUS • MARCH 2026</span>
              </div>
            </div>

            {/* Poster Slice (Cinematic) */}
            <div className="w-full h-36 border-y-[6px] border-black relative overflow-hidden bg-gray-900 z-20">
              <img src={posterImg} alt="Event" className="w-full h-full object-cover grayscale-[30%] contrast-[1.1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-8">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                   <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{eventDate}</p>
                </div>
              </div>
            </div>

            {/* Personalization Section */}
            <div className="w-full p-8 flex-grow flex flex-col items-center justify-center relative z-20">
              <div className="w-full relative py-10 border-[4px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0px_#BAE1FF] -rotate-1 scale-[1.02]">
                <span className="absolute -top-4 left-8 px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg skew-x-[-10deg]">VALIDATED PASS</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-center block mb-2">Participant Identity</span>
                <span className="text-4xl font-black uppercase tracking-tighter text-center block px-6 truncate leading-none mb-1">
                  {name || 'ANONYMOUS'}
                </span>
                <div className="mt-6 flex flex-col items-center">
                   <div className="px-4 py-1.5 bg-[#D656F6] text-white border-2 border-black rounded-lg shadow-[3px_3px_0px_black] rotate-[2deg]">
                      <span className="text-[11px] font-black uppercase leading-none tracking-widest">VIP ACCESS GRANTED</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: QR & Authentication */}
            <div className="w-full bg-white border-t-[6px] border-black p-6 flex items-center gap-6 justify-between relative z-20">
               <div className="flex flex-col gap-1 items-start text-left">
                  <span className="text-[10px] font-black opacity-20 uppercase tracking-[0.3em] leading-none mb-1">Authenticity</span>
                  <div className="text-lg font-black uppercase leading-none tracking-tighter">ADMIT ONE • 🎟️</div>
                  <div className="flex gap-1 mt-2">
                     {[...Array(8)].map((_, i) => <div key={i} className="w-3 h-1 bg-black opacity-10"></div>)}
                  </div>
               </div>

               {/* Stylized QR Passcode */}
               <div className="w-20 h-20 bg-white border-[4px] border-black p-1.5 shadow-[6px_6px_0px_#A7F3D0] relative overflow-hidden group">
                  <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-0.5 animate-pulse">
                     {[...Array(25)].map((_, i) => (
                       <div key={i} className={`rounded-[1px] ${(i*13 + (dayEventsHash || 0)) % 3 === 0 ? 'bg-black' : 'bg-transparent'}`}></div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Ticket Notches (Deeper / More defined) */}
            <div className="absolute left-0 top-[23.5rem] -translate-x-1/2 w-12 h-12 rounded-full border-[6px] border-black bg-[#f8f0ff] z-30 shadow-inner"></div>
            <div className="absolute right-0 top-[23.5rem] translate-x-1/2 w-12 h-12 rounded-full border-[6px] border-black bg-[#f8f0ff] z-30 shadow-inner"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-4">
          <button 
            onClick={handleDownload}
            disabled={!name || isGenerating}
            className="flex-grow flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.4)] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-[8px_8px_0px_#A7F3D0]"
          >
            {isGenerating ? 'Generating...' : <><Download className="w-5 h-5" /> Generate VIP Pass</>}
          </button>
          <button className="flex items-center justify-center w-20 bg-[#BAE1FF] border-4 border-black rounded-[1.5rem] hover:bg-[#A3D1F3] transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <p className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center max-w-xs leading-relaxed">
          The download works best on modern browsers. You can also screenshot your customized ticket above!
        </p>

      </div>
    </div>
  );
};

export default TicketModal;
