import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { scheduleData } from '../data/carnivalData';

// Extract unique images from scheduleData
const uniqueImages = [];
const seenImages = new Set();
for (const day in scheduleData) {
  scheduleData[day].events.forEach(event => {
    if (event.img && !seenImages.has(event.img)) {
      seenImages.add(event.img);
      uniqueImages.push({ src: event.img, title: event.title });
    }
  });
}

// Remove RoboSumo
const finalImages = uniqueImages.filter(img => !img.title.toLowerCase().includes('robosumo'));

const albumData = {
    'fpga': {
        title: 'FPGA Forge',
        subtitle: 'Exclusive Workshop Gallery',
        images: ['/Docs/FPGA2.webp', '/Docs/FPGA1.webp', '/Docs/FPGA3.webp', '/Docs/FPGA4.webp', '/Docs/FPGA5.webp']
    },
    'lg': {
        title: 'Lambda Genie',
        subtitle: 'Serverless Architecture Gallery',
        images: ['/Docs/LG1.webp', '/Docs/LG2.webp', '/Docs/LG3.webp', '/Docs/LG4.webp', '/Docs/LG5.webp']
    },
    'promptverse': {
        title: 'PromptVerse',
        subtitle: 'Prompt Engineering Highlights',
        images: ['/Docs/PROMPTVERSE1.webp', '/Docs/PROMPTVERSE2.webp', '/Docs/PROMPTVERSE3.webp', '/Docs/PROMPTVERSE4.webp', '/Docs/PROMPTVERSE5.webp']
    },
    'itss': {
        title: 'Next-Gen ITSS',
        subtitle: 'Transportation Systems Highlights',
        images: ['/Docs/ITSS3.webp', '/Docs/ITSS2.webp', '/Docs/ITSS1.webp', '/Docs/ITSS4.webp', '/Docs/ITSS5.webp']
    },
    'ideathon': {
        title: 'Ideathon',
        subtitle: 'Innovation Challenge Gallery',
        images: ['/Docs/IDEATHON1.webp', '/Docs/IDEATHON2.webp', '/Docs/IDEATHON3.webp', '/Docs/IDEATHON4.webp', '/Docs/IDEATHON5.webp']
    },
    'hireagent': {
        title: 'Hire Your Research Agent',
        subtitle: 'Autonomous AI Session Highlights',
        images: ['/Docs/HIREAGENT1.webp', '/Docs/HIREAGENT2.webp', '/Docs/HIREAGENT3.webp', '/Docs/HIREAGENT4.webp', '/Docs/HIREAGENT5.webp']
    }
};

