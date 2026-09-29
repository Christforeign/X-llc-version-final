import React, { useEffect, useState } from 'react';

interface LogoAssemblySplashProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const LogoAssemblySplash: React.FC<LogoAssemblySplashProps> = ({
  onFinish,
  minDuration = 2000,
}) => {
  const [isAssembling, setIsAssembling] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsAssembling(false);
      if (onFinish) onFinish();
    }, 300);
  };

  useEffect(() => {
    // 1. After assemble animation (max 2-2.5s), start fading out smoothly
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDuration);

    // 2. Completely unmount splash at 2.4s (well under 4 seconds)
    const finishTimer = setTimeout(() => {
      setIsAssembling(false);
      if (onFinish) onFinish();
    }, minDuration + 400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration, onFinish]);

  if (!isAssembling) return null;

  return (
    <div
      id="xgroup-logo-splash"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-neutral-950 transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center text-center px-4">
        {/* Assemble Container */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          {/* 4 Corner Pieces Assembling towards the Center */}
          <div className="absolute w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 animate-splash-piece-tl" />
          <div className="absolute w-8 h-8 rounded-lg bg-gradient-to-bl from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 animate-splash-piece-tr" />
          <div className="absolute w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 animate-splash-piece-bl" />
          <div className="absolute w-8 h-8 rounded-lg bg-gradient-to-tl from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 animate-splash-piece-br" />

          {/* Central 3D Luxury Logo */}
          <div className="relative z-10 w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl shadow-amber-500/40 animate-splash-core bg-black">
            <img
              src="/assets/images/xgroup-logo.jpg"
              alt="X GROUP"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Golden Pulse Glow */}
          <div className="absolute -inset-4 rounded-full bg-amber-500/20 blur-xl animate-pulse pointer-events-none" />
        </div>

        {/* Brand Name & Loading Indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-widest text-white drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">
              X GROUP
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-black shadow-md shadow-amber-400/30">
              OFFICIEL
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-medium tracking-wider uppercase">
            Initialisation du Portail Sécurisé
          </p>

          {/* Progress bar */}
          <div className="w-36 h-1 bg-neutral-800 rounded-full overflow-hidden mt-3">
            <div className="w-full h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full animate-splash-bar" />
          </div>

          {/* Bouton Passer pour ne jamais bloquer l'utilisateur */}
          <button
            onClick={handleDismiss}
            className="mt-4 text-[11px] text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 px-3 py-1 rounded-full cursor-pointer transition-colors"
          >
            Passer l'animation &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
