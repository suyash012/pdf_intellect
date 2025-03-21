import React from 'react';

const Logo = ({ size = 'default', className = '' }) => {
  const sizes = {
    small: 'text-xl',
    default: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl',
  };
  
  const sizeClass = sizes[size] || sizes.default;
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-2 relative">
        <div className="w-8 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xs">PDF</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className={`font-bold ${sizeClass} bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight`}>
          PDF Intellect
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Analyze · Chat · Visualize</p>
      </div>
    </div>
  );
};

export default Logo; 