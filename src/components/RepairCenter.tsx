
import React, { useState } from 'react';
import { RepairJob, RepairStatus, User } from '../types';
import { Cpu, CheckCircle, Clock, AlertTriangle, Plus, User as UserIcon, Settings, PenTool, ClipboardList, Save, X } from 'lucide-react';

interface RepairCenterProps {
  currentUser: User;
  users: User[];
}

const RepairCenter: React.FC<RepairCenterProps> = ({ currentUser, users }) => {
  const [repairs, setRepairs] = useState<RepairJob[]>([
    {
      id: 'REP-101',
      customerName: 'آقای کاظمی',
      boardType: 'Main Board Yaskawa',
      faultDescription: 'خطای Overcurrent می‌دهد',
      status: 'DIAGNOSIS',
      entryDate: '1403/02/12',
      technicianName: 'شکیبا علی محمدی' // Assigned to Shakiba
    },
    {
      id: 'REP-102',
      customerName: 'شرکت آسیا',
      boardType: 'برد درب سلکوم',
      faultDescription: 'خروجی موتور ندارد',
      status: 'RECEIVED', // Unassigned
      entryDate: '1403/02/14',
    },
    {
      id: 'REP-103',
      customerName: 'برج میلاد نور',
      boardType: 'Drive L1000',
      faultDescription: 'خاموش کامل',
      status: 'REPAIRING',
      entryDate: '1403/02/10',
      technicianName: 'رامین پار' // Assigned to Ramin
    }
  ]);

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'MY_JOBS' | 'HISTORY'>('QUEUE');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJob, setEditingJob] = useState<RepairJob | null>(null); // For reporting
  
  // New Job State
  const [newJob, setNewJob] = useState<Partial<RepairJob>>({});
  // Report State
  const [reportData, setReportData] = useState({ technicalReport: '', cost: '', replacedParts: '' });

  const repairTechs = users.filter(u => u.role === 'REPAIR_TECH' || u.role === 'REPAIR_SUPERVISOR');
  const isSupervisor = currentUser.role === 'REPAIR_SUPERVISOR';
  const isReception = currentUser.role === 'REPAIR_RECEPTION';
  const isTech = currentUser.role === 'REPAIR_TECH' || isSupervisor;

  // --- Handlers ---

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job: RepairJob = {
      id: `REP-${Math.floor(Math.random() * 1000)}`,
      customerName: newJob.customerName || '',
      boardType: newJob.boardType || '',
      faultDescription: newJob.faultDescription || '',
      status: 'RECEIVED',
      entryDate: new Date().toLocaleDateString('fa-IR'),
      ...newJob as any
    };
    setRepairs([job, ...repairs]);
    setShowAddForm(false);
    setNewJob({});
  };

  const handleAssignTech = (jobId: string, techName: string) => {
    setRepairs(repairs.map(r => r.id === jobId ? { ...r, technicianName: techName, status: 'DIAGNOSIS' } : r));
  };

  const handleOpenReport = (job: RepairJob) => {
    setEditingJob(job);
    setReportData({
      technicalReport: job.technicalReport || '',
      cost: job.cost ? job.cost.toString() : '',
      replacedParts: job.replacedParts || ''
    });
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setRepairs(repairs.map(r => r.id === editingJob.id ? {
      ...r,
      status: 'TESTING', // Move to QC/Testing
      technicalReport: reportData.technicalReport,
      replacedParts: reportData.replacedParts,
      cost: parseInt(reportData.cost) || 0
    } : r));
    
    setEditingJob(null);
  };

  // --- Filtering ---
  
  const getFilteredRepairs = () => {
    if (activeTab === 'MY_JOBS') {
      return repairs.filter(r => r.technicianName === currentUser.fullName && r.status !== 'DELIVERED');
    }
    if (activeTab === 'HISTORY') {
      return repairs.filter(r => r.status === 'DELIVERED' || r.status === 'READY');
    }
    // QUEUE: Unassigned or In Progress (Visible to all, but mainly for management)
    return repairs.filter(r => r.status !== 'DELIVERED');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <Cpu className="text-indigo-600" />
             مرکز تعمیرات تخصصی برد
           </h2>
           <p className="text-sm text-gray-500 mt-1">
             {currentUser.role === 'REPAIR_RECEPTION' ? 'پنل پذیرش و تحویل' : `میز کار: ${currentUser.fullName}`}
           </p>
        </div>
        
        {(isReception || isSupervisor) && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            پذیرش قطعه جدید
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('QUEUE')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'QUEUE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          صف کلی تعمیرات
        </button>
        {isTech && (
          <button 
            onClick={() => setActiveTab('MY_JOBS')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'MY_JOBS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Settings size={16} />
            میز کار من
            <span className="bg-indigo-100 text-indigo-700 px-2 rounded-full text-xs">
              {repairs.filter(r => r.technicianName === currentUser.fullName && r.status !== 'DELIVERED' && r.status !== 'READY').length}
            </span>
          </button>
        )}
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'HISTORY' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          آرشیو تحویل شده‌ها
        </button>
      </div>

      {/* Add Form Modal/Area */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg mb-6 animate-fade-in-up">
           <h3 className="font-bold text-gray-700 mb-4">فرم پذیرش تعمیرات</h3>
           <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="نام مشتری" 
                className="input-field border rounded p-2" 
                required
                onChange={e => setNewJob({...newJob, customerName: e.target.value})}
              />
              <input 
                placeholder="نوع قطعه / مدل" 
                className="input-field border rounded p-2" 
                required
                onChange={e => setNewJob({...newJob, boardType: e.target.value})}
              />
              <textarea 
                placeholder="شرح ایراد ظاهری / گزارش مشتری" 
                className="input-field border rounded p-2 md:col-span-2" 
                required
                onChange={e => setNewJob({...newJob, faultDescription: e.target.value})}
              />
              <div className="flex gap-2 md:col-span-2 justify-end mt-2">
                 <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">لغو</button>
                 <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">ثبت پذیرش</button>
              </div>
           </form>
        </div>
      )}

      {/* Report Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl max-w-lg w-full p-6 animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-800 mb-4">گزارش فنی و تکمیل تعمیر</h3>
              <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                <p><strong>قطعه:</strong> {editingJob.boardType}</p>
                <p><strong>ایراد:</strong> {editingJob.faultDescription}</p>
              </div>
              
              <form onSubmit={handleSubmitReport} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">کارهای انجام شده</label>
                    <textarea 
                      className="w-full border rounded-lg p-2 h-24"
                      placeholder="شرح مراحل تعمیر و عیب یابی..."
                      value={reportData.technicalReport}
                      onChange={e => setReportData({...reportData, technicalReport: e.target.value})}
                      required
                    ></textarea>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">قطعات تعویضی</label>
                    <input 
                      type="text"
                      className="w-full border rounded-lg p-2"
                      placeholder="مثال: خازن 1000uF، آی سی رگولاتور"
                      value={reportData.replacedParts}
                      onChange={e => setReportData({...reportData, replacedParts: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">هزینه تعمیر (تومان)</label>
                    <input 
                      type="number"
                      className="w-full border rounded-lg p-2"
                      placeholder="0"
                      value={reportData.cost}
                      onChange={e => setReportData({...reportData, cost: e.target.value})}
                      required
                    />
                 </div>
                 
                 <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setEditingJob(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">انصراف</button>
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                       <CheckCircle size={18} />
                       ثبت گزارش و پایان تعمیر
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Job List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {getFilteredRepairs().map(job => (
          <div key={job.id} className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col transition-all hover:shadow-md ${job.status === 'READY' ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
             <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{job.id}</span>
                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusStyle(job.status)}`}>
                   {getStatusLabel(job.status)}
                </span>
             </div>

             <h4 className="font-bold text-gray-800 text-lg mb-1">{job.boardType}</h4>
             <p className="text-sm text-gray-500 mb-4">{job.customerName}</p>

             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-600 mb-4">
                <span className="font-semibold text-gray-700">شرح ایراد:</span> {job.faultDescription}
             </div>
             
             {/* Tech Assignment Info */}
             <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                   <UserIcon size={14} />
                   {job.technicianName ? (
                     <span className="text-gray-700 font-medium">{job.technicianName}</span>
                   ) : (
                     <span className="text-red-400 italic">بدون تعمیرکار</span>
                   )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                   {/* Assign Action (Supervisor/Reception) */}
                   {!job.technicianName && (isSupervisor || isReception) && (
                     <select 
                       className="text-xs border border-gray-300 rounded bg-white px-2 py-1"
                       onChange={(e) => handleAssignTech(job.id, e.target.value)}
                       defaultValue=""
                     >
                        <option value="" disabled>تخصیص به...</option>
                        {repairTechs.map(t => (
                           <option key={t.id} value={t.fullName}>{t.fullName}</option>
                        ))}
                     </select>
                   )}

                   {/* Tech Action: Complete Job */}
                   {activeTab === 'MY_JOBS' && ['DIAGNOSIS', 'REPAIRING'].includes(job.status) && (
                      <button 
                        onClick={() => handleOpenReport(job)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs hover:bg-indigo-700 flex items-center gap-1"
                      >
                         <PenTool size={12} />
                         تکمیل کار
                      </button>
                   )}

                   {/* Ready/Deliver Action (Reception) */}
                   {job.status === 'READY' && isReception && (
                      <button className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 flex items-center gap-1">
                         <CheckCircle size={12} />
                         تحویل به مشتری
                      </button>
                   )}
                </div>
             </div>
          </div>
        ))}
      </div>
      
      {getFilteredRepairs().length === 0 && (
         <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Settings size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">موردی برای نمایش وجود ندارد.</p>
         </div>
      )}
    </div>
  );
};

// Helpers
const getStatusLabel = (s: string) => {
   const map: any = { 'RECEIVED': 'پذیرش شده', 'DIAGNOSIS': 'در حال عیب‌یابی', 'REPAIRING': 'در حال تعمیر', 'TESTING': 'کنترل کیفیت', 'READY': 'آماده تحویل', 'DELIVERED': 'تحویل شده' };
   return map[s] || s;
};

const getStatusStyle = (s: string) => {
   const map: any = { 
     'RECEIVED': 'bg-gray-100 text-gray-600 border-gray-200', 
     'DIAGNOSIS': 'bg-yellow-50 text-yellow-700 border-yellow-200', 
     'REPAIRING': 'bg-blue-50 text-blue-700 border-blue-200',
     'TESTING': 'bg-purple-50 text-purple-700 border-purple-200',
     'READY': 'bg-green-50 text-green-700 border-green-200',
     'DELIVERED': 'bg-slate-100 text-slate-700 border-slate-300'
   };
   return map[s] || '';
};

export default RepairCenter;
