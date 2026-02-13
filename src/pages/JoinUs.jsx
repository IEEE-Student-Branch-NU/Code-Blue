import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Footer from '../components/Footer';
import Lanyard from '../components/Lanyard';

const JoinUs = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.reveal-text', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power4.out',
            });
            gsap.from('.reveal-card', {
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                delay: 0.5,
                ease: 'back.out(1.7)',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white relative">

            {/* Top Navigation Bar / Branding */}
            <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#003366] to-[#001f3f] pb-32 pt-10 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Join IEEE</h1>
                    <p className="text-blue-200 text-sm md:text-base tracking-wide">Advancing Technology for Humanity</p>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 pt-48 pb-20 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">

                        {/* Left Content */}
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Your IEEE<br />
                                <span className="text-[#0088dd]">Membership</span>
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
                                Join the world's largest technical professional organization. Access exclusive resources, connect with experts worldwide, and advance your career in technology.
                            </p>
                            <button
                                onClick={() => window.open('https://www.ieee.org/membership/join/index.html', '_blank')}
                                className="px-8 py-4 bg-[#00629b] hover:bg-[#005080] text-white font-bold rounded-lg transition-all shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5"
                            >
                                Become a Member
                            </button>
                        </div>

                        <div className="relative h-full min-h-[400px] flex justify-center lg:justify-start lg:pl-20">
                            <div className="hidden lg:block absolute -top-[330px] left-[50%] -translate-x-1/2 z-50">
                                <Lanyard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Join Section */}
            <div className="bg-black py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Join IEEE?</h2>
                        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: 'Global Network', desc: 'Connect with over 400,000 members in more than 160 countries.', icon: '🌍' },
                            { title: 'Technical Resources', desc: 'Get access to industry-leading journals, conferences, and digital libraries.', icon: '📚' },
                            { title: 'Career Growth', desc: 'Exclusive access to job boards, mentoring, and professional certifications.', icon: '🚀' },
                            { title: 'Community', desc: 'Participate in local chapter activities, workshops, and hackathons.', icon: '🤝' }
                        ].map((benefit, i) => (
                            <div key={i} className="p-8 rounded-none bg-white/5 border border-white/10 hover:border-[#00629b]/50 hover:bg-white/10 transition-all group">
                                <div className="text-4xl mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#0088dd] transition-colors">{benefit.title}</h3>
                                <p className="text-gray-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-0">
                <Footer />
            </div>
        </div>
    );
};

export default JoinUs;
