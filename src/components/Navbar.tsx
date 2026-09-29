import React, { useState, useEffect } from 'react';
import {
  Shield,
  Wallet as WalletIcon,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Lock,
  LogOut,
  Briefcase,
  Globe,
  Check,
} from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { User, Wallet } from '../models/types';
import { RoleApplicationModal } from './RoleApplicationModal';
import { useLanguage, Language } from '../context/LanguageContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenAuth, cartCount }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [wallet, setWallet] = useState<Wallet | null>(currentUser ? db.getWallet(currentUser.id) : null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleApplicationModalOpen, setRoleApplicationModalOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const unsubAuth = authService.subscribe((u) => {
      setCurrentUser(u);
      if (u) {
        setWallet(db.getWallet(u.id));
      } else {
        setWallet(null);
      }
    });

    const unsubDb = db.subscribe(() => {
      const u = authService.getCurrentUser();
      if (u) {
        setWallet(db.getWallet(u.id));
      }
    });

    return () => {
      unsubAuth();
      unsubDb();
    };
  }, []);

  const navLinks = [
    { key: 'nav_home', path: '/' },
    { key: 'nav_wp_theme', label: '📦 Thème WP (.ZIP)', path: '/theme-wordpress' },
    { key: 'nav_digital', label: 'X Group Digital', path: '/autres' },
    { key: 'nav_gsm', path: '/gsm' },
    { key: 'nav_delivery', label: 'KlikeDeliv / Chauffeur', path: '/klikedeliv' },
    { key: 'nav_shipping', path: '/shipping' },
    { key: 'nav_marketplace', path: '/marketplace', restricted: true },
    { key: 'nav_exchange', path: '/exchange', restricted: true },
    { key: 'nav_games', path: '/games', restricted: true },
    { key: 'nav_academy', label: 'Éducation & Fichiers', path: '/learning' },
    { key: 'nav_design', label: 'Services & Panier Shein', path: '/services' },
    { key: 'nav_support', label: 'Support & FAQ', path: '/support' },
    { key: 'nav_solidarite', label: '💛 Aider en difficulté', path: '/solidarite' },
    { key: 'nav_documents', path: '/documents' },
    { key: 'nav_contact', path: '/contact' },
  ];

  const handleNavClick = (path: string, restricted?: boolean) => {
    setMobileMenuOpen(false);
    if (restricted && !currentUser) {
      onOpenAuth();
      return;
    }
    onNavigate(path);
  };

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français (Principal)', flag: '🇫🇷' },
    { code: 'ht', label: 'Kreyòl Ayisyen', flag: '🇭🇹' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 text-neutral-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Clean Professional Light Contrast */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-amber-400/50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/assets/images/xgroup-logo.jpg"
                alt="X GROUP"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg tracking-wider text-neutral-900">XGROUP</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  OFFICIEL
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 tracking-tight">Enterprise & Services</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path, link.restricted)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20 font-bold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <span>{t(link.key)}</span>
                  {link.restricted && !currentUser && <Lock className="w-3 h-3 text-yellow-500/80 ml-0.5" />}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-yellow-400 transition-colors cursor-pointer"
                title="Changer de langue / Chanje lang / Change language"
              >
                <Globe className="w-3.5 h-3.5 text-yellow-400" />
                <span className="uppercase text-[11px] font-bold tracking-wider">
                  {language === 'fr' ? '🇫🇷 FR' : language === 'ht' ? '🇭🇹 HT' : '🇺🇸 EN'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-950 border border-neutral-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-850 mb-1">
                    Langue / Language
                  </div>
                  {languagesList.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                        language === item.code
                          ? 'bg-yellow-400 text-black font-bold'
                          : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {language === item.code && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>



            {/* Bouton Télécharger Thème WordPress */}
            <button
              onClick={() => onNavigate('/theme-wordpress')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Télécharger le thème WordPress officiel (ZIP)"
            >
              <span>📦</span>
              <span className="hidden md:inline">Thème WP (.ZIP)</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => onNavigate('/cart')}
              className="relative p-2 text-neutral-300 hover:text-yellow-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              title={t('nav_cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Wallet Pill (if authed) */}
            {currentUser && wallet && (
              <button
                onClick={() => onNavigate('/dashboard')}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-750 hover:border-neutral-600 text-xs transition-all cursor-pointer"
              >
                <WalletIcon className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold text-neutral-100">${wallet.balance.toFixed(2)}</span>
                {wallet.escrowBalance > 0 && (
                  <span
                    className="text-[10px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-1.5 py-0.2 rounded"
                    title="Funds in Escrow"
                  >
                    🔒 ${wallet.escrowBalance.toFixed(0)}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pl-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center text-[11px] font-black">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline-block max-w-[90px] truncate font-medium">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-neutral-950 border border-neutral-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-neutral-800 text-xs">
                      <p className="font-bold text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                          {currentUser.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('/dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white rounded-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-yellow-400" />
                        <span>{t('nav_my_account')}</span>
                      </button>

                      {/* Apply for Role Modal Trigger */}
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setRoleApplicationModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-yellow-400 rounded-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4 text-yellow-400" />
                        <span>{t('nav_apply_role')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          authService.logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav_logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-md shadow-yellow-400/20 cursor-pointer transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-black" />
                <span>{t('nav_login')}</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Flyout */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-neutral-800 bg-black/95 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path, link.restricted)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                  isActive ? 'bg-yellow-400 text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span>{t(link.key)}</span>
                {link.restricted && !currentUser && <Lock className="w-3.5 h-3.5 text-yellow-500/80" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Role Application Modal */}
      <RoleApplicationModal
        isOpen={roleApplicationModalOpen}
        onClose={() => setRoleApplicationModalOpen(false)}
      />
    </header>
  );
};
