export type TransactionType = 'BUY' | 'SELL';

export interface Transaction {
  id: string;
  type: TransactionType;
  amountUSD: number;
  rate: number;
  totalBDT: number;
  extraCharges?: number; // Optional fees in BDT
  date: string; // ISO String
}

export interface PortfolioMetrics {
  realizedProfit: number;
  inventoryUSD: number;
  avgBuyCost: number;
  lockedCapitalBDT: number;
}