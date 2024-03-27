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
      }, 1000);
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
        <h1 className="text-4xl font-medium">Pomodoro Timer</h1>
        </nav>
        
    <div className=" flex flex-col items-center justify-center min-h-screen bg-black">
      
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center mr-4">
          
          <p className="text-white text-lg  mb-2">Focus</p>
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
          <p className="text-white text-lg  mb-2">Short Break</p>
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
        <div className="flex flex-col items-center ml-8">
          <p className="text-white text-lg  mb-2">Long Break</p>
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
        <div className="text-white text-[110px] font-bold">{formatTime(timeLeft)}</div>
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
            // className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mr-4 rounded"
            
            onClick={startTimer}
          >
            <svg
							width="48"
							height="48"
							viewBox="0 0 48 48"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M18.18 34.2L34.2 24L18.18 13.8V34.2ZM24 48C20.72 48 17.62 47.37 14.7 46.11C11.78 44.85 9.23 43.13 7.05 40.95C4.87 38.77 3.15 36.22 1.89 33.3C0.63 30.38 0 27.28 0 24C0 20.72 0.63 17.62 1.89 14.7C3.15 11.78 4.87 9.23 7.05 7.05C9.23 4.87 11.78 3.15 14.7 1.89C17.62 0.63 20.72 0 24 0C27.28 0 30.38 0.63 33.3 1.89C36.22 3.15 38.77 4.87 40.95 7.05C43.13 9.23 44.85 11.78 46.11 14.7C47.37 17.62 48 20.72 48 24C48 27.28 47.37 30.38 46.11 33.3C44.85 36.22 43.13 38.77 40.95 40.95C38.77 43.13 36.22 44.85 33.3 46.11C30.38 47.37 27.28 48 24 48ZM24 44.4C29.6 44.4 34.4 42.4 38.4 38.4C42.4 34.4 44.4 29.6 44.4 24C44.4 18.4 42.4 13.6 38.4 9.6C34.4 5.6 29.6 3.6 24 3.6C18.4 3.6 13.6 5.6 9.6 9.6C5.6 13.6 3.6 18.4 3.6 24C3.6 29.6 5.6 34.4 9.6 38.4C13.6 42.4 18.4 44.4 24 44.4Z"
								fill="#323238"
							/>
						</svg>
            
          </button>
        ) : (
          <button
            // className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-4 rounded"
            onClick={pauseTimer}
          >
            <svg
							width="48"
							height="48"
							viewBox="0 0 48 48"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M24 48C20.6 48 17.44 47.39 14.52 46.17C11.6 44.95 9.06 43.26 6.9 41.1C4.74 38.94 3.05 36.4 1.83 33.48C0.610002 30.56 0 27.4 0 24C0 20.64 0.610002 17.5 1.83 14.58C3.05 11.66 4.74 9.12 6.9 6.96C9.06 4.8 11.6 3.1 14.52 1.86C17.44 0.62 20.6 0 24 0C27.36 0 30.5 0.62 33.42 1.86C36.34 3.1 38.88 4.8 41.04 6.96C43.2 9.12 44.9 11.66 46.14 14.58C47.38 17.5 48 20.64 48 24C48 27.4 47.38 30.56 46.14 33.48C44.9 36.4 43.2 38.94 41.04 41.1C38.88 43.26 36.34 44.95 33.42 46.17C30.5 47.39 27.36 48 24 48ZM24 44.4C29.8 44.4 34.65 42.45 38.55 38.55C42.45 34.65 44.4 29.8 44.4 24C44.4 18.2 42.45 13.35 38.55 9.45C34.65 5.55 29.8 3.6 24 3.6C18.2 3.6 13.35 5.55 9.45 9.45C5.55 13.35 3.6 18.2 3.6 24C3.6 29.8 5.55 34.65 9.45 38.55C13.35 42.45 18.2 44.4 24 44.4Z"
								fill="#323238"
							/>
							<path
								d="M27 16.5C27 19.5 27 28 27 31C27 34 30.5 34 30.5 31C30.5 28 30.5 19.5 30.5 16.5C30.5 13.5 27 13.5 27 16.5Z"
								fill="#323238"
							/>
							<path
								d="M27 16.5C27 19.5 27 28 27 31C27 34 30.5 34 30.5 31C30.5 28 30.5 19.5 30.5 16.5C30.5 13.5 27 13.5 27 16.5Z"
								fill="#323238"
							/>
							<path
								d="M17.5 16.5C17.5 19.5 17.5 28 17.5 31C17.5 34 21 34 21 31C21 28 21 19.5 21 16.5C21 13.5 17.5 13.5 17.5 16.5Z"
								fill="#323238"
							/>
							<path
								d="M17.5 16.5C17.5 19.5 17.5 28 17.5 31C17.5 34 21 34 21 31C21 28 21 19.5 21 16.5C21 13.5 17.5 13.5 17.5 16.5Z"
								fill="#323238"
							/>
						</svg>
            
          </button>
        )}
        <button
          className="   font-bold py-2 px-4 rounded"
          onClick={resetTimer}
        >
          
          <svg viewBox="-2.1 -2.1 25.20 25.20" xmlns="http://www.w3.org/2000/svg" fill="#a1a1a1" stroke="#a1a1a1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="none" fill-rule="evenodd" stroke="#a1a1a1" stroke-linecap="round" stroke-linejoin="round" transform="matrix(0 1 1 0 2.5 2.5)"> <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path> <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"></path> </g> </g></svg>          Reset
        </button>
        
      </div>
      <div className="text-white mt-8">
        <p className="text-xl">
          Completed Sessions: {sessionCount}
        </p>
      </div>
    </div>
    </>
  );
}

export default App;
