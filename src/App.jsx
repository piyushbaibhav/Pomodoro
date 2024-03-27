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
  const [currentAudio, setCurrentAudio] = useState(null);

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

  const playAudio = (audioFile) => {
    if (currentAudio) {
      // Pause the current audio if any is playing
      currentAudio.pause();
    }
    // Create a new Audio object for the clicked audio file
    const audio = new Audio(audioFile);
    // Play the audio
    audio.play();
    // Set the new audio as the current audio
    setCurrentAudio(audio);
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
        <div className="bg-black pt-5">
          <div className="flex">
                        <div className="  w-64 ml-[300px] mr-4">
                      {/* Card 1 content */}
                      <button 
                      class="cardButton"
                      onClick={() => playAudio("/music/audio-file1.mp3")}
                      >
						<svg
							width="45"
							height="56"
							viewBox="0 0 45 56"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4.83553 56V51.8H20.0329V39.2H13.8158C9.99342 39.2 6.7352 37.835 4.04112 35.105C1.34704 32.375 0 29.0733 0 25.2C0 22.4 0.759868 19.8217 2.2796 17.465C3.79934 15.1083 5.84868 13.3933 8.42763 12.32C8.84211 8.82 10.3503 5.89167 12.9523 3.535C15.5543 1.17833 18.6053 0 22.1053 0C25.6053 0 28.6562 1.17833 31.2582 3.535C33.8602 5.89167 35.3684 8.82 35.7829 12.32C38.3618 13.3933 40.4112 15.1083 41.9309 17.465C43.4507 19.8217 44.2105 22.4 44.2105 25.2C44.2105 29.0733 42.8635 32.375 40.1694 35.105C37.4753 37.835 34.2171 39.2 30.3947 39.2H24.1776V51.8H40.0658V56H4.83553ZM13.8158 35H30.3947C33.0658 35 35.3454 34.0433 37.2336 32.13C39.1217 30.2167 40.0658 27.9067 40.0658 25.2C40.0658 23.24 39.5132 21.455 38.4079 19.845C37.3026 18.235 35.875 17.0333 34.125 16.24L31.9145 15.26L31.6382 12.81C31.3158 10.3367 30.2566 8.28333 28.4605 6.65C26.6645 5.01667 24.5461 4.2 22.1053 4.2C19.6645 4.2 17.5461 5.01667 15.75 6.65C13.9539 8.28333 12.8947 10.3367 12.5724 12.81L12.2961 15.26L10.0855 16.24C8.33553 17.0333 6.90789 18.235 5.80263 19.845C4.69737 21.455 4.14474 23.24 4.14474 25.2C4.14474 27.9067 5.08882 30.2167 6.97697 32.13C8.86513 34.0433 11.1447 35 13.8158 35Z"
								fill="#323238"
							/>
						</svg>
					</button>
                    </div>
                    <div className="  w-64 mr-4">
                      {/* Card 2 content */}
                      <button class="cardButton">
						<svg
							width="53"
							height="56"
							viewBox="0 0 53 56"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.5263 45.3333C9.91228 45.3333 9.375 45.1 8.91447 44.6333C8.45395 44.1667 8.22368 43.6222 8.22368 43C8.22368 42.3778 8.45395 41.8333 8.91447 41.3667C9.375 40.9 9.91228 40.6667 10.5263 40.6667C11.1404 40.6667 11.6776 40.9 12.1382 41.3667C12.5987 41.8333 12.8289 42.3778 12.8289 43C12.8289 43.6222 12.5987 44.1667 12.1382 44.6333C11.6776 45.1 11.1404 45.3333 10.5263 45.3333ZM42.1053 45.3333C41.4912 45.3333 40.9539 45.1 40.4934 44.6333C40.0329 44.1667 39.8026 43.6222 39.8026 43C39.8026 42.3778 40.0329 41.8333 40.4934 41.3667C40.9539 40.9 41.4912 40.6667 42.1053 40.6667C42.7193 40.6667 43.2566 40.9 43.7171 41.3667C44.1776 41.8333 44.4079 42.3778 44.4079 43C44.4079 43.6222 44.1776 44.1667 43.7171 44.6333C43.2566 45.1 42.7193 45.3333 42.1053 45.3333ZM18.4211 56C17.807 56 17.2697 55.7667 16.8092 55.3C16.3487 54.8333 16.1184 54.2889 16.1184 53.6667C16.1184 53.0444 16.3487 52.5 16.8092 52.0333C17.2697 51.5667 17.807 51.3333 18.4211 51.3333C19.0351 51.3333 19.5724 51.5667 20.0329 52.0333C20.4934 52.5 20.7237 53.0444 20.7237 53.6667C20.7237 54.2889 20.4934 54.8333 20.0329 55.3C19.5724 55.7667 19.0351 56 18.4211 56ZM26.3158 45.3333C25.7018 45.3333 25.1645 45.1 24.7039 44.6333C24.2434 44.1667 24.0132 43.6222 24.0132 43C24.0132 42.3778 24.2434 41.8333 24.7039 41.3667C25.1645 40.9 25.7018 40.6667 26.3158 40.6667C26.9298 40.6667 27.4671 40.9 27.9276 41.3667C28.3882 41.8333 28.6184 42.3778 28.6184 43C28.6184 43.6222 28.3882 44.1667 27.9276 44.6333C27.4671 45.1 26.9298 45.3333 26.3158 45.3333ZM34.2105 56C33.5965 56 33.0592 55.7667 32.5987 55.3C32.1382 54.8333 31.9079 54.2889 31.9079 53.6667C31.9079 53.0444 32.1382 52.5 32.5987 52.0333C33.0592 51.5667 33.5965 51.3333 34.2105 51.3333C34.8246 51.3333 35.3618 51.5667 35.8224 52.0333C36.2829 52.5 36.5132 53.0444 36.5132 53.6667C36.5132 54.2889 36.2829 54.8333 35.8224 55.3C35.3618 55.7667 34.8246 56 34.2105 56ZM13.8158 36C10 36 6.74342 34.6333 4.04605 31.9C1.34868 29.1667 0 25.8667 0 22C0 18.4889 1.23903 15.3556 3.7171 12.6C6.19518 9.84444 9.27632 8.33333 12.9605 8.06667C14.364 5.57778 16.2171 3.61111 18.5197 2.16667C20.8224 0.722222 23.4211 0 26.3158 0C30.307 0 33.6513 1.27778 36.3487 3.83333C39.0461 6.38889 40.7018 9.55556 41.3158 13.3333C44.7807 13.5111 47.5329 14.7 49.5724 16.9C51.6118 19.1 52.6316 21.6889 52.6316 24.6667C52.6316 27.7778 51.5461 30.4444 49.375 32.6667C47.2039 34.8889 44.5614 36 41.4474 36H13.8158ZM13.8158 32H41.4474C43.4649 32 45.1754 31.2778 46.5789 29.8333C47.9825 28.3889 48.6842 26.6444 48.6842 24.6C48.6842 22.6 47.9825 20.8889 46.5789 19.4667C45.1754 18.0444 43.4649 17.3333 41.4474 17.3333H37.5V15.3333C37.5 12.1778 36.4145 9.5 34.2434 7.3C32.0724 5.1 29.4298 4 26.3158 4C24.0789 4 22.0285 4.61111 20.1645 5.83333C18.3004 7.05556 16.9298 8.71111 16.0526 10.8L15.5263 12H13.6842C10.9649 12.0889 8.66228 13.1 6.77632 15.0333C4.89035 16.9667 3.94737 19.2889 3.94737 22C3.94737 24.7556 4.91228 27.1111 6.8421 29.0667C8.77193 31.0222 11.0965 32 13.8158 32Z"
								fill="#323238"
							/>
						</svg>
					</button>
                    </div>
                    <div className=" w-64 mr-4">
                      {/* Card 3 content */}
                      <button class="cardButton">
						<svg
							width="48"
							height="56"
							viewBox="0 0 48 56"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4.42105 32.4211C4.42105 35.5158 5.12105 38.4263 6.52105 41.1526C7.92105 43.8789 9.87368 46.1509 12.3789 47.9684C12.1825 47.3789 12.0351 46.7772 11.9368 46.1632C11.8386 45.5491 11.7895 44.9474 11.7895 44.3579C11.7895 42.786 12.0842 41.3123 12.6737 39.9368C13.2632 38.5614 14.1228 37.3088 15.2526 36.1789L23.5789 28L31.9053 36.1789C33.0351 37.3088 33.8947 38.5614 34.4842 39.9368C35.0737 41.3123 35.3684 42.786 35.3684 44.3579C35.3684 44.9474 35.3193 45.5491 35.2211 46.1632C35.1228 46.7772 34.9754 47.3789 34.7789 47.9684C37.2842 46.1509 39.2368 43.8789 40.6368 41.1526C42.0368 38.4263 42.7368 35.5158 42.7368 32.4211C42.7368 29.7684 42.1719 27.1772 41.0421 24.6474C39.9123 22.1175 38.2912 19.7965 36.1789 17.6842C35.1474 18.4211 34.0667 18.9982 32.9368 19.4158C31.807 19.8333 30.6772 20.0421 29.5474 20.0421C26.5509 20.0421 24.0702 19.0228 22.1053 16.9842C20.1403 14.9456 19.1579 12.3789 19.1579 9.28421V7.81053C16.8982 9.43158 14.8596 11.2246 13.0421 13.1895C11.2246 15.1544 9.67719 17.2053 8.4 19.3421C7.12281 21.4789 6.14035 23.6649 5.45263 25.9C4.76491 28.1351 4.42105 30.3088 4.42105 32.4211ZM23.5789 34.1895L18.3474 39.3474C17.6596 40.0351 17.1316 40.7965 16.7632 41.6316C16.3947 42.4667 16.2105 43.3754 16.2105 44.3579C16.2105 46.3719 16.9228 48.0789 18.3474 49.4789C19.7719 50.8789 21.5158 51.5789 23.5789 51.5789C25.6421 51.5789 27.386 50.8789 28.8105 49.4789C30.2351 48.0789 30.9474 46.3719 30.9474 44.3579C30.9474 43.3754 30.7632 42.4667 30.3947 41.6316C30.0263 40.7965 29.4982 40.0351 28.8105 39.3474L23.5789 34.1895ZM23.5789 0V9.72632C23.5789 11.3965 24.1561 12.7965 25.3105 13.9263C26.4649 15.0561 27.8772 15.6211 29.5474 15.6211C30.4316 15.6211 31.2544 15.4368 32.0158 15.0684C32.7772 14.7 33.4526 14.1474 34.0421 13.4105L35.3684 11.7895C39.0035 13.8526 41.8772 16.7263 43.9895 20.4105C46.1017 24.0947 47.1579 28.0982 47.1579 32.4211C47.1579 39.0035 44.8737 44.5789 40.3053 49.1474C35.7368 53.7158 30.1614 56 23.5789 56C16.9965 56 11.4211 53.7158 6.85263 49.1474C2.28421 44.5789 0 39.0035 0 32.4211C0 26.1333 2.11228 20.0789 6.33684 14.2579C10.5614 8.43684 16.3088 3.68421 23.5789 0Z"
								fill="#323238"
							/>
						</svg>
					</button>
                    </div>
                    <div className="  w-64">
                      {/* Card 4 content */}
                      <button class="cardButton">
						<svg
							width="56"
							height="56"
							viewBox="0 0 56 56"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M53.0812 24.9667V51.3333C53.0812 52.5778 52.6633 53.6667 51.8274 54.6C50.9916 55.5333 50.0164 56 48.9019 56H7.03872C5.92423 56 4.94905 55.5333 4.11318 54.6C3.27731 53.6667 2.85937 52.5778 2.85937 51.3333V24.9667C1.55913 23.7222 0.700041 22.1926 0.282106 20.3778C-0.135829 18.563 -0.0893918 16.7481 0.421418 14.9333L3.41662 4.43333C3.78812 3.03333 4.43824 1.94444 5.36698 1.16667C6.29573 0.388889 7.36379 0 8.57115 0H47.0908C48.3911 0 49.5288 0.401852 50.504 1.20556C51.4792 2.00926 52.1525 3.08519 52.524 4.43333L55.5889 14.9333C56.0997 16.7481 56.1345 18.563 55.6933 20.3778C55.2522 22.1926 54.3815 23.7222 53.0812 24.9667ZM34.2742 22.5556C35.6208 22.5556 36.7586 22.063 37.6873 21.0778C38.616 20.0926 38.9875 18.9 38.8018 17.5L37.0604 4.66667H30.0948V17.5C30.0948 18.8481 30.4895 20.0278 31.279 21.0389C32.0684 22.05 33.0668 22.5556 34.2742 22.5556ZM21.2485 22.5556C22.5488 22.5556 23.6516 22.063 24.5572 21.0778C25.4627 20.0926 25.9155 18.9 25.9155 17.5V4.66667H18.9499L17.2085 17.5C17.0227 18.8481 17.3478 20.0278 18.1837 21.0389C19.0195 22.05 20.0412 22.5556 21.2485 22.5556ZM8.57115 22.5556C9.68565 22.5556 10.6492 22.1278 11.4619 21.2722C12.2745 20.4167 12.7505 19.3667 12.8898 18.1222L14.7009 4.66667H7.73528L4.53111 16.0222C4.06674 17.6296 4.25249 19.1204 5.08836 20.4944C5.92423 21.8685 7.08516 22.5556 8.57115 22.5556ZM47.3695 22.5556C48.8555 22.5556 50.028 21.8815 50.8871 20.5333C51.7462 19.1852 51.9435 17.6815 51.4792 16.0222L48.275 4.66667H41.3094L43.1205 18.1222C43.2598 19.3667 43.7358 20.4167 44.5484 21.2722C45.3611 22.1278 46.3014 22.5556 47.3695 22.5556ZM7.03872 51.3333H48.9019V27.1444C48.9483 27.1963 48.7974 27.2222 48.4491 27.2222C48.1009 27.2222 47.741 27.2222 47.3695 27.2222C46.2085 27.2222 45.1057 26.95 44.0608 26.4056C43.016 25.8611 41.9827 25.0185 40.9611 23.8778C40.2181 24.9148 39.2894 25.7315 38.1749 26.3278C37.0604 26.9241 35.8298 27.2222 34.4831 27.2222C33.09 27.2222 31.8943 27.0019 30.8959 26.5611C29.8975 26.1204 28.9339 25.3815 28.0051 24.3444C27.3086 25.2778 26.4263 25.9907 25.3582 26.4833C24.2902 26.9759 23.0828 27.2222 21.7361 27.2222C20.2966 27.2222 19.0195 26.937 17.905 26.3667C16.7905 25.7963 15.8386 24.9667 15.0491 23.8778C13.9347 24.9667 12.8434 25.7963 11.7753 26.3667C10.7073 26.937 9.63921 27.2222 8.57115 27.2222C8.24609 27.2222 7.93264 27.2222 7.6308 27.2222C7.32896 27.2222 7.1316 27.1963 7.03872 27.1444V51.3333ZM48.9019 51.3333H7.03872C7.1316 51.3333 7.32896 51.3333 7.6308 51.3333C7.93264 51.3333 8.24609 51.3333 8.57115 51.3333C9.36059 51.3333 10.3009 51.3333 11.3922 51.3333C12.4835 51.3333 13.7025 51.3333 15.0491 51.3333C15.4671 51.3333 15.9315 51.3333 16.4423 51.3333C16.9531 51.3333 17.4987 51.3333 18.0792 51.3333C18.6596 51.3333 19.2517 51.3333 19.8554 51.3333C20.4591 51.3333 21.086 51.3333 21.7361 51.3333C22.2469 51.3333 22.781 51.3333 23.3382 51.3333C23.8954 51.3333 24.4527 51.3333 25.0099 51.3333C25.5672 51.3333 26.1012 51.3333 26.612 51.3333C27.1228 51.3333 27.5872 51.3333 28.0051 51.3333C29.0268 51.3333 30.0484 51.3333 31.07 51.3333C32.0916 51.3333 33.2293 51.3333 34.4831 51.3333C35.1333 51.3333 35.7718 51.3333 36.3987 51.3333C37.0256 51.3333 37.6176 51.3333 38.1749 51.3333C38.7321 51.3333 39.243 51.3333 39.7073 51.3333C40.1717 51.3333 40.5896 51.3333 40.9611 51.3333C42.0292 51.3333 43.0972 51.3333 44.1653 51.3333C45.2334 51.3333 46.3014 51.3333 47.3695 51.3333C47.741 51.3333 48.1009 51.3333 48.4491 51.3333C48.7974 51.3333 48.9483 51.3333 48.9019 51.3333Z"
								fill="#323238"
							/>
						</svg>
					</button>
                    </div>
          </div>

    <div className=" flex flex-col items-center justify-center pb-32 min-h-screen bg-black">
      
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
    </div>
    </>
  );
}

export default App;
