import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  Send, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  PhoneCall,
  ShoppingBag
} from 'lucide-react';
import { authService } from '../services/authService';

interface CustomServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const CustomServiceRequestModal: React.FC<CustomServiceRequestModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'general'
}) => {
  const currentUser = authService.getCurrentUser();
  const [category, setCategory] = useState(defaultCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState(currentUser?.email || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Save request to localStorage so it is preserved
    try {
      const existing = JSON.parse(localStorage.getItem('xgroup_custom_requests') || '[]');
      existing.unshift({
        id: `REQ-${Date.now()}`,
        category,
        title: title.trim() || 'Demande client spéciale',
        description: description.trim(),
        contact: contact.trim(),
        whatsapp: whatsapp.trim(),
        date: new Date().toISOString(),
        status: 'En attente d\'analyse'
      });
      localStorage.setItem('xgroup_custom_requests', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Bonjour X GROUP LLC ! J'ai une demande spéciale ou un service non listé sur le site :\n\n- Catégorie : ${category}\n- Description : ${description || title || 'Demande personnalisée'}\n- Mon contact : ${whatsapp || contact || 'Non spécifié'}`
    );
    window.open(`https://wa.me/50938440000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Autre chose ? Dites-le nous !</h3>
                <p className="text-xs text-neutral-400">
                  Un service, un produit ou une recharge non listée ? Nous l'ajoutons pour vous !
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300">Catégorie du besoin</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="gaming">🎮 Top-Up Jeux (Free Fire, PUBG, etc.)</option>
                <option value="shein">🛍️ Panier Shein / Amazon / AliExpress</option>
                <option value="gsm">📱 Service GSM (Unlock, IMEI, Licences)</option>
                <option value="exchange">💱 Échange de Devises (PayPal, MonCash, USDT)</option>
                <option value="cargo">✈️ Fret, Colis & Réception Haïti / RD</option>
                <option value="delivery">🛵 KlikeDeliv (Colis local & Nourriture)</option>
                <option value="driver">🚗 Chauffeur VTC / Transport</option>
                <option value="design">🎨 Graphisme, Vidéo & Création Web</option>
                <option value="troc">🔄 Troc & Échange d'Appareils</option>
                <option value="general">✨ Autre demande sur-mesure</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300">Titre ou nom du produit / service</label>
              <input
                type="text"
                placeholder="Ex: Recharge jeu spécial, Panier Shein 5 articles, Licence Unlock..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300">Description détaillée / Liens ou Détails <span className="text-amber-400">*</span></label>
              <textarea
                required
                rows={3}
                placeholder="Décrivez précisément ce dont vous avez besoin, collez des liens, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">WhatsApp (recommandé)</label>
                <input
                  type="text"
                  placeholder="+509 XXXX XXXX"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">Email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer ma demande à X GROUP</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Direct</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Demande bien reçue !</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Notre équipe technique et commerciale a reçu votre demande. Si c'est dans nos codes, nous l'ajouterons très rapidement sur la plateforme ou nous vous contacterons directement.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppDirect}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Suivre sur WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="py-2.5 px-5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
