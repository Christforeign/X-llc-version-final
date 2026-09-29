import React, { useState, useEffect } from 'react';
import {
  Package,
  Settings,
  DollarSign,
  CreditCard,
  FileText,
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  X as CloseIcon,
  Toggle2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Truck,
  Zap,
  MessageCircle,
  BookOpen,
  Hammer,
  TrendingUp,
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { MarketplaceItem, ModuleFlags, Shipment } from '../models/types';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

const MODULES = [
  { key: 'marketplace' as const, label: '🛍️ Marketplace', icon: Package },
  { key: 'exchange' as const, label: '🔄 Exchange', icon: Zap },
  { key: 'shipping' as const, label: '🚚 Shipping', icon: Truck },
  { key: 'gsm' as const, label: '📱 GSM Services', icon: FileText },
  { key: 'games' as const, label: '🎮 Games', icon: TrendingUp },
  { key: 'learning' as const, label: '📚 Learning', icon: BookOpen },
  { key: 'support' as const, label: '💬 Support', icon: MessageCircle },
  { key: 'creation' as const, label: '🎨 Creation', icon: Hammer },
];

const CURRENCY_RATE = 120; // 1 USD = 120 GRD (Haitian Gourde)

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">🔒 Accès Refusé</h1>
          <p className="text-gray-600 mt-2">Vous n'avez pas les permissions admin.</p>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'modules' | 'products' | 'shipping' | 'payments' | 'ads' | 'settings'>('modules');
  const [products, setProducts] = useState<MarketplaceItem[]>(db.getProducts());
  const [moduleFlags, setModuleFlags] = useState<ModuleFlags>(db.getModuleFlags());
  const [shipments, setShipments] = useState<Shipment[]>(db.getShipments());
  const [currency, setCurrency] = useState<'USD' | 'GRD'>('USD');

  const [editingProduct, setEditingProduct] = useState<MarketplaceItem | null>(null);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const [newProductForm, setNewProductForm] = useState({
    title: '',
    type: 'product' as 'product' | 'service',
    price: 0,
    originalPrice: 0,
    category: 'general',
    description: '',
    images: [''],
    sellerName: 'XGROUP',
  });

  const [adsConfig, setAdsConfig] = useState({
    enabled: localStorage.getItem('xgroup_ads_enabled') === 'true',
    adsterra_code: localStorage.getItem('xgroup_adsterra_code') || '',
  });

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem('xgroup_payment_methods');
    return saved ? JSON.parse(saved) : {
      moncash: { enabled: true, number: '' },
      natcash: { enabled: true, number: '' },
      zelle: { enabled: false, number: '' },
      usdt: { enabled: true, number: '' },
      card: { enabled: true, number: '' },
    };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('xgroup_ads_enabled', String(adsConfig.enabled));
    localStorage.setItem('xgroup_adsterra_code', adsConfig.adsterra_code);
  }, [adsConfig]);

  useEffect(() => {
    localStorage.setItem('xgroup_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  // Convert price between USD and GRD
  const convertPrice = (price: number, from: 'USD' | 'GRD', to: 'USD' | 'GRD') => {
    if (from === to) return price;
    if (from === 'USD') return Math.round(price * CURRENCY_RATE);
    return Math.round(price / CURRENCY_RATE * 100) / 100;
  };

  // ===== MODULES MANAGEMENT =====
  const toggleModule = (key: keyof ModuleFlags) => {
    const updated = { ...moduleFlags, [key]: !moduleFlags[key] };
    setModuleFlags(updated);
    db.setModuleFlags(updated);
  };

  // ===== PRODUCTS MANAGEMENT =====
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) return;

    const newProduct: MarketplaceItem = {
      id: `prod-${Date.now()}`,
      title: newProductForm.title,
      type: newProductForm.type,
      price: newProductForm.price,
      category: newProductForm.category,
      description: newProductForm.description,
      images: newProductForm.images.filter((img) => img.trim()),
      createdBy: currentUser?.id || '',
      sellerName: newProductForm.sellerName,
      visibleToRoles: ['admin', 'staff', 'client', 'partenaire'],
      status: 'active',
      stock: 999,
      rating: 5.0,
    };

    db.createProduct(newProduct);
    setProducts([...products, newProduct]);
    setNewProductForm({
      title: '',
      type: 'product',
      price: 0,
      originalPrice: 0,
      category: 'general',
      description: '',
      images: [''],
      sellerName: 'XGROUP',
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    db.deleteProduct(editingProduct.id);
    db.createProduct(editingProduct);
    setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    db.deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
  };

  // ===== SHIPPING MANAGEMENT =====
  const updateShipmentStatus = (id: string, status: string) => {
    db.updateShipment(id, {
      status: status as any,
      lastUpdate: new Date().toISOString(),
    });
    setShipments(shipments.map((s) => (s.id === id ? { ...s, status: status as any, lastUpdate: new Date().toISOString() } : s)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-black">🔧 XGROUP ADMIN PANEL</h1>
              <p className="text-blue-100 text-sm mt-1">Gestion Complète • {currentUser?.email}</p>
            </div>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-lg transition shadow-md"
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-blue-500/30">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'modules', label: '⚡ Modules', icon: Zap },
              { id: 'products', label: '📦 Produits', icon: Package },
              { id: 'shipping', label: '🚚 Expéditions', icon: Truck },
              { id: 'payments', label: '💳 Paiements', icon: CreditCard },
              { id: 'ads', label: '📢 Annonces', icon: TrendingUp },
              { id: 'settings', label: '⚙️ Paramètres', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== MODULES TAB ===== */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">⚡ Gestion des Modules</h2>
              <p className="text-gray-600 mb-6">Activez ou désactivez les fonctionnalités du site</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MODULES.map((module) => (
                  <div
                    key={module.key}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{module.label}</h3>
                      <button
                        onClick={() => toggleModule(module.key)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                          moduleFlags[module.key] ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                            moduleFlags[module.key] ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="text-sm text-center">
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        moduleFlags[module.key]
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {moduleFlags[module.key] ? '✓ Actif' : '✗ Inactif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Ajouter un Produit/Service
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Nom du produit *"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <select
                  value={newProductForm.type}
                  onChange={(e) => setNewProductForm({ ...newProductForm, type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="product">Produit Physique</option>
                  <option value="service">Service / Numérique</option>
                </select>
                <input
                  type="number"
                  placeholder={`Prix (${currency})`}
                  step="0.01"
                  value={newProductForm.price}
                  onChange={(e) => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Catégorie"
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description"
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="URL Image"
                  value={newProductForm.images[0]}
                  onChange={(e) => setNewProductForm({ ...newProductForm, images: [e.target.value] })}
                  className="w-full md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="md:col-span-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md"
                >
                  ✓ Publier le Produit
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Catalogue ({products.length} produits)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{product.title}</h3>
                      <p className="text-blue-600 font-bold text-lg mt-1">
                        {currency === 'USD' ? '$' : 'G'}{(currency === 'USD' ? product.price : convertPrice(product.price, 'USD', 'GRD')).toFixed(2)}
                      </p>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-semibold text-sm transition"
                        >
                          ✏️ Éditer
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded font-semibold text-sm transition"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                  <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">Éditer Produit</h2>
                    <button onClick={() => setEditingProduct(null)} className="hover:bg-blue-800 p-1 rounded">
                      <CloseIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="Titre"
                    />
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="Description"
                      rows={4}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder={`Prix (${currency})`}
                      />
                      <input
                        type="text"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="Catégorie"
                      />
                    </div>
                    <input
                      type="url"
                      value={editingProduct.images[0]}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="URL Image"
                    />
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleUpdateProduct}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                      >
                        ✓ Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition"
                      >
                        ✗ Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== SHIPPING TAB ===== */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚚 Gestion des Expéditions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Suivi</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Statut Actuel</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-blue-600">{shipment.trackingNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{shipment.recipientName}</td>
                      <td className="px-6 py-4">
                        <select
                          value={shipment.status}
                          onChange={(e) => updateShipmentStatus(shipment.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="registered">📦 Enregistré</option>
                          <option value="in-transit">🚛 En Transit</option>
                          <option value="out-for-delivery">📍 En livraison</option>
                          <option value="delivered">✓ Livré</option>
                          <option value="cancelled">✗ Annulé</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-semibold transition">
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== PAYMENTS TAB ===== */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            {/* Currency Selector */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💱 Devise par Défaut</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-6 py-3 font-bold rounded-lg transition ${
                    currency === 'USD'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  💵 USD (Dollars)
                </button>
                <button
                  onClick={() => setCurrency('GRD')}
                  className={`px-6 py-3 font-bold rounded-lg transition ${
                    currency === 'GRD'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  🇭🇹 GRD (Gourdes)
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">Taux: 1 USD = {CURRENCY_RATE} GRD</p>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Méthodes de Paiement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(paymentMethods).map(([key, method]: any) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 text-lg capitalize">{key}</h3>
                      <button
                        onClick={() => setPaymentMethods({ ...paymentMethods, [key]: { ...method, enabled: !method.enabled } })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                          method.enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                            method.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={method.number}
                      onChange={(e) => setPaymentMethods({ ...paymentMethods, [key]: { ...method, number: e.target.value } })}
                      placeholder="Numéro de compte"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className={`inline-block mt-3 px-3 py-1 rounded text-xs font-bold ${
                      method.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {method.enabled ? '✓ Actif' : '✗ Inactif'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== ADS TAB ===== */}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📢 Gestion des Annonces</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adsConfig.enabled}
                    onChange={(e) => setAdsConfig({ ...adsConfig, enabled: e.target.checked })}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <span className="font-bold text-gray-900">Activer les Annonces Publicitaires</span>
                </label>
              </div>
              {adsConfig.enabled && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Code Adsterra / Google AdSense</label>
                  <textarea
                    value={adsConfig.adsterra_code}
                    onChange={(e) => setAdsConfig({ ...adsConfig, adsterra_code: e.target.value })}
                    placeholder="<!-- Collez votre code d'annonce ici -->"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                ✓ Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Paramètres du Site</h2>
              <div className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Nom du Site</label>
                  <input
                    type="text"
                    defaultValue="XGROUP LLC"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                  <textarea
                    defaultValue="Infrastructure e-commerce autonome compatible WordPress"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Email Support</label>
                  <input
                    type="email"
                    defaultValue="support@xgroup.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                  ✓ Sauvegarder
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🔐 Sécurité & API</h2>
              <div className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Clé API Resend</label>
                  <input
                    type="password"
                    placeholder="re_xxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                  ✓ Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
