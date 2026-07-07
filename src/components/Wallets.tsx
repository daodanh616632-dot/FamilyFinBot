/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Wallet as WalletIcon, CreditCard, Landmark, DollarSign, Sparkles, Trash2, X, AlertCircle } from 'lucide-react';
import { Wallet } from '../types';

interface WalletsProps {
  wallets: Wallet[];
  onAddWallet: (wallet: Omit<Wallet, 'id'>) => void;
  onDeleteWallet: (id: string) => void;
  onUpdateWalletBalance: (id: string, amount: number) => void;
}

export default function Wallets({ wallets, onAddWallet, onDeleteWallet, onUpdateWalletBalance }: WalletsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletBalance, setNewWalletBalance] = useState('');
  const [newWalletIcon, setNewWalletIcon] = useState('ðŸ’µ');
  const [newWalletCurrency, setNewWalletCurrency] = useState('Â₫');

  // Math totals
  const totalAssets = wallets
    .filter(w => w.balance >= 0)
    .reduce((sum, w) => sum + w.balance, 0);

  const totalDebts = wallets
    .filter(w => w.balance < 0)
    .reduce((sum, w) => sum + Math.abs(w.balance), 0);

  const netAssets = totalAssets - totalDebts;

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) {
      alert('Vui lÃ²ng nháº­p tÃªn vÃ­ nhen! ðŸŒ¸');
      return;
    }
    const bal = parseFloat(newWalletBalance);
    if (isNaN(bal)) {
      alert('Vui lÃ²ng nháº­p sá»‘ dÆ° vÃ­ há»£p lá»‡! ðŸ¦');
      return;
    }

    onAddWallet({
      name: newWalletName.trim(),
      balance: bal,
      icon: newWalletIcon,
      currency: newWalletCurrency,
    });

    // Reset states
    setNewWalletName('');
    setNewWalletBalance('');
    setNewWalletIcon('ðŸ’µ');
    setNewWalletCurrency('Â₫');
    setShowAddModal(false);
  };

  const getIconComponent = (iconStr: string) => {
    // Return emoji directly or helper
    return <span className="text-2xl">{iconStr}</span>;
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* 1. Ná»­a trÃªn (Ná»n há»“ng bo gÃ³c dÆ°á»›i) - Net Wealth statistics */}
      <div className="bg-gradient-to-b from-kawaii-pink-200 to-kawaii-pink-100 pt-6 pb-12 px-4 rounded-b-[40px] border-b-4 border-kawaii-pink-300 shadow-md text-center">
        <div className="max-w-md mx-auto">
          <p className="text-xs font-display font-bold text-kawaii-pink-600 tracking-wider flex items-center justify-center gap-1">
            <Sparkles size={12} className="animate-pulse" /> TÃ€I Sáº¢N RÃ’NG HIá»†N Táº I
          </p>
          <h1 id="net-assets-display" className="text-3xl font-display font-extrabold text-kawaii-pink-600 mt-1 mb-4">
            Â₫{netAssets.toLocaleString()}
          </h1>

          {/* Asset vs Debt grid */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-white/60 p-3 rounded-2xl shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Tá»•ng tÃ i sáº£n ðŸ’µ</span>
              <span className="font-display font-bold text-emerald-600 text-md">
                +Â₫{totalAssets.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-white/60 p-3 rounded-2xl shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">MÃ³n ná»£ tá»•ng ðŸ¦</span>
              <span className="font-display font-bold text-gray-400 text-md">
                -Â₫{totalDebts.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ná»­a dÆ°á»›i: Danh sÃ¡ch cÃ¡c vÃ­ tiá»n */}
      <div className="max-w-md mx-auto px-4 mt-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-display font-bold text-kawaii-pink-600 flex items-center gap-1">
            ðŸ’³ Danh sÃ¡ch VÃ­ TÃ i Khoáº£n
          </h3>
          <button
            id="add-new-wallet-btn"
            onClick={() => setShowAddModal(true)}
            className="kawaii-button bg-white text-xs py-1 px-2.5 font-display flex items-center gap-1 text-kawaii-pink-500 hover:text-kawaii-pink-600"
          >
            <Plus size={14} /> ThÃªm VÃ­
          </button>
        </div>

        {/* List of wallets */}
        <div className="flex flex-col gap-3">
          {wallets.map(wallet => {
            const isDebt = wallet.balance < 0;
            return (
              <motion.div
                id={`wallet-row-${wallet.id}`}
                key={wallet.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="kawaii-card bg-white p-4 flex items-center justify-between gap-4 group hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-kawaii-pink-50 border border-kawaii-pink-200 flex items-center justify-center shrink-0 shadow-inner">
                    {getIconComponent(wallet.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-bold text-gray-700">{wallet.name}</h4>
                    <span className="text-[10px] bg-kawaii-pink-100 text-kawaii-pink-600 px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block">
                      {wallet.currency} CURRENCY
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className={`font-display font-bold text-lg ${
                      isDebt ? 'text-gray-400 font-semibold' : 'text-gray-800'
                    }`}>
                      {isDebt ? '-' : ''}Â₫{Math.abs(wallet.balance).toLocaleString()}
                    </p>
                    {isDebt && (
                      <span className="text-[9px] text-rose-400 font-semibold flex items-center gap-0.5 justify-end">
                        <AlertCircle size={8} /> Khoáº£n ná»£
                      </span>
                    )}
                  </div>

                  {/* Disable delete for default cash wallet to avoid breaking app state */}
                  {wallet.id !== 'wall-cash' && (
                    <button
                      id={`delete-wallet-btn-${wallet.id}`}
                      onClick={() => {
                        if (confirm(`Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a vÃ­ "${wallet.name}" khÃ´ng? ToÃ n bá»™ giao dá»‹ch liÃªn káº¿t sáº½ váº«n Ä‘Æ°á»£c lÆ°u.`)) {
                          onDeleteWallet(wallet.id);
                        }
                      }}
                      className="text-gray-300 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-colors opacity-10 md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Helpful Info Alert */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3.5 mt-4 flex gap-2.5 text-[11px] text-sky-800 leading-relaxed">
          <span>ðŸ›¡ï¸</span>
          <p>
            Máº¹o: Äá»ƒ theo dÃµi Ä‘Ãºng cÃ¡c tÃ i khoáº£n tÃ­n dá»₫ng tráº£ sau hoáº·c mua tráº£ gÃ³p, hÃ£y Ä‘áº·t <span className="font-bold">sá»‘ dÆ° Ã¢m (-)</span> cho vÃ­ nhÃ©. Há»‡ thá»‘ng sáº½ tá»± tÃ­nh lÃ  má»™t khoáº£n ná»£ vÃ  tá»± Ä‘á»™ng trá»« ra khá»i tÃ i sáº£n rÃ²ng cá»§a báº¡n nhen!
          </p>
        </div>
      </div>

      {/* Add Wallet Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-kawaii-pink-200 rounded-[32px] w-full max-w-sm p-6 shadow-2xl relative"
            >
              <button
                id="close-add-wallet-modal"
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <h3 className="font-display font-bold text-lg text-kawaii-pink-600 mb-4 flex items-center gap-1.5">
                ðŸŒ¸ ThÃªm VÃ­ Má»›i
              </h3>

              <form onSubmit={handleCreateWallet} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-display font-bold text-gray-500 block mb-1">TÃªn VÃ­ TÃ i Khoáº£n nhen:</label>
                  <input
                    id="new-wallet-name-input"
                    type="text"
                    placeholder="VÃ­ dá»₫: Tháº» JCB, Heo Äáº₫t..."
                    value={newWalletName}
                    onChange={e => setNewWalletName(e.target.value)}
                    className="w-full bg-kawaii-pink-50 border-2 border-kawaii-pink-100 focus:border-kawaii-pink-300 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[11px] font-display font-bold text-gray-500 block mb-1">Sá»‘ dÆ° hiá»‡n táº¡i (DÃ¹ng dáº₫u trá»« - náº¿u ná»£):</label>
                  <input
                    id="new-wallet-bal-input"
                    type="number"
                    placeholder="VÃ­ dá»₫: 50000 hoáº·c -1500"
                    value={newWalletBalance}
                    onChange={e => setNewWalletBalance(e.target.value)}
                    className="w-full bg-kawaii-pink-50 border-2 border-kawaii-pink-100 focus:border-kawaii-pink-300 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                  />
                </div>

                {/* Choose Emoji Icon Row */}
                <div>
                  <label className="text-[11px] font-display font-bold text-gray-500 block mb-1">Chá»n Icon VÃ­ CÆ°ng:</label>
                  <div className="flex gap-2 justify-between bg-kawaii-pink-50 p-2 rounded-xl border border-kawaii-pink-100">
                    {['ðŸ’µ', 'ðŸ’³', 'ðŸ¦', 'ðŸ·', 'ðŸ±', 'ðŸŽ’', 'ðŸŒŸ'].map(em => (
                      <button
                        type="button"
                        key={em}
                        onClick={() => setNewWalletIcon(em)}
                        className={`text-xl p-1 rounded-lg transition-transform ${
                          newWalletIcon === em ? 'bg-white scale-115 border border-kawaii-pink-300' : 'hover:scale-105'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="submit-create-wallet-btn"
                  type="submit"
                  className="kawaii-button kawaii-button-primary w-full py-2.5 text-xs font-display font-bold text-center mt-2"
                >
                  Táº¡o VÃ­ Má»›i âœ¨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
