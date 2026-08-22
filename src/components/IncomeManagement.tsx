import React, { useState } from 'react';
import { 
  TrendingUp, Plus, Search, Filter, Printer, 
  HeartHandshake, Landmark, Calendar, Trash2, 
  CheckCircle2, DollarSign, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { IncomeCategory, IncomeRecord } from '../types';

export const IncomeManagement: React.FC = () => {
  const { 
    incomes, 
    accounts, 
    settings, 
    currentUser, 
    addIncome, 
    deleteIncome, 
    payments,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIncomeForPrint, setSelectedIncomeForPrint] = useState<IncomeRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'donation' as IncomeCategory,
    title: '',
    donorName: '',
    donorPhone: '',
    donorAddress: '',
    amount: 10000,
    accountId: accounts[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      category: 'donation',
      title: 'সাধারণ দান ও অনুদান (General Donation)',
      donorName: '',
      donorPhone: '',
      donorAddress: '',
      amount: 5000,
      accountId: accounts[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      description: 'মাদরাসার উন্নয়নে সাধারণ অনুদান',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName.trim() || formData.amount <= 0) {
      showToast('Please enter donor name and valid amount.', 'error');
      return;
    }

    const newInc = addIncome({
      ...formData,
      amount: Number(formData.amount),
      receivedBy: currentUser.name,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setIsAddModalOpen(false);
    setSelectedIncomeForPrint(newInc);
  };

  const filteredIncomes = incomes.filter(i => {
    const matchesSearch = 
      i.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.donorPhone && i.donorPhone.includes(searchQuery));
    const matchesCat = selectedCat === 'all' || i.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const totalOtherIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalStudentFees = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const grandTotalIncome = totalOtherIncome + totalStudentFees;

  const zakatTotal = incomes.filter(i => i.category === 'zakat').reduce((sum, i) => sum + i.amount, 0);
  const donationTotal = incomes.filter(i => i.category === 'donation').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div id="income-management-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
            আয় ও অনুদান ব্যবস্থাপনা (Income & Donations)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            মাদরাসার সাধারণ দান, যাকাত, লিল্লাহ ফান্ড ও স্থায়ী দাতা সদস্যদের অনুদান হিসাব
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm shadow-emerald-700/20 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন দান / আয় যুক্ত করুন (Add Income)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">সর্বমোট মাদরাসা আয়</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {settings.currencySymbol}{grandTotalIncome.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">ফি ৳{totalStudentFees.toLocaleString()} + অনুদান ৳{totalOtherIncome.toLocaleString()}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">সাধারণ দান ও অনুদান</span>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {settings.currencySymbol}{donationTotal.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">উন্নয়ন ও সাধারণ ফান্ডে জমা</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">যাকাত ও লিল্লাহ ফান্ড</span>
          <div className="text-2xl font-black text-teal-700 mt-2">
            {settings.currencySymbol}{zakatTotal.toLocaleString()}
          </div>
          <div className="text-xs text-teal-600 mt-1">এতিম ও দরিদ্র ছাত্রদের জন্য সংরক্ষিত</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মোট দাতা ভাউচার</span>
          <div className="text-2xl font-black text-slate-800 mt-2">
            {incomes.length} টি
          </div>
          <div className="text-xs text-slate-500 mt-1">স্বয়ংক্রিয় মানি রিসিট প্রস্তুত</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="দাতার নাম, ফোন, ভাউচার নং বা বিবরণ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
          />
        </div>

        <div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium"
          >
            <option value="all">সকল আয়ের খাত (All Categories)</option>
            <option value="donation">সাধারণ দান (General Donation)</option>
            <option value="zakat">যাকাত তহবিল (Zakat Fund)</option>
            <option value="lillah_fitra">লিল্লাহ ও সদকা (Lillah & Sadaqah)</option>
            <option value="monthly_donor">স্থায়ী সদস্য মাসিক চাঁদা (Monthly Member)</option>
            <option value="qurbani_skin">কোরবানির চামড়া (Qurbani Skin)</option>
            <option value="grant">অনুদান ও অন্যান্য (Grant / Other)</option>
          </select>
        </div>
      </div>

      {/* Income Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            অনুদান ও আয়ের তালিকা ({filteredIncomes.length} টি ভাউচার)
          </h3>
          <span className="text-xs text-slate-500">প্রিন্ট করতে ভাউচার বাটনে ক্লিক করুন</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ভাউচার নং</th>
                <th className="py-3 px-4">দাতার নাম ও ঠিকানা</th>
                <th className="py-3 px-4">আয়ের খাত (Category)</th>
                <th className="py-3 px-4">জমা হিসাব (Account)</th>
                <th className="py-3 px-4">পরিমাণ (টাকা)</th>
                <th className="py-3 px-4">তারিখ ও গৃহীতা</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HeartHandshake className="w-8 h-8 text-slate-300" />
                      <span className="text-sm font-semibold text-slate-600">কোনো অনুদান বা আয়ের রেকর্ড নেই (No Income Records Yet)</span>
                      <span className="text-xs text-slate-400">নতুন অনুদান বা ফান্ড জমা এন্ট্রি করতে উপরে 'নতুন দান/আয় গ্রহণ' বাটনে ক্লিক করুন</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((inc) => {
                  const acc = accounts.find(a => a.id === inc.accountId);
                  return (
                    <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{inc.voucherNo}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{inc.donorName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{inc.donorPhone || inc.donorAddress || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {inc.category.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-0.5">{inc.title}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {acc?.nameBn || acc?.name || 'Cash'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                        {settings.currencySymbol}{inc.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{inc.date}</div>
                        <div className="text-[10px] text-slate-400">গৃহীতা: {inc.receivedBy}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedIncomeForPrint(inc)}
                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>ভাউচার</span>
                          </button>
                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete income entry ${inc.voucherNo}?`)) {
                                  deleteIncome(inc.id);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Income Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-700" />
                নতুন অনুদান / আয় এন্ট্রি ফরম
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আয়ের খাত (Category) *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as IncomeCategory })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold"
                >
                  <option value="donation">সাধারণ দান ও অনুদান (General Donation)</option>
                  <option value="zakat">যাকাত তহবিল (Zakat Fund)</option>
                  <option value="lillah_fitra">লিল্লাহ ও সদকা (Lillah / Fitra)</option>
                  <option value="monthly_donor">স্থায়ী সদস্য চাঁদা (Monthly Member)</option>
                  <option value="qurbani_skin">কোরবানির চামড়া বিক্রয় (Qurbani Skin)</option>
                  <option value="other">অন্যান্য আয় (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">দাতার পূর্ণ নাম (Donor Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আলহাজ্ব মোঃ রফিকুল ইসলাম"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ঠিকানা / এলাকা (Address: Vill/Dist)</label>
                  <input
                    type="text"
                    placeholder="মুর্শিদাবাদ / মালদা / কলকাতা / গ্রাম"
                    value={formData.donorAddress}
                    onChange={(e) => setFormData({ ...formData, donorAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">টাকার পরিমাণ (Amount) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-emerald-700 text-sm">{settings.currencySymbol}</span>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-emerald-300 bg-white font-black text-emerald-900 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">জমা হিসাব (Account) *</label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-medium text-slate-800"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.nameBn || acc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">উদ্দেশ্য / বিবরণ (Purpose & Notes)</label>
                <input
                  type="text"
                  placeholder="e.g. জুমার খাবারের জন্য বা ভবন নির্মাণ"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md"
                >
                  অনুদান সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Donation Voucher Modal */}
      {selectedIncomeForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <h3 className="font-bold text-slate-900 text-sm">দান ও অনুদান রসিদ (Donation Slip)</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> প্রিন্ট
                </button>
                <button onClick={() => setSelectedIncomeForPrint(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>
            </div>

            <div className="border-2 border-emerald-800 rounded-2xl p-6 bg-emerald-50/20 text-slate-900 space-y-4">
              <div className="text-center pb-3 border-b-2 border-emerald-800">
                <div className="text-xs font-serif font-bold text-emerald-900">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <h3 className="text-lg font-black text-slate-900">{settings.banglaName}</h3>
                <p className="text-xs text-emerald-800 font-bold">{settings.name}</p>
                <p className="text-[10px] text-slate-500">{settings.address} • ফোন: {settings.phone}</p>
                <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-emerald-800 text-white font-bold text-xs">
                  দান ও অনুদান প্রাপ্তি রসিদ (Donation Receipt)
                </div>
              </div>

              <div className="flex justify-between text-xs pt-1">
                <div>ভাউচার নং: <strong className="font-mono font-bold">{selectedIncomeForPrint.voucherNo}</strong></div>
                <div>তারিখ: <strong>{selectedIncomeForPrint.date}</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                <div>দাতার নাম: <strong className="text-slate-900 text-sm">{selectedIncomeForPrint.donorName}</strong></div>
                {selectedIncomeForPrint.donorPhone && <div>মোবাইল: <strong className="font-mono">{selectedIncomeForPrint.donorPhone}</strong></div>}
                <div>আয়ের খাত: <strong className="capitalize text-emerald-800">{selectedIncomeForPrint.category.replace('_', ' ')}</strong></div>
                {selectedIncomeForPrint.description && <div>বিবরণ: <span>{selectedIncomeForPrint.description}</span></div>}
              </div>

              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-between text-emerald-950">
                <span className="font-bold text-xs">প্রাপ্ত টাকার পরিমাণ:</span>
                <span className="font-black text-xl text-emerald-900">{settings.currencySymbol}{selectedIncomeForPrint.amount.toLocaleString()}</span>
              </div>

              <div className="mt-8 pt-6 flex justify-between text-xs text-slate-600">
                <div className="text-center border-t border-slate-800 pt-1 w-32">
                  আদায়কারী<br/>{selectedIncomeForPrint.receivedBy}
                </div>
                <div className="text-center border-t border-slate-800 pt-1 w-32">
                  মুহতামিম / সভাপতি<br/>{settings.principalName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
