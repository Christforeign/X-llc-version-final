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
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { MarketplaceItem } from '../models/types';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

interface Product extends MarketplaceItem {}

interface PaymentConfig {
  id: string;
  name: string;
  number: string;
  details: string;
  enabled: boolean;
}

interface PageConfig {
  id: string;
  title: string;
  description: string;
  content: string;
  path: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Accès Refusé</h1>
          <p className="text-gray-600 mt-2">Vous n'avez pas les permissions admin.</p>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'products' | 'payments' | 'pages' | 'settings' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [payments, setPayments] = useState<PaymentConfig[]>(() => {
    const saved = localStorage.getItem('xgroup_payments_config');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'MonCash', number: '', details: '', enabled: true },
      { id: '2', name: 'NatCash', number: '', details: '', enabled: true },
      { id: '3', name: 'Zelle', number: '', details: '', enabled: false },
      { id: '4', name: 'USDT', number: '', details: '', enabled: true },
    ];
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentConfig | null>(null);
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

  // Save payments to localStorage
  useEffect(() => {
    localStorage.setItem('xgroup_payments_config', JSON.stringify(payments));
  }, [payments]);

  // ===== PRODUCTS MANAGEMENT =====
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: newProductForm.title,
      type: newProductForm.type,
      price: newProductForm.price,
      category: newProductForm.category,
      description: newProductForm.description,
      images: newProductForm.images.filter(img => img.trim()),
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
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    db.deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  // ===== PAYMENTS MANAGEMENT =====
  const handleUpdatePayment = () => {
    if (!editingPayment) return;
    setPayments(payments.map(p => p.id === editingPayment.id ? editingPayment : p));
    setEditingPayment(null);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const handleAddPayment = () => {
    const newPayment: PaymentConfig = {
      id: `pay-${Date.now()}`,
      name: 'Nouveau Paiement',
      number: '',
      details: '',
      enabled: true,
    };
    setPayments([...payments, newPayment]);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔧 Panneau d'Administration</h1>
              <p className="text-sm text-gray-600 mt-1">Gérez votre plateforme XGROUP LLC</p>
            </div>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
            >
              Retour au site
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'products', label: '📦 Produits', icon: Package },
              { id: 'payments', label: '💳 Paiements', icon: CreditCard },
              { id: 'pages', label: '📄 Pages', icon: FileText },
              { id: 'orders', label: '🛒 Commandes', icon: Users },
              { id: 'settings', label: '⚙️ Paramètres', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-4 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
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
        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ajouter un Nouveau Produit
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom du produit"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <select
                  value={newProductForm.type}
                  onChange={(e) => setNewProductForm({ ...newProductForm, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="product">Produit Physique</option>
                  <option value="service">Service / Numérique</option>
                </select>
                <input
                  type="number"
                  placeholder="Prix (USD)"
                  step="0.01"
                  value={newProductForm.price}
                  onChange={(e) => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  placeholder="Prix original (USD)"
                  step="0.01"
                  value={newProductForm.originalPrice}
                  onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Catégorie"
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Nom du vendeur"
                  value={newProductForm.sellerName}
                  onChange={(e) => setNewProductForm({ ...newProductForm, sellerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description"
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="URL Image"
                  value={newProductForm.images[0]}
                  onChange={(e) => setNewProductForm({ ...newProductForm, images: [e.target.value] })}
                  className="w-full md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="md:col-span-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  Ajouter le Produit
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Produits ({products.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h3 className="font-bold text-gray-900 text-sm">{product.title}</h3>
                    <p className="text-blue-600 font-bold text-sm mt-1">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold transition"
                      >
                        <Edit2 className="w-3 h-3 inline mr-1" /> Éditer
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-semibold transition"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" /> Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Éditer Produit</h2>
                    <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-gray-700">
                      <CloseIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Titre"
                    />
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Description"
                      rows={4}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Prix"
                    />
                    <input
                      type="url"
                      value={editingProduct.images[0]}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="URL Image"
                    />
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleUpdateProduct}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                      >
                        <Save className="w-4 h-4 inline mr-2" /> Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== PAYMENTS TAB ===== */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">💳 Configurer les Moyens de Paiement</h2>
                <button
                  onClick={handleAddPayment}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {payments.map((payment) => (
                  <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                    {editingPayment?.id === payment.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingPayment.name}
                          onChange={(e) => setEditingPayment({ ...editingPayment, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Nom"
                        />
                        <input
                          type="text"
                          value={editingPayment.number}
                          onChange={(e) => setEditingPayment({ ...editingPayment, number: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Numéro de compte"
                        />
                        <textarea
                          value={editingPayment.details}
                          onChange={(e) => setEditingPayment({ ...editingPayment, details: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Détails supplémentaires"
                          rows={2}
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingPayment.enabled}
                            onChange={(e) => setEditingPayment({ ...editingPayment, enabled: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">Activé</span>
                        </label>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleUpdatePayment}
                            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={() => setEditingPayment(null)}
                            className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded transition"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{payment.name}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${payment.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {payment.enabled ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        {payment.number && (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">Numéro de compte:</p>
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                              <span className="text-sm font-mono text-gray-800">{payment.number}</span>
                              <button
                                onClick={() => copyToClipboard(payment.number)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {payment.details && (
                          <div>
                            <p className="text-xs text-gray-600">Détails:</p>
                            <p className="text-sm text-gray-800">{payment.details}</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setEditingPayment(payment)}
                            className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold rounded transition"
                          >
                            Éditer
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded transition"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== PAGES TAB ===== */}
        {activeTab === 'pages' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📄 Pages du Site</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Accueil', path: '/' },
                { name: 'À Propos', path: '/about' },
                { name: 'Marché', path: '/marketplace' },
                { name: 'Expédition', path: '/shipping' },
                { name: 'Contact', path: '/contact' },
                { name: 'Support', path: '/support' },
              ].map((page) => (
                <button
                  key={page.path}
                  onClick={() => onNavigate(page.path)}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition text-left"
                >
                  <h3 className="font-bold text-gray-900">{page.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{page.path}</p>
                  <button className="mt-3 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold rounded">
                    Éditer
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🛒 Commandes Récentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Paiement</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {db.getOrders().slice(-5).reverse().map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">#{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.userEmail}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 uppercase">{order.paymentMethod}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'paid' ? 'Payée' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            if (order.status !== 'paid') {
                              db.updateOrderStatus(order.id, 'paid');
                            }
                          }}
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold rounded transition"
                        >
                          {order.status === 'paid' ? '✓ Payée' : 'Valider'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">⚙️ Paramètres Généraux</h2>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Nom du Site</label>
                  <input
                    type="text"
                    defaultValue="XGROUP LLC"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea
                    defaultValue="Infrastructure e-commerce autonome compatible WordPress"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Support</label>
                  <input
                    type="email"
                    defaultValue="support@xgroup.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                  Sauvegarder
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🔐 Sécurité</h2>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Clé API Resend</label>
                  <input
                    type="password"
                    placeholder="re_xxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
