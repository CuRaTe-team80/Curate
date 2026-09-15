import { useState, useEffect } from 'react';
import './SplashScreen.css';

function SplashScreen(props) {
  const onFinish = props.onFinish;
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(function () {
    var fadeTimer = setTimeout(function () {
      setFadingOut(true);
    }, 1800);

    var finishTimer = setTimeout(function () {
      if (onFinish) onFinish();
    }, 2300);

    return function () {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={'splash-screen' + (fadingOut ? ' splash-fade-out' : '')}>
      <div className="splash-glow" />

      <div className="splash-mark">
        <svg viewBox="0 0 100 100" width="88" height="88" aria-hidden="true">
          <g transform="translate(50,50)">
            <rect className="splash-diamond splash-diamond-1" x="-23" y="-23" width="30" height="30" rx="3" transform="rotate(45)" fill="#0a5a61" opacity="0.9" />
            <rect className="splash-diamond splash-diamond-2" x="-15" y="-15" width="26" height="26" rx="3" transform="rotate(45)" fill="#0e7c86" opacity="0.92" />
            <rect className="splash-diamond splash-diamond-3" x="-8" y="-8" width="21" height="21" rx="3" transform="rotate(45)" fill="#4fd0db" />
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
