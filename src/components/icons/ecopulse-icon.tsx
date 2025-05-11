// src/components/icons/ecopulse-icon.tsx
import type React from 'react';

const EcoPulseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100" // Using a 100x100 viewBox for easier coordinates
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className} // Will carry text-primary for 'currentColor'
  >
    {/* Outer Circle - uses currentColor from text-primary via className */}
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" />

    {/* Leaf shape - uses currentColor from text-primary via className */}
    {/* This path is an approximation of the leaf in the logo image */}
    <path
      d="M60 20 C 50 22, 40 30, 32 40 C 20 55, 22 70, 35 80 C 38 75, 45 65, 55 58 C 75 45, 80 30, 60 20 Z"
      fill="currentColor"
    />

    {/* Pulse Line - uses a contrasting color, primary-foreground often works well */}
    <path
      d="M28 55 L40 55 L46 45 L54 62 L60 52 L72 52"
      stroke="hsl(var(--primary-foreground))" // Contrast color for the pulse line
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EcoPulseIcon;
