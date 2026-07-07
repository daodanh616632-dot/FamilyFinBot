/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Trash2, TrendingUp, TrendingDown, Calendar, Percent, PiggyBank, Smile, Gift, Sparkles, X } from 'lucide-react';
import { Category, Wallet, TransactionModel, SavingsGoal, Budget } from '../types';

interface DashboardProps {
  categories: Category[];
  wallets: Wallet[];
  transactions: TransactionModel[];
  goals: SavingsGoal[];
  budget: Budget;
  onAddTransactionClick: () => void;
  onDeleteTransaction: (id: string) => void;
  onUpdateGoalProgress: (goalId: string, amount: number) => void;
  onUpdateBudgetLimit: (newLimit: number) => void;
}

export default function Dashboard({
  categories,
  wallets,
  transactions,
  goals,
  budget,
  onAddTransactionClick,
  onDeleteTransaction,
  onUpdateGoalProgress,
  onUpdateBudgetLimit,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalContribution, setGoalContribution] = useState('1000');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetLimit, setTempBudgetLimit] = useState(budget.limit.toString());

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Filtered transactions based on search
  const filteredTransactions = transactions.filter(t =>
    t.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Budget progress
  const budgetSpentPercent = Math.min(Math.round((totalExpense / budget.limit) * 100), 100);

  // Quick Action category helper
  const handleQuickAction = (label: string) => {
    if (label === 'Thêm') {
      onAddTransactionClick();
    } else {
      alert(`Bạn đã chọn sổ con: ${label}! Chúc bạn có một ngày tràn ngập niềm vui nha! 🥰🌸`);
    }
  };

  const handleGoalContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId) return;
    const amount = parseFloat(goalContribution);
    if (isNaN(amount) || amount <= 0) {
      alert('Vui lòng nhập số tiền đóng góp hợp lệ lớn hơn 0 nhé! 💖');
      return;
    }
    onUpdateGoalProgress(selectedGoalId, amount);
    setSelectedGoalId(null);
    setGoalContribution('1000');
  };

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudgetLimit);
    if (!isNaN(val) && val > 0) {
      onUpdateBudgetLimit(val);
      setIsEditingBudget(false);
    } else {
      alert('Vui lòng nhập giới hạn ngân sách hợp lệ nhen! ✨');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* 1. Header (Màu hồng pastel bo góc dưới dạng Sóng hoặc ClipPath) */}
      <div className="relative bg-gradient-to-b from-kawaii-pink-200 to-kawaii-pink-100 pt-6 pb-16 px-4 rounded-b-[40px] border-b-4 border-kawaii-pink-300 shadow-md">
        
        {/* Top bar with Search & Cute Title */}
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-display font-medium text-kawaii-pink-600 flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse text-kawaii-yellow" />
                MOMO KAKEIBO • NHẬT KÝ CHI TIÊU
              </p>
              <h1 id="app-title-main" className="text-2xl font-display font-bold text-kawaii-pink-600">Sổ cái mặc định 📓</h1>
            </div>
            
            {/* Cute Avatar or Mascot */}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-kawaii-pink-100 flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer" title="Cá nhân">
              🐰
            </div>
          </div>

          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-kawaii-pink-400" size={18} />
            <input
              id="dashboard-search-bar"
              type="text"
              placeholder="Tìm kiếm ghi chú giao dịch... 🔍🌸"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 border-2 border-kawaii-pink-200 focus:border-kawaii-pink-400 focus:bg-white rounded-full pl-10 pr-4 py-2 text-sm text-gray-700 outline-none transition-all shadow-inner"
            />
          </div>

          {/* 4 Cute Circular Quick Actions */}
          <div className="flex justify-around items-center mt-3 bg-white/40 p-2.5 rounded-2xl border border-white/40 backdrop-blur-sm">
            {[
              { id: 'btn-qa-babe', icon: '💖', label: 'Babe' },
              { id: 'btn-qa-travel', icon: '🎒', label: 'Travel' },
              { id: 'btn-qa-ledger', icon: '📓', label: 'Sổ cái' },
              { id: 'btn-qa-add', icon: '➕', label: 'Thêm', highlight: true },
            ].map(act => (
              <button
                id={act.id}
                key={act.label}
                onClick={() => handleQuickAction(act.label)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl shadow-md transition-all duration-200 ${
                  act.highlight
                    ? 'bg-kawaii-pink-400 border-kawaii-pink-500 hover:bg-kawaii-pink-500 hover:scale-110 text-white'
                    : 'bg-white border-kawaii-pink-200 hover:border-kawaii-pink-400 hover:scale-105'
                }`}>
                  <span className={act.highlight ? "" : "group-hover:scale-115 transition-transform"}>{act.icon}</span>
                </div>
                <span className="text-[11px] font-display font-medium text-kawaii-pink-600">
                  {act.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Balance Card (White, overlaying the header) */}
      <div className="max-w-md mx-auto px-4 -mt-10 relative z-10">
        <div className="kawaii-card bg-white p-5 relative overflow-hidden">
          
          {/* Subtle line chart overlay background */}
          <div className="absolute inset-x-0 bottom-0 h-16 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,15 Q20,2 40,12 T80,4 T100,10 L100,20 L0,20 Z"
                fill="#B9FBC0"
                stroke="#B9FBC0"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 bg-kawaii-pink-50 border border-kawaii-pink-100 rounded-full px-2.5 py-0.5 text-xs text-kawaii-pink-600 font-medium">
              <Calendar size={12} />
              <span>Tháng 7/2026</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Tháng này của bạn 🌸</span>
          </div>

          <div className="grid grid-cols-2 gap-4 divide-x divide-gray-100 mb-2">
            <div>
              <p className="text-[11px] text-gray-400 font-medium flex items-center gap-0.5">
                <TrendingUp size={11} className="text-emerald-400" /> Tổng Thu Nhập
              </p>
              <p className="font-display font-bold text-lg text-emerald-500">
                +¥{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="pl-4">
              <p className="text-[11px] text-gray-400 font-medium flex items-center gap-0.5">
                <TrendingDown size={11} className="text-rose-400" /> Tổng Chi Tiêu
              </p>
              <p className="font-display font-bold text-lg text-rose-400">
                -¥{totalExpense.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-kawaii-pink-100 pt-3 flex items-center justify-between">
            <span className="text-xs font-display font-medium text-gray-500">SỐ DƯ HIỆN TẠI:</span>
            <span className={`font-display font-bold text-xl px-2.5 py-0.5 rounded-full ${
              netBalance >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-500 border border-rose-200'
            }`}>
              ¥{netBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-md mx-auto px-4 mt-5 flex flex-col gap-5">
        
        {/* 3. Monthly Budget Section */}
        <div className="kawaii-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-display font-bold text-gray-600 flex items-center gap-1.5">
                📋 Hạn Mức Ngân Sách Tháng
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Đặt mức giới hạn chi tiêu để giữ bóp nhen!</p>
            </div>
            
            <div className="text-right">
              {isEditingBudget ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={tempBudgetLimit}
                    onChange={e => setTempBudgetLimit(e.target.value)}
                    className="w-16 border border-kawaii-pink-300 rounded px-1 py-0.5 text-xs text-center"
                  />
                  <button onClick={handleSaveBudget} className="text-emerald-500 text-xs font-bold">Lưu</button>
                  <button onClick={() => setIsEditingBudget(false)} className="text-gray-400 text-xs">Hủy</button>
                </div>
              ) : (
                <button
                  id="edit-budget-btn"
                  onClick={() => {
                    setTempBudgetLimit(budget.limit.toString());
                    setIsEditingBudget(true);
                  }}
                  className="text-[11px] font-display font-semibold text-kawaii-pink-500 hover:underline"
                >
                  Sửa: ¥{budget.limit.toLocaleString()}
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-kawaii-pink-50 border-2 border-kawaii-pink-100 h-6 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetSpentPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full flex items-center justify-end pr-2 font-display text-[10px] font-bold ${
                budgetSpentPercent > 85 ? 'bg-gradient-to-r from-rose-300 to-rose-400 text-white' : 'bg-gradient-to-r from-kawaii-pink-200 to-kawaii-pink-300 text-kawaii-pink-600'
              }`}
            >
              {budgetSpentPercent}%
            </motion.div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium mt-1.5 px-1">
            <span>Đã tiêu: ¥{totalExpense.toLocaleString()}</span>
            <span>Còn lại: ¥{Math.max(0, budget.limit - totalExpense).toLocaleString()}</span>
          </div>
        </div>

        {/* 4. Savings Goals Section */}
        <div>
          <h3 className="text-sm font-display font-bold text-kawaii-pink-600 mb-2 px-1 flex items-center gap-1">
            ⭐ Mục tiêu tiết kiệm dễ thương
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {goals.map(goal => {
              const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
              return (
                <button
                  id={`goal-card-${goal.id}`}
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className="kawaii-card p-3 flex flex-col items-center justify-between text-center bg-white hover:scale-102 cursor-pointer relative group"
                >
                  <span className="text-3xl animate-kawaii-bounce duration-[1.5s]" style={{ animationDelay: `${Math.random()}s` }}>
                    {goal.icon}
                  </span>
                  
                  <div className="mt-2 w-full">
                    <p className="text-[10px] font-display font-semibold text-gray-600 truncate w-full">
                      {goal.name}
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: goal.color }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 mt-1 block">
                      {pct}% ({goal.current / 1000}k/{goal.target / 1000}k)
                    </span>
                  </div>

                  <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-kawaii-pink-400 text-white text-[8px] rounded px-1">
                    + Gửi
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Goal Contribution Modal/Popover */}
        <AnimatePresence>
          {selectedGoalId && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="kawaii-card bg-white p-4 border-2 border-kawaii-pink-300 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-display font-semibold text-kawaii-pink-600 flex items-center gap-1">
                  🎯 Tiết kiệm cho: {goals.find(g => g.id === selectedGoalId)?.name}
                </span>
                <button onClick={() => setSelectedGoalId(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleGoalContributionSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-mono">¥</span>
                  <input
                    id="goal-contrib-input"
                    type="number"
                    placeholder="Số tiền gửi..."
                    value={goalContribution}
                    onChange={e => setGoalContribution(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 bg-kawaii-pink-50 border border-kawaii-pink-200 rounded-lg text-xs outline-none"
                    autoFocus
                  />
                </div>
                <button
                  id="goal-contrib-submit"
                  type="submit"
                  className="bg-kawaii-pink-400 hover:bg-kawaii-pink-500 text-white text-xs font-bold px-3 py-1 rounded-lg transition-colors"
                >
                  Gửi heo 🐷
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Transaction History List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-display font-bold text-kawaii-pink-600 flex items-center gap-1.5">
              🌸 Nhật Ký Giao Dịch Gần Đây
            </h3>
            <span className="text-[10px] font-mono text-gray-400">
              {filteredTransactions.length} giao dịch
            </span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="kawaii-card p-6 bg-white text-center flex flex-col items-center gap-2">
              <span className="text-3xl">🐱💤</span>
              <p className="text-xs text-gray-400 font-medium">Chưa có giao dịch nào hết đó nhen!</p>
              <button
                onClick={onAddTransactionClick}
                className="kawaii-button kawaii-button-primary text-xs py-1.5 px-4 font-display flex items-center gap-1 mt-1"
              >
                <Plus size={14} /> Ghi chép ngay
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredTransactions.map(tx => {
                const cat = categories.find(c => c.id === tx.categoryId);
                const wall = wallets.find(w => w.id === tx.walletId);
                return (
                  <motion.div
                    layout
                    id={`tx-row-${tx.id}`}
                    key={tx.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border-2 border-kawaii-pink-100 p-3 flex items-center justify-between gap-3 hover:border-kawaii-pink-300 transition-colors shadow-sm relative group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Icon Circle */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white"
                        style={{ backgroundColor: cat?.color || '#FFE4E9' }}
                      >
                        {cat?.icon || '🌸'}
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-700 truncate">{tx.note}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400 font-medium">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span className="bg-gray-100 text-gray-500 px-1 rounded truncate max-w-[80px]">
                            {wall?.icon} {wall?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-display font-bold text-sm shrink-0 ${
                        tx.type === 'income' ? 'text-emerald-500' : 'text-rose-400'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}¥{tx.amount.toLocaleString()}
                      </span>
                      
                      {/* Deletion btn */}
                      <button
                        id={`tx-delete-${tx.id}`}
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa giao dịch siêu dễ thương này không? 🥺')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="text-gray-300 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors opacity-10 md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Xóa giao dịch"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
