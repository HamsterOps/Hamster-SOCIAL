import React from 'react';

export default function HamsterIcon({ size = 32, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Wheel */}
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.3" />
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.15" />
      {/* Wheel spokes */}
      <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      {/* Hamster body */}
      <ellipse cx="34" cy="36" rx="14" ry="11" fill="currentColor" opacity="0.85" />
      {/* Head */}
      <circle cx="44" cy="28" r="9" fill="currentColor" opacity="0.9" />
      {/* Ear */}
      <ellipse cx="48" cy="21" rx="4" ry="5" fill="currentColor" opacity="0.7" />
      <ellipse cx="48" cy="21" rx="2.5" ry="3.5" fill="currentColor" opacity="0.3" />
      {/* Eye */}
      <circle cx="47" cy="27" r="2" fill="white" />
      <circle cx="47.5" cy="26.8" r="1" fill="#01311a" />
      {/* Nose */}
      <ellipse cx="52" cy="29" rx="1.5" ry="1" fill="#943333" opacity="0.8" />
      {/* Cheek */}
      <circle cx="45" cy="31" r="2.5" fill="currentColor" opacity="0.5" />
      {/* Front legs */}
      <ellipse cx="42" cy="42" rx="3" ry="4" fill="currentColor" opacity="0.75" transform="rotate(-15 42 42)" />
      {/* Back legs */}
      <ellipse cx="24" cy="42" rx="3.5" ry="4" fill="currentColor" opacity="0.75" transform="rotate(15 24 42)" />
      {/* Tail */}
      <path d="M20 36 Q14 32 16 28" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
    </svg>
  );
}