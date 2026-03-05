import React, { useState, useEffect, useRef } from 'react';

const TextScramble = ({ text, className = '', as = 'span', speed = 50, revealSpeed = 2 }) => {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef(null);

    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const scramble = () => {
        let iteration = 0;
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(() =>
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current);
            }

            iteration += 1 / revealSpeed;
        }, speed);
    };

    useEffect(() => {
        // Scramble on mount
        scramble();
        return () => clearInterval(intervalRef.current);
    }, [text]);

    const handleMouseEnter = () => {
        scramble();
    };

    const Component = as;

    return (
        <Component
            className={className}
            onMouseEnter={handleMouseEnter}
            style={{ cursor: 'default' }}
        >
            {displayText}
        </Component>
    );
};

export default TextScramble;
