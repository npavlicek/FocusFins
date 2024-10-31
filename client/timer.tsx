import React, { useEffect, useState } from 'react';

export default function Timer(params: any) {
  const [timeLimit, setTimeLimit] = useState(1); // Default: 1 minute
  const [timeLeft, setTimeLeft] = useState({ minutes: params.timeLimit, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [offset, setOffset] = useState(283); // Full circle dash array at start

  const FULL_DASH_ARRAY = 420; // Full circumference of the circle

  useEffect(() => {
    // Reset the timer when time limit changes
    setTimeLeft({ minutes: timeLimit, seconds: 0 });
    setOffset(FULL_DASH_ARRAY); // Reset the circle to full
    setIsRunning(false); // Stop the timer if the time limit changes
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
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const totalSeconds = timeLimit * 60;
    const remainingSeconds = timeLeft.minutes * 60 + timeLeft.seconds;
    const newOffset = FULL_DASH_ARRAY * (1 - remainingSeconds / totalSeconds);
    setOffset(newOffset);
  }, [timeLeft, timeLimit]);

  const handleTimeLimitChange = (e: { target: { value: string; }; }) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit >= 0) {
      setTimeLimit(newLimit);
    }
  };

  const handleStart = () => {
    if (timeLeft.minutes > 0 || timeLeft.seconds > 0) {
      setIsRunning(true);
    }
  };

  return (
    <div className="timer-container">
      <div className="timer">
        <svg>
          <circle cx="50%" cy="50%" r="45%" className="circle-background" />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="circle-foreground"
            style={{
              strokeDasharray: FULL_DASH_ARRAY,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="time-display">
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
      <div className="controls">
        <label>
          Set Timer (minutes):{' '}
          <input
            type="number"
            min="0"
            value={timeLimit}
            onChange={handleTimeLimitChange}
          />
        </label>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
      </div>
    </div>
  );
}
