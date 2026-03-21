import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Undo2, Share2, Zap } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, eventTitle, eventDate, eventId }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const ticketRef = useRef(null);

  const shareText = `🎡 PEAK ENERGY ALERT! I'm officially attending ${eventTitle.toUpperCase()} at IEEE CARNIVAL 2026! 🚀🔋\n\nWitness the tech takeover this April at Nirma University! 🏛️✨\nSecure your spot: https://ieeenirma.org\n\n#IEEECarnival #SBNU #NirmaUniversity #TechChaos`;

  const handleAction = useCallback(async (mode) => {
    if (!ticketRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(ticketRef.current, { 
        quality: 1.0, 
        pixelRatio: 4,
        style: { transform: 'scale(1)', margin: '0' }
      });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `Carnival_Pass_${eventId}.png`, { type: 'image/png' });

      if (mode === 'share') {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'IEEE CARNIVAL 2026',
            text: shareText,
          });
        } else {
          await navigator.clipboard.writeText(shareText);
          const link = document.createElement('a');
          link.download = `IEEE_Carnival_Pass.png`;
          link.href = dataUrl;
          link.click();
          alert("Pass saved! Caption copied to your clipboard. 🎡");
        }
      } else {
        const link = document.createElement('a');
        link.download = `IEEE_Carnival_Pass.png`;
        link.href = dataUrl;
        link.click();
        await navigator.clipboard.writeText(shareText);
        alert("Success! Pass downloaded & caption copied! 🎟️⚡");
      }
    } catch (err) {
      console.error('Action Error:', err);
    } finally { setIsGenerating(false); }
  }, [ticketRef, name, eventTitle, isGenerating, shareText, eventId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl bg-[#D656F6]/30 overflow-y-auto outline-none transition-all duration-300">
      
      <div className="absolute inset-0 z-[-1] bg-black/80"></div>
      
      {/* EXACT CARNIVAL STYLE BACK BUTTON */}
      <button 
        onClick={onClose}
        className="fixed top-6 left-6 md:top-8 md:left-8 w-12 h-12 bg-black border-[3px] border-white flex justify-center items-center hover:bg-[#FFD700] hover:text-black hover:border-black transition-all shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_black] group z-[210] cursor-pointer"
      >
        <Undo2 size={24} className="text-white group-hover:text-black transition-colors" strokeWidth={3} />
      </button>

      <div className="max-w-[480px] w-full flex flex-col gap-6 my-auto pt-20 pb-12 relative animate-fade-in">
        
        <div className="w-full text-center space-y-1">
           <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter drop-shadow-[4px_4px_0px_#D656F6]">DELEGATE PASS</h2>
           <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.5em]">GENERATE YOUR MASTER INVITATION</p>
        </div>

        <div className="w-full px-4 mb-2">
          <input 
            type="text" 
            placeholder="ENTER YOUR NAME..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-5 border-[3px] border-black bg-white text-black placeholder:text-black/30 font-[1000] text-xl uppercase outline-none focus:shadow-[8px_8px_0px_#00E5FF] transition-all rounded-[1rem] text-center shadow-[8px_8px_0px_#D656F6]"
          />
        </div>

        {/* --- THE ULTIMATE CARNIVAL TECH / NEO-BRUTALIST PASS --- */}
        <div className="w-full flex justify-center py-2 relative">
          
          <div 
            ref={ticketRef}
            className="w-full aspect-[4/5] bg-[#F4F4F0] relative overflow-hidden flex flex-col border-[6px] border-black shadow-[16px_16px_0px_#FFD700]"
          >
             {/* Vibrant Minimalist Grid */}
             <div className="absolute inset-0 z-0 opacity-15 bg-[linear-gradient(#000_2px,transparent_2px),linear-gradient(90deg,#000_2px,transparent_2px)] bg-[size:32px_32px]"></div>

             {/* Dynamic Carnival Shapes (Neo-Brutalist) */}
             <div className="absolute top-1/2 left-0 w-full h-[6px] bg-black z-0"></div>
             <div className="absolute top-[-10%] right-[-15%] w-[60%] h-[40%] bg-[#D656F6] rotate-[12deg] border-[6px] border-black z-0"></div>
             <div className="absolute top-[35%] left-[-20%] w-[45%] h-[20%] bg-[#00E5FF] rotate-[-5deg] border-[6px] border-black z-0"></div>

             {/* Pass Content Container */}
             <div className="w-full h-full relative z-10 flex flex-col p-6 sm:p-8">
                
                {/* 1. Official Header (SBNU & IEEE explicitly stated without black gaps) */}
                <div className="w-full z-10 flex border-[6px] border-black shadow-[6px_6px_0px_white] bg-black">
                   <div className="flex-1 bg-black text-white p-3 md:p-4 flex flex-col justify-center items-start">
                      <span className="text-[16px] md:text-[20px] font-[1000] tracking-[0.1em] uppercase italic leading-none block text-[#00E5FF]">IEEE CARNIVAL</span>
                      <span className="text-[9px] font-black tracking-[0.4em] uppercase leading-none mt-1 text-[#FFD700]">OFFICIAL SESSION</span>
                   </div>
                   <div className="w-20 md:w-28 bg-[#FFD700] border-l-[6px] border-black flex items-center justify-center">
                      <span className="text-[16px] font-[1000] tracking-widest text-black">SBNU</span>
                   </div>
                </div>

                {/* 2. Massive Event Highlight */}
                <div className="flex-grow w-full relative z-10 py-6 flex flex-col items-center justify-center overflow-hidden">
                   <div className="inline-block bg-[#FFD700] border-[4px] border-black px-4 py-1.5 shadow-[4px_4px_0px_black] mb-4 transform rotate-[2deg]">
                      <span className="text-[11px] font-black text-black uppercase tracking-[0.4em] leading-none block">CONFIRMED ACCESS FOR</span>
                   </div>
                   {/* Maximize text but allow break words safely */}
                   <h3 className="text-4xl sm:text-5xl lg:text-5xl font-[1000] text-black uppercase tracking-tighter italic leading-[0.85] bg-white border-[6px] border-black p-4 md:p-6 shadow-[10px_10px_0px_#D656F6] rotate-[-2deg] text-center w-[90%] break-words">
                      {eventTitle}
                   </h3>
                </div>

                {/* 3. Refined, Perfectly Scaled Identity Hub */}
                <div className="w-full z-10 border-[6px] border-black bg-white flex flex-col shadow-[12px_12px_0px_rgba(0,0,0,1)] relative mt-4">
                   
                   {/* Small Accent Graphic */}
                   <div className="absolute top-[-20px] right-[-20px] bg-[#D656F6] border-[4px] border-black w-12 h-12 flex items-center justify-center rounded-full shadow-[4px_4px_0px_black] transform rotate-12 z-20">
                      <Zap size={24} className="text-white fill-white" strokeWidth={1.5} />
                   </div>

                   <div className="w-full flex min-h-[100px]">
                      
                      {/* Name Block - Properly Sized Font, Wraps to next line gracefully */}
                      <div className="flex-grow p-4 md:p-6 flex flex-col justify-center bg-[#F4F4F0] max-w-[70%] md:max-w-[75%]">
                         <span className="text-[10px] font-black text-[#D656F6] uppercase tracking-[0.4em] mb-2 block leading-none">/// AUTHORIZED DELEGATE</span>
                         {/* Removed truncate so names line-break naturally. Reduced leading for tight wrapped lines */}
                         <h4 className="font-[1000] text-black uppercase tracking-normal text-2xl md:text-3xl leading-none">
                            {name || 'YOUR NAME'}
                         </h4>
                      </div>
                      
                      {/* Verification Seal Block without Fake Barcodes */}
                      <div className="w-[30%] md:w-[25%] bg-black text-white p-4 border-l-[6px] border-black flex flex-col items-center justify-center relative flex-shrink-0">
                         <Zap size={28} className="text-[#FFD700] fill-[#FFD700] mb-2" strokeWidth={1} />
                         <span className="text-[11px] font-[1000] tracking-widest text-[#FFD700] uppercase text-center">APPROVED</span>
                      </div>

                   </div>

                   {/* Final Institutional Footer Strip */}
                   <div className="w-full bg-[#00E5FF] border-t-[6px] border-black py-3 px-4 md:px-6 flex justify-between items-center text-black">
                      <span className="text-[10px] md:text-[11px] font-[1000] tracking-[0.2em] uppercase italic">NIRMA UNIVERSITY</span>
                      <span className="text-[10px] md:text-[11px] font-[1000] tracking-[0.2em] uppercase block">APRIL 2026</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* NEO-BRUTAL ACTIONS */}
        <div className="w-full grid grid-cols-2 gap-4 px-4 pb-12 mt-2">
            <button 
              disabled={!name || isGenerating}
              onClick={() => handleAction('download')}
              className="bg-white hover:bg-[#00E5FF] text-black border-[4px] border-black py-5 rounded-xl font-[1000] uppercase tracking-[0.2em] text-[12px] transition-all shadow-[6px_6px_0px_black] disabled:opacity-50 active:translate-y-1 active:shadow-[2px_2px_0px_black]"
            >
              SAVE PASS
            </button>
            <button 
              disabled={!name || isGenerating}
              onClick={() => handleAction('share')}
              className="bg-[#FFD700] hover:bg-[#e6c200] text-black border-[4px] border-black py-5 rounded-xl font-[1000] uppercase tracking-[0.2em] text-[12px] transition-all shadow-[8px_8px_0px_#D656F6] disabled:opacity-50 flex items-center justify-center gap-2 group active:translate-y-1 active:shadow-[2px_2px_0px_#D656F6]"
            >
              SHARE PASS <Share2 size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
}

export default TicketModal;
