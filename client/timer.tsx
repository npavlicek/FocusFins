import React, { useEffect, useState } from 'react';

export default function Timer({ timeLimit = 10 }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [offset, setOffset] = useState(0);

  const FULL_DASH_ARRAY = 283; // Full circumference of the circle

  useEffect(() => {
    // Calculate initial offset
    setOffset(FULL_DASH_ARRAY);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timeLimit]);

  useEffect(() => {
    // Calculate stroke-dashoffset to match time left
    const newOffset = (FULL_DASH_ARRAY * timeLeft) / timeLimit;
    setOffset(newOffset);
  }, [timeLeft, timeLimit]);

  return (
    <div className="timer">
      <svg>
        <circle cx="50%" cy="50%" r="45%" className="circle-background" />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          className="circle-foreground"
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="time-display">{timeLeft}</div>
    </div>
  );
};
