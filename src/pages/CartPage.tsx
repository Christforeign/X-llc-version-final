import React from 'react';
import { ShoppingCart, Trash2, ArrowRight, Plus, Minus, ShieldCheck, Boxes } from 'lucide-react';
import { MarketplaceItem } from '../models/types';

export interface CartItem extends MarketplaceItem {
  quantity: number;
}

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 200 ? 0 : 25) : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-400">
            Explore our private wholesale catalog of unlocked smartphones, flashing dongles, and freight space.
          </p>
          <button
            onClick={() => onNavigate('/marketplace')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
          >
            Explore Marketplace Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Wholesale Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-0.5">{cart.length} unique procurement items reserved</p>
        </div>
        <button
          onClick={onClearCart}
          className="text-xs text-rose-400 hover:underline cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-400">Vendor: {item.sellerName}</p>
                  <p className="text-xs font-bold text-emerald-400 mt-1">${item.price.toFixed(2)} USD</p>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-1 space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-white px-1">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <p className="text-xs font-bold text-white font-mono">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Checkout Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl h-fit space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3">
            Procurement Summary
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bonded Freight & Handling</span>
              <span className="font-mono text-white">{shipping === 0 ? 'FREE (Wholesale)' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-3 text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-emerald-400 text-base font-mono">${total.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="p-3 bg-black rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <span className="text-yellow-400 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span>Instant Escrow Clearing</span>
            </span>
            <p>Funds remain protected until consignment delivery is confirmed.</p>
          </div>

          <button
            onClick={() => onNavigate('/checkout')}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-yellow-400/20 cursor-pointer transition-all"
          >
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
