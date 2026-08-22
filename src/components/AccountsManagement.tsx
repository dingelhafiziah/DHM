import React, { useState } from 'react';
import { 
  Landmark, ArrowLeftRight, Plus, Wallet, 
  Building2, Smartphone, ShieldCheck, CheckCircle2, 
  ArrowUpRight, ArrowDownRight, History, Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Account } from '../types';

export const AccountsManagement: React.FC = () => {
  const { 
    accounts, 
    transfers, 
    settings, 
    currentUser, 
    addAccount, 
    transferFunds, 
    showToast 
  } = useApp();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Transfer state
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState(5000);
  const [transferReason, setTransferReason] = useState('ক্যাশ কাউন্টার থেকে ব্যাংক অ্যাকাউন্টে জমা');

  // Add Account state
  const [newAccName, setNewAccName] = useState('');
  const [newAccNameBn, setNewAccNameBn] = useState('');
  const [newAccType, setNewAccType] = useState<'cash' | 'bank' | 'mfs' | 'fund'>('bank');
  const [newAccNumber, setNewAccNumber] = useState('');
  const [newAccBankName, setNewAccBankName] = useState('');
  const [newAccBalance, setNewAccBalance] = useState(0);

  const totalFundBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAccountId === toAccountId) {
      showToast('Source and destination accounts must be different.', 'error');
      return;
    }
    if (transferAmount <= 0) {
      showToast('Please enter a valid transfer amount.', 'error');
      return;
    }

    transferFunds(fromAccountId, toAccountId, Number(transferAmount), transferReason);
    setIsTransferModalOpen(false);
  };

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) {
      showToast('Account name is required.', 'error');
      return;
    }

    addAccount({
      name: newAccName,
      nameBn: newAccNameBn || newAccName,
      type: newAccType,
      accountNumber: newAccNumber,
      bankName: newAccBankName,
      balance: Number(newAccBalance) || 0,
      description: 'New Madrasa ledger account',
    });

    setIsAddAccountModalOpen(false);
  };

  return (
    <div id="accounts-management-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-700" />
            হিসাব ও তহবিল ব্যবস্থাপনা (Accounts & Funds)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            মাদরাসার নগদ ক্যাশ, ব্যাংক অ্যাকাউন্ট, বিকাশ/নগদ ও যাকাত তহবিলের স্থিতি ও ফান্ড ট্রান্সফার
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            <span>ফান্ড ট্রান্সফার (Transfer)</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন অ্যাকাউন্ট যোগ</span>
            </button>
          )}
        </div>
      </div>

      {/* Total Balance Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border border-teal-800/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            মাদরাসা সর্বমোট নগদ ও ব্যাংক স্থিতি (Net Total Balance)
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {settings.currencySymbol}{totalFundBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-300">
            সর্বমোট {accounts.length} টি সক্রিয় লেজার অ্যাকাউন্টে সংরক্ষিত অর্থ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
            <span className="text-slate-300 block">হাতে নগদ (Cash)</span>
            <span className="text-base font-bold text-emerald-300">
              ৳{accounts.filter(a => a.type === 'cash').reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
            <span className="text-slate-300 block">ব্যাংক মোট (Bank)</span>
            <span className="text-base font-bold text-teal-300">
              {settings.currencySymbol}{accounts.filter(a => a.type === 'bank').reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
            <span className="text-slate-300 block">যাকাত ও নির্দিষ্ট ফান্ড</span>
            <span className="text-base font-bold text-amber-300">
              {settings.currencySymbol}{accounts.filter(a => a.type === 'fund').reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const getIcon = () => {
            if (acc.type === 'cash') return Wallet;
            if (acc.type === 'bank') return Building2;
            if (acc.type === 'mfs') return Smartphone;
            return ShieldCheck;
          };
          const Icon = getIcon();

          return (
            <div
              key={acc.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      acc.type === 'cash' ? 'bg-emerald-100 text-emerald-800' :
                      acc.type === 'bank' ? 'bg-teal-100 text-teal-800' :
                      acc.type === 'mfs' ? 'bg-pink-100 text-pink-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{acc.name}</h4>
                      <p className="text-xs text-slate-500">{acc.nameBn}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {acc.type}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 block">বর্তমান ব্যালেন্স (Current Balance)</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {settings.currencySymbol}{acc.balance.toLocaleString()}
                  </div>
                </div>

                {acc.accountNumber && (
                  <div className="text-xs font-mono text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                    হিসাব নং: <strong className="text-slate-800">{acc.accountNumber}</strong>
                    {acc.bankName && <div className="text-[10px] text-slate-400 font-sans">{acc.bankName}</div>}
                  </div>
                )}

                {acc.description && (
                  <p className="text-[11px] text-slate-500 mt-2">{acc.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> হিসাব সক্রিয়
                </span>
                <button
                  onClick={() => {
                    setFromAccountId(acc.id);
                    setIsTransferModalOpen(true);
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-800"
                >
                  ট্রান্সফার →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer History */}
      {transfers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700" />
            সাম্প্রতিক ফান্ড ট্রান্সফার ইতিহাস (Fund Transfers)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">রেফারেন্স</th>
                  <th className="py-2.5 px-3">উৎস অ্যাকাউন্ট</th>
                  <th className="py-2.5 px-3">গন্তব্য অ্যাকাউন্ট</th>
                  <th className="py-2.5 px-3">টাকার পরিমাণ</th>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">কারণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((tr) => {
                  const from = accounts.find(a => a.id === tr.fromAccountId);
                  const to = accounts.find(a => a.id === tr.toAccountId);
                  return (
                    <tr key={tr.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{tr.reference}</td>
                      <td className="py-2.5 px-3 text-rose-700 font-medium">{from?.nameBn || from?.name}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">{to?.nameBn || to?.name}</td>
                      <td className="py-2.5 px-3 font-black text-slate-900">{settings.currencySymbol}{tr.amount.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-slate-500">{tr.date}</td>
                      <td className="py-2.5 px-3 text-slate-600">{tr.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfer Funds Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-emerald-700" />
                ফান্ড ট্রান্সফার ফরম (Internal Transfer)
              </h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">উৎস হিসাব (From Account) *</label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.nameBn || a.name} (স্থিতি: {settings.currencySymbol}{a.balance.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">গন্তব্য হিসাব (To Account) *</label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.nameBn || a.name} (স্থিতি: {settings.currencySymbol}{a.balance.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">টাকার পরিমাণ (Amount) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400">{settings.currencySymbol}</span>
                  <input
                    type="number"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 font-bold text-base text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ট্রান্সফারের উদ্দেশ্য / কারণ</label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md"
                >
                  ট্রান্সফার সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                নতুন লেজার হিসাব যুক্ত করুন
              </h3>
              <button onClick={() => setIsAddAccountModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddAccountSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হিসাবের নাম (English Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Bank of India / Punjab National Bank"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাংলায় নাম (Bangla Name)</label>
                <input
                  type="text"
                  placeholder="যেমন: এসবিআই সঞ্চয়ী হিসাব / পিএনবি অ্যাকাউন্ট"
                  value={newAccNameBn}
                  onChange={(e) => setNewAccNameBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অ্যাকাউন্ট টাইপ *</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                  >
                    <option value="bank">ব্যাংক (Indian Bank: SBI/PNB/etc)</option>
                    <option value="cash">নগদ ক্যাশ (Cash in Hand)</option>
                    <option value="mfs">UPI / PhonePe / GPay / Paytm</option>
                    <option value="fund">নির্দিষ্ট তহবিল (Zakat/Lillah Fund)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রাথমিক জমা (Opening Balance)</label>
                  <input
                    type="number"
                    value={newAccBalance}
                    onChange={(e) => setNewAccBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">হিসাব নম্বর / একাউন্ট নং / UPI ID</label>
                <input
                  type="text"
                  placeholder="যেমন: 39485729103 / IFSC: SBIN0001234 বা madrasa@upi"
                  value={newAccNumber}
                  onChange={(e) => setNewAccNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md"
                >
                  অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
