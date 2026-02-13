import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';

const Lanyard = () => {
    const angle = useMotionValue(0);
    const velocity = useRef(0);
    const lastTime = useRef(0);

    // Pendulum constants
    const stiffness = 60;
    const damping = 5;
    const mass = 2;

    useAnimationFrame((time) => {
        if (!lastTime.current) lastTime.current = time;
        const delta = (time - lastTime.current) / 1000;
        lastTime.current = time;

        // Fixed time step for stability
        const dt = Math.min(delta, 0.032);

        // Simple pendulum physics simulation
        const springForce = -stiffness * angle.get();
        const dampingForce = -damping * velocity.current;

        // External "wind" or idle oscillation
        const idleSway = Math.sin(time / 2000) * 0.15;

        const accel = (springForce + dampingForce) / mass + idleSway;

        velocity.current += accel * dt;
        angle.set(angle.get() + velocity.current * dt);
    });

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Anchor Point (Static Ring) */}
            <div
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '3px solid #00aaff',
                    background: 'transparent',
                    zIndex: 60,
                    position: 'relative',
                }}
            />

            {/* Unified Pendulum System (Thread + Card) */}
            <motion.div
                style={{
                    rotateZ: angle,
                    transformOrigin: 'top center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: -2, // Visual connection to ring
                    zIndex: 50,
                }}
                initial={{ y: -400, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    y: {
                        type: 'spring',
                        stiffness: 35,
                        damping: 12,
                        mass: 2,
                        restDelta: 0.001,
                    },
                    opacity: { duration: 0.4 }
                }}
            >
                {/* Thread - Always visible, fixed to system */}
                <div
                    style={{
                        width: 1.5,
                        height: 280, // Substantial length as requested
                        background: '#00aaff',
                        opacity: 0.8,
                        position: 'relative',
                    }}
                >
                    {/* Subtle thread detail */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0.5,
                            height: '100%',
                            background: 'rgba(255,255,255,0.3)',
                        }}
                    />
                </div>

                {/* Card attachment clip */}
                <div
                    style={{
                        width: 14,
                        height: 14,
                        border: '2px solid #00aaff',
                        borderTop: 'none',
                        background: '#000814',
                        marginTop: -1,
                    }}
                />

                {/* Badge Card */}
                <motion.div
                    whileHover={{ y: -5, x: 2 }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const deltaX = e.clientX - centerX;
                        // Apply a gentle force to the physics simulation
                        velocity.current += deltaX * 0.004;
                    }}
                    style={{
                        width: 250,
                        height: 330,
                        background: 'linear-gradient(135deg, #020617 0%, #030a1c 100%)',
                        border: '1px solid rgba(0, 170, 255, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 30,
                        marginTop: 2,
                        userSelect: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'default',
                    }}
                >
                    {/* IEEE Blue Stripe at bottom */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: '#00629b',
                        }}
                    />

                    {/* User Icon Circle */}
                    <div
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: '50%',
                            background: 'rgba(0, 98, 155, 0.4)',
                            border: '2px solid #00629b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                        }}
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#00aaff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <h3
                            style={{
                                color: 'white',
                                fontSize: '22px',
                                fontWeight: '700',
                                margin: 0,
                                letterSpacing: '0.01em',
                                lineHeight: '1.4',
                            }}
                        >
                            Become a<br />
                            <span style={{ color: '#00aaff' }}>IEEE Member</span>
                        </h3>
                    </div>

                    {/* Clean modern accent dots */}
                    <div style={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 4 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(0, 170, 255, 0.3)' }} />
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(0, 170, 255, 0.3)' }} />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Lanyard;
