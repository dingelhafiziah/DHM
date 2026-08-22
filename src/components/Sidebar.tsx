import React from 'react';
import { 
  LayoutDashboard, Users, CreditCard, TrendingUp, 
  TrendingDown, Landmark, FileText, Settings, 
  Database, ShieldCheck, BookOpen, ChevronRight,
  LogOut, UserCircle2, Sparkles, CheckCircle2,
  Clock, Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen = (_open: boolean) => {} }) => {
  const { 
    activeTab, 
    setActiveTab, 
    activeSubTab, 
    setActiveSubTab,
    currentUser, 
    setIsAuthModalOpen,
    setIsFirebaseModalOpen,
    settings,
    payments,
    students
  } = useApp();

  const totalDuesCount = students.filter(s => s.status === 'active').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelBn: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      roles: ['admin', 'teacher', 'accountant'],
    },
    {
      id: 'students',
      label: 'Student Management',
      labelBn: 'ছাত্র ব্যবস্থাপনা',
      icon: Users,
      badge: `${students.filter(s => s.status === 'active').length}`,
      roles: ['admin', 'teacher', 'accountant'],
    },
    {
      id: 'fees',
      label: 'Fees Management',
      labelBn: 'ফি ও বেতন ব্যবস্থাপনা',
      icon: CreditCard,
      subItems: [
        { id: 'payment', label: 'Fee Payment', labelBn: 'বেতন গ্রহণ' },
        { id: 'due', label: 'Due List & Reminders', labelBn: 'বকেয়া তালিকা' },
        { id: 'receipt', label: 'Receipts & Vouchers', labelBn: 'মানি রিসিট' },
      ],
      roles: ['admin', 'accountant', 'teacher'],
    },
    {
      id: 'income',
      label: 'Income & Donations',
      labelBn: 'আয় ও দান-অনুদান',
      icon: TrendingUp,
      roles: ['admin', 'accountant'],
    },
    {
      id: 'expense',
      label: 'Expense & Salaries',
      labelBn: 'ব্যয় ও বেতন খরচ',
      icon: TrendingDown,
      roles: ['admin', 'accountant'],
    },
    {
      id: 'accounts',
      label: 'Accounts & Funds',
      labelBn: 'হিসাব ও তহবিল',
      icon: Landmark,
      roles: ['admin', 'accountant'],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      labelBn: 'রিপোর্ট ও বিবরণী',
      icon: FileText,
      roles: ['admin', 'accountant', 'teacher'],
    },
    {
      id: 'settings',
      label: 'Settings',
      labelBn: 'সেটিংস ও প্রোফাইল',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  const handleNavClick = (tabId: string, subTab?: string) => {
    setActiveTab(tabId);
    setActiveSubTab(subTab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Madrasa Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-white tracking-tight truncate leading-tight">
                DINGEL HAFIZIA
              </h1>
              <p className="text-xs text-emerald-400 font-medium truncate">
                ডিঙ্গেল হাফিজিয়া মাদরাসা
              </p>
            </div>
          </div>

          <div className="mt-3.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-between text-xs">
            <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {settings.academicYear.split(' ')[0]} Academic
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">
              {settings.currencySymbol} {settings.currencyCode}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasSub = item.subItems && item.subItems.length > 0;
            const isRoleAllowed = item.roles.includes(currentUser.role);

            if (!isRoleAllowed) {
              return null;
            }

            return (
              <div key={item.id} className="space-y-1">
                <button
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id, hasSub ? (activeSubTab || item.subItems![0].id) : undefined)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30' 
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <div className="text-left truncate">
                      <div className="truncate font-semibold">{item.label}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {item.labelBn}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-emerald-400 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {hasSub && (
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-slate-500'}`} />
                    )}
                  </div>
                </button>

                {/* Sub items */}
                {hasSub && isActive && (
                  <div className="pl-9 pr-2 py-1 space-y-1 bg-slate-950/30 rounded-xl my-1 border border-slate-800/40">
                    {item.subItems!.map((sub) => {
                      const isSubActive = activeSubTab === sub.id || (!activeSubTab && sub.id === item.subItems![0].id);
                      return (
                        <button
                          key={sub.id}
                          id={`subnav-btn-${sub.id}`}
                          onClick={() => handleNavClick(item.id, sub.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                            isSubActive
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          <span>{sub.label}</span>
                          <span className="text-[10px] text-slate-500">{sub.labelBn}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Firebase & Cloud Integration Button */}
          <div className="pt-4 px-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Cloud & Persistence
            </div>
            <button
              id="btn-firebase-sync"
              onClick={() => {
                setActiveTab('firebase');
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === 'firebase'
                  ? 'bg-amber-600/30 border border-amber-500 text-amber-200'
                  : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <Database className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-amber-200 truncate">Firebase Sync & Storage</div>
                <div className="text-[10px] text-amber-400/80 truncate">Auth • Firestore • Storage</div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>
          </div>
        </nav>

        {/* User Account & Role Switcher Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-xs">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-400 font-medium capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {currentUser.role === 'admin' ? 'Head Admin' : currentUser.role === 'teacher' ? 'Ustad (Teacher)' : 'Accountant'}
                </div>
              </div>
            </div>

            <button
              id="btn-switch-user"
              onClick={() => setIsAuthModalOpen(true)}
              title="Switch user or role"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors"
            >
              <UserCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
