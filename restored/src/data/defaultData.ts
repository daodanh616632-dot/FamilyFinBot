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
  { id: 'wall-cash', name: 'Ví Tiền Mặt', balance: 5485, icon: '💵', currency: '¥' },
  { id: 'wall-mcard', name: 'Thẻ Mastercard', balance: 12000, icon: '💳', currency: '¥' },
  { id: 'wall-visa', name: 'Thẻ Visa', balance: 5000, icon: '💳', currency: '¥' },
  { id: 'wall-bank', name: 'Ví Trả Sau (Nợ)', balance: -1500, icon: '🏦', currency: '¥' },
];

export const DEFAULT_GOALS: SavingsGoal[] = [
  { id: 'goal-car', name: 'Xe hơi mơ ước', target: 50000, current: 11000, icon: '🚗', color: '#FF708C' },
  { id: 'goal-laptop', name: 'Máy tính mới', target: 15000, current: 7500, icon: '💻', color: '#E8AEFF' },
  { id: 'goal-study', name: 'Học vấn tương lai', target: 30000, current: 28200, icon: '🎓', color: '#B9FBC0' },
];

export const DEFAULT_BUDGET: Budget = {
  month: '2026-07',
  limit: 20000,
};

export const DEFAULT_TRANSACTIONS: TransactionModel[] = [
  { id: 'tx-1', amount: 150, note: 'Ăn mì ramen ramen siêu ngon', date: '2026-07-07', categoryId: 'cat-food', walletId: 'wall-cash', type: 'expense' },
  { id: 'tx-2', amount: 35, note: 'Bắt tàu điện ngầm', date: '2026-07-07', categoryId: 'cat-transport', walletId: 'wall-cash', type: 'expense' },
  { id: 'tx-3', amount: 1200, note: 'Mua đầm lolita pastel siêu cưng', date: '2026-07-06', categoryId: 'cat-shopping', walletId: 'wall-mcard', type: 'expense' },
  { id: 'tx-4', amount: 25000, note: 'Lương tháng 7 bùng nổ', date: '2026-07-05', categoryId: 'cat-salary', walletId: 'wall-mcard', type: 'income' },
  { id: 'tx-5', amount: 450, note: 'Mua sách tiếng Nhật nâng cao', date: '2026-07-04', categoryId: 'cat-study', walletId: 'wall-visa', type: 'expense' },
  { id: 'tx-6', amount: 180, note: 'Vé xem phim hoạt hình Ghibli', date: '2026-07-03', categoryId: 'cat-entertainment', walletId: 'wall-cash', type: 'expense' },
  { id: 'tx-7', amount: 1200, note: 'Tiền đóng phí điện nước', date: '2026-07-02', categoryId: 'cat-home', walletId: 'wall-bank', type: 'expense' },
  { id: 'tx-8', amount: 3000, note: 'Tiền thưởng dự án xuất sắc', date: '2026-07-01', categoryId: 'cat-bonus', walletId: 'wall-mcard', type: 'income' },
];
