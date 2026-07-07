import { Category, Wallet, TransactionModel, SavingsGoal, Budget } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Ăn uống', icon: '🍔', color: '#FFCAD4', type: 'expense' },
  { id: 'cat-transport', name: 'Đi lại', icon: '🚗', color: '#B9FBC0', type: 'expense' },
  { id: 'cat-shopping', name: 'Mua sắm', icon: '🛒', color: '#98F5E1', type: 'expense' },
  { id: 'cat-study', name: 'Học tập', icon: '📚', color: '#E8AEFF', type: 'expense' },
  { id: 'cat-entertainment', name: 'Giải trí', icon: '🎮', color: '#FDFD96', type: 'expense' },
  { id: 'cat-home', name: 'Nhà cửa', icon: '🏠', color: '#FFE4E9', type: 'expense' },
  { id: 'cat-salary', name: 'Lương bổng', icon: '💰', color: '#B9FBC0', type: 'income' },
  { id: 'cat-bonus', name: 'Thưởng', icon: '🎁', color: '#E8AEFF', type: 'income' },
];

export const DEFAULT_WALLETS: Wallet[] = [
  { id: 'wall-cash', name: 'Tiền mặt', balance: 0, icon: '💵', currency: '₫' },
  { id: 'wall-bank', name: 'Ngân hàng', balance: 0, icon: '🏦', currency: '₫' },
  { id: 'wall-credit', name: 'Thẻ tín dụng', balance: 0, icon: '💳', currency: '₫' },
];

export const DEFAULT_GOALS: SavingsGoal[] = [
  { id: 'goal-car', name: 'Xe máy', target: 30000000, current: 0, icon: '🏍️', color: '#FF708C' },
  { id: 'goal-laptop', name: 'Máy tính', target: 20000000, current: 0, icon: '💻', color: '#E8AEFF' },
];

export const DEFAULT_BUDGET: Budget = {
  month: '2026-07',
  limit: 10000000,
};

export const DEFAULT_TRANSACTIONS: TransactionModel[] = [];
