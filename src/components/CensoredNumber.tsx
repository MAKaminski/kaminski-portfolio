import React, { useState } from 'react';

interface CensoredNumberProps {
  value: string;
  className?: string;
  label?: string;
}

const CensoredNumber: React.FC<CensoredNumberProps> = ({ value, className = "", label = "" }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity duration-200 ${className}`}
      title={isRevealed ? "Click to hide" : "Click to reveal"}
    >
      {label && <span>{label}</span>}
      <span className="font-bold">
        {isRevealed ? value : "••••"}
      </span>
      <span className="text-xs opacity-70">
        {isRevealed ? "👁️" : "👁️‍🗨️"}
      </span>
    </button>
  );
};

export default CensoredNumber; 