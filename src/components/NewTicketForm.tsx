
import React, { useState } from 'react';
import { ElevatorStatus } from '../types';
import { Save, X, Box } from 'lucide-react';

interface NewElevatorFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const NewElevatorForm: React.FC<NewElevatorFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    serialNumber: '',
    buildingName: '',
    type: 'مسافربر',
    capacity: 6,
    floors: 5,
    installDate: '',
    lastServiceDate: '',
    status: ElevatorStatus.ACTIVE,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto p-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Box className="text-blue-600" />
          ثبت مشخصات آسانسور جدید
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام ساختمان</label>
            <input
              type="text"
              name="buildingName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="مثال: مجتمع ارکیده"
              value={formData.buildingName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">شماره سریال / پلاک</label>
            <input
              type="text"
              name="serialNumber"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left"
              placeholder="SN-123456"
              value={formData.serialNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع کاربری</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="مسافربر">مسافربر</option>
              <option value="باربر">باربر</option>
              <option value="تخت‌بر">تخت‌بر</option>
              <option value="خودروبر">خودروبر</option>
              <option value="خدماتی">خدماتی</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ظرفیت (نفر)</label>
            <input
              type="number"
              name="capacity"
              min="1"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={formData.capacity}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تعداد توقف</label>
            <input
              type="number"
              name="floors"
              min="2"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={formData.floors}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ نصب</label>
            <input
              type="text"
              name="installDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="1400/01/01"
              value={formData.installDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">آخرین سرویس</label>
            <input
              type="text"
              name="lastServiceDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="1403/02/01"
              value={formData.lastServiceDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت فعلی</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {Object.values(ElevatorStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            ذخیره اطلاعات
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewElevatorForm;
