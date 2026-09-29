import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  CreditCard,
  Coins,
  CheckCircle,
  ArrowRight,
  FileText,
  Copy,
  Upload,
  QrCode,
  Building2,
  Lock,
  FileCheck,
  Smartphone,
  AlertCircle,
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { CartItem } from './CartPage';
import { InvoiceModal } from '../components/InvoiceModal';
import { Order, PaymentProof } from '../models/types';

interface CheckoutPageProps {
  cart: CartItem[];
  onClearCart: () => void;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onClearCart, onNavigate, onOpenAuth }) => {
  const currentUser = authService.getCurrentUser();
  const [shippingAddress, setShippingAddress] = useState('8200 NW 27th St, Doral, FL 33122, USA');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'crypto' | 'wire'>('card');
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState(currentUser?.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Crypto payment fields
  const [cryptoNetwork, setCryptoNetwork] = useState<'USDT-TRC20' | 'USDT-ERC20' | 'BTC'>('USDT-TRC20');
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [cryptoProofImage, setCryptoProofImage] = useState<string | null>(null);
  const [addressCopied, setAddressCopied] = useState(false);

  // Wire / MonCash payment fields
  const [wireReference, setWireReference] = useState('');
  const [wireProofImage, setWireProofImage] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Connexion requise pour le paiement</h2>
          <p className="text-xs text-slate-400">
            Veuillez vous authentifier pour générer votre bon de commande et finaliser la transaction sécurisée.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-blue-600/30 transition-all"
          >
            Se Connecter / Créer un Compte
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 35 : 0;
  const total = subtotal + shipping;
  const wallet = db.getWallet(currentUser.id);

  // Crypto Addresses
  const cryptoWallets = {
    'USDT-TRC20': {
      address: 'TY4dKjG2e8mZpQn9vRs7bXc1TaLw8mPk4B',
      network: 'Tron Network (TRC20)',
      feeEstimate: '~1 USDT',
    },
    'USDT-ERC20': {
      address: '0x71C2d0b593E94b5952B9E3bE8aFF53bA84c172A4',
      network: 'Ethereum Mainnet (ERC20)',
      feeEstimate: '~3–5 USDT',
    },
    BTC: {
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      network: 'Bitcoin Native SegWit',
      feeEstimate: '~0.0001 BTC',
    },
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2500);
  };

  const handleSimulateProofUpload = (type: 'crypto' | 'wire') => {
    // Generate a simulated upload or trigger standard file reader
    const sampleProof = `https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80`;
    if (type === 'crypto') {
      setCryptoProofImage(sampleProof);
    } else {
      setWireProofImage(sampleProof);
    }
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'crypto' | 'wire') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (type === 'crypto') setCryptoProofImage(reader.result);
          else setWireProofImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (cart.length === 0) {
      setValidationError('Votre panier est vide.');
      return;
    }

    if (paymentMethod === 'wallet' && wallet.balance < total) {
      setValidationError(`Solde insuffisant dans votre portefeuille ($${wallet.balance.toFixed(2)} USD). Veuillez recharger votre solde ou choisir Carte ou Crypto.`);
      return;
    }

    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setValidationError('Veuillez saisir un numéro de carte bancaire valide (16 chiffres).');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 4) {
        setValidationError("Veuillez renseigner la date d'expiration (MM/AA).");
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        setValidationError('Veuillez saisir le code de sécurité CVC/CVV.');
        return;
      }
    }

    if (paymentMethod === 'crypto') {
      if (!cryptoTxHash.trim() && !cryptoProofImage) {
        setValidationError('Veuillez renseigner le TxID (hachage de transaction) OU téléverser la capture de paiement/reçu.');
        return;
      }
    }

    if (paymentMethod === 'wire') {
      if (!wireReference.trim() && !wireProofImage) {
        setValidationError('Veuillez renseigner le numéro de référence MonCash/Bancaire OU joindre la capture du virement.');
        return;
      }
    }

    setProcessing(true);

    setTimeout(() => {
      // If wallet, execute real ledger transaction
      if (paymentMethod === 'wallet') {
        db.executeTransaction({
          fromUserId: currentUser.id,
          toUserId: 'XGROUP_TREASURY',
          amount: total,
          module: 'marketplace',
          description: `Règlement commande Marketplace (${cart.length} articles)`,
        });
      }

      const orderNumber = `XG-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      const proof: PaymentProof = {
        method: paymentMethod,
        cardLast4: paymentMethod === 'card' ? (cardNumber || '').slice(-4) : undefined,
        cardholderName: paymentMethod === 'card' ? cardholderName : undefined,
        cryptoNetwork: paymentMethod === 'crypto' ? cryptoNetwork : undefined,
        cryptoTxHash: paymentMethod === 'crypto' ? cryptoTxHash : undefined,
        proofImageUrl: paymentMethod === 'crypto' ? (cryptoProofImage || undefined) : (wireProofImage || undefined),
        referenceNumber: paymentMethod === 'wire' ? wireReference : undefined,
        submittedAt: new Date().toISOString(),
      };

      const newOrder = db.createOrder({
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        items: cart.map((i) => ({
          itemId: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal,
        tax: 0,
        shippingFee: shipping,
        total,
        status: paymentMethod === 'wallet' || paymentMethod === 'card' ? 'paid' : 'processing',
        shippingAddress,
        invoiceUrl: `/invoices/${orderNumber}.pdf`,
        paymentMethod,
        paymentProof: proof,
      });

      setCompletedOrder(newOrder);
      setProcessing(false);
      onClearCart();
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Caisse & Règlement Sécurisé</h1>
        <p className="text-xs text-slate-400 mt-1">
          Finalisez votre commande, transmettez vos informations de règlement et générez votre facture certifiée.
        </p>
      </div>

      {completedOrder ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Commande #{completedOrder.orderNumber} Validée !</h2>
            <p className="text-xs text-slate-400">
              {completedOrder.status === 'paid'
                ? 'Règlement enregistré avec succès. Votre facture comptable est prête.'
                : 'Preuve de paiement reçue ! En cours de vérification par notre service comptable.'}
            </p>
          </div>

          {completedOrder.paymentProof && (
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl max-w-md mx-auto text-left text-xs space-y-1.5">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Détails du Paiement</p>
              <div className="flex justify-between">
                <span className="text-slate-500">Canal:</span>
                <span className="font-bold text-white uppercase">{completedOrder.paymentProof.method}</span>
              </div>
              {completedOrder.paymentProof.cardLast4 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Carte:</span>
                  <span className="font-mono text-cyan-300">•••• •••• •••• {completedOrder.paymentProof.cardLast4}</span>
                </div>
              )}
              {completedOrder.paymentProof.cryptoNetwork && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Réseau Crypto:</span>
                  <span className="text-amber-300">{completedOrder.paymentProof.cryptoNetwork}</span>
                </div>
              )}
              {completedOrder.paymentProof.cryptoTxHash && (
                <div className="flex justify-between">
                  <span className="text-slate-500">TxID:</span>
                  <span className="font-mono text-[11px] text-slate-300 truncate max-w-[200px]">{completedOrder.paymentProof.cryptoTxHash}</span>
                </div>
              )}
              {completedOrder.paymentProof.referenceNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Référence:</span>
                  <span className="font-mono text-cyan-300">{completedOrder.paymentProof.referenceNumber}</span>
                </div>
              )}
              {completedOrder.paymentProof.proofImageUrl && (
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center space-x-2 text-emerald-400">
                  <FileCheck className="w-4 h-4" />
                  <span>Capture de paiement transmise et attachée au dossier</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Consulter / Télécharger la Facture</span>
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer shadow-md shadow-blue-600/30 transition-all"
            >
              <span>Accéder à mon Tableau de Bord</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Shipping & Payment Channels */}
          <div className="lg:col-span-2 space-y-6">
            {validationError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-3 text-rose-300 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* 1. Shipping Address */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <span>1. Adresse de Livraison / Entrepôt de Réception</span>
              </h3>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Adresse complète (ou Dépôt Fret Miami / Port-au-Prince / Santo Domingo)
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Ex: 8200 NW 27th St, Doral, FL 33122, USA"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 2. Select Payment Method */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Choisissez votre Mode de Règlement
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-yellow-400/15 border-yellow-400 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-xs font-bold text-white">Carte Bancaire</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Visa, MC, Amex</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'crypto'
                      ? 'bg-yellow-400/15 border-yellow-400 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Coins className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-xs font-bold text-white">Crypto USDT / BTC</p>
                  <p className="text-[10px] text-neutral-400 mt-1">TRC20, ERC20, BTC</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wire')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'wire'
                      ? 'bg-yellow-400/15 border-yellow-400 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-xs font-bold text-white">Virement / MonCash</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Natcash, MonCash, Wire</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'wallet'
                      ? 'bg-yellow-400/15 border-yellow-400 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-xs font-bold text-white">Portefeuille Interne</p>
                  <p className="text-[10px] text-yellow-400 mt-1 font-mono">
                    ${wallet.balance.toFixed(2)} USD
                  </p>
                </button>
              </div>

              {/* DETAILS FOR CARD */}
              {paymentMethod === 'card' && (
                <div className="mt-4 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Formulaire Carte Bancaire Sécurisée (SSL 256-bit)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Paiement certifié PCI-DSS</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nom du titulaire de la carte
                    </label>
                    <input
                      type="text"
                      required
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Ex: Jean-Marc Dupont"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Numéro de carte (16 chiffres)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      placeholder="4532 •••• •••• 8892"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono tracking-widest focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          setCardExpiry(val);
                        }}
                        placeholder="MM/AA"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Code CVC / CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS FOR CRYPTO */}
              {paymentMethod === 'crypto' && (
                <div className="mt-4 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>Passerelle de Règlement Crypto Direct</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-semibold uppercase">
                      Montant net: ${total.toFixed(2)} USD
                    </span>
                  </div>

                  {/* Network Switcher */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-2">
                      Sélectionnez la Cryptomonnaie / Réseau
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['USDT-TRC20', 'USDT-ERC20', 'BTC'] as const).map((net) => (
                        <button
                          key={net}
                          type="button"
                          onClick={() => setCryptoNetwork(net)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            cryptoNetwork === net
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {net}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address Box */}
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Adresse de dépôt officielle {cryptoWallets[cryptoNetwork].network}:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(cryptoWallets[cryptoNetwork].address)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{addressCopied ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-xs text-white bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-all select-all">
                      {cryptoWallets[cryptoNetwork].address}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Envoyez exactement <strong className="text-white">${total.toFixed(2)} USD</strong> en {cryptoNetwork}. Frais de réseau estimés: {cryptoWallets[cryptoNetwork].feeEstimate}.
                    </p>
                  </div>

                  {/* TxID & Proof Upload */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Hachage de la transaction (TxID)
                      </label>
                      <input
                        type="text"
                        value={cryptoTxHash}
                        onChange={(e) => setCryptoTxHash(e.target.value)}
                        placeholder="Ex: 5f1b8a92c4... (collez votre hash de transfert)"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Capture d'écran du paiement / Reçu de transfert
                      </label>
                      <div className="border border-dashed border-slate-700 rounded-xl p-4 bg-slate-900/50 text-center">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          id="crypto-proof-input"
                          className="hidden"
                          onChange={(e) => handleRealFileSelect(e, 'crypto')}
                        />
                        <label
                          htmlFor="crypto-proof-input"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold inline-flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choisir un fichier (PNG, JPG, PDF)</span>
                        </label>
                        <p className="text-[10px] text-slate-500 mt-2">ou</p>
                        <button
                          type="button"
                          onClick={() => handleSimulateProofUpload('crypto')}
                          className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer mt-1"
                        >
                          Attacher une capture d'exemple
                        </button>
                      </div>

                      {cryptoProofImage && (
                        <div className="mt-2.5 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                          <span className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Capture de paiement prête à l'envoi</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setCryptoProofImage(null)}
                            className="text-slate-400 hover:text-rose-400 text-xs cursor-pointer"
                          >
                            Retirer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS FOR WIRE / MONCASH */}
              {paymentMethod === 'wire' && (
                <div className="mt-4 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Coordonnées Virement & Portefeuille Mobile</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                      Montant net: ${total.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <p className="text-amber-400 font-bold flex items-center space-x-1.5">
                        <Smartphone className="w-4 h-4" />
                        <span>MonCash / Natcash (Haïti)</span>
                      </p>
                      <p className="text-slate-300 font-mono">+509 34 56 7890</p>
                      <p className="text-emerald-400 font-mono font-bold text-xs">
                        {Math.round(total * 132).toLocaleString()} HTG (1 USD = 132 HTG)
                      </p>
                      <p className="text-[10px] text-slate-400">Titulaire: XGROUP LLC Commercial</p>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <p className="text-blue-400 font-bold flex items-center space-x-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>Virement Bancaire US Wire</span>
                      </p>
                      <p className="text-slate-300 font-mono">Chase Bank - Routing: 021000021</p>
                      <p className="text-[10px] text-slate-400">Compte: 9482018471 (XGROUP LLC)</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Numéro de référence du transfert ou Transaction ID
                      </label>
                      <input
                        type="text"
                        value={wireReference}
                        onChange={(e) => setWireReference(e.target.value)}
                        placeholder="Ex: MC-89218392 ou Wire Ref #0921"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Preuve de versement (Reçu ou capture SMS MonCash)
                      </label>
                      <div className="border border-dashed border-slate-700 rounded-xl p-4 bg-slate-900/50 text-center">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          id="wire-proof-input"
                          className="hidden"
                          onChange={(e) => handleRealFileSelect(e, 'wire')}
                        />
                        <label
                          htmlFor="wire-proof-input"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold inline-flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Sélectionner la capture du reçu</span>
                        </label>
                        <p className="text-[10px] text-slate-500 mt-2">ou</p>
                        <button
                          type="button"
                          onClick={() => handleSimulateProofUpload('wire')}
                          className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer mt-1"
                        >
                          Attacher une capture d'exemple
                        </button>
                      </div>

                      {wireProofImage && (
                        <div className="mt-2.5 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                          <span className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Capture de reçu attachée</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setWireProofImage(null)}
                            className="text-slate-400 hover:text-rose-400 text-xs cursor-pointer"
                          >
                            Retirer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS FOR WALLET */}
              {paymentMethod === 'wallet' && (
                <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">Débit direct du compte prépayé</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Règlement instantané via grand-livre comptable sans frais intermédiaires.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono font-bold text-sm block">
                      ${wallet.balance.toFixed(2)} USD
                    </span>
                    <span className="text-[10px] text-slate-500">Solde disponible</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3">
              Récapitulatif de la Commande
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Articles ({cart.length})</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais d'expédition & logistique</span>
                <span className="font-mono text-white">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3 text-sm font-bold text-white">
                <span>Total à Régler</span>
                <div className="text-right">
                  <span className="text-emerald-400 text-base font-mono block">${total.toFixed(2)} USD</span>
                  <span className="text-xs text-amber-400 font-mono font-bold block">
                    ≈ {Math.round(total * 132).toLocaleString()} HTG (Gourdes)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || cart.length === 0}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-yellow-400/20 cursor-pointer transition-all"
            >
              <span>{processing ? 'Validation du règlement...' : `Confirmer et Régler $${total.toFixed(2)} USD`}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </form>
      )}

      {/* Dynamic Invoice Modal */}
      {completedOrder && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          customData={{
            orderNumber: completedOrder.orderNumber,
            date: new Date(completedOrder.createdAt).toLocaleDateString(),
            userName: completedOrder.userName,
            userEmail: completedOrder.userEmail,
            items: completedOrder.items.map((i) => ({
              title: i.title,
              price: i.price,
              quantity: i.quantity,
            })),
            total: completedOrder.total,
            type: 'marketplace',
            status: completedOrder.status === 'paid' ? 'cleared' : 'pending',
          }}
        />
      )}
    </div>
  );
};
