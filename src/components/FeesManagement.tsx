import React, { useState } from 'react';
import { 
  CreditCard, AlertCircle, Receipt, Search, Filter, 
  Plus, Printer, Send, Phone, MessageSquare, 
  CheckCircle2, Download, ChevronRight, Calendar,
  Share2, ArrowUpRight, DollarSign, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FeePayment, Student } from '../types';

export const FeesManagement: React.FC = () => {
  const { 
    students, 
    payments, 
    settings, 
    activeSubTab, 
    setActiveSubTab,
    setIsQuickPaymentModalOpen,
    setActivePaymentForReceipt,
    calculateStudentDue,
    showToast
  } = useApp();

  const currentTab = activeSubTab || 'payment';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [dueReminderStudent, setDueReminderStudent] = useState<Student | null>(null);

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentBanglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = selectedMonth === 'all' || p.month.includes(selectedMonth);
    const matchesDept = selectedDept === 'all' || p.department === selectedDept;
    return matchesSearch && matchesMonth && matchesDept;
  });

  // Calculate dues for active students
  const activeStudents = students.filter(s => s.status === 'active');
  const studentDuesList = activeStudents.map(student => {
    const dueInfo = calculateStudentDue(student.id);
    return {
      student,
      ...dueInfo
    };
  }).filter(item => {
    const matchesSearch = 
      item.student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student.guardianPhone.includes(searchQuery);
    const matchesDept = selectedDept === 'all' || item.student.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const totalDuesSum = studentDuesList.reduce((sum, item) => sum + item.totalDue, 0);
  const totalCollectionsSum = payments.reduce((sum, p) => sum + p.paidAmount, 0);

  const handleSendReminderSMS = (student: Student, dueAmount: number) => {
    const message = `আসসালামু আলাইকুম, ${student.guardianName} সাহেব। ${settings.banglaName}-এ আপনার সন্তান ${student.fullName} (রোল: ${student.rollNo})-এর বকেয়া ফি ${settings.currencySymbol}${dueAmount.toLocaleString()}। অনুগ্রহপূর্বক মাদরাসা অফিসে বা UPI / PhonePe / GPay / ব্যাঙ্ক একাউন্টে (${settings.phone.split(',')[0]}) দ্রুত পরিশোধের অনুরোধ রইল। - মুহতামিম, ${settings.name}`;
    
    navigator.clipboard.writeText(message);
    showToast(`SMS / WhatsApp reminder text copied for ${student.fullName}!`);
  };

  return (
    <div id="fees-management-view" className="space-y-6 pb-12">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-700" />
            ফি ও বেতন ব্যবস্থাপনা (Fees Management)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ছাত্র বেতন আদায়, বকেয়া হিসাব নিরীক্ষণ ও ডিজিটাল মানি রিসিট প্রস্তুতকরণ
          </p>
        </div>

        <button
          id="btn-fees-collect"
          onClick={() => setIsQuickPaymentModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm shadow-emerald-700/20 active:scale-98"
        >
          <Receipt className="w-4 h-4" />
          <span>নতুন বেতন গ্রহণ (Collect Fee)</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        <button
          onClick={() => setActiveSubTab('payment')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'payment'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>ফি আদায় (Payment Records)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('due')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'due'
              ? 'bg-white text-amber-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>বকেয়া তালিকা (Due Management)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
            {studentDuesList.filter(d => d.totalDue > 0).length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('receipt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'receipt'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>মানি রিসিট ভাউচার (Receipts)</span>
        </button>
      </div>

      {/* Summary KPI Cards for Fees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মোট ফি আদায় (Total Collected)</span>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {settings.currencySymbol}{totalCollectionsSum.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">মোট {payments.length} টি রসিদের মাধ্যমে</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">মোট বকেয়া (Total Pending Due)</span>
          <div className="text-2xl font-black text-amber-700 mt-2">
            {settings.currencySymbol}{totalDuesSum.toLocaleString()}
          </div>
          <div className="text-xs text-amber-600 mt-1">
            {studentDuesList.filter(d => d.totalDue > 0).length} জন ছাত্রের বকেয়া রয়েছে
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">চলতি শিক্ষাবর্ষ</span>
          <div className="text-xl font-bold text-slate-900 mt-2">
            {settings.academicYear}
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">নিয়মিত মাসিক ফি গ্রহণ সচল</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="রসিদ নং, ছাত্রের নাম বা রোল খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
          />
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium"
          >
            <option value="all">সকল বিভাগ (All Departments)</option>
            <option value="hafizia">হিফজুল কুরআন (Hafizia)</option>
            <option value="nazera">নাজেরা কুরআন (Nazera)</option>
            <option value="noorani">নূরানী ও ক্বায়দা (Noorani)</option>
            <option value="kitab">কিতাব বিভাগ (Kitab)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium"
          >
            <option value="all">সকল মাস (All Months)</option>
            <option value="February">February 2026</option>
            <option value="January">January 2026</option>
            <option value="March">March 2026</option>
          </select>
        </div>
      </div>

      {/* TAB 1: Payment Records Table */}
      {currentTab === 'payment' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              সকল ফি কালেকশন রেকর্ড ({filteredPayments.length} টি)
            </h3>
            <span className="text-xs text-slate-500">মানি রিসিট দেখতে 'রসিদ প্রিন্ট' বাটনে ক্লিক করুন</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">রসিদ নং (Receipt)</th>
                  <th className="py-3 px-4">ছাত্রের নাম ও রোল</th>
                  <th className="py-3 px-4">মাস</th>
                  <th className="py-3 px-4">মোট বিল</th>
                  <th className="py-3 px-4">ছাড়</th>
                  <th className="py-3 px-4">আদায়কৃত টাকা</th>
                  <th className="py-3 px-4">বকেয়া</th>
                  <th className="py-3 px-4">তারিখ ও মাধ্যম</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CreditCard className="w-8 h-8 text-slate-300" />
                        <span className="text-sm font-semibold text-slate-600">কোনো ফি আদায়ের রেকর্ড নেই (No Fee Payments Yet)</span>
                        <span className="text-xs text-slate-400">নতুন ফি আদায় করতে উপরে 'ফি আদায় ফরম' বাটনে ক্লিক করুন</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{pay.receiptNo}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{pay.studentName}</div>
                        <div className="text-[11px] text-slate-500">{pay.studentBanglaName} • {pay.rollNo}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{pay.month}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{settings.currencySymbol}{pay.subtotal.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-emerald-800 font-medium">
                        {pay.discount > 0 ? `-${settings.currencySymbol}${pay.discount.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">{settings.currencySymbol}{pay.paidAmount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        {pay.dueRemaining > 0 ? (
                          <span className="font-bold text-amber-700">{settings.currencySymbol}{pay.dueRemaining.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">পরিশোধ</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{pay.paymentDate}</div>
                        <span className="text-[10px] capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {pay.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActivePaymentForReceipt(pay)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>রসিদ</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Due List & Reminders */}
      {currentTab === 'due' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                বকেয়া ফি তালিকা ও এসএমএস রিমাইন্ডার (Pending Dues)
              </h3>
              <p className="text-xs text-slate-500">বকেয়া থাকা অভিভাবকদের সরাসরি রিমাইন্ডার বার্তা পাঠান</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>বকেয়া তালিকা প্রিন্ট</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">রোল ও নাম</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4">মাসিক ফি কাঠামো</th>
                  <th className="py-3 px-4">মোট বিল</th>
                  <th className="py-3 px-4">মোট পরিশোধ</th>
                  <th className="py-3 px-4">মোট বকেয়া (Due)</th>
                  <th className="py-3 px-4">অভিভাবক ও ফোন</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentDuesList.map((item) => (
                  <tr key={item.student.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.student.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.student.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-medium">{item.student.department}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {settings.currencySymbol}{item.student.monthlyTuitionFee + item.student.monthlyFoodFee - item.student.feeDiscount}/মাস
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{settings.currencySymbol}{item.totalBilled.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-800">{settings.currencySymbol}{item.totalPaid.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      {item.totalDue > 0 ? (
                        <span className="font-extrabold text-amber-700 text-sm bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {settings.currencySymbol}{item.totalDue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> কোনো বকেয়া নেই
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{item.student.guardianName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{item.student.guardianPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.totalDue > 0 && (
                          <button
                            onClick={() => handleSendReminderSMS(item.student, item.totalDue)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                            title="Copy SMS / WhatsApp Due Notice"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setIsQuickPaymentModalOpen(true)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                        >
                          ফি জমা
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Receipts & Vouchers Grid */}
      {currentTab === 'receipt' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.map((pay) => (
            <div
              key={pay.id}
              onClick={() => setActivePaymentForReceipt(pay)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {pay.receiptNo}
                </span>
                <span className="text-xs text-slate-500">{pay.paymentDate}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{pay.studentName}</h4>
                <p className="text-xs text-slate-500">{pay.studentBanglaName} • রোল: {pay.rollNo}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">পরিশোধিত ফি ({pay.month})</span>
                  <span className="font-black text-emerald-800 text-base">{settings.currencySymbol}{pay.paidAmount.toLocaleString()}</span>
                </div>
                {pay.dueRemaining > 0 ? (
                  <span className="text-amber-800 font-bold text-[11px]">বকেয়া: {settings.currencySymbol}{pay.dueRemaining}</span>
                ) : (
                  <span className="text-emerald-700 font-bold text-[11px]">পরিশোধিত</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="capitalize text-slate-500">পদ্ধতি: {pay.paymentMethod}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  রসিদ ভিউ ও প্রিন্ট <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
