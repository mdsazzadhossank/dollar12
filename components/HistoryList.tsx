import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';

interface HistoryListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ transactions, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Recent History</h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <p className="text-sm">No transactions yet.</p>
          </div>
        ) : (
          transactions.slice().reverse().map((t) => (
            <div
              key={t.id}
              className="group flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    t.type === 'BUY' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}
                >
                  {t.type === 'BUY' ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t.type === 'BUY' ? 'Bought USD' : 'Sold USD'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(t.date).toLocaleDateString()} • {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${t.type === 'BUY' ? 'text-gray-900' : 'text-green-600'}`}>
                   {t.type === 'BUY' ? '+' : '-'}${t.amountUSD.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  @ {t.rate.toFixed(2)} BDT
                </p>
              </div>
              <button 
                onClick={() => onDelete(t.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-opacity"
                title="Delete Transaction"
              >
                  <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};