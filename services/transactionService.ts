import { Transaction } from '../types';

// Pointing to the PHP file in the api folder
const API_URL = 'api/transactions.php';

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch transactions: ${errorText}`);
    }
    return response.json();
};

export const createTransaction = async (transaction: Transaction): Promise<void> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create transaction: ${errorText}`);
    }
};

export const deleteTransaction = async (id: string): Promise<void> => {
    // PHP implementation uses query parameter for DELETE ID
    const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete transaction: ${errorText}`);
    }
};