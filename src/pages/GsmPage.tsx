import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Shield,
  Upload,
  Cpu,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  Plus,
  Minus,
  Search,
  Filter,
  X,
  ShoppingCart,
  Check,
  Star,
  Layers,
  Sparkles,
  Tag,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { GsmType, GsmOrder, GsmFileAttachment, GsmProduct, MarketplaceItem } from '../models/types';
import { InvoiceModal } from '../components/InvoiceModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface GsmPageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
  onAddToCart?: (item: MarketplaceItem) => void;
}

export const GsmPage: React.FC<GsmPageProps> = ({ onOpenAuth, onNavigate, onAddToCart }) => {
  const currentUser = authService.getCurrentUser();

  // GSM Products Catalog State
  const [products, setProducts] = useState<GsmProduct[]>(db.getGsmProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');

  // Selected GSM Product for Configuration / Details
  const [selectedProduct, setSelectedProduct] = useState<GsmProduct | null>(null);

  // Configuration form state
  const [deviceQuantity, setDeviceQuantity] = useState<number>(1);
  const [brand, setBrand] = useState('Samsung');
  const [customBrand, setCustomBrand] = useState('');
  const [model, setModel] = useState('');
  const [imeiList, setImeiList] = useState<string[]>(['']);
  const [serviceDetails, setServiceDetails] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<GsmFileAttachment[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Order & Modals state
  const [createdOrder, setCreatedOrder] = useState<GsmOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [cartSuccessNotice, setCartSuccessNotice] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Modal to Add / Publish New GSM Product into Catalog
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<GsmType>('FRP');
  const [newProdPrice, setNewProdPrice] = useState<number>(35);
  const [newProdTurnaround, setNewProdTurnaround] = useState('15-30 min');
  const [newProdBrands, setNewProdBrands] = useState('Samsung, Xiaomi, Motorola');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdReqs, setNewProdReqs] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setProducts(db.getGsmProducts());
    });
    return () => unsub();
  }, []);

  // Update IMEI inputs count whenever deviceQuantity changes
  const handleQuantityChange = (qty: number) => {
    const validQty = Math.max(1, qty);
    setDeviceQuantity(validQty);
    setImeiList((prev) => {
      const next = [...prev];
      while (next.length < validQty) next.push('');
      return next.slice(0, validQty);
    });
  };

  const handleImeiChange = (index: number, val: string) => {
    setImeiList((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const allAvailableBrands = [
    'Samsung',
    'Apple',
    'Xiaomi',
    'Motorola',
    'Google',
    'OnePlus',
    'Huawei',
    'Honor',
    'Oppo',
    'Vivo',
    'Infinix',
    'Tecno',
    'Itel',
    'Sony',
    'ZTE',
    'Nothing',
    'Realme',
    'LG',
    'Alcatel',
    'Autre (Personnalisé)',
  ];

  const categories = [
    { id: 'all', label: 'Tous les Services' },
    { id: 'FRP', label: 'Google FRP & MDM Reset' },
    { id: 'deblocage', label: 'Déblocage Réseau SIM' },
    { id: 'licences', label: 'Licences & Outils Numériques' },
    { id: 'reparation', label: 'EDL Flash & Unbrick' },
    { id: 'remote', label: 'Session USB-over-IP' },
  ];

  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const supported = Array.isArray(p.supportedBrands) ? p.supportedBrands : [];
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesBrand =
      selectedBrandFilter === 'all' ||
      supported.some((b) => b.toLowerCase().includes(selectedBrandFilter.toLowerCase()));
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      supported.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesBrand && matchesSearch;
  });

  const handleOpenProductConfig = (prod: GsmProduct) => {
    setSelectedProduct(prod);
    setDeviceQuantity(1);
    setImeiList(['']);
    setModel('');
    const brands = Array.isArray(prod.supportedBrands) && prod.supportedBrands.length > 0 ? prod.supportedBrands : ['Samsung'];
    setBrand(brands[0] || 'Samsung');
    setCustomBrand('');
    setServiceDetails('');
    setFormError(null);
    setAttachedFiles([]);
  };

  const handleSimulateFileUpload = () => {
    const sample = {
      id: `att-${Date.now()}`,
      name: `fastboot_diagnostic_log_${Math.floor(1000 + Math.random() * 9000)}.txt`,
      size: '180 KB',
      type: 'text/plain',
      url: '#',
    };
    setAttachedFiles([...attachedFiles, sample]);
  };

  // 1. Direct Instant Order Placement
  const handleDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!selectedProduct) return;

    const actualBrand = brand === 'Autre (Personnalisé)' ? customBrand.trim() : brand;
    if (!actualBrand) {
      setFormError('Veuillez préciser la marque de votre appareil.');
      return;
    }

    if (!model.trim()) {
      setFormError('Veuillez indiquer le modèle précis (ex: Galaxy S24 Ultra, iPhone 14 Pro).');
      return;
    }

    const emptyImei = imeiList.some((im) => !im.trim());
    if (emptyImei) {
      setFormError('Veuillez renseigner le numéro IMEI ou numéro de série pour chaque appareil.');
      return;
    }

    setSubmitting(true);
    const totalCost = selectedProduct.price * deviceQuantity;

    // Check user wallet
    const userWallet = db.getWallet(currentUser.id);
    if (userWallet.balance >= totalCost) {
      db.executeTransaction({
        fromUserId: currentUser.id,
        toUserId: 'XGROUP_TREASURY',
        amount: totalCost,
        module: 'gsm',
        description: `Règlement GSM ${selectedProduct.name} (${deviceQuantity} appareil(s))`,
      });
    }

    const allImeisCombined = imeiList.join(', ');

    const newOrder = db.createGsmOrder({
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      type: selectedProduct.category,
      brand: actualBrand,
      model,
      imeiOrSerial: allImeisCombined,
      details: `${selectedProduct.name} | Qté: ${deviceQuantity} | Notes: ${serviceDetails || 'N/A'}`,
      files: attachedFiles,
      status: 'in_progress',
      estimatedCost: totalCost,
      invoiceUrl: `/invoice/GSM-${Date.now()}`,
    });

    setCreatedOrder(newOrder);
    setSubmitting(false);
    setSelectedProduct(null);
  };

  // 2. Add Customized GSM Product to Cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const actualBrand = brand === 'Autre (Personnalisé)' ? customBrand.trim() || 'Personnalisé' : brand;

    const cartItem: MarketplaceItem = {
      id: `gsm-cart-${selectedProduct.id}-${Date.now()}`,
      title: `${selectedProduct.name} (${actualBrand} ${model || 'Standard'})`,
      type: 'service',
      price: selectedProduct.price,
      category: 'services',
      description: `Service GSM ${selectedProduct.category} pour ${deviceQuantity} appareil(s). IMEIs: ${imeiList.filter(Boolean).join(', ') || 'À fournir au technicien'}`,
      images: [selectedProduct.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'],
      createdBy: 'XGROUP_LAB',
      sellerName: selectedProduct.sellerName || 'XGROUP GSM Lab',
      visibleToRoles: ['client', 'staff', 'admin'],
      status: 'active',
      rating: selectedProduct.rating || 5.0,
    };

    if (onAddToCart) {
      for (let i = 0; i < deviceQuantity; i++) {
        onAddToCart(cartItem);
      }
      setCartSuccessNotice(`${deviceQuantity}x "${selectedProduct.name}" ajoutés à votre panier.`);
      setTimeout(() => setCartSuccessNotice(null), 3500);
      setSelectedProduct(null);
    }
  };

  // 3. Add / Publish a New GSM Product into Catalog ("Je dois pouvoir mettre produit dans gsm")
  const handlePublishNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const brandsArray = newProdBrands
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    db.addGsmProduct({
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice) || 25,
      turnaround: newProdTurnaround,
      supportedBrands: brandsArray.length > 0 ? brandsArray : ['Universal'],
      description: newProdDesc || 'Service de déblocage professionnel homologué XGROUP.',
      requirements: newProdReqs || 'Câble USB officiel et connexion internet stable.',
      inStock: true,
      rating: 5.0,
      sellerName: currentUser?.name || 'Technicien Agréé XGROUP',
      image: newProdImage,
    });

    setProducts(db.getGsmProducts());
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdReqs('');
    setCartSuccessNotice('Nouveau produit/service GSM publié avec succès dans le catalogue !');
    setTimeout(() => setCartSuccessNotice(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold mb-3">
            <Cpu className="w-3.5 h-3.5 text-yellow-400" />
            <span>Laboratoire Télécom & Banc d'Ingénierie Firmware</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Services GSM, Licences & Déblocages
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            Consultez le catalogue des prestations serveur certifiées : contournement Google FRP/Knox, désimlockage officiel Apple GSX, licences UnlockTool & Chimera, autorisations EDL Xiaomi, et sessions de flash USB-over-IP.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-yellow-400 border border-neutral-700 hover:border-yellow-400 rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-yellow-400" />
            <span>Autre besoin GSM ? Dites-le nous !</span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow transition-colors"
          >
            <Plus className="w-4 h-4 text-neutral-400" />
            <span>+ Mettre un Produit GSM</span>
          </button>

          <button
            onClick={() => onNavigate('/cart')}
            className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-yellow-400/20 cursor-pointer transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-black" />
            <span>Voir mon Panier</span>
          </button>
        </div>
      </div>

      {/* Cart or Action Notice */}
      {cartSuccessNotice && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl flex items-center justify-between animate-in fade-in">
          <span className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{cartSuccessNotice}</span>
          </span>
          <button
            onClick={() => onNavigate('/cart')}
            className="underline font-semibold hover:text-white cursor-pointer ml-3 shrink-0"
          >
            Consulter le Panier &rarr;
          </button>
        </div>
      )}

      {/* Order Created Success Banner */}
      {createdOrder && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Dossier d'Intervention GSM #{createdOrder.orderNumber} Ouvert avec Succès !
                </h3>
                <p className="text-xs text-slate-300">
                  Assigné au banc technique : <strong>{createdOrder.brand} {createdOrder.model}</strong>. Délai estimé : 15–30 mins.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Facture PDF</span>
              </button>
              <button
                onClick={() => setActiveChatRoomId(createdOrder.chatRoomId)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer shadow-md shadow-blue-600/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Direct Technicien</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-neutral-950 border border-neutral-800 p-4 sm:p-5 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher par modèle, outil, IMEI, FRP, Xiaomi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-yellow-400 text-black shadow'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brands Horizontal Scroll Filter Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 border-t border-neutral-850">
          <span className="text-[11px] font-semibold text-neutral-400 shrink-0 mr-1">Filtrer par Marque:</span>
          <button
            onClick={() => setSelectedBrandFilter('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-all ${
              selectedBrandFilter === 'all'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            Toutes les Marques
          </button>
          {['Samsung', 'Apple', 'Xiaomi', 'Motorola', 'Google', 'OnePlus', 'Huawei', 'Infinix', 'Tecno', 'Oppo'].map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrandFilter(b)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                selectedBrandFilter === b
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* GSM Products Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <span>Catalogue des Prestations & Licences Outils</span>
            <span className="text-xs text-slate-400 font-normal">({filteredProducts.length} offres disponibles)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenProductConfig(item)}
              className="bg-neutral-950 border border-neutral-800 hover:border-yellow-400/50 hover:shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between transition-all cursor-pointer group"
            >
              <div>
                {/* Visual Banner / Thumbnail */}
                <div className="relative h-44 w-full bg-black overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/85 text-yellow-400 border border-yellow-400/30 backdrop-blur-sm">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-black/85 text-neutral-200 border border-neutral-700 backdrop-blur-sm flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span>{item.turnaround}</span>
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  {/* Brand Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(Array.isArray(item.supportedBrands) ? item.supportedBrands : []).slice(0, 4).map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-semibold"
                      >
                        {b}
                      </span>
                    ))}
                    {Array.isArray(item.supportedBrands) && item.supportedBrands.length > 4 && (
                      <span className="text-[10px] text-neutral-500 font-semibold">
                        +{item.supportedBrands.length - 4} marques
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between border-t border-neutral-850">
                    <div>
                      <span className="text-2xl font-black text-white font-mono">${item.price.toFixed(2)}</span>
                      <span className="text-xs text-neutral-400 font-normal ml-1">USD / unité</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      Par: <strong className="text-neutral-300">{item.sellerName || 'Lab XGROUP'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProductConfig(item);
                  }}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-yellow-400 text-neutral-200 hover:text-black rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow border border-neutral-800 hover:border-yellow-400"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-400 group-hover:text-black" />
                  <span>Configurer & Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT CONFIGURATION & INTAKE MODAL (Opens upon selecting any GSM item) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start space-x-4 border-b border-slate-800 pb-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Délai: {selectedProduct.turnaround}</span>
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-400">{selectedProduct.description}</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Intake Form */}
            <form onSubmit={handleDirectOrder} className="space-y-4">
              {/* Brand & Model Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Marque de l'appareil (19+ options)
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {allAvailableBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Modèle / Code de fabrication
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Galaxy S24 Ultra (SM-S928B) ou iPhone 15 Pro"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Custom Brand Input if 'Autre' selected */}
              {brand === 'Autre (Personnalisé)' && (
                <div className="animate-in fade-in">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Saisissez le nom de la marque personnalisée
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Doogee, Blackview, UMIDIGI, Kyocera..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Quantity Selector: Nombre de Produits */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Nombre d'appareils / licences à traiter</span>
                  <span className="text-[10px] text-slate-400">
                    Traitement en lot (Bulk order) pris en charge par le serveur
                  </span>
                </div>

                <div className="flex items-center border border-slate-700 bg-slate-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(deviceQuantity - 1)}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-xs font-bold text-white font-mono">{deviceQuantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(deviceQuantity + 1)}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* IMEI or Serial Inputs */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Numéro(s) IMEI (15 chiffres) ou Numéro de Série
                </label>
                {imeiList.map((imei, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-500 w-16 shrink-0">
                      Appareil #{idx + 1}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 358920119842109 ou Série F2LLG08..."
                      value={imei}
                      onChange={(e) => handleImeiChange(idx, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ))}
              </div>

              {/* Technical Requirements Info */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Prérequis techniques indispensables :</span>
                </div>
                <p className="text-[11px] text-slate-400">{selectedProduct.requirements}</p>
              </div>

              {/* Notes & Optional File Attachment */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Notes de diagnostic ou précisions pour l'ingénieur (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Bloqué sur écran Hello après mise à jour, ou firmware Android 14 OneUI 6..."
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <div>
                  <span className="text-xs text-slate-400 block">Total de la commande :</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ${(selectedProduct.price * deviceQuantity).toFixed(2)} USD
                  </span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span>Ajouter au Panier</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <span>{submitting ? 'Traitement...' : 'Commander Immédiatement'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TO ADD / PUBLISH NEW GSM PRODUCT INTO CATALOG */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Publier un Produit / Forfait Service GSM</span>
              </h3>
              <p className="text-xs text-slate-400">
                Ajoutez un nouveau forfait de déblocage, licence logicielle ou prestation laboratoire dans le catalogue public.
              </p>
            </div>

            <form onSubmit={handlePublishNewProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Intitulé du Service / Produit GSM
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Samsung FRP Android 14 Bypass Instant"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as GsmType)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="FRP">FRP & Google Account</option>
                    <option value="deblocage">Déblocage Réseau SIM</option>
                    <option value="licences">Licence Outil Officiel</option>
                    <option value="reparation">EDL Flash / Unbrick</option>
                    <option value="remote">Session Remote USB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Prix Unitaire (USD)</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    min="1"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Délai estimé</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 10-20 min, Instantané, 1-24h"
                    value={newProdTurnaround}
                    onChange={(e) => setNewProdTurnaround(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Marques compatibles (séparées par virgules)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Samsung, Xiaomi, Apple, Pixel"
                    value={newProdBrands}
                    onChange={(e) => setNewProdBrands(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Description & Spécifications
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Détails sur la méthode, versions Android supportées..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Prérequis techniques demandés au client
                </label>
                <input
                  type="text"
                  placeholder="Ex: Câble USB officiel, PC Windows, USB Redirector..."
                  value={newProdReqs}
                  onChange={(e) => setNewProdReqs(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-cyan-600/30 transition-all"
                >
                  Publier dans le Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal if generated */}
      {createdOrder && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          customData={{
            orderNumber: createdOrder.orderNumber,
            date: new Date(createdOrder.createdAt).toLocaleDateString(),
            userName: createdOrder.userName,
            userEmail: createdOrder.userEmail,
            items: [
              {
                title: `Service GSM ${createdOrder.type} (${createdOrder.brand} ${createdOrder.model})`,
                price: createdOrder.estimatedCost,
                quantity: 1,
              },
            ],
            total: createdOrder.estimatedCost,
            type: 'gsm',
            status: 'cleared',
          }}
        />
      )}

      {/* Technician Live Chat Drawer */}
      {activeChatRoomId && (
        <div className="fixed bottom-6 right-6 w-96 z-50 animate-in slide-in-from-bottom-5">
          <ChatDrawer
            chatRoomId={activeChatRoomId}
            title={`Assistance Technique GSM (${createdOrder?.orderNumber || 'Lab'})`}
            category="gsm"
            onClose={() => setActiveChatRoomId(null)}
          />
        </div>
      )}

      {/* Universal Request Modal */}
      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="gsm"
      />
    </div>
  );
};
