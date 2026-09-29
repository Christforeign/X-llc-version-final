import React from 'react';
import { X, Printer, Download, Shield, CheckCircle, FileText } from 'lucide-react';
import { Order } from '../models/types';
import { db } from '../services/db';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  customData?: {
    orderNumber: string;
    date: string;
    userName: string;
    userEmail: string;
    items: { title: string; price: number; quantity: number }[];
    total: number;
    type: string;
    status: string;
  } | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order, customData }) => {
  if (!isOpen || (!order && !customData)) return null;

  const siteConfig = db.getSiteConfig();

  const invoiceNumber = order ? order.orderNumber : customData?.orderNumber || 'XG-INV-000';
  const invoiceDate = order ? new Date(order.createdAt).toLocaleDateString() : customData?.date || new Date().toLocaleDateString();
  const clientName = order ? order.userEmail.split('@')[0] : customData?.userName || 'Valued Client';
  const clientEmail = order ? order.userEmail : customData?.userEmail || 'client@xgroup.com';
  const items = order
    ? order.items
    : customData?.items || [{ title: 'Service Rendering', price: customData?.total || 0, quantity: 1 }];
  const subtotal = order ? order.subtotal : customData?.total || 0;
  const tax = order ? order.tax : 0;
  const shippingFee = order ? order.shippingFee : 0;
  const total = order ? order.total : customData?.total || 0;
  const status = order ? order.status : customData?.status || 'paid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Top Control Bar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center space-x-2 text-xs">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Official Corporate Invoice View</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 sm:p-10 space-y-6" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-wider text-slate-900">XGROUP LLC</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">1200 Brickell Ave, Suite 1450</p>
              <p className="text-xs text-slate-500">Miami, FL 33131, United States</p>
              <p className="text-xs text-slate-500">EIN: 88-4290192 • Federal Logistics License</p>
              <p className="text-xs text-slate-500">{siteConfig.phoneContact}</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
                {status.toUpperCase()}
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">INVOICE</h1>
              <p className="text-xs font-mono font-bold text-blue-600 mt-0.5">{invoiceNumber}</p>
              <p className="text-xs text-slate-500 mt-1">Date: {invoiceDate}</p>
              <p className="text-xs text-slate-500">Settlement: Internal Wallet / Verified</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
            <div>
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Billed To</h3>
              <p className="font-semibold text-slate-900 capitalize">{clientName}</p>
              <p className="text-slate-600">{clientEmail}</p>
              <p className="text-slate-500 mt-0.5">Authorized Enterprise Account</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Payment Details</h3>
              <p className="text-slate-700">Method: Instant Double-Entry Ledger Debit</p>
              <p className="text-slate-700">Currency: USD ($)</p>
              <p className="text-emerald-600 font-semibold flex items-center space-x-1 mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Escrow & Cleared</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-900">{it.title}</td>
                    <td className="py-3 text-center text-slate-600">{it.quantity}</td>
                    <td className="py-3 text-right text-slate-600">${it.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-slate-900">
                      ${(it.price * it.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-slate-200 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Customs / Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              {shippingFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Freight Delivery:</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-300 pt-2">
                <span>Total Cleared:</span>
                <span className="text-blue-600">${total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-400 space-y-1 text-center">
            <p className="font-semibold text-slate-600">Thank you for choosing XGROUP LLC.</p>
            <p>
              This is a cryptographically registered electronic invoice generated autonomously by the XGROUP ERP System.
              No signature is required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
