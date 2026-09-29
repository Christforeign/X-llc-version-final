import React, { useState } from 'react';
import { ShoppingCart, Star, Shield, ArrowRight, Zap, CheckCircle2, Search, Smartphone, ExternalLink } from 'lucide-react';
import { db } from '../services/db';
import { MarketplaceItem } from '../models/types';
import { useLanguage } from '../context/LanguageContext';

interface IzyStoreCatalogPageProps {
  onNavigate: (path: string) => void;
  onAddToCart: (item: MarketplaceItem) => void;
  onOpenAuth: () => void;
}

export const IzyStoreCatalogPage: React.FC<IzyStoreCatalogPageProps> = ({ onNavigate, onAddToCart, onOpenAuth }) => {
  const { t } = useLanguage();
  const allProducts = db.getProducts() || [];
  
  // Filter only izy store products or all digital services
  const izyItems = allProducts.filter(p => p.id.startsWith('izy-') || p.category === 'gaming' || p.category === 'gift-cards' || p.category === 'crypto-services' || p.category === 'entertainment' || p.category === 'transfer');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [playerInput, setPlayerInput] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: '🌟 Tout (Izy Store)' },
    { key: 'gaming', label: '🎮 Gaming & Top-Up' },
    { key: 'crypto-services', label: '💎 Crypto & Binance' },
    { key: 'gift-cards', label: '🎁 Cartes Cadeaux' },
    { key: 'entertainment', label: '🎙️ Live & Poppo' },
    { key: 'transfer', label: '💸 Zelle & Cash App' },
  ];

  const filteredItems = izyItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCartClick = (item: MarketplaceItem, qty: number = 1) => {
    for (let i = 0; i < qty; i++) {
      onAddToCart(item);
    }
    setAddedNotice(`"${item.title}" ajouté au panier !`);
    setTimeout(() => setAddedNotice(null), 3000);
    setSelectedProduct(null);
  };

  const handleBuyNow = (item: MarketplaceItem) => {
    onAddToCart(item);
    onNavigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 selection:bg-yellow-400 selection:text-black">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-yellow-400 text-black px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center space-x-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span>{addedNotice}</span>
          <button
            onClick={() => onNavigate('/cart')}
            className="underline ml-2 cursor-pointer font-black hover:opacity-80"
          >
            Voir Panier &rarr;
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-yellow-400/20 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>Catalogue Officiel Izy Store Haïti</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Izy Store & Autres Services Digitaux
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-normal">
            La solution de vos besoins digitaux : recharges de jeux, cartes cadeaux Netflix & Apple, recharges Binance, transferts Zelle et Cash App livrés instantanément.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un service, une carte cadeau, un jeu (ex: Freefire, Binance, Apple...)"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-yellow-400 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content & Vitrine en 2 colonnes fond blanc */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vitrine Grid: 2 columns on mobile/tablet with white background */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedProduct(item)}
              className="bg-white border border-neutral-200 hover:border-yellow-400 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group cursor-pointer shadow-sm hover:shadow-xl text-neutral-900"
            >
              <div>
                {/* Product Image Container (4:3 aspect ratio) */}
                <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-yellow-400 shadow-sm">
                    {item.category}
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

              {/* Action Button matching store.izy-pay.com */}
              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(item);
                  }}
                  className="w-full py-2.5 bg-black hover:bg-yellow-400 hover:text-black text-white rounded-full text-xs font-bold uppercase tracking-wide flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>{item.price > 30 ? 'Commander' : 'Acheter'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal (mimicking store.izy-pay.com/produit/...) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 text-white">
            <div className="relative h-56 w-full bg-black">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover object-center"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-700"
              >
                &times;
              </button>
              <span className="absolute bottom-4 left-4 text-xs font-black uppercase px-3 py-1 rounded-full bg-black/85 text-yellow-400 border border-yellow-400/30">
                {selectedProduct.category}
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                  {selectedProduct.sellerName}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {selectedProduct.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Player ID / Account Input if gaming or digital */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300">
                  ID Joueur / Numéro / E-mail / Adresse de destination :
                </label>
                <input
                  type="text"
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  placeholder="Entrez votre ID / E-mail / Téléphone ici..."
                  className="w-full bg-black border border-neutral-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              {/* Quantity Selector & Price */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <div>
                  <span className="text-2xl font-black text-yellow-400 font-mono">
                    ${(selectedProduct.price * quantity).toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-400 ml-2">
                    (~{(selectedProduct.price * quantity * 132).toLocaleString()} HTG)
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-black border border-neutral-700 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCartClick(selectedProduct, quantity)}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-750 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-neutral-700"
                >
                  <ShoppingCart className="w-4 h-4 text-yellow-400" />
                  <span>Ajouter au panier</span>
                </button>

                <button
                  onClick={() => handleBuyNow(selectedProduct)}
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-yellow-400/20"
                >
                  <span>Acheter maintenant</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
