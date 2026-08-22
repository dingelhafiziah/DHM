import React, { useState } from 'react';
import { 
  Users, Search, Filter, Plus, BookOpen, 
  CreditCard, Phone, MapPin, Award, CheckCircle, 
  Clock, Sparkles, Edit, Trash2, IdCard, 
  ExternalLink, ChevronRight, CheckCircle2,
  Calendar, Check, UserPlus, FileSpreadsheet,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, StudentDepartment, StudentResidential, StudentStatus } from '../types';
import { QURAN_PARAS } from '../data/quranData';

export const StudentManagement: React.FC = () => {
  const { 
    students, 
    settings, 
    currentUser, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    toggleParaCompletion,
    setActiveStudentForDetails,
    setIsAddStudentModalOpen,
    setIsHifzLogModalOpen,
    setIsQuickPaymentModalOpen,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedRes, setSelectedRes] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    rollNo: '',
    admissionNo: '',
    fullName: '',
    banglaName: '',
    arabicName: '',
    department: 'hafizia' as StudentDepartment,
    residential: 'residential' as StudentResidential,
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    whatsapp: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    dateOfBirth: '2014-01-01',
    bloodGroup: 'A+',
    monthlyTuitionFee: 2000,
    monthlyFoodFee: 2500,
    feeDiscount: 0,
    status: 'active' as StudentStatus,
    currentPara: 1,
    notes: '',
  });

  const handleOpenAdd = () => {
    const nextRoll = `DHA-${students.length + 101}`;
    const nextAdm = `ADM-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`;
    setFormData({
      rollNo: nextRoll,
      admissionNo: nextAdm,
      fullName: '',
      banglaName: '',
      arabicName: '',
      department: 'hafizia',
      residential: 'residential',
      guardianName: '',
      guardianRelation: 'Father',
      guardianPhone: '',
      whatsapp: '',
      address: '',
      admissionDate: new Date().toISOString().split('T')[0],
      dateOfBirth: '2014-01-01',
      bloodGroup: 'A+',
      monthlyTuitionFee: 2000,
      monthlyFoodFee: 2500,
      feeDiscount: 0,
      status: 'active',
      currentPara: 1,
      notes: '',
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFormData({
      rollNo: student.rollNo,
      admissionNo: student.admissionNo,
      fullName: student.fullName,
      banglaName: student.banglaName,
      arabicName: student.arabicName || '',
      department: student.department,
      residential: student.residential,
      guardianName: student.guardianName,
      guardianRelation: student.guardianRelation || 'Father',
      guardianPhone: student.guardianPhone,
      whatsapp: student.whatsapp || '',
      address: student.address,
      admissionDate: student.admissionDate,
      dateOfBirth: student.dateOfBirth || '2014-01-01',
      bloodGroup: student.bloodGroup || 'A+',
      monthlyTuitionFee: student.monthlyTuitionFee,
      monthlyFoodFee: student.monthlyFoodFee,
      feeDiscount: student.feeDiscount || 0,
      status: student.status,
      currentPara: student.currentPara || 1,
      notes: student.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.guardianPhone.trim()) {
      showToast('Please provide Student Full Name and Guardian Phone Number.', 'error');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        monthlyTuitionFee: Number(formData.monthlyTuitionFee),
        monthlyFoodFee: Number(formData.monthlyFoodFee),
        feeDiscount: Number(formData.feeDiscount),
        currentPara: Number(formData.currentPara),
      });
    } else {
      addStudent({
        ...formData,
        completedParas: [],
        monthlyTuitionFee: Number(formData.monthlyTuitionFee),
        monthlyFoodFee: Number(formData.monthlyFoodFee),
        feeDiscount: Number(formData.feeDiscount),
        currentPara: Number(formData.currentPara),
      });
    }

    setIsAddModalOpen(false);
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.guardianPhone.includes(searchQuery) ||
      s.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    const matchesRes = selectedRes === 'all' || s.residential === selectedRes;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

    return matchesSearch && matchesDept && matchesRes && matchesStatus;
  });

  return (
    <div id="student-management-view" className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            ছাত্র ব্যবস্থাপনা (Student Directory)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            হিফজ, নাজেরা ও নূরানী বিভাগের ছাত্রদের তথ্যাদি, কুরআন মুখস্থ অগ্রগতি ও প্রোফাইল
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-add-student-modal"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm shadow-emerald-700/20 active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন ছাত্র ভর্তি (Add Student)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="নাম, রোল, ফোন বা অভিভাবক খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
            >
              <option value="all">সকল বিভাগ (All Departments)</option>
              <option value="hafizia">হিফজুল কুরআন (Hafizia)</option>
              <option value="nazera">নাজেরা কুরআন (Nazera)</option>
              <option value="noorani">নূরানী ও ক্বায়দা (Noorani)</option>
              <option value="kitab">কিতাব বিভাগ (Kitab)</option>
            </select>
          </div>

          {/* Residential Filter */}
          <div>
            <select
              value={selectedRes}
              onChange={(e) => setSelectedRes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
            >
              <option value="all">আবাসিক ও অনাবাসিক (All)</option>
              <option value="residential">আবাসিক (Residential)</option>
              <option value="non_residential">অনাবাসিক / ডে-স্কলার (Day-scholar)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
            >
              <option value="active">অধ্যয়নরত ছাত্র (Active)</option>
              <option value="graduated">হাফেজ গ্র্যাজুয়েট (Graduated)</option>
              <option value="leave">ছুটি / অনিয়মিত (On Leave)</option>
              <option value="all">সকল স্ট্যাটাস (All)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>মোট পাওয়া গেছে: <strong className="text-slate-800 font-bold">{filteredStudents.length} জন ছাত্র</strong></span>
          <span className="text-emerald-700 font-medium">ক্লিক করে সম্পূর্ণ প্রোফাইল ও ৩০ পারা কুরআন ট্র্যাকার দেখুন</span>
        </div>
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">কোনো ছাত্র তালিকাভুক্ত নেই (No Students Found)</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              সকল আগের নমুনা তথ্য মুছে দেওয়া হয়েছে। নতুন ছাত্র ভর্তি করতে নিচের বাটনে ক্লিক করুন।
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-md shadow-emerald-700/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন ছাত্র ভর্তি করুন (Add First Student)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const completedCount = student.completedParas?.length || 0;
            const percentage = Math.round((completedCount / 30) * 100);
            const monthlyFee = (student.monthlyTuitionFee || 0) + (student.monthlyFoodFee || 0) - (student.feeDiscount || 0);

            return (
              <div
                key={student.id}
                onClick={() => setActiveStudentForDetails(student)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all p-5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-bold flex flex-col items-center justify-center text-xs shrink-0 shadow-xs ring-2 ring-emerald-600/20">
                        <span className="text-[9px] text-emerald-200 uppercase font-semibold">Roll</span>
                        <span className="text-sm">{student.rollNo.replace('DHA-', '')}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                          {student.fullName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium truncate">
                          {student.banglaName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {student.department}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {student.residential === 'residential' ? 'আবাসিক' : 'অনাবাসিক'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {student.status === 'graduated' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0">
                        <Award className="w-3 h-3 text-amber-600" /> হাফেজ
                      </span>
                    )}
                  </div>

                  {/* Hifz Progress Bar (if Hafizia or has paras) */}
                  {student.department === 'hafizia' && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-emerald-800 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          {completedCount} / 30 পারা মুখস্থ
                        </span>
                        <span className="text-slate-600 font-mono">{percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      {student.lastSabakSurah && (
                        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                          <span>বর্তমান পারা: <strong className="text-slate-800 font-bold">{student.currentPara}</strong></span>
                          <span className="text-emerald-700 font-medium">{student.lastSabakSurah}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Guardian & Fee info */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">অভিভাবক:</span>
                      <span className="font-semibold text-slate-800">{student.guardianName} ({student.guardianRelation})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">যোগাযোগ:</span>
                      <span className="font-mono text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" /> {student.guardianPhone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500">মাসিক প্রদেয় ফি:</span>
                      <span className="font-bold text-slate-900">
                        {settings.currencySymbol}{monthlyFee.toLocaleString()}/মাস
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudentForIdCard(student);
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <IdCard className="w-3.5 h-3.5 text-slate-600" />
                    <span>ID Card</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {currentUser.role === 'admin' && (
                      <>
                        <button
                          onClick={(e) => handleOpenEdit(student, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete ${student.fullName}?`)) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setActiveStudentForDetails(student)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-colors"
                    >
                      <span>প্রোফাইল</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {editingStudent ? 'ছাত্র তথ্য সংশোধন (Edit Student)' : 'নতুন ছাত্র ভর্তি ফরম (Student Admission Form)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {settings.banglaName} • একাডেমিক শিক্ষাবর্ষ {settings.academicYear}
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Row 1: Roll, Admission No, Department */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রোল নং (Roll No) *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি নং (Adm No)</label>
                  <input
                    type="text"
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিভাগ (Department) *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as StudentDepartment })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                  >
                    <option value="hafizia">হিফজুল কুরআন (Hafizia)</option>
                    <option value="nazera">নাজেরা কুরআন (Nazera)</option>
                    <option value="noorani">নূরানী ও ক্বায়দা (Noorani)</option>
                    <option value="kitab">কিতাব বিভাগ (Kitab)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Full Name (English & Bangla) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছাত্রের পূর্ণ নাম (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Abdullah"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বাংলায় নাম (Bangla Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
                    value={formData.banglaName}
                    onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              {/* Row 3: Residential & Admission Date & DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আবাসিক অবস্থা *</label>
                  <select
                    value={formData.residential}
                    onChange={(e) => setFormData({ ...formData, residential: e.target.value as StudentResidential })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                  >
                    <option value="residential">আবাসিক (Boarder / Food)</option>
                    <option value="non_residential">অনাবাসিক (Day Scholar)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তির তারিখ</label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Guardian Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  অভিভাবকের তথ্যাদি (Guardian Information)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">অভিভাবকের নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="পিতা / অভিভাবক"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">সম্পর্ক</label>
                    <input
                      type="text"
                      placeholder="Father / Uncle"
                      value={formData.guardianRelation}
                      onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">ঠিকানা (Address: Vill, PO, Dist, PIN)</label>
                  <input
                    type="text"
                    placeholder="গ্রাম, পোস্ট অফিস, থানা, জেলা, পিন কোড"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Row 5: Fee Structure */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  মাসিক ফি কাঠামো (Monthly Fee Configuration)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">মাসিক পড়াশোনা ফি (Tuition)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">{settings.currencySymbol}</span>
                      <input
                        type="number"
                        value={formData.monthlyTuitionFee}
                        onChange={(e) => setFormData({ ...formData, monthlyTuitionFee: Number(e.target.value) })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-emerald-300 bg-white font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">খাবার ও মেস ফি (Food/Boarding)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">{settings.currencySymbol}</span>
                      <input
                        type="number"
                        value={formData.monthlyFoodFee}
                        onChange={(e) => setFormData({ ...formData, monthlyFoodFee: Number(e.target.value) })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-emerald-300 bg-white font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">লিল্লাহ/ছাড় (Scholarship/Waiver)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">{settings.currencySymbol}</span>
                      <input
                        type="number"
                        value={formData.feeDiscount}
                        onChange={(e) => setFormData({ ...formData, feeDiscount: Number(e.target.value) })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-emerald-300 bg-white font-bold text-emerald-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-emerald-950 font-bold">
                  <span>সর্বমোট নিট প্রদেয় মাসিক ফি:</span>
                  <span className="text-sm font-extrabold text-emerald-800">
                    ৳{Math.max(0, (formData.monthlyTuitionFee + formData.monthlyFoodFee - formData.feeDiscount)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-all"
                >
                  {editingStudent ? 'আপডেট সংরক্ষণ করুন' : 'ছাত্র ভর্তি সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Student ID Card Modal */}
      {selectedStudentForIdCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <IdCard className="w-4 h-4 text-emerald-700" />
                মাদরাসা স্টুডেন্ট আইডি কার্ড (Student ID Card)
              </h3>
              <button 
                onClick={() => setSelectedStudentForIdCard(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* ID Card Front Frame */}
            <div className="border-2 border-emerald-700 rounded-2xl p-5 bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 text-slate-900 shadow-md relative overflow-hidden">
              <div className="text-center pb-3 border-b border-emerald-300">
                <h4 className="text-sm font-extrabold text-emerald-900 tracking-tight">
                  {settings.banglaName}
                </h4>
                <p className="text-[10px] text-emerald-800 font-medium">
                  {settings.name}
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">
                  Reg: {settings.regNo} • Phone: {settings.phone.split(',')[0]}
                </p>
              </div>

              <div className="py-4 flex gap-4 items-center">
                <div className="w-20 h-24 rounded-xl border-2 border-emerald-600 bg-emerald-100 flex flex-col items-center justify-center text-emerald-800 shrink-0">
                  <Users className="w-8 h-8" />
                  <span className="text-[9px] font-bold mt-1 uppercase">Photo</span>
                </div>

                <div className="space-y-1 text-xs flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Name</span>
                    <div className="font-bold text-slate-900 truncate">{selectedStudentForIdCard.fullName}</div>
                    <div className="text-[11px] text-emerald-800 font-semibold">{selectedStudentForIdCard.banglaName}</div>
                  </div>

                  <div className="flex gap-4 pt-1">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Roll</span>
                      <div className="font-mono font-bold text-emerald-900">{selectedStudentForIdCard.rollNo}</div>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Dept</span>
                      <div className="font-bold capitalize text-slate-800">{selectedStudentForIdCard.department}</div>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Blood</span>
                      <div className="font-bold text-rose-700">{selectedStudentForIdCard.bloodGroup || 'O+'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] space-y-0.5 text-slate-600">
                <div>Guardian: <strong>{selectedStudentForIdCard.guardianName}</strong></div>
                <div>Emergency Contact: <strong className="font-mono">{selectedStudentForIdCard.guardianPhone}</strong></div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-emerald-300 flex items-center justify-between text-[9px] text-slate-500">
                <span>Principal: {settings.principalName}</span>
                <span className="font-bold text-emerald-800 border-t border-emerald-800 px-2">Authorized Seal</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-800"
              >
                <Printer className="w-4 h-4" />
                <span>আইডি কার্ড প্রিন্ট করুন (Print ID)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
