/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  color: string; // Tailwind bg color class or hex
  type: 'income' | 'expense';
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  icon: string; // e.g. "Wallet", "CreditCard", "PiggyBank"
  currency: string; // e.g. "Â₫", "$", "Ä‘", "â‚¬"
}

export interface TransactionModel {
  id: string;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
  categoryId: string;
  walletId: string;
  type: 'income' | 'expense';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string; // Emoji or Lucide icon name
  color: string;
}

export interface Budget {
  month: string; // YYYY-MM
  limit: number;
}
