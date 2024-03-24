// Progress.js

import React from 'react';

const Progress = ({ totalTime, timeLeft }) => {
  const calculateProgress = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="w-full h-8 bg-gray-300 mt-4 rounded-full relative">
      <div
        className="h-full bg-green-500 rounded-full"
        style={{ width: `${calculateProgress()}%` }}
      ></div>
      <div className="radial-progress text-primary" style={{ "--value": `${calculateProgress()}` }} role="progressbar">{Math.floor(calculateProgress())}%</div>
    </div>
  );
};

export default Progress;
