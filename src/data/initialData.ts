import { Student, User, FeePayment, IncomeRecord, ExpenseRecord, Account, MadrasaSettings, HifzDailyLog } from '../types';

export const INITIAL_SETTINGS: MadrasaSettings = {
  name: "Dingel Hafizia Madrasa & Quran Academy",
  banglaName: "ডিঙ্গেল হাফিজিয়া মাদরাসা ও হিফজুল কুরআন একাডেমি",
  arabicName: "مدرسة دينغل الحفظية وأكاديمية القرآن الكريم",
  slogan: "Excellence in Quranic Memorization, Islamic Values & Modern Discipline",
  address: "Vill: Dingel, PO: Lalgola, Dist: Murshidabad, West Bengal, India - PIN: 742148",
  phone: "+91 98321 45678, +91 97330 87654",
  email: "dingel.hafizia@madrasa.in",
  website: "www.dingelhafizia.org",
  regNo: "WB-WAQF/DNG-2018/786",
  establishedYear: "2018",
  principalName: "Maulana Mufti Mosaraf Hossain Qasmi",
  principalDesignation: "Muhtamim & Principal",
  accountantName: "Hafiz Muhammad Nurul Islam",
  currencySymbol: "₹",
  currencyCode: "INR",
  academicYear: "2026-2027 (1447-1448 Hijri)",
};

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin-1",
    name: "Mufti Mosaraf Hossain Qasmi",
    banglaName: "মুফতী মোশাররফ হোসাইন কাসেমী",
    email: "admin@dingelhafizia.in",
    role: "admin",
    phone: "+91 98321 45678",
    designation: "Muhtamim / Head Principal (মুহতামিম)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-teacher-1",
    name: "Hafiz Qari Abdullah Al-Mahmud",
    banglaName: "হাফেজ ক্বারী আব্দুল্লাহ আল-মাহমুদ",
    email: "teacher@dingelhafizia.in",
    role: "teacher",
    phone: "+91 97330 11223",
    designation: "Chief Hifz Instructor (উস্তাদুল হিফজ)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-teacher-2",
    name: "Hafiz Zubair Ahmed",
    banglaName: "হাফেজ যুবায়ের আহমেদ",
    email: "zubair@dingelhafizia.in",
    role: "teacher",
    phone: "+91 98324 44556",
    designation: "Nazera & Noorani Head Teacher (নাজেরা ও নূরানী শিক্ষক)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-acc-1",
    name: "Nurul Islam (Accountant)",
    banglaName: "নুরুল ইসলাম (হিসাবরক্ষক)",
    email: "accounts@dingelhafizia.in",
    role: "accountant",
    phone: "+91 94340 99887",
    designation: "Cashier & Chief Accountant (ক্যাশিয়ার ও হিসাবরক্ষক)",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  }
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "acc-cash",
    name: "Cash in Hand (Petty Cash Counter)",
    nameBn: "হাতে নগদ ক্যাশ (কাউন্টার)",
    type: "cash",
    balance: 0,
    description: "Madrasa office cash counter for daily fee collection, donation receipt & instant expenses",
  },
  {
    id: "acc-sbi-bank",
    name: "State Bank of India (SBI) Current A/C",
    nameBn: "স্টেট ব্যাঙ্ক অফ ইন্ডিয়া (SBI)",
    type: "bank",
    bankName: "State Bank of India (SBI) - Lalgola Branch",
    accountNumber: "3892010049281 (IFSC: SBIN0001234)",
    balance: 0,
    description: "Main institutional checking account for institutional funds, teacher salaries & fees",
  },
  {
    id: "acc-pnb-bank",
    name: "Punjab National Bank (PNB) A/C",
    nameBn: "পাঞ্জাব ন্যাশনাল ব্যাঙ্ক (PNB)",
    type: "bank",
    bankName: "Punjab National Bank (PNB)",
    accountNumber: "1098002100045672 (IFSC: PUNB0109800)",
    balance: 0,
    description: "Secondary institutional savings account for emergency and development reserves",
  },
  {
    id: "acc-upi-merchant",
    name: "UPI / Google Pay / PhonePe / Paytm",
    nameBn: "UPI / ফোনপে / গুগল পে / পেটিএম",
    type: "mfs",
    accountNumber: "9832145678@sbi / QR Code",
    balance: 0,
    description: "Direct UPI payments from guardians across India and online donor contributions",
  },
  {
    id: "acc-zakat-fund",
    name: "Zakat & Lillah Designated Fund",
    nameBn: "যাকাত, ফেতরা ও লিল্লাহ তহবিল",
    type: "fund",
    balance: 0,
    description: "Strictly reserved for orphan/destitute Indian students boarding, food & medical welfare",
  },
  {
    id: "acc-building-fund",
    name: "Building & Development Fund",
    nameBn: "মাদরাসা উন্নয়ন ও ভবন নির্মাণ তহবিল",
    type: "fund",
    balance: 0,
    description: "Mosque expansion, classroom infrastructure & residential hostel construction",
  }
];

// Clean / Blank initial records for fresh data entry by user
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_PAYMENTS: FeePayment[] = [];
export const INITIAL_INCOME: IncomeRecord[] = [];
export const INITIAL_EXPENSES: ExpenseRecord[] = [];
export const INITIAL_HIFZ_LOGS: HifzDailyLog[] = [];
