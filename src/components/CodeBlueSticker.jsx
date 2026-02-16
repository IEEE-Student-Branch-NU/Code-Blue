import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CodeBlueSticker.css';

const CodeBlueSticker = () => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/code-blue');
    };

    return (
        <button
            className="code-blue-sticker"
            onClick={handleClick}
            aria-label="Enter Code Blue Experience"
        >
            DEVELOPED BY CODE BLUE
        </button>
    );
};

export default CodeBlueSticker;
