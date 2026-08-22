import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Key, Lock, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, users, currentUser, switchUser, showToast } = useApp();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    switchUser(targetUser);
    setIsAuthModalOpen(false);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchUser(found);
      setIsAuthModalOpen(false);
    } else {
      // Fallback
      handleQuickLogin(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Authentication & Role Switch</h3>
              <p className="text-xs text-slate-500">অ্যাডমিন বা শিক্ষক একাউন্টে প্রবেশ করুন</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Demo Switch */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            দ্রুত একাউন্ট নির্বাচন (1-Click Switch):
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickLogin('admin')}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                currentUser.role === 'admin' 
                  ? 'border-emerald-600 bg-emerald-50/70' 
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">মুহতামিম / Admin</span>
                {currentUser.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">সব মডিউল ও হিসাব নিকাশ</p>
            </button>

            <button
              onClick={() => handleQuickLogin('teacher')}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                currentUser.role === 'teacher' 
                  ? 'border-emerald-600 bg-emerald-50/70' 
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">উস্তাদ / Teacher</span>
                {currentUser.role === 'teacher' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">ছাত্র ও হিফজ মূল্যায়ন</p>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleFormLogin} className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">ইউজার ইমেইল (User Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@dingelhafizia.edu.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>লগইন নিশ্চিত করুন (Sign In)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
