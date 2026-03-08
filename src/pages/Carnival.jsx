import React from 'react';
import './Carnival.css';
import ElectricBorderCard from '../components/ElectricBorder';
import Balatro from '../components/Balatro';

import CarnivalFlashcard from '../assets/carnival-flashcard.png';

const Carnival = () => {
  return (
    <div className="carnival-container">
      <Balatro 
        color1="#FF33BB" /* Pink */
        color2="#3366FF" /* Blue */
        color3="#9933FF" /* Purple */
        spinSpeed={1.2}
        contrast={1.1}
      />
      <div className="carnival-content" style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <ElectricBorderCard>
          <img 
            src={CarnivalFlashcard} 
            alt="IEEE Carnival Flashcard" 
            style={{ 
              width: '100%', 
              maxWidth: '600px', 
              height: 'auto',
              borderRadius: '8px',
              border: 'none',
              mixBlendMode: 'screen', // This removes the black background
              filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.4))'
            }} 
          />
        </ElectricBorderCard>
      </div>
    </div>
  );
};

export default Carnival;
