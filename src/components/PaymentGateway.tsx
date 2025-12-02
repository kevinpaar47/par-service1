
import React, { useState } from 'react';
import { ControlPanelModel, WarrantyRecord } from '../types';
import { ShieldCheck, Plus, Search, Calendar, Save, Trash2 } from 'lucide-react';

interface WarrantyManagerProps {
  warranties: WarrantyRecord[];
  onAddWarranty: (record: WarrantyRecord) => void;
  onDeleteWarranty: (id: string) => void;
}

const WarrantyManager: React.FC<WarrantyManagerProps> = ({ warranties, onAddWarranty, onDeleteWarranty }) => {
  const [newRecord, setNewRecord] = useState({
    serialNumber: '',
    model: ControlPanelModel.ALPHA,
    installDate: '',
    expiryDate: '',
    buildingName: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: WarrantyRecord = {
      id: Date.now().toString(),
      ...newRecord,
      isActive: true // You might calculate this based on date
    };
    onAddWarranty(record);
    setNewRecord({
      serialNumber: '',
      model: ControlPanelModel.ALPHA,
      installDate: '',
      expiryDate: '',
      buildingName: ''
    });
  };

  const filteredWarranties = warranties.filter(w => 
    w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.buildingName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" />
            مدیریت گارانتی تابلو فرمان‌ها
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            ثبت شماره سریال و تاریخ انقضای گارانتی (مخصوص سرپرست پشتیبانی)
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
           <Plus size={18} />
           ثبت سریال جدید
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">مدل تابلو</label>
            <select
              name="model"
              value={newRecord.model}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 bg-gray-50"
            >
              {Object.values(ControlPanelModel).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">شماره سریال</label>
            <input
              type="text"
              name="serialNumber"
              value={newRecord.serialNumber}
              onChange={handleInputChange}
              placeholder="مثلاً SN-998877"
              className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 ltr-input text-left"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">نام پروژه/ساختمان</label>
            <input
              type="text"
              name="buildingName"
              value={newRecord.buildingName}
              onChange={handleInputChange}
              placeholder="اختیاری"
              className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500"
            />
          </div>
          <div>
             <label className="block text-xs font-medium text-gray-700 mb-1">تاریخ پایان گارانتی</label>
             <input
               type="text"
               name="expiryDate"
               value={newRecord.expiryDate}
               onChange={handleInputChange}
               placeholder="1404/01/01"
               className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500"
               required
             />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 h-[42px]">
            <Save size={18} />
            ثبت در سیستم
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
           <Search size={18} className="text-gray-400" />
           <input 
             type="text" 
             placeholder="جستجو بر اساس سریال یا نام ساختمان..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="bg-transparent outline-none flex-1 text-sm"
           />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">شماره سریال</th>
                <th className="px-6 py-4 font-medium">مدل تابلو</th>
                <th className="px-6 py-4 font-medium">نام ساختمان</th>
                <th className="px-6 py-4 font-medium">پایان گارانتی</th>
                <th className="px-6 py-4 font-medium">وضعیت</th>
                <th className="px-6 py-4 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWarranties.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-bold text-gray-700">{w.serialNumber}</td>
                  <td className="px-6 py-4 text-sm">{w.model}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{w.buildingName || '-'}</td>
                  <td className="px-6 py-4 text-sm flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {w.expiryDate}
                  </td>
                  <td className="px-6 py-4">
                     {/* Simple date check logic could go here */}
                     <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
                        فعال
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onDeleteWarranty(w.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWarranties.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">
                    موردی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarrantyManager;
