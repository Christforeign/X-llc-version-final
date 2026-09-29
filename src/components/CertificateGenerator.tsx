import React, { useRef, useEffect } from 'react';
import { Download, Award, ShieldCheck, CheckCircle } from 'lucide-react';
import { Certificate } from '../models/types';

interface CertificateGeneratorProps {
  certificate: Certificate;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ certificate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions for high-res certificate (1200x850)
    canvas.width = 1200;
    canvas.height = 850;

    // Background gradient (warm luxury cream / slate ivory)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(0.5, '#f1f5f9');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Ornate Gold & Navy Outer Borders
    ctx.strokeStyle = '#1e3a8a'; // Navy
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 790);

    ctx.strokeStyle = '#d97706'; // Gold
    ctx.lineWidth = 3;
    ctx.strokeRect(46, 46, 1108, 758);

    // Corner decorative geometric accents
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x, y, 16, 16);
    };
    drawCorner(52, 52);
    drawCorner(1132, 52);
    drawCorner(52, 782);
    drawCorner(1132, 782);

    // Organization Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('XGROUP ACADEMY & TECHNOLOGY INSTITUTE', 600, 120);

    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 16px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('Authorized Training & Professional Engineering Division • Miami, Florida, USA', 600, 150);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 230);

    // Presentation Subtitle
    ctx.fillStyle = '#475569';
    ctx.font = '18px sans-serif';
    ctx.fillText('This is to certify that professional candidate', 600, 290);

    // Candidate Name
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 48px serif';
    ctx.fillText(certificate.userName.toUpperCase(), 600, 365);

    // Line under candidate name
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 385);
    ctx.lineTo(850, 385);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#475569';
    ctx.font = '19px sans-serif';
    ctx.fillText('has successfully satisfied all rigorous curriculum criteria, technical laboratories, and passed with score:', 600, 435);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`${certificate.grade}% PASSING GRADE`, 600, 480);

    // Course Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px serif';
    ctx.fillText(`“ ${certificate.courseTitle} ”`, 600, 540);

    // Footer Credentials & Hash
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = '13px monospace';
    ctx.fillText(`Certificate ID: ${certificate.certificateNumber}`, 90, 680);
    ctx.fillText(`Issue Date: ${new Date(certificate.issuedAt).toLocaleDateString()}`, 90, 705);
    ctx.fillText(`SHA-256 Ledger Hash: ${(certificate.verificationHash || '').slice(0, 34)}...`, 90, 730);

    // Signatures
    ctx.textAlign = 'right';
    ctx.font = 'italic 18px serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Jean-Marc Durand', 1100, 690);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Director of Technical Standards', 1100, 715);
    ctx.fillText('XGROUP Global Engineering Council', 1100, 735);

    // Gold Seal in bottom-center
    ctx.beginPath();
    ctx.arc(600, 700, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('OFFICIAL', 600, 695);
    ctx.fillText('VERIFIED', 600, 712);
  }, [certificate]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.certificateNumber}_${certificate.userName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>Dynamic Verified Credential</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">Unique Credential ID: {certificate.certificateNumber}</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res Diploma (.PNG)</span>
        </button>
      </div>

      {/* Rendered Canvas Preview */}
      <div className="rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center shadow-2xl">
        <canvas ref={canvasRef} className="max-w-full h-auto object-contain rounded-lg" />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <span className="flex items-center space-x-1 text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Ledger Authenticity Guaranteed</span>
        </span>
        <span className="font-mono text-[11px]">Hash: {certificate.verificationHash}</span>
      </div>
    </div>
  );
};
