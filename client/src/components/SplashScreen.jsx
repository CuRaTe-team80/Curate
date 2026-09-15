import { useState, useEffect } from 'react';
import './SplashScreen.css';

function SplashScreen({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1800);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen${fadingOut ? ' splash-fade-out' : ''}`}>
      <div className="splash-glow" />

      <div className="splash-mark">
        <svg viewBox="0 0 100 100" width="96" height="96" aria-hidden="true">
          <g transform="translate(50,50) rotate(45)">
            <rect className="splash-diamond splash-diamond-1" x="-22" y="-22" width="44" height="44" rx="5" />
            <rect className="splash-diamond splash-diamond-2" x="-15" y="-15" width="30" height="30" rx="4" />
            <rect className="splash-diamond splash-diamond-3" x="-8" y="-8" width="16" height="16" rx="3" />
          </g>
        </svg>
      </div>

      <h1 className="splash-name">Curate</h1>
      <p className="splash-tagline">Label data together, without losing the truth.</p>

      <div className="splash-dots">
        <span className="splash-dot" />
        <span className="splash-dot" />
        <span className="splash-dot" />
      </div>
    </div>
  );
}

export default SplashScreen;