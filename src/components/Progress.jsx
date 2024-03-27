
import React from "react";

const Progress = ({ sessionLength, breakLength, timeLeft, isSession }) => {
  const totalTime = isSession ? sessionLength * 60 : breakLength * 60;

  const calculateProgress = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="w-full h-8 bg-gray-600 mt-4 rounded-md relative">
      <div
        className="h-full bg-green-300 rounded-md"
        style={{ width: `${calculateProgress()}%` }}
      ></div>
      {/* <div
        className="radial-progress text-primary"
        style={{ "--value": `${calculateProgress()}` }}
        role="progressbar"
      >
        {Math.floor(calculateProgress())}%
      </div> */}
    </div>
  );
};

export default Progress;

