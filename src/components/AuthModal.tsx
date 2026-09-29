import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import { UserRole } from '../models/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signin') {
      const res = authService.signIn(email, password);
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      if (!name.trim()) {
        setError('Veuillez renseigner votre nom complet ou le nom de votre entreprise.');
        return;
      }
      const res = authService.signUp({ email, name, phone, role });
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'signin' ? 'Connexion à XGROUP' : 'Créer un Compte XGROUP'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Portail sécurisé XGROUP LLC — Portefeuille, Suivi Fret & GSM
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name / Company</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexandre Mercier"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Account Role Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="client">Client (Retail & Purchases)</option>
                  <option value="partenaire">Partner (B2B Logistics & Freight)</option>
                  <option value="staff">Staff (GSM Engineer & Support)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <span>{mode === 'signin' ? 'Authenticate & Enter' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode(mode === 'signin' ? 'signup' : 'signin');
            }}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {mode === 'signin' ? "Don't have an account yet? Sign Up" : 'Already registered? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
