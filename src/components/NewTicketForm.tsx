
import React, { useState, useEffect } from 'react';
import { TicketPriority, TicketStatus, Elevator, ControlPanelModel, WarrantyRecord } from '../types';
import { analyzeTicketPriority } from '../services/geminiService';
import { Wand2, Save, X, ArrowUpCircle, CheckCircle, AlertTriangle, Cpu, CreditCard } from 'lucide-react';

interface NewTicketFormProps {
  elevators: Elevator[];
  warranties: WarrantyRecord[];
  onSave: (data: any) => void;
  onPaymentRequired: (data: any) => void; // Call parent to switch to payment view
  onCancel: () => void;
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({ elevators, warranties = [], onSave, onPaymentRequired, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    buildingName: '',
    elevatorId: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    controlPanelModel: ControlPanelModel.ALPHA,
    controlPanelSerial: '',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  // Warranty Status State
  const [warrantyStatus, setWarrantyStatus] = useState<{
    valid: boolean;
    message: string;
    expiry?: string;
  } | null>(null);

  const INSPECTION_FEE = 1200000;

  // Check warranty when serial changes
  useEffect(() => {
    if (formData.controlPanelSerial.length > 3) {
      const record = warranties.find(w => w.serialNumber.trim() === formData.controlPanelSerial.trim());
      if (record) {
        setWarrantyStatus({
          valid: true,
          message: 'گارانتی معتبر',
          expiry: record.expiryDate
        });
      } else {
        setWarrantyStatus({
          valid: false,
          message: 'گارانتی نامعتبر یا منقضی شده'
        });
      }
    } else {
      setWarrantyStatus(null);
    }
  }, [formData.controlPanelSerial, warranties]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleElevatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const elevatorId = e.target.value;
    const selectedElevator = elevators.find(el => el.id === elevatorId);
    
    if (selectedElevator) {
      setFormData({
        ...formData,
        elevatorId: elevatorId,
        buildingName: selectedElevator.buildingName
      });
    } else {
      setFormData({
        ...formData,
        elevatorId: ''
      });
    }
  };

  const handleAutoAnalyze = async () => {
    if (!formData.description) return;
    
    setIsAnalyzing(true);
    const result = await analyzeTicketPriority(formData.description);
    
    // Convert AI Enum string to App Enum
    let priorityEnum = TicketPriority.MEDIUM;
    switch (result.priority) {
      case 'CRITICAL': priorityEnum = TicketPriority.CRITICAL; break;
      case 'HIGH': priorityEnum = TicketPriority.HIGH; break;
      case 'LOW': priorityEnum = TicketPriority.LOW; break;
    }

    setFormData(prev => ({ ...prev, priority: priorityEnum }));
    setAnalysisResult(result.reason);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseTicket = {
      ...formData,
      status: TicketStatus.PENDING,
      aiAnalysis: analysisResult,
      warrantyStatus: warrantyStatus?.valid ? 'VALID' : 'EXPIRED'
    };

    // --- PAYMENT LOGIC ---
    if (!warrantyStatus?.valid) {
       // If no warranty, trigger payment flow
       if (window.confirm(`این دستگاه فاقد گارانتی معتبر است.\n\nبرای ثبت درخواست باید مبلغ ${INSPECTION_FEE.toLocaleString()} تومان هزینه کارشناسی پرداخت شود.\n\nآیا به درگاه پرداخت منتقل شوید؟`)) {
          onPaymentRequired({
            ...baseTicket,
            paymentAmount: INSPECTION_FEE,
            paymentStatus: 'PENDING'
          });
       }
    } else {
       // If Warranty OK, Save directly
       onSave({
         ...baseTicket,
         paymentStatus: 'NONE', // No payment needed
         paymentAmount: 0
       });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto p-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ثبت تیکت خرابی جدید</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Elevator Selection */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
           <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <ArrowUpCircle size={16} />
              انتخاب آسانسور (اختیاری)
           </label>
           <select
              name="elevatorId"
              value={formData.elevatorId}
              onChange={handleElevatorChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
           >
              <option value="">-- انتخاب دستی ساختمان --</option>
              {elevators.map(elevator => (
                 <option key={elevator.id} value={elevator.id}>
                    {elevator.buildingName} - {elevator.type} (سریال: {elevator.serialNumber})
                 </option>
              ))}
           </select>
        </div>

        {/* --- CONTROL PANEL INFO (NEW) --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
           <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Cpu size={16} /> مشخصات تابلو فرمان
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">مدل تابلو</label>
                 <select
                    name="controlPanelModel"
                    value={formData.controlPanelModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 bg-white"
                 >
                    {Object.values(ControlPanelModel).map(model => (
                       <option key={model} value={model}>{model}</option>
                    ))}
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">شماره سریال تابلو</label>
                 <input
                    type="text"
                    name="controlPanelSerial"
                    value={formData.controlPanelSerial}
                    onChange={handleInputChange}
                    placeholder="مثلاً: SN-12345"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 bg-white text-left ltr-input"
                 />
              </div>
           </div>
           
           {/* Warranty Feedback */}
           {formData.controlPanelSerial && warrantyStatus && (
              <div className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in ${
                 warrantyStatus.valid 
                   ? 'bg-green-50 text-green-700 border border-green-200' 
                   : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                 {warrantyStatus.valid ? <CheckCircle size={20} className="shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
                 <div className="flex-1">
                    <p className="font-bold text-base">{warrantyStatus.message}</p>
                    {warrantyStatus.expiry && (
                       <p className="text-xs opacity-80 mt-1">تاریخ انقضا: {warrantyStatus.expiry}</p>
                    )}
                    {!warrantyStatus.valid && (
                       <div className="flex items-center gap-1 mt-1 text-red-800 font-medium text-xs">
                          <CreditCard size={14} />
                          <span>هزینه کارشناسی: {INSPECTION_FEE.toLocaleString()} تومان</span>
                       </div>
                    )}
                 </div>
              </div>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام مشتری / مدیر</label>
            <input
              type="text"
              name="customerName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="مثال: آقای رضایی"
              value={formData.customerName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام ساختمان</label>
            <input
              type="text"
              name="buildingName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="مثال: برج نگین"
              value={formData.buildingName}
              onChange={handleInputChange}
              readOnly={!!formData.elevatorId} // Read-only if elevator is selected
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">شرح خرابی</label>
            <button
              type="button"
              onClick={handleAutoAnalyze}
              disabled={!formData.description || isAnalyzing}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
            >
              <Wand2 size={14} />
              {isAnalyzing ? 'در حال تحلیل...' : 'تحلیل اولویت با هوش مصنوعی'}
            </button>
          </div>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="توضیحات کامل مشکل پیش آمده..."
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
          {analysisResult && (
            <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded text-sm text-indigo-700 flex gap-2 items-start animate-fade-in">
              <Wand2 size={16} className="mt-1 flex-shrink-0" />
              <p><strong>تشخیص هوشمند:</strong> {analysisResult}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">سطح اولویت</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {Object.values(TicketPriority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
               warrantyStatus?.valid === false ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {warrantyStatus?.valid === false ? (
               <>
                 <CreditCard size={18} />
                 پرداخت و ثبت
               </>
            ) : (
               <>
                 <Save size={18} />
                 ثبت تیکت
               </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTicketForm;
