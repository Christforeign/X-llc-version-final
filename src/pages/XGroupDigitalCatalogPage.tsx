import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Shield, ArrowRight, Zap, CheckCircle2, Search, Smartphone, ExternalLink, Package, Settings, HelpCircle } from 'lucide-react';
import { db } from '../services/db';
import { MarketplaceItem } from '../models/types';
import { useLanguage } from '../context/LanguageContext';
import { wooService, WooCommerceConfig } from '../services/wooService';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface XGroupDigitalCatalogPageProps {
  onNavigate: (path: string) => void;
  onAddToCart: (item: MarketplaceItem) => void;
  onOpenAuth: () => void;
}

export const XGroupDigitalCatalogPage: React.FC<XGroupDigitalCatalogPageProps> = ({ onNavigate, onAddToCart, onOpenAuth }) => {
  const { t } = useLanguage();
  const [wooConfig, setWooConfig] = useState<WooCommerceConfig>(wooService.getConfig());
  const [wooProducts, setWooProducts] = useState<MarketplaceItem[]>([]);
  const [isWooLoading, setIsWooLoading] = useState(false);
  const [showWooModal, setShowWooModal] = useState(false);

  // Form inputs for WooCommerce settings
  const [wooUrlInput, setWooUrlInput] = useState(wooConfig.url);
  const [wooCkInput, setWooCkInput] = useState(wooConfig.consumerKey);
  const [wooCsInput, setWooCsInput] = useState(wooConfig.consumerSecret);
  const [wooEnabledInput, setWooEnabledInput] = useState(wooConfig.enabled);
  const [isTestingWoo, setIsTestingWoo] = useState(false);
  const [wooTestResult, setWooTestResult] = useState<{ success: boolean; message: string; productCount?: number } | null>(null);

  const localProducts = db.getProducts() || [];
  const allProducts = wooConfig.enabled && wooProducts.length > 0 ? [...wooProducts, ...localProducts] : localProducts;
  
  // Filter digital / service / catalog products
  const catalogItems = allProducts.filter(p => p.id.startsWith('izy-') || p.id.startsWith('prod-') || p.id.startsWith('woo-') || p.category === 'gaming' || p.category === 'gift-cards' || p.category === 'crypto-services' || p.category === 'entertainment' || p.category === 'transfer' || p.isDigital);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    if (wooConfig.enabled && wooConfig.url && wooConfig.consumerKey && wooConfig.consumerSecret) {
      setIsWooLoading(true);
      wooService.fetchProducts().then(prods => {
        setWooProducts(prods);
        setIsWooLoading(false);
      }).catch(() => setIsWooLoading(false));
    }
  }, [wooConfig]);

  const handleSaveWoo = (e: React.FormEvent) => {
    e.preventDefault();
    const newCfg: WooCommerceConfig = {
      url: wooUrlInput.trim(),
      consumerKey: wooCkInput.trim(),
      consumerSecret: wooCsInput.trim(),
      enabled: wooEnabledInput
    };
    wooService.saveConfig(newCfg);
    setWooConfig(newCfg);
    setShowWooModal(false);
    if (newCfg.enabled) {
      setIsWooLoading(true);
      wooService.fetchProducts().then(prods => {
        setWooProducts(prods);
        setIsWooLoading(false);
      }).catch(() => setIsWooLoading(false));
    }
  };

  const handleTestWoo = async () => {
    setIsTestingWoo(true);
    setWooTestResult(null);
    try {
      const res = await wooService.testConnection({
        url: wooUrlInput.trim(),
        consumerKey: wooCkInput.trim(),
        consumerSecret: wooCsInput.trim(),
        enabled: true
      });
      setWooTestResult(res);
    } catch (e: any) {
      setWooTestResult({
        success: false,
        message: e?.message || "Échec inattendu du test de connexion."
      });
    } finally {
      setIsTestingWoo(false);
    }
  };

  const categories = [
    { key: 'all', label: '🌟 Tout (X Group Digital)' },
    { key: 'gaming', label: '🎮 Gaming & Top-Up' },
    { key: 'crypto-services', label: '💎 Crypto & Binance' },
    { key: 'gift-cards', label: '🎁 Cartes Cadeaux' },
    { key: 'entertainment', label: '🎙️ Live & Poppo' },
    { key: 'transfer', label: '💸 Zelle & Cash App' },
  ];

  const filteredItems = catalogItems.filter(item => {
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
    <div className="min-h-screen bg-white text-neutral-900 pb-24 selection:bg-amber-400 selection:text-black">
      {/* Toast Notification */}
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

      {/* Header Banner */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Catalogue Officiel X Group Digital</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            X Group Digital Store & Services
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal">
            Services numériques, recharges de jeux, cartes cadeaux et transferts sécurisés. Commandez en toute confiance.
          </p>

          {/* Search Bar & WooCommerce Settings */}
          <div className="pt-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un service, une carte cadeau, un jeu..."
                className="w-full bg-white border border-neutral-300 focus:border-amber-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowRequestModal(true)}
                className="flex-1 sm:flex-none px-3.5 py-3 bg-white hover:bg-neutral-100 border border-neutral-300 hover:border-amber-500 text-amber-700 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Autre recharge ? Dites-le nous !</span>
              </button>
              <button
                onClick={() => setShowWooModal(true)}
                className="p-3 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-2xl text-neutral-700 hover:text-amber-600 transition-colors cursor-pointer shadow-sm flex items-center justify-center shrink-0"
                title="Configurer WordPress / WooCommerce"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
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
                  ? 'bg-neutral-900 text-white shadow-lg'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300'
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
              onClick={() => {
                setSelectedProduct(item);
                setCustomFieldValues({});
              }}
              className="bg-white border border-neutral-200 hover:border-amber-500 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group cursor-pointer shadow-sm hover:shadow-xl text-neutral-900"
            >
              <div>
                {/* Product Image Container (4:3 aspect ratio) */}
                <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400 shadow-sm">
                      {item.isDigital !== false ? 'Numérique' : 'Physique'}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-3.5 sm:p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                    <span>{item.sellerName || 'X Group Digital'}</span>
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

              {/* Action Button */}
              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(item);
                    setCustomFieldValues({});
                  }}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-amber-500 hover:text-black text-white rounded-full text-xs font-bold uppercase tracking-wide flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>{item.price > 30 ? 'Commander' : 'Acheter'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal with Dynamic Custom Form Fields */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 text-neutral-900">
            <div className="relative h-56 w-full bg-neutral-100">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover object-center"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-700"
              >
                &times;
              </button>
              <span className="absolute bottom-4 left-4 text-xs font-black uppercase px-3 py-1 rounded-full bg-neutral-900 text-amber-400">
                {selectedProduct.isDigital !== false ? 'Service Numérique' : 'Article Physique'}
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">
                  {selectedProduct.sellerName || 'X Group Digital'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
                  {selectedProduct.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Dynamic Custom Fields configured by admin */}
              <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <p className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Informations requises pour cette commande :
                </p>
                {(!selectedProduct.customFields || selectedProduct.customFields.length === 0) ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      ID / E-mail / Téléphone de destination :
                    </label>
                    <input
                      type="text"
                      value={customFieldValues['default'] || ''}
                      onChange={(e) => setCustomFieldValues({ ...customFieldValues, default: e.target.value })}
                      placeholder="Entrez vos informations ici..."
                      className="w-full bg-white border border-neutral-300 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-neutral-900 outline-none"
                    />
                  </div>
                ) : (
                  selectedProduct.customFields.map((field, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-700">
                        {field} :
                      </label>
                      <input
                        type="text"
                        value={customFieldValues[field] || ''}
                        onChange={(e) => setCustomFieldValues({ ...customFieldValues, [field]: e.target.value })}
                        placeholder={`Entrez ${field.toLowerCase()}...`}
                        className="w-full bg-white border border-neutral-300 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-neutral-900 outline-none"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Quantity Selector & Price */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-2xl font-black text-neutral-900 font-mono">
                    ${(selectedProduct.price * quantity).toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-500 ml-2">
                    (~{(selectedProduct.price * quantity * 132).toLocaleString()} HTG)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-neutral-700">Quantité / Montant :</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 bg-white border border-neutral-300 focus:border-amber-500 rounded-xl px-3 py-1.5 text-center text-sm font-black font-mono text-neutral-900 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCartClick(selectedProduct, quantity)}
                  className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-neutral-300 shadow-xs"
                >
                  <ShoppingCart className="w-4 h-4 text-amber-600" />
                  <span>Ajouter au panier</span>
                </button>

                <button
                  onClick={() => handleBuyNow(selectedProduct)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Acheter maintenant</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WooCommerce Integration Modal */}
      {showWooModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-6 text-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-neutral-900">Intégration WordPress & WooCommerce</h3>
              </div>
              <button
                onClick={() => setShowWooModal(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveWoo} className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                <div>
                  <p className="font-bold text-neutral-900">Activer WooCommerce</p>
                  <p className="text-[11px] text-neutral-500">Synchroniser les produits de votre site WordPress</p>
                </div>
                <input
                  type="checkbox"
                  checked={wooEnabledInput}
                  onChange={(e) => setWooEnabledInput(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">URL de votre site WordPress</label>
                <input
                  type="url"
                  placeholder="https://votreboutique.com"
                  value={wooUrlInput}
                  onChange={(e) => setWooUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Consumer Key (CK)</label>
                <input
                  type="text"
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={wooCkInput}
                  onChange={(e) => setWooCkInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Consumer Secret (CS)</label>
                <input
                  type="password"
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={wooCsInput}
                  onChange={(e) => setWooCsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              {/* Feedback Alert if tested */}
              {wooTestResult && (
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    wooTestResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    {wooTestResult.success ? '✅ Connexion réussie' : '⚠️ Attention / Diagnostic'}
                  </p>
                  <p className="mt-1 text-[11px]">{wooTestResult.message}</p>
                </div>
              )}

              {/* Help & Architecture Note */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-[11px] text-neutral-600 space-y-1.5">
                <p className="font-bold text-neutral-800">💡 Comment ça fonctionne ?</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Votre WordPress (wp-admin)</strong> reste votre panneau de gestion privé où vous créez vos produits et gérez vos commandes.</li>
                  <li><strong>Cette application React</strong> est la vitrine publique pour vos clients. Elle récupère les produits depuis WordPress via l’API.</li>
                  <li>Si vous avez une erreur réseau/CORS : installez le plugin gratuit <em>WP CORS</em> sur WordPress pour autoriser les requêtes.</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleTestWoo}
                  disabled={isTestingWoo}
                  className="px-3.5 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isTestingWoo ? 'Test en cours...' : '🧪 Tester la connexion'}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowWooModal(false)}
                    className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black cursor-pointer shadow-md"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Request Modal */}
      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="digital"
      />
    </div>
  );
};
