import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { db } from '../services/db';

export const ContactPage: React.FC = () => {
  const siteConfig = db.getSiteConfig();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Freight Logistics & Customs');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Save as support chat record in DB
    const roomId = `support-${Date.now()}`;
    db.addChatMessage(roomId, {
      senderId: `guest-${Date.now()}`,
      senderEmail: email,
      senderName: name,
      senderRole: 'client',
      message: `[INQUIRY: ${subject}] ${message}`,
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-white">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Contact Headquarters & Regional Terminals
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Connect directly with our logistics dispatch coordinators, laboratory technicians, and corporate escrow desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Direct Communication Channels
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Institutional Inquiries</p>
                  <p className="font-semibold text-white font-mono">{siteConfig.emailContact || siteConfig.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Dispatch & Support Hotline</p>
                  <p className="font-semibold text-white font-mono">{siteConfig.phoneContact || siteConfig.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Hours of Operation</p>
                  <p className="font-semibold text-white">Mon–Sat: 08:00 – 19:00 EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Address Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl text-xs text-slate-400">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Miami Cargo Terminal</h4>
            <p>8200 NW 27th Street, Doral, FL 33122, USA</p>
            <p className="text-[10px] text-cyan-400 font-mono">Receiving dock open for pallet drop-offs daily.</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Transmitted to Logistics Desk</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you, {name}. A dispatch agent will respond to {email} within 30 minutes during active terminal hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-white">Direct Dispatch Inquiry</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Freight Logistics & Customs">Freight Logistics & Customs Clearance</option>
                  <option value="GSM Laboratory & Remote Flashing">GSM Laboratory & Remote Flashing</option>
                  <option value="Private Marketplace Wholesale">Private Marketplace Wholesale</option>
                  <option value="P2P Escrow Clearing Support">P2P Escrow Clearing Support</option>
                  <option value="Academy & Certification Registry">Academy & Certification Registry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide tracking numbers, device models, or consignment volume specifications..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
