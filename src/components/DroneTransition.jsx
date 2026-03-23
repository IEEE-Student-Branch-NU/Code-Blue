import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Cpu, Zap, Radio } from 'lucide-react';
import { gsap } from 'gsap';

const DroneTransition = ({ onComplete }) => {
  const [status, setStatus] = useState("INITIALIZING");
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const statuses = ["SCANNING NETWORK", "GATHERING DATA", "AUTHENTICATING", "ACCESS GRANTED"];
    let i = 0;
    const interval = setInterval(() => {
      if (i < statuses.length) setStatus(statuses[i++]);
    }, 400);

    const timer = setTimeout(() => setShowStatus(true), 200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] pointer-events-none overflow-hidden flex items-center justify-center">
      {/* 1. Backdrop Glow - Pulsing Energy */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#000814]/80 backdrop-blur-xl"
      />

      {/* 2. The Drone / Bot */}
      <motion.div
        initial={{ 
          x: '100vw', 
          y: '100vh', 
          rotate: -20,
          scale: 0.5
        }}
        animate={{ 
          x: ['100vw', '0vw', '-100vw'], 
          y: ['100vh', '0vh', '-100vh'],
          rotate: [0, 10, 0],
          scale: [0.5, 3, 0.5]
        }}
        transition={{ 
          duration: 3, 
          times: [0, 0.5, 1],
          ease: "easeInOut" 
        }}
        onAnimationComplete={onComplete}
        className="absolute z-[2002]"
      >
        <div className="relative">
          {/* Main Bot Figure */}
          <div className="p-8 bg-cyan-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm relative">
             <Bot size={80} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
             
             {/* Scanning Radial Wave */}
             <motion.div 
               animate={{ scale: [1, 3], opacity: [0.5, 0] }}
               transition={{ repeat: Infinity, duration: 1 }}
               className="absolute inset-0 border-2 border-cyan-400 rounded-full"
             />

             {/* Small Orbits */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               className="absolute -inset-4 border border-dashed border-cyan-500/30 rounded-full"
             >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-magenta-400 rounded-full shadow-[0_0_10px_#FF00F5]" style={{ backgroundColor: '#FF00F5' }} />
             </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 3. The Digital "Fog" (Grid Reveal) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.5, 1] }}
        className="absolute inset-0 z-[2001] pointer-events-none"
      >
        <div className="grid grid-cols-10 grid-rows-10 w-full h-full opacity-30">
          {[...Array(100)].map((_, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], rotate: [0, 90] }}
               transition={{ 
                 duration: 1.5, 
                 delay: 0.5 + (Math.random() * 1), 
                 repeat: Infinity 
               }}
               className="border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center"
             >
                {Math.random() > 0.8 && <Cpu size={12} className="text-cyan-500/40" />}
                {Math.random() > 0.9 && <span className="text-[6px] text-cyan-400 font-mono">{Math.round(Math.random())}</span>}
             </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4. Center Status UI */}
      <AnimatePresence>
        {showStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="z-[2005] flex flex-col items-center"
          >
             <div className="mb-6 flex gap-8">
                <div className="flex flex-col items-center gap-2">
                   <Radio size={24} className="text-cyan-400 animate-pulse" />
                   <div className="w-1 h-8 bg-cyan-400/20" />
                </div>
                <div className="flex flex-col items-center gap-2">
                   <Zap size={24} className="text-[#FFD700] animate-bounce" />
                   <div className="w-1 h-8 bg-[#FFD700]/20" />
                </div>
             </div>

             <div className="px-10 py-4 bg-black/80 border-t-2 border-b-2 border-cyan-400 backdrop-blur-md relative overflow-hidden group">
                {/* Scan Line effect */}
                <motion.div 
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                />
                
                <h2 className="text-cyan-400 font-mono text-2xl md:text-4xl font-black tracking-[0.2em] relative">
                   {status}
                </h2>
             </div>
             
             <div className="mt-4 flex gap-1">
                {[...Array(20)].map((_, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 4 }}
                     animate={{ height: [4, 12, 4] }}
                     transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                     className="w-1 bg-cyan-400/40"
                   />
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DroneTransition;
