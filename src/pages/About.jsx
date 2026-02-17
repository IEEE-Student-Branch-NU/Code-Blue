import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import ProfileCard from '../components/ProfileCard'
import CircularGallery from '../components/CircularGallery'
import Footer from './Footer'
import Squares from '../components/Backgrounds/Squares/Squares'

const alumniImages = [
    { image: '/Alumini/alay.jpg', text: 'Alay' },
    { image: '/Alumini/chinmay.jpg', text: 'Chinmay' },
    { image: '/Alumini/jaival.png', text: 'Jaival' },
    { image: '/Alumini/kajal.jpg', text: 'Kajal' },
    { image: '/Alumini/khushi-patel.jpg', text: 'Khushi Patel' },
    { image: '/Alumini/khushi-shah.jpg', text: 'Khushi Shah' },
    { image: '/Alumini/lakshin.jpg', text: 'Lakshin' },
    { image: '/Alumini/tanisha.jpg', text: 'Tanisha' },
    { image: '/Alumini/vartika.jpg', text: 'Vartika' },
    { image: '/Alumini/vrushank.jpg', text: 'Vrushank' },
];

const objectivesData = [
    {
        id: "01",
        title: "EVENT MANAGEMENT",
        desc: "Mastering the art of execution. We organize high-impact technical activities, workshops, and seminars, teaching students the logistics of leadership.",
        icon: "📅"
    },
    {
        id: "02",
        title: "TECHNICAL SHOWCASE",
        desc: "A premier platform for innovation. From presenting research papers to demonstrating cutting-edge prototypes, we turn ideas into tangible reality.",
        icon: "🚀"
    },
    {
        id: "03",
        title: "LEADERSHIP LAB",
        desc: "Forging the leaders of tomorrow. We don't just assign roles; we cultivate the essential qualities needed to lead teams and drive initiatives in the industry.",
        icon: "⚡"
    },
    {
        id: "04",
        title: "COLLABORATION",
        desc: "The power of 'We'. Fostering a culture where teamwork, communication, and mutual growth are the bedrock of every project we undertake.",
        icon: "🤝"
    }
];

