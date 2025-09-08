import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Government Licensed - SIA Authority
export function GovernmentIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Government Building Icon */}
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v2" />
      <path d="M9 13v2" />
      <path d="M9 17v2" />
    </svg>
  );
}

// Home Office Approved - Security Standards
export function HomeOfficeIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Shield with Checkmark */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// Cabinet Office Verified - VIP Protection
export function CabinetOfficeIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Star Badge */}
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

// TfL Licensed - Transport for London
export function TfLIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Transport/Car Icon */}
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10c-.4-.2-.8-.3-1.3-.3H16.8L15.5 7.5c-.3-.4-.8-.5-1.2-.5h-4.6c-.4 0-.9.1-1.2.5L7.2 9.7H5.9c-.5 0-.9.1-1.3.3L2.5 11.1C1.7 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}