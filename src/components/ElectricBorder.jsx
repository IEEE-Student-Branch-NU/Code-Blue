import React from 'react';
import './ElectricBorder.css';

const ElectricBorderCard = ({ children, className = '' }) => {
  return (
    <div className={`electric-border-wrapper ${className}`}>
      <div className="electric-border-animated" />
      <div className="electric-border-inner">
        {children}
      </div>
    </div>
  );
};

export default ElectricBorderCard;
