
interface TfLLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function TfLLogo({ width = 48, height = 48, className }: TfLLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Transport for London Logo"
    >
      {/* TfL Roundel Background */}
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="#DC241F"
        stroke="#DC241F"
        strokeWidth="1"
      />
      
      {/* White Ring */}
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      
      {/* Blue Bar */}
      <rect
        x="4"
        y="20"
        width="40"
        height="8"
        fill="#0019A8"
      />
      
      {/* TfL Text */}
      <text
        x="24"
        y="26"
        textAnchor="middle"
        fill="white"
        fontSize="7"
        fontWeight="bold"
        fontFamily="'Segoe UI', Arial, sans-serif"
      >
        TfL
      </text>
      
      {/* Licensed Text */}
      <text
        x="24"
        y="42"
        textAnchor="middle"
        fill="#0019A8"
        fontSize="4"
        fontWeight="600"
        fontFamily="Arial, sans-serif"
      >
        LICENSED
      </text>
    </svg>
  );
}