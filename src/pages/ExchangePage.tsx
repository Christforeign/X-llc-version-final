import React, { useState } from 'react';
import {
  Repeat,
  Shield,
  Lock,
  CheckCircle,
  MessageSquare,
  ArrowRightLeft,
  DollarSign,
  Plus,
  AlertCircle,
  CheckCheck,
  Smartphone,
  Send,
  HelpCircle,
  Wallet,
  Upload,
  Copy,
  Check,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { walletService } from '../services/walletService';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface ExchangePageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

interface DigitalExchangeQuote {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  rate: number;
  fee: number;
}

export const ExchangePage: React.FC<ExchangePageProps> = ({ onOpenAuth, onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const wallet = currentUser ? db.getWallet(currentUser.id) : null;
  const [activeTab, setActiveTab] = useState<'digital' | 'physical'>('digital');
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Digital Exchanger State (Style jbjproductionhaiti.com)
  const [fromMethod, setFromMethod] = useState<'paypal' | 'zelle' | 'cashapp' | 'usdt' | 'moncash' | 'natcash'>('paypal');
  const [toMethod, setToMethod] = useState<'moncash' | 'natcash' | 'paypal' | 'zelle' | 'usdt'>('moncash');
  const [sendAmount, setSendAmount] = useState<number>(50);
  const [recipientAccount, setRecipientAccount] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [digitalSuccess, setDigitalSuccess] = useState<any | null>(null);

  // Reserves
  const reserves = {
    moncash: '685,400 HTG',
    natcash: '410,200 HTG',
    paypal: '$4,350.00 USD',
    zelle: '$5,800.00 USD',
    usdt: '18,400.00 USDT',
  };

  // Rates calculation
  const getExchangeQuote = (): DigitalExchangeQuote => {
    let rate = 120; // Default PayPal -> MonCash rate (1 USD = 120 HTG)
    let isFromUSD = ['paypal', 'zelle', 'cashapp', 'usdt'].includes(fromMethod);
    let isToUSD = ['paypal', 'zelle', 'usdt'].includes(toMethod);

    if (fromMethod === 'paypal' && (toMethod === 'moncash' || toMethod === 'natcash')) {
      rate = 122; // 1 USD PayPal = 122 HTG MonCash
    } else if ((fromMethod === 'zelle' || fromMethod === 'cashapp') && (toMethod === 'moncash' || toMethod === 'natcash')) {
      rate = 130; // 1 USD Zelle = 130 HTG MonCash
    } else if (fromMethod === 'usdt' && (toMethod === 'moncash' || toMethod === 'natcash')) {
      rate = 132; // 1 USDT = 132 HTG MonCash
    } else if ((fromMethod === 'moncash' || fromMethod === 'natcash') && toMethod === 'paypal') {
      rate = 1 / 144; // 144 HTG = 1 USD PayPal
    } else if ((fromMethod === 'moncash' || fromMethod === 'natcash') && toMethod === 'usdt') {
      rate = 1 / 138; // 138 HTG = 1 USDT
    } else if (isFromUSD && isToUSD) {
      rate = 0.95; // USD to USD cross-currency (e.g. PayPal to Zelle fee 5%)
    }

    const receiveAmount = isFromUSD && (toMethod === 'moncash' || toMethod === 'natcash')
      ? sendAmount * rate
      : sendAmount * rate;

    return {
      fromCurrency: fromMethod.toUpperCase(),
      toCurrency: toMethod.toUpperCase(),
      sendAmount,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      rate,
      fee: sendAmount * 0.03,
    };
  };

  const quote = getExchangeQuote();

  const handleDigitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!recipientAccount.trim() || !senderAccount.trim()) {
      alert('Veuillez renseigner les coordonnées de compte d\'envoi et de réception.');
      return;
    }

    setDigitalSuccess({
      orderId: `EXCH-${Math.floor(100000 + Math.random() * 900000)}`,
      from: fromMethod.toUpperCase(),
      to: toMethod.toUpperCase(),
      send: sendAmount,
      receive: quote.receiveAmount,
      recipientAccount,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'Validation Manuelle & Virement sous 15-30 min',
    });
  };

  // Physical Trade Listings ("J'ai un iPhone 12 et veux un 13 ou que me donnez-vous ?")
  const [physicalListings, setPhysicalListings] = useState([
    {
      id: 'TRC-1',
      title: 'iPhone 12 Pro Max 128Go (Bleu Pacifique)',
      haveDesc: 'Batterie 87%, écran d\'origine impeccable, FaceID fonctionnel, boîte incluse.',
      wantDesc: 'Je cherche un iPhone 13 Pro ou 14 (+ j\'ajoute $100 cash si nécessaire)',
      owner: 'Jean-Marc T. (Delmas 75)',
      cashAdjustment: '+$100 USD possible',
      date: 'Aujourd\'hui',
      category: 'Smartphones',
    },
    {
      id: 'TRC-2',
      title: 'PlayStation 4 Pro 1To + 2 Manettes sans fil',
      haveDesc: 'Parfait état de marche avec FIFA 24, Call of Duty et câbles HDMI/Alimentation.',
      wantDesc: 'Vous me donnez quoi pour ça ? Ouvert à échange contre PC Portable, iPad ou iPhone.',
      owner: 'Stevenson K. (Pétion-Ville)',
      cashAdjustment: 'Offre ouverte',
      date: 'Hier',
      category: 'Gaming / Consoles',
    },
    {
      id: 'TRC-3',
      title: 'Samsung Galaxy S22 Ultra 256Go Phantom Black',
      haveDesc: 'Avec S-Pen d\'origine, coque Spigen blindée, chargeur 45W rapide.',
      wantDesc: 'Échange uniquement contre iPhone 13 Pro Max ou MacBook Air.',
      owner: 'Daphnée L. (Tabarre)',
      cashAdjustment: 'Échange sec (0 soulte)',
      date: 'Il y a 2 jours',
      category: 'Smartphones',
    },
  ]);

  // Create Physical Trade Modal State
  const [showTrocModal, setShowTrocModal] = useState(false);
  const [trocHaveTitle, setTrocHaveTitle] = useState('');
  const [trocHaveDetails, setTrocHaveDetails] = useState('');
  const [trocWantDetails, setTrocWantDetails] = useState('');
  const [trocCashAdjustment, setTrocCashAdjustment] = useState('');
  const [trocLocation, setTrocLocation] = useState('');

  const handleCreateTroc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!trocHaveTitle.trim() || !trocWantDetails.trim()) {
      alert('Veuillez remplir les informations de votre objet.');
      return;
    }

    setPhysicalListings((prev) => [
      {
        id: `TRC-${Date.now().toString().slice(-4)}`,
        title: trocHaveTitle,
        haveDesc: trocHaveDetails || 'Objet en excellent état.',
        wantDesc: trocWantDetails,
        owner: `${currentUser.name} (${trocLocation || 'Haïti'})`,
        cashAdjustment: trocCashAdjustment || 'Faire offre',
        date: 'À l\'instant',
        category: 'Échange Utilisateur',
      },
      ...prev,
    ]);

    setShowTrocModal(false);
    setTrocHaveTitle('');
    setTrocHaveDetails('');
    setTrocWantDetails('');
    setTrocCashAdjustment('');
    alert('Votre annonce de troc est en ligne !');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Échange Numérique & Troc Matériel
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Module Échange <span className="text-emerald-400">& X-Troc Haïti</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Convertissez vos devises numériques (PayPal to MonCash, Zelle, USDT) et échangez vos téléphones ou matériels entre particuliers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && wallet && (
              <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="text-neutral-400">Solde :</span>
                <span className="text-white font-mono font-bold">${wallet.balance.toFixed(2)}</span>
              </div>
            )}
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-emerald-500 text-emerald-400 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Autre échange ? Dites-le nous !</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('digital')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'digital'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Échange Numérique Devises (PayPal, MonCash, Zelle...)</span>
          </button>

          <button
            onClick={() => setActiveTab('physical')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'physical'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>X-Troc Physique (J'ai un iPhone 12 et veux un 13...)</span>
          </button>
        </div>

        {/* TAB 1: DIGITAL CURRENCY EXCHANGER (JBJ PRODUCTION STYLE) */}
        {activeTab === 'digital' && (
          <div className="space-y-6">
            {/* Reserves Banner */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Réserves Disponibles en Direct chez X GROUP :</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 block text-[10px]">MonCash :</span>
                  <span className="text-emerald-400 font-bold">{reserves.moncash}</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 block text-[10px]">Natcash :</span>
                  <span className="text-emerald-400 font-bold">{reserves.natcash}</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 block text-[10px]">PayPal :</span>
                  <span className="text-blue-400 font-bold">{reserves.paypal}</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 block text-[10px]">Zelle :</span>
                  <span className="text-purple-400 font-bold">{reserves.zelle}</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 block text-[10px]">USDT TRC20 :</span>
                  <span className="text-teal-400 font-bold">{reserves.usdt}</span>
                </div>
              </div>
            </div>

            {digitalSuccess ? (
              <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Ordre d'Échange Enregistré !</h2>
                  <p className="text-xs text-neutral-400">
                    Notre équipe vérifie le virement et effectue votre paiement dans les minutes suivantes.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-neutral-950 border border-neutral-850 rounded-2xl p-5 text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-500">Numéro Ordre :</span>
                    <span className="text-emerald-400 font-bold">{digitalSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Vous envoyez :</span>
                    <span className="text-white font-bold">{digitalSuccess.send} {digitalSuccess.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Vous recevez :</span>
                    <span className="text-emerald-400 font-bold">{digitalSuccess.receive} {digitalSuccess.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Compte Réception :</span>
                    <span className="text-white">{digitalSuccess.recipientAccount}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-850 pt-2 text-neutral-400 text-[11px]">
                    <span>Délai d'exécution :</span>
                    <span className="text-amber-400 font-bold">15 - 30 minutes</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDigitalSuccess(null);
                    setRecipientAccount('');
                    setSenderAccount('');
                  }}
                  className="py-2.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Effectuer un autre échange
                </button>
              </div>
            ) : (
              <form onSubmit={handleDigitalSubmit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                {/* Send and Receive Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* YOU SEND */}
                  <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="text-xs font-bold text-neutral-300">Vous Envoyez :</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Devise source</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'paypal', label: 'PayPal (USD)' },
                        { id: 'zelle', label: 'Zelle (USD)' },
                        { id: 'cashapp', label: 'Cash App (USD)' },
                        { id: 'usdt', label: 'USDT (TRC20)' },
                        { id: 'moncash', label: 'MonCash (HTG)' },
                        { id: 'natcash', label: 'Natcash (HTG)' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFromMethod(item.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            fromMethod === item.id
                              ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Montant à envoyer :</label>
                      <input
                        type="number"
                        min="5"
                        required
                        value={sendAmount}
                        onChange={(e) => setSendAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm font-mono text-white font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* YOU RECEIVE */}
                  <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="text-xs font-bold text-neutral-300">Vous Recevez :</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Devise cible</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'moncash', label: 'MonCash (HTG)' },
                        { id: 'natcash', label: 'Natcash (HTG)' },
                        { id: 'paypal', label: 'PayPal (USD)' },
                        { id: 'zelle', label: 'Zelle (USD)' },
                        { id: 'usdt', label: 'USDT (TRC20)' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setToMethod(item.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            toMethod === item.id
                              ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300">Montant calculé à recevoir :</label>
                      <div className="w-full px-3.5 py-2.5 bg-neutral-900/80 border border-neutral-700 rounded-xl text-lg font-mono text-emerald-400 font-black flex items-center justify-between">
                        <span>{quote.receiveAmount.toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 font-sans">{quote.toCurrency}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        Taux appliqué : 1 {quote.fromCurrency} ≈ {quote.rate.toFixed(2)} {quote.toCurrency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sender & Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">
                      Votre Compte / Email / Numéro d'Envoi ({fromMethod.toUpperCase()}) <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: votre-email@paypal.com ou +509 3844-0000"
                      value={senderAccount}
                      onChange={(e) => setSenderAccount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">
                      Compte / Numéro / Adresse où RECEVOIR les fonds ({toMethod.toUpperCase()}) <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Numéro MonCash (+509...), Email Zelle ou Adresse TRC20"
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload proof */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Preuve du transfert (Reçu ou Capture d'écran du paiement effectué)</span>
                  </label>
                  <label className="block border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950 p-3 rounded-xl text-center cursor-pointer transition-colors">
                    <span className="text-xs text-neutral-400">
                      {proofFileName ? `✓ Preuve sélectionnée : ${proofFileName}` : 'Cliquez pour joindre votre capture de confirmation'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setProofFileName(f.name);
                      }}
                    />
                  </label>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
                  <div className="text-xs text-neutral-400">
                    Délai moyen de réception : <strong className="text-white">15 à 30 minutes</strong> après confirmation.
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-8 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                  >
                    Valider & Lancer l'Échange
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: PHYSICAL TRADE (X-TROC : IPHONE 12 -> IPHONE 13...) */}
        {activeTab === 'physical' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
              <div>
                <h2 className="text-lg font-bold text-white">Plateforme de Troc & Échange Matériel</h2>
                <p className="text-xs text-neutral-400">
                  Postez votre téléphone, console ou objet physique et indiquez ce que vous souhaitez en échange (ou demandez « Vous me donnez quoi pour ça ? »).
                </p>
              </div>

              <button
                onClick={() => setShowTrocModal(true)}
                className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs cursor-pointer shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Poster une Offre de Troc</span>
              </button>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {physicalListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md font-mono">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-neutral-500">{item.date}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{item.title}</h3>

                    <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs space-y-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold block">Ce que le client a :</span>
                        <p className="text-neutral-300 text-xs">{item.haveDesc}</p>
                      </div>

                      <div className="pt-2 border-t border-neutral-850">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">Ce qu'il veut en échange :</span>
                        <p className="text-white text-xs font-semibold">{item.wantDesc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-850 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 text-[11px]">{item.owner}</span>
                      <span className="text-amber-400 font-mono font-bold text-[11px]">{item.cashAdjustment}</span>
                    </div>

                    <button
                      onClick={() => alert(`Offre de troc sélectionnée pour "${item.title}". Contactez le support X GROUP pour sécuriser l'échange sous séquestre Escrow.`)}
                      className="w-full py-2 bg-neutral-800 hover:bg-emerald-600 hover:text-white text-neutral-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Proposer mon Objet en Échange
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREATE TROC MODAL */}
        {showTrocModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-white">Poster une Annonce de Troc Matériel</h3>
                <button
                  onClick={() => setShowTrocModal(false)}
                  className="text-neutral-400 hover:text-white cursor-pointer font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTroc} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300">Ce que vous avez (Titre de l'objet) <span className="text-emerald-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: iPhone 12 Pro 128Go Bleu Pacifique"
                    value={trocHaveTitle}
                    onChange={(e) => setTrocHaveTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300">Détails et état de votre objet</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Batterie 86%, écran propre, FaceID ok, aucune rayure..."
                    value={trocHaveDetails}
                    onChange={(e) => setTrocHaveDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300">Ce que vous voulez en échange <span className="text-emerald-400">*</span></label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ex: Je veux un iPhone 13 Pro (j'ajoute $80) OU 'Vous me donnez quoi pour ça ?'"
                    value={trocWantDetails}
                    onChange={(e) => setTrocWantDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300">Soulte d'argent (si applicable)</label>
                    <input
                      type="text"
                      placeholder="Ex: +$80 USD si modèle supérieur"
                      value={trocCashAdjustment}
                      onChange={(e) => setTrocCashAdjustment(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300">Ville / Commune</label>
                    <input
                      type="text"
                      placeholder="Ex: Pétion-Ville, Delmas..."
                      value={trocLocation}
                      onChange={(e) => setTrocLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTrocModal(false)}
                    className="py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl cursor-pointer shadow-md"
                  >
                    Publier l'Annonce de Troc
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REQUEST MODAL */}
        <CustomServiceRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          defaultCategory="exchange"
        />
      </div>
    </div>
  );
};
