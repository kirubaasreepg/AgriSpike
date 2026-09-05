import React from 'react';

export default function PandaMascot({ awake = false }) {
  return (
    <div style={{
      width: 140,
      height: 120,
      margin: '0 auto -12px auto',
      position: 'relative',
      transition: 'transform 0.5s ease',
      transform: awake ? 'scale(1.05) translateY(-4px)' : 'scale(1) translateY(0)',
    }}>
      <svg viewBox="0 0 160 140" width="100%" height="100%">
        {/* Ears */}
        <circle cx="35" cy="36" r="22" fill="#0f172a" />
        <circle cx="35" cy="36" r="12" fill="#334155" />
        <circle cx="125" cy="36" r="22" fill="#0f172a" />
        <circle cx="125" cy="36" r="12" fill="#334155" />

        {/* Head */}
        <ellipse cx="80" cy="74" rx="58" ry="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {/* Left Eye Patch */}
        <ellipse cx="54" cy="70" rx="17" ry="20" fill="#0f172a" transform="rotate(-15 54 70)" />
        {/* Right Eye Patch */}
        <ellipse cx="106" cy="70" rx="17" ry="20" fill="#0f172a" transform="rotate(15 106 70)" />

        {/* Eyes: Sleeping slits vs Wide Open Awake Eyes */}
        {!awake ? (
          // Sleeping curved eyelid lines
          <g stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 45 72 Q 54 77 63 72" />
            <path d="M 97 72 Q 106 77 115 72" />
          </g>
        ) : (
          // Awake, bright shiny eyes with reflection pupils
          <g>
            {/* Left Eye */}
            <circle cx="55" cy="69" r="9" fill="#15803d" />
            <circle cx="55" cy="69" r="6" fill="#022c22" />
            <circle cx="53" cy="67" r="2.5" fill="#ffffff" />
            <circle cx="57" cy="71" r="1" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="105" cy="69" r="9" fill="#15803d" />
            <circle cx="105" cy="69" r="6" fill="#022c22" />
            <circle cx="103" cy="67" r="2.5" fill="#ffffff" />
            <circle cx="107" cy="71" r="1" fill="#ffffff" />
          </g>
        )}

        {/* Nose */}
        <path d="M 74 84 Q 80 81 86 84 Q 80 92 74 84 Z" fill="#0f172a" />
        <circle cx="80" cy="85" r="2" fill="#475569" />

        {/* Mouth */}
        <path d="M 76 92 Q 80 96 84 92" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheeks when awake */}
        {awake && (
          <g fill="#f43f5e" opacity="0.35">
            <ellipse cx="40" cy="85" rx="8" ry="5" />
            <ellipse cx="120" cy="85" rx="8" ry="5" />
          </g>
        )}

        {/* Paws */}
        <ellipse cx="44" cy="120" rx="14" ry="12" fill="#0f172a" />
        <ellipse cx="116" cy="120" rx="14" ry="12" fill="#0f172a" />
      </svg>
    </div>
  );
}
