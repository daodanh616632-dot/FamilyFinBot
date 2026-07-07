/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, PieChart, Wallet as WalletIcon, Plus, Sparkles } from 'lucide-react';

import { Category, Wallet, TransactionModel, SavingsGoal, Budget } from './types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_WALLETS,
  DEFAULT_GOALS,
  DEFAULT_BUDGET,
  DEFAULT_TRANSACTIONS,
} from './data/defaultData';

import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Wallets from './components/Wallets';
import ExpenseNumpad from './components/ExpenseNumpad';

export default function App() {
  // -----------------------------------------
  // 1. Initial State Loaders from LocalStorage
  // -----------------------------------------
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('kakeibo_wallets');
    return saved ? JSON.parse(saved) : DEFAULT_WALLETS;
  });

  const [transactions, setTransactions] = useState<TransactionModel[]>(() => {
    const saved = localStorage.getItem('kakeibo_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('kakeibo_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [budget, setBudget] = useState<Budget>(() => {
    const saved = localStorage.getItem('kakeibo_budget');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGET;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'wallets'>('dashboard');
  const [showNumpad, setShowNumpad] = useState(false);

  // -----------------------------------------
  // 2. Synchronize States with LocalStorage
  // -----------------------------------------
  useEffect(() => {
    localStorage.setItem('kakeibo_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('kakeibo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kakeibo_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('kakeibo_budget', JSON.stringify(budget));
  }, [budget]);

  // -----------------------------------------
  // 3. State Modifier Functions (Logic)
  // -----------------------------------------

  // Save transaction added from Numpad
  const handleSaveTransaction = (newTxData: Omit<TransactionModel, 'id'>) => {
    const newTx: TransactionModel = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };

    // Update the associated wallet's balance
    setWallets(prevWallets =>
      prevWallets.map(w => {
        if (w.id === newTx.walletId) {
          const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
          return { ...w, balance: w.balance + delta };
        }
        return w;
      })
    );

    // Add to transaction list
    setTransactions(prev => [newTx, ...prev]);
    setShowNumpad(false);
  };

  // Delete transaction & reverse balance effect
  const handleDeleteTransaction = (id: string) => {
    const targetTx = transactions.find(t => t.id === id);
    if (!targetTx) return;

    // Reverse wallet balance effect
    setWallets(prevWallets =>
      prevWallets.map(w => {
        if (w.id === targetTx.walletId) {
          // If deleted transaction was income, subtract it from balance; if expense, add it back.
          const delta = targetTx.type === 'income' ? -targetTx.amount : targetTx.amount;
          return { ...w, balance: w.balance + delta };
        }
        return w;
      })
    );

    // Filter transaction list
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Add a new wallet
  const handleAddWallet = (newWalletData: Omit<Wallet, 'id'>) => {
    const newWallet: Wallet = {
      ...newWalletData,
      id: `wall-${Date.now()}`,
    };
    setWallets(prev => [...prev, newWallet]);
  };

  // Delete an existing wallet
  const handleDeleteWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  // Contribute to a savings goal (deducting from main Cash Wallet)
  const handleUpdateGoalProgress = (goalId: string, amount: number) => {
    const cashWallet = wallets.find(w => w.id === 'wall-cash') || wallets[0];
    
    if (cashWallet.balance < amount) {
      alert(`Số dư trong ví "${cashWallet.name}" không đủ (hiện có ¥${cashWallet.balance}) để chuyển khoản đút heo nhen! Bạn có thể nạp thêm tiền hoặc chỉnh sửa số dư ví trước nha! 🥺`);
      return;
    }

    // 1. Subtract balance from cash wallet
    setWallets(prevWallets =>
      prevWallets.map(w => {
        if (w.id === cashWallet.id) {
          return { ...w, balance: w.balance - amount };
        }
        return w;
      })
    );

    // 2. Add progress to goal
    setGoals(prevGoals =>
      prevGoals.map(g => {
        if (g.id === goalId) {
          return { ...g, current: Math.min(g.current + amount, g.target) };
        }
        return g;
      })
    );

    // 3. Create a transaction for this savings contribution (so users see where the money went!)
    const savingsCategory = categories.find(c => c.id === 'cat-home') || categories[0];
    const savingsTx: TransactionModel = {
      id: `tx-goal-${Date.now()}`,
      amount,
      note: `Gửi ống heo tiết kiệm: ${goals.find(g => g.id === goalId)?.name} 🐷🌟`,
      date: new Date().toISOString().split('T')[0],
      categoryId: savingsCategory.id,
      walletId: cashWallet.id,
      type: 'expense',
    };
    setTransactions(prev => [savingsTx, ...prev]);

    alert(`Đã trích ¥${amount.toLocaleString()} từ ví "${cashWallet.name}" để đút heo tiết kiệm thành công! Thật tuyệt vời! 🎉🌸`);
  };

  // Edit budget limit
  const handleUpdateBudgetLimit = (newLimit: number) => {
    setBudget(prev => ({ ...prev, limit: newLimit }));
  };

  // -----------------------------------------
  // 4. Render Active View Helper
  // -----------------------------------------
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            categories={categories}
            wallets={wallets}
            transactions={transactions}
            goals={goals}
            budget={budget}
            onAddTransactionClick={() => setShowNumpad(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onUpdateBudgetLimit={handleUpdateBudgetLimit}
          />
        );
      case 'analytics':
        return <Analytics categories={categories} transactions={transactions} />;
      case 'wallets':
        return (
          <Wallets
            wallets={wallets}
            onAddWallet={handleAddWallet}
            onDeleteWallet={handleDeleteWallet}
            onUpdateWalletBalance={(id, amount) => {
              setWallets(prev =>
                prev.map(w => (w.id === id ? { ...w, balance: amount } : w))
              );
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-kawaii-pink-50 text-gray-700 flex flex-col antialiased">
      {/* Decorative top ambient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-kawaii-pink-200 via-kawaii-pink-400 to-kawaii-purple z-40" />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden max-w-md mx-auto w-full bg-white md:shadow-xl md:border-x-4 md:border-kawaii-pink-200">
        
        {/* Render selected screen component */}
        {renderView()}

        {/* -----------------------------------------
            5. Floating Kawaii Bottom Navigation Bar
            ----------------------------------------- */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-kawaii-pink-100 px-6 py-2 pb-5 flex justify-between items-center max-w-md mx-auto shadow-[0_-5px_15px_rgba(255,181,197,0.15)] rounded-t-[28px]">
          
          {/* Tab 1: Dashboard */}
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 transition-all relative ${
              activeTab === 'dashboard' ? 'text-kawaii-pink-500 scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home size={22} className={activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[2]'} />
            <span className="text-[10px] font-display font-bold">Tổng quan</span>
            {activeTab === 'dashboard' && (
              <motion.span layoutId="activeDot" className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-kawaii-pink-400" />
            )}
          </button>

          {/* Tab 2: Analytics */}
          <button
            id="nav-tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 py-1 transition-all relative ${
              activeTab === 'analytics' ? 'text-kawaii-pink-500 scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <PieChart size={22} className={activeTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-[2]'} />
            <span className="text-[10px] font-display font-bold">Phân tích</span>
            {activeTab === 'analytics' && (
              <motion.span layoutId="activeDot" className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-kawaii-pink-400" />
            )}
          </button>

          {/* Center Giant Add Button Floating Above Nav */}
          <div className="relative -mt-8 flex justify-center items-center">
            <button
              id="floating-add-expense-btn"
              onClick={() => setShowNumpad(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-kawaii-pink-400 to-kawaii-pink-300 border-3 border-white shadow-lg flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 hover:rotate-90 transition-all duration-300 z-50"
              title="Ghi chép chi tiêu mới"
            >
              <Plus size={28} className="stroke-[3]" />
            </button>
            {/* Cute pulsating background glow bubble */}
            <div className="absolute w-14 h-14 rounded-full bg-kawaii-pink-200 opacity-40 animate-ping pointer-events-none -z-10" />
          </div>

          {/* Spacer to balance center floating button layout */}
          <div className="w-10" />

          {/* Tab 3: Wallets */}
          <button
            id="nav-tab-wallets"
            onClick={() => setActiveTab('wallets')}
            className={`flex flex-col items-center gap-1 py-1 transition-all relative ${
              activeTab === 'wallets' ? 'text-kawaii-pink-500 scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <WalletIcon size={22} className={activeTab === 'wallets' ? 'stroke-[2.5]' : 'stroke-[2]'} />
            <span className="text-[10px] font-display font-bold">Ví tiền</span>
            {activeTab === 'wallets' && (
              <motion.span layoutId="activeDot" className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-kawaii-pink-400" />
            )}
          </button>

        </nav>
      </main>

      {/* -----------------------------------------
          6. Numpad Input Screen (Overlay)
          ----------------------------------------- */}
      <AnimatePresence>
        {showNumpad && (
          <ExpenseNumpad
            categories={categories}
            wallets={wallets}
            onSave={handleSaveTransaction}
            onClose={() => setShowNumpad(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
