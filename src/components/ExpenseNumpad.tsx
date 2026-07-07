/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, Delete, Plus, Minus, X, ArrowLeft, Wallet as WalletIcon } from 'lucide-react';
import { Category, Wallet, TransactionModel } from '../types';

interface ExpenseNumpadProps {
  categories: Category[];
  wallets: Wallet[];
  onSave: (transaction: Omit<TransactionModel, 'id'>) => void;
  onClose: () => void;
}

export default function ExpenseNumpad({ categories, wallets, onSave, onClose }: ExpenseNumpadProps) {
  // Main states
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories.find(c => c.type === 'expense') || categories[0]
  );
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(wallets[0]);
  const [note, setNote] = useState('');
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter categories by type
  const filteredCategories = categories.filter(c => c.type === transactionType);

  // Set default category when type switches
  const handleTypeChange = (type: 'expense' | 'income') => {
    setTransactionType(type);
    const firstCat = categories.find(c => c.type === type);
    if (firstCat) setSelectedCategory(firstCat);
  };

  // Safe Math Evaluator for Simple Expressions
  const evaluateExpression = (expr: string): string => {
    try {
      // Replace safe math operators
      let sanitized = expr.replace(/Ã—/g, '*').replace(/Ã·/g, '/');
      // Only allow math chars
      if (!/^[0-9.+\-*/\s()]+$/.test(sanitized)) {
        return 'Error';
      }
      // Evaluate safely
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      if (result === undefined || isNaN(result) || !isFinite(result)) {
        return '0';
      }
      // Rounded to 2 decimals if needed
      return Number(result.toFixed(2)).toString();
    } catch {
      return 'Error';
    }
  };

  // Numpad Key Press Handler
  const handleKeyPress = (key: string) => {
    if (key === 'âŒ«') {
      if (expression.length <= 1) {
        setExpression('');
        setDisplayValue('0');
      } else {
        const nextExpr = expression.slice(0, -1);
        setExpression(nextExpr);
        // If it ends with an operator, display the evaluated part, or display current expr
        if (['+', '-', 'Ã—', 'Ã·'].includes(nextExpr.slice(-1))) {
          setDisplayValue(nextExpr);
        } else {
          // Just update display or evaluate
          setDisplayValue(nextExpr || '0');
        }
      }
    } else if (key === '=') {
      if (expression) {
        const evaluated = evaluateExpression(expression);
        if (evaluated !== 'Error') {
          setDisplayValue(evaluated);
          setExpression(evaluated);
        } else {
          setDisplayValue('Lá»—i math ðŸ˜…');
        }
      }
    } else if (['+', '-', 'Ã—', 'Ã·'].includes(key)) {
      // Prevent double operators
      if (expression === '' && key === '-') {
        setExpression('-');
        setDisplayValue('-');
        return;
      }
      if (expression === '' || ['+', '-', 'Ã—', 'Ã·'].includes(expression.slice(-1))) {
        return;
      }
      setExpression(prev => prev + key);
      setDisplayValue(prev => prev + ' ' + key + ' ');
    } else if (key === '.') {
      // Simple decimal point logic
      const parts = expression.split(/[+\-Ã—Ã·]/);
      const currentPart = parts[parts.length - 1];
      if (currentPart.includes('.')) return;
      setExpression(prev => prev + '.');
      setDisplayValue(prev => prev + '.');
    } else {
      // Digit typed
      if (expression === '0') {
        setExpression(key);
        setDisplayValue(key);
      } else {
        setExpression(prev => prev + key);
        setDisplayValue(prev => (prev === '0' ? key : prev + key));
      }
    }
  };

  // Confirm save
  const handleConfirm = () => {
    // Evaluate if expression has pending operations
    let finalAmountString = expression;
    if (['+', '-', 'Ã—', 'Ã·'].includes(expression.slice(-1))) {
      finalAmountString = expression.slice(0, -1);
    }
    const evaluated = evaluateExpression(finalAmountString);
    const amountNum = parseFloat(evaluated);

    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Vui lÃ²ng nháº­p sá»‘ tiá»n há»£p lá»‡ lá»›n hÆ¡n 0 nha! ðŸ₫°');
      return;
    }

    onSave({
      amount: amountNum,
      note: note.trim() || `Giao dá»‹ch ${selectedCategory.name}`,
      date,
      categoryId: selectedCategory.id,
      walletId: selectedWallet.id,
      type: transactionType,
    });
  };

  return (
    <div id="expense-numpad-screen" className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4">
      {/* Background click closes */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-kawaii-pink-50 border-t-4 md:border-4 border-kawaii-pink-200 rounded-t-[32px] md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-none"
      >
        {/* Header bar */}
        <div className="bg-kawaii-pink-100 px-6 py-4 flex items-center justify-between border-b-2 border-kawaii-pink-200">
          <button
            id="close-numpad-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-white/50 rounded-full transition-colors text-kawaii-pink-500"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-display font-semibold text-lg text-kawaii-pink-600">Ghi ChÃ©p Chi TiÃªu âœ¨</span>
          <div className="w-8" /> {/* Balance spacer */}
        </div>

        {/* Expense/Income Toggle tabs */}
        <div className="p-4 pb-2 flex justify-center">
          <div className="bg-white/80 p-1 rounded-2xl border-2 border-kawaii-pink-200 flex gap-1 w-full max-w-[280px]">
            <button
              id="tab-type-expense"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-1.5 rounded-xl font-display text-sm font-medium transition-all ${
                transactionType === 'expense'
                  ? 'bg-kawaii-pink-400 text-white shadow-sm'
                  : 'text-gray-500 hover:text-kawaii-pink-400'
              }`}
            >
              ðŸ’¸ Chi tiÃªu
            </button>
            <button
              id="tab-type-income"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-1.5 rounded-xl font-display text-sm font-medium transition-all ${
                transactionType === 'income'
                  ? 'bg-kawaii-mint text-emerald-800 shadow-sm border-emerald-100 border'
                  : 'text-gray-500 hover:text-emerald-500'
              }`}
            >
              ðŸ’° Thu nháº­p
            </button>
          </div>
        </div>

        {/* Scrolling Category Selection */}
        <div className="px-4 py-2">
          <p className="text-xs font-display font-medium text-kawaii-pink-500 mb-1 px-1">Chá»n danh má»₫c:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {filteredCategories.map(cat => (
              <button
                id={`cat-select-${cat.id}`}
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-2xl border-2 transition-all ${
                  selectedCategory.id === cat.id
                    ? 'bg-white border-kawaii-pink-400 shadow-[2px_2px_0px_#FF708C] scale-105'
                    : 'bg-white/60 border-kawaii-pink-100 hover:bg-white hover:border-kawaii-pink-200'
                }`}
              >
                <span className="text-2xl animate-kawaii-bounce duration-1000" style={{ animationDelay: `${Math.random()}s` }}>
                  {cat.icon}
                </span>
                <span className="text-[11px] font-medium font-sans text-gray-700 truncate w-full text-center">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input fields panel (Note & Value Display) */}
        <div className="bg-white mx-4 p-4 rounded-2xl border-3 border-kawaii-pink-200 flex flex-col gap-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-kawaii-pink-100 pb-2">
            <input
              id="note-input-field"
              type="text"
              placeholder="Nháº­p ghi chÃº... ðŸ“ðŸŒ¸"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 font-sans w-full focus:ring-0"
            />
            {note && (
              <button onClick={() => setNote('')} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Wallet Selection Dropdown */}
            <div className="relative">
              <button
                id="select-wallet-btn"
                className="flex items-center gap-1.5 px-2.5 py-1 bg-kawaii-pink-50 hover:bg-kawaii-pink-100 border border-kawaii-pink-200 rounded-full text-xs text-kawaii-pink-600 font-medium transition-colors"
                onClick={() => {}} // Simple toggle wallet cycler for smooth UX
                title="Thay Ä‘á»•i vÃ­"
              >
                <WalletIcon size={12} />
                <span>{selectedWallet.name}</span>
                <span className="text-[10px] text-gray-400">
                  ({selectedWallet.currency}{selectedWallet.balance})
                </span>
              </button>
              <div className="flex gap-1 mt-1">
                {wallets.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWallet(w)}
                    className={`text-[10px] px-1.5 py-0.5 rounded-md border ${
                      selectedWallet.id === w.id
                        ? 'bg-kawaii-pink-100 text-kawaii-pink-600 border-kawaii-pink-300 font-semibold'
                        : 'bg-white text-gray-500 border-gray-100'
                    }`}
                  >
                    {w.icon} {w.name.split(' ').slice(-1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Display values with fredoka */}
            <div className="text-right">
              <span className="text-xs font-mono text-gray-400 block h-4">{expression}</span>
              <span className="font-display font-semibold text-2xl text-kawaii-pink-500 break-all">
                Â₫{displayValue}
              </span>
            </div>
          </div>
        </div>

        {/* Date Selector Banner */}
        <div className="px-4 py-1.5 flex justify-between items-center text-xs font-medium text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-kawaii-pink-400" />
            <span>NgÃ y giao dá»‹ch:</span>
            <input
              id="tx-date-picker"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-white border border-kawaii-pink-200 rounded-md px-1.5 py-0.5 text-xs text-gray-700 font-mono focus:outline-none"
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setDate(new Date().toISOString().split('T')[0])}
              className="px-1.5 py-0.5 rounded bg-kawaii-pink-100 hover:bg-kawaii-pink-200 text-kawaii-pink-600 text-[10px]"
            >
              HÃ´m nay
            </button>
            <button
              onClick={() => {
                const prev = new Date();
                prev.setDate(prev.getDate() - 1);
                setDate(prev.toISOString().split('T')[0]);
              }}
              className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px]"
            >
              HÃ´m qua
            </button>
          </div>
        </div>

        {/* Custom Numpad Keyboard */}
        <div className="bg-kawaii-pink-100 p-4 pt-3 border-t-2 border-kawaii-pink-200 grid grid-cols-4 gap-2.5 pb-6">
          {/* Row 1 */}
          <button onClick={() => handleKeyPress('7')} className="kawaii-button py-3 text-lg font-display text-gray-700">7</button>
          <button onClick={() => handleKeyPress('8')} className="kawaii-button py-3 text-lg font-display text-gray-700">8</button>
          <button onClick={() => handleKeyPress('9')} className="kawaii-button py-3 text-lg font-display text-gray-700">9</button>
          <button onClick={() => handleKeyPress('Ã·')} className="kawaii-button kawaii-button-primary py-3 text-lg font-display">Ã·</button>

          {/* Row 2 */}
          <button onClick={() => handleKeyPress('4')} className="kawaii-button py-3 text-lg font-display text-gray-700">4</button>
          <button onClick={() => handleKeyPress('5')} className="kawaii-button py-3 text-lg font-display text-gray-700">5</button>
          <button onClick={() => handleKeyPress('6')} className="kawaii-button py-3 text-lg font-display text-gray-700">6</button>
          <button onClick={() => handleKeyPress('Ã—')} className="kawaii-button kawaii-button-primary py-3 text-lg font-display">Ã—</button>

          {/* Row 3 */}
          <button onClick={() => handleKeyPress('1')} className="kawaii-button py-3 text-lg font-display text-gray-700">1</button>
          <button onClick={() => handleKeyPress('2')} className="kawaii-button py-3 text-lg font-display text-gray-700">2</button>
          <button onClick={() => handleKeyPress('3')} className="kawaii-button py-3 text-lg font-display text-gray-700">3</button>
          <button onClick={() => handleKeyPress('-')} className="kawaii-button kawaii-button-primary py-3 text-lg font-display">-</button>

          {/* Row 4 */}
          <button onClick={() => handleKeyPress('.')} className="kawaii-button py-3 text-lg font-display text-gray-700">.</button>
          <button onClick={() => handleKeyPress('0')} className="kawaii-button py-3 text-lg font-display text-gray-700">0</button>
          <button onClick={() => handleKeyPress('âŒ«')} className="kawaii-button py-3 text-lg font-display text-gray-500 flex items-center justify-center">
            <Delete size={20} />
          </button>
          <button onClick={() => handleKeyPress('+')} className="kawaii-button kawaii-button-primary py-3 text-lg font-display">+</button>

          {/* Row 5: Large Today, Equals, and Submit check button */}
          <button
            onClick={() => {
              const formattedDate = new Date().toISOString().split('T')[0];
              setDate(formattedDate);
              alert('ÄÃ£ Ä‘áº·t ngÃ y vá» HÃ´m nay! ðŸ“…âœ¨');
            }}
            className="kawaii-button col-span-1 py-3 text-xs font-display flex flex-col items-center justify-center text-kawaii-pink-500 bg-white"
          >
            <Calendar size={14} className="mb-0.5" />
            TODAY
          </button>
          <button onClick={() => handleKeyPress('=')} className="kawaii-button py-3 text-lg font-display text-gray-700 bg-kawaii-yellow border-amber-300 text-amber-900">=</button>
          <button
            id="numpad-confirm-btn"
            onClick={handleConfirm}
            className="kawaii-button col-span-2 bg-kawaii-mint border-emerald-300 hover:border-emerald-400 py-3 text-emerald-800 font-display font-semibold flex items-center justify-center gap-2"
          >
            <Check size={20} className="stroke-[3]" />
            XÃC NHáº¬N âœ¨
          </button>
        </div>
      </motion.div>
    </div>
  );
}
