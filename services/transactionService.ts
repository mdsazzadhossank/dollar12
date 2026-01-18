import { Transaction } from "../types";

const STORAGE_KEY = 'transactions';

// This service mimics a database interaction. 
// Currently using localStorage, but ready to be swapped with Supabase/Firebase.

export const fetchTransactions = async (): Promise<Transaction[]> => {
  // Simulating async network call
  return new Promise((resolve) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      resolve(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      resolve([]);
    }
  });
};

export const saveTransaction = async (transaction: Transaction): Promise<void> => {
  return new Promise(async (resolve) => {
    const current = await fetchTransactions();
    const updated = [...current, transaction];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    resolve();
  });
};

export const deleteTransaction = async (id: string): Promise<void> => {
  return new Promise(async (resolve) => {
    const current = await fetchTransactions();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    resolve();
  });
};