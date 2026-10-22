import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'emblem' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  // Dimensions
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const isLight = variant === 'white';

  const emblem = (
    <div className={`relative ${emblemSizes[size]} shrink-0 flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          <linearGradient id="vsRedGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E31B2F" />
            <stop offset="0.6" stopColor="#C8101E" />
            <stop offset="1" stopColor="#760B16" />
          </linearGradient>
          <linearGradient id="vsSilverGrad" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#E8ECEF" />
            <stop offset="1" stopColor="#CAD1D9" />
          </linearGradient>
          <filter id="shadowRed" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#760B16" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Global Sphere in bottom-center loop of S */}
        <circle cx="58" cy="62" r="16" fill="url(#vsSilverGrad)" stroke="#C8101E" strokeWidth="1" />
        <path
          d="M48 56 C52 52, 64 52, 68 56 M44 62 C50 60, 66 60, 72 62 M48 68 C52 72, 64 72, 68 68"
          stroke="#C8101E"
          strokeWidth="1.2"
          strokeOpacity="0.7"
          fill="none"
        />
        <ellipse cx="58" cy="62" rx="7" ry="15" stroke="#C8101E" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />

        {/* The 'V' Glyph - Bold, sharp, metallic red */}
        <path
          d="M18 20 L35 76 L48 76 L32 20 Z"
          fill="url(#vsRedGrad)"
          filter="url(#shadowRed)"
        />

        {/* The 'S' Glyph & Sweeping flight path */}
        <path
          d="M45 28 C55 16, 76 16, 82 27 C87 35, 80 44, 66 48 C50 52, 42 62, 46 72 C50 82, 70 82, 78 74 L73 66 C67 71, 54 71, 52 65 C50 59, 58 54, 72 50 C86 45, 95 35, 89 23 C82 10, 56 10, 42 22 Z"
          fill="url(#vsRedGrad)"
          filter="url(#shadowRed)"
        />

        {/* Soaring Flight Trail across V & S */}
        <path
          d="M26 52 Q50 45, 85 22"
          stroke="url(#vsRedGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Supersonic Jet Icon at tip of flight trail */}
        <path
          d="M86 21 L94 17 L90 25 L88 23 L85 25 L86 21 Z"
          fill="#C8101E"
        />
      </svg>
    </div>
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {emblem}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-[1px] bg-[#C8101E] opacity-60"></span>
          <span
            className={`text-[9px] tracking-[0.28em] uppercase font-bold ${
              isLight ? 'text-white/90' : 'text-[#760B16]'
            }`}
          >
            THE VISA
          </span>
          <span className="w-2.5 h-[1px] bg-[#C8101E] opacity-60"></span>
        </div>
        <span
          className={`font-serif-brand font-bold tracking-[0.08em] leading-none ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${isLight ? 'text-white' : 'text-[#C8101E]'}`}
        >
          SYNDICATE
        </span>
        <span
          className={`text-[6.5px] tracking-[0.16em] uppercase font-medium mt-0.5 ${
            isLight ? 'text-white/70' : 'text-[#6B7078]'
          }`}
        >
          YOUR GLOBAL JOURNEY. OUR GUIDANCE.
        </span>
      </div>
    </div>
  );
};
