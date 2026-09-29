import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Phone,
  Mail,
  Send as TelegramIcon,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { db } from '../services/db';

interface SupportBubbleProps {
  usdRate?: number;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const SupportBubble: React.FC<SupportBubbleProps> = ({ usdRate = 132.5 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'live' | 'whatsapp' | 'channels'>('ai');
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Bonjour ! Je suis l'Assistant IA X Group 🤖. Je peux vous aider sur vos commandes sur le site, le suivi par ID (#XG-...), nos services internes (Marketplace, Shein, Logos, Mini-sites) ou le taux du jour (1 USD = ${usdRate} HTG). Comment puis-je vous aider ?`,
      time: 'Maintenant',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Live Chat form state
  const [liveName, setLiveName] = useState('');
  const [livePhone, setLivePhone] = useState('');
  const [liveOrderId, setLiveOrderId] = useState('');
  const [liveMsg, setLiveMsg] = useState('');
  const [liveSubmittedId, setLiveSubmittedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'ai') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSendAi = (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = textToSend.toLowerCase();

      if (q.includes('taux') || q.includes('dollar') || q.includes('usd') || q.includes('gourde') || q.includes('rate')) {
        reply = `📊 Le taux officiel de conversion X Group est aujourd'hui de **1 USD = ${usdRate} GDS**. Tous nos calculs (Shein, fret, licences) s'ajustent instantanément à ce taux.`;
      } else if (q.includes('suivi') || q.includes('id') || q.includes('commande') || q.includes('statut')) {
        reply = `📦 Pour suivre votre commande : chaque commande passée sur le site génère automatiquement un reçu avec un identifiant unique (ex: **#XG-92841**). Vos commandes restent enregistrées sur le site sans passer par WhatsApp ! Rendez-vous dans votre Dashboard pour voir l'état d'avancement.`;
      } else if (q.includes('paiement') || q.includes('moncash') || q.includes('natcash') || q.includes('payer')) {
        reply = `💳 Nous acceptons les paiements sécurisés via MonCash, Natcash, Virement bancaire haïtien (Sogebank, Unibank, BNC), USDT/Crypto et le Portefeuille X Group.`;
      } else if (q.includes('shein') || q.includes('amazon') || q.includes('panier')) {
        reply = `👗 Pour Shein / Amazon : collez simplement vos liens d'articles ou le montant de votre panier sur notre page Panier Shein. Le système calcule le fret et génère votre commande validée sur le site avec ID immédiat !`;
      } else if (q.includes('marketplace') || q.includes('vendeur') || q.includes('boutique')) {
        reply = `🛍️ Le Marketplace X Group est notre catalogue officiel et interne d'équipements vérifiés, téléphones, pièces détachées et activations logicielles. Nous ne prenons aucun vendeur externe pour garantir 100% de fiabilité et de SAV direct.`;
      } else if (q.includes('logo') || q.includes('graphisme') || q.includes('video')) {
        reply = `🎨 Notre studio créatif X Group réalise vos logos HD vectoriels, flyers, bannières et montages vidéo en 24h à 48h. Soumettez votre brief directement en ligne !`;
      } else {
        reply = `Merci pour votre message ! Notre équipe technique a bien reçu votre demande. Pour toute urgence directe, vous pouvez également basculer sur l'onglet WhatsApp Support ou Telegram.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleSubmitLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveName || !livePhone || !liveMsg) return;

    const newTicketId = `#XG-SUPPORT-${Math.floor(10000 + Math.random() * 90000)}`;
    setLiveSubmittedId(newTicketId);
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      <div className="fixed bottom-6 right-5 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm rounded-full shadow-2xl shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-amber-300/40 cursor-pointer"
          aria-label="Centre de Support et IA X Group"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
          </span>
          <Bot className="w-5 h-5 text-black" />
          <span className="tracking-wide">Support & IA 24/7</span>
        </button>
      </div>

      {/* Support Hub Modal / Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/80 w-full sm:max-w-md h-[90vh] sm:h-[620px] rounded-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white sm:mr-4 sm:mb-12">
            {/* Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-md shadow-amber-500/20">
                  🤖
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-white">Centre Support X Group</h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>En ligne 24/7 • IA & Conseillers</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 bg-slate-950/60 p-1 border-b border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-2 text-center rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'ai' ? 'bg-amber-500 text-black shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>IA X Group</span>
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className={`py-2 text-center rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'live' ? 'bg-amber-500 text-black shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Direct</span>
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`py-2 text-center rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'whatsapp' ? 'bg-amber-500 text-black shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`py-2 text-center rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'channels' ? 'bg-amber-500 text-black shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TelegramIcon className="w-3.5 h-3.5" />
                <span>Réseaux</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: AI ASSISTANT */}
              {activeTab === 'ai' && (
                <div className="flex flex-col h-full justify-between gap-3">
                  <div className="space-y-3 overflow-y-auto pr-1">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {m.sender === 'ai' && (
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-black shrink-0">
                            🤖
                          </div>
                        )}
                        <div
                          className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-amber-500 text-black font-medium rounded-br-none'
                              : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-line">{m.text}</p>
                          <span
                            className={`text-[9px] block mt-1 ${
                              m.sender === 'user' ? 'text-black/60 text-right' : 'text-slate-500'
                            }`}
                          >
                            {m.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200"></span>
                        <span className="text-[10px] text-slate-500">L'IA prépare sa réponse...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Prompts */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleSendAi('Quel est le taux du jour ?')}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors cursor-pointer"
                      >
                        📊 Taux USD/GDS
                      </button>
                      <button
                        onClick={() => handleSendAi('Comment suivre ma commande avec mon ID ?')}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors cursor-pointer"
                      >
                        📦 Suivi par ID
                      </button>
                      <button
                        onClick={() => handleSendAi('Comment fonctionne la commande Shein ?')}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors cursor-pointer"
                      >
                        👗 Panier Shein
                      </button>
                    </div>

                    {/* Input form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendAi();
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        placeholder="Posez une question à l'IA X Group..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        disabled={!inputPrompt.trim()}
                        className="p-2 bg-amber-500 disabled:opacity-40 hover:bg-amber-400 text-black rounded-xl font-bold transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE CHAT / TICKET */}
              {activeTab === 'live' && (
                <div className="space-y-4">
                  {liveSubmittedId ? (
                    <div className="text-center py-8 space-y-3 bg-slate-950 p-6 rounded-2xl border border-emerald-500/30">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                      <h4 className="text-base font-extrabold text-white">Ticket Support Enregistré !</h4>
                      <div className="inline-block bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-bold">
                        {liveSubmittedId}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Votre message est transmis à nos agents d'astreinte. Vous recevrez une réponse prioritaire directement par SMS/Appel au{' '}
                        <strong>{livePhone}</strong>.
                      </p>
                      <button
                        onClick={() => {
                          setLiveSubmittedId(null);
                          setLiveMsg('');
                        }}
                        className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl font-bold text-white transition-colors"
                      >
                        Nouveau Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitLiveChat} className="space-y-3">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Laissez un message direct à nos équipes techniques. Réponse garantie sous quelques minutes.
                      </p>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Votre Nom & Prénom :</label>
                        <input
                          type="text"
                          required
                          value={liveName}
                          onChange={(e) => setLiveName(e.target.value)}
                          placeholder="Ex: Jean Baptiste"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Numéro Téléphone / WhatsApp :</label>
                        <input
                          type="tel"
                          required
                          value={livePhone}
                          onChange={(e) => setLivePhone(e.target.value)}
                          placeholder="+509 0000 0000"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">ID Commande (Optionnel) :</label>
                        <input
                          type="text"
                          value={liveOrderId}
                          onChange={(e) => setLiveOrderId(e.target.value)}
                          placeholder="Ex: #XG-10294"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Votre Problème / Message :</label>
                        <textarea
                          required
                          rows={3}
                          value={liveMsg}
                          onChange={(e) => setLiveMsg(e.target.value)}
                          placeholder="Décrivez votre question ou besoin d'assistance..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        🚀 Transmettre Mon Ticket au Support
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: WHATSAPP (SUPPORT SEULEMENT) */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center mx-auto shadow-lg shadow-[#25D366]/20">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Ligne WhatsApp Support 24/7</h4>
                  <p className="text-xs text-slate-300 leading-relaxed px-4">
                    WhatsApp est réservé <strong>exclusivement pour l'assistance technique, le SAV et le support client</strong>. Les commandes sont passées et validées en toute autonomie sur le site avec ID unique !
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
                    +509 37 00 00 00
                  </div>
                  <a
                    href="https://wa.me/50900000000?text=Bonjour%20Support%20X%20Group,%20j%27ai%20besoin%20d%27aide%20concernant%20mon%20compte%20ou%20une%20commande."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-[#25D366]/20"
                  >
                    <span>Ouvrir WhatsApp Support</span>
                  </a>
                </div>
              )}

              {/* TAB 4: CHANNELS (TELEGRAM & EMAIL) */}
              {activeTab === 'channels' && (
                <div className="space-y-3 py-2">
                  <a
                    href="https://t.me/xgroup_official"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <TelegramIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-white group-hover:text-sky-400 transition-colors">
                        Canal & Bot Telegram
                      </h5>
                      <p className="text-[11px] text-slate-400">@xgroup_official • Alertes & recharges</p>
                    </div>
                  </a>

                  <a
                    href="mailto:support@xgroupdigital.com"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-white group-hover:text-rose-400 transition-colors">
                        Email Support Officiel
                      </h5>
                      <p className="text-[11px] text-slate-400">support@xgroupdigital.com • Réponse &lt; 2h</p>
                    </div>
                  </a>

                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200/90 leading-relaxed">
                    💡 <strong>Astuce X Group :</strong> Conservez précieusement votre ID de commande (ex: <code>#XG-12345</code>) pour accélérer toute demande auprès de nos équipes.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
