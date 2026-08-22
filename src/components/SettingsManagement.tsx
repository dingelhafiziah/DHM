import React, { useState } from 'react';
import { 
  Settings, Building, Phone, Mail, UserCheck, 
  Database, RefreshCw, Download, Upload, Shield, 
  CheckCircle2, Key, Users, Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MadrasaSettings } from '../types';

export const SettingsManagement: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    currentUser, 
    switchUser, 
    showToast,
    students,
    payments,
    incomes,
    expenses,
    accounts,
    hifzLogs,
    transfers
  } = useApp();

  const [formData, setFormData] = useState<MadrasaSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'backup'>('profile');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      settings,
      students,
      payments,
      incomes,
      expenses,
      accounts,
      hifzLogs,
      transfers,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `dingel_hafizia_madrasa_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Database backup downloaded successfully!');
  };

  return (
    <div id="settings-management-view" className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-700" />
          মাদরাসা সেটিংস ও সিস্টেম কনফিগারেশন (Settings)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          মাদরাসার তথ্য, প্রিন্ট রসিদের শিরোনাম, ইউজার রোল ও ডাটাবেস ব্যাকআপ ব্যবস্থাপনা
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'profile' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>মাদরাসার তথ্য ও প্রোফাইল</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'users' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ব্যবহারকারী ও অনুমতি (Users)</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'backup' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>ডাটাবেস ব্যাকআপ ও রিস্টোর</span>
        </button>
      </div>

      {/* TAB 1: Profile & Madrasa Details */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">প্রাতিষ্ঠানিক পরিচিতি ও রসিদ হেডার</h3>
            <p className="text-xs text-slate-500">এই তথ্যগুলো মানি রিসিট, রিপোর্ট ও ভাউচারের হেডারে মুদ্রিত হবে</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মাদরাসার পূর্ণ নাম (বাংলা) *</label>
              <input
                type="text"
                required
                value={formData.banglaName}
                onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Madrasa English Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা ও অবস্থান (Address) *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিস মোবাইল ও UPI / WhatsApp নম্বর *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল ইমেইল</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মুহতামিম / অধ্যক্ষের নাম *</label>
              <input
                type="text"
                required
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">চলতি শিক্ষাবর্ষ (Academic Year) *</label>
              <input
                type="text"
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কারেন্সি প্রতীক (Currency Symbol) *</label>
              <input
                type="text"
                required
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কারেন্সি কোড (Currency Code) *</label>
              <input
                type="text"
                required
                value={formData.currencyCode}
                onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>তথ্য সংরক্ষণ করুন (Save Settings)</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Users & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">ব্যবহারকারী ও শিক্ষক তালিকা</h3>
            <p className="text-xs text-slate-500">অ্যাডমিন, শিক্ষক ও হিসাবরক্ষক অ্যাকাউন্টের অ্যাক্সেস নিয়ন্ত্রণ</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                  MA
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">মুহতামিম / অ্যাডমিন (Mawlana Abdullah)</h4>
                  <p className="text-xs text-slate-500">admin@dingelhafizia.edu.bd • পূর্ণ প্রশাসনিক ও আর্থিক নিয়ন্ত্রণ</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900">
                Admin Role
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold">
                  QI
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">উস্তাদ / প্রধান ক্বারী (Qari Ibrahim)</h4>
                  <p className="text-xs text-slate-500">teacher@dingelhafizia.edu.bd • ছাত্র ও হিফজ সবক মূল্যায়ন</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900">
                Teacher Role
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">ডাটাবেস ব্যাকআপ ও নিরাপত্তা</h3>
            <p className="text-xs text-slate-500">মাদরাসার সকল ছাত্র, ফি, আয়, ব্যয় ও হিফজ অগ্রগতি ডাটার অফলাইন ব্যাকআপ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">JSON ব্যাকআপ ডাউনলোড</h4>
                  <p className="text-xs text-slate-500">এক ক্লিকে সম্পূর্ণ মাদরাসার ডাটা সেভ করুন</p>
                </div>
              </div>
              <button
                onClick={handleDownloadBackup}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>সম্পূর্ণ ব্যাকআপ ফাইল ডাউনলোড করুন</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">লোকাল ব্রাউজার স্টোরেজ</h4>
                  <p className="text-xs text-slate-500">ডাটা স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে</p>
                </div>
              </div>
              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                মোট ছাত্র: <strong>{students.length}</strong> • রসিদ: <strong>{payments.length}</strong> • আয় ভাউচার: <strong>{incomes.length}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