const CarnivalGallery = () => {
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const requiresAlbum = (title) => {
        const t = title.toLowerCase();
        return t.includes('fpga') || t.includes('lambda genie') || t.includes('lg') || t.includes('promptverse') || t.includes('itss') || t.includes('transportation') || t.includes('ideathon') || t.includes('hire your research');
    };

    const handleCardClick = (title) => {
        const t = title.toLowerCase();
        if (t.includes('fpga')) setSelectedAlbum('fpga');
        else if (t.includes('lambda genie') || t.includes('lg')) setSelectedAlbum('lg');
        else if (t.includes('promptverse')) setSelectedAlbum('promptverse');
        else if (t.includes('itss') || t.includes('transportation')) setSelectedAlbum('itss');
        else if (t.includes('ideathon')) setSelectedAlbum('ideathon');
        else if (t.includes('hire your research')) setSelectedAlbum('hireagent');
    };

    const activeAlbum = albumData[selectedAlbum];

    return (
        <div style={{ 
            backgroundColor: '#f0f9ff', 
            minHeight: '100vh', 
            color: '#1a1a1a', 
            paddingTop: '8rem',
            backgroundImage: `
              radial-gradient(at 0% 0%, rgba(147, 197, 253, 0.25) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(254, 249, 195, 0.35) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(167, 243, 208, 0.25) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgba(191, 219, 254, 0.3) 0px, transparent 50%),
              linear-gradient(rgba(147, 197, 253, 0.1) 2px, transparent 2px),
              linear-gradient(90deg, rgba(147, 197, 253, 0.1) 2px, transparent 2px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px'
        }}>
            <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16 min-h-[70vh]">
                <AnimatePresence mode="wait">
                    {!selectedAlbum ? (
                        <motion.div
                            key="main-gallery"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                        >
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="mb-16"
                            >
                                <Link to="/gallery" className="inline-flex items-center gap-3 bg-white hover:bg-[#FFD700] text-black font-black uppercase tracking-widest px-6 py-3 rounded-full border-[3px] border-black shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all group mb-8">
                                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                                    <span>Back to Gallery</span>
                                </Link>

                                <div className="text-center">
                                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-[#1a1a1a] mb-4 italic">
                                        Carnival <span className="text-[#D656F6] underline decoration-black decoration-8 underline-offset-8">Highlights</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl font-black uppercase tracking-widest text-[#1a1a1a]/60">
                                        A glimpse into the spectacular IEEE Carnival 2026
                                    </p>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                                {finalImages.map((imgData, index) => (
                                    <motion.div 
                                        key={index}
                                        onClick={() => handleCardClick(imgData.title)}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.4 }}
                                        className="relative group rounded-[2.5rem] overflow-hidden border-[4px] border-black shadow-[8px_8px_0px_black] hover:shadow-[12px_12px_0px_black] transition-all bg-white cursor-pointer aspect-[3/4.2]"
                                    >
                                        <img 
                                            src={imgData.src} 
                                            alt={imgData.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {requiresAlbum(imgData.title) && (
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#FFD700] text-black text-xs md:text-sm font-black px-6 py-3 rounded-full border-[3px] border-black uppercase tracking-widest shadow-[4px_4px_0px_black] z-10 transition-all group-active:translate-y-1 group-active:shadow-none flex items-center whitespace-nowrap">
                                                View Album
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="album-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="flex items-center gap-6 mb-12">
                                <button 
                                    onClick={() => setSelectedAlbum(null)}
                                    className="flex items-center gap-3 bg-[#FFD700] hover:bg-[#D656F6] text-black font-black uppercase tracking-widest px-6 py-3 md:px-8 md:py-4 rounded-full border-[3px] border-black shadow-[6px_6px_0px_black] hover:shadow-[10px_10px_0px_black] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all group"
                                >
                                    <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" strokeWidth={3} />
                                    <span>Back to Gallery</span>
                                </button>
                                <div>
                                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a]">{activeAlbum.title}</h2>
                                    <p className="text-[#1a1a1a]/60 font-black uppercase tracking-widest mt-1 text-sm md:text-lg">{activeAlbum.subtitle}</p>
                                </div>
                            </div>

                             <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                {activeAlbum.images.map((src, idx) => {
                                    const filename = src.split('/').pop().split('\\').pop();
                                    
                                    // Final perfect mathematical mapping of sideways images:
                                    // ITSS1, ITSS3, IDEATHON1 all point Left natively -> Need CW
                                    const needsCW = ['ITSS3.webp', 'ITSS1.webp', 'IDEATHON1.webp'].includes(filename);

                                    
                                    // IDEATHON5 is natively upright (0 deg).
                                    // IDEATHON4 points Right natively -> Needs CCW
                                    const needsCCW = ['IDEATHON4.webp'].includes(filename);


                                    return (
                                        <div 
                                            key={idx} 
                                            className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-[4px] border-black shadow-[8px_8px_0px_black] bg-white group break-inside-avoid relative"
                                        >
                                            {needsCW ? (
                                                <div className="relative w-full aspect-[3/4]">
                                                    <img 
                                                        src={src} 
                                                        alt={`${activeAlbum.title} Memory ${idx + 1}`} 
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.45] scale-[1.35] rotate-90" 
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : needsCCW ? (
                                                <div className="relative w-full aspect-[3/4]">
                                                    <img 
                                                        src={src} 
                                                        alt={`${activeAlbum.title} Memory ${idx + 1}`} 
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.45] scale-[1.35] -rotate-90"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : (
                                                // Normal images (Horizontal group photos, naturally upright portraits, etc.)
                                                <img 
                                                    src={src} 
                                                    alt={`${activeAlbum.title} Memory ${idx + 1}`} 
                                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 block" 
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </div>
    );
};

export default CarnivalGallery;
