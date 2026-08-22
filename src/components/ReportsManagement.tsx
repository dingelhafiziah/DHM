import React, { useState } from 'react';
import { 
  FileSpreadsheet, Printer, Download, Calendar, 
  TrendingUp, TrendingDown, Landmark, BookOpen, 
  Users, CheckCircle2, DollarSign, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsManagement: React.FC = () => {
  const { 
    students, 
    payments, 
    incomes, 
    expenses, 
    accounts, 
    settings, 
    calculateStudentDue 
  } = useApp();

  const [reportType, setReportType] = useState<'financial' | 'fees' | 'hifz' | 'students'>('financial');
  const [selectedMonth, setSelectedMonth] = useState('February 2026');

  // Calculations
  const totalStudentFees = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalOtherIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const grandTotalIncome = totalStudentFees + totalOtherIncome;
  const grandTotalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netSurplus = grandTotalIncome - grandTotalExpense;

  const totalDues = students.filter(s => s.status === 'active').reduce((sum, s) => {
    return sum + calculateStudentDue(s.id).totalDue;
  }, 0);

  const totalMemorizedParas = students.reduce((sum, s) => sum + (s.completedParas?.length || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'financial') {
      csvContent += `Category,Type,Amount (${settings.currencyCode})\n`;
      csvContent += `Student Tuition & Fees,Income,${totalStudentFees}\n`;
      incomes.forEach(i => {
        csvContent += `"${i.title} (${i.donorName})",Income,${i.amount}\n`;
      });
      expenses.forEach(e => {
        csvContent += `"${e.title} (${e.payeeName})",Expense,${e.amount}\n`;
      });
    } else if (reportType === 'students') {
      csvContent += 'Roll,Name,Bangla Name,Department,Residential,Contact\n';
      students.forEach(s => {
        csvContent += `"${s.rollNo}","${s.fullName}","${s.banglaName}","${s.department}","${s.residential ? 'Yes' : 'No'}","${s.guardianPhone}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dingel_hafizia_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="reports-management-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            রিপোর্ট ও অডিট বিবরণী (Reports & Audits)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            মাসিক আর্থিক বিবরণী, হিফজুল কুরআন অগ্রগতি ও পূর্ণাঙ্গ মাদরাসা অডিট স্টেটমেন্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>এক্সেল / CSV এক্সপোর্ট</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট স্টেটমেন্ট (Print Report)</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        <button
          onClick={() => setReportType('financial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            reportType === 'financial' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>আয়-ব্যয় অডিট বিবরণী (Financial Statement)</span>
        </button>

        <button
          onClick={() => setReportType('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            reportType === 'fees' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>বেতন ও বকেয়া রিপোর্ট (Fees & Dues)</span>
        </button>

        <button
          onClick={() => setReportType('hifz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            reportType === 'hifz' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>হিফজ অগ্রগতি রিপোর্ট (Hifz Progress)</span>
        </button>

        <button
          onClick={() => setReportType('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            reportType === 'students' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ছাত্র রেজিস্টার রিপোর্ট (Students Register)</span>
        </button>
      </div>

      {/* PRINTABLE REPORT DOCUMENT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 print:border-none print:shadow-none print:p-2">
        {/* Madrasa Official Header for Reports */}
        <div className="text-center pb-6 border-b-2 border-slate-900">
          <div className="text-xs font-serif font-bold text-emerald-900">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {settings.banglaName}
          </h2>
          <p className="text-xs font-bold text-emerald-800">{settings.name}</p>
          <p className="text-xs text-slate-600 mt-0.5">{settings.address} • ফোন: {settings.phone}</p>
          <div className="mt-2 inline-block px-4 py-1 rounded-full bg-slate-900 text-white font-bold text-xs">
            {reportType === 'financial' && 'মাসিক সামগ্রিক আয়-ব্যয় ও অডিট বিবরণী (Financial Audit Statement)'}
            {reportType === 'fees' && 'ছাত্র বেতন আদায় ও বকেয়া তালিকা রিপোর্ট (Fee Collection & Due Report)'}
            {reportType === 'hifz' && 'হিফজুল কুরআন বিভাগীয় সামগ্রিক অগ্রগতি রিপোর্ট (Hifz Department Progress)'}
            {reportType === 'students' && 'মাদরাসার সকল ছাত্র রেজিস্টার ও তথ্য বিবরণী (Madrasa Students Register)'}
          </div>
        </div>

        {/* FINANCIAL AUDIT REPORT */}
        {reportType === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 uppercase">মোট আয় (Total Revenue)</span>
                <div className="text-2xl font-black text-emerald-800 mt-1">
                  {settings.currencySymbol}{grandTotalIncome.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">ফি ও অনুদান সমন্বিত</div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-rose-950 uppercase">মোট ব্যয় (Total Expense)</span>
                <div className="text-2xl font-black text-rose-700 mt-1">
                  {settings.currencySymbol}{grandTotalExpense.toLocaleString()}
                </div>
                <div className="text-[11px] text-rose-600 mt-1">বেতন, মেস ও পরিচালনা</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white">
                <span className="text-xs font-bold text-teal-300 uppercase">মাসিক উদ্বৃত্ত (Net Surplus)</span>
                <div className="text-2xl font-black text-white mt-1">
                  {settings.currencySymbol}{netSurplus.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">ফান্ডে সঞ্চিত স্থিতি</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Income Breakdown */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-3 bg-emerald-800 text-white font-bold text-xs flex justify-between">
                  <span>আয়ের বিবরণ (Income Items)</span>
                  <span>পরিমাণ ({settings.currencyCode})</span>
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">ছাত্র মাসিক বেতন ও ভর্তি ফি</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-800">{settings.currencySymbol}{totalStudentFees.toLocaleString()}</td>
                    </tr>
                    {incomes.map(inc => (
                      <tr key={inc.id}>
                        <td className="py-2 px-3">
                          <div className="font-medium text-slate-800">{inc.title}</div>
                          <div className="text-[10px] text-slate-400">{inc.donorName} ({inc.category})</div>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-800">{settings.currencySymbol}{inc.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-emerald-50 border-t-2 border-emerald-700 font-extrabold text-emerald-950">
                    <tr>
                      <td className="py-2.5 px-3">সর্বমোট আয় (Total Revenue):</td>
                      <td className="py-2.5 px-3 text-right text-sm">{settings.currencySymbol}{grandTotalIncome.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Expense Breakdown */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-3 bg-rose-800 text-white font-bold text-xs flex justify-between">
                  <span>ব্যয়ের বিবরণ (Expense Items)</span>
                  <span>পরিমাণ ({settings.currencyCode})</span>
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map(exp => (
                      <tr key={exp.id}>
                        <td className="py-2 px-3">
                          <div className="font-medium text-slate-800">{exp.title}</div>
                          <div className="text-[10px] text-slate-400">{exp.payeeName} ({exp.category})</div>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-rose-800">{settings.currencySymbol}{exp.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-rose-50 border-t-2 border-rose-700 font-extrabold text-rose-950">
                    <tr>
                      <td className="py-2.5 px-3">সর্বমোট ব্যয় (Total Expense):</td>
                      <td className="py-2.5 px-3 text-right text-sm">{settings.currencySymbol}{grandTotalExpense.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* HIFZ PROGRESS REPORT */}
        {reportType === 'hifz' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <span className="text-xs font-bold text-teal-900 uppercase">মোট হিফজ বিভাগ ছাত্র</span>
                <div className="text-2xl font-black text-teal-800 mt-1">
                  {students.filter(s => s.department === 'hafizia').length} জন
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 uppercase">মুখস্থ সম্পন্ন মোট পারা</span>
                <div className="text-2xl font-black text-emerald-800 mt-1">
                  {totalMemorizedParas} পারা
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-900 uppercase">আসন্ন খতমে কুরআন / হাফেজ</span>
                <div className="text-2xl font-black text-amber-800 mt-1">
                  {students.filter(s => (s.completedParas?.length || 0) >= 25).length} জন
                </div>
              </div>
            </div>

            <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">রোল</th>
                  <th className="py-2.5 px-3">নাম</th>
                  <th className="py-2.5 px-3">বর্তমান চলমান পারা</th>
                  <th className="py-2.5 px-3">সম্পন্ন পারা সংখ্যা</th>
                  <th className="py-2.5 px-3">সর্বশেষ সবক সূরা</th>
                  <th className="py-2.5 px-3">অগ্রগতি (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.filter(s => s.department === 'hafizia').map(s => {
                  const completedCount = s.completedParas?.length || 0;
                  const pct = Math.round((completedCount / 30) * 100);
                  return (
                    <tr key={s.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{s.rollNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{s.fullName} ({s.banglaName})</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">পারা {s.currentPara || 1}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{completedCount} / ৩০ পারা</td>
                      <td className="py-2.5 px-3 text-slate-600">{s.lastSabakSurah || '—'}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="font-mono font-bold text-[11px] text-slate-700">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures block */}
        <div className="mt-12 pt-8 flex items-end justify-between text-xs text-slate-700 border-t border-slate-200">
          <div className="text-center">
            <div className="border-t border-slate-900 pt-1 w-36 font-semibold">
              হিসাবরক্ষকের স্বাক্ষর
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-900 pt-1 w-36 font-semibold">
              প্রধান ক্বারী / শিক্ষক
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-900 pt-1 w-36 font-semibold">
              মুহতামিম / সভাপতি<br/>{settings.principalName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