const ObjectiveStrip = ({ obj, index, hovered, setHovered }) => {
    const isOpen = hovered === index;

    return (
        <motion.div
            className="border-t border-white/20 relative overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setHovered(isOpen ? null : index)}
        >
            {/* Row header */}
            <div className="relative z-10 flex items-center justify-between"
                style={{ padding: 'clamp(1rem, 3vw, 2rem) 0' }}
            >
                <div className="flex items-center gap-4 md:gap-8 min-w-0">
                    <span className="text-sm md:text-lg font-mono text-brand-blue flex-shrink-0" style={{ minWidth: '2rem' }}>
                        {obj.id}
                    </span>
                    <h3 className={`text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter transition-colors duration-300 ${isOpen ? 'text-brand-blue' : 'text-white'}`}
                        style={{ lineHeight: 1.1 }}
                    >
                        {obj.title}
                    </h3>
                </div>

                {/* Plus/Minus toggle */}
                <div className="flex-shrink-0 ml-4" style={{
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                    {isOpen
                        ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eb8ff" strokeWidth="2.5"><path d="M5 12h14" /></svg>
                        : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    }
                </div>
            </div>

            {/* Expandable description */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                            transition: {
                                height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.25, delay: 0.05 }
                            }
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.2 }
                            }
                        }}
                        className="overflow-hidden"
                    >
                        <div style={{ paddingLeft: 'clamp(2.5rem, 5vw, 4.5rem)', paddingBottom: 'clamp(1rem, 2vw, 1.5rem)', paddingRight: '1rem' }}>
                            <p className="text-gray-400 font-medium leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', maxWidth: '600px' }}>
                                {obj.desc}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const About = () => {
    const containerRef = useRef(null);
    const [hoveredObjective, setHoveredObjective] = useState(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-[#5eb8ff] selection:text-black">

            {/* FIXED BACKGROUND */}
            <div className="fixed inset-0 z-0">
                <Squares
                    direction="diagonal"
                    speed={0.15}
                    borderColor="#333"
                    squareSize={50}
                    hoverFillColor="#222"
                />
            </div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 pt-32 md:pt-32 pb-0">

                {/* HERO SECTION */}
                <div className="relative mb-8 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ y: yHero }}
                        className="relative z-10"
                    >
                        <h1 className="text-[18vw] md:text-[14vw] leading-[0.8] font-black tracking-tighter text-white mix-blend-difference">
                            IEEE
                        </h1>
                        <h1 className="text-[18vw] md:text-[14vw] leading-[0.8] font-black tracking-tighter text-brand-blue ml-[10vw] md:ml-32">
                            SBNU
                        </h1>
                    </motion.div>

                    <div className="mt-12 md:mt-24 border-t border-white/20 pt-8 flex flex-col md:flex-row gap-8 justify-between items-start">
                        <div className="max-w-2xl">
                            <p className="text-xl md:text-3xl font-light text-white leading-tight mb-4 md:mb-6">
                                The Student Branch of <span className="text-brand-blue font-bold">Nirma University</span>.
                                Est. 2000.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:gap-12 text-right w-fit ml-auto md:w-auto">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-black text-white">24<span className="text-brand-blue/80">+</span></h3>
                                <p className="text-xs font-mono text-gray-500 uppercase">Years</p>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-4xl font-black text-white">4<span className="text-brand-blue/80">+</span></h3>
                                <p className="text-xs font-mono text-gray-500 uppercase">Depts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UNIQUE OBJECTIVES */}
                <div className="pt-8 md:pt-12 pb-12 md:pb-32 relative">
                    <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h2 className="text-5xl md:text-8xl font-black text-white leading-none">
                            OUR <br /> <span className="blue-text">OBJECTIVES</span>
                        </h2>
                        <div className="text-left md:text-right">
                            <p className="text-brand-blue font-mono text-xs sm:text-sm tracking-widest">/// CORE PRINCIPLES</p>
                        </div>
                    </div>

                    <div className="border-b border-white/20">
                        {objectivesData.map((obj, index) => (
                            <ObjectiveStrip
                                key={obj.id}
                                obj={obj}
                                index={index}
                                hovered={hoveredObjective}
                                setHovered={setHoveredObjective}
                            />
                        ))}
                    </div>
                </div>

                {/* FACULTY SECTION */}
                <div className="full-bleed py-12 md:py-32 border-t border-white/10 bg-[#050505] relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#5eb8ff]/5 to-transparent pointer-events-none"></div>
                    <div className="full-bleed-content">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                                <div className="w-full max-w-[320px] md:max-w-[420px]">
                                    <ProfileCard
                                        name="MANISHA SHAH"
                                        title="FACULTY ADVISOR"
                                        handle="manishashah"
                                        status="MENTOR"
                                        contactText="Connect"
                                        avatarUrl="/manisha-shah-card.png"
                                        miniAvatarUrl="/manisha-shah.png"
                                        showUserInfo
                                        enableTilt={true}
                                        behindGlowEnabled={true}
                                        behindGlowColor="rgba(94,184,255,0.3)"
                                        onContactClick={() => window.open('https://www.linkedin.com/in/manisha-shah-22b94617/', '_blank')}
                                        innerGradient="linear-gradient(135deg, #111 0%, #000 100%)"
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 text-center lg:text-left">
                                <div className="inline-block px-3 py-1 border border-brand-blue/30 rounded-full mb-6">
                                    <p className="text-brand-blue/80 font-mono text-xs tracking-widest uppercase">Leadership</p>
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-none">
                                    DR. MANISHA <br /><span className="blue-text">SHAH</span>
                                </h2>
                                <p className="text-base md:text-xl text-gray-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    "Senior Member, IEEE. Since 2000, she has been the cornerstone of our chapter, guiding students towards technical excellence and professional integrity."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ALUMNI CAROUSEL */}
                <div className="full-bleed py-16 md:py-20 border-t border-white/10 relative overflow-hidden">
                    <div className="full-bleed-content mb-12 text-center">
                        <h2 className="text-4xl md:text-7xl font-black text-white mb-2">
                            OUR <span className="text-brand-blue">ALUMNI</span>
                        </h2>
                    </div>

                    <div className="w-full h-[500px] md:h-[600px] relative">
                        <CircularGallery
                            items={alumniImages}
                            bend={0}
                            textColor="#ffffff"
                            borderRadius={0.05}
                            autoScroll={true}
                            scrollSpeed={0.5}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default About
