import React, { useState, useEffect } from 'react';
import {
  Shield,
  Smartphone,
  Truck,
  ArrowRight,
  Lock,
  Boxes,
  Zap,
  Star,
  CheckCircle2,
  Clock,
  Eye,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  ShieldCheck,
  HelpCircle,
  Car,
  GraduationCap,
  Sparkles,
  Gamepad2,
  RefreshCw,
} from 'lucide-react';
import { db } from '../services/db';
import { MarketplaceItem, GsmProduct } from '../models/types';
import { useLanguage } from '../context/LanguageContext';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  onAddToCart?: (item: MarketplaceItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth, onAddToCart }) => {
  const siteConfig = db.getSiteConfig();
  const { t } = useLanguage();

  const [products, setProducts] = useState<MarketplaceItem[]>(() => db.getProducts() || []);
  const [gsmProducts, setGsmProducts] = useState<GsmProduct[]>(() => db.getGsmProducts() || []);
  const [showcaseCategory, setShowcaseCategory] = useState<'all' | 'hardware' | 'gsm'>('all');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setProducts(db.getProducts() || []);
      setGsmProducts(db.getGsmProducts() || []);
    });
    return () => unsub();
  }, []);

  // Modal State for Product Inspection from Showcase
  const [selectedItemDetail, setSelectedItemDetail] = useState<MarketplaceItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Convert GSM products to compatible showcase items
  const safeGsmProducts = Array.isArray(gsmProducts) ? gsmProducts : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const gsmAsMarketItems: MarketplaceItem[] = safeGsmProducts.slice(0, 4).map((g) => ({
    id: `gsm-show-${g.id}`,
    title: g.name || 'Service GSM',
    type: 'service',
    price: g.price || 0,
    category: 'services',
    description: `${g.description || ''}\n\n• Délai moyen d'intervention: ${g.turnaround || '10-30 min'}\n• Marques compatibles: ${(Array.isArray(g.supportedBrands) ? g.supportedBrands : []).join(', ')}\n• Prérequis: ${g.requirements || 'N/A'}`,
    images: [g.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'],
    createdBy: 'XGROUP_GSM',
    sellerName: g.sellerName || 'Lab XGROUP',
    visibleToRoles: ['client', 'staff', 'admin'],
    status: 'active',
    rating: g.rating || 5.0,
  }));

  const allShowcaseItems: MarketplaceItem[] = [
    ...safeProducts,
    ...gsmAsMarketItems,
  ];

  const filteredShowcase = allShowcaseItems.filter((item) => {
    if (showcaseCategory === 'hardware') return item.type === 'product';
    if (showcaseCategory === 'gsm') return item.category === 'services' || item.type === 'service';
    return true;
  });

  const handleOpenDetail = (item: MarketplaceItem) => {
    setSelectedItemDetail(item);
    setDetailQuantity(1);
  };

  const handleAddToCartClick = (item: MarketplaceItem, qty: number = 1) => {
    if (onAddToCart) {
      for (let i = 0; i < qty; i++) {
        onAddToCart(item);
      }
      setAddedNotice(`"${item.title}" ajouté au panier !`);
      setTimeout(() => setAddedNotice(null), 3000);
    }
  };

  const stats = [
    { label: t('stat_cleared'), value: '48,200+' },
    { label: t('stat_freight'), value: '1,840 MT' },
    { label: t('stat_escrow'), value: '$12.4M' },
    { label: t('stat_dispatch'), value: '< 15 mins' },
  ];

  return (
    <div className="space-y-12 pb-20 bg-white text-neutral-900 selection:bg-amber-400 selection:text-black">
      {/* Scrolling Announcement Ticker */}
      <div className="bg-amber-400 text-black py-2 px-4 overflow-hidden text-xs font-black uppercase tracking-wider shadow-sm">
        <div className="flex items-center justify-center space-x-8 whitespace-nowrap">
          <span className="flex items-center space-x-1.5"><Zap className="w-3.5 h-3.5 fill-black" /><span>X Group Digital • Services Numériques & Fret Haïti</span></span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">💎 Recharges Binance & Meru 24/7</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">🎮 Freefire, PUBG & Cartes Cadeaux Officielles</span>
        </div>
      </div>

      {/* Cart Notification Toast */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center space-x-2 animate-in slide-in-from-bottom-5 border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{addedNotice}</span>
          <button
            onClick={() => onNavigate('/cart')}
            className="underline ml-2 cursor-pointer font-black text-amber-400 hover:opacity-80"
          >
            Voir Panier &rarr;
          </button>
        </div>
      )}

      {/* Hero Section - Clean & Uncluttered */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 max-w-7xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold tracking-wide">
          <Shield className="w-3.5 h-3.5 text-amber-600" />
          <span>{siteConfig.heroSubtitle || 'Plateforme Multitude & Hub Logistique'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
          {siteConfig.heroTitle || (
            <>X Group Digital & <span className="text-amber-600">Izy Store Hub</span></>
          )}
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto font-normal">
          {siteConfig.heroDescription || 'Commandez vos recharges de jeux, cryptos, cartes cadeaux et services GSM en toute simplicité.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#vitrine-produits"
            className="px-6 py-3 bg-neutral-900 hover:bg-amber-500 hover:text-black text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Voir le Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={() => onNavigate('/gsm')}
            className="px-6 py-3 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
          >
            <Smartphone className="w-4 h-4 text-amber-600" />
            <span>Laboratoire GSM</span>
          </button>

          <button
            onClick={() => onNavigate('/shipping')}
            className="px-6 py-3 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-medium text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
          >
            <Truck className="w-4 h-4 text-neutral-600" />
            <span>Fret & Cargo</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* VITRINE ESSENTIELLE EN DEUX COLONNES FOND BLANC */}
      {/* ============================================================== */}
      <section id="vitrine-produits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 scroll-mt-20">
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-lg">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>Sélection de Services Phares</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Vitrine X Group Digital
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
                Un aperçu rapide de nos services les plus demandés. Cliquez sur "Voir le catalogue" pour tout voir.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('/autres')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <span>Accéder au catalogue complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Product Showcase Grid: 2 columns on mobile/tablet with white background */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredShowcase.slice(0, 8).map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="bg-white border border-neutral-200 hover:border-yellow-400 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group cursor-pointer shadow-sm hover:shadow-lg text-neutral-900"
              >
                <div>
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-yellow-400 shadow-sm">
                      {item.category || 'Digital'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                      <span>{item.sellerName || 'Izy Store'}</span>
                      <span className="text-emerald-600 font-bold">En Stock</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="pt-2 flex items-baseline justify-between border-t border-neutral-100">
                      <div>
                        <span className="text-base sm:text-lg font-black text-neutral-900 font-mono">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-normal ml-1">
                          (~{(item.price * 132).toLocaleString()} G)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-3.5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(item);
                    }}
                    className="w-full py-2.5 bg-black hover:bg-yellow-400 hover:text-black text-white rounded-full text-xs font-bold uppercase tracking-wide flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>{item.price > 100 ? 'Commander' : 'Acheter'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Link to Full Marketplace */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-850">
            <p className="text-xs text-neutral-400">
              Plus de 45 références disponibles en stock : smartphones neufs d'usine, testeurs JCID, crédits Octoplus et licences.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate('/gsm')}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-yellow-400 border border-neutral-800 rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <span>Services GSM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/marketplace')}
                className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl text-xs flex items-center space-x-2 cursor-pointer transition-all shadow-md shadow-yellow-400/20"
              >
                <span>{t('showcase_view_full_market')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTIONS EN BAS : ESSENTIELLES & AÉRÉES (NE PAS TROP REMPLIR) */}
      {/* ============================================================== */}

      {/* 3 Piliers Opérationnels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('services_title')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            {t('services_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: GSM */}
          <div
            onClick={() => onNavigate('/gsm')}
            className="bg-neutral-950 border border-neutral-850 hover:border-yellow-400/40 rounded-3xl p-6 sm:p-7 space-y-4 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Smartphone className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
              {t('service_gsm_title')}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Déblocage iCloud, FRP Samsung, contournement MDM, flash USB-over-IP et crédits de serveurs en quelques minutes.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-yellow-400 space-x-1.5">
              <span>Accéder au Lab GSM</span>
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>

          {/* Card 2: KlikeDeliv / Course & Chauffeur */}
          <div
            onClick={() => onNavigate('/klikedeliv')}
            className="bg-neutral-950 border border-neutral-850 hover:border-yellow-400/40 rounded-3xl p-6 sm:p-7 space-y-4 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Car className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
              KlikeDeliv & X-Drive VTC
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Commandez une course taxi/moto sécurisée à Port-au-Prince ou postulez comme chauffeur partenaire vérifié.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-yellow-400 space-x-1.5">
              <span>Course & Espace Chauffeur</span>
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>

          {/* Card 3: Demande de Services & Panier Shein */}
          <div
            onClick={() => onNavigate('/services')}
            className="bg-neutral-950 border border-neutral-850 hover:border-yellow-400/40 rounded-3xl p-6 sm:p-7 space-y-4 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
              Création Logo, Vidéo & Panier Shein
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Commandez logos, montages vidéo pro, sites web ou collez votre panier Shein / Amazon pour achat et livraison en Haïti.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-yellow-400 space-x-1.5">
              <span>Envoyer un Panier ou Service</span>
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>

          {/* Card 4: Cargo International */}
          <div
            onClick={() => onNavigate('/shipping')}
            className="bg-neutral-950 border border-neutral-850 hover:border-yellow-400/40 rounded-3xl p-6 sm:p-7 space-y-4 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Truck className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
              Fret Aérien & Maritime Cargo
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Acheminement express Miami/RD vers Haïti avec suivi satellite temps réel et dédouanement sécurisé.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-yellow-400 space-x-1.5">
              <span>Calculer un Fret Cargo</span>
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>

          {/* Card 5: Academy & Fichiers */}
          <div
            onClick={() => onNavigate('/learning')}
            className="bg-neutral-950 border border-neutral-850 hover:border-yellow-400/40 rounded-3xl p-6 sm:p-7 space-y-4 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <GraduationCap className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
              Éducation, Cours & Fichiers Vente
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Boutique de schémas de réparation iPhone, vidéos de formation GSM, guides e-commerce et certifications.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-yellow-400 space-x-1.5">
              <span>Boutique de Cours & Lab</span>
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>

          {/* Card 6: Jeux & Duels Wallet PvP */}
          <div
            onClick={() => onNavigate('/games')}
            className="bg-neutral-950 border border-neutral-850 hover:border-yellow-400/40 rounded-3xl p-6 sm:p-7 space-y-4 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Gamepad2 className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
              Arène de Jeux & Duels PvP
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Défiez d'autres membres en direct, misez avec le solde de votre portefeuille et gagnez instantanément (commission 5%).
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-yellow-400 space-x-1.5">
              <span>Rejoindre l'Arène</span>
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Global Autre Chose Callout Banner */}
        <div className="mt-8 bg-neutral-950 border-2 border-yellow-400/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Service ou produit spécifique introuvable ?
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Vous avez besoin d'autre chose ? Dites-le nous !
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Nous ajoutons tout produit ou prestation réalisable directement dans notre catalogue X GROUP avec paiement sécurisé.
            </p>
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg shadow-yellow-400/20 shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black fill-black" />
            <span>Soumettre ma demande</span>
          </button>
        </div>
      </section>

      {/* Bandeau de Confiance & Sécurité */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-black flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-black" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {t('trust_secure_title')}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t('trust_secure_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-neutral-300 font-medium shrink-0">
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-yellow-400" />
              <span>USDT TRC20</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-yellow-400" />
              <span>Carte Visa/Mastercard</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-yellow-400" />
              <span>MonCash</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PRODUCT DETAIL & INSPECTION MODAL (FOR SHOWCASE ITEMS) */}
      {/* ============================================================== */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 text-white">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItemDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-black border border-neutral-850">
              <img
                src={selectedItemDetail.images[0]}
                alt={selectedItemDetail.title}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/90 text-yellow-400 border border-yellow-400/40">
                {selectedItemDetail.type === 'service' ? 'Prestation Télécom' : 'Matériel Certifié'}
              </span>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Vendeur / Lab: {selectedItemDetail.sellerName}
                </span>
                <div className="flex items-center space-x-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span>{selectedItemDetail.rating || 5.0} / 5.0</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                {selectedItemDetail.title}
              </h3>

              <div className="flex items-baseline space-x-3 pt-1">
                <span className="text-3xl font-black text-yellow-400 font-mono">
                  ${selectedItemDetail.price.toFixed(2)}{' '}
                  <span className="text-xs text-neutral-400 font-normal">USD</span>
                </span>
                {selectedItemDetail.stock !== undefined && (
                  <span className="text-xs text-neutral-400 font-mono">
                    Stock disponible: <strong className="text-white">{selectedItemDetail.stock}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2 border-t border-neutral-850 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Description Complète & Spécifications
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line bg-neutral-900/70 p-4 rounded-xl border border-neutral-850">
                {selectedItemDetail.description}
              </p>
            </div>

            {/* Quantity Selector & Actions */}
            <div className="border-t border-neutral-850 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs text-neutral-400">Quantité:</span>
                <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                    className="p-2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white font-mono">{detailQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setDetailQuantity(detailQuantity + 1)}
                    className="p-2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCartClick(selectedItemDetail, detailQuantity);
                    setSelectedItemDetail(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold border border-neutral-700 cursor-pointer flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-yellow-400" />
                  <span>Ajouter au Panier</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCartClick(selectedItemDetail, detailQuantity);
                    setSelectedItemDetail(null);
                    onNavigate('/checkout');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-yellow-400/20 cursor-pointer transition-all"
                >
                  <span>Acheter Immédiatement</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Universal Request Modal */}
      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="autre"
      />
    </div>
  );
};
