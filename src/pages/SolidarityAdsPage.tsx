import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { db } from '../services/db';

interface SolidarityAdsPageProps {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const SolidarityAdsPage: React.FC<SolidarityAdsPageProps> = ({ onNavigate }) => {
  const siteConfig = db.getSiteConfig();
  const [clickCount, setClickCount] = useState(0);
  const [totalEstimatedContribution, setTotalEstimatedContribution] = useState(0);
  const [recentActionNotice, setRecentActionNotice] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulated ad interaction that triggers instant encouragement
  const handleAdClick = (adTitle: string, estimatedRev: number) => {
    setClickCount((prev) => prev + 1);
    setTotalEstimatedContribution((prev) => prev + estimatedRev);
    setRecentActionNotice(`Merci ! Votre clic sur "${adTitle}" génère un soutien estimé de $${estimatedRev.toFixed(2)} USD reversé à la communauté.`);
    setTimeout(() => {
      setRecentActionNotice(null);
    }, 6000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Aider des gens en difficulté — Solidarité X GROUP',
        text: 'Aidez des familles en Haïti gratuitement en consultant les annonces partenaires sur X GROUP !',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-24">
      {/* Top Banner Notice */}
      <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-neutral-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-amber-300">
              Programme 100% Solidaire & Humanitaire
            </span>
            <span className="text-neutral-400 hidden sm:inline">— Aucun paiement requis pour aider</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Lien copié !' : 'Partager cette page'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            Aider des gens en difficulté
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Chaque clic compte. Transformez votre attention en aide concrète.
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Vous n’avez pas besoin d’argent pour faire la différence. En consultant cette page et en interagissant avec nos annonces partenaires Google AdSense, vous générez des fonds publicitaires <strong>reversés à 100%</strong> pour financer des repas chauds, des fournitures scolaires et des soins d’urgence en Haïti.
          </p>
        </div>

        {/* Global Transparency Live Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Fonds Publicitaires Collectés</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ${(2840 + totalEstimatedContribution).toFixed(2)} USD
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Total vérifié & alloué sur le terrain</p>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Repas & Vivres Fournis</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {1920 + clickCount * 2} repas
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Distribués à Port-au-Prince et provinces</p>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Kits Scolaires Distribués</span>
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              340 kits
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Cahiers, stylos et uniformes d'écoliers</p>
          </div>

          <div className="bg-neutral-900/90 border border-amber-500/30 p-5 rounded-2xl bg-amber-500/5">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Votre Impact Aujourd'hui</span>
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {clickCount} clic{clickCount > 1 ? 's' : ''}
            </div>
            <p className="text-[11px] text-amber-300/80 mt-1">
              ≈ +${totalEstimatedContribution.toFixed(2)} USD générés par vous
            </p>
          </div>
        </div>

        {/* Live Notification Feedback */}
        {recentActionNotice && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{recentActionNotice}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ========================================================================= */}
        {/* EMPLACEMENT PUBLICITAIRE 1 : Grande Bannière Responsive (Leaderboard 728x90) */}
        {/* NOTE: Les annonces publicitaires sont STRICTEMENT limitées à cette page! */}
        {/* ========================================================================= */}
        <div className="bg-neutral-900 border-2 border-dashed border-amber-500/40 rounded-3xl p-4 sm:p-6 text-center space-y-3 shadow-2xl">
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-neutral-800">
            <span>📢 Annonce Sponsorisée Solidaire (Google AdSense Responsive)</span>
            <span className="text-neutral-500">Espace 100% Caritatif</span>
          </div>

          <div
            onClick={() => handleAdClick('Bannière Partenaire Villes Haïti', 0.35)}
            className="group relative cursor-pointer bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 hover:border-amber-500/60 rounded-2xl p-6 sm:p-8 transition-all hover:scale-[1.005]"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase">
                  Sponsor Humanitaire
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                  Formation Digitale & Énergie Solaire en Haïti
                </h3>
                <p className="text-xs text-neutral-400 max-w-xl">
                  Découvrez les solutions d'autonomie énergétique et les bourses d'études techniques pour jeunes professionnels.
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 group-hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-md transition-all">
                  <span>Visiter & Soutenir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
            <p className="text-[10px] text-neutral-600 mt-2 text-right">
              Cliquez pour visiter le sponsor et financer la cantine scolaire.
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Left (Square 300x250 AdSense + Video spot) & Right (Impact & Field Stories) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Ads Slot 2 & Interactive Spot (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Ad Container 2: Medium Rectangle 300x250 */}
            <div className="bg-neutral-900 border-2 border-dashed border-amber-500/40 rounded-3xl p-5 text-center space-y-3">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-neutral-800">
                <span>Annonce Sponsor 300x250</span>
                <span className="text-neutral-500">Google AdSense</span>
              </div>

              <div
                onClick={() => handleAdClick('Partenaire Telecom & Équipement', 0.28)}
                className="group cursor-pointer bg-neutral-950 border border-neutral-800 hover:border-amber-400 rounded-2xl p-6 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  Connexion Internet Satellite & GSM
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Bénéficiez des forfaits haut débit et forfaits nomades pour rester connecté partout en Haïti.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-2 bg-neutral-800 group-hover:bg-amber-400 group-hover:text-black text-neutral-200 font-bold text-xs rounded-xl transition-colors">
                    Consulter l'offre (Clic Donateur)
                  </span>
                </div>
              </div>
            </div>

            {/* Ad Container 3: Solidarité Santé 300x250 */}
            <div className="bg-neutral-900 border-2 border-dashed border-amber-500/40 rounded-3xl p-5 text-center space-y-3">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-neutral-800">
                <span>Partenaire Médical d'Urgence</span>
                <span className="text-neutral-500">Annonce Sponsor</span>
              </div>

              <div
                onClick={() => handleAdClick('Clinique et Soins de Première Ligne', 0.30)}
                className="group cursor-pointer bg-neutral-950 border border-neutral-800 hover:border-emerald-400 rounded-2xl p-6 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Kits Médicaux & Premiers Secours
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Soutenez l'approvisionnement des dispensaires et la fourniture de pansements et médicaments essentiels.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-2 bg-neutral-800 group-hover:bg-emerald-500 group-hover:text-black text-neutral-200 font-bold text-xs rounded-xl transition-colors">
                    Soutenir le Dispensaire
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transparency, Mission, Field Reports (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  Notre Charte de Transparence & D'Engagement
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Contrairement aux collectes traditionnelles, vous n'avez pas à sortir votre carte bancaire. Voici exactement comment vos clics sont convertis en repas et aides concrètes :
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-2xl flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Génération de Revenus via Google AdSense</h4>
                    <p className="text-neutral-400 leading-relaxed">
                      Chaque impression et clic valide sur les bannières ci-dessus est rétribué par Google et les annonceurs partenaires.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-2xl flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Achat Direct de Denrées & Fournitures</h4>
                    <p className="text-neutral-400 leading-relaxed">
                      Les fonds sont convertis en sacs de riz, pois, huile, trousses de premiers secours et fournitures scolaires achetés localement en Haïti pour soutenir l’économie.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-2xl flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Distribution Supervisée par Nos Équipes</h4>
                    <p className="text-neutral-400 leading-relaxed">
                      Nos coordinateurs terrain KlikeDeliv et logistique acheminent les vivres directement aux foyers, orphelinats et familles sinistrées sans intermédiaires.
                    </p>
                  </div>
                </div>
              </div>

              {/* Strict Location Note */}
              <div className="p-4 bg-neutral-950 border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Règle Stricte du Site : Aucune Publicité Intrusive</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Conformément à nos principes d’ergonomie, <strong>les annonces publicitaires sont strictement confinées à cette unique page</strong>. Vous ne verrez aucune pop-up, bannière clignotante ou publicité sur la boutique, le checkout ou les services techniques.
                </p>
              </div>

              {/* Actions & Sharing Callout */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? 'Lien de la page copié !' : 'Partager avec des amis sur WhatsApp'}</span>
                </button>

                <button
                  onClick={() => onNavigate('/support')}
                  className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Proposer une Famille dans le Besoin
                </button>
              </div>
            </div>

            {/* Testimonials from the Community */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Témoignages & Retours du Terrain
              </h4>
              <div className="space-y-3 text-xs text-neutral-300">
                <blockquote className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl italic">
                  “Grâce aux clics générés le mois dernier, nous avons pu financer 45 uniformes et sacs d’école complets pour les élèves de l’école communautaire de Delmas 31.”
                  <span className="block mt-2 font-bold text-amber-400 not-italic">— Marie-Ange C., Coordinatrice Éducation</span>
                </blockquote>

                <blockquote className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl italic">
                  “Une vraie innovation : permettre à la diaspora et aux Haïtiens d’aider simplement en regardant des sponsors sans rien dépenser de leur poche.”
                  <span className="block mt-2 font-bold text-amber-400 not-italic">— Jean-Marc P., Donateur & Utilisateur KlikeDeliv</span>
                </blockquote>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
