
import React, { useState } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { FileText, Plus, Download, Printer, DollarSign, User, Calendar } from 'lucide-react';

interface AccountingProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
}

const Accounting: React.FC<AccountingProps> = ({ invoices, onAddInvoice }) => {
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);

  // Simple form state (in a real app, this would be more complex)
  const [newCustomer, setNewCustomer] = useState('');
  const [newTotal, setNewTotal] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: Invoice = {
      id: Math.floor(Math.random() * 10000).toString(),
      date: new Date().toLocaleDateString('fa-IR'),
      customerName: newCustomer,
      status: 'PENDING',
      totalAmount: parseInt(newTotal) || 0,
      items: [] // Simplified for demo
    };
    onAddInvoice(newInvoice);
    setShowNewInvoiceForm(false);
    setNewCustomer('');
    setNewTotal('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">حسابداری و صدور فاکتور</h2>
        <button 
          onClick={() => setShowNewInvoiceForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          صدور فاکتور جدید
        </button>
      </div>

      {showNewInvoiceForm && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md mb-6 animate-fade-in-up">
          <h3 className="text-lg font-bold mb-4 text-gray-700">فرم صدور فاکتور سریع</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="نام مشتری / ساختمان" 
              className="px-4 py-2 border rounded-lg"
              value={newCustomer}
              onChange={e => setNewCustomer(e.target.value)}
              required
            />
            <input 
              type="number" 
              placeholder="مبلغ کل (تومان)" 
              className="px-4 py-2 border rounded-lg"
              value={newTotal}
              onChange={e => setNewTotal(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex-1">ثبت</button>
              <button type="button" onClick={() => setShowNewInvoiceForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">لغو</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">شماره فاکتور</th>
              <th className="px-6 py-4 font-medium">تاریخ</th>
              <th className="px-6 py-4 font-medium">مشتری</th>
              <th className="px-6 py-4 font-medium">مبلغ (تومان)</th>
              <th className="px-6 py-4 font-medium">وضعیت پرداخت</th>
              <th className="px-6 py-4 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-gray-600">#{inv.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {inv.date}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  {inv.customerName}
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{inv.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border
                    ${inv.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 
                      inv.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                      'bg-red-100 text-red-700 border-red-200'}`}
                  >
                    {inv.status === 'PAID' ? 'پرداخت شده' : inv.status === 'PENDING' ? 'در انتظار پرداخت' : 'معوقه'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3 text-gray-500">
                  <button className="hover:text-blue-600 tooltip" title="چاپ"><Printer size={18} /></button>
                  <button className="hover:text-indigo-600 tooltip" title="دانلود PDF"><Download size={18} /></button>
                  <button className="hover:text-gray-800 tooltip" title="جزئیات"><FileText size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounting;
