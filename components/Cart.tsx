
import React, { useState } from 'react';
import { Trash2, Minus, Plus, Wallet, CreditCard, QrCode, ShoppingCart } from 'lucide-react';
import { CartItem, Order } from '../types';
import { theme, styles } from '../design-system';

interface CartProps {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onClear: () => void;
  onCheckout: (order: Partial<Order> & { cashReceived: number }) => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQty, onClear, onCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Debit' | 'QRIS'>('Cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const change = cashReceived ? Math.max(0, parseInt(cashReceived) - total) : 0;

  const handleCheckout = () => {
    if (items.length === 0) return;
    onCheckout({
      items,
      subtotal,
      tax,
      total,
      paymentMethod,
      cashReceived: parseInt(cashReceived) || 0
    });
  };

  return (
    <aside className={`w-[380px] bg-white border-l ${theme.colors.neutral.borderDark} flex flex-col h-screen sticky top-0 ${theme.shadow.xl} z-10`}>
      {/* Header - Reduced padding for more list space */}
      <div className="py-4 px-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className={styles.heading.h2}>Current Order</h2>
          <button onClick={onClear} className={`${styles.button.base} ${styles.button.dangerGhost} p-2`}>
            <Trash2 size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className={`${theme.colors.primary.light} ${theme.colors.primary.text} ${styles.badge}`}>#TRX-0042</div>
          <div className={`bg-slate-100 text-slate-600 ${styles.badge}`}>Table 8</div>
          <div className="flex items-center gap-1.5 ml-auto">
             <div className={`w-2 h-2 ${theme.colors.primary.main} ${theme.radius.full} animate-pulse`}></div>
             <span className={`${styles.label} tracking-wider`}>Dine In</span>
          </div>
        </div>
      </div>

      {/* Cart Items List - Area is flex-1 and will grow as footer shrinks */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-60">
            <ShoppingCart size={48} className="mb-4" />
            <p className="font-bold text-sm">No items selected</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <div className={`w-16 h-16 ${theme.radius.md} overflow-hidden flex-shrink-0`}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                  <span className="text-sm font-bold text-slate-800 whitespace-nowrap ml-2">
                    {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-3">Default Note</p>
                
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className={`w-6 h-6 ${theme.radius.sm} border ${theme.colors.neutral.borderDark} flex items-center justify-center text-slate-500 hover:bg-slate-50 ${theme.transition} active:scale-90`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className={`w-6 h-6 ${theme.radius.sm} border ${theme.colors.neutral.borderDark} flex items-center justify-center ${theme.colors.primary.text} hover:bg-emerald-50 ${theme.transition} active:scale-90`}
                  >
                    <Plus size={14} />
                  </button>
                  <span className={`${styles.label} ml-auto`}>Rp {item.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Summary - Made more compact to allow taller list */}
      <div className={`p-4 bg-slate-50/50 border-t ${theme.colors.neutral.border}`}>
        <div className="space-y-1.5 mb-3 text-xs">
          <div className="flex justify-between font-medium text-slate-500">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-medium text-slate-500">
            <span>Tax (10%)</span>
            <span>Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div className={`flex justify-between items-center pt-2 border-t ${theme.colors.neutral.borderDark} border-dashed mt-2`}>
            <span className="font-bold text-slate-800">Total Amount</span>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 leading-none">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className={`${styles.label} mb-2 block`}>Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Cash', icon: <Wallet size={16} /> },
              { id: 'Debit', icon: <CreditCard size={16} /> },
              { id: 'QRIS', icon: <QrCode size={16} /> }
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`flex flex-col items-center gap-1.5 py-2.5 ${theme.radius.md} border-2 ${theme.transition} ${
                  paymentMethod === method.id 
                  ? `${theme.colors.primary.border} ${theme.colors.primary.light} ${theme.colors.primary.text} shadow-sm` 
                  : 'border-white bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                {method.icon}
                <span className="text-[10px] font-bold">{method.id}</span>
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === 'Cash' && (
          <div className="mb-3">
            <label className={`${styles.label} mb-2 block`}>Cash Received</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setPaymentMethod(paymentMethod)} // Dummy set to satisfy lint if needed, but we use state
                onInput={(e) => setCashReceived((e.target as HTMLInputElement).value)}
                className={`w-full pl-8 pr-3 py-2 ${theme.radius.md} border-2 border-transparent focus:border-emerald-500 ${theme.colors.neutral.surface} ${theme.shadow.sm} outline-none font-bold text-lg text-slate-800 ${theme.transition}`}
                placeholder="0"
              />
            </div>
            
            <div className={`flex justify-between mt-2 ${theme.colors.primary.light} p-3 ${theme.radius.md} items-center`}>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Change</span>
              <span className={`text-lg font-black ${theme.colors.primary.text}`}>Rp {change.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || (paymentMethod === 'Cash' && (!cashReceived || parseInt(cashReceived) < total))}
          className={`w-full py-3 ${styles.button.base} ${styles.button.secondary}`}
        >
          <CreditCard size={18} />
          <span>Pay and Save</span>
        </button>
      </div>
    </aside>
  );
};

export default Cart;
