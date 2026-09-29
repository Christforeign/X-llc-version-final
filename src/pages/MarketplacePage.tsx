import React, { useState } from 'react';
import {
  Boxes,
  ShoppingCart,
  MessageSquare,
  Star,
  CheckCircle,
  Tag,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  X,
  Plus,
  Minus,
  Truck,
  Check,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { MarketplaceItem } from '../models/types';
import { ChatDrawer } from '../components/ChatDrawer';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface MarketplacePageProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  onAddToCart: (item: MarketplaceItem) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate, onOpenAuth, onAddToCart }) => {
  const currentUser = authService.getCurrentUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatSeller, setActiveChatSeller] = useState<{ roomId: string; title: string } | null>(null);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<MarketplaceItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const products = db.getProducts();

  const categories = [
    { id: 'all', label: 'Tous les Produits' },
    { id: 'hardware', label: 'Téléphones & Pièces' },
    { id: 'gsm_tool', label: 'Dongles & Boîtiers GSM' },
    { id: 'digital_license', label: 'Licences & Activations' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.type === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAdd = (item: MarketplaceItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onAddToCart(item);
    setAddedItemNotice(`"${item.title}" ajouté à votre panier`);
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  const handleOpenDetail = (p: MarketplaceItem) => {
    setSelectedProductDetail(p);
    setDetailQuantity(1);
    setActiveImageIndex(0);
  };

  const handleBuyNow = (item: MarketplaceItem) => {
    for (let i = 0; i < detailQuantity; i++) {
      onAddToCart(item);
    }
    setSelectedProductDetail(null);
    onNavigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Approvisionnement B2B & Wholesale Garanti</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Marketplace Privé & Dépôt Wholesale
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cliquez sur un produit pour examiner sa fiche technique détaillée, ses garanties et son descriptif complet avant achat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-blue-500 text-blue-400 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Autre produit ? Dites-le nous !</span>
          </button>

          <button
            onClick={() => onNavigate('/cart')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Voir mon Panier</span>
          </button>
        </div>
      </div>

      {/* Added Notification Toast */}
      {addedItemNotice && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <span className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{addedItemNotice}</span>
          </span>
          <button
            onClick={() => onNavigate('/cart')}
            className="underline font-semibold hover:text-white cursor-pointer ml-3 shrink-0"
          >
            Accéder au Panier &rarr;
          </button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher appareils, boîtiers, licences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => handleOpenDetail(p)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-2xl rounded-2xl overflow-hidden flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-slate-700">
                  {p.type === 'service' ? 'Service / Clé' : 'Produit Physique'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[11px] text-white font-semibold bg-blue-600/90 px-3 py-1 rounded-lg flex items-center space-x-1.5 shadow">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cliquer pour voir la description complète</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    X Group Officiel
                  </span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{p.rating || 5.0}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>

                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-white">${p.price.toFixed(2)} <span className="text-xs font-normal text-slate-400">USD</span></span>
                  {p.stock !== undefined && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Stock: <strong className="text-emerald-400">{p.stock}</strong> unités
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2 border-t border-slate-800/80 mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDetail(p);
                }}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voir Détails</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleAdd(p, e)}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/30 transition-all"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Ajouter Panier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProductDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Preview & Thumbnails */}
            <div className="space-y-3">
              <div className="relative h-64 sm:h-72 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={selectedProductDetail.images[activeImageIndex] || selectedProductDetail.images[0]}
                  alt={selectedProductDetail.title}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-slate-700 backdrop-blur-sm">
                  {selectedProductDetail.type === 'gsm_tool' ? 'Boîtier Professionnel' : selectedProductDetail.type === 'digital_license' ? 'Activation Numérique' : 'Matériel Wholesale'}
                </span>
              </div>

              {selectedProductDetail.images.length > 1 && (
                <div className="flex items-center space-x-2">
                  {selectedProductDetail.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Seller Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Catalogue Officiel X Group (Service Garanti)
                </span>
                <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedProductDetail.rating || 5.0} / 5.0 Évaluation</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                {selectedProductDetail.title}
              </h2>

              <div className="flex items-baseline space-x-3 pt-1">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  ${selectedProductDetail.price.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                </span>
                {selectedProductDetail.stock !== undefined && (
                  <span className="text-xs text-slate-400 font-mono">
                    Stock disponible: <strong className="text-white">{selectedProductDetail.stock} unités</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Description Complète & Spécifications
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {selectedProductDetail.description}
              </p>
            </div>

            {/* Badges & Trust indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-[11px]">Expédition Fret 24h</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Garantie XGROUP LLC</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-2 col-span-2 sm:col-span-1">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px]">Produit Authentique</span>
              </div>
            </div>

            {/* Quantity Selector & Checkout Actions */}
            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs text-slate-400">Quantité:</span>
                <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white font-mono">{detailQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setDetailQuantity(detailQuantity + 1)}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < detailQuantity; i++) {
                      onAddToCart(selectedProductDetail);
                    }
                    setAddedItemNotice(`${detailQuantity}x "${selectedProductDetail.title}" ajoutés`);
                    setSelectedProductDetail(null);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ajouter au Panier</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuyNow(selectedProductDetail)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
                >
                  <span>Acheter Immédiatement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seller Real-Time Chat Drawer */}
      {activeChatSeller && (
        <div className="fixed bottom-6 right-6 w-96 z-50 animate-in slide-in-from-bottom-5">
          <ChatDrawer
            chatRoomId={activeChatSeller.roomId}
            title={activeChatSeller.title}
            category="order"
            onClose={() => setActiveChatSeller(null)}
          />
        </div>
      )}

      {/* Universal Request Modal */}
      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="marketplace"
      />
    </div>
  );
};
