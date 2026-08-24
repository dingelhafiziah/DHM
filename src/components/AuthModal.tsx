import React, { useState } from 'react';
import { X, ShieldCheck, Key, Lock, Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { isFirebaseConfigured } from '../lib/firebase';
import { signInWithFirebaseCredentials } from '../lib/firebaseAuth';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, users, currentUser, switchUser, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    switchUser(targetUser);
    setIsAuthModalOpen(false);
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast('ইমেইল ও পাসওয়ার্ড দিন।', 'error');
      return;
    }

    setIsSigningIn(true);

    try {
      if (isFirebaseConfigured) {
        const authenticatedUser = await signInWithFirebaseCredentials(email, password);
        switchUser(authenticatedUser);
        setIsAuthModalOpen(false);
        showToast(`${authenticatedUser.name} হিসেবে নিরাপদে লগইন হয়েছে।`, 'success');
      } else {
        // Keep the existing local demo mode until Firebase environment values are configured.
        const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!found) {
          throw new Error('Firebase is not configured yet. Demo mode only accepts an existing local user email.');
        }
        switchUser(found);
        setIsAuthModalOpen(false);
        showToast('লোকাল ডেমো লগইন সফল। Firebase চালু হলে আসল Authentication ব্যবহার হবে।', 'info');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'লগইন ব্যর্থ হয়েছে।';
      showToast(message, 'error');
    } finally {
      setIsSigningIn(false);
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
              <h3 className="font-bold text-slate-900 text-base">নিরাপদ লগইন (Secure Authentication)</h3>
              <p className="text-xs text-slate-500">অ্যাডমিন বা শিক্ষক একাউন্টে প্রবেশ করুন</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`p-3 rounded-2xl border text-xs ${
          isFirebaseConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2 font-bold">
            <Key className="w-4 h-4" />
            {isFirebaseConfigured ? 'Firebase Authentication Active' : 'Firebase Configuration Pending'}
          </div>
          <p className="mt-1 leading-5">
            {isFirebaseConfigured
              ? 'লগইন এখন Firebase Authentication এবং Firestore user profile দিয়ে যাচাই হবে।'
              : 'Firebase-এর VITE_FIREBASE_* configuration যোগ করার পর আসল secure login চালু হবে।'}
          </p>
        </div>

        {/* Local quick switch is intentionally retained only as a temporary fallback/demo path. */}
        {!isFirebaseConfigured && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              লোকাল ডেমো একাউন্ট:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {(['admin', 'teacher'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    handleQuickLogin(role);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    currentUser.role === role
                      ? 'border-emerald-600 bg-emerald-50/70'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {role === 'admin' ? 'মুহতামিম / Admin' : 'উস্তাদ / Teacher'}
                    </span>
                    {currentUser.role === role && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {role === 'admin' ? 'সব মডিউল ও হিসাব নিকাশ' : 'ছাত্র ও হিফজ মূল্যায়ন'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleFormLogin} className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">ইউজার ইমেইল (User Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
                autoComplete="username"
                disabled={isSigningIn}
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
                autoComplete="current-password"
                disabled={isSigningIn}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-60"
          >
            {isSigningIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            <span>{isSigningIn ? 'লগইন হচ্ছে...' : 'লগইন নিশ্চিত করুন (Sign In)'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
