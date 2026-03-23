import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CyberGateTransition = ({ trigger, onGateClosed, onComplete }) => {
  const leftPlateRef = useRef(null);
  const rightPlateRef = useRef(null);
  const logoRef = useRef(null);
  const overlayRef = useRef(null);
  const scannerRef = useRef(null);
  const runningRef = useRef(false);

  const onGateClosedRef = useRef(onGateClosed);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onGateClosedRef.current = onGateClosed;
    onCompleteRef.current = onComplete;
  }, [onGateClosed, onComplete]);

  useEffect(() => {
    if (!trigger || runningRef.current) return;
    
    runningRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        runningRef.current = false;
        if (onCompleteRef.current) onCompleteRef.current();
      }
    });

    // 1. Initial State
    gsap.set(overlayRef.current, { display: 'flex', opacity: 1, backgroundColor: 'rgba(0,0,0,0)' });
    gsap.set(leftPlateRef.current, { x: '-101%' });
    gsap.set(rightPlateRef.current, { x: '101%' });
    gsap.set(logoRef.current, { scale: 0, opacity: 0 });
    gsap.set(scannerRef.current, { top: '-10%', opacity: 0 });

    // 2. Heavy Gates Shut - Mechanical "Chunk"
    tl.to(overlayRef.current, { backgroundColor: 'rgba(0,0,0,0.8)', duration: 0.1 })
    .to([leftPlateRef.current, rightPlateRef.current], {
      x: '0%',
      duration: 0.5,
      ease: "power4.out",
      force3D: true
    })
    // Bounce / Slam back effect
    .to([leftPlateRef.current, rightPlateRef.current], {
       x: (i) => i === 0 ? '-2%' : '2%',
       duration: 0.1,
       ease: "power2.inOut"
    })
    .to([leftPlateRef.current, rightPlateRef.current], {
       x: '0%',
       duration: 0.1,
       ease: "power2.out"
    })
    
    // 3. Scanner Swipe - "Identifying"
    .to(scannerRef.current, { opacity: 1, duration: 0.2 })
    .to(scannerRef.current, { top: '110%', duration: 0.6, ease: "power1.inOut" })
    .to(scannerRef.current, { opacity: 0, duration: 0.2 })
    
    // 4. Logo Reveal
    .to(logoRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.5)"
    }, "-=0.3")
    
    // TRIGGER ROUTE CHANGE
    .call(() => {
       if (onGateClosedRef.current) onGateClosedRef.current();
    })
    
    // 5. HOLD & Pulse
    .to(logoRef.current, {
       scale: 1.05,
       boxShadow: "0 0 150px rgba(255, 0, 245, 0.8)",
       duration: 0.8,
       repeat: 1,
       yoyo: true,
       ease: "sine.inOut"
    })
    
    // 6. Release & Zoom-Out To Reveal
    .to(logoRef.current, {
      scale: 2.5,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in"
    })
    .to(overlayRef.current, { backgroundColor: '#f0f9ff', duration: 0.4 }, "-=0.3")
    
    // Mechanical Reset (Snappier)
    .to([leftPlateRef.current, rightPlateRef.current], {
      x: (i) => i === 0 ? '-101%' : '101%',
      duration: 0.7,
      ease: "power2.inOut"
    }, "-=0.2")
    
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    })
    .set(overlayRef.current, { display: 'none' });

    return () => {};
  }, [trigger]);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100000] overflow-hidden flex bg-transparent"
      style={{ display: 'none', perspective: '1000px' }}
    >
      {/* SCANNER LINE */}
      <div 
        ref={scannerRef}
        className="absolute left-0 w-full h-[3px] bg-[#FF00F5] shadow-[0_0_20px_#FF00F5,0_0_40px_rgba(255,0,245,0.5)] z-[100002] pointer-events-none"
      />

      {/* LEFT PLATE */}
      <div 
        ref={leftPlateRef} 
        className="w-1/2 h-full bg-[#0a0a0a] border-r-[4px] border-[#FF00F5] relative overflow-hidden"
        style={{ willChange: 'transform' }}
      >
         {/* Subtle industrial pattern */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FF00F5_1px,transparent_1px)] bg-[size:20px_20px]" />
         <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col items-end gap-2 text-[#FF00F5]/10 font-mono text-[10px] uppercase tracking-widest hidden md:flex">
            <span>Sect_ID: Carnival_Ptl</span>
            <span>Auth_Req: [HIGH]</span>
            <div className="w-20 h-1 bg-[#FF00F5]/10" />
         </div>
      </div>

      {/* RIGHT PLATE */}
      <div 
        ref={rightPlateRef} 
        className="w-1/2 h-full bg-[#0a0a0a] border-l-[4px] border-[#FF00F5] relative overflow-hidden"
        style={{ willChange: 'transform' }}
      >
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FF00F5_1px,transparent_1px)] bg-[size:20px_20px]" />
         <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col items-start gap-2 text-[#FF00F5]/10 font-mono text-[10px] uppercase tracking-widest hidden md:flex">
            <span>System_Core: Online</span>
            <span>Status: [LOCKING]</span>
            <div className="w-20 h-1 bg-[#FF00F5]/10" />
         </div>
      </div>
      
      {/* LOGO BOX */}
      <div ref={logoRef} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[100001]">
         <div className="relative p-8 md:p-12 bg-black border-[12px] border-[#FF00F5] flex flex-col items-center justify-center shadow-[0_0_100px_rgba(255,0,245,0.5)] transform-gpu">
            {/* Corner brackets */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-8 border-l-8 border-[#00d2ff]" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-8 border-r-8 border-[#00d2ff]" />
            
            <span className="text-white text-8xl md:text-[11rem] font-black italic tracking-tighter leading-none select-none">IEEE</span>
            <div className="w-[110%] h-[8px] bg-[#FF00F5] mt-4 mb-6 shadow-[0_0_15px_#FF00F5]" />
            
            <div className="flex flex-col items-center justify-center">
               <span className="text-[#00d2ff] font-mono text-xs md:text-lg font-black tracking-[0.7em] uppercase animate-pulse">
                  ACCESS GRANTED
               </span>
               <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-[#FF00F5] rounded-full" />
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CyberGateTransition;
