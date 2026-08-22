import React, { useState } from 'react';
import { 
  X, BookOpen, CreditCard, Calendar, Phone, 
  MapPin, CheckCircle2, Award, Clock, Sparkles, 
  Plus, Receipt, ArrowRight, UserCheck, ShieldCheck,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { QURAN_PARAS } from '../data/quranData';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const { 
    settings, 
    toggleParaCompletion, 
    payments, 
    hifzLogs, 
    calculateStudentDue, 
    setIsQuickPaymentModalOpen,
    setIsHifzLogModalOpen,
    setActivePaymentForReceipt,
    recordAttendance
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hifz' | 'fees' | 'attendance' | 'bio'>('hifz');
  const completedParas = student.completedParas || [];
  const completedCount = completedParas.length;
  const percentage = Math.round((completedCount / 30) * 100);

  // Student specific dues and payments
  const dueInfo = calculateStudentDue(student.id);
  const studentPayments = payments.filter(p => p.studentId === student.id);
  const studentHifzLogs = hifzLogs.filter(l => l.studentId === student.id);

  const handleParaClick = (paraNum: number) => {
    toggleParaCompletion(student.id, paraNum);
    
    // If completing the 30th para or reaching a milestone, celebrate!
    if (!completedParas.includes(paraNum) && (completedCount + 1 === 30 || (completedCount + 1) % 5 === 0)) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-t-3xl relative">
          <button 
            onClick={onClose}
            className="absolute right-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold flex flex-col items-center justify-center text-sm shadow-md ring-4 ring-emerald-500/20 shrink-0">
                <span className="text-[10px] text-emerald-200 uppercase font-semibold">Roll</span>
                <span className="text-xl">{student.rollNo.replace('DHA-', '')}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {student.fullName}
                  </h3>
                  {completedCount === 30 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Award className="w-3.5 h-3.5" /> হাফেজ
                    </span>
                  )}
                </div>
                <p className="text-sm text-emerald-300 font-medium">
                  {student.banglaName} • {student.arabicName || ''}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-800/80 text-emerald-100 font-semibold uppercase">
                    {student.department}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/15 text-slate-200 font-medium">
                    {student.residential === 'residential' ? 'আবাসিক ছাত্র' : 'অনাবাসিক'}
                  </span>
                  <span className="text-slate-300">
                    ভর্তি: {student.admissionDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQuickPaymentModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Receipt className="w-4 h-4" />
                <span>ফি গ্রহণ</span>
              </button>
              <button
                onClick={() => setIsHifzLogModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>সবক এন্ট্রি</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs inside modal */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-emerald-900/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('hifz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'hifz'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>৩০ পারা কুরআন ট্র্যাকার ({completedCount}/30)</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'fees'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>বেতন ও লেজার ({studentPayments.length} রসিদ)</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'attendance'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>হাজিরা ও সবক হিস্ট্রি</span>
            </button>

            <button
              onClick={() => setActiveTab('bio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'bio'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>অভিভাবক ও বিস্তারিত তথ্য</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: 30-Para Quran Memorization Grid */}
          {activeTab === 'hifz' && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    হিফজ অগ্রগতি সারসংক্ষেপ (Quran Memorization Summary)
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    মোট সম্পন্ন: <span className="text-emerald-700">{completedCount} পারা</span> • বাকি আছে: <span className="text-amber-700">{30 - completedCount} পারা</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    পারা কার্ডের ওপর ক্লিক করে মুখস্থ সম্পন্ন বা অসম্পন্ন হিসেবে টগল করুন।
                  </p>
                </div>

                <div className="sm:w-64">
                  <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                    <span>অগ্রগতি</span>
                    <span className="font-mono text-emerald-800">{percentage}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-emerald-200/70 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 30 Para Visual Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {QURAN_PARAS.map((para) => {
                  const isDone = completedParas.includes(para.number);
                  const isCurrent = student.currentPara === para.number;

                  return (
                    <button
                      key={para.number}
                      onClick={() => handleParaClick(para.number)}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                        isDone 
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm hover:bg-emerald-700'
                          : isCurrent
                          ? 'bg-amber-50 text-slate-900 border-2 border-amber-500 shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isDone 
                            ? 'bg-emerald-800 text-emerald-100'
                            : isCurrent
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {para.number}
                        </span>

                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        ) : isCurrent ? (
                          <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-amber-200 text-amber-900">
                            চলতি
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1">
                        <div className={`text-base font-bold font-serif leading-none ${isDone ? 'text-white' : 'text-slate-900'}`}>
                          {para.nameArabic}
                        </div>
                        <div className={`text-[10px] font-medium truncate mt-1 ${isDone ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {para.nameBengali}
                        </div>
                        <div className={`text-[9px] truncate mt-0.5 ${isDone ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {para.startSurah}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Fees & Payment Ledger */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              {/* Fee Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">মাসিক নিয়মিত ফি</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {settings.currencySymbol}{((student.monthlyTuitionFee || 0) + (student.monthlyFoodFee || 0) - (student.feeDiscount || 0)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    বেতন {settings.currencySymbol}{student.monthlyTuitionFee} + খাবার {settings.currencySymbol}{student.monthlyFoodFee} - ছাড় {settings.currencySymbol}{student.feeDiscount}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-semibold">মোট পরিশোধিত টাকা</div>
                  <div className="text-xl font-bold text-emerald-900 mt-1">
                    {settings.currencySymbol}{dueInfo.totalPaid.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    মোট {studentPayments.length} টি মানি রিসিট
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-xs text-amber-800 font-semibold">মোট বকেয়া (Due)</div>
                  <div className="text-xl font-bold text-amber-900 mt-1">
                    {settings.currencySymbol}{dueInfo.totalDue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    {dueInfo.totalDue > 0 ? 'দ্রুত পরিশোধের জন্য নোটিশ প্রদান করুন' : 'কোনো বকেয়া নেই'}
                  </div>
                </div>
              </div>

              {/* Payments History Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                  <span>পরিশোধের ইতিহাস ও মানি রিসিট (Receipts Ledger)</span>
                  <button
                    onClick={() => setIsQuickPaymentModalOpen(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                  >
                    + নতুন ফি এন্ট্রি
                  </button>
                </h4>

                {studentPayments.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl text-slate-500 text-xs">
                    এখনও কোনো ফি জমা দেওয়ার রেকর্ড নেই।
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">রসিদ নং</th>
                          <th className="py-2.5 px-3">মাস</th>
                          <th className="py-2.5 px-3">তারিখ</th>
                          <th className="py-2.5 px-3">পরিশোধ</th>
                          <th className="py-2.5 px-3">বকেয়া</th>
                          <th className="py-2.5 px-3">পদ্ধতি</th>
                          <th className="py-2.5 px-3 text-right">ভিউ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentPayments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{pay.receiptNo}</td>
                            <td className="py-2.5 px-3 font-medium">{pay.month}</td>
                            <td className="py-2.5 px-3 text-slate-500">{pay.paymentDate}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">{settings.currencySymbol}{pay.paidAmount.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-amber-700 font-semibold">
                              {pay.dueRemaining > 0 ? `${settings.currencySymbol}${pay.dueRemaining.toLocaleString()}` : 'পরিশোধ'}
                            </td>
                            <td className="py-2.5 px-3 capitalize">{pay.paymentMethod}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => setActivePaymentForReceipt(pay)}
                                className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold"
                              >
                                রসিদ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Daily Attendance & Sabak History */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">
                  দৈনিক সবক ও মূল্যায়ন বিবরণী (Daily Sabak Evaluations)
                </h4>
                <button
                  onClick={() => setIsHifzLogModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  + আজকের সবক যোগ করুন
                </button>
              </div>

              {studentHifzLogs.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl text-slate-500 text-xs">
                  এখনও কোনো দৈনিক সবক রেকর্ড করা হয়নি।
                </div>
              ) : (
                <div className="space-y-3">
                  {studentHifzLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" /> {log.date}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {log.sabakGrade}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-slate-500">সবক (নতুন পাঠ):</span>
                          <div className="font-bold text-slate-800">পারা {log.sabakPara || 'N/A'} • {log.sabakSurah} ({log.sabakAyahRange})</div>
                        </div>
                        <div>
                          <span className="text-slate-500">সবকী (সাম্প্রতিক রিভিশন):</span>
                          <div className="font-bold text-slate-800">পারা {log.sabaqiPara || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">আমুখতা / দোর:</span>
                          <div className="font-bold text-slate-800">{log.dhorJuz || 'N/A'}</div>
                        </div>
                      </div>

                      {log.teacherFeedback && (
                        <div className="text-xs text-emerald-900 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 mt-2">
                          <strong>উস্তাদের মন্তব্য:</strong> {log.teacherFeedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Bio & Guardian Info */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">পূর্ণ নাম:</span>
                  <div className="font-bold text-slate-900 text-sm">{student.fullName}</div>
                </div>
                <div>
                  <span className="text-slate-500">বাংলা নাম:</span>
                  <div className="font-bold text-slate-900 text-sm">{student.banglaName}</div>
                </div>
                <div>
                  <span className="text-slate-500">অভিভাবকের নাম:</span>
                  <div className="font-bold text-slate-900">{student.guardianName} ({student.guardianRelation})</div>
                </div>
                <div>
                  <span className="text-slate-500">যোগাযোগ নম্বর:</span>
                  <div className="font-bold text-slate-900 font-mono">{student.guardianPhone}</div>
                </div>
                <div>
                  <span className="text-slate-500">ঠিকানা:</span>
                  <div className="font-bold text-slate-900">{student.address}</div>
                </div>
                <div>
                  <span className="text-slate-500">রক্তের গ্রুপ:</span>
                  <div className="font-bold text-rose-700">{student.bloodGroup || 'O+'}</div>
                </div>
              </div>

              {student.notes && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-900">বিশেষ মন্তব্য / নোট:</span>
                  <p className="text-slate-700 mt-1">{student.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
