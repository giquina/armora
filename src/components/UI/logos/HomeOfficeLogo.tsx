
interface HomeOfficeLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function HomeOfficeLogo({ width = 48, height = 48, className }: HomeOfficeLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Home Office Logo"
    >
      <defs>
        <linearGradient id="hoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f4e8c" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
      </defs>
      
      {/* Home Office Crest Background */}
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="4"
        fill="url(#hoBlue)"
        stroke="#FFD700"
        strokeWidth="1"
      />
      
      {/* Royal Crown */}
      <g transform="translate(24, 12)">
        <path
          d="M-6 0L-4 -4L-2 -2L0 -4L2 -2L4 -4L6 0V2H-6V0Z"
          fill="#FFD700"
        />
        <circle cx="-4" cy="-4" r="0.8" fill="#FFD700" />
        <circle cx="0" cy="-4" r="0.8" fill="#FFD700" />
        <circle cx="4" cy="-4" r="0.8" fill="#FFD700" />
      </g>
      
      {/* Shield */}
      <path
        d="M24 16L16 20V26C16 30 20 34 24 36C28 34 32 30 32 26V20L24 16Z"
        fill="white"
        stroke="#1f4e8c"
        strokeWidth="1"
      />
      
      {/* Home Office Text */}
      <text
        x="24"
        y="42"
        textAnchor="middle"
        fill="#FFD700"
        fontSize="6"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        HOME OFFICE
      </text>
    </svg>
  );
}