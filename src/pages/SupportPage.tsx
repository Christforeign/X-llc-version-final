import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileQuestion,
  Smartphone,
  CreditCard,
  Truck,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { db } from '../services/db';

interface SupportPageProps {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const siteConfig = db.getSiteConfig();
  const [activeCategory, setActiveCategory] = useState<'all' | 'gsm' | 'wallet' | 'shein' | 'delivery' | 'cargo'>('all');
  
  // Ticket state
  const [dept, setDept] = useState('GSM Unlock & Licences');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ accordion toggle state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !message) return;

    const roomId = `support-${Date.now()}`;
    db.addChatMessage(roomId, {
      senderId: `guest-${Date.now()}`,
      senderEmail: contact.includes('@') ? contact : 'client@xgroup.ht',
      senderName: name,
      senderRole: 'client',
      message: `[TICKET ${priority.toUpperCase()} - ${dept}] [Réf: ${orderRef || 'N/A'}] ${message}`,
    });

    setSubmitted(true);
  };

  const faqs = [
    {
      category: 'gsm',
      q: 'Combien de temps prend un déblocage réseau GSM ou iCloud ?',
      a: 'Les services de déblocage instantané (Samsung FRP, Xiaomi Clean, Licences logiciels Chimera/UnlockTool) sont traités en 5 à 30 minutes. Les déblocages officiels par serveur (iCloud Clean, Opérateurs T-Mobile/AT&T) prennent en moyenne entre 24h et 72h ouvrées selon le statut du serveur.',
    },
    {
      category: 'wallet',
      q: 'Comment valider mon dépôt MonCash ou Natcash ?',
      a: 'Lors de votre dépôt sur le portefeuille, vous effectuez le transfert vers notre numéro officiel affiché, puis vous saisissez le numéro de référence reçu par SMS (ex: MC-12345678). Notre système comptable valide manuellement les transactions en moins de 15 minutes.',
    },
    {
      category: 'wallet',
      q: 'Puis-je retirer l’argent déposé sur mon portefeuille ?',
      a: 'Non. Le portefeuille X GROUP fonctionne selon le principe "Spend-Only" (Dépense uniquement). L’argent crédité est exclusivement dédié au règlement de vos prestations (recharges jeux, courses KlikeDeliv, déblocages GSM, paniers Shein et fret cargo) pour garantir la sécurité bancaire de nos utilisateurs.',
    },
    {
      category: 'shein',
      q: 'Comment fonctionne l’achat de mon panier Shein ou Amazon ?',
      a: 'Copiez simplement les liens ou captures de vos articles sur notre page "Services & Panier Shein". Nous calculons le montant en Gourdes (1 USD = 132 HTG) sans aucune commission bancaire internationale. Une fois payé par MonCash ou Portefeuille, nous achetons et expédions votre commande directement en Haïti.',
    },
    {
      category: 'delivery',
      q: 'Comment commander une course ou un chauffeur KlikeDeliv ?',
      a: 'Sur la page KlikeDeliv, entrez votre point de départ, destination et choisissez entre Moto Express, Taxi Standard ou SUV VIP. Le tarif en Gourdes est immédiatement calculé et transmis à notre centrale de dispatching pour une prise en charge rapide.',
    },
    {
      category: 'cargo',
      q: 'Quels sont les délais d’acheminement Cargo Miami / Haïti ?',
      a: 'Le fret aérien express arrive à Port-au-Prince en 3 à 5 jours ouvrés ($4.50/lb). Le fret maritime économique arrive en 10 à 15 jours ($22/pied cube). Le dédouanement est intégralement géré par X GROUP.',
    },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  const whatsappClean = (siteConfig.phoneContact || siteConfig.contactPhone || '+50900000000').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20">
      {/* Top Banner & Breadcrumb */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <button onClick={() => onNavigate('/')} className="hover:text-amber-400 transition-colors">
                Accueil
              </button>
              <span>/</span>
              <span className="text-amber-400 font-medium">Centre d'Assistance & Support Client</span>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Services Techniques Opérationnels 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            Support Client & Assistance Technique
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Comment pouvons-nous vous aider aujourd'hui ?
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Notre équipe technique et nos coordinateurs de dispatching sont à votre entière disposition. Temps de réponse moyen inférieur à 15 minutes.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Card 1: WhatsApp */}
          <a
            href={`https://wa.me/${whatsappClean}`}
            target="_blank"
            rel="noreferrer"
            className="group p-5 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-emerald-950/20"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                WhatsApp Live 24/7
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Chat instantané avec un technicien certifié pour toute urgence ou question.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center text-xs font-bold text-emerald-400">
              <span>Ouvrir la discussion</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </a>

          {/* Card 2: GSM Desk */}
          <button
            onClick={() => onNavigate('/gsm')}
            className="text-left group p-5 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                Serveur GSM & IMEI
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Suivi de commande de déblocage réseau, crédits chimera et FRP tool.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center text-xs font-bold text-amber-400">
              <span>Consulter le catalogue GSM</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </button>

          {/* Card 3: Payments Desk */}
          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-left group p-5 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                Dépôts & Portefeuille
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Vérification manuelle des transactions MonCash, Natcash, Zelle et USDT.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center text-xs font-bold text-blue-400">
              <span>Gérer mon solde</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </button>

          {/* Card 4: KlikeDeliv & Cargo */}
          <button
            onClick={() => onNavigate('/delivery')}
            className="text-left group p-5 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-yellow-500/50 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
                KlikeDeliv & Cargo
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Suivi de vos colis en provenance de Miami et coordination des courses VTC.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center text-xs font-bold text-yellow-400">
              <span>Accéder aux livraisons</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Split: Ticket Form & FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Left: 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    Ouvrir un Ticket de Support
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Remplissez ce formulaire et nous prendrons en charge votre demande en direct.
                  </p>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 bg-neutral-800 text-neutral-300 text-[11px] font-mono rounded-lg">
                  RÉPONSE &lt; 15 MIN
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Ticket Transmis avec Succès !</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Merci <strong className="text-white">{name}</strong>. Notre équipe a bien reçu votre demande concernant <span className="text-amber-400 font-semibold">{dept}</span>. Un agent vous contactera sans délai sur <strong className="text-white">{contact}</strong>.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Nouveau Ticket
                    </button>
                    <a
                      href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(`Bonjour X Group, je viens d'ouvrir le ticket pour : ${name} (${dept})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Accélérer via WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Département concerné *
                      </label>
                      <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="GSM Unlock & Licences">📱 Déblocage GSM / IMEI / Licences</option>
                        <option value="Dépôts & Portefeuille">💳 Dépôt MonCash / Natcash / Portefeuille</option>
                        <option value="Panier Shein & Amazon">🛍️ Achat Délégué Shein & Amazon</option>
                        <option value="KlikeDeliv Courses">🚖 KlikeDeliv / Courses & Chauffeurs</option>
                        <option value="Fret Cargo Miami">✈️ Fret Cargo & Expéditions</option>
                        <option value="Autre Demande Spécifique">✨ Autre Demande Spécifique</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Niveau d'Urgence
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPriority('normal')}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            priority === 'normal'
                              ? 'bg-neutral-800 border-neutral-600 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => setPriority('urgent')}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            priority === 'urgent'
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-amber-400'
                          }`}
                        >
                          🔥 Urgent 24/7
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Votre Nom Complet *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Jean Daniel Baptiste"
                        required
                        className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        WhatsApp ou Adresse Email *
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+509 XX XX XXXX ou email@..."
                        required
                        className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Numéro de Commande ou Réf. Transaction (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
                      placeholder="Ex: ORD-8924, MC-90214 ou IMEI du téléphone"
                      className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Description Détaillée de votre Problème *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Indiquez clairement le problème rencontré, le modèle d'appareil, la date ou l'heure de l'incident..."
                      required
                      className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmettre le Ticket au Support Technique</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quality Commitment Notice */}
            <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-white">Garantie & Engagement Client X GROUP</h4>
                <p className="text-neutral-400 leading-relaxed">
                  Si un service ne peut être délivré suite à une contrainte réseau ou incompatibilité matérielle, vos fonds sont intégralement recrédités sur votre portefeuille dans les 24 heures ouvrées.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive FAQ (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-amber-400" />
                  Foire Aux Questions (FAQ)
                </h3>
              </div>

              {/* Filter category pills */}
              <div className="flex flex-wrap gap-1.5 pb-4 border-b border-neutral-800">
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'gsm', label: 'GSM' },
                  { id: 'wallet', label: 'Portefeuille' },
                  { id: 'shein', label: 'Shein' },
                  { id: 'delivery', label: 'KlikeDeliv' },
                  { id: 'cargo', label: 'Cargo' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      activeCategory === tab.id
                        ? 'bg-amber-400 text-black'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Accordion list */}
              <div className="divide-y divide-neutral-800/80 mt-2">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="py-3.5">
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full text-left flex items-start justify-between gap-3 text-sm font-bold text-neutral-200 hover:text-amber-400 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="mt-2 text-xs text-neutral-400 leading-relaxed pl-1 animate-fadeIn">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Coordinates */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Coordonnées Directes & Horaires
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-neutral-400">Centrale Téléphonique & Dispatch</p>
                    <p className="font-mono text-white font-semibold">
                      {siteConfig.phoneContact || siteConfig.contactPhone || '+509 00 00 0000'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-neutral-400">Email Officiel Entreprise</p>
                    <p className="font-mono text-white font-semibold">
                      {siteConfig.emailContact || siteConfig.contactEmail || 'support@xgroup.ht'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-neutral-400">Permanence Serveur & WhatsApp</p>
                    <p className="text-white font-semibold">24h/24 & 7j/7 sans interruption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
