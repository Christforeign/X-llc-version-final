import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Clock,
  Package,
  Smartphone,
  Award,
  FileText,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Shield,
  CreditCard,
  Download,
  Plus,
  Trash2,
  Settings,
  Globe,
  Check,
  CheckCircle2,
  HelpCircle,
  Upload,
  Copy,
  Users,
  Key,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { walletService } from '../services/walletService';
import { User, Wallet as WalletType, LedgerEntry, Order, GsmOrder, Shipment, Certificate, MarketplaceItem } from '../models/types';
import { InvoiceModal } from '../components/InvoiceModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { CertificateGenerator } from '../components/CertificateGenerator';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface DashboardPageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenAuth, onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const siteConfig = db.getSiteConfig();
  const isAdmin = currentUser?.email?.toLowerCase() === 'blaisechristeveste@gmail.com' || currentUser?.role === 'admin';

  // Admin Tab State
  const [adminTab, setAdminTab] = useState<'products' | 'orders' | 'wallets' | 'gateways' | 'api' | 'branding'>('products');

  // Client Tab State
  const [activeTab, setActiveTab] = useState<'wallet' | 'orders' | 'gsm' | 'shipments' | 'certs'>('wallet');

  // Deposit State
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [manualMethod, setManualMethod] = useState<'moncash' | 'natcash' | 'zelle' | 'cashapp' | 'usdt'>('moncash');
  const [senderIdentifier, setSenderIdentifier] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [wallet, setWallet] = useState<WalletType | null>(currentUser ? db.getWallet(currentUser.id) : null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Admin New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdType, setNewProdType] = useState<'physique' | 'numerique' | 'reservation' | 'abonnement' | 'autres'>('physique');
  const [newProdPrice, setNewProdPrice] = useState<number>(25);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(35);
  const [newProdCategory, setNewProdCategory] = useState<any>('smartphones');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDigitalPayload, setNewProdDigitalPayload] = useState(''); // APK / file / link
  const [newProdSuccessMsg, setNewProdSuccessMsg] = useState<string | null>(null);

  // Admin Fund User Wallet State
  const [fundUserEmail, setFundUserEmail] = useState('');
  const [fundAmount, setFundAmount] = useState<number>(100);
  const [fundMsg, setFundMsg] = useState<string | null>(null);

  // Admin Gateway toggles state
  const [gateways, setGateways] = useState(siteConfig.paymentGateways || {
    moncash: true,
    wallet: true,
    card: true,
    crypto: true,
    coinbase: true,
    bankTransfer: true,
    cashOnDelivery: true,
    customPayment: true,
    storeCredit: true,
  });

  // Admin Site Branding State
  const [brandSiteName, setBrandSiteName] = useState(siteConfig.siteName || 'XGROUP LLC');
  const [gameUrl, setGameUrl] = useState(siteConfig.gameIframeUrl || 'https://html5games.com');
  const [resendApiKey, setResendApiKey] = useState(siteConfig.systemEmailConfig?.apiKeySet ? 're_live_xxxxxxxx' : '');

  useEffect(() => {
    if (!currentUser) return;
    const unsub = db.subscribe(() => {
      setWallet(db.getWallet(currentUser.id));
    });
    return () => unsub();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-4 text-white">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Wallet className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">Connexion Requise</h2>
          <p className="text-xs text-neutral-400">
            Veuillez vous authentifier pour accéder à votre espace sécurisé.
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

  // =========================================================================
  // ADMIN DASHBOARD VIEW (When logged in as blaisechristeveste@gmail.com / admin)
  // =========================================================================
  if (isAdmin) {
    const allProducts = db.getProducts();
    const allOrders = db.getOrders();

    const handleCreateProduct = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newProdName.trim()) return;

      const item: MarketplaceItem = {
        id: `prod-${Date.now()}`,
        title: newProdName.trim(),
        type: newProdType === 'physique' ? 'product' : 'service',
        price: newProdPrice,
        category: newProdCategory,
        description: `${newProdDesc}${newProdDigitalPayload ? ` [Lien de Livraison Numérique: ${newProdDigitalPayload}]` : ''}`,
        images: [newProdImage.trim() || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'],
        createdBy: currentUser.id,
        sellerName: 'XGROUP Admin Principal',
        visibleToRoles: ['admin', 'staff', 'client', 'partenaire'],
        status: 'active',
        stock: 999,
        rating: 5.0,
      };

      db.createProduct(item);
      setNewProdName('');
      setNewProdDesc('');
      setNewProdImage('');
      setNewProdDigitalPayload('');
      setNewProdSuccessMsg(`Produit "${item.title}" ajouté et publié avec succès sur le catalogue !`);
      setTimeout(() => setNewProdSuccessMsg(null), 4000);
    };

    const handleFundWallet = (e: React.FormEvent) => {
      e.preventDefault();
      const targetUser = db.getUserByEmail(fundUserEmail.trim());
      if (!targetUser) {
        setFundMsg('❌ Utilisateur introuvable avec cet email.');
        return;
      }
      walletService.deposit(targetUser.id, targetUser.email, fundAmount, 'Ajout de fonds administrateur (XGROUP Principal)');
      setFundMsg(`✅ +$${fundAmount} USD crédités avec succès sur le compte de ${targetUser.email}.`);
      setFundUserEmail('');
      setTimeout(() => setFundMsg(null), 4000);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-neutral-100">
        {/* Admin Super Header */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-xl font-black text-black shadow-lg">
              👑
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Panneau de Contrôle Administrateur (Super Admin)</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400 text-black border border-amber-500">
                  Accès Total
                </span>
              </div>
              <p className="text-xs text-amber-300/80 mt-0.5">{currentUser.email} — Contrôle complet de la plateforme</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-neutral-950 px-4 py-2.5 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Trésorerie Plateforme</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                ${db.getTreasuryWallet().balance.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3 text-xs font-bold">
          {[
            { key: 'products', label: '📦 Gestion des Produits (TakeApp)', icon: <Layers className="w-4 h-4 text-amber-400" /> },
            { key: 'orders', label: `🛒 Commandes & Achats (${allOrders.length})`, icon: <Package className="w-4 h-4 text-emerald-400" /> },
            { key: 'wallets', label: '💰 Ajouter des Fonds / Portefeuilles', icon: <DollarSign className="w-4 h-4 text-blue-400" /> },
            { key: 'gateways', label: '💳 Moyens de Paiement & Passerelles', icon: <CreditCard className="w-4 h-4 text-purple-400" /> },
            { key: 'api', label: '⚙️ API & Notifications (Resend)', icon: <Key className="w-4 h-4 text-cyan-400" /> },
            { key: 'branding', label: '✨ Logo, Animation & Jeux Iframe', icon: <Sparkles className="w-4 h-4 text-rose-400" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAdminTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center space-x-2 ${
                adminTab === tab.key
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-black'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {adminTab === 'products' && (
          <div className="space-y-8">
            {newProdSuccessMsg && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{newProdSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Ajouter un Nouveau Produit ou Service (Formulaire Complet)</span>
                </h3>
                <span className="text-[10px] text-neutral-500">Publication instantanée</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Nom du Produit *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Ex: iPhone 15 Pro Max ou Recharge Diamants Freefire"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Type de Produit</label>
                  <select
                    value={newProdType}
                    onChange={(e) => setNewProdType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="physique">Physique (Expédition / Livraison)</option>
                    <option value="numerique">Numérique (Livraison automatique APK / Fichier / Lien)</option>
                    <option value="reservation">Réservation / Service</option>
                    <option value="abonnement">Abonnement</option>
                    <option value="autres">Autres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Prix de Vente ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Prix Original (Optionnel)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">URL de l'Image du Produit</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Lien de Livraison Numérique Automatique (APK / Fichier / Clé / Lien)</label>
                <input
                  type="text"
                  value={newProdDigitalPayload}
                  onChange={(e) => setNewProdDigitalPayload(e.target.value)}
                  placeholder="Ex: https://xgroup-llc.com/downloads/app-v1.apk ou Clé de licence #7821"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-amber-500/50 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-neutral-500 mt-1">Ce contenu sera envoyé automatiquement au client dès validation du paiement par portefeuille ou MonCash.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Description Détaillée</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Détails, instructions d'utilisation..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  Publier le Produit sur le Site
                </button>
              </div>
            </form>

            {/* Existing Catalog List */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">Catalogue Actuel ({allProducts.length} produits)</h3>
              {allProducts.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">Aucun produit pour le moment. Le catalogue est propre à zéro.</p>
              ) : (
                <div className="space-y-2">
                  {allProducts.map((p, index) => (
                    <div key={`prod-${index}-${p.id}`} className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-white">{p.title}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">${p.price.toFixed(2)} USD</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          db.deleteProduct(p.id);
                        }}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {adminTab === 'orders' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Validation des Commandes & Achats ({allOrders.length})</h3>
            {allOrders.length === 0 ? (
              <p className="text-xs text-neutral-500 py-8 text-center">Aucune commande enregistrée. Tout est à zéro.</p>
            ) : (
              <div className="space-y-3">
                {allOrders.map((o, index) => (
                  <div key={`ord-${index}-${o.id}`} className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-400">Commande #{o.orderNumber}</span>
                      <span className="text-emerald-400 font-mono">${o.total.toFixed(2)} USD</span>
                    </div>
                    <div className="text-neutral-400">Client : {o.userEmail} ({o.paymentMethod.toUpperCase()})</div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          db.updateOrderStatus(o.id, 'paid');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                      >
                        Valider & Expédier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WALLETS & FUNDS */}
        {adminTab === 'wallets' && (
          <form onSubmit={handleFundWallet} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl max-w-xl">
            <h3 className="text-sm font-bold text-white">Ajouter des Fonds / Créditer un Portefeuille Client</h3>
            {fundMsg && <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-bold">{fundMsg}</div>}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">Email du client</label>
              <input
                type="email"
                required
                value={fundUserEmail}
                onChange={(e) => setFundUserEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">Montant en USD ($)</label>
              <input
                type="number"
                required
                min="1"
                value={fundAmount}
                onChange={(e) => setFundAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer">
              Créditer le Portefeuille Immédiatement
            </button>
          </form>
        )}

        {/* TAB 4: GATEWAYS */}
        {adminTab === 'gateways' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl max-w-xl">
            <h3 className="text-sm font-bold text-white">Activer / Désactiver les Moyens de Paiement</h3>
            <div className="space-y-3 text-xs">
              {[
                { key: 'moncash', label: 'MonCash & Natcash (Haïti)' },
                { key: 'wallet', label: 'Portefeuille Interne XGROUP' },
                { key: 'card', label: 'Carte Bancaire (Stripe / Visa / Master)' },
                { key: 'crypto', label: 'Crypto USDT TRC20' },
                { key: 'coinbase', label: 'Coinbase Business' },
                { key: 'bankTransfer', label: 'Bank transfer (Virement bancaire)' },
                { key: 'cashOnDelivery', label: 'Cash on Delivery (Paiement à la livraison)' },
                { key: 'customPayment', label: 'Custom Payment (Paiement personnalisé)' },
                { key: 'storeCredit', label: 'Store Credit' },
              ].map((g) => (
                <label key={g.key} className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer">
                  <span className="font-bold text-white">{g.label}</span>
                  <input
                    type="checkbox"
                    checked={(gateways as any)[g.key]}
                    onChange={(e) => {
                      const updated = { ...gateways, [g.key]: e.target.checked };
                      setGateways(updated);
                      db.updateSiteConfig({ paymentGateways: updated });
                    }}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: API CONFIG (RESEND) */}
        {adminTab === 'api' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl max-w-xl">
            <h3 className="text-sm font-bold text-white">Configuration API Resend (E-mails & OTP)</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300">Clé API Resend (ex: re_123456789)</label>
              <input
                type="password"
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                placeholder="re_xxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-mono"
              />
              <button
                onClick={() => {
                  db.updateSiteConfig({
                    systemEmailConfig: {
                      provider: 'Resend',
                      fromName: 'XGROUP Dispatcher',
                      fromEmail: 'noreply@xgroup.com',
                      apiKeySet: !!resendApiKey,
                    },
                  });
                  alert('Configuration API Resend enregistrée avec succès.');
                }}
                className="mt-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs cursor-pointer"
              >
                Sauvegarder la Clé API Resend
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: BRANDING & GAMES */}
        {adminTab === 'branding' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl max-w-xl">
            <h3 className="text-sm font-bold text-white">Personnalisation du Site (Nom, Logo, URL Iframe Jeux)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Nom du Site</label>
                <input
                  type="text"
                  value={brandSiteName}
                  onChange={(e) => setBrandSiteName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-300 mb-1">URL Iframe des Jeux</label>
                <input
                  type="url"
                  value={gameUrl}
                  onChange={(e) => setGameUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono"
                />
              </div>
              <button
                onClick={() => {
                  db.updateSiteConfig({ siteName: brandSiteName, gameIframeUrl: gameUrl });
                  alert('Paramètres de marque et de jeux mis à jour !');
                }}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs cursor-pointer"
              >
                Enregistrer les Modifications
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // CLIENT DASHBOARD VIEW
  // =========================================================================
  const userOrders = db.getOrders().filter((o) => o.userId === currentUser.id);
  const userGsmOrders = db.getGsmOrders().filter((g) => g.userId === currentUser.id);
  const userShipments = db.getShipments().filter((s) => s.userId === currentUser.id);
  const userCerts = db.getCertificates().filter((c) => c.userId === currentUser.id);
  const userLedger = wallet?.ledger || [];

  const handleManualDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    if (!transactionRef.trim() || !senderIdentifier.trim()) {
      alert('Veuillez renseigner votre nom/téléphone et la référence de la transaction.');
      return;
    }

    walletService.deposit(
      currentUser.id,
      currentUser.email,
      depositAmount,
      `Recharge ${manualMethod.toUpperCase()} (Réf: ${transactionRef.trim()} - De: ${senderIdentifier.trim()})`
    );
    setWallet(db.getWallet(currentUser.id));
    setDepositSuccessMsg(`Rechargement de $${depositAmount} USD soumis avec succès.`);
    setTransactionRef('');
    setSenderIdentifier('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Solde Disponible</span>
            <span className="text-lg font-black text-emerald-400 font-mono">${wallet?.balance.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
        {[
          { key: 'wallet', label: 'Portefeuille & Dépôt', icon: <Wallet className="w-4 h-4" /> },
          { key: 'orders', label: `Commandes (${userOrders.length})`, icon: <Package className="w-4 h-4" /> },
          { key: 'gsm', label: `GSM (${userGsmOrders.length})`, icon: <Smartphone className="w-4 h-4" /> },
          { key: 'shipments', label: `Expéditions (${userShipments.length})`, icon: <Package className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'wallet' && (
        <div className="space-y-6">
          {depositSuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300">
              {depositSuccessMsg}
            </div>
          )}

          <form onSubmit={handleManualDeposit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white">Recharger via MonCash / Natcash / USDT</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Montant USD ($)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Votre Numéro / Nom envoyeur</label>
              <input
                type="text"
                required
                value={senderIdentifier}
                onChange={(e) => setSenderIdentifier(e.target.value)}
                placeholder="+509 ..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Référence de Transaction</label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Réf SMS ou Hash"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer">
              Soumettre la Demande de Dépôt
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
