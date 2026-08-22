import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, BookOpen, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FeePayment } from '../types';

interface MoneyReceiptModalProps {
  payment: FeePayment;
  onClose: () => void;
}

export const MoneyReceiptModal: React.FC<MoneyReceiptModalProps> = ({ payment, onClose }) => {
  const { settings, showToast } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleCopySlip = () => {
    const text = `${settings.name.toUpperCase()} MONEY RECEIPT
Receipt No: ${payment.receiptNo}
Student: ${payment.studentName} (${payment.studentBanglaName})
Roll: ${payment.rollNo} | Dept: ${payment.department.toUpperCase()}
Month: ${payment.month}
Total Paid: ${settings.currencySymbol}${payment.paidAmount.toLocaleString()}
Due Remaining: ${settings.currencySymbol}${payment.dueRemaining.toLocaleString()}
Payment Method: ${payment.paymentMethod.toUpperCase()}
Date: ${payment.paymentDate}
Received by: ${payment.receivedBy}`;

    navigator.clipboard.writeText(text);
    showToast('Receipt details copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 print:border-none print:shadow-none print:p-4">
        {/* Modal Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              অফিসিয়াল ফি রসিদ / ক্যাশ মেমো (Money Receipt)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySlip}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">কপি টেক্সট</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-700/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট রসিদ (Print)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT TEMPLATE (Dual Copy Format: Office & Student copy) */}
        <div className="space-y-6 printable-receipt-area">
          {/* SLIP 1: STUDENT COPY (ছাত্র কপি) */}
          <div className="border-2 border-slate-800 rounded-2xl p-5 sm:p-6 bg-amber-50/20 relative">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-[10px] font-bold text-emerald-900 uppercase">
              ছাত্র কপি (Student Copy)
            </div>

            {/* Madrasa Header */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <div className="text-xs font-serif font-bold text-emerald-900 tracking-wider">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1">
                {settings.banglaName}
              </h2>
              <p className="text-xs font-bold text-emerald-800">{settings.name}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {settings.address} • ফোন: {settings.phone}
              </p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-slate-900 text-white font-bold text-xs">
                বেতন ও ফি আদায় রসিদ (Money Receipt)
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">রসিদ নং:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{payment.receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">তারিখ:</span>
                <span className="font-semibold text-slate-800">{payment.paymentDate}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ছাত্রের রোল:</span>
                <span className="font-mono font-bold text-emerald-800">{payment.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">বিভাগ:</span>
                <span className="font-bold capitalize text-slate-800">{payment.department}</span>
              </div>
            </div>

            {/* Student Info */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500">ছাত্রের নাম:</span>
                <strong className="text-slate-900 ml-1.5">{payment.studentName} ({payment.studentBanglaName})</strong>
              </div>
              <div>
                <span className="text-slate-500">অভিভাবক ও ফোন:</span>
                <strong className="text-slate-900 ml-1.5">{payment.guardianName} • {payment.guardianPhone}</strong>
              </div>
            </div>

            {/* Fee Items Table */}
            <div className="mt-3 border border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-800 font-bold text-slate-800">
                  <tr>
                    <th className="py-1.5 px-3">ক্র.নং</th>
                    <th className="py-1.5 px-3">ফি-এর বিবরণ (Fee Description)</th>
                    <th className="py-1.5 px-3">মাস/সেশন</th>
                    <th className="py-1.5 px-3 text-right">পরিমাণ ({settings.currencySymbol} {settings.currencyCode})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {payment.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 px-3">{idx + 1}</td>
                      <td className="py-1.5 px-3 font-medium">{item.name}</td>
                      <td className="py-1.5 px-3 text-slate-600">{payment.month}</td>
                      <td className="py-1.5 px-3 text-right font-bold">{settings.currencySymbol}{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-800 bg-slate-50 font-bold text-slate-900">
                  {payment.discount > 0 && (
                    <tr>
                      <td colSpan={3} className="py-1 px-3 text-right text-emerald-800">বিশেষ ছাড় / লিল্লাহ বৃত্তি:</td>
                      <td className="py-1 px-3 text-right text-emerald-800">-{settings.currencySymbol}{payment.discount.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="border-t border-slate-300">
                    <td colSpan={3} className="py-1.5 px-3 text-right font-extrabold text-slate-900">সর্বমোট প্রদেয় টাকা:</td>
                    <td className="py-1.5 px-3 text-right font-black text-sm">{settings.currencySymbol}{payment.totalPayable.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-emerald-50/80 text-emerald-950">
                    <td colSpan={3} className="py-1.5 px-3 text-right font-extrabold">জমা / আদায়কৃত টাকা (Paid Amount):</td>
                    <td className="py-1.5 px-3 text-right font-black text-sm text-emerald-800">{settings.currencySymbol}{payment.paidAmount.toLocaleString()}</td>
                  </tr>
                  {payment.dueRemaining > 0 && (
                    <tr className="text-amber-900 bg-amber-50/60">
                      <td colSpan={3} className="py-1 px-3 text-right font-bold">অবশিষ্ট বকেয়া (Due Remaining):</td>
                      <td className="py-1 px-3 text-right font-bold">{settings.currencySymbol}{payment.dueRemaining.toLocaleString()}</td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>

            {/* In Words & Signatures */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-700">
              <div>
                <span className="font-semibold">পেমেন্ট মেথড:</span> <span className="capitalize font-bold text-emerald-800">{payment.paymentMethod.toUpperCase()}</span>
                {payment.notes && <span className="text-slate-500 ml-2">({payment.notes})</span>}
              </div>
            </div>

            <div className="mt-8 pt-4 flex items-end justify-between text-xs text-slate-700">
              <div className="text-center">
                <div className="border-t border-slate-800 pt-1 w-36 font-semibold">
                  আদায়কারীর স্বাক্ষর<br/>
                  <span className="text-[10px] text-slate-500 font-normal">{payment.receivedBy}</span>
                </div>
              </div>

              <div className="text-center">
                <div className="border-t border-slate-800 pt-1 w-36 font-semibold">
                  মুহতামিম / হিসাব নিরীক্ষক<br/>
                  <span className="text-[10px] text-slate-500 font-normal">{settings.principalName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dotted Divider for print cut */}
          <div className="border-t-2 border-dashed border-slate-400 my-4 text-center relative print:block">
            <span className="bg-white px-3 text-[10px] text-slate-400 font-mono -top-2.5 relative">
              ✂ কাস্টমার / অফিস অনুলিপি আলাদা করার স্থান
            </span>
          </div>

          {/* SLIP 2: OFFICE COPY (দপ্তর কপি) */}
          <div className="border-2 border-slate-600 rounded-2xl p-5 bg-slate-50/50 relative">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-slate-200 border border-slate-300 text-[10px] font-bold text-slate-800 uppercase">
              দপ্তর কপি (Office Copy)
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-300">
              <div>
                <h4 className="font-bold text-slate-900">{settings.banglaName}</h4>
                <p className="text-[10px] text-slate-600">রসিদ: {payment.receiptNo} • তারিখ: {payment.paymentDate}</p>
              </div>
              <div className="text-right pr-20">
                <span className="text-xs font-bold text-slate-900">ছাত্র: {payment.studentName} (রোল: {payment.rollNo})</span>
                <p className="text-[10px] text-slate-500">মাস: {payment.month}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs font-bold">
              <span>মোট আদায়: {settings.currencySymbol}{payment.paidAmount.toLocaleString()} ({payment.paymentMethod.toUpperCase()})</span>
              <span>বকেয়া: {settings.currencySymbol}{payment.dueRemaining.toLocaleString()}</span>
              <span>গৃহীতা: {payment.receivedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
