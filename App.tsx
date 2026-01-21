import React, { useState, useMemo, useEffect } from 'react';
import { Wallet, TrendingUp, DollarSign, PiggyBank, Sparkles, Loader2, BarChart3, Coins } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { TransactionForm } from './components/TransactionForm';
import { HistoryList } from './components/HistoryList';
import { Transaction, TransactionType, PortfolioMetrics } from './types';
import { AIModal } from './components/AIModal';
import { getPortfolioInsights } from './services/geminiService';
import { fetchTransactions, saveTransactions } from './api';

const App: React.FC = () => {
  // --- State ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(null);

  // --- Initial Load ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      const data = await fetchTransactions();
      setTransactions(data);
      setIsLoadingData(false);
    };
    loadData();
  }, []);

  // --- Handlers ---
  const handleAddTransaction = async (type: TransactionType, amountUSD: number, rate: number) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      type,
      amountUSD,
      rate,
      totalBDT: amountUSD * rate,
      date: new Date().toISOString(),
    };
    
    const updatedTransactions = [...transactions, newTx];
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
        const updatedTransactions = transactions.filter(t => t.id !== id);
        setTransactions(updatedTransactions);
        await saveTransactions(updatedTransactions);
    }
  };

  // --- Metrics Calculation ---
  const metrics: PortfolioMetrics = useMemo(() => {
    let inventoryUSD = 0;
    let totalLockedCapital = 0; // Total cost basis for current inventory
    let realizedProfit = 0;

    // We need to process transactions chronologically for accurate weighted average cost
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const t of sortedTransactions) {
      if (t.type === 'BUY') {
        // Weighted Average Cost Logic
        // New Total Cost = Current Locked Capital + New Trade Cost
        inventoryUSD += t.amountUSD;
        totalLockedCapital += t.totalBDT;
      } else if (t.type === 'SELL') {
        if (inventoryUSD > 0) {
            const avgCost = totalLockedCapital / inventoryUSD;
            const costOfSoldItems = avgCost * t.amountUSD;
            const tradeProfit = t.totalBDT - costOfSoldItems;

            realizedProfit += tradeProfit;
            inventoryUSD -= t.amountUSD;
            totalLockedCapital -= costOfSoldItems;
        } else {
            // Selling without inventory (Short selling? Or data error). 
            // Assuming simplified model: profit is full amount if cost is 0 (which shouldn't happen usually)
            realizedProfit += t.totalBDT;
        }
      }
    }
    
    // Fix small floating point errors
    inventoryUSD = Math.max(0, inventoryUSD);
    totalLockedCapital = Math.max(0, totalLockedCapital);

    const avgBuyCost = inventoryUSD > 0 ? totalLockedCapital / inventoryUSD : 0;

    return {
      realizedProfit,
      inventoryUSD,
      avgBuyCost,
      lockedCapitalBDT: totalLockedCapital,
    };
  }, [transactions]);

  const handleOpenAI = async () => {
    setAIModalOpen(true);
    if (!aiContent) { // Only fetch if we haven't already this session (or could refresh)
        setAiLoading(true);
        const result = await getPortfolioInsights(metrics, transactions);
        setAiContent(result);
        setAiLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
           <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
           <p className="text-sm font-medium text-slate-500">Syncing portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 mb-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                <BarChart3 className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Trade Tracker</h1>
                <p className="text-xs text-slate-500 font-medium">USD/BDT Portfolio Manager</p>
            </div>
          </div>
          <button 
            onClick={handleOpenAI}
            className="group flex items-center gap-2 pl-4 pr-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-xl active:scale-95 border border-transparent hover:border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-indigo-300 group-hover:text-yellow-300 transition-colors" />
            <span>AI Insights</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Realized Profit"
            value={`৳ ${Math.round(metrics.realizedProfit).toLocaleString()}`}
            subValue="Lifetime earnings"
            icon={TrendingUp}
            colorTheme="green"
          />
          <StatCard
            title="USD Holding"
            value={`$${Math.round(metrics.inventoryUSD).toLocaleString()}`}
            subValue="Available inventory"
            icon={DollarSign}
            colorTheme="blue"
          />
          <StatCard
            title="Avg Buy Cost"
            value={`৳ ${metrics.avgBuyCost.toFixed(2)}`}
            subValue="Break-even rate"
            icon={Coins}
            colorTheme="orange"
          />
          <StatCard
            title="Locked Capital"
            value={`৳ ${Math.round(metrics.lockedCapitalBDT).toLocaleString()}`}
            subValue="Portfolio cost basis"
            icon={PiggyBank}
            colorTheme="slate"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          {/* Right Column: History List (8 cols) */}
          <div className="lg:col-span-8 min-h-[500px]">
            <HistoryList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        
        </div>
      </main>

      {/* AI Modal */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setAIModalOpen(false)} 
        loading={aiLoading} 
        content={aiContent} 
      />
    </div>
  );
};

export default App;