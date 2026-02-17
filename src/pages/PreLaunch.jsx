import React, { useState, useEffect } from 'react';
import LetterGlitch from '../components/Backgrounds/LetterGlitch/LetterGlitch';

const PreLaunch = ({ onUnlock }) => {
    const targetDate = "2026-02-17T20:00:00+05:30";
    const startDate = "2026-02-16T20:00:00+05:30"; // 24h before launch

    const calculateProgress = () => {
        const start = +new Date(startDate);
        const end = +new Date(targetDate);
        const now = +new Date();
        const prog = ((now - start) / (end - start)) * 100;
        return Math.min(Math.max(prog, 0), 100);
    };

    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [progress, setProgress] = useState(calculateProgress());

    useEffect(() => {
        const timer = setInterval(() => {
            const nextTimeLeft = calculateTimeLeft();
            const nextProgress = calculateProgress();

            if (new Date() >= new Date(targetDate)) {
                onUnlock();
                clearInterval(timer);
            } else {
                setTimeLeft(nextTimeLeft);
                setProgress(nextProgress);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [onUnlock, targetDate]);

    const formatNumber = (num) => String(num).padStart(2, '0');

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflow: 'hidden'
        }}>
            {/* Background Effect */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3 }}>
                <LetterGlitch
                    glitchSpeed={50}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                    glitchColors={['#4287f5', '#1a3c75', '#0d1f3d']}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px', width: '100%' }}>
                <div style={{
                    marginBottom: '40px',
                    animation: 'float 6s ease-in-out infinite'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                        fontWeight: '900',
                        color: '#fff',
                        margin: 0,
                        letterSpacing: '-2px',
                        textTransform: 'uppercase',
                        lineHeight: 0.9
                    }}>
                        IEEE SBNU <span style={{ color: '#5eb8ff' }}>2026</span>
                    </h1>
                    <p style={{
                        fontFamily: 'Courier New, monospace',
                        color: '#5eb8ff',
                        fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
                        marginTop: '15px',
                        letterSpacing: '4px',
                        opacity: 0.8
                    }}>
                        // THE DIGITAL FRONTIER IS LOADING
                    </p>
                </div>

                {/* Internal Countdown Display */}
                <div className="internal-lc-container">
                    <div className="internal-lc-header">
                        <span className="internal-lc-header-dot"></span>
                        <span className="internal-lc-header-title">SYSTEM_LAUNCH_COUNTDOWN</span>
                        <span className="internal-lc-header-status">STATUS: PENDING</span>
                    </div>

                    <div className="internal-lc-display">
                        <div className="internal-lc-item">
                            <span className="internal-lc-value">{formatNumber(timeLeft.days)}</span>
                            <span className="internal-lc-label">DAYS</span>
                        </div>
                        <div className="internal-lc-separator">:</div>
                        <div className="internal-lc-item">
                            <span className="internal-lc-value">{formatNumber(timeLeft.hours)}</span>
                            <span className="internal-lc-label">HOURS</span>
                        </div>
                        <div className="internal-lc-separator">:</div>
                        <div className="internal-lc-item">
                            <span className="internal-lc-value">{formatNumber(timeLeft.minutes)}</span>
                            <span className="internal-lc-label">MINS</span>
                        </div>
                        <div className="internal-lc-separator">:</div>
                        <div className="internal-lc-item">
                            <span className="internal-lc-value">{formatNumber(timeLeft.seconds)}</span>
                            <span className="internal-lc-label">SECS</span>
                        </div>
                    </div>

                    <div className="internal-lc-footer">
                        <div className="internal-lc-bar-container">
                            <div className="internal-lc-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="internal-lc-target-info">
                            T-MINUS INITIALIZATION... [TARGET: 17-02-2026 20:00:00 IST]
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '40px',
                    fontFamily: 'Courier New, monospace',
                    color: '#333',
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: 1.6
                }}>
                    DEPLOYING CORE MODULES... [DONE]<br />
                    CALIBRATING NEURAL INTERFACE... [DONE]<br />
                    WAITING FOR SYSTEM INITIALIZATION... [PENDING]
                </div>
            </div>

            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .internal-lc-container {
                    background: #050505;
                    border: 2px solid #5eb8ff;
                    padding: 20px;
                    font-family: 'Courier New', Courier, monospace;
                    color: #fff;
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                    box-shadow: 10px 10px 0px #5eb8ff;
                }

                .internal-lc-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                    font-size: 0.8rem;
                    letter-spacing: 2px;
                }

                .internal-lc-header-dot {
                    width: 8px;
                    height: 8px;
                    background: #5eb8ff;
                    border-radius: 50%;
                    animation: blink 1s infinite;
                }

                .internal-lc-header-title {
                    font-weight: 900;
                    color: #5eb8ff;
                }

                .internal-lc-header-status {
                    margin-left: auto;
                    color: #888;
                }

                .internal-lc-display {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                    padding: 10px 0;
                }

                .internal-lc-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 80px;
                }

                .internal-lc-value {
                    font-size: clamp(3rem, 8vw, 5rem);
                    font-weight: 900;
                    line-height: 1;
                    color: #fff;
                    text-shadow: 4px 4px 0px #004d7a;
                }

                .internal-lc-label {
                    font-size: 0.7rem;
                    color: #5eb8ff;
                    margin-top: 5px;
                    font-weight: bold;
                }

                .internal-lc-separator {
                    font-size: clamp(2rem, 5vw, 4rem);
                    font-weight: 900;
                    color: #333;
                    animation: pulse 1s infinite;
                }

                .internal-lc-footer {
                    margin-top: 30px;
                }

                .internal-lc-bar-container {
                    height: 4px;
                    background: #1a1a1a;
                    width: 100%;
                    margin-bottom: 10px;
                    position: relative;
                }

                .internal-lc-bar-fill {
                    height: 100%;
                    background: #5eb8ff;
                    box-shadow: 0 0 10px #5eb8ff;
                    transition: width 1s linear;
                }

                .internal-lc-target-info {
                    font-size: 0.65rem;
                    color: #444;
                    text-align: right;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }

                @keyframes pulse {
                    0%, 100% { color: #333; }
                    50% { color: #5eb8ff; }
                }

                @media (max-width: 600px) {
                    .internal-lc-display { gap: 5px; }
                    .internal-lc-item { min-width: auto; flex: 1; }
                }
                `}
            </style>
        </div>
    );
};

export default PreLaunch;
