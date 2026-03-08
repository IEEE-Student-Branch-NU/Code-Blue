import React from 'react';
import './Carnival.css';
import ElectricBorderCard from '../components/ElectricBorder';
import Balatro from '../components/Balatro';

const Carnival = () => {
  return (
    <div className="carnival-container">
      {/* Static Gradient Background handled in CSS */}
      <div className="carnival-content" style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <ElectricBorderCard>
          <h1 className="carnival-title silver-text font-gladolia" style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            IEEE Carnival
          </h1>
          <p className="carnival-subtitle silver-text" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500, opacity: 0.8 }}>
            27, 28 and 29th March
          </p>
        </ElectricBorderCard>
      </div>
    </div>
  );
};

export default Carnival;
