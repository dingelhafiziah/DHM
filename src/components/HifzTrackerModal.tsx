import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { MemorizationGrade, Student } from '../types';
import { POPULAR_SURAHS, QURAN_PARAS } from '../data/quranData';

interface HifzTrackerModalProps {
  onClose: () => void;
}

export const HifzTrackerModal: React.FC<HifzTrackerModalProps> = ({ onClose }) => {
  const { students, currentUser, recordHifzDailyLog, showToast } = useApp();

  const hafizStudents = students.filter(s => s.department === 'hafizia' && s.status === 'active');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(hafizStudents[0]?.id || students[0]?.id || '');
  
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sabakPara, setSabakPara] = useState<number>(selectedStudent?.currentPara || 1);
  const [sabakSurah, setSabakSurah] = useState(selectedStudent?.lastSabakSurah || 'Ya-Sin');
  const [sabakAyahRange, setSabakAyahRange] = useState('Ayah 1 - 25');
  const [sabakGrade, setSabakGrade] = useState<MemorizationGrade>('Mumtaz (Excellent)');
  const [sabaqiPara, setSabaqiPara] = useState<number>(selectedStudent?.currentPara ? Math.max(1, selectedStudent.currentPara - 1) : 1);
  const [dhorJuz, setDhorJuz] = useState('Para 1 - 3');
  const [teacherFeedback, setTeacherFeedback] = useState('মাশাআল্লাহ, সুন্দর ও শুদ্ধ উচ্চারণে সবক শুনিয়েছে।');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      showToast('Please select a student.', 'error');
      return;
    }

    recordHifzDailyLog({
      studentId: selectedStudent.id,
      date,
      sabakPara: Number(sabakPara),
      sabakSurah,
      sabakAyahRange,
      sabakGrade,
      sabaqiPara: Number(sabaqiPara),
      dhorJuz,
      teacherFeedback,
      evaluatedBy: currentUser.name,
    });

    if (sabakGrade.includes('Mumtaz')) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              দৈনিক সবক ও হিফজ মূল্যায়ন (Daily Sabak Log)
            </h3>
            <p className="text-xs text-slate-500">
              হিফজুল কুরআন বিভাগের নতুন সবক, সবকী ও আমুখতা (দোর) রেকর্ড করুন
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ছাত্র নির্বাচন করুন (Select Student) *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedStudentId(id);
                const s = students.find(std => std.id === id);
                if (s) {
                  setSabakPara(s.currentPara || 1);
                  if (s.lastSabakSurah) setSabakSurah(s.lastSabakSurah);
                }
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.rollNo} — {s.fullName} ({s.banglaName}) • {s.department.toUpperCase()} • পারা: {s.currentPara || 1}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Evaluation Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ (Date) *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মূল্যায়ন মান (Grade) *</label>
              <select
                value={sabakGrade}
                onChange={(e) => setSabakGrade(e.target.value as MemorizationGrade)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold text-emerald-800"
              >
                <option value="Mumtaz (Excellent)">মুমতাজ (Mumtaz - Excellent)</option>
                <option value="Jayyid Jiddan (Very Good)">জায়্যিদ জিদ্দান (Very Good)</option>
                <option value="Jayyid (Good)">জায়্যিদ (Good)</option>
                <option value="Maqbool (Pass)">মাকবুল (Pass / Revision needed)</option>
                <option value="Daif (Needs Revision)">দঈফ (Needs Revision)</option>
              </select>
            </div>
          </div>

          {/* 1. Daily Sabak (নতুন সবক) */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              ১. নতুন সবক (Sabak - New Lesson)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">পারা নং (Para 1-30)</label>
                <select
                  value={sabakPara}
                  onChange={(e) => setSabakPara(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white font-bold text-slate-800 text-xs"
                >
                  {QURAN_PARAS.map(p => (
                    <option key={p.number} value={p.number}>
                      পারা {p.number} ({p.nameBengali})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">সূরা (Surah)</label>
                <input
                  type="text"
                  value={sabakSurah}
                  onChange={(e) => setSabakSurah(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">আয়াত সীমা / পৃষ্ঠা</label>
                <input
                  type="text"
                  placeholder="e.g. Ayah 1 - 25"
                  value={sabakAyahRange}
                  onChange={(e) => setSabakAyahRange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Sabaqi & Dhor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                ২. সবকী (Sabaqi - Recent Revision)
              </label>
              <input
                type="text"
                placeholder="যেমন: পারা ২১ (১-১০ পৃষ্ঠা)"
                value={`পারা ${sabaqiPara}`}
                onChange={(e) => setSabaqiPara(Number(e.target.value.replace(/\D/g, '')) || 1)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                ৩. আমুখতা / দোর (Manzil / Full Revision)
              </label>
              <input
                type="text"
                placeholder="যেমন: পারা ১ থেকে ৩"
                value={dhorJuz}
                onChange={(e) => setDhorJuz(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
              />
            </div>
          </div>

          {/* Teacher Feedback */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">উস্তাদের পরামর্শ ও মন্তব্য (Teacher Feedback)</label>
            <input
              type="text"
              value={teacherFeedback}
              onChange={(e) => setTeacherFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>সবক সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
