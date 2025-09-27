
interface CabinetOfficeLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function CabinetOfficeLogo({ width = 48, height = 48, className }: CabinetOfficeLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Cabinet Office Logo"
    >
      <defs>
        <linearGradient id="coRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#8b0000" />
        </linearGradient>
      </defs>
      
      {/* Cabinet Office Background */}
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="url(#coRed)"
        stroke="#FFD700"
        strokeWidth="2"
      />
      
      {/* Royal Crown - Central */}
      <g transform="translate(24, 16)">
        <path
          d="M-8 0L-6 -6L-3 -3L0 -7L3 -3L6 -6L8 0V3H-8V0Z"
          fill="#FFD700"
        />
        {/* Crown jewels */}
        <circle cx="-6" cy="-6" r="1" fill="#FFD700" />
        <circle cx="0" cy="-7" r="1.2" fill="#FFD700" />
        <circle cx="6" cy="-6" r="1" fill="#FFD700" />
        {/* Cross on top */}
        <path
          d="M-1 -7H1V-9H-1V-7Z M0 -10H0 -8V-6H0V-10Z"
          fill="#FFD700"
        />
      </g>
      
      {/* Government Building Columns */}
      <g transform="translate(24, 28)">
        <rect x="-8" y="0" width="2" height="8" fill="white" />
        <rect x="-3" y="0" width="2" height="8" fill="white" />
        <rect x="2" y="0" width="2" height="8" fill="white" />
        <rect x="7" y="0" width="2" height="8" fill="white" />
        {/* Base */}
        <rect x="-10" y="8" width="20" height="2" fill="white" />
      </g>
      
      {/* Cabinet Office Text */}
      <text
        x="24"
        y="42"
        textAnchor="middle"
        fill="#FFD700"
        fontSize="5"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        CABINET OFFICE
      </text>
    </svg>
  );
}