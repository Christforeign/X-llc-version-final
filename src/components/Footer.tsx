import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="font-black text-sm text-white tracking-wider">X GROUP DIGITAL</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400 text-xs">Boutique & Services Numériques</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-400">
          <button onClick={() => onNavigate('/')} className="hover:text-amber-400 transition-colors cursor-pointer">
            Accueil
          </button>
          <button onClick={() => onNavigate('/autres')} className="hover:text-amber-400 transition-colors cursor-pointer">
            Catalogue
          </button>
          <button onClick={() => onNavigate('/services')} className="hover:text-amber-400 transition-colors cursor-pointer">
            Services & Shein
          </button>
          <button onClick={() => onNavigate('/support')} className="hover:text-amber-400 transition-colors cursor-pointer text-neutral-300 font-semibold">
            Support & FAQ
          </button>
          <button onClick={() => onNavigate('/solidarite')} className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-bold flex items-center gap-1">
            <span>💛</span> Aider en difficulté
          </button>
          <button onClick={() => onNavigate('/theme-wordpress')} className="hover:text-amber-400 transition-colors cursor-pointer">
            Thème WordPress (.ZIP)
          </button>
          <button onClick={() => onNavigate('/cart')} className="hover:text-amber-400 transition-colors cursor-pointer">
            Panier
          </button>
        </div>

        <p className="text-neutral-500 text-[11px]">
          © {new Date().getFullYear()} X Group Digital. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};
