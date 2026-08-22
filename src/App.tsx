import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { FeesManagement } from './components/FeesManagement';
import { IncomeManagement } from './components/IncomeManagement';
import { ExpenseManagement } from './components/ExpenseManagement';
import { AccountsManagement } from './components/AccountsManagement';
import { ReportsManagement } from './components/ReportsManagement';
import { SettingsManagement } from './components/SettingsManagement';
import { FirebaseManagement } from './components/FirebaseManagement';
import { StudentDetailModal } from './components/StudentDetailModal';
import { MoneyReceiptModal } from './components/MoneyReceiptModal';
import { QuickPaymentModal } from './components/QuickPaymentModal';
import { HifzTrackerModal } from './components/HifzTrackerModal';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { 
    activeTab, 
    activeStudentForDetails, 
    setActiveStudentForDetails,
    activePaymentForReceipt,
    setActivePaymentForReceipt,
    isQuickPaymentModalOpen,
    setIsQuickPaymentModalOpen,
    isHifzLogModalOpen,
    setIsHifzLogModalOpen,
    toastMessage,
    showToast
  } = useApp();

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header setMobileOpen={setMobileOpen} />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'students' && <StudentManagement />}
            {activeTab === 'fees' && <FeesManagement />}
            {activeTab === 'income' && <IncomeManagement />}
            {activeTab === 'expense' && <ExpenseManagement />}
            {activeTab === 'accounts' && <AccountsManagement />}
            {activeTab === 'reports' && <ReportsManagement />}
            {activeTab === 'settings' && <SettingsManagement />}
            {activeTab === 'firebase' && <FirebaseManagement />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {activeStudentForDetails && (
        <StudentDetailModal 
          student={activeStudentForDetails} 
          onClose={() => setActiveStudentForDetails(null)} 
        />
      )}

      {activePaymentForReceipt && (
        <MoneyReceiptModal 
          payment={activePaymentForReceipt} 
          onClose={() => setActivePaymentForReceipt(null)} 
        />
      )}

      {isQuickPaymentModalOpen && (
        <QuickPaymentModal 
          onClose={() => setIsQuickPaymentModalOpen(false)} 
        />
      )}

      {isHifzLogModalOpen && (
        <HifzTrackerModal 
          onClose={() => setIsHifzLogModalOpen(false)} 
        />
      )}

      <AuthModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${
            toastMessage.type === 'error' 
              ? 'bg-rose-900 text-white border-rose-800' 
              : toastMessage.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-emerald-900 text-white border-emerald-800'
          }`}>
            {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
