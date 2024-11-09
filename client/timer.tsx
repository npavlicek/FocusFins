import React, { useEffect, useState } from 'react';

export default function Timer(params: any) {
  const [timeLimit, setTimeLimit] = useState(25); // Default: 25 minutes for pomodoro
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 }); // Start with 25:00
  const [isRunning, setIsRunning] = useState(false);
  const [offset, setOffset] = useState(530); // Updated dash array at start for larger circle
  const [bubbles, setBubbles] = useState(0); // Bubble bank counter
  const [initialTimeLimit, setInitialTimeLimit] = useState(timeLimit); // Store time limit at start

  const FULL_DASH_ARRAY = 315; // Updated circumference for larger circle

  useEffect(() => {
    setTimeLeft({ minutes: timeLimit, seconds: 0 });
    setOffset(FULL_DASH_ARRAY);
    setIsRunning(false);
  }, [timeLimit]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const { minutes, seconds } = prev;
        if (seconds > 0) {
          return { minutes, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { minutes: minutes - 1, seconds: 59 };
        } else {
          clearInterval(interval);
          setIsRunning(false);
          setBubbles((prevBubbles) => prevBubbles + initialTimeLimit); // Add bubbles based on initial time limit
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, initialTimeLimit]);

  useEffect(() => {
    const totalSeconds = timeLimit * 60;
    const remainingSeconds = timeLeft.minutes * 60 + timeLeft.seconds;
    const newOffset = FULL_DASH_ARRAY * (1 - remainingSeconds / totalSeconds);
    setOffset(newOffset);
  }, [timeLeft, timeLimit]);

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit >= 0) {
      setTimeLimit(newLimit);
      setTimeLeft({ minutes: newLimit, seconds: 0 });
    }
  };

  const handleStart = () => {
    if ((timeLeft.minutes > 0 || timeLeft.seconds > 0) && !isRunning) {
      setIsRunning(true);
      setInitialTimeLimit(timeLimit); // Store the time limit when starting the timer
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft({ minutes: timeLimit, seconds: 0 });
    setOffset(FULL_DASH_ARRAY);
    setIsRunning(false);
  };

  return (
    <div className="timer-container">
      <div className="bubble-bank" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
        Bubbles: {bubbles}
      </div>
      <div className="timer" style={{ width: '200px', height: '200px' }}>
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" className="circle-background" />
          <circle
            cx="60"
            cy="60"
            r="50"
            className="circle-foreground"
            style={{
              strokeDasharray: FULL_DASH_ARRAY,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="time-display" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}>
  {!isRunning ? (
    <span className="time-input" style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="number"
        min="0"
        value={timeLeft.minutes}
        onChange={handleTimeLimitChange}
        style={{ marginRight: '0px' }} // Reset any default margin on the input
      />
      <span style={{ marginLeft: '-15px' }}>:{String(timeLeft.seconds).padStart(2, '0')}</span>
    </span>
  ) : (
    <>
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </>
  )}
</div>


      </div>
      <div className="controls">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '5px' }}>
          <button onClick={handleStart} disabled={isRunning}>
            Start
          </button>
          <button onClick={handleStop} disabled={!isRunning}>
            Stop
          </button>
          <button onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
