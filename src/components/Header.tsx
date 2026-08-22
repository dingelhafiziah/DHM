import React from 'react';
import { 
  Menu, PlusCircle, Search, Sparkles, 
  Calendar, Bell, BookOpen, Shield,
  CreditCard, UserPlus, HeartHandshake,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  setMobileOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen = (_open: boolean) => {} }) => {
  const { 
    currentUser, 
    settings, 
    setIsQuickPaymentModalOpen, 
    setIsAddStudentModalOpen,
    setIsHifzLogModalOpen,
    setIsAuthModalOpen,
    setActiveTab,
    students,
    payments
  } = useApp();

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header 
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile hamburger & Madrasa Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="btn-mobile-menu"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight truncate">
              {settings.banglaName}
            </h2>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {settings.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block truncate">
            {settings.address} • Reg: {settings.regNo}
          </p>
        </div>
      </div>

      {/* Right: Quick Actions & Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium">{today}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-semibold">1447 Hijri</span>
        </div>

        {/* Quick Sabak Button */}
        <button
          id="btn-quick-sabak"
          onClick={() => setIsHifzLogModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs"
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>দৈনিক সবক (Hifz)</span>
        </button>

        {/* Quick Fee Collect Button */}
        <button
          id="btn-quick-fee"
          onClick={() => setIsQuickPaymentModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm shadow-emerald-700/20 active:scale-98"
        >
          <Receipt className="w-4 h-4" />
          <span className="hidden sm:inline">বেতন গ্রহণ</span>
          <span className="sm:hidden">ফি</span>
        </button>

        {/* New Student */}
        {currentUser.role === 'admin' && (
          <button
            id="btn-quick-add-student"
            onClick={() => setIsAddStudentModalOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>নতুন ভর্তি</span>
          </button>
        )}

        {/* Role Switcher Pill */}
        <button
          id="btn-header-role-badge"
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-colors text-xs"
          title="Click to switch between Admin and Teacher login"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <div className="text-left">
            <span className="font-bold text-slate-800 capitalize block leading-none text-[11px]">
              {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'teacher' ? 'Teacher' : 'Accountant'}
            </span>
            <span className="text-[10px] text-slate-500 block leading-tight truncate max-w-[80px]">
              {currentUser.name.split(' ')[0]}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
