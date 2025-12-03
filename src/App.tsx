
import React, { useState } from 'react';
import { ViewState, Ticket, Technician, TicketStatus, TicketPriority, Elevator, ElevatorStatus, Part, InventoryTransaction, Invoice, User, UserRole, WarrantyRecord, ControlPanelModel, RepairJob, RenovationRequest } from './types';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import NewTicketForm from './components/NewTicketForm';
import ElevatorList from './components/ElevatorList';
import NewElevatorForm from './components/NewElevatorForm';
import Inventory from './components/Inventory';
import Accounting from './components/Accounting';
import TrainingCenter from './components/TrainingCenter';
import AiSupport from './components/AiSupport';
import Landing from './components/Landing';
import Login from './components/Login';
import RepairCenter from './components/RepairCenter';
import RenovationList from './components/RenovationList';
import WarrantyManager from './components/WarrantyManager';
import PaymentGateway from './components/PaymentGateway'; 
import WorkflowGuide from './components/WorkflowGuide';
import Logo from './components/Logo';

import { RESOURCE_DATABASE } from './resourceDatabase';
import { LayoutDashboard, Ticket as TicketIcon, Users, Plus, Menu, Bell, ArrowUpCircle, Package, FileText, BookOpen, Layers, Globe, LogOut, Bot, Cpu, Hammer, ShieldCheck, UserCircle, Wrench, Map } from 'lucide-react';

// --- MOCK USERS DATABASE ---
const MOCK_USERS: User[] = [
  { id: 'u1', username: 'keyvan', fullName: 'کیوان پار', role: 'CEO' },
  { id: 'u2', username: 'mostafa', fullName: 'مصطفی نوروزی', role: 'SUPPORT_SUPERVISOR' },
  { id: 'u3', username: 'majid', fullName: 'مجید مظفری', role: 'CALL_CENTER' },
  { id: 'u4', username: 'mehdi', fullName: 'مهدی شمس', role: 'CALL_CENTER' },
  { id: 'u5', username: 'touran', fullName: 'توران بشری', role: 'CALL_CENTER' },
  { id: 'u6', username: 'shima', fullName: 'شیما جنت خواه', role: 'ACCOUNTING_HEAD' },
  { id: 'u7', username: 'samaneh', fullName: 'سمانه گندمی', role: 'ACCOUNTANT' },
  { id: 'u8', username: 'ali', fullName: 'علی محمدی', role: 'WAREHOUSE' },
  { id: 'u9', username: 'nastaran', fullName: 'نسترن جلالوند', role: 'REPAIR_RECEPTION' },
  { id: 'u10', username: 'ramin', fullName: 'رامین پار', role: 'REPAIR_SUPERVISOR' },
  { id: 'u11', username: 'shakiba', fullName: 'شکیبا علی محمدی', role: 'REPAIR_TECH' },
  { id: 'u12', username: 'maryam', fullName: 'مریم هما', role: 'REPAIR_TECH' },
  { id: 'u13', username: 'mehdi_g', fullName: 'مهدی قاسمی', role: 'SITE_TECH' },
  { id: 'u14', username: 'morteza', fullName: 'مرتضی کریمی', role: 'SITE_TECH' },
  { id: 'u15', username: 'hamid', fullName: 'حمید امیر غفاری', role: 'SITE_TECH' },
  { id: 'u16', username: 'davood', fullName: 'داود میر غفاری', role: 'SITE_TECH' },
  { id: 'u17', username: 'bahman', fullName: 'بهمن عزیزی', role: 'SITE_TECH' },
  { id: 'u18', username: 'vahid', fullName: 'وحید حاتمی', role: 'SITE_TECH' },
  { id: 'u19', username: 'ali_z', fullName: 'علی زند', role: 'SITE_TECH' },
  { id: 'u20', username: 'mohammad', fullName: 'محمد علی حائری', role: 'RENOVATION_HEAD' },
];

const MOCK_TECHNICIANS: Technician[] = MOCK_USERS
  .filter(u => u.role === 'SITE_TECH' || u.role === 'SUPPORT_SUPERVISOR')
  .map(u => ({
    id: u.id,
    name: u.fullName,
    specialty: 'جنرال',
    isAvailable: true,
    avatar: ''
  }));

