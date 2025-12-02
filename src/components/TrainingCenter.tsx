
import React, { useState } from 'react';
import { Resource, ResourceType } from '../types';
import { PlayCircle, FileText, BookOpen, Download, Film, Map, GraduationCap } from 'lucide-react';

interface TrainingCenterProps {
  resources: Resource[];
}

const TrainingCenter: React.FC<TrainingCenterProps> = ({ resources }) => {
  const [activeTab, setActiveTab] = useState<ResourceType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'STANDARD', 'CONTROL_PANEL', 'MOTOR', 'DOOR', 'MECHANICAL'];
  const categoryLabels: Record<string, string> = {
    'ALL': 'همه دسته‌ها',
    'STANDARD': 'مبانی و آموزش عمومی',
    'CONTROL_PANEL': 'تابلو فرمان',
    'MOTOR': 'موتور و درایو',
    'DOOR': 'درب‌ها',
    'MECHANICAL': 'مکانیکال'
  };

  const filteredResources = resources.filter(res => {
    const typeMatch = activeTab === 'ALL' || res.type === activeTab;
    const catMatch = selectedCategory === 'ALL' || res.category === selectedCategory;
    return typeMatch && catMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">کتابخانه فنی دیجیتال</h2>
          <p className="text-slate-300 max-w-2xl">
            دانلود مستقیم کاتالوگ‌ها، نقشه‌های سیم‌کشی و ویدیوهای آموزشی محصولات پار صنعت صعود.
            تمامی مستندات برای دسترسی آفلاین هوش مصنوعی نیز ایندکس شده‌اند.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div className="flex gap-2 flex-wrap">
           <button 
             onClick={() => setActiveTab('ALL')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
             ${activeTab === 'ALL' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <BookOpen size={18} /> همه منابع
           </button>
           <button 
             onClick={() => setActiveTab('PDF')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
             ${activeTab === 'PDF' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <FileText size={18} /> مقالات و کاتالوگ
           </button>
           <button 
             onClick={() => setActiveTab('VIDEO')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
             ${activeTab === 'VIDEO' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Film size={18} /> ویدیوها
           </button>
           <button 
             onClick={() => setActiveTab('MAP')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
             ${activeTab === 'MAP' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Map size={18} /> نقشه‌ها
           </button>
        </div>

        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{categoryLabels[cat]}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div key={res.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full">
            
            {/* Thumbnail Area */}
            <div className="h-40 bg-gray-100 relative overflow-hidden rounded-t-xl flex items-center justify-center">
               {res.type === 'VIDEO' ? (
                 <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                       <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Placeholder for video thumb if real url existed */}
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                      <Film size={32} />
                    </div> 
                 </div>
               ) : (
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                   res.category === 'STANDARD' ? 'bg-indigo-100 text-indigo-600' :
                   res.type === 'PDF' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'
                 }`}>
                    {res.category === 'STANDARD' ? <GraduationCap size={32} /> : 
                     res.type === 'PDF' ? <FileText size={32} /> : <Map size={32} />}
                 </div>
               )}
               
               <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-gray-200">
                 {categoryLabels[res.category] || res.category}
               </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-800 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                {res.title}
              </h3>
              
              {res.model && (
                 <span className="text-xs text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded mb-2">
                   مدل: {res.model}
                 </span>
              )}

              <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                {res.description}
              </p>
              
              <button className="mt-auto w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:border-blue-100 group-hover:bg-blue-50">
                {res.type === 'VIDEO' ? 'مشاهده آنلاین' : 'مطالعه / دانلود'} 
                {res.type === 'VIDEO' ? <PlayCircle size={16} /> : <Download size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
           <p className="text-gray-400">موردی در این دسته‌بندی یافت نشد.</p>
        </div>
      )}
    </div>
  );
};

export default TrainingCenter;
