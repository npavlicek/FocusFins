import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Timer({ username }: { username: string }) {
  const [timeLimit, setTimeLimit] = useState({ minutes: 25, seconds: 0 });
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [offset, setOffset] = useState(530);
  const [bubbles, setBubbles] = useState(0);
  const [initialTimeLimit, setInitialTimeLimit] = useState(timeLimit);
  const navigate = useNavigate();

  const FULL_DASH_ARRAY = 315;

  useEffect(() => {
    const savedBubbles = localStorage.getItem(`bubbles_${username}`);
    if (savedBubbles) {
      setBubbles(Number(savedBubbles));
    }
  }, [username]);

  useEffect(() => {
    localStorage.setItem(`bubbles_${username}`, bubbles.toString());
  }, [bubbles, username]);

  useEffect(() => {
    setTimeLeft(timeLimit);
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
          setBubbles((prevBubbles) => prevBubbles + initialTimeLimit.minutes);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, initialTimeLimit]);

  useEffect(() => {
    const totalSeconds = timeLimit.minutes * 60 + timeLimit.seconds;
    const remainingSeconds = timeLeft.minutes * 60 + timeLeft.seconds;
    const newOffset = FULL_DASH_ARRAY * (1 - remainingSeconds / totalSeconds);
    setOffset(newOffset);
  }, [timeLeft, timeLimit]);

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(e.target.value, 10);
    if (!isNaN(newMinutes) && newMinutes >= 0) {
      setTimeLimit({ minutes: newMinutes, seconds: 0 });
      setTimeLeft({ minutes: newMinutes, seconds: 0 });
    }
  };

  const handleStart = () => {
    if ((timeLeft.minutes > 0 || timeLeft.seconds > 0) && !isRunning) {
      setIsRunning(true);
      setInitialTimeLimit(timeLimit);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(timeLimit);
    setOffset(FULL_DASH_ARRAY);
    setIsRunning(false);
  };

  const handleLogout = () => {
    /* any other logout functions would go here */
    navigate('/login');
  };

  const handleStore = () => {
    navigate('/store');
  };

  return (
    <div className="timer-container">
      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      {/* Store Button */}
      <button onClick={handleStore} className="store-button" style={{ marginLeft: '10px' }}>
      Store
      </button>

      {/* Bubble Bank Display */}
      <div className="bubble-bank" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
        Bubble Bank: {bubbles} 🫧
      </div>

      {/* Timer Display */}
      <div className="timer">
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
        <div className={`time-display ${isRunning ? 'time-center' : 'time-left'}`}>
          {!isRunning ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '-10px' }}>
              <input
                type="number"
                min="0"
                id="minutesInput"
                value={timeLeft.minutes}
                onChange={handleMinuteChange}
                style={{
                  width: '40px',
                  textAlign: 'left',
                  fontSize: '2rem',
                  appearance: 'textfield',
                  color: 'transparent',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '2rem', marginLeft: '-60px', marginRight: '5px' }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '2rem', margin: '0 5px' }}>:</span>
              <span style={{ fontSize: '2rem', minWidth: '50px', textAlign: 'center' }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          ) : (
            <>
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </>
          )}
        </div>
      </div>

      {/* Control Buttons */}
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
