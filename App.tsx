import React, { useState, useMemo, useEffect } from 'react';
import { Wallet, TrendingUp, DollarSign, PiggyBank, Sparkles, Loader2 } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { TransactionForm } from './components/TransactionForm';
import { HistoryList } from './components/HistoryList';
import { Transaction, TransactionType, PortfolioMetrics } from './types';
import { AIModal } from './components/AIModal';
import { getPortfolioInsights } from './services/geminiService';
import { fetchTransactions, createTransaction, deleteTransaction } from './services/transactionService';

const App: React.FC = () => {
  // --- State ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        setLoading(true);
        const data = await fetchTransactions();
        setTransactions(data);
    } catch (error) {
        console.error("Failed to load transactions:", error);
        alert("Failed to connect to the database.");
    } finally {
        setLoading(false);
    }
  };

  // --- Metrics Calculation ---
  const metrics: PortfolioMetrics = useMemo(() => {
    let inventoryUSD = 0;
    let totalLockedCapital = 0; // Total cost basis for current inventory
    let realizedProfit = 0;

    // We need to process transactions chronologically for accurate weighted average cost
    // The API sorts them, but we ensure sorting here just in case
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const t of sortedTransactions) {
      const fees = Number(t.extraCharges) || 0;
      const amountUSD = Number(t.amountUSD);
      const totalBDT = Number(t.totalBDT);

      if (t.type === 'BUY') {
        // Weighted Average Cost Logic
        // Cost Basis increases by Trade Value + Fees
        inventoryUSD += amountUSD;
        totalLockedCapital += (totalBDT + fees);
      } else if (t.type === 'SELL') {
        if (inventoryUSD > 0) {
            const avgCost = totalLockedCapital / inventoryUSD;
            const costOfSoldItems = avgCost * amountUSD;
            
            // Net received from sale = Trade Value - Fees
            const netReceive = totalBDT - fees;
            
            const tradeProfit = netReceive - costOfSoldItems;

            realizedProfit += tradeProfit;
            inventoryUSD -= amountUSD;
            totalLockedCapital -= costOfSoldItems;
        } else {
            // Selling without inventory (Edge case)
            // Profit is Net Receive
            realizedProfit += (totalBDT - fees);
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

  // --- Handlers ---
  const handleAddTransaction = async (type: TransactionType, amountUSD: number, rate: number, extraCharges: number) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      type,
      amountUSD,
      rate,
      totalBDT: amountUSD * rate,
      extraCharges,
      date: new Date().toISOString(),
    };

    try {
        // Optimistic update
        setTransactions((prev) => [...prev, newTx]);
        await createTransaction(newTx);
    } catch (error) {
        console.error("Error saving transaction:", error);
        alert("Could not save to database.");
        // Revert on failure
        setTransactions((prev) => prev.filter(t => t.id !== newTx.id));
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
        const previousTransactions = [...transactions];
        try {
            // Optimistic update
            setTransactions((prev) => prev.filter(t => t.id !== id));
            await deleteTransaction(id);
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert("Could not delete from database.");
            // Revert on failure
            setTransactions(previousTransactions);
        }
    }
  };

  const handleOpenAI = async () => {
    setAIModalOpen(true);
    if (!aiContent) { // Only fetch if we haven't already this session (or could refresh)
        setAiLoading(true);
        const result = await getPortfolioInsights(metrics, transactions);
        setAiContent(result);
        setAiLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-4 text-blue-600">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-gray-500 font-medium">Loading Portfolio Data...</p>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
                <DollarSign className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dollar Trade Tracker</h1>
          </div>
          <button 
            onClick={handleOpenAI}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            AI Insights (বাংলা)
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Realized Profit"
            value={`${metrics.realizedProfit >= 0 ? '+' : ''}${Math.round(metrics.realizedProfit).toLocaleString()} BDT`}
            subValue="Net earnings after fees"
            icon={TrendingUp}
            iconBgClass="bg-green-100"
            iconColorClass="text-green-600"
          />
          <StatCard
            title="USD Inventory"
            value={`$${Math.round(metrics.inventoryUSD).toLocaleString()}`}
            subValue="Current dollars on hand"
            icon={DollarSign}
            iconBgClass="bg-blue-100"
            iconColorClass="text-blue-600"
          />
          <StatCard
            title="Avg Buy Cost"
            value={`${metrics.avgBuyCost.toFixed(2)} BDT`}
            subValue="Includes fees"
            icon={Wallet}
            iconBgClass="bg-orange-100"
            iconColorClass="text-orange-600"
          />
          <StatCard
            title="Portfolio Value (Cost)"
            value={`${Math.round(metrics.lockedCapitalBDT).toLocaleString()} BDT`}
            subValue="Total capital locked"
            icon={PiggyBank}
            iconBgClass="bg-gray-800"
            iconColorClass="text-gray-300"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form (4 cols) */}
          <div className="lg:col-span-4">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          {/* Right Column: History List (8 cols) */}
          <div className="lg:col-span-8 min-h-[400px]">
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