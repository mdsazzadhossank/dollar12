import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, DollarSign, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { TransactionType } from '../types';

interface TransactionFormProps {
  onAddTransaction: (type: TransactionType, amount: number, rate: number) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>('BUY');
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const numRate = parseFloat(rate) || 0;
    setTotal(numAmount * numRate);
  }, [amount, rate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !rate) return;
    
    onAddTransaction(type, parseFloat(amount), parseFloat(rate));
    setAmount('');
    setRate('');
  };

  const isBuy = type === 'BUY';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-900 p-2 rounded-lg text-white">
           <ArrowRightLeft className="w-5 h-5" /> 
        </div>
        <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">New Trade</h2>
            <p className="text-xs text-slate-500">Record a buy or sell order</p>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="bg-slate-100 p-1 rounded-xl mb-6 grid grid-cols-2 relative">
        <button
          onClick={() => setType('BUY')}
          className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            isBuy
              ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Buy
        </button>
        <button
          onClick={() => setType('SELL')}
          className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            !isBuy
              ? 'bg-white text-rose-600 shadow-sm ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex-1">
        <div className="space-y-4">
            <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Amount (USD)</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-slate-600">
                    <DollarSign className="w-5 h-5" />
                </div>
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-slate-50 text-slate-900 font-medium placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-xl border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                />
            </div>
            </div>

            <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Exchange Rate (BDT)</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none group-focus-within:text-slate-600">
                    ৳
                </div>
                <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-slate-50 text-slate-900 font-medium placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-xl border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                />
            </div>
            </div>
        </div>

        <div className="mt-auto pt-6">
            <div className="flex justify-between items-end mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-500">Total Value</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                    ৳ {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${
                isBuy 
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
            }`}
            >
            <Check className="w-5 h-5" />
            {isBuy ? 'Confirm Purchase' : 'Confirm Sale'}
            </button>
        </div>
      </form>
    </div>
  );
};