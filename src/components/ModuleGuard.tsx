import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ModuleFlags } from '../models/types';
import { isModuleEnabled } from '../modules/moduleRegistry';

interface ModuleGuardProps {
  moduleKey: keyof ModuleFlags;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ moduleKey, children, onNavigate }) => {
  const enabled = isModuleEnabled(moduleKey);

  if (!enabled) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">404 - Module Inactive</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            The requested enterprise module (<span className="text-amber-300 font-semibold uppercase">{moduleKey}</span>) has been temporarily disabled by administrative governance.
          </p>
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Global Portal</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
