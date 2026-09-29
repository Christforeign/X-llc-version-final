import React, { useState } from 'react';
import { Gamepad2, Settings, Globe, ShieldCheck, Wallet } from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';

interface GamesPageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({ onOpenAuth, onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const siteConfig = db.getSiteConfig();
  const [iframeUrl, setIframeUrl] = useState(siteConfig.gameIframeUrl || 'https://html5games.com');
  const [isEditing, setIsEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === 'blaisechristeveste@gmail.com';

  const handleSaveIframeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSiteConfig({ gameIframeUrl: iframeUrl.trim() });
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-4 text-white">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">Portail de Jeux en Ligne</h2>
          <p className="text-xs text-neutral-400">
            Connectez-vous pour accéder à notre catalogue de jeux intégrés par iframe.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const wallet = db.getWallet(currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-neutral-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Portail de Jeux Externe (Iframe Embed)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Espace Jeux <span className="text-purple-400">& Divertissement</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Jouez directement aux meilleurs jeux HTML5 intégrés via URL externe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-neutral-400">Solde :</span>
            <span className="text-white font-mono font-bold">${wallet.balance.toFixed(2)}</span>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Settings className="w-4 h-4" />
              <span>{isEditing ? 'Fermer config' : 'Configurer URL Iframe'}</span>
            </button>
          )}
        </div>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl animate-fadeIn">
          ✓ URL Iframe des jeux mise à jour avec succès !
        </div>
      )}

      {/* Admin Iframe URL Editor */}
      {isAdmin && isEditing && (
        <form onSubmit={handleSaveIframeUrl} className="bg-neutral-900 border border-purple-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Définir l'URL du site source des jeux (Iframe)</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Entrez l'URL du site web hébergeant les jeux que vous souhaitez afficher dans cette section.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              placeholder="https://html5games.com"
              className="flex-1 px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Embedded Iframe Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Source active : {siteConfig.gameIframeUrl || iframeUrl}
          </span>
          <span className="text-[10px] text-neutral-500">Mode Iframe HTML5 sécurisé</span>
        </div>

        <div className="w-full h-[750px] bg-black relative">
          <iframe
            src={siteConfig.gameIframeUrl || iframeUrl}
            title="Jeux en ligne"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
};