// --- MOCK DATA ---
const MOCK_ELEVATORS: Elevator[] = [
  { id: 'e1', serialNumber: 'PSS-998877', buildingName: 'مجتمع مسکونی پار', type: 'مسافربر', capacity: 6, floors: 8, installDate: '1398/05/10', lastServiceDate: '1403/01/15', status: ElevatorStatus.ACTIVE },
  { id: 'e2', serialNumber: 'PSS-112233', buildingName: 'برج اداری صدف', type: 'باربر', capacity: 10, floors: 12, installDate: '1400/11/20', lastServiceDate: '1403/02/01', status: ElevatorStatus.MAINTENANCE },
  { id: 'e3', serialNumber: 'PSS-445566', buildingName: 'بیمارستان سلامت', type: 'تخت‌بر', capacity: 13, floors: 6, installDate: '1399/08/15', lastServiceDate: '1402/12/20', status: ElevatorStatus.STOPPED },
];

const MOCK_WARRANTIES: WarrantyRecord[] = [
  { id: 'w1', serialNumber: 'SN-12345', model: ControlPanelModel.ALPHA, installDate: '1402/01/01', expiryDate: '1404/01/01', buildingName: 'مجتمع ارکیده', isActive: true },
  { id: 'w2', serialNumber: 'PSS-998877', model: ControlPanelModel.TRON_1, installDate: '1398/05/10', expiryDate: '1400/05/10', buildingName: 'مجتمع مسکونی پار', isActive: false },
];

const MOCK_TICKETS: Ticket[] = [
  { id: '1001', customerId: 'c1', customerName: 'آقای رضایی', buildingName: 'مجتمع گلها', elevatorId: 'e2', description: 'درب طبقه سوم بسته نمی‌شود و آسانسور حرکت نمی‌کند.', status: TicketStatus.PENDING, priority: TicketPriority.HIGH, createdAt: '1403/02/20', technicianId: 'u13' }, // Assigned to Mehdi Ghasemi
  { id: '1002', customerId: 'c2', customerName: 'مدیریت برج مهتاب', buildingName: 'برج مهتاب', description: 'سرویس دوره‌ای ماهانه', status: TicketStatus.ASSIGNED, priority: TicketPriority.LOW, createdAt: '1403/02/21', technicianId: 'u15' }, // Assigned to Hamid
  { id: '1003', customerId: 'c3', customerName: 'خانم کمالی', buildingName: 'ساختمان پزشکان', elevatorId: 'e3', description: 'صدای ناهنجار از موتورخانه شنیده می‌شود.', status: TicketStatus.IN_PROGRESS, priority: TicketPriority.CRITICAL, createdAt: '1403/02/22', technicianId: 'u14' }, // Assigned to Morteza
];

const MOCK_PARTS: Part[] = [
  { id: 'p1', sku: 'CNT-LC1D-SCH', name: 'کنتاکتور LC1D', brand: 'Schneider', category: 'تابلو فرمان', location: 'قفسه A-2', stock: 15, minStockLevel: 5, buyPrice: 850000, sellPrice: 1100000, supplier: 'برق صنعتی ایران', lastUpdated: '1403/02/01' },
  { id: 'p2', sku: 'BTN-PUSH-PAR', name: 'شستی احضار طبقه', brand: 'Par Sanat', category: 'قطعات جانبی', location: 'قفسه B-1', stock: 3, minStockLevel: 10, buyPrice: 150000, sellPrice: 220000, supplier: 'تولید داخلی', lastUpdated: '1403/02/05' },
  { id: 'p3', sku: 'RLY-FDR-OMR', name: 'رله فیندر شیشه‌ای', brand: 'Omron', category: 'الکترونیک', location: 'قفسه A-3', stock: 42, minStockLevel: 20, buyPrice: 45000, sellPrice: 85000, supplier: 'الکترونیک جوان', lastUpdated: '1403/01/20' },
  { id: 'p4', sku: 'OIL-HYD-TOT', name: 'روغن هیدرولیک ISO 68', brand: 'Total', category: 'مکانیکال', location: 'انبار 2 (بشکه)', stock: 2, minStockLevel: 3, buyPrice: 2500000, sellPrice: 3800000, supplier: 'روغن البرز', lastUpdated: '1403/02/10' },
];

