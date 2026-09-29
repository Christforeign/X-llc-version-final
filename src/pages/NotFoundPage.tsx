import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center text-white">
      <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-white">404 - Page Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested resource, corridor, or module does not exist or has been retired.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Operational Center</span>
        </button>
      </div>
    </div>
  );
};
