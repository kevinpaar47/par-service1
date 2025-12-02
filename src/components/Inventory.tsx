
import React, { useState } from 'react';
import { Part, InventoryTransaction } from '../types';
import { Package, AlertTriangle, Plus, Search, Filter, History, MapPin, ArrowUpCircle, ArrowDownCircle, Boxes, DollarSign, X, CheckCircle } from 'lucide-react';

interface InventoryProps {
  parts: Part[];
  transactions: InventoryTransaction[];
  onAddPart: (part: Part) => void;
  onStockTransaction: (partId: string, type: 'IN' | 'OUT', qty: number, reason: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ parts, transactions, onAddPart, onStockTransaction }) => {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'TRANSACTIONS' | 'ALERTS'>('STOCK');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState<{ type: 'IN' | 'OUT', part: Part } | null>(null);
  const [txQty, setTxQty] = useState('');
  const [txReason, setTxReason] = useState('');

  // New Part State
  const [newPart, setNewPart] = useState<Partial<Part>>({});

  // Calculations
  const totalValue = parts.reduce((acc, part) => acc + (part.stock * part.buyPrice), 0);
  const lowStockItems = parts.filter(p => p.stock <= p.minStockLevel);

  // Filter Logic
  const filteredParts = parts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    const part: Part = {
      id: `P-${Date.now()}`,
      sku: newPart.sku || `SKU-${Math.floor(Math.random()*10000)}`,
      name: newPart.name || '',
      brand: newPart.brand || '',
      category: newPart.category || 'عمومی',
      location: newPart.location || 'انبار موقت',
      stock: Number(newPart.stock) || 0,
      minStockLevel: Number(newPart.minStockLevel) || 5,
      buyPrice: Number(newPart.buyPrice) || 0,
      sellPrice: Number(newPart.sellPrice) || 0,
      supplier: newPart.supplier || '',
      lastUpdated: new Date().toLocaleDateString('fa-IR')
    };
    onAddPart(part);
    setShowAddModal(false);
    setNewPart({});
  };

  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTxModal || !txQty) return;
    
    onStockTransaction(
       showTxModal.part.id, 
       showTxModal.type, 
       parseInt(txQty), 
       txReason || (showTxModal.type === 'IN' ? 'خرید' : 'مصرف')
    );
    
    setShowTxModal(null);
    setTxQty('');
    setTxReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <Boxes className="text-blue-600" />
             سیستم انبارداری هوشمند
           </h2>
           <p className="text-sm text-gray-500 mt-1">مدیریت موجودی، کاردکس کالا و ارزش‌گذاری ریالی</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('ALERTS')}
             className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors font-medium relative"
           >
             <AlertTriangle size={20} />
             کسری انبار
             {lowStockItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center animate-pulse">
                   {lowStockItems.length}
                </span>
             )}
           </button>
           <button 
             onClick={() => setShowAddModal(true)}
             className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
           >
             <Plus size={20} />
             تعریف کالای جدید
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package size={24} /></div>
           <div>
              <p className="text-sm text-gray-500">تعداد اقلام</p>
              <h3 className="text-xl font-bold text-gray-800">{parts.length} قلم</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={24} /></div>
           <div>
              <p className="text-sm text-gray-500">ارزش کل موجودی</p>
              <h3 className="text-xl font-bold text-emerald-600">{totalValue.toLocaleString()} <span className="text-xs text-gray-400">تومان</span></h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><ArrowUpCircle size={24} /></div>
           <div>
              <p className="text-sm text-gray-500">ورودی ماه</p>
              <h3 className="text-xl font-bold text-gray-800">{transactions.filter(t => t.type === 'IN').length} تراکنش</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><ArrowDownCircle size={24} /></div>
           <div>
              <p className="text-sm text-gray-500">خروجی ماه</p>
              <h3 className="text-xl font-bold text-gray-800">{transactions.filter(t => t.type === 'OUT').length} تراکنش</h3>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-4 rounded-t-xl">
        <button onClick={() => setActiveTab('STOCK')} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'STOCK' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>لیست موجودی (Stock)</button>
        <button onClick={() => setActiveTab('TRANSACTIONS')} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'TRANSACTIONS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>گردش کالا (Kardex)</button>
        <button onClick={() => setActiveTab('ALERTS')} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ALERTS' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>هشدار کسری</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0 p-6 min-h-[400px]">
        
        {/* TAB 1: STOCK LIST */}
        {activeTab === 'STOCK' && (
          <div className="space-y-4">
             <div className="flex gap-4 mb-4">
               <div className="relative flex-1">
                 <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   placeholder="جستجوی نام کالا، کد (SKU) یا موقعیت..." 
                   className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <button className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                 <Filter size={18} /> فیلتر
               </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-right">
                   <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                      <tr>
                         <th className="px-4 py-3">کد کالا (SKU)</th>
                         <th className="px-4 py-3">نام قطعه</th>
                         <th className="px-4 py-3">موقعیت</th>
                         <th className="px-4 py-3">برند / تامین‌کننده</th>
                         <th className="px-4 py-3 text-center">موجودی</th>
                         <th className="px-4 py-3">قیمت واحد</th>
                         <th className="px-4 py-3 text-center">عملیات سریع</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {filteredParts.map(part => (
                         <tr key={part.id} className="hover:bg-blue-50/50 transition-colors group">
                            <td className="px-4 py-3 text-xs font-mono text-gray-500">{part.sku}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">{part.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                               <MapPin size={14} className="text-gray-400" />
                               {part.location}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{part.brand}</td>
                            <td className="px-4 py-3 text-center">
                               <span className={`inline-block px-3 py-1 rounded-full font-mono font-bold text-sm ${part.stock <= part.minStockLevel ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                                  {part.stock}
                               </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{part.buyPrice.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                               <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setShowTxModal({ type: 'IN', part })} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 tooltip" title="ورود کالا (خرید)">
                                     <Plus size={16} />
                                  </button>
                                  <button onClick={() => setShowTxModal({ type: 'OUT', part })} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 tooltip" title="خروج کالا (مصرف)">
                                     <ArrowDownCircle size={16} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* TAB 2: TRANSACTIONS (KARDEX) */}
        {activeTab === 'TRANSACTIONS' && (
           <div className="overflow-x-auto">
              <table className="w-full text-right">
                 <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                       <th className="px-4 py-3">شناسه تراکنش</th>
                       <th className="px-4 py-3">نام کالا</th>
                       <th className="px-4 py-3">نوع عملیات</th>
                       <th className="px-4 py-3">تعداد</th>
                       <th className="px-4 py-3">تاریخ</th>
                       <th className="px-4 py-3">کاربر</th>
                       <th className="px-4 py-3">علت / مرجع</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {transactions.map(tx => (
                       <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-xs font-mono text-gray-400">{tx.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{tx.partName}</td>
                          <td className="px-4 py-3">
                             {tx.type === 'IN' ? (
                                <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded w-fit">
                                   <ArrowUpCircle size={14} /> ورود
                                </span>
                             ) : (
                                <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded w-fit">
                                   <ArrowDownCircle size={14} /> خروج
                                </span>
                             )}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold">{tx.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{tx.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{tx.user}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 italic">{tx.reason}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {/* TAB 3: ALERTS */}
        {activeTab === 'ALERTS' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowStockItems.length === 0 ? (
                 <div className="col-span-2 text-center py-12 text-gray-400">
                    <CheckCircle size={48} className="mx-auto text-green-200 mb-2" />
                    موجودی انبار در وضعیت نرمال است.
                 </div>
              ) : (
                 lowStockItems.map(part => (
                    <div key={part.id} className="bg-red-50 border border-red-100 rounded-xl p-4 flex justify-between items-center">
                       <div>
                          <h4 className="font-bold text-red-800 flex items-center gap-2">
                             <AlertTriangle size={18} /> {part.name}
                          </h4>
                          <p className="text-sm text-red-600 mt-1">
                             موجودی فعلی: <span className="font-bold text-lg">{part.stock}</span> (حداقل: {part.minStockLevel})
                          </p>
                          <p className="text-xs text-red-500 mt-1">تامین‌کننده: {part.supplier}</p>
                       </div>
                       <button 
                         onClick={() => setShowTxModal({ type: 'IN', part })}
                         className="bg-white text-red-600 border border-red-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
                       >
                          شارژ سریع
                       </button>
                    </div>
                 ))
              )}
           </div>
        )}
      </div>

      {/* --- ADD PART MODAL --- */}
      {showAddModal && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 animate-fade-in-up shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">تعریف کالای جدید در انبار</h3>
                  <button onClick={() => setShowAddModal(false)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
               </div>
               
               <form onSubmit={handleCreatePart} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="نام قطعه (الزامی)" className="input-field border p-2 rounded" required onChange={e => setNewPart({...newPart, name: e.target.value})} />
                  <input placeholder="کد کالا (SKU) - اختیاری" className="input-field border p-2 rounded" onChange={e => setNewPart({...newPart, sku: e.target.value})} />
                  
                  <input placeholder="برند" className="input-field border p-2 rounded" onChange={e => setNewPart({...newPart, brand: e.target.value})} />
                  <input placeholder="دسته‌بندی (تابلو، مکانیک...)" className="input-field border p-2 rounded" onChange={e => setNewPart({...newPart, category: e.target.value})} />
                  
                  <input placeholder="موقعیت (قفسه/ردیف)" className="input-field border p-2 rounded" onChange={e => setNewPart({...newPart, location: e.target.value})} />
                  <input placeholder="تامین‌کننده" className="input-field border p-2 rounded" onChange={e => setNewPart({...newPart, supplier: e.target.value})} />

                  <div className="md:col-span-2 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-2">
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">موجودی اولیه</label>
                        <input type="number" className="input-field border p-2 rounded w-full" required onChange={e => setNewPart({...newPart, stock: parseInt(e.target.value)})} />
                     </div>
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">نقطه سفارش</label>
                        <input type="number" className="input-field border p-2 rounded w-full" defaultValue={5} onChange={e => setNewPart({...newPart, minStockLevel: parseInt(e.target.value)})} />
                     </div>
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">قیمت خرید (تومان)</label>
                        <input type="number" className="input-field border p-2 rounded w-full" onChange={e => setNewPart({...newPart, buyPrice: parseInt(e.target.value)})} />
                     </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                     <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-gray-600">انصراف</button>
                     <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">ثبت کالا</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* --- TRANSACTION MODAL (IN/OUT) --- */}
      {showTxModal && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 animate-fade-in-up shadow-2xl">
               <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {showTxModal.type === 'IN' ? 'افزایش موجودی (ورود کالا)' : 'کاهش موجودی (خروج کالا)'}
               </h3>
               <p className="text-sm text-gray-500 mb-4">
                  قطعه: <span className="font-bold text-gray-800">{showTxModal.part.name}</span> | موجودی فعلی: {showTxModal.part.stock}
               </p>

               <form onSubmit={handleSubmitTx} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">تعداد</label>
                     <input 
                       type="number" 
                       className="w-full border p-2 rounded-lg text-center text-xl font-bold" 
                       autoFocus
                       min={1}
                       max={showTxModal.type === 'OUT' ? showTxModal.part.stock : undefined}
                       value={txQty}
                       onChange={e => setTxQty(e.target.value)}
                       required
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">علت / توضیحات</label>
                     <input 
                       type="text" 
                       className="w-full border p-2 rounded-lg" 
                       placeholder={showTxModal.type === 'IN' ? "مثال: فاکتور خرید 123" : "مثال: پروژه برج میلاد"}
                       value={txReason}
                       onChange={e => setTxReason(e.target.value)}
                     />
                  </div>

                  <div className="flex gap-3 pt-2">
                     <button type="button" onClick={() => setShowTxModal(null)} className="flex-1 py-2 border rounded-lg text-gray-600">لغو</button>
                     <button 
                       type="submit" 
                       className={`flex-1 py-2 text-white rounded-lg font-bold ${showTxModal.type === 'IN' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                     >
                        ثبت تراکنش
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

    </div>
  );
};

export default Inventory;
