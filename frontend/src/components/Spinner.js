import React from 'react';

function Spinner({ size = 'medium', className = '' }) {
  // Determine spinner size
  const sizeClass = size === 'small' 
    ? 'w-4 h-4' 
    : size === 'large' 
      ? 'w-12 h-12' 
      : 'w-8 h-8';
  
  return (
    <div className={`spinner ${className}`}>
      <div 
        className={`
          ${sizeClass} 
          border-4 
          rounded-full 
          border-t-transparent 
          border-indigo-600 animate-spin
        `}
      ></div>
    </div>
  );
}

export default Spinner; 