import { useEffect, useState } from 'react';

export default function Loader({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 600);
    }, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`loader${exiting ? ' loader-exit' : ''}`}>
      <svg viewBox="0 0 96 96" width="88" height="88" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lg-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0a500" />
            <stop offset="100%" stopColor="#ffbd2e" />
          </linearGradient>
          <linearGradient id="lg-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a7cff" />
            <stop offset="100%" stopColor="#7aa3ff" />
          </linearGradient>
          <filter id="glow-f" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer rotating ring */}
        <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(240,165,0,.08)" strokeWidth="1.5"/>
        <circle cx="48" cy="48" r="42" fill="none" stroke="url(#lg-amber)" strokeWidth="1.5"
          strokeDasharray="60 204" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate"
            from="0 48 48" to="360 48 48" dur="3s" repeatCount="indefinite"/>
        </circle>

        {/* Inner rotating ring — opposite direction */}
        <circle cx="48" cy="48" r="30" fill="none" stroke="rgba(74,124,255,.12)" strokeWidth="1"/>
        <circle cx="48" cy="48" r="30" fill="none" stroke="url(#lg-blue)" strokeWidth="1"
          strokeDasharray="30 159" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate"
            from="360 48 48" to="0 48 48" dur="4.5s" repeatCount="indefinite"/>
        </circle>

        {/* Neural network edges */}
        <line x1="48" y1="18" x2="22" y2="70" stroke="rgba(240,165,0,0.2)" strokeWidth="1.2"/>
        <line x1="48" y1="18" x2="74" y2="70" stroke="rgba(74,124,255,0.2)" strokeWidth="1.2"/>
        <line x1="22" y1="70" x2="74" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2"/>

        {/* Center node — amber pulsing */}
        <circle cx="48" cy="48" r="6" fill="url(#lg-amber)" filter="url(#glow-f)">
          <animate attributeName="r" values="5;8;5" dur="2.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.7;1" dur="2.2s" repeatCount="indefinite"/>
        </circle>

        {/* Top node */}
        <circle cx="48" cy="18" r="4" fill="#f0a500" opacity="0.9"/>
        <circle cx="48" cy="18" r="8" fill="none" stroke="#f0a500" strokeWidth="0.8" strokeOpacity="0.3">
          <animate attributeName="r" values="6;12;6" dur="2.2s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite"/>
        </circle>

        {/* Bottom left node */}
        <circle cx="22" cy="70" r="3" fill="#4a7cff" opacity="0.85">
          <animate attributeName="opacity" values="0.85;0.4;0.85" dur="3s" begin="0.8s" repeatCount="indefinite"/>
        </circle>

        {/* Bottom right node */}
        <circle cx="74" cy="70" r="3" fill="rgba(255,255,255,0.8)">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" begin="1.6s" repeatCount="indefinite"/>
        </circle>
      </svg>

      <div className="ld-logo">НЕЙРО 32</div>
      <div className="ld-bar"><div className="ld-fill" /></div>
      <div className="ld-sub">Новозыбков · ИИ-практики · 2026</div>
    </div>
  );
}
