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
          <h1 className="carnival-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '0.5rem' }}>
            IEEE Carnival
          </h1>
          <p className="carnival-subtitle" style={{ margin: 0, fontSize: '1.25rem', color: '#e0c9a3', fontWeight: 500 }}>
            27, 28 and 29th March
          </p>
        </ElectricBorderCard>
      </div>
    </div>
  );
};

export default Carnival;
