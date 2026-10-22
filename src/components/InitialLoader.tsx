import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface InitialLoaderProps {
  onComplete: () => void;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const seen = sessionStorage.getItem('tvs_loader_seen');
    if (seen) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        sessionStorage.setItem('tvs_loader_seen', 'true');
        onComplete();
      }, 500);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#FAF8F6] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-700">
        <BrandLogo size="xl" />
        <div className="w-48 h-[2px] bg-slate-200 overflow-hidden rounded-full mt-4">
          <div className="w-full h-full bg-[#C8101E] animate-[pulseGlow_1.5s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};
