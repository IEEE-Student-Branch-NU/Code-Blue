import React from 'react';

/* 
   SAFE LIQUID BACKGROUND
   Uses CSS Blurs + Animated Gradients instead of WebGL to prevent crashes.
*/

export default function Liquid({ colors = ['#0a1a2f', '#000000', '#5eb8ff'] }) {
    return (
        <div className="cb-liquid-container">
            {/* Dark Blue Base */}
            <div className="cb-liquid-orb" style={{
                top: '-10%', left: '-10%', width: '70%', height: '70%',
                background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
                animationDelay: '0s', animationDuration: '25s'
            }} />

            {/* Lighter Cyan Accent */}
            <div className="cb-liquid-orb" style={{
                top: '40%', right: '-20%', width: '80%', height: '80%',
                background: `radial-gradient(circle, ${colors[2]} 0%, transparent 60%)`,
                opacity: 0.4,
                animationDelay: '-5s', animationDuration: '30s'
            }} />

            {/* Deep Void */}
            <div className="cb-liquid-orb" style={{
                bottom: '-20%', left: '20%', width: '90%', height: '90%',
                background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
                animationDelay: '-10s', animationDuration: '35s'
            }} />

            {/* Moving Highlight */}
            <div className="cb-liquid-orb" style={{
                top: '30%', left: '40%', width: '40%', height: '40%',
                background: `radial-gradient(circle, #2a4a7f 0%, transparent 70%)`,
                opacity: 0.3,
                animationDelay: '-15s', animationDuration: '20s'
            }} />
        </div>
    );
}
