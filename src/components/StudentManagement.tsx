import React, { useMemo, useState } from 'react';
import {
  Users, Search, Plus, Edit, Trash2, Phone, MapPin, UserPlus,
  CreditCard, Eye, Table2, LayoutList, Printer, CheckCircle2,
  Clock3, UserCheck, UserX, Wallet, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, StudentDepartment, StudentResidential, StudentStatus } from '../types';

const ACADEMIC_MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

const getAcademicStartYear = (academicYear: string) => {
  const match = academicYear.match(/20\d{2}/);
  return match ? Number(match[0]) : new Date().getFullYear();
};

const getMonthLabel = (monthIndex: number, startYear: number) => {
  const year = monthIndex < 9 ? startYear : startYear + 1;
  return `${ACADEMIC_MONTHS[monthIndex]} ${year}`;
};

const sameMonth = (paymentMonth: string, monthName: string, year: number) =>
  paymentMonth.toLowerCase().includes(monthName.toLowerCase()) && paymentMonth.includes(String(year));

export const StudentManagement: React.FC = () => {
  const {
    students,
    payments,
    settings,
    currentUser,
    addStudent,
    updateStudent,
    deleteStudent,
    setActiveStudentForDetails,
    setIsQuickPaymentModalOpen,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [selectedRes, setSelectedRes] = useState('all');
  const [viewMode, setViewMode] = useState<'register' | 'fees'>('register');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedIdCard, setSelectedIdCard] = useState<Student | null>(null);

  const emptyForm = {
    rollNo: '', admissionNo: '', fullName: '', banglaName: '', arabicName: '',
    department: 'hafizia' as StudentDepartment,
    residential: 'non_residential' as StudentResidential,
    guardianName: '', guardianRelation: 'Father', guardianPhone: '', whatsapp: '',
    address: '', admissionDate: new Date().toISOString().slice(0, 10),
    dateOfBirth: '', bloodGroup: 'A+', monthlyTuitionFee: 1000,
    monthlyFoodFee: 0, monthlyTransportFee: 0, feeDiscount: 0,
    status: 'active' as StudentStatus, currentPara: 1, notes: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  const academicStartYear = getAcademicStartYear(settings.academicYear);

  const filteredStudents = useMemo(() => students.filter(student => {
    const q = searchQuery.trim().toLowerCase();
    const searchable = [
      student.fullName, student.banglaName, student.rollNo,
      student.guardianName, student.fatherName || '', student.guardianPhone,
      student.address, student.department
    ].join(' ').toLowerCase();
    const matchesSearch = !q || searchable.includes(q);
    const matchesDept = selectedDept === 'all' || student.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesRes = selectedRes === 'all' || student.residential === selectedRes;
    return matchesSearch && matchesDept && matchesStatus && matchesRes;
  }), [students, searchQuery, selectedDept, selectedStatus, selectedRes]);

  const activeStudents = students.filter(s => s.status === 'active');
  const atimStudents = students.filter(s => (s.monthlyTuitionFee || 0) + (s.monthlyFoodFee || 0) + (s.monthlyTransportFee || 0) - (s.feeDiscount || 0) <= 0);
  const monthlyExpected = activeStudents.reduce((sum, s) => sum + Math.max(0, (s.monthlyTuitionFee || 0) + (s.monthlyFoodFee || 0) + (s.monthlyTransportFee || 0) - (s.feeDiscount || 0)), 0);

  const getNetFee = (student: Student) => Math.max(0,
    (student.monthlyTuitionFee || 0) + (student.monthlyFoodFee || 0) +
    (student.monthlyTransportFee || 0) - (student.feeDiscount || 0)
  );

  const getMonthPaid = (student: Student, monthIndex: number) => {
    const monthName = ACADEMIC_MONTHS[monthIndex];
    const year = monthIndex < 9 ? academicStartYear : academicStartYear + 1;
    return payments
      .filter(p => p.studentId === student.id && sameMonth(p.month, monthName, year))
      .reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);
  };

  const getMonthStatus = (student: Student, monthIndex: number) => {
    const fee = getNetFee(student);
    if (fee === 0) return 'ATIM';
    const paid = getMonthPaid(student, monthIndex);
    if (paid >= fee) return 'Paid';
    if (paid > 0) return `₹${paid.toLocaleString()}`;
    return 'Due';
  };

  const totalAcademicPaid = useMemo(() => payments.reduce((sum, payment) => {
    const monthIndex = ACADEMIC_MONTHS.findIndex(m => payment.month.toLowerCase().includes(m.toLowerCase()));
    if (monthIndex < 0) return sum;
    const year = monthIndex < 9 ? academicStartYear : academicStartYear + 1;
    return payment.month.includes(String(year)) ? sum + Number(payment.paidAmount || 0) : sum;
  }, 0), [payments, academicStartYear]);

  const openAdd = () => {
    const nextRoll = String(Math.max(0, ...students.map(s => Number(s.rollNo.replace(/\D/g, '')) || 0)) + 1);
    setEditingStudent(null);
    setFormData({ ...emptyForm, rollNo: nextRoll, admissionNo: `ADM-${academicStartYear}-${String(students.length + 1).padStart(3, '0')}` });
    setIsFormOpen(true);
  };

  const openEdit = (student: Student) => {
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
      dateOfBirth: student.dateOfBirth || '',
      bloodGroup: student.bloodGroup || 'A+',
      monthlyTuitionFee: student.monthlyTuitionFee || 0,
      monthlyFoodFee: student.monthlyFoodFee || 0,
      monthlyTransportFee: student.monthlyTransportFee || 0,
      feeDiscount: student.feeDiscount || 0,
      status: student.status,
      currentPara: student.currentPara || 1,
      notes: student.notes || ''
    });
    setIsFormOpen(true);
  };

  const submitStudent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.fullName.trim() || !formData.guardianName.trim()) {
      showToast('Student name and Father/Guardian name are required.', 'error');
      return;
    }
    const data = {
      ...formData,
      monthlyTuitionFee: Number(formData.monthlyTuitionFee),
      monthlyFoodFee: Number(formData.monthlyFoodFee),
      monthlyTransportFee: Number(formData.monthlyTransportFee),
      feeDiscount: Number(formData.feeDiscount),
      currentPara: Number(formData.currentPara),
      completedParas: editingStudent?.completedParas || []
    };
    if (editingStudent) updateStudent(editingStudent.id, data);
    else addStudent(data);
    setIsFormOpen(false);
  };

  return (
    <div id="student-management-view" className="space-y-5 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            ছাত্র তালিকা (Students Details)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{settings.academicYear} • ছাত্র তথ্য, Present তালিকা ও মাসিক ফি একসাথে</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm">
            <UserPlus className="w-4 h-4" /> নতুন ছাত্র ভর্তি
          </button>
          <button onClick={() => setIsQuickPaymentModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm">
            <CreditCard className="w-4 h-4" /> ফি জমা
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4"><p className="text-[11px] text-slate-500">মোট ছাত্র</p><p className="text-2xl font-extrabold text-slate-900">{students.length}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4"><p className="text-[11px] text-slate-500">Present / Active</p><p className="text-2xl font-extrabold text-emerald-700">{activeStudents.length}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4"><p className="text-[11px] text-slate-500">ATIM / Free</p><p className="text-2xl font-extrabold text-sky-700">{atimStudents.length}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4"><p className="text-[11px] text-slate-500">মাসিক মোট পাওনা</p><p className="text-xl font-extrabold text-slate-900">{settings.currencySymbol}{monthlyExpected.toLocaleString()}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 col-span-2 lg:col-span-1"><p className="text-[11px] text-slate-500">Academic Year Collection</p><p className="text-xl font-extrabold text-emerald-700">{settings.currencySymbol}{totalAcademicPaid.toLocaleString()}</p></div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="নাম, রোল, ফোন, পিতা বা ঠিকানা খুঁজুন..." className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500" />
          </div>
          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <option value="all">সকল Class / বিভাগ</option><option value="hafizia">HIFZ</option><option value="nazera">NAZERA</option><option value="noorani">NOORANI</option><option value="kitab">KITAB</option>
          </select>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <option value="active">Present / Active</option><option value="all">All Students</option><option value="leave">On Leave</option><option value="graduated">Graduated</option>
          </select>
          <select value={selectedRes} onChange={e => setSelectedRes(e.target.value)} className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <option value="all">আবাসিক + অনাবাসিক</option><option value="residential">আবাসিক</option><option value="non_residential">অনাবাসিক</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500">দেখানো হচ্ছে <b className="text-slate-800">{filteredStudents.length}</b> জন</span>
          <div className="flex rounded-xl bg-slate-100 p-1 w-fit">
            <button onClick={() => setViewMode('register')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${viewMode === 'register' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}><LayoutList className="w-3.5 h-3.5" /> Student Register</button>
            <button onClick={() => setViewMode('fees')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${viewMode === 'fees' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}><Table2 className="w-3.5 h-3.5" /> Monthly Fees</button>
          </div>
        </div>
      </div>

      {viewMode === 'register' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-xs">
              <thead className="bg-emerald-800 text-white">
                <tr>
                  <th className="px-3 py-3 text-left">SL</th><th className="px-3 py-3 text-left">ROLL</th><th className="px-3 py-3 text-left">STUDENT NAME</th><th className="px-3 py-3 text-left">FATHER / GUARDIAN</th><th className="px-3 py-3 text-left">ADDRESS</th><th className="px-3 py-3 text-left">CLASS</th><th className="px-3 py-3 text-left">PHONE</th><th className="px-3 py-3 text-right">MONTHLY</th><th className="px-3 py-3 text-center">STATUS</th><th className="px-3 py-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student, index) => {
                  const fee = getNetFee(student);
                  const free = fee === 0;
                  return (
                    <tr key={student.id} className="hover:bg-emerald-50/40">
                      <td className="px-3 py-2.5 font-bold text-slate-500">{index + 1}</td>
                      <td className="px-3 py-2.5 font-mono font-bold text-slate-800">{student.rollNo}</td>
                      <td className="px-3 py-2.5"><button onClick={() => setActiveStudentForDetails(student)} className="text-left font-bold text-slate-900 hover:text-emerald-700">{student.fullName}</button><div className="text-[10px] text-slate-400">{student.banglaName}</div></td>
                      <td className="px-3 py-2.5"><div className="font-semibold text-slate-700">{student.fatherName || student.guardianName}</div><div className="text-[10px] text-slate-400">{student.guardianRelation}</div></td>
                      <td className="px-3 py-2.5 max-w-[180px] truncate" title={student.address}><span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-600" />{student.address || '—'}</span></td>
                      <td className="px-3 py-2.5 font-bold uppercase">{student.department}</td>
                      <td className="px-3 py-2.5 font-mono"><span className="inline-flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600" />{student.guardianPhone || '—'}</span></td>
                      <td className="px-3 py-2.5 text-right font-extrabold">{free ? <span className="text-sky-600">ATIM</span> : `${settings.currencySymbol}${fee.toLocaleString()}`}</td>
                      <td className="px-3 py-2.5 text-center"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800' : student.status === 'graduated' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{student.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}{student.status}</span></td>
                      <td className="px-3 py-2.5"><div className="flex items-center justify-center gap-1"><button title="Profile" onClick={() => setActiveStudentForDetails(student)} className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700"><Eye className="w-3.5 h-3.5" /></button><button title="Edit" onClick={() => openEdit(student)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><Edit className="w-3.5 h-3.5" /></button><button title="ID Card" onClick={() => setSelectedIdCard(student)} className="p-1.5 rounded-lg hover:bg-sky-100 text-sky-700"><Printer className="w-3.5 h-3.5" /></button>{currentUser.role === 'admin' && <button title="Delete" onClick={() => { if (confirm(`Delete ${student.fullName}?`)) deleteStudent(student.id); }} className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>}</div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && <div className="p-10 text-center text-sm text-slate-500">কোনো ছাত্র পাওয়া যায়নি।</div>}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">MONTHLY FEE REGISTER</h3><p className="text-[11px] text-slate-500">April {academicStartYear} → March {academicStartYear + 1}</p></div><Wallet className="w-5 h-5 text-emerald-700" /></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] text-xs">
              <thead className="bg-slate-900 text-white"><tr><th className="px-3 py-3 text-left sticky left-0 bg-slate-900">ROLL</th><th className="px-3 py-3 text-left sticky left-[62px] bg-slate-900">STUDENTS</th>{ACADEMIC_MONTHS.map((month, i) => <th key={month} className="px-3 py-3 text-center">{month.slice(0,3).toUpperCase()}<div className="text-[9px] font-normal opacity-70">{i < 9 ? academicStartYear : academicStartYear + 1}</div></th>)}<th className="px-3 py-3 text-right">MONTHLY</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{filteredStudents.map(student => <tr key={student.id} className="hover:bg-slate-50"><td className="px-3 py-2 font-mono font-bold sticky left-0 bg-white">{student.rollNo}</td><td className="px-3 py-2 font-bold sticky left-[62px] bg-white">{student.fullName}</td>{ACADEMIC_MONTHS.map((month, i) => { const status = getMonthStatus(student, i); const paid = status === 'Paid'; const atim = status === 'ATIM'; const partial = status.startsWith('₹'); return <td key={month} className="px-2 py-2 text-center"><span className={`inline-flex min-w-[52px] justify-center px-1.5 py-1 rounded-md text-[10px] font-bold ${paid ? 'bg-emerald-100 text-emerald-800' : atim ? 'bg-sky-100 text-sky-700' : partial ? 'bg-amber-100 text-amber-800' : 'bg-rose-50 text-rose-700'}`}>{paid ? <CheckCircle2 className="w-3 h-3" /> : status}</span></td>; })}<td className="px-3 py-2 text-right font-extrabold">{getNetFee(student) === 0 ? 'ATIM' : `${settings.currencySymbol}${getNetFee(student).toLocaleString()}`}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white p-5 border-b border-slate-100 flex items-center justify-between"><div><h3 className="font-extrabold text-lg text-slate-900">{editingStudent ? 'ছাত্র তথ্য Edit' : 'নতুন ছাত্র ভর্তি'}</h3><p className="text-xs text-slate-500">Student Details • {settings.academicYear}</p></div><button onClick={() => setIsFormOpen(false)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button></div>
            <form onSubmit={submitStudent} className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="text-xs font-bold">ROLL<input value={formData.rollNo} onChange={e => setFormData({...formData, rollNo:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" required /></label>
                <label className="text-xs font-bold">ADMISSION NO<input value={formData.admissionNo} onChange={e => setFormData({...formData, admissionNo:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" /></label>
                <label className="text-xs font-bold">CLASS / DEPARTMENT<select value={formData.department} onChange={e => setFormData({...formData, department:e.target.value as StudentDepartment})} className="mt-1 w-full p-2.5 rounded-xl border"><option value="hafizia">HIFZ</option><option value="nazera">NAZERA</option><option value="noorani">NOORANI</option><option value="kitab">KITAB</option></select></label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="text-xs font-bold">STUDENT NAME<input value={formData.fullName} onChange={e => setFormData({...formData, fullName:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" required /></label><label className="text-xs font-bold">বাংলা নাম<input value={formData.banglaName} onChange={e => setFormData({...formData, banglaName:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" /></label></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><label className="text-xs font-bold">FATHER / GUARDIAN<input value={formData.guardianName} onChange={e => setFormData({...formData, guardianName:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" required /></label><label className="text-xs font-bold">PHONE<input value={formData.guardianPhone} onChange={e => setFormData({...formData, guardianPhone:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" /></label><label className="text-xs font-bold">RELATION<input value={formData.guardianRelation} onChange={e => setFormData({...formData, guardianRelation:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" /></label></div>
              <label className="text-xs font-bold">ADDRESS<input value={formData.address} onChange={e => setFormData({...formData, address:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" /></label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3"><label className="text-xs font-bold">TUITION<input type="number" min="0" value={formData.monthlyTuitionFee} onChange={e => setFormData({...formData, monthlyTuitionFee:Number(e.target.value)})} className="mt-1 w-full p-2.5 rounded-xl border" /></label><label className="text-xs font-bold">FOOD<input type="number" min="0" value={formData.monthlyFoodFee} onChange={e => setFormData({...formData, monthlyFoodFee:Number(e.target.value)})} className="mt-1 w-full p-2.5 rounded-xl border" /></label><label className="text-xs font-bold">TRANSPORT<input type="number" min="0" value={formData.monthlyTransportFee} onChange={e => setFormData({...formData, monthlyTransportFee:Number(e.target.value)})} className="mt-1 w-full p-2.5 rounded-xl border" /></label><label className="text-xs font-bold">DISCOUNT / ATIM<input type="number" min="0" value={formData.feeDiscount} onChange={e => setFormData({...formData, feeDiscount:Number(e.target.value)})} className="mt-1 w-full p-2.5 rounded-xl border" /></label></div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center justify-between"><span className="text-xs font-bold text-emerald-900">NET MONTHLY FEE</span><strong className="text-xl text-emerald-800">{settings.currencySymbol}{Math.max(0, Number(formData.monthlyTuitionFee)+Number(formData.monthlyFoodFee)+Number(formData.monthlyTransportFee)-Number(formData.feeDiscount)).toLocaleString()}</strong></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><label className="text-xs font-bold">RESIDENTIAL<select value={formData.residential} onChange={e => setFormData({...formData, residential:e.target.value as StudentResidential})} className="mt-1 w-full p-2.5 rounded-xl border"><option value="non_residential">NON-RESIDENTIAL</option><option value="residential">RESIDENTIAL</option></select></label><label className="text-xs font-bold">STATUS<select value={formData.status} onChange={e => setFormData({...formData, status:e.target.value as StudentStatus})} className="mt-1 w-full p-2.5 rounded-xl border"><option value="active">ACTIVE</option><option value="leave">ON LEAVE</option><option value="graduated">GRADUATED</option></select></label><label className="text-xs font-bold">ADMISSION DATE<input type="date" value={formData.admissionDate} onChange={e => setFormData({...formData, admissionDate:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border" /></label></div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2.5 rounded-xl border font-bold text-sm">Cancel</button><button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-sm">{editingStudent ? 'Update Student' : 'Save Student'}</button></div>
            </form>
          </div>
        </div>
      )}

      {selectedIdCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"><div className="flex justify-between items-center mb-4"><h3 className="font-extrabold">Student ID Card</h3><button onClick={() => setSelectedIdCard(null)}><X /></button></div><div className="border-2 border-emerald-700 rounded-2xl p-5 text-center"><h4 className="font-extrabold text-emerald-900">{settings.banglaName}</h4><p className="text-xs text-slate-500 mb-4">{settings.name}</p><div className="text-left space-y-2 text-sm"><p><b>Name:</b> {selectedIdCard.fullName}</p><p><b>Roll:</b> {selectedIdCard.rollNo}</p><p><b>Class:</b> {selectedIdCard.department}</p><p><b>Father:</b> {selectedIdCard.fatherName || selectedIdCard.guardianName}</p><p><b>Phone:</b> {selectedIdCard.guardianPhone}</p><p><b>Address:</b> {selectedIdCard.address}</p></div></div><button onClick={() => window.print()} className="mt-4 w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print ID Card</button></div></div>
      )}
    </div>
  );
};
