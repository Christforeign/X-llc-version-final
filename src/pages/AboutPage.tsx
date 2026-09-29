import React from 'react';
import { Shield, Building2, MapPin, Award, CheckCircle2, FileCheck, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Corporate Profile & Institutional Standing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          XGROUP LLC &bull; Greater Caribbean Logistics & Technology Infrastructure
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Founded and registered in Florida, USA, XGROUP LLC bridges North American supply chains with the Caribbean basin through proprietary software engineering, bonded freight logistics, and telecommunications services.
        </p>
      </div>

      {/* Corporate Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-white">Bonded Multi-Modal Freight</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consolidated air and ocean cargo corridors connecting Miami Doral logistics terminals directly with Port-au-Prince and Santo Domingo customs authorities.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-white">GSM Engineering Laboratory</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct remote flashing, Qualcomm EDL recovery benches, official tool license activations, and certified network unlocking hardware benches.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-white">Cryptographic Escrow Clearing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Double-entry bookkeeping vaults protect every peer-to-peer barter, wholesale merchandise transaction, and gaming wager against counterparty defaults.
          </p>
        </div>
      </div>

      {/* Regional Operational Hubs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span>Regional Facilities & Distribution Terminals</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Headquarters & Air Cargo Hub</span>
            <h4 className="text-sm font-bold text-white">Miami Logistics Terminal (FL, USA)</h4>
            <p className="text-xs text-slate-400">8200 NW 27th Street, Doral, FL 33122</p>
            <p className="text-[11px] text-slate-500 font-mono">Bonded TSA Facility #MIA-8902</p>
          </div>

          <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Central Distribution Depot</span>
            <h4 className="text-sm font-bold text-white">Santo Domingo Hub (Dominican Republic)</h4>
            <p className="text-xs text-slate-400">Avenida Luperón #45, Santo Domingo</p>
            <p className="text-[11px] text-slate-500 font-mono">Customs Port Terminal Caucedo & SDQ</p>
          </div>

          <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Regional Intake & Service Center</span>
            <h4 className="text-sm font-bold text-white">Port-au-Prince Hub (Haiti)</h4>
            <p className="text-xs text-slate-400">48 Boulevard du 15 Octobre, Tabarre</p>
            <p className="text-[11px] text-slate-500 font-mono">Terminal Aeroportuaire Guy Malary</p>
          </div>
        </div>
      </div>
    </div>
  );
};
