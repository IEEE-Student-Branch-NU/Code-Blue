
import React, { useState } from 'react';
import './CodeBlueSticker.css';

const CodeBlueSticker = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href="https://github.com/IEEE-Student-Branch-NU/Code-Blue"
            target="_blank"
            rel="noopener noreferrer"
            className="code-blue-sticker"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="sticker-status-dot"></span>
            <span className="sticker-text">
                {isHovered ? "SYSTEM OVERRIDE" : "SYSTEM: STABLE"}
            </span>

            {/* Hidden Glitch Layer */}
            <div className="sticker-glitch-text">
                CODE BLUE
            </div>
        </a>
    );
};

export default CodeBlueSticker;
