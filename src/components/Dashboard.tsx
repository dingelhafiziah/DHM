import React from 'react';
import { 
  Users, CreditCard, TrendingUp, TrendingDown, 
  Landmark, BookOpen, Award, AlertCircle, 
  CheckCircle2, ArrowUpRight, ArrowDownRight, 
  Plus, Receipt, UserPlus, HeartHandshake,
  Calendar, ChevronRight, Sparkles, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentDepartment } from '../types';

export const Dashboard: React.FC = () => {
  const { 
    students, 
    payments, 
    incomes, 
    expenses, 
    accounts, 
    settings,
    currentUser,
    setActiveTab,
    setActiveSubTab,
    setIsQuickPaymentModalOpen,
    setIsAddStudentModalOpen,
    setIsHifzLogModalOpen,
    setActiveStudentForDetails,
    setActivePaymentForReceipt
  } = useApp();

  // Calculations
  const activeStudents = students.filter(s => s.status === 'active');
  const graduatedStudents = students.filter(s => s.status === 'graduated');
  
  const hafiziaStudents = activeStudents.filter(s => s.department === 'hafizia');
  const nazeraStudents = activeStudents.filter(s => s.department === 'nazera');
  const nooraniStudents = activeStudents.filter(s => s.department === 'noorani');
  const kitabStudents = activeStudents.filter(s => s.department === 'kitab');

  const totalFundBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  
  // Total Fee Collections
  const totalFeesCollected = payments.reduce((sum, p) => sum + p.paidAmount, 0);

  // Total Incomes & Expenses
  const totalOtherIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalRevenue = totalFeesCollected + totalOtherIncome;
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netSurplus = totalRevenue - totalExpense;

  // Approximate total due calculation
  const totalMonthlyBilled = activeStudents.reduce((sum, s) => {
    return sum + (s.monthlyTuitionFee || 0) + (s.monthlyFoodFee || 0) - (s.feeDiscount || 0);
  }, 0);
  const estimatedTargetFee = totalMonthlyBilled * 2; // For current cycle
  const estimatedTotalDue = Math.max(0, estimatedTargetFee - totalFeesCollected);

  // Quran memorization stats
  const totalCompletedParas = students.reduce((sum, s) => sum + (s.completedParas?.length || 0), 0);
  const studentsOver20Paras = students.filter(s => (s.completedParas?.length || 0) >= 20);

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-800/40 shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bismillahir Rahmanir Rahim • Academic Year {settings.academicYear.split(' ')[0]}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {settings.name}
            </h1>
            <p className="text-sm text-slate-300">
              {settings.banglaName} — {settings.slogan}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dash-btn-collect-fee"
              onClick={() => setIsQuickPaymentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40"
            >
              <Receipt className="w-4 h-4" />
              <span>বেতন গ্রহণ (Collect Fee)</span>
            </button>
            <button
              id="dash-btn-record-sabak"
              onClick={() => setIsHifzLogModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30 hover:bg-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>দৈনিক সবক (Sabak Log)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              মোট ছাত্র (Students)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeStudents.length}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              + {graduatedStudents.length} হাফেজ গ্র্যাজুয়েট
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>হিফজ: <strong className="text-slate-800">{hafiziaStudents.length}</strong></span>
            <span>নাজেরা: <strong className="text-slate-800">{nazeraStudents.length}</strong></span>
            <span>নূরানী: <strong className="text-slate-800">{nooraniStudents.length}</strong></span>
          </div>
        </div>

        {/* Card 2: Total Fee Collections */}
        <div 
          onClick={() => { setActiveTab('fees'); setActiveSubTab('payment'); }}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              মোট ফি আদায় (Fees Collected)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {settings.currencySymbol}{totalFeesCollected.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>মোট রসিদ: <strong className="text-slate-800">{payments.length} টি</strong></span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              বিস্তারিত <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Due Fees */}
        <div 
          onClick={() => { setActiveTab('fees'); setActiveSubTab('due'); }}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              বকেয়া বেতন (Pending Dues)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700 tracking-tight">
              {settings.currencySymbol}{estimatedTotalDue.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-amber-800 font-medium">বকেয়া ছাত্র তালিকা</span>
            <span className="text-amber-700 font-semibold flex items-center gap-0.5">
              রিমাইন্ডার <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Net Balance / Accounts Fund */}
        <div 
          onClick={() => setActiveTab('accounts')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              মাদরাসা মোট তহবিল (Total Funds)
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-teal-900 tracking-tight">
              {settings.currencySymbol}{totalFundBalance.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>হাতে নগদ + ব্যাংক + ফান্ড</span>
            <span className="text-teal-700 font-semibold flex items-center gap-0.5">
              হিসাব <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Hifz Progress Overview & Financial Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hifz Quran Memorization Highlights */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  হিফজুল কুরআন অগ্রগতি (Hifz Memorization Progress)
                </h3>
                <p className="text-xs text-slate-500">
                  মোট মুখস্থ সম্পন্ন পারা: <strong className="text-emerald-700">{totalCompletedParas} পারা</strong> • সর্বমোট ৩০ পারা
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('students')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              সকল ছাত্র দেখুন <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hifz Students Progress Highlights */}
          <div className="space-y-3.5">
            {hafiziaStudents.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">হিফজ বিভাগে এখনো কোনো ছাত্র তালিকাভুক্ত নেই</p>
                <p className="text-[11px] text-slate-500 mt-0.5">নতুন ছাত্র ভর্তি করলে তাদের ৩০ পারা কুরআন অগ্রগতি এখানে দেখা যাবে</p>
                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <Plus className="w-3.5 h-3.5" /> ছাত্র ভর্তি করুন
                </button>
              </div>
            ) : (
              hafiziaStudents.slice(0, 4).map((student) => {
                const completedCount = student.completedParas?.length || 0;
                const percentage = Math.round((completedCount / 30) * 100);
                return (
                  <div 
                    key={student.id}
                    onClick={() => setActiveStudentForDetails(student)}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {student.rollNo.replace('DHA-', '')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {student.fullName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium truncate">
                            ({student.banglaName})
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                          <span>বর্তমান পারা: <strong className="text-emerald-800 font-bold">{student.currentPara}</strong></span>
                          <span>•</span>
                          <span>সর্বশেষ সবক: <strong className="text-slate-800">{student.lastSabakSurah || 'N/A'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:w-56 shrink-0">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-emerald-800">{completedCount} / 30 পারা</span>
                          <span className="text-slate-600">{percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        {student.lastSabakGrade?.split(' ')[0] || 'Good'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Financial Balance Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-700" />
                আর্থিক সংক্ষিপ্ত বিবরণী
              </h3>
              <button 
                onClick={() => setActiveTab('reports')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                রিপোর্ট
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-800 font-medium">ছাত্র বেতন ও ফি আদায়</div>
                  <div className="text-base font-bold text-emerald-950">
                    {settings.currencySymbol}{totalFeesCollected.toLocaleString()}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-teal-800 font-medium">দান, যাকাত ও অন্যান্য আয়</div>
                  <div className="text-base font-bold text-teal-950">
                    {settings.currencySymbol}{totalOtherIncome.toLocaleString()}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-teal-600" />
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-rose-800 font-medium">মোট ব্যয় ও শিক্ষক বেতন</div>
                  <div className="text-base font-bold text-rose-950">
                    {settings.currencySymbol}{totalExpense.toLocaleString()}
                  </div>
                </div>
                <ArrowDownRight className="w-5 h-5 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">চলতি উদ্বৃত্ত (Surplus)</span>
              <span className={`text-base font-extrabold ${netSurplus >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {settings.currencySymbol}{netSurplus.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Fee Payments / Receipts */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-700" />
              সর্বশেষ ফি আদায় ও মানি রিসিট (Recent Fee Receipts)
            </h3>
            <p className="text-xs text-slate-500">
              সকল ফি কালেকশন সরাসরি ভাউচার ও মানি রিসিটে প্রিন্ট যোগ্য
            </p>
          </div>

          <button
            id="dash-btn-view-all-receipts"
            onClick={() => { setActiveTab('fees'); setActiveSubTab('receipt'); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            সকল রসিদ দেখুন <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">রসিদ নং (Receipt No)</th>
                <th className="py-3 px-4">ছাত্রের নাম ও রোল</th>
                <th className="py-3 px-4">বিভাগ (Dept)</th>
                <th className="py-3 px-4">মাস (Month)</th>
                <th className="py-3 px-4">পরিশোধিত টাকা</th>
                <th className="py-3 px-4">বকেয়া</th>
                <th className="py-3 px-4">পেমেন্ট মেথড</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Receipt className="w-7 h-7 text-slate-300" />
                      <span className="text-xs font-semibold text-slate-600">কোনো ফি আদায়ের মানি রিসিট নেই (No Fee Receipts)</span>
                      <span className="text-[11px] text-slate-400">ছাত্রের বেতন ও ফি আদায় করতে উপরে 'বেতন গ্রহণ' বাটনে ক্লিক করুন</span>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                      {pay.receiptNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{pay.studentName}</div>
                      <div className="text-[11px] text-slate-500">{pay.studentBanglaName} • {pay.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {pay.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {pay.month}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {settings.currencySymbol}{pay.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {pay.dueRemaining > 0 ? (
                        <span className="font-bold text-amber-700">
                          {settings.currencySymbol}{pay.dueRemaining.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> পরিশোধিত
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActivePaymentForReceipt(pay)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>রসিদ দেখুন</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
