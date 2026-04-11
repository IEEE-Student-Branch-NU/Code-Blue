import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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
        return t.includes('fpga') || t.includes('lambda genie') || t.includes('lg') || t.includes('promptverse') || t.includes('itss') || t.includes('transportation') || t.includes('ideathon') || t.includes('hire') || t.includes('agent');
    };

    const handleCardClick = (title) => {
        const t = title.toLowerCase();
        if (t.includes('fpga')) setSelectedAlbum('fpga');
        else if (t.includes('lambda genie') || t.includes('lg')) setSelectedAlbum('lg');
        else if (t.includes('promptverse')) setSelectedAlbum('promptverse');
        else if (t.includes('itss') || t.includes('transportation')) setSelectedAlbum('itss');
        else if (t.includes('ideathon')) setSelectedAlbum('ideathon');
        else if (t.includes('hire') || t.includes('agent')) setSelectedAlbum('hireagent');
    };

    const activeAlbum = albumData[selectedAlbum];

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white', paddingTop: '8rem' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 min-h-[70vh]">
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
                                className="text-center mb-16"
                            >
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4">
                                    Carnival <span className="text-[#ff69b4]">Highlights</span>
                                </h1>
                                <p className="text-xl md:text-2xl font-light text-gray-400">
                                    A glimpse into the spectacular IEEE Carnival 2026
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {finalImages.map((imgData, index) => (
                                    <motion.div 
                                        key={index}
                                        onClick={() => handleCardClick(imgData.title)}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        className="relative group rounded-2xl overflow-hidden border-4 border-gray-800 shadow-[8px_8px_0px_#1a1a1a] bg-gray-900 cursor-pointer"
                                    >
                                        <img 
                                            src={imgData.src} 
                                            alt={imgData.title} 
                                            className="w-full h-auto aspect-[4/3] object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                            <div className="p-6 w-full flex justify-between items-center">
                                                <h3 className="text-white text-xl font-black uppercase tracking-wider">{imgData.title}</h3>
                                                {requiresAlbum(imgData.title) && (
                                                    <span className="bg-[#ff69b4] text-black text-xs font-black px-2 py-1 rounded uppercase tracking-widest">
                                                        View Album
                                                    </span>
                                                )}
                                            </div>
                                        </div>
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
                                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors group"
                                >
                                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#ff69b4]">{activeAlbum.title}</h2>
                                    <p className="text-gray-400 font-mono text-sm tracking-widest mt-1">{activeAlbum.subtitle}</p>
                                </div>
                            </div>

                            {/* CSS Bento Grid Layout */}
                            <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-none md:grid-rows-2 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
                                {activeAlbum.images.map((src, idx) => {
                                    let spanClass = "";
                                    if (idx === 0) spanClass = "col-span-2 md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-1";
                                    else if (idx === 1) spanClass = "col-span-1 md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-1";
                                    else if (idx === 2) spanClass = "col-span-1 md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-1";
                                    else if (idx === 3) spanClass = "col-span-1 md:col-start-1 md:col-span-1 md:row-start-2 md:row-span-1";
                                    else if (idx === 4) spanClass = "col-span-1 md:col-start-2 md:col-span-1 md:row-start-2 md:row-span-1";

                                    return (
                                        <div 
                                            key={idx} 
                                            className={`${spanClass} rounded-xl overflow-hidden border-2 border-gray-800 shadow-[6px_6px_0px_#1a1a1a] bg-gray-900 group`}
                                        >
                                            <img 
                                                src={src} 
                                                alt={`${activeAlbum.title} Memory ${idx + 1}`} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                loading="lazy"
                                            />
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
