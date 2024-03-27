import React, { useState, useEffect } from "react";
import Progress from "./components/Progress";

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isSession, setIsSession] = useState(true); // Track if it's a session or break
  const [longBreakLength, setLongBreakLength] = useState(30);
  const [longBreakFrequency, setLongBreakFrequency] = useState(4);

  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 10);
    } else if (timeLeft === 0) {
      // Timer ends, switch to break or session
      setTimerRunning(false);
      if (isSession) {
        // If it's a session, switch to break
        setIsSession(false);
        setTimeLeft(breakLength * 60);
      } else {
        // If it's a break, switch to session and increase session count
        setIsSession(true);
        setSessionCount(sessionCount + 1);
        setTimeLeft(sessionCount % longBreakFrequency === longBreakFrequency - 1 ? longBreakLength * 60 : sessionLength * 60);
      }
    }
    return () => clearInterval(interval);
  }, [
    timerRunning,
    timeLeft,
    sessionLength,
    breakLength,
    sessionCount,
    isSession,
    longBreakFrequency,
    longBreakLength,
  ]);

  const startTimer = () => {
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(sessionLength * 60);
    setSessionCount(0);
    setIsSession(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleSessionLengthChange = (increment) => {
    if (!timerRunning) {
      const newSessionLength = Math.max(1, sessionLength + increment);
      setSessionLength(newSessionLength);
      if (isSession) {
        // Update time left only if it's currently a session
        setTimeLeft(newSessionLength * 60);
      }
    }
  };

  const handleBreakLengthChange = (increment) => {
    if (!timerRunning) {
      const newBreakLength = Math.max(1, breakLength + increment);
      setBreakLength(newBreakLength);
      if (!isSession) {
        // Update time left only if it's currently a break
        setTimeLeft(newBreakLength * 60);
      }
    }
  };

  const handleLongBreakLengthChange = (increment) => {
    if (!timerRunning) {
      const newLongBreakLength = Math.max(1, longBreakLength + increment);
      setLongBreakLength(newLongBreakLength);
      if (!isSession && sessionCount % longBreakFrequency === longBreakFrequency - 1) {
        // Update time left only if it's currently a long break
        setTimeLeft(newLongBreakLength * 60);
      }
    } else if (!isSession && sessionCount % longBreakFrequency === longBreakFrequency - 1) {
      // Update time left dynamically during long break
      setTimeLeft((prevTimeLeft) => Math.max(1, prevTimeLeft + increment * 60));
    }
  };
  

  return (<>
    <nav className="flex justify-between w-full p-4 bg-black text-white">
        <h1 className="text-4xl font-bold">Pomodoro Timer</h1>
        </nav>
    <div className=" flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center mr-4">
          <p className="text-white text-lg font-semibold mb-2">Session Length</p>
          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l"
              onClick={() => handleSessionLengthChange(-1)}
              disabled={timerRunning}
            >
              -
            </button>
            <p className="text-white text-lg font-semibold px-4">{sessionLength}</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
              onClick={() => handleSessionLengthChange(1)}
              disabled={timerRunning}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center ml-4">
          <p className="text-white text-lg font-semibold mb-2">Break Length</p>
          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l"
              onClick={() => handleBreakLengthChange(-1)}
              disabled={timerRunning}
            >
              -
            </button>
            <p className=" text-white text-lg font-semibold px-4">{breakLength}</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
              onClick={() => handleBreakLengthChange(1)}
              disabled={timerRunning}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center ml-4">
          <p className="text-white text-lg font-semibold mb-2">Long Break Length</p>
          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l"
              onClick={() => handleLongBreakLengthChange(-1)}
              disabled={timerRunning}
            >
              -
            </button>
            <p className=" text-white text-lg font-semibold px-4">{longBreakLength}</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
              onClick={() => handleLongBreakLengthChange(1)}
              disabled={timerRunning}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-white text-4xl font-bold">{formatTime(timeLeft)}</div>
        {/* Progress component remains unchanged */}
        <Progress
          sessionLength={sessionLength}
          breakLength={breakLength}
          timeLeft={timeLeft}
          isSession={isSession}
        />
      </div>
      <div className="mt-8">
        {!timerRunning ? (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mr-4 rounded"
            onClick={startTimer}
          >
            Start
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-4 rounded"
            onClick={pauseTimer}
          >
            Pause
          </button>
        )}
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      <div className="text-white mt-8">
        <p className="text-lg font-semibold">
          Completed Sessions: {sessionCount}
        </p>
      </div>
    </div>
    </>
  );
}

export default App;
