import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, Trash2, Calendar, History } from 'lucide-react';

interface HistoryListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ transactions, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <History className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">History</h2>
                <p className="text-xs text-slate-500">Recent market activity</p>
            </div>
        </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <Calendar className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm font-medium">No transactions recorded</p>
          </div>
        ) : (
          transactions.slice().reverse().map((t) => (
            <div
              key={t.id}
              className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    t.type === 'BUY' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {t.type === 'BUY' ? (
                    <ArrowDownLeft className="w-6 h-6" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        t.type === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                        {t.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        {new Date(t.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Rate: <span className="text-slate-900 font-bold">{t.rate.toFixed(2)}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right mr-8 sm:mr-0">
                <p className={`text-lg font-bold tracking-tight ${t.type === 'BUY' ? 'text-slate-900' : 'text-slate-900'}`}>
                   {t.type === 'BUY' ? '+' : '-'}${t.amountUSD.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  ৳ {Math.round(t.totalBDT).toLocaleString()} total
                </p>
              </div>

              <button 
                onClick={() => onDelete(t.id)}
                className="absolute right-2 top-2 sm:static sm:opacity-0 sm:group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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