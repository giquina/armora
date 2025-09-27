import { FC } from 'react';

interface CredentialIconProps {
  type: 'sia' | 'homeoffice' | 'cabinet' | 'tfl' | 'phv' | 'cpo';
  className?: string;
}

const CredentialIcons: FC<CredentialIconProps> = ({ type, className = '' }) => {
  const baseClass = `credential-icon ${className}`;
  
  switch(type) {
    case 'sia':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="siaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#003078"/>
              <stop offset="100%" stopColor="#1e4d8b"/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#siaGradient)" rx="8"/>
          <rect x="8" y="8" width="84" height="84" fill="#ffffff" rx="4"/>
          <rect x="12" y="12" width="76" height="76" fill="url(#siaGradient)" rx="2"/>
          <path d="M25 35 L35 25 L65 25 L75 35 L75 65 L65 75 L35 75 L25 65 Z" fill="#ffffff" opacity="0.1"/>
          <text x="50" y="42" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">SIA</text>
          <text x="50" y="58" fill="#ffffff" fontSize="8" fontWeight="500" textAnchor="middle">SECURITY INDUSTRY</text>
          <text x="50" y="68" fill="#ffffff" fontSize="8" fontWeight="500" textAnchor="middle">AUTHORITY</text>
          <circle cx="85" cy="15" r="8" fill="#00ff00" opacity="0.8"/>
          <text x="85" y="19" fill="#003078" fontSize="8" fontWeight="bold" textAnchor="middle">✓</text>
        </svg>
      );
    
    case 'homeoffice':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B1538"/>
              <stop offset="100%" stopColor="#a8284a"/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#homeGradient)" rx="8"/>
          <path d="M50 15 L75 30 L75 60 L50 75 L25 60 L25 30 Z" fill="#ffffff" stroke="#8B1538" strokeWidth="2"/>
          <path d="M50 25 L65 35 L65 55 L50 65 L35 55 L35 35 Z" fill="url(#homeGradient)"/>
          <path d="M45 40 L50 35 L55 40 L55 50 L45 50 Z" fill="#ffffff"/>
          <text x="50" y="82" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">HOME OFFICE</text>
          <text x="50" y="92" fill="#ffffff" fontSize="7" fontWeight="500" textAnchor="middle">BS 7858 STANDARDS</text>
          <circle cx="85" cy="15" r="8" fill="#00ff00" opacity="0.8"/>
          <text x="85" y="19" fill="#8B1538" fontSize="8" fontWeight="bold" textAnchor="middle">✓</text>
        </svg>
      );
    
    case 'cabinet':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cabinetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#005ea5"/>
              <stop offset="100%" stopColor="#2074c7"/>
            </linearGradient>
            <radialGradient id="crownGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#FFA500"/>
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#cabinetGradient)" rx="8"/>
          <circle cx="50" cy="42" r="22" fill="#ffffff" stroke="url(#cabinetGradient)" strokeWidth="3"/>
          <path d="M50 22 L54 35 L67 35 L57 44 L61 57 L50 50 L39 57 L43 44 L33 35 L46 35 Z" fill="url(#crownGradient)" stroke="#005ea5" strokeWidth="1"/>
          <circle cx="50" cy="42" r="8" fill="none" stroke="url(#cabinetGradient)" strokeWidth="2"/>
          <text x="50" y="80" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">CABINET OFFICE</text>
          <text x="50" y="90" fill="#ffffff" fontSize="6" fontWeight="500" textAnchor="middle">VIP PROTECTION</text>
          <circle cx="85" cy="15" r="8" fill="#00ff00" opacity="0.8"/>
          <text x="85" y="19" fill="#005ea5" fontSize="8" fontWeight="bold" textAnchor="middle">✓</text>
        </svg>
      );
    
    case 'tfl':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tflGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc241f"/>
              <stop offset="100%" stopColor="#e8453c"/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="#ffffff" rx="8" stroke="#dc241f" strokeWidth="2"/>
          <circle cx="50" cy="45" r="35" fill="#ffffff" stroke="url(#tflGradient)" strokeWidth="6"/>
          <rect x="22" y="42" width="56" height="6" fill="#0019a8" rx="3"/>
          <path d="M30 30 L70 30 L65 38 L35 38 Z" fill="url(#tflGradient)"/>
          <path d="M30 52 L70 52 L65 60 L35 60 Z" fill="url(#tflGradient)"/>
          <text x="50" y="82" fill="#dc241f" fontSize="6" fontWeight="bold" textAnchor="middle">TRANSPORT FOR LONDON</text>
          <text x="50" y="92" fill="#0019a8" fontSize="6" fontWeight="500" textAnchor="middle">PRIVATE HIRE LICENSED</text>
          <circle cx="85" cy="15" r="8" fill="#00ff00" opacity="0.8"/>
          <text x="85" y="19" fill="#dc241f" fontSize="8" fontWeight="bold" textAnchor="middle">✓</text>
        </svg>
      );
    
    case 'phv':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="phvGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#006633"/>
              <stop offset="100%" stopColor="#228B22"/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#phvGradient)" rx="8"/>
          <rect x="8" y="22" width="84" height="56" rx="8" fill="#ffffff" stroke="#006633" strokeWidth="2"/>
          <rect x="12" y="26" width="76" height="48" rx="6" fill="url(#phvGradient)"/>
          <path d="M20 45 L30 45 L35 38 L65 38 L70 45 L80 45 L80 58 L75 62 L25 62 L20 58 Z" fill="#ffffff"/>
          <circle cx="32" cy="62" r="6" fill="#006633" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="68" cy="62" r="6" fill="#006633" stroke="#ffffff" strokeWidth="2"/>
          <rect x="40" y="30" width="20" height="4" fill="#ffffff" rx="2"/>
          <text x="50" y="82" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">PRIVATE HIRE VEHICLE</text>
          <text x="50" y="92" fill="#ffffff" fontSize="6" fontWeight="500" textAnchor="middle">COMMERCIAL LICENSE</text>
          <circle cx="85" cy="15" r="8" fill="#00ff00" opacity="0.8"/>
          <text x="85" y="19" fill="#006633" fontSize="8" fontWeight="bold" textAnchor="middle">✓</text>
        </svg>
      );
    
    case 'cpo':
      return (
        <svg className={baseClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cpoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e"/>
              <stop offset="100%" stopColor="#2a2a3e"/>
            </linearGradient>
            <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#DAA520"/>
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#cpoGradient)" rx="8"/>
          <circle cx="50" cy="38" r="18" fill="none" stroke="url(#goldGradient)" strokeWidth="4"/>
          <path d="M50 20 L50 56 M32 38 L68 38" stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M28 58 L50 68 L72 58" fill="none" stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="50" cy="38" r="8" fill="url(#goldGradient)" opacity="0.3"/>
          <path d="M45 33 L47 36 L53 30" stroke="url(#goldGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="50" y="82" fill="#FFD700" fontSize="6" fontWeight="bold" textAnchor="middle">CLOSE PROTECTION</text>
          <text x="50" y="92" fill="#FFD700" fontSize="6" fontWeight="500" textAnchor="middle">LEVEL 3 CERTIFIED</text>
          <circle cx="85" cy="15" r="8" fill="#00ff00" opacity="0.8"/>
          <text x="85" y="19" fill="#1a1a2e" fontSize="8" fontWeight="bold" textAnchor="middle">✓</text>
        </svg>
      );
    
    default:
      return null;
  }
};

export default CredentialIcons;