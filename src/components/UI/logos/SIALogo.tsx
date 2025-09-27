
interface SIALogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function SIALogo({ width = 48, height = 48, className }: SIALogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="SIA Security Industry Authority Logo"
    >
      {/* SIA Crown Symbol */}
      <defs>
        <linearGradient id="siaGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      
      {/* Shield Background */}
      <path
        d="M24 4L8 12V22C8 32 16 40 24 44C32 40 40 32 40 22V12L24 4Z"
        fill="#1a1a2e"
        stroke="url(#siaGold)"
        strokeWidth="2"
      />
      
      {/* Crown */}
      <g transform="translate(24, 18)">
        <path
          d="M-8 0L-6 -4L-4 -2L-2 -6L0 -4L2 -6L4 -2L6 -4L8 0V4H-8V0Z"
          fill="url(#siaGold)"
        />
        <circle cx="-6" cy="-4" r="1" fill="#FFD700" />
        <circle cx="0" cy="-4" r="1" fill="#FFD700" />
        <circle cx="6" cy="-4" r="1" fill="#FFD700" />
      </g>
      
      {/* SIA Text */}
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="url(#siaGold)"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        SIA
      </text>
    </svg>
  );
}