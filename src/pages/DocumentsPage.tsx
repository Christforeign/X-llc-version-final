import React from 'react';
import { FileCheck, Download, ShieldCheck, ExternalLink, Lock } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const documents = [
    {
      title: 'Florida State Certificate of Organization (LLC)',
      docNumber: 'FL-DOC-L23000849201',
      date: 'January 12, 2023',
      fileSize: '1.2 MB',
      type: 'Corporate Charter',
      desc: 'Official Florida Division of Corporations registry record under Florida Statutes Chapter 605.',
    },
    {
      title: 'TSA Indirect Air Carrier (IAC) Compliance & Cargo Bond',
      docNumber: 'TSA-IAC-90412-B',
      date: 'March 04, 2024',
      fileSize: '2.8 MB',
      type: 'Aviation Logistics',
      desc: 'Security standard operating procedures and bonded customs clearance credential for Miami Hub cargo flights.',
    },
    {
      title: 'US Export Administration Regulations (EAR) Exemption Filing',
      docNumber: 'BIS-EAR-2024-XG',
      date: 'April 18, 2024',
      fileSize: '890 KB',
      type: 'Export Compliance',
      desc: 'Bureau of Industry and Security certification for commercial telecommunications equipment transshipment.',
    },
    {
      title: 'Double-Entry Financial Architecture & Escrow Audit Statement',
      docNumber: 'AUD-XG-2024-Q3',
      date: 'July 30, 2024',
      fileSize: '1.4 MB',
      type: 'Financial Audit',
      desc: 'Independent assessment verifying atomic balance settlement and zero-counterparty escrow solvency.',
    },
    {
      title: 'XGROUP Standard Terms of Logistics & Remote Repair Service',
      docNumber: 'XG-TOS-V4.2',
      date: 'Updated September 2024',
      fileSize: '450 KB',
      type: 'Legal Terms',
      desc: 'Master institutional terms governing cargo liability, remote USB-over-IP sessions, and platform fees.',
    },
  ];

  const handleDownload = (title: string) => {
    // Generate simulated downloadable file
    const content = `XGROUP LLC OFFICIAL CORPORATE RECORD\n=====================================\nDocument: ${title}\nRegistered Entity: XGROUP LLC (Florida, USA)\nMiami Logistics Terminal: 8200 NW 27th St, Doral, FL 33122\nStatus: Certified & Compliant with Florida State and Federal Law.\nSHA-256 Hash: 9f8a3c2e1b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-white">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Transparency & Regulatory Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Official Documents & Corporate Filings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Review, inspect, and download verified certificates of standing, customs bonds, and operational legal charters for XGROUP LLC.
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {doc.type}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">{doc.docNumber}</span>
              </div>
              <h3 className="text-base font-bold text-white">{doc.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{doc.desc}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                Filed: {doc.date} &bull; Size: {doc.fileSize}
              </p>
            </div>

            <button
              onClick={() => handleDownload(doc.title)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-700 hover:border-blue-500 shadow-md self-start md:self-center shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Record</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
