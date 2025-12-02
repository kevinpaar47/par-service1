
import React from 'react';
import { Ticket, TicketStatus, TicketPriority, Elevator, ElevatorStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, ArrowUpCircle, XCircle } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
  elevators: Elevator[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const ELEVATOR_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#f97316'];

const Dashboard: React.FC<DashboardProps> = ({ tickets, elevators }) => {
  // Stats Calculation
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(t => t.status === TicketStatus.PENDING).length;
  const urgentTickets = tickets.filter(t => t.priority === TicketPriority.CRITICAL || t.priority === TicketPriority.HIGH).length;
  const completedToday = tickets.filter(t => t.status === TicketStatus.COMPLETED).length;
  
  const totalElevators = elevators.length;
  const stoppedElevators = elevators.filter(e => e.status === ElevatorStatus.STOPPED).length;
  const maintenanceElevators = elevators.filter(e => e.status === ElevatorStatus.MAINTENANCE).length;

  // Chart Data Preparation
  const statusData = [
    { name: 'در انتظار', value: tickets.filter(t => t.status === TicketStatus.PENDING).length },
    { name: 'در حال انجام', value: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length },
    { name: 'تکمیل شده', value: tickets.filter(t => t.status === TicketStatus.COMPLETED).length },
  ];

  const priorityData = [
    { name: 'کم', value: tickets.filter(t => t.priority === TicketPriority.LOW).length },
    { name: 'متوسط', value: tickets.filter(t => t.priority === TicketPriority.MEDIUM).length },
    { name: 'زیاد', value: tickets.filter(t => t.priority === TicketPriority.HIGH).length },
    { name: 'بحرانی', value: tickets.filter(t => t.priority === TicketPriority.CRITICAL).length },
  ];

  const elevatorStatusData = [
    { name: 'فعال', value: elevators.filter(e => e.status === ElevatorStatus.ACTIVE).length },
    { name: 'متوقف', value: elevators.filter(e => e.status === ElevatorStatus.STOPPED).length },
    { name: 'در حال سرویس', value: elevators.filter(e => e.status === ElevatorStatus.MAINTENANCE).length },
    { name: 'بازرسی', value: elevators.filter(e => e.status === ElevatorStatus.INSPECTION).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">داشبورد مدیریتی</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">کل تیکت‌ها</p>
            <h3 className="text-3xl font-bold text-gray-800">{totalTickets}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">در انتظار اقدام</p>
            <h3 className="text-3xl font-bold text-yellow-600">{pendingTickets}</h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">تیکت‌های فوری</p>
            <h3 className="text-3xl font-bold text-red-600">{urgentTickets}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">آسانسورهای متوقف</p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-3xl font-bold text-red-600">{stoppedElevators}</h3>
               <span className="text-sm text-gray-400">از {totalElevators}</span>
            </div>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">وضعیت تیکت‌ها</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">توزیع اولویت‌ها</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priorityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">وضعیت ناوگان آسانسور</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={elevatorStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                 {elevatorStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ELEVATOR_COLORS[index % ELEVATOR_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
