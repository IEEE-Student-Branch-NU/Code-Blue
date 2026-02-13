import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Footer from '../components/Footer';

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
        <div ref={containerRef} className="min-h-screen bg-black text-white pt-32 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h1 className="reveal-text text-5xl md:text-7xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 mb-6 italic">
                        Become a Member
                    </h1>
                    <p className="reveal-text text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                        Join the global community of engineers and tech enthusiasts. Expand your network, enhance your skills, and shape the future of technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Benefits Section */}
                    <div className="space-y-8">
                        <h2 className="reveal-text text-3xl font-bold text-blue-400 uppercase tracking-widest">
                            Why Join IEEE?
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Global Network', desc: 'Connect with over 400,000 members in more than 160 countries.' },
                                { title: 'Technical Resources', desc: 'Get access to industry-leading journals, conferences, and digital libraries.' },
                                { title: 'Career Growth', desc: 'Exclusive access to job boards, mentoring, and professional certifications.' },
                                { title: 'Community', desc: 'Participate in local chapter activities, workshops, and hackathons.' }
                            ].map((benefit, i) => (
                                <div key={i} className="reveal-text border-l-4 border-blue-500 pl-6 py-2 transition-all hover:pl-8 hover:bg-white/5 group">
                                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{benefit.title}</h3>
                                    <p className="text-gray-400 mt-2">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div className="reveal-card bg-[#111] border-2 border-white/10 p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-500"></div>

                        <h3 className="text-3xl font-black uppercase mb-8 leading-tight">
                            Ready to make <br /> an impact?
                        </h3>

                        <p className="text-gray-400 mb-10 text-lg">
                            Take the first step towards a rewarding professional journey. Fill out the membership form and join Code-Blue today.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.open('https://www.ieee.org/membership/join/index.html', '_blank')}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            >
                                Enroll Now
                            </button>
                            <p className="text-center text-gray-500 text-sm italic">
                                *Redirects to official IEEE membership portal
                            </p>
                        </div>

                        {/* Decorative element */}
                        <div className="mt-12 flex justify-between items-center opacity-20 group-hover:opacity-40 transition-opacity">
                            <div className="h-[1px] flex-1 bg-white"></div>
                            <span className="mx-4 text-xs font-mono">IEEE SBNU</span>
                            <div className="h-[1px] flex-1 bg-white"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
};

export default JoinUs;
