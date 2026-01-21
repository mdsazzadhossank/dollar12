import { Transaction } from './types';

// Types for the global dttSettings object injected by WordPress
declare global {
  interface Window {
    dttSettings: {
      root: string;
      nonce: string;
    };
  }
}

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'X-WP-Nonce': window.dttSettings?.nonce || '',
  };
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  if (!window.dttSettings) {
    // Fallback for development outside WP
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  }

  try {
    const response = await fetch(`${window.dttSettings.root}dollar-tracker/v1/transactions`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const saveTransactions = async (transactions: Transaction[]): Promise<boolean> => {
  if (!window.dttSettings) {
    // Fallback for development outside WP
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return true;
  }

  try {
    const response = await fetch(`${window.dttSettings.root}dollar-tracker/v1/transactions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(transactions),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving transactions:', error);
    return false;
  }
};