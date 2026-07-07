import { Category, Wallet, TransactionModel, SavingsGoal, Budget } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Ä‚n uá»‘ng', icon: 'ðŸ”', color: '#FFCAD4', type: 'expense' },
  { id: 'cat-transport', name: 'Äi láº¡i', icon: 'ðŸš—', color: '#B9FBC0', type: 'expense' },
  { id: 'cat-shopping', name: 'Mua sáº¯m', icon: 'ðŸ›’', color: '#98F5E1', type: 'expense' },
  { id: 'cat-study', name: 'Há»c táº­p', icon: 'ðŸ“š', color: '#E8AEFF', type: 'expense' },
  { id: 'cat-entertainment', name: 'Giáº£i trÃ­', icon: 'ðŸŽ®', color: '#FDFD96', type: 'expense' },
  { id: 'cat-home', name: 'NhÃ  cá»­a', icon: 'ðŸ ', color: '#FFE4E9', type: 'expense' },
  { id: 'cat-salary', name: 'LÆ°Æ¡ng bá»•ng', icon: 'ðŸ’°', color: '#B9FBC0', type: 'income' },
  { id: 'cat-bonus', name: 'ThÆ°á»Ÿng', icon: 'ðŸŽ', color: '#E8AEFF', type: 'income' },
];

export const DEFAULT_WALLETS: Wallet[] = [
  { id: 'wall-cash', name: 'Tiá»n máº·t', balance: 0, icon: 'ðŸ’µ', currency: 'â‚«' },
  { id: 'wall-bank', name: 'NgÃ¢n hÃ ng', balance: 0, icon: 'ðŸ¦', currency: 'â‚«' },
  { id: 'wall-credit', name: 'Tháº» tÃ­n dá»₫ng', balance: 0, icon: 'ðŸ’³', currency: 'â‚«' },
];

export const DEFAULT_GOALS: SavingsGoal[] = [
  { id: 'goal-car', name: 'Xe mÃ¡y', target: 30000000, current: 0, icon: 'ðŸï¸', color: '#FF708C' },
  { id: 'goal-laptop', name: 'MÃ¡y tÃ­nh', target: 20000000, current: 0, icon: 'ðŸ’»', color: '#E8AEFF' },
  { id: 'goal-study', name: 'Há»c táº­p', target: 50000000, current: 0, icon: 'ðŸŽ“', color: '#B9FBC0' },
];

export const DEFAULT_BUDGET: Budget = {
  month: '2026-07',
  limit: 10000000,
};

export const DEFAULT_TRANSACTIONS: TransactionModel[] = [];
