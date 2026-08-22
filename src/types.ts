export type UserRole = 'admin' | 'teacher' | 'accountant';

export interface User {
  id: string;
  name: string;
  banglaName?: string;
  email: string;
  role: UserRole;
  phone?: string;
  designation: string;
  avatar?: string;
}

export type StudentDepartment = 'hafizia' | 'nazera' | 'noorani' | 'kitab';
export type StudentResidential = 'residential' | 'non_residential'; // আবাসিক / অনাবাসিক
export type StudentStatus = 'active' | 'leave' | 'graduated';
export type MemorizationGrade = 'Mumtaz (Excellent)' | 'Jayyid Jiddan (Very Good)' | 'Jayyid (Good)' | 'Maqbool (Pass)' | 'Daif (Needs Revision)';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'leave' | 'late';
  note?: string;
}

export interface HifzDailyLog {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  sabakPara?: number;
  sabakSurah: string;
  sabakAyahRange: string; // e.g. "Ayah 1 - 25" or "1/2 Page"
  sabakGrade: MemorizationGrade;
  sabaqiPara?: number; // Recent revision (সবকী)
  dhorJuz?: string; // Manzil / full Quran revision (আমুখতা / খতম রিভিশন) e.g. "Para 1-3"
  teacherFeedback?: string;
  evaluatedBy?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  admissionNo: string;
  fullName: string;
  banglaName: string;
  arabicName?: string;
  department: StudentDepartment;
  residential: StudentResidential;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  whatsapp?: string;
  address: string;
  admissionDate: string; // YYYY-MM-DD
  dateOfBirth?: string;
  bloodGroup?: string;
  monthlyTuitionFee: number;
  monthlyFoodFee: number;
  monthlyTransportFee?: number;
  feeDiscount: number; // Scholarship / Waiver amount
  status: StudentStatus;
  
  // Hifz Progress
  currentPara: number; // 1 to 30
  completedParas: number[]; // e.g. [1, 2, 3, 29, 30]
  hifzStartDate?: string;
  hifzTargetDate?: string;
  lastSabakSurah?: string;
  lastSabakAyah?: string;
  lastSabakGrade?: MemorizationGrade;
  
  photoUrl?: string;
  notes?: string;
  attendanceHistory?: AttendanceRecord[];
}

export type FeeCategory = 'tuition' | 'food' | 'admission' | 'exam_books' | 'annual' | 'session' | 'other';

export interface FeeItem {
  category: FeeCategory;
  name: string;
  amount: number;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  studentBanglaName: string;
  rollNo: string;
  department: StudentDepartment;
  residential: StudentResidential;
  guardianName: string;
  guardianPhone: string;
  month: string; // e.g. "January 2026", or "Jan-Feb 2026"
  year: number;
  items: FeeItem[];
  subtotal: number;
  discount: number;
  totalPayable: number;
  paidAmount: number;
  dueRemaining: number;
  paymentMethod: 'cash' | 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'bank' | 'other';
  accountId: string; // Destination fund/account
  paymentDate: string; // YYYY-MM-DD
  receivedBy: string;
  notes?: string;
}

export type IncomeCategory = 
  | 'donation' // সাধারণ দান
  | 'zakat' // যাকাত
  | 'lillah_fitra' // লিল্লাহ ও ফিতরা
  | 'monthly_donor' // স্থায়ী সদস্য চাঁদা
  | 'student_fees' // ছাত্র বেতন (স্বয়ংক্রিয়)
  | 'grant' // সরকারি/বেসরকারি অনুদান
  | 'qurbani_skin' // কোরবানির চামড়া বিক্রয়
  | 'other'; // অন্যান্য

export interface IncomeRecord {
  id: string;
  voucherNo: string;
  category: IncomeCategory;
  title: string;
  donorName: string;
  donorPhone?: string;
  donorAddress?: string;
  amount: number;
  accountId: string;
  date: string; // YYYY-MM-DD
  description?: string;
  receivedBy: string;
}

export type ExpenseCategory = 
  | 'salary' // শিক্ষক ও স্টাফ বেতন
  | 'bazar_food' // বোর্ডিং মেস ও বাজার খরচ
  | 'utilities' // বিদ্যুৎ, গ্যাস ও ইন্টারনেট
  | 'rent_infra' // মাদরাসা ভবন সংস্কার ও ভাড়া
  | 'books_stationery' // কিতাব ও খাতা-কলম
  | 'events_exam' // বার্ষিক মাহফিল ও পরীক্ষা
  | 'medical' // ছাত্রদের চিকিৎসা ও ওষুধ
  | 'miscellaneous'; // বিবিধ খরচ

export interface ExpenseRecord {
  id: string;
  voucherNo: string;
  category: ExpenseCategory;
  title: string;
  payeeName: string;
  amount: number;
  accountId: string;
  date: string; // YYYY-MM-DD
  description?: string;
  approvedBy: string;
}

export interface Account {
  id: string;
  name: string;
  nameBn: string;
  type: 'cash' | 'bank' | 'mfs' | 'fund';
  accountNumber?: string;
  bankName?: string;
  balance: number;
  description?: string;
}

export interface AccountTransfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  reason: string;
  reference?: string;
}

export interface MadrasaSettings {
  name: string;
  banglaName: string;
  arabicName: string;
  slogan: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  regNo: string;
  establishedYear: string;
  principalName: string;
  principalDesignation: string;
  accountantName: string;
  currencySymbol: string;
  currencyCode: string;
  academicYear: string;
}
