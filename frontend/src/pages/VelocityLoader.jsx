import React, { useState, useEffect } from 'react';
import './VelocityLoader.css';

function VelocityLoader({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Elegant, snappy duration (1.4 seconds)
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // Smooth exit fade
    }, 1400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`velocity-loader ${isExiting ? 'exit' : ''}`}
      onClick={() => {
        setIsExiting(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }}
    >
      <div className="loader-glow"></div>

      <div className="loader-center">
        {/* Sleek Minimal Emblem */}
        <div className="loader-logo-mark">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.25" />
          </svg>
        </div>

        {/* Minimal Clean Typography */}
        <h1 className="loader-brand-name">VELOCITY</h1>

        {/* Cool Glowing Speed Line */}
        <div className="loader-line-track">
          <div className="loader-line-beam"></div>
        </div>
      </div>
    </div>
  );
}

export default VelocityLoader;
