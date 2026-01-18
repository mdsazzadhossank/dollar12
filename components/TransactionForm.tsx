import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { TransactionType } from '../types';

interface TransactionFormProps {
  onAddTransaction: (type: TransactionType, amount: number, rate: number, extraCharges: number) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>('BUY');
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [charges, setCharges] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const numRate = parseFloat(rate) || 0;
    const numCharges = parseFloat(charges) || 0;
    
    const baseTotal = numAmount * numRate;
    
    // For BUY: Total Cost = (Amount * Rate) + Charges
    // For SELL: Net Receive = (Amount * Rate) - Charges
    if (type === 'BUY') {
        setTotal(baseTotal + numCharges);
    } else {
        setTotal(Math.max(0, baseTotal - numCharges));
    }
  }, [amount, rate, charges, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !rate) return;
    
    onAddTransaction(type, parseFloat(amount), parseFloat(rate), parseFloat(charges) || 0);
    setAmount('');
    setRate('');
    setCharges('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-blue-600">
           <PlusCircle className="w-5 h-5" /> 
        </div>
        <h2 className="text-lg font-bold text-gray-800">New Transaction</h2>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setType('BUY')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
            type === 'BUY'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Buy USD
        </button>
        <button
          onClick={() => setType('SELL')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
            type === 'SELL'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MinusCircle className="w-4 h-4" />
          Sell USD
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Amount (USD)</label>
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
             <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-gray-700 text-white placeholder-gray-400 pl-8 pr-4 py-3 rounded-lg border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Exchange Rate (BDT/USD)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 120.50"
            step="0.01"
            min="0"
            className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Extra Charges (BDT)</label>
          <input
            type="number"
            value={charges}
            onChange={(e) => setCharges(e.target.value)}
            placeholder="e.g. 50"
            step="0.01"
            min="0"
            className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>

        <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">
                {type === 'BUY' ? 'Total Cost (inc. fees):' : 'Net Receive (less fees):'}
            </span>
            <span className="text-sm font-bold text-gray-900">{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT</span>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-medium text-white transition-colors shadow-lg shadow-blue-500/30 ${type === 'BUY' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}
        >
          {type === 'BUY' ? 'Confirm Purchase' : 'Confirm Sale'}
        </button>
      </form>
    </div>
  );
};