import React, { useState } from 'react';
import {
  Palette,
  Upload,
  CheckCircle,
  ArrowRight,
  FileText,
  Sparkles,
  MessageSquare,
  Video,
  Globe,
  ShoppingBag,
  HelpCircle,
  Check,
  Clock,
  Link as LinkIcon,
  DollarSign,
  ShieldCheck,
  Send,
  Wallet
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { InvoiceModal } from '../components/InvoiceModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface RequestDesignPageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

export const RequestDesignPage: React.FC<RequestDesignPageProps> = ({ onOpenAuth, onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const wallet = currentUser ? db.getWallet(currentUser.id) : null;
  const [activeTab, setActiveTab] = useState<'catalog' | 'shein' | 'custom'>('catalog');
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Shein Cart Form State
  const [sheinCartUrl, setSheinCartUrl] = useState('');
  const [sheinCartTotalUsd, setSheinCartTotalUsd] = useState<number>(65);
  const [sheinInstructions, setSheinInstructions] = useState('');
  const [sheinProofFile, setSheinProofFile] = useState('');
  const [sheinOrderSuccess, setSheinOrderSuccess] = useState<any | null>(null);

  // Custom Service Form State
  const [serviceType, setServiceType] = useState('logo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(150);
  const [deadline, setDeadline] = useState('48 heures');
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);

  // Pre-configured services in catalog
  const catalogServices = [
    {
      id: 'srv-logo',
      title: 'Création de Logo Professionnel & Charte Graphique',
      category: 'Design Graphique',
      icon: Palette,
      price: 65,
      deliveryTime: '24 - 48h',
      features: [
        '3 propositions de concepts originaux',
        'Fichiers vectoriels AI, SVG, PNG transparent & PDF',
        'Versions fond blanc, fond noir et monochrome',
        'Format optimisé pour profil WhatsApp & réseaux sociaux',
        'Révisions illimitées jusqu\'à satisfaction',
      ],
      badge: 'Populaire',
    },
    {
      id: 'srv-video',
      title: 'Création & Montage Vidéo Publicitaire (Reels/TikTok/Promo)',
      category: 'Production Vidéo',
      icon: Video,
      price: 85,
      deliveryTime: '48h',
      features: [
        'Montage dynamique avec sous-titres animés captivants',
        'Musique libre de droits & effets sonores premium',
        'Voix-off IA ou enregistrement studio professionnel',
        'Formats 9:16 (TikTok/Reels) et 16:9 (YouTube/TV)',
        'Incrustation de votre logo et appel à l\'action (CTA)',
      ],
      badge: 'Haute Conversion',
    },
    {
      id: 'srv-website',
      title: 'Création de Site Web Vitrine ou E-Commerce Clé en Main',
      category: 'Développement Web',
      icon: Globe,
      price: 240,
      deliveryTime: '4 - 7 jours',
      features: [
        'Design 100% responsive (Mobile, Tablette, PC)',
        'Système de commande en ligne & gestion de catalogue',
        'Formulaires WhatsApp & intégration MonCash/Natcash',
        'Nom de domaine offert pendant 1 an (.com ou .ht)',
        'Hébergement sécurisé SSL haute vitesse inclus',
      ],
      badge: 'Recommandé Entreprise',
    },
    {
      id: 'srv-shein',
      title: 'Achat & Acheminement Panier Shein / Amazon / AliExpress',
      category: 'Importation Cargo',
      icon: ShoppingBag,
      price: 15,
      deliveryTime: '7 - 10 jours',
      features: [
        'Nous payons avec notre carte bancaire internationale sans frais cachés',
        'Réception à notre entrepôt de transit à Miami (Floride)',
        'Acheminement maritime ou aérien express vers Haïti',
        'Dédouanement complet pris en charge par X GROUP Cargo',
        'Retrait à Port-au-Prince, Pétion-Ville, Delmas ou province',
      ],
      badge: 'Service Spécial',
    },
  ];

  // SUBMIT SHEIN CART
  const handleSheinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!sheinCartUrl.trim() && !sheinProofFile) {
      alert('Veuillez fournir le lien de votre panier Shein ou joindre une capture d\'écran.');
      return;
    }

    const orderId = `SHEIN-${Math.floor(100000 + Math.random() * 900000)}`;
    const fee = sheinCartTotalUsd * 0.10; // 10% commission d'achat
    const totalOrder = sheinCartTotalUsd + fee;

    setSheinOrderSuccess({
      orderId,
      cartUrl: sheinCartUrl,
      itemsTotal: sheinCartTotalUsd,
      serviceFee: fee,
      total: totalOrder,
      date: new Date().toLocaleDateString('fr-FR'),
      instructions: sheinInstructions,
    });
  };

  // SUBMIT CUSTOM SERVICE
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert('Veuillez renseigner le titre et la description détaillée de votre demande.');
      return;
    }

    const orderNumber = `SRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const chatRoomId = `chat-srv-${orderNumber}`;

    db.addChatMessage(chatRoomId, {
      senderId: 'usr-staff-01',
      senderEmail: 'services@xgroup.com',
      senderName: 'Chef de Projet X GROUP',
      senderRole: 'staff',
      message: `Bonjour ${currentUser.name} ! Votre demande de service "${title}" a été transmise à notre équipe. Un devis définitif et le planning de réalisation vont vous être envoyés.`,
    });

    setSubmittedOrder({
      orderNumber,
      title,
      serviceType,
      budget,
      deadline,
      chatRoomId,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Créatif & Importations Internationales</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Demandes de Services <span className="text-blue-400">& Paniers Shein</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Commandez votre logo, vidéo publicitaire, site web ou faites payer et acheminer votre panier Shein / Amazon en Haïti.
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
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-blue-500 text-blue-400 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Autre chose ? Dites-le nous !</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Services Proposés (Logo, Vidéo, Site Web)</span>
          </button>

          <button
            onClick={() => setActiveTab('shein')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'shein'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Envoyer Panier Shein / Importation</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'custom'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Demande de Service Sur-Mesure</span>
          </button>
        </div>

        {/* TAB 1: SERVICES CATALOG */}
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catalogServices.map((srv) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-neutral-900/80 border border-neutral-800 hover:border-blue-500/50 rounded-3xl p-6 sm:p-8 space-y-5 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-800 text-blue-400 border border-neutral-700">
                        {srv.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-neutral-500 uppercase font-bold">{srv.category}</span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{srv.title}</h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-850">
                      {srv.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-850 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-white font-mono">${srv.price}.00 USD</span>
                        <span className="text-[10px] text-neutral-500 block">~{(srv.price * 132).toLocaleString()} HTG</span>
                      </div>
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        Délai : {srv.deliveryTime}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (srv.id === 'srv-shein') {
                          setActiveTab('shein');
                        } else {
                          setTitle(srv.title);
                          setBudget(srv.price);
                          setServiceType(srv.id.replace('srv-', ''));
                          setActiveTab('custom');
                        }
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <span>Commander cette prestation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SHEIN CART SUBMISSION */}
        {activeTab === 'shein' && (
          <div className="space-y-6">
            {sheinOrderSuccess ? (
              <div className="bg-neutral-900 border-2 border-blue-500/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Dossier Panier Shein Enregistré !</h2>
                  <p className="text-xs text-neutral-400">
                    Numéro de dossier : <strong className="text-blue-400">{sheinOrderSuccess.orderId}</strong>. Notre équipe va inspecter votre panier et vous transmettre la facture d'achat.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-neutral-950 border border-neutral-850 rounded-2xl p-5 text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-500">Total Articles Shein :</span>
                    <span className="text-white font-bold">${sheinOrderSuccess.itemsTotal.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Commission Achat & Suivi (10%) :</span>
                    <span className="text-amber-400 font-bold">${sheinOrderSuccess.serviceFee.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-850 pt-2 text-sm">
                    <span className="text-neutral-300">Total à Régler :</span>
                    <span className="text-emerald-400 font-black">${sheinOrderSuccess.total.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSheinOrderSuccess(null);
                    setSheinCartUrl('');
                    setSheinInstructions('');
                  }}
                  className="py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Soumettre un autre panier
                </button>
              </div>
            ) : (
              <form onSubmit={handleSheinSubmit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-neutral-800 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase mb-2">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Shein, Zara, Amazon & AliExpress
                  </div>
                  <h2 className="text-xl font-bold text-white">Faites payer et livrer votre panier en Haïti</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Pas de carte bancaire internationale ? Aucun problème ! Collez le lien de votre panier Shein ou téléversez une capture. Nous achetons pour vous et livrons à votre porte.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Lien de partage du Panier Shein ou Liens des articles <span className="text-blue-400">*</span></span>
                    </label>
                    <input
                      type="url"
                      placeholder="Ex: https://shein.top/xxx ou lien d'un article"
                      value={sheinCartUrl}
                      onChange={(e) => setSheinCartUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:border-blue-500 focus:outline-none font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-300 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Montant total estimé du Panier ($ USD) <span className="text-blue-400">*</span></span>
                      </label>
                      <input
                        type="number"
                        min="10"
                        required
                        value={sheinCartTotalUsd}
                        onChange={(e) => setSheinCartTotalUsd(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-neutral-500 block">
                        Équivalent : ~{(sheinCartTotalUsd * 132).toLocaleString()} HTG (Commission service 10% incluse au devis)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-300 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-blue-400" />
                        <span>Capture d'écran du panier (Optionnel si lien fourni)</span>
                      </label>
                      <label className="block border border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950 p-2.5 rounded-xl text-center cursor-pointer">
                        <span className="text-[11px] text-neutral-400">
                          {sheinProofFile ? `✓ ${sheinProofFile}` : 'Joindre capture d\'écran du panier'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setSheinProofFile(f.name);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300">Tailles, couleurs et instructions particulières :</label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Robe en taille M couleur rouge, chaussures en pointure 39..."
                      value={sheinInstructions}
                      onChange={(e) => setSheinInstructions(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
                  <div className="text-xs text-neutral-400">
                    Paiement accepté par <strong>MonCash, Natcash, Portefeuille X GROUP ou Zelle</strong>.
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
                  >
                    Envoyer mon Panier Shein
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM SERVICE FORM */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            {submittedOrder ? (
              <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Demande de Service #{submittedOrder.orderNumber} Enregistrée !</h2>
                  <p className="text-xs text-neutral-400">
                    Votre brief pour "{submittedOrder.title}" a été assigné à un expert. Vous pouvez dialoguer en direct avec l'équipe.
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setActiveChatRoomId(submittedOrder.chatRoomId)}
                    className="py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ouvrir le Chat Technique</span>
                  </button>
                  <button
                    onClick={() => setSubmittedOrder(null)}
                    className="py-2.5 px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Nouvelle Demande
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-neutral-800 pb-4">
                  <h2 className="text-xl font-bold text-white">Créer une Demande de Service Sur-Mesure</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Décrivez votre besoin et nos experts vous feront un retour rapide avec proposition technique et devis.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-300">Type de prestation</label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="logo">Création Logo / Identité Visuelle</option>
                        <option value="video">Création Vidéo / Montage / Spot</option>
                        <option value="website">Création Site Web / App / E-commerce</option>
                        <option value="marketing">Publicité Facebook / Ads / Flyers</option>
                        <option value="autre">Autre Prestation Numérique ou Technique</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-300">Budget envisagé ($ USD)</label>
                      <input
                        type="number"
                        min="10"
                        value={budget}
                        onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300">Titre de votre projet <span className="text-blue-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Création de logo pour ma marque de vêtements à Pétion-Ville"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300">Description détaillée de votre besoin <span className="text-blue-400">*</span></label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Indiquez tous les détails : couleurs préférées, exemples de styles aimés, textes à inclure..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Soumettre ma Demande</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* CHAT DRAWER */}
        {activeChatRoomId && (
          <div className="fixed bottom-6 right-6 w-96 z-50 animate-in slide-in-from-bottom-5">
            <ChatDrawer
              chatRoomId={activeChatRoomId}
              title="Studio Services X GROUP"
              category="design"
              onClose={() => setActiveChatRoomId(null)}
            />
          </div>
        )}

        {/* UNIVERSAL REQUEST MODAL */}
        <CustomServiceRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          defaultCategory="design"
        />
      </div>
    </div>
  );
};
