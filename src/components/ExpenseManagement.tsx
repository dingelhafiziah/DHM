import React, { useState } from 'react';
import { 
  TrendingDown, Plus, Search, Filter, Printer, 
  Landmark, Calendar, Trash2, CheckCircle2, 
  ArrowDownRight, Receipt, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExpenseCategory, ExpenseRecord } from '../types';

export const ExpenseManagement: React.FC = () => {
  const { 
    expenses, 
    accounts, 
    settings, 
    currentUser, 
    addExpense, 
    deleteExpense, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpenseForPrint, setSelectedExpenseForPrint] = useState<ExpenseRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'salary' as ExpenseCategory,
    title: 'শিক্ষক ও স্টাফ মাসিক বেতন (Teachers Salary)',
    payeeName: '',
    amount: 15000,
    accountId: accounts[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      category: 'bazar_food',
      title: 'বোর্ডিং মেস ও বাজার খরচ (Food Bazar)',
      payeeName: '',
      amount: 5000,
      accountId: accounts[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      description: 'চাল, ডাল, তেল ও তরিতরকারি ক্রয়',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payeeName.trim() || formData.amount <= 0) {
      showToast('Please enter payee name and valid amount.', 'error');
      return;
    }

    const newExp = addExpense({
      ...formData,
      amount: Number(formData.amount),
      approvedBy: currentUser.name,
    });

    setIsAddModalOpen(false);
    setSelectedExpenseForPrint(newExp);
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = 
      e.payeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.voucherNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || e.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const salaryExpense = expenses.filter(e => e.category === 'salary').reduce((sum, e) => sum + e.amount, 0);
  const foodExpense = expenses.filter(e => e.category === 'bazar_food').reduce((sum, e) => sum + e.amount, 0);
  const utilityExpense = expenses.filter(e => e.category === 'utilities').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div id="expense-management-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-rose-600" />
            ব্যয় ও খরচের হিসাব (Expense Management)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            শিক্ষক বেতন, বোর্ডিং মেস বাজার, বিদ্যুৎ বিল ও মাদরাসা পরিচালনা ব্যয়ের ভাউচার
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm shadow-rose-600/20 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্যয় ভাউচার তৈরি করুন (Add Expense)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">সর্বমোট ব্যয় (Total Expense)</span>
          <div className="text-2xl font-black text-rose-700 mt-2">
            {settings.currencySymbol}{totalExpense.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">মোট {expenses.length} টি ভাউচারে</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">শিক্ষক ও স্টাফ বেতন</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {settings.currencySymbol}{salaryExpense.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">মাসিক বেতন বণ্টন</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মেস ও বাজার খরচ</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {settings.currencySymbol}{foodExpense.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">আবাসিক ছাত্রদের খাবার</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">বিদ্যুৎ ও ইউটিলিটি</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {settings.currencySymbol}{utilityExpense.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">বিল ও পরিচালনা খরচ</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ভাউচার নং, প্রাপকের নাম বা খরচের শিরোনাম খুঁজুন..."
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
            <option value="all">সকল ব্যয়ের খাত (All Categories)</option>
            <option value="salary">শিক্ষক ও স্টাফ বেতন (Salaries)</option>
            <option value="bazar_food">বোর্ডিং মেস ও বাজার (Food / Mess)</option>
            <option value="utilities">বিদ্যুৎ ও ইউটিলিটি (Utilities)</option>
            <option value="rent_infra">ভবন সংস্কার ও নির্মাণ (Maintenance)</option>
            <option value="books_stationery">কিতাব ও খাতা-কলম (Books)</option>
            <option value="events_exam">বার্ষিক মাহফিল ও পরীক্ষা (Events / Exams)</option>
            <option value="medical">ছাত্রদের চিকিৎসা (Medical)</option>
            <option value="miscellaneous">বিবিধ খরচ (Miscellaneous)</option>
          </select>
        </div>
      </div>

      {/* Expense Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            ব্যয় ভাউচার তালিকা ({filteredExpenses.length} টি)
          </h3>
          <span className="text-xs text-slate-500">প্রিন্ট করতে ভাউচার বাটনে ক্লিক করুন</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ভাউচার নং</th>
                <th className="py-3 px-4">প্রাপকের নাম (Payee)</th>
                <th className="py-3 px-4">ব্যয়ের খাত (Category)</th>
                <th className="py-3 px-4">উৎস হিসাব (Account)</th>
                <th className="py-3 px-4">পরিমাণ (টাকা)</th>
                <th className="py-3 px-4">তারিখ ও অনুমোদনকারী</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <TrendingDown className="w-8 h-8 text-slate-300" />
                      <span className="text-sm font-semibold text-slate-600">কোনো ব্যয়ের রেকর্ড নেই (No Expense Records Yet)</span>
                      <span className="text-xs text-slate-400">নতুন খরচ বা বেতন ভাউচার তৈরি করতে উপরে 'নতুন ব্যয় এন্ট্রি' বাটনে ক্লিক করুন</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const acc = accounts.find(a => a.id === exp.accountId);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-800">{exp.voucherNo}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{exp.payeeName}</div>
                        <div className="text-[11px] text-slate-500">{exp.description || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">
                          {exp.category.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-0.5">{exp.title}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {acc?.nameBn || acc?.name || 'Cash'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-700 text-sm">
                        {settings.currencySymbol}{exp.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{exp.date}</div>
                        <div className="text-[10px] text-slate-400">অনুমোদন: {exp.approvedBy}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedExpenseForPrint(exp)}
                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>ভাউচার</span>
                          </button>
                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete expense entry ${exp.voucherNo}?`)) {
                                  deleteExpense(exp.id);
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

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-600" />
                নতুন ব্যয় / ডেবিট ভাউচার তৈরি
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যয়ের খাত (Category) *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold"
                >
                  <option value="salary">শিক্ষক ও স্টাফ মাসিক বেতন (Salaries)</option>
                  <option value="bazar_food">বোর্ডিং মেস ও বাজার খরচ (Food / Mess)</option>
                  <option value="utilities">বিদ্যুৎ, গ্যাস ও ইন্টারনেট বিল (Utilities)</option>
                  <option value="rent_infra">মাদরাসা ভবন সংস্কার ও ভাড়া (Infrastructure)</option>
                  <option value="books_stationery">কিতাব, খাতা ও প্রকাশনা (Books & Print)</option>
                  <option value="events_exam">মাহফিল, দস্তারবন্দী ও পরীক্ষা (Events)</option>
                  <option value="medical">ছাত্রদের চিকিৎসা ও ওষুধ (Medical)</option>
                  <option value="miscellaneous">বিবিধ খরচ (Miscellaneous)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রাপক / ব্যক্তি / দোকানের নাম (Payee) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আলহাজ্ব আসাদুল্লা স্টোর / শিক্ষকবৃন্দ"
                  value={formData.payeeName}
                  onChange={(e) => setFormData({ ...formData, payeeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ব্যয়ের শিরোনাম (Title)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div>
                  <label className="block text-xs font-bold text-rose-950 mb-1">টাকার পরিমাণ (Amount) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-rose-700 text-sm">{settings.currencySymbol}</span>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-rose-300 bg-white font-black text-rose-900 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-950 mb-1">কর্তন হিসাব (Deduct Account) *</label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white font-medium text-slate-800"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.nameBn || acc.name} ({settings.currencySymbol}{acc.balance.toLocaleString()})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">বিস্তারিত বিবরণ ও ভাউচার নোট</label>
                <input
                  type="text"
                  placeholder="যেমন: ৫০ বস্তা চাল ও মসলাপাতি বিল"
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
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  ব্যয় ভাউচার সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Expense Voucher Modal */}
      {selectedExpenseForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <h3 className="font-bold text-slate-900 text-sm">ডেবিট / ব্যয় ভাউচার (Debit Voucher)</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> প্রিন্ট
                </button>
                <button onClick={() => setSelectedExpenseForPrint(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>
            </div>

            <div className="border-2 border-slate-800 rounded-2xl p-6 bg-slate-50/50 text-slate-900 space-y-4">
              <div className="text-center pb-3 border-b-2 border-slate-800">
                <h3 className="text-lg font-black text-slate-900">{settings.banglaName}</h3>
                <p className="text-xs text-slate-700 font-bold">{settings.name}</p>
                <p className="text-[10px] text-slate-500">{settings.address}</p>
                <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase">
                  অফিস ডেবিট ভাউচার (Debit Voucher)
                </div>
              </div>

              <div className="flex justify-between text-xs pt-1">
                <div>ভাউচার নং: <strong className="font-mono font-bold text-rose-800">{selectedExpenseForPrint.voucherNo}</strong></div>
                <div>তারিখ: <strong>{selectedExpenseForPrint.date}</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                <div>প্রাপক: <strong className="text-slate-900 text-sm">{selectedExpenseForPrint.payeeName}</strong></div>
                <div>ব্যয়ের খাত: <strong className="capitalize text-slate-800">{selectedExpenseForPrint.category.replace('_', ' ')}</strong></div>
                <div>বিবরণ: <span>{selectedExpenseForPrint.title} — {selectedExpenseForPrint.description || ''}</span></div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-950">
                <span className="font-bold text-xs">পরিশোধিত টাকার পরিমাণ:</span>
                <span className="font-black text-xl text-rose-800">{settings.currencySymbol}{selectedExpenseForPrint.amount.toLocaleString()}</span>
              </div>

              <div className="mt-8 pt-6 flex justify-between text-xs text-slate-600">
                <div className="text-center border-t border-slate-800 pt-1 w-28">
                  প্রস্তুতকারী<br/>হিসাবরক্ষক
                </div>
                <div className="text-center border-t border-slate-800 pt-1 w-28">
                  গ্রহণকারী<br/>{selectedExpenseForPrint.payeeName.split(' ')[0]}
                </div>
                <div className="text-center border-t border-slate-800 pt-1 w-28">
                  অনুমোদনকারী<br/>{settings.principalName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
