import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Globe,
    Book,
    Briefcase,
    Users,
    UserPlus,
    ShieldCheck,
    CreditCard,
    MapPin,
    ArrowRight
} from 'lucide-react';
import Footer from '../components/Footer';
import Squares from '../components/Backgrounds/Squares/Squares';

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ question, answer, index, isOpen, onToggle }) => {
    const containerRef = useRef(null);
    const itemRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (isOpen) {
            gsap.to(containerRef.current, {
                height: 'auto',
                duration: 0.4,
                ease: 'power3.out',
                opacity: 1
            });
        } else {
            gsap.to(containerRef.current, {
                height: 0,
                duration: 0.3,
                ease: 'power3.in',
                opacity: 0
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const trigger = ScrollTrigger.create({
            trigger: itemRef.current,
            start: "top bottom",
            end: "bottom top",
            onLeave: () => {
                if (isOpen) onToggle(null);
            },
            onLeaveBack: () => {
                if (isOpen) onToggle(null);
            }
        });

        return () => trigger.kill();
    }, [isOpen, onToggle]);

    return (
        <div
            ref={itemRef}
            className="border-t border-white/20 overflow-hidden"
            onMouseEnter={() => onToggle(index)}
        >
            <div
                className={`w-full flex items-center justify-between p-8 md:p-12 transition-all duration-500 group cursor-default ${isOpen ? 'bg-brand-blue text-black' : ''}`}
            >
                <div className="flex items-center gap-6">
                    <span className={`font-mono transition-colors ${isOpen ? 'text-black' : 'text-brand-blue'}`}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-left">{question}</h3>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </div>
            <div
                ref={containerRef}
                className="overflow-hidden bg-white text-black h-0 opacity-0"
            >
                <div className="pl-24 pr-12 pb-12 pt-4">
                    <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const JoinUs = () => {
    const containerRef = useRef(null);
    const [openFAQIndex, setOpenFAQIndex] = useState(null);

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
                    start: 'top 95%',
                    toggleActions: 'play none none none'
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
        { title: 'Global Network', desc: 'Connect with over 400,000 members in more than 160 countries.', icon: Globe },
        { title: 'Technical Resources', desc: 'Get access to industry-leading journals, conferences, and digital libraries.', icon: Book },
        { title: 'Career Growth', desc: 'Exclusive access to job boards, mentoring, and professional certifications.', icon: Briefcase },
        { title: 'Community', desc: 'Participate in local chapter activities, workshops, and hackathons.', icon: Users }
    ];

    const steps = [
        { title: 'Create Account', desc: 'Visit the official IEEE website and set up your professional profile.' },
        { title: 'Select Membership', desc: 'Choose between Student, Professional, or Preferred Grade based on your status.' },
        { title: 'Finalize & Pay', desc: 'Complete the payment process and instantly access your exclusive benefits.' },
        { title: 'Welcome Home', desc: 'Connect with your local IEEE SBNU branch and start your journey.' }
    ];

    const faqs = [
        { q: "What are the membership fees?", a: "Student membership typically ranges from $14-$25 depending on location and available promotions. It's an investment in your technical future." },
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

            <div className="relative z-10 pt-32 pb-20 max-w-[1800px] mx-auto px-6 sm:px-8 md:px-12">

                {/* Hero section */}
                <div className="mb-32">
                    <div className="reveal-text">
                        <h1 className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter text-white uppercase">
                            Join
                        </h1>
                        <h1 className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter uppercase ml-[5vw] md:ml-20 hollow-text-white-soft">
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
                                className="group relative px-10 py-5 bg-[#111] border-[3px] border-white shadow-[4px_4px_0px_#5eb8ff] text-white font-black uppercase tracking-widest text-lg hover:border-brand-blue hover:text-brand-blue hover:shadow-[8px_8px_0px_#5eb8ff] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-200"
                                style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                            >
                                Become a Member
                            </button>
                        </div>

                        <div className="text-left lg:text-right reveal-text w-full lg:w-auto mt-8 lg:mt-0">
                            <p className="text-brand-blue font-mono text-sm tracking-[0.5em] uppercase whitespace-nowrap">/// CORE NETWORK</p>
                            <div className="mt-4 flex flex-col items-start lg:items-end gap-2">
                                <span className="text-4xl font-black italic">400K+</span>
                                <span className="text-xs font-mono text-gray-400">GLOBAL MEMBERS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="py-24 border-t border-white/20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-none uppercase">
                            Why <br /> <span className="hollow-text">Join?</span>
                        </h2>
                        <div className="text-left md:text-right">
                            <p className="text-brand-blue font-mono text-sm tracking-widest whitespace-nowrap">/// PERKS OF MEMBERSHIP</p>
                        </div>
                    </div>

                    <div className="benefits-grid grid grid-cols-1 md:grid-cols-2 gap-12 pr-2 md:pr-0">
                        {benefits.map((benefit, i) => (
                            <div key={i}
                                className="reveal-card relative group"
                            >
                                <div className="p-10 md:p-12 bg-[#111] border-[3px] border-white shadow-[8px_8px_0px_#5eb8ff] hover:shadow-[12px_12px_0px_white] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white border-[3px] border-black flex items-center justify-center z-20 group-hover:bg-brand-blue group-hover:scale-110 transition-all duration-300">
                                        <benefit.icon size={24} className="text-black" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter group-hover:text-brand-blue transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <div className="w-16 h-1 bg-brand-blue group-hover:w-full transition-all duration-500 mb-6"></div>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium transition-colors group-hover:text-white/80">
                                        {benefit.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Membership Journey (Timeline) */}
                <div className="py-24 border-t border-white/20 roadmap-container">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-none uppercase">
                            Your <br /> <span className="hollow-text">Journey</span>
                        </h2>
                        <p className="text-brand-blue max-w-md font-mono text-sm uppercase whitespace-nowrap">/// FOUR STEPS TO SUCCESS</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pr-2 md:pr-0">
                        {steps.map((step, i) => (
                            <div key={i}
                                className="roadmap-step relative group"
                            >
                                <div className="p-8 h-full bg-[#111] border-[3px] border-white shadow-[6px_6px_0px_#5eb8ff] group-hover:shadow-[10px_10px_0px_white] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white border-[3px] border-black flex items-center justify-center z-20 group-hover:bg-brand-blue group-hover:scale-110 transition-all duration-300">
                                        <span className="text-xl font-black text-black">0{i + 1}</span>
                                    </div>

                                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-white group-hover:text-brand-blue transition-colors">
                                        {step.title}
                                    </h3>

                                    <div className="w-12 h-1 bg-brand-blue mb-6 group-hover:w-full transition-all duration-500"></div>

                                    <p className="text-gray-400 text-sm leading-relaxed font-medium transition-colors group-hover:text-white/80">
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
                            FAQ<span className="text-brand-blue">s</span>
                        </h2>
                        <p className="text-brand-blue font-mono text-sm mt-4 tracking-widest uppercase whitespace-nowrap">/// COMMONLY ASKED QUESTIONS</p>
                    </div>

                    <div
                        className="border-b border-white/20"
                        onMouseLeave={() => setOpenFAQIndex(null)}
                    >
                        {faqs.map((faq, i) => (
                            <FAQItem
                                key={i}
                                question={faq.q}
                                answer={faq.a}
                                index={i}
                                isOpen={openFAQIndex === i}
                                onToggle={setOpenFAQIndex}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default JoinUs;
