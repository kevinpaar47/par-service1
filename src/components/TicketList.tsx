
import React, { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus, Technician, Elevator } from '../types';
import { AlertTriangle, CheckCircle, Clock, Zap, User, ArrowUpCircle, MapPin, Play, Square, CheckSquare, X } from 'lucide-react';
import { suggestTechnicalSolution } from '../services/geminiService';

interface TicketListProps {
  tickets: Ticket[];
  technicians: Technician[];
  elevators: Elevator[];
  onUpdateTicket: (updatedTicket: Ticket) => void;
  currentUser?: any; // To filter for technician
}

const TicketList: React.FC<TicketListProps> = ({ tickets, technicians, elevators, onUpdateTicket, currentUser }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MY_MISSIONS'>('ALL');
  
  // Completion Report Modal State
  const [completingTicket, setCompletingTicket] = useState<Ticket | null>(null);
  const [reportText, setReportText] = useState('');

  // Determine if user is a technician
  const isTechnician = currentUser?.role === 'SITE_TECH';

  // --- Logic ---
  const handleAiAssist = async (ticket: Ticket) => {
    setLoadingAi(true);
    const linkedElevator = elevators.find(e => e.id === ticket.elevatorId);
    const context = linkedElevator ? `${linkedElevator.type} (${linkedElevator.buildingName})` : "مسکونی";
    const solution = await suggestTechnicalSolution(ticket.description, context);
    onUpdateTicket({ ...ticket, aiSolution: solution });
    setLoadingAi(false);
  };

  const handleStartMission = (e: React.MouseEvent, ticket: Ticket) => {
     e.stopPropagation();
     if (window.confirm("آیا مأموریت را شروع می‌کنید؟ وضعیت به 'در حال انجام' تغییر می‌کند.")) {
        onUpdateTicket({ ...ticket, status: TicketStatus.IN_PROGRESS });
     }
  };

  const handleCompleteClick = (e: React.MouseEvent, ticket: Ticket) => {
     e.stopPropagation();
     setCompletingTicket(ticket);
     setReportText('');
  };

  const submitCompletion = () => {
     if (!completingTicket) return;
     onUpdateTicket({
        ...completingTicket,
        status: TicketStatus.COMPLETED,
        technicianReport: reportText,
        completionDate: new Date().toLocaleDateString('fa-IR')
     });
     setCompletingTicket(null);
  };

  // Filter Logic
  const myMissions = tickets.filter(t => t.technicianId === currentUser?.id);
  const displayedTickets = (isTechnician && activeTab === 'MY_MISSIONS') ? myMissions : tickets;

  // --- Helpers ---
  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
      case TicketPriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case TicketPriority.MEDIUM: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case TicketPriority.LOW: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.COMPLETED: return <CheckCircle size={18} className="text-green-500" />;
      case TicketStatus.PENDING: return <Clock size={18} className="text-yellow-500" />;
      case TicketStatus.IN_PROGRESS: return <Zap size={18} className="text-blue-500 animate-pulse" />;
      default: return <AlertTriangle size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in relative">
      
      {/* Header & Tabs */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">
           {isTechnician ? 'مأموریت‌های من' : 'لیست درخواست‌های سرویس'}
        </h2>
        
        {isTechnician && (
           <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('MY_MISSIONS')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'MY_MISSIONS' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 مأموریت‌های من ({myMissions.filter(t => t.status !== TicketStatus.COMPLETED).length})
              </button>
              <button 
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 همه تیکت‌ها
              </button>
           </div>
        )}
      </div>

      {/* Completion Modal */}
      {completingTicket && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 animate-fade-in-up">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">گزارش پایان کار</h3>
                  <button onClick={() => setCompletingTicket(null)}><X size={24} className="text-gray-400" /></button>
               </div>
               
               <div className="bg-blue-50 p-3 rounded mb-4 text-sm text-blue-800">
                  <p className="font-bold">{completingTicket.buildingName}</p>
                  <p>{completingTicket.description}</p>
               </div>

               <label className="block text-sm font-medium text-gray-700 mb-2">اقدامات انجام شده:</label>
               <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 mb-4 focus:ring-2 focus:ring-blue-500"
                  placeholder="توضیح دهید چه کارهایی انجام شد و مشکل چگونه برطرف گردید..."
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
               ></textarea>

               <button 
                  onClick={submitCompletion}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
               >
                  <CheckSquare size={20} />
                  ثبت گزارش و بستن تیکت
               </button>
            </div>
         </div>
      )}

      {/* Ticket List */}
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-sm hidden md:table-header-group">
            <tr>
              <th className="px-6 py-4 font-medium">شماره</th>
              <th className="px-6 py-4 font-medium">ساختمان</th>
              <th className="px-6 py-4 font-medium">شرح خرابی</th>
              <th className="px-6 py-4 font-medium">اولویت</th>
              <th className="px-6 py-4 font-medium">وضعیت</th>
              <th className="px-6 py-4 font-medium">تکنسین</th>
              {isTechnician && <th className="px-6 py-4 font-medium">اقدام</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 block md:table-row-group">
            {displayedTickets.map((ticket) => {
               const linkedElevator = elevators.find(e => e.id === ticket.elevatorId);
               return (
              <React.Fragment key={ticket.id}>
                {/* Mobile Card View / Desktop Table Row */}
                <tr 
                  className={`
                    flex flex-col md:table-row 
                    border-b border-gray-100 md:border-none 
                    p-4 md:p-0 
                    hover:bg-blue-50/50 transition-colors cursor-pointer 
                    ${selectedTicketId === ticket.id ? 'bg-blue-50' : ''}
                    ${ticket.priority === TicketPriority.CRITICAL ? 'bg-red-50/30' : ''}
                  `}
                  onClick={() => setSelectedTicketId(selectedTicketId === ticket.id ? null : ticket.id)}
                >
                  <td className="px-6 py-2 md:py-4 text-sm font-mono text-gray-500 flex justify-between md:table-cell">
                     <span className="md:hidden font-bold">شماره تیکت:</span>
                     #{ticket.id}
                  </td>
                  <td className="px-6 py-2 md:py-4 md:table-cell">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 text-lg md:text-base">{ticket.customerName}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                         <MapPin size={12} />
                         {ticket.buildingName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2 md:py-4 text-sm text-gray-600 truncate max-w-xs md:table-cell">
                     <span className="md:hidden font-bold block mb-1">شرح:</span>
                     {ticket.description}
                  </td>
                  <td className="px-6 py-2 md:py-4 md:table-cell">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-2 md:py-4 md:table-cell flex items-center justify-between md:justify-start">
                    <span className="md:hidden font-bold">وضعیت:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <span className="text-sm text-gray-700">{ticket.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2 md:py-4 md:table-cell flex items-center justify-between md:justify-start">
                     <span className="md:hidden font-bold">تکنسین:</span>
                     {ticket.technicianId ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                           <User size={14} />
                           {technicians.find(t => t.id === ticket.technicianId)?.name || 'نامشخص'}
                        </div>
                     ) : (
                        <span className="text-xs text-gray-400 italic">تعیین نشده</span>
                     )}
                  </td>
                  
                  {/* Technician Actions Column */}
                  {isTechnician && (
                     <td className="px-6 py-4 md:table-cell" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                           {ticket.status === TicketStatus.ASSIGNED && (
                              <button 
                                onClick={(e) => handleStartMission(e, ticket)}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 flex items-center gap-1 w-full md:w-auto justify-center"
                              >
                                 <Play size={14} /> شروع
                              </button>
                           )}
                           {ticket.status === TicketStatus.IN_PROGRESS && (
                              <button 
                                onClick={(e) => handleCompleteClick(e, ticket)}
                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-green-700 flex items-center gap-1 w-full md:w-auto justify-center"
                              >
                                 <Square size={14} /> پایان
                              </button>
                           )}
                        </div>
                     </td>
                  )}
                </tr>

                {/* Expanded Details Row */}
                {selectedTicketId === ticket.id && (
                  <tr className="block md:table-row">
                    <td colSpan={isTechnician ? 7 : 6} className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">جزئیات کامل</h4>
                          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                             {linkedElevator && (
                                <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 text-blue-800 rounded text-sm border border-blue-100">
                                   <ArrowUpCircle size={16} />
                                   <strong>دستگاه:</strong>
                                   <span>{linkedElevator.type} - {linkedElevator.capacity} نفر</span>
                                </div>
                             )}
                             <p className="text-sm text-gray-600 leading-relaxed mb-4">
                               {ticket.description}
                             </p>
                             
                             {/* Technician Report View */}
                             {ticket.technicianReport && (
                                <div className="mt-4 border-t pt-3">
                                   <h5 className="font-bold text-green-700 text-sm mb-1">گزارش انجام کار:</h5>
                                   <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">{ticket.technicianReport}</p>
                                </div>
                             )}

                             {ticket.aiAnalysis && (
                                <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded text-sm text-indigo-800">
                                   <strong>تحلیل سیستم:</strong> {ticket.aiAnalysis}
                                </div>
                             )}
                          </div>
                        </div>
                        
                        {/* AI Assistance */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              <Zap size={16} className="text-yellow-500" />
                              دستیار فنی
                            </h4>
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleAiAssist(ticket); }}
                               disabled={loadingAi}
                               className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                               {loadingAi && ticket.aiSolution === undefined ? 'در حال تحلیل...' : 'راهکار فنی'}
                            </button>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[100px] text-sm text-gray-600">
                            {ticket.aiSolution ? (
                              <div className="whitespace-pre-line leading-7">
                                {ticket.aiSolution}
                              </div>
                            ) : (
                              <p className="text-gray-400 italic text-center mt-4">
                                برای دریافت پیشنهادات تعمیراتی دکمه بالا را بزنید.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );})}
          </tbody>
        </table>
      </div>
      
      {displayedTickets.length === 0 && (
         <div className="text-center py-10">
            <p className="text-gray-500">موردی یافت نشد.</p>
         </div>
      )}
    </div>
  );
};

export default TicketList;
