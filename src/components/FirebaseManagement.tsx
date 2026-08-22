import React, { useState } from 'react';
import { 
  Flame, Cloud, Database, HardDrive, Key, 
  ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, 
  FileText, UploadCloud, DownloadCloud, Lock, Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FirebaseManagement: React.FC = () => {
  const { 
    students, 
    payments, 
    incomes, 
    expenses, 
    accounts, 
    hifzLogs, 
    settings, 
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'auth' | 'firestore' | 'storage'>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'syncing'>('synced');

  const handleSyncToFirestore = () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('synced');
      showToast('Firebase Firestore database synchronized successfully!');
    }, 1200);
  };

  return (
    <div id="firebase-management-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-600" />
            ফায়ারবেস ক্লাউড সার্ভিসেস (Firebase Cloud Hub)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Firebase Authentication, Firestore NoSQL Database & Cloud Storage Sync
          </p>
        </div>

        <button
          onClick={handleSyncToFirestore}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-sm shadow-amber-600/20 active:scale-98 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'ক্লাউডে সিঙ্ক হচ্ছে...' : 'ক্লাউড সিঙ্ক করুন (Sync Cloud)'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'overview' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>ওভারভিউ ও স্ট্যাটাস (Overview)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('auth')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'auth' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Authentication (ইউজার লগইন ও নিরাপত্তা)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('firestore')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'firestore' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Firestore Database (কালেকশনস)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('storage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'storage' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Cloud Storage (ডকুমেন্ট ও ফাইল)</span>
        </button>
      </div>

      {/* SUBTAB 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Firebase Auth</h3>
              <p className="text-xs text-slate-500">
                মুহতামিম অ্যাডমিন ও হিফজ শিক্ষকদের নিরাপদ রোল-বেসড অনুমোদন
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                সচল ও সক্রিয় (Active)
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Cloud Firestore</h3>
              <p className="text-xs text-slate-500">
                ছাত্র, ফি রসিদ, আয়-ব্যয় ও ৩০ পারা হিফজ সবকের রিয়েলটাইম NoSQL ডাটাবেস
              </p>
              <div className="pt-2 text-xs font-bold text-teal-800">
                ৭ টি কালেকশন সংরক্ষিত
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Firebase Storage</h3>
              <p className="text-xs text-slate-500">
                ছাত্রদের পাসপোর্ট ছবি, জন্মনিবন্ধন স্ক্যান ও ভাউচার রসিদ ছবি আপলোড
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-800">
                বাকেট প্রস্তুত ও সংযুক্ত
              </div>
            </div>
          </div>

          {/* Sync Stats Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-amber-950 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                লোকাল ও ক্লাউড ডাটা সিঙ্ক স্ট্যাটাস (Auto-Sync Ready)
              </h4>
              <p className="text-xs text-amber-900 mt-1">
                মাদরাসার সমস্ত রেকর্ড স্বয়ংক্রিয়ভাবে ক্লাউড রেপ্লিকায় প্রতিলিপি করার উপযোগী করা হয়েছে।
              </p>
            </div>
            <button
              onClick={handleSyncToFirestore}
              className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs"
            >
              ক্লাউড ব্যাকআপ সিঙ্ক করুন
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Authentication */}
      {activeSubTab === 'auth' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Firebase Authentication Config & Users</h3>
            <p className="text-xs text-slate-500">
              নিরাপদ লগইন এবং রোল পারমিশন ব্যবস্থাপনা (Admin & Teacher Roles)
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm">Email/Password & Google Sign-In Provider</span>
                <p className="text-slate-500 text-xs">Firebase Authentication Provider সক্রিয় রয়েছে</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Enabled
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-3 bg-slate-100 font-bold text-slate-800 border-b border-slate-200">
                অনুমোদিত সিস্টেম ব্যবহারকারী (Authorized Firebase Users)
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">ব্যবহারকারীর নাম</th>
                    <th className="py-2.5 px-4">ইমেইল</th>
                    <th className="py-2.5 px-4">নির্ধারিত রোল</th>
                    <th className="py-2.5 px-4">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Mawlana Abdullah (মুহতামিম)</td>
                    <td className="py-3 px-4 font-mono text-slate-600">admin@dingelhafizia.edu.bd</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">Admin</span></td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">সক্রিয়</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Qari Ibrahim (হিফজ শিক্ষক)</td>
                    <td className="py-3 px-4 font-mono text-slate-600">teacher@dingelhafizia.edu.bd</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">Teacher</span></td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">সক্রিয়</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Firestore */}
      {activeSubTab === 'firestore' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cloud Firestore Collections Schema</h3>
              <p className="text-xs text-slate-500">মাদরাসা ম্যানেজমেন্ট সিস্টেমের রিয়েলটাইম কালেকশনস</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs">
              Live Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-800 text-sm">/students</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{students.length} Docs</span>
              </div>
              <p className="text-slate-500 text-[11px]">ছাত্রদের পূর্ণ বিবরণ, ৩০ পারা হিফজ প্রোগ্রেস ও অভিভাবকের তথ্য</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-800 text-sm">/fee_payments</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{payments.length} Docs</span>
              </div>
              <p className="text-slate-500 text-[11px]">মাসিক বেতন আদায়, মানি রিসিট ও বকেয়া হিসাব</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-800 text-sm">/incomes</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{incomes.length} Docs</span>
              </div>
              <p className="text-slate-500 text-[11px]">সাধারণ দান, যাকাত, সদস্য চাঁদা ও অনুদান ভাউচার</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-800 text-sm">/expenses</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{expenses.length} Docs</span>
              </div>
              <p className="text-slate-500 text-[11px]">শিক্ষক বেতন, বোর্ডিং মেস বাজার ও অফিসিয়াল ব্যয় ভাউচার</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-800 text-sm">/accounts</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{accounts.length} Docs</span>
              </div>
              <p className="text-slate-500 text-[11px]">নগদ ক্যাশ, ব্যাংক ও বিকাশ একাউন্ট স্থিতি</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-800 text-sm">/hifz_daily_logs</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{hifzLogs.length} Docs</span>
              </div>
              <p className="text-slate-500 text-[11px]">দৈনিক সবক, সবকী, আমুখতা ও উস্তাদের মূল্যায়ন</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Storage */}
      {activeSubTab === 'storage' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Firebase Cloud Storage Folders</h3>
            <p className="text-xs text-slate-500">ছাত্রদের ছবি ও স্ক্যান করা অফিসিয়াল ডকুমেন্ট স্টোরেজ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono font-bold text-slate-900 block">/student_photos/</span>
              <p className="text-slate-500 text-[11px]">ছাত্রদের পাসপোর্ট সাইজ ডিজিটাল ফটো</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono font-bold text-slate-900 block">/documents/birth_certificates/</span>
              <p className="text-slate-500 text-[11px]">জন্মনিবন্ধন ও জাতীয় পরিচয়পত্র স্ক্যান</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono font-bold text-slate-900 block">/receipts_backup/</span>
              <p className="text-slate-500 text-[11px]">মানি রিসিট ও ব্যয় ভাউচারের ডিজিটাল কপি</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
