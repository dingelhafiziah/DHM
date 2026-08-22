import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, User, FeePayment, IncomeRecord, ExpenseRecord, 
  Account, AccountTransfer, MadrasaSettings, HifzDailyLog,
  AttendanceRecord, UserRole
} from '../types';
import { 
  INITIAL_STUDENTS, INITIAL_USERS, INITIAL_ACCOUNTS, 
  INITIAL_PAYMENTS, INITIAL_INCOME, INITIAL_EXPENSES, 
  INITIAL_SETTINGS, INITIAL_HIFZ_LOGS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  users: User[];
  students: Student[];
  payments: FeePayment[];
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  accounts: Account[];
  transfers: AccountTransfer[];
  settings: MadrasaSettings;
  hifzLogs: HifzDailyLog[];
  
  // Navigation & Active View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubTab?: string;
  setActiveSubTab: (subTab?: string) => void;
  
  // Modals & triggers
  activeStudentForDetails: Student | null;
  setActiveStudentForDetails: (student: Student | null) => void;
  activePaymentForReceipt: FeePayment | null;
  setActivePaymentForReceipt: (payment: FeePayment | null) => void;
  isQuickPaymentModalOpen: boolean;
  setIsQuickPaymentModalOpen: (open: boolean) => void;
  isAddStudentModalOpen: boolean;
  setIsAddStudentModalOpen: (open: boolean) => void;
  isHifzLogModalOpen: boolean;
  setIsHifzLogModalOpen: (open: boolean) => void;
  isFirebaseModalOpen: boolean;
  setIsFirebaseModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // User Management
  switchUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  
  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  toggleParaCompletion: (studentId: string, paraNumber: number) => void;
  recordAttendance: (studentId: string, record: AttendanceRecord) => void;
  recordHifzDailyLog: (log: Omit<HifzDailyLog, 'id'>) => void;
  
  // Fees Actions
  recordFeePayment: (payment: Omit<FeePayment, 'id' | 'receiptNo'>) => FeePayment;
  deletePayment: (id: string) => void;
  calculateStudentDue: (studentId: string) => { totalBilled: number; totalPaid: number; totalDue: number; monthDues: { month: string; amount: number }[] };
  
  // Income & Expense Actions
  addIncome: (income: Omit<IncomeRecord, 'id' | 'voucherNo'>) => IncomeRecord;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'voucherNo'>) => ExpenseRecord;
  deleteExpense: (id: string) => void;
  
  // Accounts & Transfers
  addAccount: (account: Omit<Account, 'id'>) => void;
  transferFunds: (fromAccountId: string, toAccountId: string, amount: number, reason: string) => void;
  
  // Settings & System
  updateSettings: (newSettings: Partial<MadrasaSettings>) => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonData: string) => boolean;
  resetToDefaultData: () => void;
  
  // Toast notifications
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'dingel_hafizia_users_clean_v3',
  CURRENT_USER: 'dingel_hafizia_current_user_clean_v3',
  STUDENTS: 'dingel_hafizia_students_clean_v3',
  PAYMENTS: 'dingel_hafizia_payments_clean_v3',
  INCOMES: 'dingel_hafizia_incomes_clean_v3',
  EXPENSES: 'dingel_hafizia_expenses_clean_v3',
  ACCOUNTS: 'dingel_hafizia_accounts_clean_v3',
  SETTINGS: 'dingel_hafizia_settings_clean_v3',
  HIFZ_LOGS: 'dingel_hafizia_hifz_logs_clean_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState<FeePayment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [incomes, setIncomes] = useState<IncomeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCOMES);
    return saved ? JSON.parse(saved) : INITIAL_INCOME;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transfers, setTransfers] = useState<AccountTransfer[]>([]);

  const [settings, setSettings] = useState<MadrasaSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [hifzLogs, setHifzLogs] = useState<HifzDailyLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HIFZ_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_HIFZ_LOGS;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);

  // Modals
  const [activeStudentForDetails, setActiveStudentForDetails] = useState<Student | null>(null);
  const [activePaymentForReceipt, setActivePaymentForReceipt] = useState<FeePayment | null>(null);
  const [isQuickPaymentModalOpen, setIsQuickPaymentModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isHifzLogModalOpen, setIsHifzLogModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.HIFZ_LOGS, JSON.stringify(hifzLogs)); }, [hifzLogs]);

  // Switch user
  const switchUser = (user: User) => {
    setCurrentUser(user);
    showToast(`Switched account to ${user.name} (${user.designation})`, 'info');
  };

  const switchRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched to ${role.toUpperCase()} mode (${found.name})`, 'info');
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Added staff/user: ${newUser.name}`);
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Student ${newStudent.fullName} (${newStudent.rollNo}) admitted successfully!`);
    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    if (activeStudentForDetails && activeStudentForDetails.id === id) {
      setActiveStudentForDetails(prev => prev ? { ...prev, ...data } : null);
    }
    showToast('Student record updated successfully.');
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (activeStudentForDetails?.id === id) {
      setActiveStudentForDetails(null);
    }
    showToast('Student record deleted.', 'info');
  };

  const toggleParaCompletion = (studentId: string, paraNumber: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const completed = s.completedParas || [];
        const exists = completed.includes(paraNumber);
        const updated = exists 
          ? completed.filter(p => p !== paraNumber)
          : [...completed, paraNumber].sort((a, b) => a - b);
        
        const isNowFullHafiz = updated.length === 30;
        return {
          ...s,
          completedParas: updated,
          status: isNowFullHafiz ? 'graduated' : s.status
        };
      }
      return s;
    }));

    if (activeStudentForDetails?.id === studentId) {
      setActiveStudentForDetails(prev => {
        if (!prev) return null;
        const completed = prev.completedParas || [];
        const exists = completed.includes(paraNumber);
        const updated = exists 
          ? completed.filter(p => p !== paraNumber)
          : [...completed, paraNumber].sort((a, b) => a - b);
        return { ...prev, completedParas: updated };
      });
    }
  };

  const recordAttendance = (studentId: string, record: AttendanceRecord) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const existing = s.attendanceHistory || [];
        const filtered = existing.filter(a => a.date !== record.date);
        return {
          ...s,
          attendanceHistory: [record, ...filtered]
        };
      }
      return s;
    }));
    showToast(`Attendance marked for ${record.date}`);
  };

  const recordHifzDailyLog = (logData: Omit<HifzDailyLog, 'id'>) => {
    const newLog: HifzDailyLog = {
      ...logData,
      id: `log-${Date.now()}`
    };
    setHifzLogs(prev => [newLog, ...prev]);

    // Update student's last sabak
    updateStudent(logData.studentId, {
      lastSabakSurah: logData.sabakSurah,
      lastSabakAyah: logData.sabakAyahRange,
      lastSabakGrade: logData.sabakGrade,
      currentPara: logData.sabakPara || 1
    });

    showToast('Daily Sabak evaluation saved successfully!');
  };

  // Fees Actions
  const recordFeePayment = (paymentData: Omit<FeePayment, 'id' | 'receiptNo'>): FeePayment => {
    const receiptCount = payments.length + 1;
    const year = new Date().getFullYear();
    const receiptNo = `DHA-REC-${year}-${String(receiptCount).padStart(4, '0')}`;

    const newPayment: FeePayment = {
      ...paymentData,
      id: `pay-rec-${Date.now()}`,
      receiptNo
    };

    setPayments(prev => [newPayment, ...prev]);

    // Automatically deposit to target account
    if (newPayment.paidAmount > 0 && newPayment.accountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === newPayment.accountId) {
          return { ...acc, balance: acc.balance + newPayment.paidAmount };
        }
        return acc;
      }));
    }

    showToast(`Payment collected! Receipt #${receiptNo} generated.`);
    return newPayment;
  };

  const deletePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment && payment.paidAmount > 0 && payment.accountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === payment.accountId) {
          return { ...acc, balance: Math.max(0, acc.balance - payment.paidAmount) };
        }
        return acc;
      }));
    }
    setPayments(prev => prev.filter(p => p.id !== id));
    showToast('Payment receipt deleted and account adjusted.', 'info');
  };

  const calculateStudentDue = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { totalBilled: 0, totalPaid: 0, totalDue: 0, monthDues: [] };

    const monthlyTotal = (student.monthlyTuitionFee || 0) + (student.monthlyFoodFee || 0) + (student.monthlyTransportFee || 0) - (student.feeDiscount || 0);
    const months = ['January 2026', 'February 2026'];
    const totalBilled = monthlyTotal * months.length;

    const studentPayments = payments.filter(p => p.studentId === studentId);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalDue = Math.max(0, totalBilled - totalPaid);

    const monthDues = months.map(m => {
      const paidForMonth = studentPayments
        .filter(p => p.month.includes(m.split(' ')[0]))
        .reduce((sum, p) => sum + p.paidAmount, 0);
      return {
        month: m,
        amount: Math.max(0, monthlyTotal - paidForMonth)
      };
    });

    return { totalBilled, totalPaid, totalDue, monthDues };
  };

  // Income Actions
  const addIncome = (incomeData: Omit<IncomeRecord, 'id' | 'voucherNo'>): IncomeRecord => {
    const count = incomes.length + 1;
    const voucherNo = `INC-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    
    const newIncome: IncomeRecord = {
      ...incomeData,
      id: `inc-${Date.now()}`,
      voucherNo
    };

    setIncomes(prev => [newIncome, ...prev]);

    // Deposit to account
    if (newIncome.accountId && newIncome.amount > 0) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === newIncome.accountId) {
          return { ...acc, balance: acc.balance + newIncome.amount };
        }
        return acc;
      }));
    }

    showToast(`Income of ${settings.currencySymbol}${newIncome.amount.toLocaleString()} recorded (#${voucherNo})`);
    return newIncome;
  };

  const deleteIncome = (id: string) => {
    const inc = incomes.find(i => i.id === id);
    if (inc && inc.accountId && inc.amount > 0) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === inc.accountId) {
          return { ...acc, balance: Math.max(0, acc.balance - inc.amount) };
        }
        return acc;
      }));
    }
    setIncomes(prev => prev.filter(i => i.id !== id));
    showToast('Income entry deleted.', 'info');
  };

  // Expense Actions
  const addExpense = (expenseData: Omit<ExpenseRecord, 'id' | 'voucherNo'>): ExpenseRecord => {
    const count = expenses.length + 1;
    const voucherNo = `EXP-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;

    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      voucherNo
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Deduct from account
    if (newExpense.accountId && newExpense.amount > 0) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === newExpense.accountId) {
          return { ...acc, balance: Math.max(0, acc.balance - newExpense.amount) };
        }
        return acc;
      }));
    }

    showToast(`Expense of ${settings.currencySymbol}${newExpense.amount.toLocaleString()} recorded (#${voucherNo})`);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    const exp = expenses.find(e => e.id === id);
    if (exp && exp.accountId && exp.amount > 0) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === exp.accountId) {
          return { ...acc, balance: acc.balance + exp.amount };
        }
        return acc;
      }));
    }
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense entry deleted.', 'info');
  };

  // Account Actions
  const addAccount = (accData: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...accData,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, newAcc]);
    showToast(`New account '${newAcc.name}' added.`);
  };

  const transferFunds = (fromAccountId: string, toAccountId: string, amount: number, reason: string) => {
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const toAcc = accounts.find(a => a.id === toAccountId);

    if (!fromAcc || !toAcc) {
      showToast('Selected accounts not found.', 'error');
      return;
    }

    if (fromAcc.balance < amount) {
      showToast(`Insufficient balance in ${fromAcc.name}. Available: ${settings.currencySymbol}${fromAcc.balance.toLocaleString()}`, 'error');
      return;
    }

    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      if (acc.id === toAccountId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    }));

    const newTransfer: AccountTransfer = {
      id: `tr-${Date.now()}`,
      fromAccountId,
      toAccountId,
      amount,
      date: new Date().toISOString().split('T')[0],
      reason,
      reference: `TRF-${Date.now().toString().slice(-6)}`
    };

    setTransfers(prev => [newTransfer, ...prev]);
    showToast(`Transferred ${settings.currencySymbol}${amount.toLocaleString()} from ${fromAcc.name} to ${toAcc.name}`);
  };

  // Settings
  const updateSettings = (newSettings: Partial<MadrasaSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Madrasa settings updated successfully.');
  };

  // Export / Import
  const exportDatabaseJSON = () => {
    const fullBackup = {
      app: "Dingel Hafizia Madrasa ERP",
      exportDate: new Date().toISOString(),
      settings,
      users,
      students,
      payments,
      incomes,
      expenses,
      accounts,
      hifzLogs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dingel_hafizia_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Database exported as JSON file.');
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.students && Array.isArray(parsed.students)) {
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.incomes) setIncomes(parsed.incomes);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.hifzLogs) setHifzLogs(parsed.hifzLogs);
        showToast('Database successfully restored from backup!');
        return true;
      }
      showToast('Invalid backup file format.', 'error');
      return false;
    } catch {
      showToast('Error reading JSON file.', 'error');
      return false;
    }
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setStudents(INITIAL_STUDENTS);
    setPayments(INITIAL_PAYMENTS);
    setIncomes(INITIAL_INCOME);
    setExpenses(INITIAL_EXPENSES);
    setAccounts(INITIAL_ACCOUNTS);
    setSettings(INITIAL_SETTINGS);
    setHifzLogs(INITIAL_HIFZ_LOGS);
    setTransfers([]);
    showToast('সকল আগের ডামি/নমুনা তথ্য মুছে ফেলা হয়েছে। নতুন তথ্যের জন্য প্রস্তুত। (All dummy data cleared)');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        students,
        payments,
        incomes,
        expenses,
        accounts,
        transfers,
        settings,
        hifzLogs,
        activeTab,
        setActiveTab,
        activeSubTab,
        setActiveSubTab,
        activeStudentForDetails,
        setActiveStudentForDetails,
        activePaymentForReceipt,
        setActivePaymentForReceipt,
        isQuickPaymentModalOpen,
        setIsQuickPaymentModalOpen,
        isAddStudentModalOpen,
        setIsAddStudentModalOpen,
        isHifzLogModalOpen,
        setIsHifzLogModalOpen,
        isFirebaseModalOpen,
        setIsFirebaseModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        switchUser,
        switchRole,
        addUser,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleParaCompletion,
        recordAttendance,
        recordHifzDailyLog,
        recordFeePayment,
        deletePayment,
        calculateStudentDue,
        addIncome,
        deleteIncome,
        addExpense,
        deleteExpense,
        addAccount,
        transferFunds,
        updateSettings,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToDefaultData,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
