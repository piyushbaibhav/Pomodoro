
import React from "react";

const Progress = ({ sessionLength, breakLength, timeLeft, sessionCount }) => {
  const totalTime =
    sessionCount % 2 === 0 ? sessionLength * 60 : breakLength * 60;

  const calculateProgress = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="w-full h-8 bg-gray-300 mt-4 rounded-full relative">
      <div
        className="h-full bg-green-500 rounded-full"
        style={{ width: `${calculateProgress()}%` }}
      ></div>
      <div
        className="radial-progress text-primary"
        style={{ "--value": `${calculateProgress()}` }}
        role="progressbar"
      >
        {Math.floor(calculateProgress())}%
      </div>
    </div>
  );
};

export default Progress;
