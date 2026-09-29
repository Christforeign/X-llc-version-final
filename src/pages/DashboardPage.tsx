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
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { walletService } from '../services/walletService';
import { User, Wallet as WalletType, LedgerEntry, Order, GsmOrder, Shipment, Certificate } from '../models/types';
import { InvoiceModal } from '../components/InvoiceModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { CertificateGenerator } from '../components/CertificateGenerator';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';
import { Upload, Copy, Check, CheckCircle2, HelpCircle } from 'lucide-react';

interface DashboardPageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenAuth, onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'wallet' | 'orders' | 'gsm' | 'shipments' | 'certs'>('wallet');
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
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

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
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Wallet className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Client Portal Authentication Required</h2>
          <p className="text-xs text-slate-400">
            Access your double-entry treasury wallet, order history, and active shipments.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
          >
            Authenticate Profile
          </button>
        </div>
      </div>
    );
  }

  const userOrders = db.getOrders().filter((o) => o.userId === currentUser.id);
  const userGsmOrders = db.getGsmOrders().filter((g) => g.userId === currentUser.id);
  const userShipments = db.getShipments().filter((s) => s.userId === currentUser.id);
  const userCerts = db.getCertificates().filter((c) => c.userId === currentUser.id);
  const userLedger = wallet.ledger;

  const handleManualDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    if (!transactionRef.trim() || !senderIdentifier.trim()) {
      alert('Veuillez renseigner votre nom/téléphone et la référence de la transaction.');
      return;
    }

    // Direct deposit into wallet ledger with proof record
    walletService.deposit(
      currentUser.id,
      currentUser.email,
      depositAmount,
      `Recharge ${manualMethod.toUpperCase()} (Réf: ${transactionRef.trim()} - De: ${senderIdentifier.trim()}${proofFileName ? ` - Preuve: ${proofFileName}` : ''})`
    );
    setWallet(db.getWallet(currentUser.id));
    setDepositSuccessMsg(
      `Rechargement de $${depositAmount} USD (${(depositAmount * 132).toLocaleString()} HTG) via ${manualMethod.toUpperCase()} soumis avec succès et crédité sur votre compte.`
    );
    setTransactionRef('');
    setSenderIdentifier('');
    setProofFileName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      {/* User Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  currentUser.role === 'admin'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : currentUser.role === 'staff'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        {/* Balance Badges */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Available Balance
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ${wallet?.balance.toFixed(2)} USD
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block flex items-center space-x-1">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Escrow Vault</span>
            </span>
            <span className="text-lg font-black text-cyan-400 font-mono">
              ${wallet?.escrowBalance.toFixed(2)} USD
            </span>
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-500 text-amber-400 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Autre chose ? Dites-le nous !</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
        {[
          { key: 'wallet', label: 'Treasury & Ledger', icon: <Wallet className="w-4 h-4" /> },
          { key: 'orders', label: `Wholesale Orders (${userOrders.length})`, icon: <Package className="w-4 h-4" /> },
          { key: 'gsm', label: `GSM Bench Intakes (${userGsmOrders.length})`, icon: <Smartphone className="w-4 h-4" /> },
          { key: 'shipments', label: `Shipments (${userShipments.length})`, icon: <Package className="w-4 h-4" /> },
          { key: 'certs', label: `Academy Diplomas (${userCerts.length})`, icon: <Award className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Treasury & Ledger */}
      {activeTab === 'wallet' && (
        <div className="space-y-8">
          {/* Success Notification */}
          {depositSuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{depositSuccessMsg}</span>
              </div>
              <button
                onClick={() => setDepositSuccessMsg(null)}
                className="text-neutral-400 hover:text-white text-xs font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Manual Deposit Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Recharger mon Portefeuille Interne</h3>
                  <p className="text-xs text-slate-400">
                    Paiement manuel direct via MonCash, Natcash, Zelle, Cash App ou Crypto USDT.
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                Taux fixe : 1 USD = 132 HTG
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Choisissez votre méthode de dépôt :</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'moncash', label: 'MonCash', badge: 'Haïti' },
                  { id: 'natcash', label: 'Natcash', badge: 'Haïti' },
                  { id: 'zelle', label: 'Zelle', badge: 'USA' },
                  { id: 'cashapp', label: 'Cash App', badge: 'USA' },
                  { id: 'usdt', label: 'USDT TRC20', badge: 'Crypto' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setManualMethod(m.id as any);
                      setCopiedAccount(false);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      manualMethod === m.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] text-slate-500">{m.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions details */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Coordonnées de paiement :</span>
                <button
                  type="button"
                  onClick={() => {
                    const coord =
                      manualMethod === 'moncash'
                        ? '+509 3844-0000'
                        : manualMethod === 'natcash'
                        ? '+509 4200-0000'
                        : manualMethod === 'zelle'
                        ? 'pay@xgroup-llc.com'
                        : manualMethod === 'cashapp'
                        ? '$XGroupDigital'
                        : 'TXgRoupLLcDigitalTreasuryWallet77xQ';
                    navigator.clipboard.writeText(coord);
                    setCopiedAccount(true);
                    setTimeout(() => setCopiedAccount(false), 2000);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAccount ? 'Copié !' : 'Copier le numéro/adresse'}</span>
                </button>
              </div>

              <div className="font-mono text-sm text-emerald-400 font-bold bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>
                  {manualMethod === 'moncash' && 'Numéro MonCash : +509 3844-0000 (X GROUP LLC)'}
                  {manualMethod === 'natcash' && 'Numéro Natcash : +509 4200-0000 (X GROUP LLC)'}
                  {manualMethod === 'zelle' && 'Email Zelle : pay@xgroup-llc.com (X GROUP LLC)'}
                  {manualMethod === 'cashapp' && 'Cashtag Cash App : $XGroupDigital'}
                  {manualMethod === 'usdt' && 'Adresse TRC-20 : TXgRoupLLcDigitalTreasuryWallet77xQ'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Transférez le montant souhaité, puis remplissez le formulaire ci-dessous avec votre preuve.
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleManualDeposit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Montant en USD ($)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      required
                      min="5"
                      step="1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    ≈ {(depositAmount * 132).toLocaleString()} Gourdes (HTG)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Votre Numéro / Nom envoyeur</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: +509 3712-3456 ou Nom Zelle"
                    value={senderIdentifier}
                    onChange={(e) => setSenderIdentifier(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Référence / ID de transaction</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TX-9842109"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Proof Screenshot */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Capture d'écran / Reçu de preuve de transfert</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/70 p-3 rounded-xl text-center cursor-pointer transition-colors">
                    <span className="text-xs text-slate-400">
                      {proofFileName ? `✓ Fichier joint : ${proofFileName}` : 'Cliquez pour sélectionner la capture de votre virement'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProofFileName(file.name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-slate-400 max-w-lg">
                  💡 Les fonds déposés sont utilisables immédiatement sur l'ensemble des modules X GROUP (Top-Up Jeux, GSM, Fret, KlikeDeliv, Échanges).
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
                >
                  Envoyer ma Preuve & Valider le Dépôt
                </button>
              </div>
            </form>
          </div>

          {/* Ledger History */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Double-Entry Ledger Audit Trail
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {userLedger.length} immutable records
              </span>
            </div>

            {userLedger.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No transaction history recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="py-2">Reference</th>
                      <th className="py-2">Date & Time</th>
                      <th className="py-2">Module</th>
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {userLedger.map((tx, idx) => {
                      const isCredit = tx.toUserId === currentUser.id;
                      const txKey = tx.id || (tx as any).txId || `tx-${idx}`;
                      return (
                        <tr key={txKey} className="hover:bg-slate-800/30">
                          <td className="py-2.5 text-slate-400">{(txKey).slice(0, 14)}...</td>
                          <td className="py-2.5 text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
                          <td className="py-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] uppercase font-bold text-cyan-300">
                              {tx.module}
                            </span>
                          </td>
                          <td className="py-2.5 text-white">{tx.description}</td>
                          <td
                            className={`py-2.5 text-right font-bold ${
                              isCredit ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isCredit ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              No orders placed yet. Visit the private marketplace to place a wholesale order.
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-400">{ord.orderNumber}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {ord.items.length} items &bull; Total: <strong className="text-white">${ord.total.toFixed(2)} USD</strong>
                    </p>
                    <p className="text-[10px] text-slate-400">Destination: {ord.shippingAddress}</p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedInvoice({
                        orderNumber: ord.orderNumber,
                        date: new Date(ord.createdAt).toLocaleDateString(),
                        userName: ord.userName,
                        userEmail: ord.userEmail,
                        items: ord.items,
                        total: ord.total,
                        type: 'marketplace',
                        status: ord.status,
                      })
                    }
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Download Invoice</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: GSM Orders */}
      {activeTab === 'gsm' && (
        <div className="space-y-4">
          {userGsmOrders.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              No GSM service tickets active. Submit device diagnostics on the GSM page.
            </div>
          ) : (
            <div className="space-y-3">
              {userGsmOrders.map((g) => (
                <div
                  key={g.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{g.orderNumber}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {g.type} &bull; {g.status}
                      </span>
                    </div>
                    <p className="text-xs text-white font-bold">
                      {g.brand} {g.model} <span className="font-mono text-slate-400 font-normal">(IMEI: {g.imeiOrSerial})</span>
                    </p>
                    <p className="text-[11px] text-slate-400">{g.details}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveChatRoomId(g.chatRoomId)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Technician Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Shipments */}
      {activeTab === 'shipments' && (
        <div className="space-y-4">
          {userShipments.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              No consignments dispatched yet. Register cargo parcels on the Freight Shipping page.
            </div>
          ) : (
            <div className="space-y-3">
              {userShipments.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-400">{s.trackingNumber}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold">
                      {s.originCountry} &rarr; {s.destinationCountry} ({s.weight} kg)
                    </p>
                    <p className="text-[11px] text-slate-400">Recipient: {s.recipientName} ({s.recipientAddress})</p>
                  </div>

                  <button
                    onClick={() => onNavigate('/shipping')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
                  >
                    <span>View on Satellite Map</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Certificates */}
      {activeTab === 'certs' && (
        <div className="space-y-6">
          {userCerts.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              No certificates earned yet. Complete an interactive course curriculum on the Academy page to receive an official verifiable diploma.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-amber-400">{cert.certificateNumber}</span>
                      <span className="text-xs font-bold text-emerald-400">{cert.grade}% Passing Grade</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{cert.courseTitle}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Render Official Diploma</span>
                    </button>
                  </div>
                ))}
              </div>

              {selectedCertificate && (
                <div className="pt-4">
                  <CertificateGenerator certificate={selectedCertificate} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          customData={selectedInvoice}
        />
      )}

      {/* Active Chat Drawer */}
      {activeChatRoomId && (
        <div className="fixed bottom-6 right-6 w-96 z-50 animate-in slide-in-from-bottom-5">
          <ChatDrawer
            chatRoomId={activeChatRoomId}
            title="Assigned Tech Support Line"
            category="gsm"
            onClose={() => setActiveChatRoomId(null)}
          />
        </div>
      )}

      {/* Custom Service Request Modal */}
      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="other"
      />
    </div>
  );
};
