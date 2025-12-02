
import React, { useState } from 'react';
import { RenovationRequest, RenovationStatus } from '../types';
import { Hammer, Calendar, MapPin, Plus, CheckCircle, ArrowLeft, ClipboardList, DollarSign, FileText } from 'lucide-react';

const RenovationList: React.FC = () => {
  const [requests, setRequests] = useState<RenovationRequest[]>([
    {
      id: 'REN-001',
      customerName: 'مجتمع مسکونی مروارید',
      buildingAddress: 'خیابان ولیعصر، کوچه سوم',
      currentElevatorAge: 15,
      requestDate: '1403/02/01',
      status: 'VISITED',
      notes: 'نیاز به تعویض تابلو فرمان و کابین دارد.',
      visitReport: 'موتور گیربکس سالم است اما تابلو فرمان رله‌ای قدیمی باید تعویض شود.',
      quotationAmount: 450000000
    },
    {
      id: 'REN-002',
      customerName: 'ساختمان پزشکان آتیه',
      buildingAddress: 'بلوار کشاورز',
      currentElevatorAge: 22,
      requestDate: '1403/02/15',
      status: 'NEW',
      notes: 'آسانسور قدیمی است و خرابی زیاد دارد.'
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<RenovationRequest | null>(null);

  // Status Steps
  const steps: { key: RenovationStatus, label: string }[] = [
    { key: 'NEW', label: 'درخواست جدید' },
    { key: 'VISITED', label: 'بازدید فنی' },
    { key: 'QUOTATION', label: 'صدور پیش‌فاکتور' },
    { key: 'CONTRACT', label: 'عقد قرارداد' },
    { key: 'IN_PROGRESS', label: 'در حال اجرا' },
    { key: 'COMPLETED', label: 'تحویل نهایی' }
  ];

  const handleStatusUpdate = (status: RenovationStatus) => {
    if (selectedProject) {
      const updated = requests.map(r => r.id === selectedProject.id ? { ...r, status } : r);
      setRequests(updated);
      setSelectedProject({ ...selectedProject, status });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!selectedProject ? (
        // --- LIST VIEW ---
        <>
          <div className="flex justify-between items-center">
            <div>
               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                 <Hammer className="text-amber-600" />
                 پروژه‌های بازسازی
               </h2>
               <p className="text-sm text-gray-500 mt-1">مدیریت نوسازی و جنرال سرویس (سرپرست: محمد علی حائری)</p>
            </div>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-sm">
              <Plus size={20} />
              پروژه جدید
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedProject(req)}>
                <div className="p-5">
                   <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-amber-600 transition-colors">{req.customerName}</h3>
                      <StatusBadge status={req.status} />
                   </div>
                   
                   <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {req.buildingAddress}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {req.requestDate}
                      </div>
                   </div>

                   <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${(steps.findIndex(s => s.key === req.status) / (steps.length - 1)) * 100}%` }}
                      ></div>
                   </div>

                   <button className="w-full py-2 border border-amber-200 text-amber-700 rounded-lg bg-amber-50 group-hover:bg-amber-600 group-hover:text-white transition-colors text-sm font-medium">
                     مدیریت و جزئیات
                   </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // --- DETAIL VIEW ---
        <div className="animate-fade-in-up">
           <button onClick={() => setSelectedProject(null)} className="mb-4 text-gray-500 hover:text-gray-800 flex items-center gap-1">
             <ArrowLeft size={20} /> بازگشت به لیست
           </button>

           <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-slate-800 text-white p-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <h2 className="text-2xl font-bold mb-1">{selectedProject.customerName}</h2>
                       <p className="text-slate-400 flex items-center gap-2 text-sm"><MapPin size={16}/> {selectedProject.buildingAddress}</p>
                    </div>
                    <StatusBadge status={selectedProject.status} />
                 </div>
              </div>

              {/* Stepper */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 overflow-x-auto">
                 <div className="flex justify-between min-w-[600px]">
                    {steps.map((step, idx) => {
                       const currentIdx = steps.findIndex(s => s.key === selectedProject.status);
                       const isCompleted = idx <= currentIdx;
                       const isCurrent = idx === currentIdx;
                       
                       return (
                          <div key={step.key} className="flex flex-col items-center relative flex-1 group">
                             {/* Line */}
                             {idx !== 0 && (
                               <div className={`absolute top-4 right-[50%] w-full h-1 ${idx <= currentIdx ? 'bg-amber-500' : 'bg-gray-200'}`} style={{right: '50%'}}></div>
                             )}
                             
                             <button 
                               onClick={() => handleStatusUpdate(step.key)}
                               className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                                 isCurrent ? 'bg-amber-600 text-white ring-4 ring-amber-100 scale-110' : 
                                 isCompleted ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                               }`}
                             >
                               {isCompleted ? <CheckCircle size={16} /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                             </button>
                             <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-amber-700' : 'text-gray-500'}`}>{step.label}</span>
                          </div>
                       );
                    })}
                 </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Left Column: Info */}
                 <div className="space-y-6">
                    <div className="bg-white border rounded-xl p-4 shadow-sm">
                       <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FileText size={18} className="text-blue-500"/> اطلاعات درخواست</h3>
                       <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">تاریخ درخواست:</span>
                             <span>{selectedProject.requestDate}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">عمر دستگاه:</span>
                             <span>{selectedProject.currentElevatorAge} سال</span>
                          </div>
                          <div>
                             <span className="text-gray-500 block mb-1">توضیحات اولیه:</span>
                             <p className="bg-gray-50 p-2 rounded text-gray-700">{selectedProject.notes}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white border rounded-xl p-4 shadow-sm">
                       <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><ClipboardList size={18} className="text-green-500"/> گزارش فنی بازدید</h3>
                       {selectedProject.visitReport ? (
                          <p className="text-sm text-gray-700 leading-relaxed bg-green-50 p-3 rounded border border-green-100">
                             {selectedProject.visitReport}
                          </p>
                       ) : (
                          <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed rounded-lg bg-gray-50">
                             هنوز گزارشی ثبت نشده است.
                             <br/>
                             <button className="text-blue-600 mt-2 font-medium hover:underline">ثبت گزارش بازدید</button>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Right Column: Financial */}
                 <div className="space-y-6">
                    <div className="bg-white border rounded-xl p-4 shadow-sm">
                       <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><DollarSign size={18} className="text-amber-500"/> اطلاعات مالی پروژه</h3>
                       
                       <div className="bg-amber-50 p-4 rounded-lg text-center mb-4">
                          <p className="text-xs text-amber-700 mb-1">مبلغ برآورد شده</p>
                          <p className="text-2xl font-bold text-gray-800">
                             {selectedProject.quotationAmount ? selectedProject.quotationAmount.toLocaleString() : '---'} <span className="text-xs text-gray-500">تومان</span>
                          </p>
                       </div>

                       <div className="space-y-2">
                          <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors">
                             صدور / مشاهده پیش‌فاکتور
                          </button>
                          <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors">
                             آپلود فایل قرارداد
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: RenovationStatus }) => {
   const styles = {
      'NEW': 'bg-red-100 text-red-700 border-red-200',
      'VISITED': 'bg-blue-100 text-blue-700 border-blue-200',
      'QUOTATION': 'bg-purple-100 text-purple-700 border-purple-200',
      'CONTRACT': 'bg-amber-100 text-amber-700 border-amber-200',
      'IN_PROGRESS': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'COMPLETED': 'bg-green-100 text-green-700 border-green-200',
   };
   
   const labels = {
      'NEW': 'درخواست جدید',
      'VISITED': 'بازدید شده',
      'QUOTATION': 'پیش‌فاکتور',
      'CONTRACT': 'قرارداد',
      'IN_PROGRESS': 'اجرایی',
      'COMPLETED': 'تکمیل شده',
   };

   return (
      <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status] || 'bg-gray-100'}`}>
         {labels[status] || status}
      </span>
   );
}

export default RenovationList;
