import React from 'react';
import './Carnival.css';
import ElectricBorderCard from '../components/ElectricBorder';
import Balatro from '../components/Balatro';

import CarnivalFlashcard from '../assets/carnival-flashcard.png';

const Carnival = () => {
  return (
    <div className="carnival-container">
      <Balatro 
        color1="#FF00FF" /* Neon Pink */
        color2="#5EB8FF" /* Light Blue */
        color3="#442266" /* Deep Purple */
        spinSpeed={1.0}
        contrast={1.2}
      />
      <div className="carnival-content" style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <ElectricBorderCard>
          <h1 className="carnival-title-new">
            <span className="ieee-pink">IEEE</span>
            <span className="carnival-blue">CARNIVAL</span>
          </h1>
          <div className="date-pill-container">
            <span className="date-pill">27th - 29th March</span>
          </div>
        </ElectricBorderCard>
      </div>
    </div>
  );
};

export default Carnival;
