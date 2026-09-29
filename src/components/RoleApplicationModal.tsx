import React, { useState } from 'react';
import { ShieldCheck, X, Send, Award, CheckCircle, Briefcase } from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { UserRole } from '../models/types';

interface RoleApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RoleApplicationModal: React.FC<RoleApplicationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const currentUser = authService.getCurrentUser();
  const [requestedRole, setRequestedRole] = useState<UserRole>('staff');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    db.submitRoleApplication({
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      requestedRole,
      experience,
      motivation,
      phone,
    });

    setSubmitted(true);
    setTimeout(() => {
      onSuccess?.();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Candidature transmise avec succès !</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Votre dossier pour le statut <span className="font-semibold text-emerald-400 uppercase">{requestedRole}</span> a été soumis au Conseil d'Administration XGROUP. Vous recevrez une notification d'approbation après examen.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Postuler pour un rôle accrédité</h3>
                <p className="text-xs text-slate-400">
                  Accédez aux consoles techniques GSM ou au réseau B2B partenaire
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rôle souhaité
              </label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="staff">Staff Technique / Ingénieur GSM (FRP, Déblocages, Clés)</option>
                <option value="partenaire">Partenaire B2B / Transitaire Fret & Cargo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Numéro de téléphone / WhatsApp de contact
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+509 ... ou +1 ..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Expérience technique ou professionnelle
              </label>
              <textarea
                rows={3}
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Ex: 4 ans d'expérience en micro-soudure de cartes mères, maîtrise d'UnlockTool et Chimera..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Motivations et compétences clés
              </label>
              <textarea
                rows={2}
                required
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Pourquoi souhaitez-vous rejoindre l'équipe accréditée XGROUP ?"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Soumettre ma candidature</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
