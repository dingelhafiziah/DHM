import React, { useState } from 'react';
import { X, Receipt, Search, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { FeeCategory, FeeItem, Student } from '../types';

interface QuickPaymentModalProps {
  onClose: () => void;
}

export const QuickPaymentModal: React.FC<QuickPaymentModalProps> = ({ onClose }) => {
  const { 
    students, 
    accounts, 
    settings, 
    currentUser, 
    recordFeePayment, 
    setActivePaymentForReceipt, 
    showToast 
  } = useApp();

  const activeStudents = students.filter(s => s.status === 'active');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(activeStudents[0]?.id || '');
  
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const [month, setMonth] = useState('February 2026');
  const [year, setYear] = useState(2026);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'bank' | 'other'>('cash');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [notes, setNotes] = useState('');

  // Fee items builder
  const [items, setItems] = useState<FeeItem[]>([
    { category: 'tuition', name: 'মাসিক টিউশন ও তালিম ফি (Tuition)', amount: selectedStudent?.monthlyTuitionFee || 1500 },
    { category: 'food', name: 'মেস ও খাবার ফি (Food/Boarding)', amount: selectedStudent?.monthlyFoodFee || 0 },
  ]);

  const [discount, setDiscount] = useState<number>(selectedStudent?.feeDiscount || 0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Update fee items when student changes
  const handleStudentSelect = (std: Student) => {
    setSelectedStudentId(std.id);
    const newItems: FeeItem[] = [
      { category: 'tuition', name: 'মাসিক টিউশন ও তালিম ফি (Tuition)', amount: std.monthlyTuitionFee || 1500 },
    ];
    if (std.monthlyFoodFee > 0) {
      newItems.push({ category: 'food', name: 'মেস ও খাবার ফি (Food/Boarding)', amount: std.monthlyFoodFee });
    }
    setItems(newItems);
    setDiscount(std.feeDiscount || 0);

    const sub = newItems.reduce((sum, item) => sum + item.amount, 0);
    const payable = Math.max(0, sub - (std.feeDiscount || 0));
    setPaidAmount(payable);
  };

  const handleAddItem = (category: FeeCategory, name: string, defaultAmt: number) => {
    setItems(prev => [...prev, { category, name, amount: defaultAmt }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemAmountChange = (index: number, val: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, amount: val } : item));
  };

  const subtotal = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalPayable = Math.max(0, subtotal - (Number(discount) || 0));
  const dueRemaining = Math.max(0, totalPayable - (Number(paidAmount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      showToast('Please select a valid student.', 'error');
      return;
    }

    if (paidAmount <= 0 && dueRemaining <= 0) {
      showToast('Please enter a valid amount.', 'error');
      return;
    }

    const newPayment = recordFeePayment({
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      studentBanglaName: selectedStudent.banglaName,
      rollNo: selectedStudent.rollNo,
      department: selectedStudent.department,
      residential: selectedStudent.residential,
      guardianName: selectedStudent.guardianName,
      guardianPhone: selectedStudent.guardianPhone,
      month,
      year,
      items,
      subtotal,
      discount: Number(discount) || 0,
      totalPayable,
      paidAmount: Number(paidAmount) || 0,
      dueRemaining,
      paymentMethod,
      accountId,
      paymentDate: new Date().toISOString().split('T')[0],
      receivedBy: currentUser.name,
      notes,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    onClose();
    // Open printable receipt automatically
    setActivePaymentForReceipt(newPayment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-700" />
              বেতন ও ফি আদায় ফরম (Fee Collection Form)
            </h3>
            <p className="text-xs text-slate-500">
              ফি গ্রহণ সাপেক্ষে স্বয়ংক্রিয় প্রিন্টযোগ্য মানি রিসিট প্রস্তুত হবে
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Step 1: Select Student */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">ছাত্র নির্বাচন করুন (Select Student) *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                const std = students.find(s => s.id === e.target.value);
                if (std) handleStudentSelect(std);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
            >
              {activeStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.rollNo} — {s.fullName} ({s.banglaName}) • {s.department.toUpperCase()} • {settings.currencySymbol}{s.monthlyTuitionFee + s.monthlyFoodFee - s.feeDiscount}/মাস
                </option>
              ))}
            </select>
          </div>

          {/* Month & Payment Account */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কোন মাসের ফি (Month) *</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
              >
                <option value="January 2026">January 2026</option>
                <option value="February 2026">February 2026</option>
                <option value="March 2026">March 2026</option>
                <option value="April 2026">April 2026</option>
                <option value="May 2026">May 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="Jan-Feb 2026 (2 Months)">Jan-Feb 2026 (2 Months)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পেমেন্ট মেথড (Payment Method) *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
              >
                <option value="cash">নগদ ক্যাশ (Cash Counter)</option>
                <option value="upi">UPI / QR Code</option>
                <option value="gpay">Google Pay</option>
                <option value="phonepe">PhonePe</option>
                <option value="paytm">Paytm</option>
                <option value="bank">ব্যাংক ট্রান্সফার (SBI/PNB Netbanking)</option>
                <option value="other">অন্যান্য (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">জমা হিসাব (Deposit Account) *</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.nameBn || acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ফি-এর খাত ও বিবরণ (Fee Items)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAddItem('exam_books', 'বার্ষিক পরীক্ষা ও সনদ ফি', 500)}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-emerald-800"
                >
                  + পরীক্ষা ফি
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('admission', 'নতুন সেশন ভর্তি ও কিতাব ফি', 1200)}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-emerald-800"
                >
                  + ভর্তি ফি
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setItems(prev => prev.map((it, i) => i === idx ? { ...it, name: newName } : it));
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{settings.currencySymbol}</span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleItemAmountChange(idx, Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-right"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>মোট ফি (Subtotal):</span>
                <span className="font-bold">{settings.currencySymbol}{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-800">
                <span>লিল্লাহ / এতিম বিশেষ ছাড় (Waiver / Discount):</span>
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs">{settings.currencySymbol}</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full pl-5 pr-2 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-xs font-bold text-right text-emerald-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-900 font-extrabold pt-1 border-t border-slate-200 text-sm">
                <span>সর্বমোট প্রদেয় (Net Payable):</span>
                <span>{settings.currencySymbol}{totalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Paid Amount & Due Remaining */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">
                আজকের জমা / আদায়কৃত টাকা (Amount Paid) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-emerald-700 text-sm">{settings.currencySymbol}</span>
                <input
                  type="number"
                  required
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-emerald-600 bg-white font-black text-lg text-emerald-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অবশিষ্ট বকেয়া (Due Remaining)
              </label>
              <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-black text-lg text-amber-800">
                {settings.currencySymbol}{dueRemaining.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">মন্তব্য / UPI ট্রানজেকশন রেফারেন্স (Notes & UPI Ref)</label>
            <input
              type="text"
              placeholder="e.g. PhonePe / GPay Ref: 405698124578 বা নগদ ক্যাশ কাউন্টারে জমা"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ফি গ্রহণ ও রসিদ প্রস্তুত করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
