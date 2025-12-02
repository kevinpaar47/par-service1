
import React from 'react';
import { Elevator, ElevatorStatus } from '../types';
import { Box, CheckCircle, AlertTriangle, XCircle, Calendar, Plus, PenTool } from 'lucide-react';

interface ElevatorListProps {
  elevators: Elevator[];
  onAddClick: () => void;
}

const ElevatorList: React.FC<ElevatorListProps> = ({ elevators, onAddClick }) => {
  
  const getStatusConfig = (status: ElevatorStatus) => {
    switch (status) {
      case ElevatorStatus.ACTIVE: 
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={16} /> };
      case ElevatorStatus.MAINTENANCE: 
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <PenTool size={16} /> };
      case ElevatorStatus.STOPPED: 
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle size={16} /> };
      case ElevatorStatus.INSPECTION:
        return { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <AlertTriangle size={16} /> };
      default: 
        return { color: 'bg-gray-100 text-gray-700', icon: <Box size={16} /> };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">مدیریت آسانسورها</h2>
        <button 
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          ثبت آسانسور جدید
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">شماره سریال</th>
                <th className="px-6 py-4 font-medium">نام ساختمان</th>
                <th className="px-6 py-4 font-medium">نوع / ظرفیت</th>
                <th className="px-6 py-4 font-medium">تعداد توقف</th>
                <th className="px-6 py-4 font-medium">آخرین سرویس</th>
                <th className="px-6 py-4 font-medium">وضعیت</th>
                <th className="px-6 py-4 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {elevators.map((elevator) => {
                const statusConfig = getStatusConfig(elevator.status);
                return (
                  <tr key={elevator.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{elevator.serialNumber}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{elevator.buildingName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {elevator.type} ({elevator.capacity} نفر)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{elevator.floors} طبقه</td>
                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {elevator.lastServiceDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {elevator.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        مشاهده سوابق
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {elevators.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Box size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">هیچ آسانسوری ثبت نشده است</h3>
          <p className="text-gray-400 text-sm mt-1">برای شروع دکمه "ثبت آسانسور جدید" را بزنید</p>
        </div>
      )}
    </div>
  );
};

export default ElevatorList;