const MOCK_TRANSACTIONS: InventoryTransaction[] = [
  { id: 'TX-101', partId: 'p1', partName: 'کنتاکتور LC1D', type: 'IN', quantity: 10, date: '1403/02/01', user: 'علی محمدی', reason: 'خرید فاکتور 445' },
  { id: 'TX-102', partId: 'p2', partName: 'شستی احضار طبقه', type: 'OUT', quantity: 2, date: '1403/02/05', user: 'رامین پار', reason: 'تیکت #1001' },
];

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-4001', date: '1403/02/10', customerName: 'مجتمع کوروش', status: 'PAID', items: [], totalAmount: 5500000 },
  { id: 'INV-4002', date: '1403/02/18', customerName: 'برج میلاد نور', status: 'PENDING', items: [], totalAmount: 12000000 },
];

const App: React.FC = () => {
  // --- STATE ---
  const [view, setView] = useState<ViewState>('LANDING');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [elevators, setElevators] = useState<Elevator[]>(MOCK_ELEVATORS);
  
  // Inventory State
  const [parts, setParts] = useState<Part[]>(MOCK_PARTS);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(MOCK_TRANSACTIONS);

  // New State for Persistence
  const [repairs, setRepairs] = useState<RepairJob[]>([]);
  const [renovationRequests, setRenovationRequests] = useState<RenovationRequest[]>([]);

  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [warranties, setWarranties] = useState<WarrantyRecord[]>(MOCK_WARRANTIES);
  
  // Payment State
  const [pendingPaymentTicket, setPendingPaymentTicket] = useState<Ticket | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- ACTIONS ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Redirect based on role
    if (user.role === 'SITE_TECH') setView('TICKETS');
    else if (user.role === 'REPAIR_TECH' || user.role === 'REPAIR_SUPERVISOR' || user.role === 'REPAIR_RECEPTION') setView('REPAIR_CENTER');
    else if (user.role === 'RENOVATION_HEAD') setView('RENOVATION_LIST');
    else setView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('LANDING');
  };

  const handleCreateTicket = (newTicket: Ticket) => {
    const ticketWithId = { ...newTicket, id: String(Date.now()).slice(-6), createdAt: new Date().toLocaleDateString('fa-IR') };
    
    if (newTicket.paymentStatus === 'PENDING') {
       setPendingPaymentTicket(ticketWithId);
       setView('PAYMENT_GATEWAY');
    } else {
       setTickets([ticketWithId, ...tickets]);
       // If public user created it, show success or go back
       if (!currentUser) alert('تیکت شما با موفقیت ثبت شد.');
       if (currentUser) setView('TICKETS');
       else setView('LANDING');
    }
  };

  const handlePaymentSuccess = (trackingCode: string) => {
     if (pendingPaymentTicket) {
        const finalizedTicket = { 
           ...pendingPaymentTicket, 
           paymentStatus: 'PAID' as any, 
           paymentTrackingCode: trackingCode,
           status: TicketStatus.PENDING 
        };
        setTickets([finalizedTicket, ...tickets]);
        setPendingPaymentTicket(null);
        alert(`پرداخت با موفقیت انجام شد.\nکد رهگیری: ${trackingCode}\nتیکت شما ثبت گردید.`);
        if (currentUser) setView('TICKETS');
        else setView('LANDING');
     }
  };

  // --- INVENTORY ACTIONS ---
  const handleAddPart = (newPart: Part) => {
    setParts([newPart, ...parts]);
  };

  const handleStockTransaction = (partId: string, type: 'IN' | 'OUT', qty: number, reason: string) => {
    // Update Stock
    setParts(parts.map(p => {
      if (p.id === partId) {
         return {
           ...p,
           stock: type === 'IN' ? p.stock + qty : p.stock - qty,
           lastUpdated: new Date().toLocaleDateString('fa-IR')
         };
      }
      return p;
    }));

    // Add Transaction Log
    const part = parts.find(p => p.id === partId);
    if (part) {
      const newTx: InventoryTransaction = {
        id: `TX-${Date.now()}`,
        partId: part.id,
        partName: part.name,
        type: type,
        quantity: qty,
        date: new Date().toLocaleDateString('fa-IR'),
        user: currentUser?.fullName || 'سیستم',
        reason: reason
      };
      setTransactions([newTx, ...transactions]);
    }
  };


  // --- RENDER HELPERS ---
  const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={() => { onClick(); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    // Public Views
    if (view === 'LANDING') return <Landing onNavigate={setView} />;
    if (view === 'LOGIN') return <Login users={MOCK_USERS} onLogin={handleLogin} onBack={() => setView('LANDING')} />;
    if (view === 'PUBLIC_NEW_TICKET') return (
      <div className="p-4 md:p-8">
        <NewTicketForm 
          elevators={elevators} 
          warranties={warranties}
          onSave={handleCreateTicket} 
          onPaymentRequired={handleCreateTicket}
          onCancel={() => setView('LANDING')} 
        />
      </div>
    );
    if (view === 'PUBLIC_AI_SUPPORT') return <div className="p-4 h-screen"><AiSupport /></div>;
    if (view === 'PUBLIC_RENOVATION') return <div className="p-4 md:p-8"><RenovationList /></div>; // Simplified public view could be added
    if (view === 'PUBLIC_TRAINING') return <div className="p-4 md:p-8"><TrainingCenter resources={RESOURCE_DATABASE} /></div>;
    
    if (view === 'PAYMENT_GATEWAY') return (
       <PaymentGateway 
          amount={pendingPaymentTicket?.paymentAmount || 0}
          description={`هزینه کارشناسی تابلو فرمان (سریال: ${pendingPaymentTicket?.controlPanelSerial})`}
          onSuccess={handlePaymentSuccess}
          onCancel={() => {
             setPendingPaymentTicket(null);
             if (currentUser) setView('NEW_TICKET'); else setView('PUBLIC_NEW_TICKET');
          }}
       />
    );

    // Private Views (Authenticated)
    if (!currentUser) return <div className="flex h-screen items-center justify-center">دسترسی غیرمجاز</div>;

    switch (view) {
      case 'DASHBOARD': return <Dashboard tickets={tickets} elevators={elevators} />;
      case 'TICKETS': return <TicketList tickets={tickets} technicians={MOCK_TECHNICIANS} elevators={elevators} onUpdateTicket={(t) => setTickets(tickets.map(tk => tk.id === t.id ? t : tk))} currentUser={currentUser} />;
      case 'NEW_TICKET': return <NewTicketForm elevators={elevators} warranties={warranties} onSave={handleCreateTicket} onPaymentRequired={handleCreateTicket} onCancel={() => setView('TICKETS')} />;
      case 'ELEVATORS': return <ElevatorList elevators={elevators} onAddClick={() => setView('NEW_ELEVATOR')} />;
      case 'NEW_ELEVATOR': return <NewElevatorForm onSave={(newElevator) => { setElevators([...elevators, { ...newElevator, id: Date.now().toString() }]); setView('ELEVATORS'); }} onCancel={() => setView('ELEVATORS')} />;
      
      case 'INVENTORY': return (
         <Inventory 
            parts={parts} 
            transactions={transactions} 
            onAddPart={handleAddPart}
            onStockTransaction={handleStockTransaction}
         />
      );
      
      case 'ACCOUNTING': return <Accounting invoices={invoices} onAddInvoice={(inv) => setInvoices([...invoices, inv])} />;
      case 'TRAINING': return <TrainingCenter resources={RESOURCE_DATABASE} />;
      case 'AI_SUPPORT': return <AiSupport />;
      case 'REPAIR_CENTER': return <RepairCenter currentUser={currentUser} users={MOCK_USERS} />;
      case 'RENOVATION_LIST': return <RenovationList />;
      case 'WARRANTY_MANAGEMENT': return <WarrantyManager warranties={warranties} onAddWarranty={w => setWarranties([...warranties, w])} onDeleteWarranty={id => setWarranties(warranties.filter(w => w.id !== id))} />;
      case 'WORKFLOW_GUIDE': return <WorkflowGuide />;
      default: return <Dashboard tickets={tickets} elevators={elevators} />;
    }
  };

  // If on a fullscreen page (Landing/Login/Public), render without layout
  const isFullScreen = ['LANDING', 'LOGIN', 'PUBLIC_NEW_TICKET', 'PUBLIC_AI_SUPPORT', 'PUBLIC_RENOVATION', 'PUBLIC_TRAINING', 'PAYMENT_GATEWAY'].includes(view);
  if (isFullScreen) {
     // Small back button for public sub-pages (except landing/login)
     if (view !== 'LANDING' && view !== 'LOGIN') {
        return (
           <div className="bg-gray-50 min-h-screen">
              <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
                 <div className="flex items-center gap-2">
                    <Logo size="sm" />
                 </div>
                 <button onClick={() => setView('LANDING')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">بازگشت به خانه</button>
              </div>
              {renderContent()}
           </div>
        );
     }
     return renderContent();
  }

  // --- MAIN LAYOUT (Authenticated) ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans text-right" dir="rtl">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static`}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-6 border-b border-slate-800 flex flex-col items-center">
             <Logo size="md" variant="light" />
             <div className="mt-4 text-center">
               <p className="text-xs text-slate-400">پنل مدیریت یکپارچه</p>
               <a href="https://paarlift.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 mt-1 block">وب‌سایت اصلی: Paarlift.com</a>
             </div>
          </div>

          {/* User Info */}
          {currentUser && (
             <div className="px-6 py-4 bg-slate-800/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                   {currentUser.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                   <p className="text-sm font-bold truncate">{currentUser.fullName}</p>
                   <p className="text-[10px] text-slate-400 truncate">{currentUser.username} | {currentUser.role}</p>
                </div>
             </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {/* CEO & General */}
            {['CEO', 'SUPPORT_SUPERVISOR', 'ACCOUNTING_HEAD'].includes(currentUser?.role || '') && (
               <SidebarItem icon={LayoutDashboard} label="داشبورد مدیریت" active={view === 'DASHBOARD'} onClick={() => setView('DASHBOARD')} />
            )}

            {/* Tickets */}
            {['CEO', 'SUPPORT_SUPERVISOR', 'CALL_CENTER', 'SITE_TECH'].includes(currentUser?.role || '') && (
               <SidebarItem icon={TicketIcon} label={currentUser?.role === 'SITE_TECH' ? 'ماموریت‌های من' : 'مدیریت تیکت‌ها'} active={view === 'TICKETS'} onClick={() => setView('TICKETS')} />
            )}

            {/* Elevators */}
            {['CEO', 'SUPPORT_SUPERVISOR', 'CALL_CENTER'].includes(currentUser?.role || '') && (
               <SidebarItem icon={ArrowUpCircle} label="لیست آسانسورها" active={view === 'ELEVATORS'} onClick={() => setView('ELEVATORS')} />
            )}

            {/* Repair Center */}
            {['CEO', 'REPAIR_SUPERVISOR', 'REPAIR_TECH', 'REPAIR_RECEPTION'].includes(currentUser?.role || '') && (
               <SidebarItem icon={Cpu} label="مرکز تعمیرات برد" active={view === 'REPAIR_CENTER'} onClick={() => setView('REPAIR_CENTER')} />
            )}
            
            {/* Renovation */}
            {['CEO', 'RENOVATION_HEAD'].includes(currentUser?.role || '') && (
               <SidebarItem icon={Hammer} label="پروژه‌های بازسازی" active={view === 'RENOVATION_LIST'} onClick={() => setView('RENOVATION_LIST')} />
            )}

            {/* Warranty */}
            {['CEO', 'SUPPORT_SUPERVISOR'].includes(currentUser?.role || '') && (
               <SidebarItem icon={ShieldCheck} label="مدیریت گارانتی" active={view === 'WARRANTY_MANAGEMENT'} onClick={() => setView('WARRANTY_MANAGEMENT')} />
            )}

            {/* Inventory */}
            {['CEO', 'WAREHOUSE', 'REPAIR_SUPERVISOR'].includes(currentUser?.role || '') && (
               <SidebarItem icon={Package} label="انبار حرفه‌ای" active={view === 'INVENTORY'} onClick={() => setView('INVENTORY')} />
            )}

            {/* Accounting */}
            {['CEO', 'ACCOUNTING_HEAD', 'ACCOUNTANT'].includes(currentUser?.role || '') && (
               <SidebarItem icon={FileText} label="حسابداری" active={view === 'ACCOUNTING'} onClick={() => setView('ACCOUNTING')} />
            )}

            {/* Common */}
            <div className="pt-4 mt-2 border-t border-slate-800">
               <p className="px-4 text-[10px] text-slate-500 uppercase font-bold mb-2">آموزش و راهنما</p>
               <SidebarItem icon={Map} label="فلوچارت‌های کاری" active={view === 'WORKFLOW_GUIDE'} onClick={() => setView('WORKFLOW_GUIDE')} />
               <SidebarItem icon={BookOpen} label="کتابخانه فنی" active={view === 'TRAINING'} onClick={() => setView('TRAINING')} />
               <SidebarItem icon={Bot} label="دستیار هوشمند" active={view === 'AI_SUPPORT'} onClick={() => setView('AI_SUPPORT')} />
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <LogOut size={16} />
              خروج از سیستم
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header (Mobile Only for Menu) */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between md:hidden">
           <div className="flex items-center gap-2">
              <Logo size="sm" />
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
             <Menu size={24} />
           </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
           {renderContent()}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;
