import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Squares from '../components/Backgrounds/Squares/Squares';

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-t border-white/20 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 md:p-12 hover:bg-cyan-500 hover:text-black transition-all duration-300 group"
            >
                <div className="flex items-center gap-6">
                    <span className="font-mono text-cyan-500 group-hover:text-black transition-colors">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-left">{question}</h3>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white text-black pl-24 pr-12 pb-12 pt-4"
                    >
                        <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const JoinUs = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.reveal-text', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power4.out',
            });

            gsap.from('.reveal-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.benefits-grid',
                    start: 'top 85%',
                }
            });

            gsap.from('.roadmap-step', {
                x: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.roadmap-container',
                    start: 'top 80%',
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const benefits = [
        { title: 'Global Network', desc: 'Connect with over 400,000 members in more than 160 countries.', icon: '🌍' },
        { title: 'Technical Resources', desc: 'Get access to industry-leading journals, conferences, and digital libraries.', icon: '📚' },
        { title: 'Career Growth', desc: 'Exclusive access to job boards, mentoring, and professional certifications.', icon: '🚀' },
        { title: 'Community', desc: 'Participate in local chapter activities, workshops, and hackathons.', icon: '🤝' }
    ];

    const steps = [
        { title: 'Create Account', desc: 'Visit the official IEEE website and set up your professional profile.', color: 'cyan' },
        { title: 'Select Membership', desc: 'Choose between Student, Professional, or Preferred Grade based on your status.', color: 'white' },
        { title: 'Finalize & Pay', desc: 'Complete the payment process and instantly access your exclusive benefits.', color: 'cyan' },
        { title: 'Welcome Home', desc: 'Connect with your local IEEE SBNU branch and start your journey.', color: 'white' }
    ];

    const faqs = [
        { q: "What are the membership fees?", a: "Student membership typically ranges from $27-$35 depending on location and available promotions. It's an investment in your technical future." },
        { q: "Can I join IEEE SBNU specifically?", a: "Yes! Once you have your global IEEE membership, you can join Nirma University's student branch to participate in local events, workshops, and networking." },
        { q: "What resources do I get?", a: "You get access to the IEEE Xplore Digital Library, IEEE Spectrum magazine, exclusive webinars, and significant discounts on technical conference registrations." },
        { q: "Is it only for engineers?", a: "While primarily focused on electrical and electronics engineering, IEEE welcomes professionals and students from all technical backgrounds, including computer science and IT." }
    ];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-black text-white selection:bg-[#5eb8ff] selection:text-black">

            {/* Background */}
            <div className="fixed inset-0 z-0">
                <Squares
                    direction="diagonal"
                    speed={0.15}
                    borderColor="#333"
                    squareSize={50}
                    hoverFillColor="#222"
                />
            </div>

            <div className="relative z-10 pt-32 pb-20 max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12">

                {/* Hero section */}
                <div className="mb-32">
                    <div className="reveal-text">
                        <h1 className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter text-white uppercase">
                            Join
                        </h1>
                        <h1 className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter text-transparent uppercase ml-[5vw] md:ml-20"
                            style={{ WebkitTextStroke: "clamp(0.5px, 0.15vw, 2px) rgba(255,255,255,0.8)" }}>
                            The Team
                        </h1>
                    </div>

                    <div className="mt-16 border-t border-white/20 pt-12 flex flex-col lg:flex-row gap-12 justify-between items-start">
                        <div className="max-w-2xl reveal-text">
                            <p className="text-xl md:text-3xl font-light text-white leading-tight mb-8">
                                Become part of the world's largest <span className="text-brand-blue font-bold uppercase underline decoration-2 underline-offset-8">technical community</span>. Advance technology for humanity.
                            </p>
                            <button
                                onClick={() => window.open('https://www.ieee.org/membership/join/index.html', '_blank')}
                                className="group relative px-10 py-5 bg-brand-blue text-black font-black uppercase tracking-widest text-lg hover:bg-white transition-all duration-300"
                                style={{ borderRadius: '0' }}
                            >
                                Become a Member
                                <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-white group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300"></div>
                            </button>
                        </div>

                        <div className="hidden lg:block text-right reveal-text">
                            <p className="text-brand-blue font-mono text-sm tracking-[0.5em] uppercase">/// CORE_NETWORK</p>
                            <div className="mt-4 flex flex-col items-end gap-2">
                                <span className="text-4xl font-black italic">400K+</span>
                                <span className="text-xs font-mono text-gray-400">GLOBAL MEMBERS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="py-24 border-t border-white/20">
                    <div className="flex items-end justify-between mb-16">
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-none uppercase">
                            Why <br /> <span className="text-transparent" style={{ WebkitTextStroke: "clamp(0.5px, 0.1vw, 1px) white" }}>Join?</span>
                        </h2>
                        <div className="hidden md:block text-right">
                            <p className="text-brand-blue font-mono text-sm tracking-widest">/// PERKS_OF_MEMBERSHIP</p>
                        </div>
                    </div>

                    <div className="benefits-grid grid grid-cols-1 md:grid-cols-2 gap-12">
                        {benefits.map((benefit, i) => (
                            <div key={i}
                                className="reveal-card p-10 md:p-12 bg-[#111] border-[3px] border-white shadow-[8px_8px_0px_#5eb8ff] hover:shadow-[12px_12px_0px_white] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="text-5xl mb-8 grayscale group-hover:grayscale-0 transition-all">{benefit.icon}</div>
                                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter group-hover:text-brand-blue transition-colors">
                                    {benefit.title}
                                </h3>
                                <div className="w-16 h-1 bg-brand-blue group-hover:w-full transition-all duration-500 mb-6"></div>
                                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Membership Journey (Timeline) */}
                <div className="py-24 border-t border-white/20 roadmap-container">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-none uppercase">
                            Your <br /> <span className="text-transparent" style={{ WebkitTextStroke: "clamp(0.5px, 0.1vw, 1px) white" }}>Journey</span>
                        </h2>
                        <p className="text-gray-400 max-w-md font-mono text-sm uppercase">/// FOUR_STEPS_TO_SUCCESS</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <div key={i} className="roadmap-step p-1 border-2 border-white/10 hover:border-brand-blue transition-colors group relative h-full">
                                <div className="p-8 h-full bg-[#050505] flex flex-col">
                                    <span className="text-6xl font-black text-white/5 mb-4 group-hover:text-brand-blue/10 transition-colors">0{i + 1}</span>
                                    <h3 className={`text-2xl font-black mb-4 uppercase tracking-tight ${step.color === 'brand-blue' ? 'text-brand-blue' : 'text-white'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mt-auto font-medium">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="py-24 border-t border-white/20">
                    <div className="mb-16">
                        <h2 className="text-5xl md:text-8xl font-black text-white leading-none uppercase">
                            FAQ<span className="text-cyan-500">s</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-sm mt-4 tracking-widest uppercase">/// COMMONLY_ASKED_QUESTIONS</p>
                    </div>

                    <div className="border-b border-white/20">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default JoinUs;
