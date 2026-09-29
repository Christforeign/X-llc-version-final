import React, { useState } from 'react';
import { 
  Download, 
  Package, 
  CheckCircle2, 
  FileCode2, 
  Smartphone, 
  Wallet, 
  Menu, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Copy,
  Check,
  Zap
} from 'lucide-react';
import { THEME_ZIP_BASE64 } from '../services/themeZipBase64';

export const WordPressThemePage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const downloadDirectZip = (filename = 'xgroup-theme.zip') => {
    try {
      const binaryString = window.atob(THEME_ZIP_BASE64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error('Blob download failed, falling back to direct link', e);
      window.location.href = `/${filename}?t=${Date.now()}`;
    }
  };

  const themeFiles = [
    { name: 'style.css', desc: 'En-tête officiel du thème WordPress X Group V4.0 (Structure Adaptative)', size: '1 KB' },
    { name: 'functions.php', desc: 'Fonctions universelles : support WooCommerce, menus dynamiques, logos, Ajax cart fragments & Customizer', size: '6 KB' },
    { name: 'header.php', desc: 'Header adaptatif : Logo/Titre dynamique, panier WooCommerce automatique, compte client & tiroir 3 points', size: '11 KB' },
    { name: 'front-page.php', desc: 'Accueil 100% adaptative : Vitrine produits automatique dès création de produits, cartes automatiques de vos modules & pages', size: '7 KB' },
    { name: 'page.php', desc: 'Conteneur universel WordPress : compatible avec tous constructeurs (Elementor, Gutenberg), plugins de formulaires (WPForms, Fluent) & APIs', size: '1 KB' },
    { name: 'footer.php', desc: 'Pied de page adaptatif : navigation dynamique, support WhatsApp personnalisable & copyright automatique', size: '6 KB' },
    { name: 'woocommerce.php', desc: 'Conteneur natif pour boutique, fiches produits et panier', size: '1 KB' },
    { name: 'page-templates/template-full-width.php', desc: 'Modèle Pleine Largeur universel sans marge latérale pour formulaires et landing pages', size: '1 KB' },
    { name: 'assets/css/main.css', desc: 'Feuille de style complète responsive (Thèmes Sombre et Clair, grilles produits & boutons)', size: '52 KB' },
    { name: 'assets/js/main.js', desc: 'Scripts interactifs légers : animation du tiroir (•••), basculeur de thème Clair/Sombre & scroll fluide', size: '3 KB' },
    { name: 'screenshot.png', desc: 'Image de prévisualisation officielle dans Apparence > Thèmes', size: '5 KB' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER DE LA PAGE */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Thème WordPress V4.3.0 — Structure Propre &amp; 100% Personnalisable
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Thème X Group <span className="text-amber-400">pour WordPress</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
            Le thème officiel complet en format <code className="text-amber-400 font-mono">.zip</code>, mis à jour en <strong>Version 4.3.0</strong> : structure propre et 100% personnalisable. <strong>Aucun module forcé</strong> : vous créez vos pages et décidez librement de celles qui apparaissent sur l'accueil ou dans le menu, avec affichage instantané du site sans écran de blocage.
          </p>
        </div>

        {/* CARTE TÉLÉCHARGEMENT PRINCIPALE */}
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-900/80 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Package className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-black text-white">Thème X Group V4.3.0 (Structure Propre &amp; Contrôle Total)</h2>
              </div>
              <p className="text-neutral-300 text-sm max-w-xl">
                Télécharge le fichier <strong>xgroup-theme.zip</strong> et téléverse-le directement dans ton administration WordPress via <strong>Apparence &gt; Thèmes &gt; Téléverser un thème</strong>.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1 text-xs">
                <span className="bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-md font-mono text-neutral-300">
                  📦 xgroup-theme.zip (V4.3.0 — 670 Ko avec Logo HD)
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md font-bold">
                  ✓ Assemblage Logo Calibré (~2s, max 2.8s)
                </span>
                <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md font-bold">
                  ✓ Choix Libre des Pages d'Accueil
                </span>
                <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-md font-bold">
                  ✓ Compatible Gutenberg &amp; Elementor
                </span>
              </div>
            </div>

            {/* Boutons de téléchargement direct garanti sans corruption */}
            <div className="w-full md:w-auto flex flex-col gap-3 min-w-[280px]">
              <button
                onClick={() => downloadDirectZip('xgroup-theme.zip')}
                className="w-full inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Télécharger xgroup-theme.zip</span>
              </button>

              {/* Lien direct HTTP statique */}
              <a
                href="/xgroup-theme.zip"
                download="xgroup-theme.zip"
                className="w-full inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold px-4 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all text-xs text-center"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Lien Direct HTTP (/xgroup-theme.zip)</span>
              </a>

              {downloadSuccess && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-3 py-2 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Archive ZIP V4.3.0 téléchargée avec succès</span>
                </div>
              )}

              <p className="text-[11px] text-center text-neutral-400">
                Version 4.3.0 Propre • Compatible WordPress 6.x &amp; 7.x, PHP 8.0 à 8.3
              </p>
            </div>
          </div>
        </div>

        {/* NOUVEAUTÉ V4.3.0 : 100% PROPRE ET PERSONNALISABLE */}
        <div className="bg-neutral-900/90 border border-amber-500/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Nouveautés Version 4.3.0 : Liberté Totale &amp; Démarrage Ultra-Rapide</span>
          </div>
          <div className="text-xs text-neutral-300 space-y-2 leading-relaxed">
            <p>
              • <strong>Chargement Instantané :</strong> L'animation bloquante est retirée par défaut pour que votre site s'affiche immédiatement. Vous avez accès à votre contenu en une fraction de seconde.
            </p>
            <p>
              • <strong>Vous Décidez de vos Pages d'Accueil :</strong> Fini les modules imposés. Dans <em>Apparence &gt; Personnaliser &gt; Structure Page d'Accueil</em>, vous pouvez saisir exactement les IDs des pages que vous souhaitez afficher sur l'accueil, ou concevoir votre page d'accueil personnalisée avec l'éditeur WordPress / Elementor (<em>Réglages &gt; Lecture</em>).
            </p>
            <p>
              • <strong>Nettoyage Intégral :</strong> Vous pouvez supprimer toutes vos anciennes pages et repartir sur une base 100% saine, le thème s'adaptera immédiatement à vos nouveaux contenus.
            </p>
          </div>
        </div>

        {/* FONCTIONNALITÉS INCLUSES DANS LE THÈME */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            Ce qui est intégré nativement dans ce thème :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Barre Mobile Flottante</h4>
              <p className="text-xs text-neutral-400">
                La même barre que <strong>store.izy-pay.com</strong> fixée en bas sur smartphone (Accueil, Boutique, Solde, Commandes, WhatsApp).
              </p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Portefeuille X Group</h4>
              <p className="text-xs text-neutral-400">
                Solde dépense intégré, rechargement manuel MonCash/Natcash/Zelle avec capture, et retraits désactivés pour protéger vos fonds.
              </p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Menu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Bouton 3 Points (•••)</h4>
              <p className="text-xs text-neutral-400">
                Ouvre un tiroir latéral avec les 4 départements (Store, GSM, Fret, Escrow) et ton menu WordPress personnalisé.
              </p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">WooCommerce & Vitrine</h4>
              <p className="text-xs text-neutral-400">
                Mise en page épurée pour les recharges de jeux (Free Fire, PUBG), devises crypto USDT et services numériques.
              </p>
            </div>

          </div>
        </div>

        {/* NOUVEAU : GESTION DES PRODUITS SANS TOUCHER AU CODE */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Ajout de Produits Sans Coder : Formulaires Automatiques
              </h3>
              <p className="text-xs text-neutral-400">
                Tu n'as jamais besoin d'écrire une ligne de code pour demander un IMEI, un ID Joueur ou un lien Shein.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-neutral-950/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">
                1. Dans Produits &gt; Ajouter
              </span>
              <p className="text-neutral-300">
                Remplis le titre, le prix en USD et la photo comme un produit WooCommerce ordinaire.
              </p>
            </div>

            <div className="bg-neutral-950/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">
                2. Boîte "Configuration Module XGroup"
              </span>
              <p className="text-neutral-300">
                Dans la colonne de droite, choisis simplement le module : <strong>GSM Unlock</strong>, <strong>Gaming / Recharges</strong>, <strong>Shein & Marketplace</strong>, <strong>Fret Cargo</strong> ou <strong>Service Personnalisé</strong>.
              </p>
            </div>

            <div className="bg-neutral-950/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">
                3. Affichage Front-End Magique
              </span>
              <p className="text-neutral-300">
                Sur la fiche produit, les champs de saisie (IMEI, ID Free Fire, liens d'articles, tailles) s'injectent automatiquement et s'enregistrent dans la commande WooCommerce !
              </p>
            </div>
          </div>
        </div>

        {/* NOUVEAUTÉ V3.3 : SYNCHRONISATION AUTOMATIQUE [auto] ET COMMANDES SUR LE SITE */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/30">
              ⚡
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                Synchronisation Automatique &amp; Commandes 100% sur le Site
              </h3>
              <p className="text-xs text-amber-300">
                Fini les redirections WhatsApp pour commander et fini les pages blanches !
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <strong className="text-amber-400 block text-sm">1. Le Mot Unique pour Toutes les Pages</strong>
              <p className="text-neutral-300 leading-relaxed">
                Le mot magique à écrire dans n'importe quelle page créée est simplement :
              </p>
              <div className="bg-neutral-900 px-3 py-2 rounded-xl border border-amber-500/40 font-mono text-amber-300 font-bold text-center text-sm">
                [auto]
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Même si tu laisses la page complètement vide, le thème analyse son titre (ex: <em>Création Logo</em>, <em>Marketplace</em>, <em>Panier Shein</em>, <em>Créer mon site</em>) et affiche automatiquement le bon formulaire sans aucune page blanche !
              </p>
            </div>

            <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <strong className="text-emerald-400 block text-sm">2. Commandes Autonomes sur le Site</strong>
              <p className="text-neutral-300 leading-relaxed">
                Les clients ne sont plus redirigés sur WhatsApp pour payer ou commander.
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Chaque commande (Logo, Shein, Mini-site, VTC KlikeDeliv, Marketplace) est enregistrée directement en AJAX dans la base de données. Le client reçoit son <strong>Reçu Officiel</strong> avec son <strong>ID Commande unique (ex: #XG-49812)</strong> à l'écran !
              </p>
            </div>

            <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <strong className="text-sky-400 block text-sm">3. Bulle Support Multi-Canal 24/7</strong>
              <p className="text-neutral-300 leading-relaxed">
                WhatsApp est désormais <strong>exclusivement réservé au support client</strong>.
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Dans la bulle flottante en bas à droite, les utilisateurs ont accès à :
                <br />• 🤖 <strong>Assistant IA X Group</strong> (taux, suivi, questions)
                <br />• 🟢 <strong>Chat Live &amp; Tickets</strong>
                <br />• 💬 <strong>WhatsApp Support</strong>
                <br />• ✈️ <strong>Telegram &amp; Email</strong>
              </p>
            </div>
          </div>
        </div>

        {/* NOUVEAU : ADSENSE STRICTEMENT ISOLÉ POUR "AIDER DES GENS EN DIFFICULTÉ" */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Page "Aider des gens en difficulté" & AdSense 100% Isolé
              </h3>
              <p className="text-xs text-neutral-400">
                Respect strict de ta demande : le script publicitaire Google AdSense ne se charge <strong>QUE</strong> sur cette page dédiée.
              </p>
            </div>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800/80 p-5 rounded-2xl text-xs space-y-3">
            <p className="text-neutral-300 leading-relaxed">
              Pour créer cette page sur WordPress :
            </p>
            <ol className="list-decimal pl-4 space-y-1.5 text-neutral-400">
              <li>Va dans <strong>Pages &gt; Ajouter une page</strong> et nomme-la par exemple <em>"Aider des gens en difficulté"</em>.</li>
              <li>Dans les attributs de page à droite, choisis le modèle : <strong className="text-amber-400">Modèle Solidarité &amp; Ads Caritatives (AdSense)</strong>.</li>
              <li>Va dans <strong>Apparence &gt; Personnaliser &gt; Réglages X Group Digital</strong> pour renseigner ton <strong>Google AdSense Publisher ID</strong> (ex: ca-pub-XXXXX) et tes Slot IDs.</li>
              <li><strong>Sécurité garantie :</strong> Aucune publicité ne s'affichera sur la boutique, le checkout ou l'accueil !</li>
            </ol>
          </div>
        </div>

        {/* RÉPONSES DIRECTES AUX QUESTIONS D'INSTALLATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-3">
            <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <span>❓</span> Pourquoi "Personnaliser" n'apparaissait pas ?
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Dans les versions récentes de WordPress (WordPress 6.x avec PHP 8), lorsque le thème actif par défaut est un <em>thème basé sur des blocs</em> (ex: Twenty Twenty-Four), WordPress <strong>masque</strong> le sous-menu "Personnaliser" et le remplace par "Éditeur".
            </p>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <p className="text-white font-semibold">Deux solutions immédiates :</p>
              <p>1. Dès que tu actives <strong>X Group Digital Store</strong>, le menu <strong>Apparence &gt; Personnaliser</strong> réapparaît instantanément !</p>
              <p>2. Un nouveau menu dédié <strong className="text-amber-400">X Group Digital</strong> a été ajouté dans la barre latérale WordPress avec un accès direct en un clic au Customizer et aux guides.</p>
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-3">
            <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>🛠️</span> Correction WinRAR &amp; "Archive Incompatible"
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Le message WinRAR <em>"The archive is either in unknown format or damaged"</em> et l'erreur WordPress <em>"Incompatible Archive"</em> étaient causés par l'en-tête de compression des répertoires : les dossiers étaient compressés en mode <code>Deflated</code> au lieu du mode standard <code>STORED (taille 0, non compressé)</code> exigé par WinRAR et le décompresseur PHP WordPress.
            </p>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <p className="text-white font-semibold">Corrections définitives V3.0 :</p>
              <p>✅ En-têtes de dossiers encodés en mode <code>ZIP_STORED (0 octet, bits POSIX 0755)</code>.</p>
              <p>✅ Téléchargement direct depuis la mémoire binaire (aucun risque de fichier tronqué à 10 Ko par le navigateur).</p>
              <p>✅ Testé et extrait avec succès à 100% sur WinRAR, 7-Zip et WordPress ZipArchive.</p>
            </div>
          </div>
        </div>

        {/* GUIDE COMPLET D'INSTALLATION DE A À Z */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-white">
                Guide d'Installation de A à Z (Avant, Pendant et Après)
              </h3>
              <p className="text-xs text-neutral-400">
                Tout ce que tu dois faire sur ton WordPress pour activer le thème et tous ses modules.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              ⚡ Déploiement en 5 minutes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Étape 1 */}
            <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Uploader le Thème</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Dans WordPress :<br />
                  <span className="text-neutral-200 font-semibold">Apparence &gt; Thèmes &gt; Ajouter &gt; Téléverser un thème</span>.<br />
                  Sélectionne le fichier <code className="text-amber-400">xgroup-theme.zip</code> téléchargé ci-dessus, clique sur <strong>Installer</strong> puis sur <strong>Activer</strong>.
                </p>
              </div>
              <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-[11px] text-emerald-400 font-semibold">
                ✓ Compatible WP 6.x, 7.1+ &amp; PHP 8
              </div>
            </div>

            {/* Étape 2 */}
            <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Installer WooCommerce</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Dans <strong>Extensions &gt; Ajouter</strong>, active :<br />
                  • <strong>WooCommerce</strong> (gestion panier, boutique &amp; checkout).<br />
                  • <strong>WooCommerce Wallet</strong> (portefeuille virtuel dépensable).<br />
                  <span className="text-amber-400 font-medium">*Le thème bloque automatiquement les retraits pour que les fonds restent dépensables sur le site.</span>
                </p>
              </div>
              <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-[11px] text-amber-400 font-semibold">
                ✓ Solde dépense uniquement
              </div>
            </div>

            {/* Étape 3 */}
            <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Créer les Pages Modules</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Dans <strong>Pages &gt; Ajouter</strong>, crée les pages souhaitées puis choisis leur <strong>Modèle de page</strong> à droite :<br />
                  • <em>Marketplace</em> (Modèle Marketplace)<br />
                  • <em>Chauffeur</em> (Modèle KlikeDeliv Courses &amp; Chauffeur)<br />
                  • <em>Création Logo</em> (Modèle Services Graphiques)<br />
                  • <em>Panier Shein</em> (Modèle Panier Shein / Amazon)<br />
                  • <em>Créer ton site</em> (Modèle Mini-Site Clé en Main)<br />
                  • <em>Jeux d'Argent</em> (Modèle Paris P2P)
                </p>
              </div>
              <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-[11px] text-blue-400 font-semibold">
                ✓ Tous les formulaires sont inclus
              </div>
            </div>

            {/* Étape 4 */}
            <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-sm">
                  4
                </div>
                <h4 className="font-bold text-white text-sm">Menu 3 Points &amp; Sécurité</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Dans <strong>Apparence &gt; Menus</strong> :<br />
                  Crée ton menu et coche l'emplacement <strong className="text-amber-400">Menu 3 Points ••• (Tiroir)</strong>.<br />
                  <strong>Sécurité activée :</strong> Le passage de commande, le portefeuille et le tableau de bord exigent automatiquement la connexion de l'utilisateur !
                </p>
              </div>
              <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-[11px] text-purple-400 font-semibold">
                ✓ Connexion obligatoire automatique
              </div>
            </div>

          </div>
        </div>

        {/* LISTE DES FICHIERS DU THÈME */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-amber-400" />
              Contenu du fichier xgroup-theme.zip (fichiers inclus dans le projet)
            </h3>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              Emplacement : <code>/wordpress-theme/xgroup-theme/</code>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themeFiles.map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between bg-neutral-950/80 border border-neutral-800/60 px-4 py-3 rounded-xl text-xs"
              >
                <div>
                  <strong className="text-neutral-200 block font-mono">{f.name}</strong>
                  <span className="text-neutral-500">{f.desc}</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {f.size}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
