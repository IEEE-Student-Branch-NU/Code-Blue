import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VariableProximity from '../components/VariableProximity';
import TextScramble from '../components/TextScramble';
import LetterGlitch from '../components/Backgrounds/LetterGlitch/LetterGlitch';
import './CodeBlue.css';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   GLOBAL ERROR BOUNDARY (DEBUGGING AGENT)
   ═══════════════════════════════════════════════════════════════ */
class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("Code Blue Crash:", error, info);
        this.setState({ info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    background: '#000',
                    color: '#ff0040',
                    fontFamily: 'monospace',
                    padding: '2rem',
                    overflow: 'auto',
                    border: '2px solid #ff0040'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>// SYSTEM FAILURE //</h1>
                    <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>ERROR_DETECTED:</h2>
                    <pre style={{ background: '#111', padding: '1rem', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <h2 style={{ fontSize: '1.2rem', color: '#fff', marginTop: '1rem' }}>STACK_TRACE:</h2>
                    <pre style={{ background: '#111', padding: '1rem', marginTop: '0.5rem', whiteSpace: 'pre-wrap', fontSize: '0.8rem', color: '#888' }}>
                        {this.state.info?.componentStack}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const BOARD_MEMBERS = [
    {
        id: 1,
        name: 'Vraj Talati',
        role: 'Technical Head',
        image: '/devTeam/Vraj.jpeg',
        linkedin: 'https://www.linkedin.com/in/vrajtalati/',
        isHead: true,
        stats: ['ARCHITECT', 'FULL_STACK', 'LEADERSHIP'],
        bioTitle: 'FULL STACK LEAD',
        desc: "Leading the technical team and building scalable solutions for the club."
    },
    {
        id: 2,
        name: 'Priyansh Patel',
        role: 'Core Team Lead',
        image: '/devTeam/Priyansh.jpeg',
        linkedin: 'https://www.linkedin.com/in/priyansh-patel-046190264/',
        stats: ['CORE TECH', 'SYSTEMS', 'PERFORMANCE'],
        bioTitle: 'BACKEND & SYSTEMS',
        desc: "Developing backend infrastructure and optimizing system performance."
    },
    {
        id: 3,
        name: 'Yashi Jain',
        role: 'UI/UX Lead',
        image: '/devTeam/Yashi.jpeg',
        linkedin: 'https://www.linkedin.com/in/yashi-jain-511a14372?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
        stats: ['UI/UX', 'FIGMA', 'CREATIVE'],
        bioTitle: 'DESIGN & PROTOTYPING',
        desc: "Designing intuitive user interfaces and enhancing user experiences."
    },
    {
        id: 4,
        name: 'Nandini Rathod',
        role: 'Management Lead',
        image: '/devTeam/Nandini.jpeg',
        linkedin: 'https://www.linkedin.com/in/nandini-rathod-43b18a37a', // Corrected link
        stats: ['MANAGEMENT', 'DESIGN', 'STRATEGY'],
        bioTitle: 'DESIGN & TECH',
        desc: "Coordinating design assets and managing technical implementation."
    },
    {
        id: 5,
        name: 'Sukruti Sheth',
        role: 'Content Lead',
        image: 'https://ui-avatars.com/api/?name=Sukruti+Sheth&background=0D8ABC&color=fff',
        linkedin: 'https://www.linkedin.com/in/sukruti-sheth-805269377?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
        stats: ['CONTENT', 'STRATEGY', 'SOCIALS'],
        bioTitle: 'SOCIALS & STRATEGY',
        desc: "Creating technical content and managing digital strategy."
    },
];

const MARQUEE_TEXT_1 = 'CODE BLUE ◆ INNOVATION ◆ IEEE SBNU ◆ TECHNICAL EXCELLENCE ◆ FULL STACK DEVELOPMENT ◆ PIXEL PERFECT ◆ CLOUD NATIVE ◆ SCALABLE SYSTEMS';
const MARQUEE_TEXT_2 = 'HIGH PERFORMANCE ◆ REACT & NEXT.JS ◆ CODE BLUE ◆ DEPLOYING THE FUTURE ◆ ELITE ENGINEERING ◆ NEXT LEVEL ◆ UNMATCHED QUALITY';

/* ═══════════════════════════════════════════════════════════════
   COMPONENT (WRAPPED IN ERROR BOUNDARY)
   ═══════════════════════════════════════════════════════════════ */
function CodeBlueContent() {
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const heroContentRef = useRef(null);
    const titleWrapRef = useRef(null);
    const taglineRef = useRef(null);
    const scrollCueRef = useRef(null);
    const attitudeTextRef = useRef(null);
    const attitudeSubRef = useRef(null);
    const cardsRef = useRef([]);
    const outroPreRef = useRef(null);
    const outroTitleRef = useRef(null);
    const outroEndRef = useRef(null);
    const impactRef = useRef(null);

    // leader & squad logic
    const leader = BOARD_MEMBERS.find(m => m.isHead);
    const squad = BOARD_MEMBERS.filter(m => !m.isHead);

    // Track when the intro animation is done to enable interactions
    const [introDone, setIntroDone] = useState(false);
    const [proximityRadius, setProximityRadius] = useState(window.innerWidth < 768 ? 100 : 180);

    useEffect(() => {
        const handleResize = () => {
            setProximityRadius(window.innerWidth < 768 ? 100 : 180);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ── Instant Entry Sequence ───────────────────────────────── */
    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setIntroDone(true);
            },
        });

        // 1. Cinematic Bars Open IMMEDIATELY
        tl.to('.cb-cinema-bar', {
            height: '0vh',
            duration: 1.2,
            ease: 'power4.inOut',
            stagger: 0.1
        }, 0);

        // 2. Fade in Hero Content
        tl.to(heroContentRef.current, { opacity: 1, duration: 0.1 }, 0.5);

        // 3. Speed Ramp Title Entry (Slam Effect)
        // CODE from Left
        tl.fromTo('.cb-proximity-title:not(.cb-proximity-title-blue)',
            { x: -800, opacity: 0, scaleX: 3, filter: 'blur(20px)' },
            { x: 0, opacity: 1, scaleX: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power4.out' },
            0.8
        );

        // BLUE from Right
        tl.fromTo('.cb-proximity-title-blue',
            { x: 800, opacity: 0, scaleX: 3, filter: 'blur(20px)' },
            { x: 0, opacity: 1, scaleX: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power4.out' },
            '<+=0.1' // Slight stagger
        );

        // 4. Lightning Strike Effect (Keeping visuals, removing flash)
        tl.fromTo('.cb-lightning-strike',
            { scaleY: 0, opacity: 1, width: 2 },
            { scaleY: 1, opacity: 0, width: 100, duration: 0.3, ease: 'power4.out' },
            '-=0.2'
        );

        // 5. Impact Shake & Glow
        tl.to('.cb-hero-title-wrap', {
            textShadow: '0 0 50px rgba(255, 255, 255, 0.8), 0 0 100px rgba(94, 184, 255, 0.8)',
            filter: 'brightness(1.5)',
            scale: 1.02,
            duration: 0.05,
            ease: 'power2.in',
            onComplete: () => {
                gsap.to('.cb-hero-title-wrap', { x: -5, duration: 0.05, yoyo: true, repeat: 3 });
            }
        }, '-=0.1');

        // 6. Settle
        tl.to('.cb-hero-title-wrap', {
            textShadow: 'none',
            filter: 'brightness(1)',
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        });

        // 7. Show Tagline & HUD
        tl.to(taglineRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3');
        tl.to(scrollCueRef.current, { opacity: 1, duration: 0.5 }, '+=0.2');
        tl.to('.cb-tech-hud', { opacity: 1, duration: 1 }, '-=1');

        return () => tl.kill();
    }, []);

    /* ── Card Tilt Effect & Spotlight ───────────────────────── */
    const handleCardMove = (e, i) => {
        const card = cardsRef.current[i];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg tilt
        const rotateY = ((x - centerX) / centerX) * 15;

        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

        // Spotlight effect
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleCardLeave = (i) => {
        const card = cardsRef.current[i];
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    };

    /* ── Scroll animations ────────────────────────────────────── */
    useEffect(() => {
        if (!introDone) return; // Wait for intro to finish

        /* PERSISTENCE FIX: Force state after intro */
        gsap.set(heroContentRef.current, { opacity: 1 });
        gsap.set('.cb-proximity-title', { opacity: 1, x: 0, scaleX: 1, filter: 'blur(0px)' });
        gsap.set('.cb-proximity-title-blue', { opacity: 1, x: 0, scaleX: 1, filter: 'blur(0px)' });

        const ctx = gsap.context(() => {

            // Marquee animation
            gsap.to('.cb-marquee-track', {
                xPercent: -50,
                repeat: -1,
                duration: 30, // Slower for smoother feel
                ease: 'linear',
            });

            ScrollTrigger.create({
                trigger: '.cb-attitude',
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(attitudeTextRef.current, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
                    gsap.to(attitudeSubRef.current, { opacity: 1, duration: 0.6, delay: 0.4 });
                },
                once: true,
            });

            // Impact Section Animation
            gsap.fromTo(impactRef.current,
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 1, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: impactRef.current,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        scrub: 1
                    }
                }
            );

            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                // Simple Smooth Fade Up (No Snap)
                gsap.set(card, { opacity: 0, y: 50 });

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 90%',
                    onEnter: () => {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: (i % 3) * 0.1, // Stagger based on column position
                            ease: 'power3.out'
                        });
                    },
                    once: true,
                });
            });

            ScrollTrigger.create({
                trigger: '.cb-outro',
                start: 'top 70%',
                onEnter: () => {
                    gsap.to(outroPreRef.current, { opacity: 1, duration: 0.5 });
                    gsap.to(outroTitleRef.current, { opacity: 1, duration: 0.8, delay: 0.3, ease: 'expo.out' });
                    gsap.to(outroEndRef.current, { opacity: 1, duration: 0.5, delay: 0.7 });
                },
                once: true,
            });
        }, pageRef);

        return () => ctx.revert();
    }, [introDone]);

    const renderMarqueeItems = (text) => (
        Array(4).fill(null).map((_, i) => (
            <span key={i} className="cb-marquee-item">
                {text.split(' ').map((word, j) => (
                    <span key={j}>{word === '◆' ? <span className="dot">◆</span> : word + ' '}</span>
                ))}
            </span>
        ))
    );

    return (
        <div className={`cb-page ${introDone ? 'cb-boot-complete' : ''}`} ref={pageRef}>
            {/* ── BACKGROUND: DIGITAL GLITCH MATRIX ── */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.55 }}>
                <LetterGlitch
                    glitchSpeed={50}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                    glitchColors={['#4287f5', '#1a3c75', '#0d1f3d']}
                />
            </div>

            <div className="cb-grain" />

            {/* LIGHTNING STRIKE ELEMENT */}
            <div className="cb-lightning-strike" />

            {/* ── LINE NUMBERS GUTTER ── */}
            <div className="cb-line-numbers">
                {Array(50).fill(0).map((_, i) => (
                    <div key={i} className="cb-line-number">{(i + 1).toString().padStart(2, '0')}</div>
                ))}
            </div>

            {/* ═══════ HERO ═══════ */}
            <section className="cb-hero-section" ref={heroRef} style={{ justifyContent: 'center' }}>

                {/* CINEMATIC BARS */}
                <div className="cb-cinema-bar cb-cinema-bar-top" ref={el => { if (el) el.style.height = '50vh'; }} />
                <div className="cb-cinema-bar cb-cinema-bar-bottom" ref={el => { if (el) el.style.height = '50vh'; }} />

                {/* TECH HUD OVERLAY */}
                <div className="cb-tech-hud">
                    <div className="cb-hud-corner cb-hud-tl"></div>
                    <div className="cb-hud-corner cb-hud-tr"></div>
                    <div className="cb-hud-corner cb-hud-bl"></div>
                    <div className="cb-hud-corner cb-hud-br"></div>
                    <div className="cb-hud-line cb-hud-top"></div>
                    <div className="cb-hud-line cb-hud-bottom"></div>
                    <div className="cb-hud-text cb-hud-status">SYSTEM STATUS: OPTIMAL</div>
                    <div className="cb-hud-text cb-hud-coords">30.7333° N, 76.7794° E</div>
                </div>

                <div className="cb-hero-content" ref={heroContentRef} style={{ opacity: 0 /* Reset to 0 for anim */ }}>

                    {/* VARIABLE PROXIMITY TITLE (Restored) */}
                    <div className="cb-hero-title-wrap" ref={titleWrapRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                        <VariableProximity
                            label="CODE"
                            fromFontVariationSettings="'wght' 200, 'opsz' 8"
                            toFontVariationSettings="'wght' 1000, 'opsz' 80"
                            containerRef={heroRef}
                            radius={proximityRadius}
                            falloff="linear"
                            className="cb-proximity-title"
                        />
                        <VariableProximity
                            label="BLUE"
                            fromFontVariationSettings="'wght' 200, 'opsz' 8"
                            toFontVariationSettings="'wght' 1000, 'opsz' 80"
                            containerRef={heroRef}
                            radius={proximityRadius}
                            falloff="linear"
                            className="cb-proximity-title cb-proximity-title-blue"
                        />
                    </div>

                    <div className="cb-hero-tagline" ref={taglineRef} style={{ opacity: 0 }}>
                        WE DON&apos;T BUILD WEBSITES — WE BUILD EXPERIENCES
                    </div>

                    {/* ADDED HERO DESCRIPTION */}
                    <p className="cb-hero-desc" ref={el => { if (el && introDone) gsap.to(el, { opacity: 1, duration: 1, delay: 0.5 }) }}>
                        // Forging the digital frontier of IEEE SBNU. Code Blue constitutes the elite technical division, engineering the future line by line.
                    </p>
                </div>

                <div className="cb-scroll-cue" ref={scrollCueRef} style={{ opacity: 0 }}>
                    <span className="cb-scroll-cue-text">scroll</span>
                    <div className="cb-scroll-cue-line" />
                </div>
            </section>

            {/* ═══════ MARQUEE 1 ═══════ */}
            <div className="cb-marquee">
                <div className="cb-marquee-track">{renderMarqueeItems(MARQUEE_TEXT_1)}</div>
            </div>

            {/* ═══════ MARQUEE 2 ═══════ */}
            <div className="cb-marquee">
                <div className="cb-marquee-track" style={{ animationDirection: 'reverse' }}>
                    {renderMarqueeItems(MARQUEE_TEXT_2)}
                </div>
            </div>

            {/* ═══════ ATTITUDE ═══════ */}
            <section className="cb-attitude">
                <div className="cb-attitude-wrap">
                    <p className="cb-attitude-text" ref={attitudeTextRef} style={{ transform: 'translateY(30px)', opacity: 0 }}>
                        WE DON&apos;T FOLLOW <span className="em">TRENDS</span>. WE SET <span className="em">THEM</span>.
                    </p>
                    <p className="cb-attitude-sub" ref={attitudeSubRef} style={{ opacity: 0 }}>// THE TECHNICAL DIVISION OF IEEE SBNU — CODE BLUE 2026</p>
                </div>
            </section>

            {/* SPACER (No Glorified Text) */}
            <div style={{ height: '4rem' }} />

            {/* ═══════ TEAM SECTION (LEADER + GRID) ═══════ */}
            <section className="cb-team-section" style={{ position: 'relative' }}>
                <div className="cb-team-header">
                    {/* REMOVED TITLE AS REQUESTED */}
                </div>

                {/* LEADERSHIP UNIT */}
                {leader && (
                    <div className="cb-leader-container">
                        <div
                            className="cb-card cb-head-card cb-leader-card"
                            ref={el => { cardsRef.current[0] = el; }} // Leader is 0
                            onMouseMove={(e) => handleCardMove(e, 0)}
                            onMouseLeave={() => handleCardLeave(0)}
                            onClick={() => window.open(leader.linkedin, '_blank')} // Clickable Card
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="cb-layer-base"></div>
                            <div className="cb-layer-content">
                                <div className="cb-card-border-glow" />
                                <div className="cb-card-photo" style={{ overflow: 'hidden' }}>
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        loading="lazy"
                                        className="cb-leader-img" // Added Class for Hover
                                        style={{ objectPosition: 'top center', transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}
                                    />
                                    <div className="cb-head-tag">TECHNICAL HEAD</div>
                                </div>
                                <div className="cb-card-info">
                                    <div className="cb-card-name">{leader.name}</div>
                                    <div className="cb-card-role">{leader.role}</div> {/* Removed TextScramble */}

                                    {/* BIO TITLE */}
                                    <div className="cb-bio-title" style={{
                                        color: '#5eb8ff',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.1em',
                                        marginBottom: '0.2rem',
                                        marginTop: '0.8rem',
                                    }}>{leader.bioTitle}</div>

                                    <div className="cb-card-desc" style={{
                                        fontSize: '0.95rem', /* Increased from 0.8rem */
                                        color: '#bbb',       /* Lighter for better contrast */
                                        fontStyle: 'italic',
                                        marginBottom: '0.5rem',
                                        marginTop: '0.2rem', /* Reduced margin top */
                                        lineHeight: '1.5'
                                    }}>"{leader.desc}"</div>

                                    {/* Visual Icon Only - Click handled by Card */}
                                    <div className="cb-card-social">
                                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </div>
                                </div>
                            </div>
                            {/* HOLOGRAPHIC STATS LAYER */}
                            <div className="cb-layer-holo">
                                {leader.stats?.map((stat, i) => (
                                    <div key={i} className="cb-stat-item">{stat}</div>
                                ))}
                                <div className="cb-holo-grid"></div>
                            </div>
                        </div >
                    </div>
                )
                }

                {/* SQUAD GRID */}
                <div className="cb-team-grid">
                    {squad.map((member, i) => (
                        <div
                            key={member.id}
                            className="cb-card"
                            ref={el => { cardsRef.current[i + 1] = el; }} // Offset indices
                            onMouseMove={(e) => handleCardMove(e, i + 1)}
                            onMouseLeave={() => handleCardLeave(i + 1)}
                            onClick={() => window.open(member.linkedin, '_blank')} // Clickable Card
                            style={{ opacity: 0, transform: 'translateY(50px)', cursor: 'pointer' }}
                        >
                            <div className="cb-layer-base"></div>
                            <div className="cb-layer-content">
                                <div className="cb-card-border-glow" />
                                <div className="cb-card-photo">
                                    <img src={member.image} alt={member.name} loading="lazy" />
                                    <div className="cb-member-tag">TECHNICAL ASSOCIATE</div>
                                </div>
                                <div className="cb-card-info">
                                    <div className="cb-card-name">{member.name}</div>
                                    <div className="cb-card-role">{member.role}</div> {/* Removed TextScramble */}

                                    {/* BIO TITLE */}
                                    <div className="cb-bio-title" style={{
                                        color: '#5eb8ff',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.1em',
                                        marginBottom: '0.2rem',
                                        marginTop: '0.6rem',
                                    }}>{member.bioTitle}</div>

                                    <div className="cb-card-desc" style={{
                                        fontSize: '0.9rem',  /* Increased from 0.75rem */
                                        color: '#ccc',       /* Lighter for better contrast */
                                        marginBottom: '0.5rem',
                                        marginTop: '0.2rem', /* Reduced margin top */
                                        lineHeight: '1.5'
                                    }}>{member.desc}</div>

                                    {/* Visual Icon Only - Click handled by Card */}
                                    <div className="cb-card-social">
                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </div>
                                </div>
                            </div>
                            {/* HOLOGRAPHIC STATS LAYER */}
                            <div className="cb-layer-holo">
                                {member.stats?.map((stat, i) => (
                                    <div key={i} className="cb-stat-item">{stat}</div>
                                ))}
                                <div className="cb-holo-grid"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* ═══════ OUTRO ═══════ */}
            < section className="cb-outro" >
                <p className="cb-outro-pre" ref={outroPreRef} style={{ opacity: 0 }}>SYSTEM DESIGNED & BUILT BY</p>
                <h2 className="cb-outro-title" ref={outroTitleRef} style={{ opacity: 0 }}>CODE <span className="blue">BLUE</span></h2>
                <div style={{ fontFamily: 'Courier New, monospace', fontSize: '0.9rem', color: '#5eb8ff', marginBottom: '1rem' }}>
                    <span style={{ color: '#33ff00' }}>➜</span> <span style={{ color: '#fff' }}>~</span> echo "Hello, World"
                </div>
                <p className="cb-outro-end" ref={outroEndRef} style={{ opacity: 0 }}>&lt; END TRANSMISSION &gt;</p>
            </section >
        </div >
    );
}

export default function CodeBlueWithErrorBoundary() {
    return (
        <GlobalErrorBoundary>
            <CodeBlueContent />
        </GlobalErrorBoundary>
    );
}
