
import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, RefreshCw } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  description: string;
  onSuccess: (trackingCode: string) => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, description, onSuccess, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [cardNumber, setCardNumber] = useState('');
  const [cvv2, setCvv2] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [pass, setPass] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      const mockTrackingCode = Math.floor(10000000 + Math.random() * 90000000).toString();
      onSuccess(mockTrackingCode);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header (Shaparak Style) */}
        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <ShieldCheck size={24} className="text-yellow-400" />
             <div>
               <h1 className="font-bold text-lg">پرداخت الکترونیک سامان</h1>
               <p className="text-xs text-blue-200">شبکه الکترونیکی پرداخت کارت (شاپرک)</p>
             </div>
          </div>
          <div className="text-left">
            <div className="text-sm font-mono bg-blue-800 px-3 py-1 rounded text-yellow-300">
               {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Merchant Info */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
           <div>
             <p className="text-xs text-gray-500">پذیرنده:</p>
             <p className="font-bold text-gray-800">شرکت پار صنعت صعود</p>
           </div>
           <div className="text-left">
             <p className="text-xs text-gray-500">مبلغ قابل پرداخت:</p>
             <p className="font-bold text-green-600 text-lg">{amount.toLocaleString()} <span className="text-xs text-gray-500">تومان</span></p>
           </div>
        </div>

        <div className="p-6">
           <div className="mb-4 text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-100">
             <strong>توضیحات:</strong> {description}
           </div>

           <form onSubmit={handlePay} className="space-y-4">
              
              <div className="relative">
                <label className="block text-xs font-bold text-gray-600 mb-1">شماره کارت</label>
                <div className="relative">
                   <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-left text-lg tracking-wider"
                     placeholder="0000 - 0000 - 0000 - 0000"
                     maxLength={19}
                     value={cardNumber}
                     onChange={(e) => setCardNumber(e.target.value)}
                     required
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">شماره شناسایی دوم (CVV2)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-center"
                      placeholder="CVV2"
                      maxLength={4}
                      value={cvv2}
                      onChange={(e) => setCvv2(e.target.value)}
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">تاریخ انقضا</label>
                    <div className="flex gap-1" dir="ltr">
                       <input 
                         type="text" 
                         className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-center" 
                         placeholder="Year"
                         maxLength={2}
                         value={year}
                         onChange={(e) => setYear(e.target.value)}
                         required
                       />
                       <span className="text-gray-400 self-center">/</span>
                       <input 
                         type="text" 
                         className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-center" 
                         placeholder="Month"
                         maxLength={2}
                         value={month}
                         onChange={(e) => setMonth(e.target.value)}
                         required
                       />
                    </div>
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-600 mb-1">رمز پویا / رمز دوم</label>
                 <div className="flex gap-2">
                    <input 
                      type="password" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-left"
                      placeholder="******"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      required
                    />
                    <button type="button" className="bg-gray-200 text-gray-600 px-3 py-2 rounded text-xs hover:bg-gray-300">
                       دریافت رمز پویا
                    </button>
                 </div>
              </div>

              <div className="relative border-t border-dashed border-gray-300 my-4"></div>

              <div className="flex gap-3 pt-2">
                 <button 
                   type="button" 
                   onClick={onCancel}
                   className="flex-1 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors text-sm"
                 >
                   انصراف
                 </button>
                 <button 
                   type="submit" 
                   disabled={processing}
                   className="flex-[2] py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-200 transition-colors flex items-center justify-center gap-2"
                 >
                   {processing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        در حال پرداخت...
                      </>
                   ) : (
                      <>
                        <Lock size={18} />
                        پرداخت {amount.toLocaleString()} تومان
                      </>
                   )}
                 </button>
              </div>
           </form>
        </div>

        <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400">
           این یک صفحه شبیه‌سازی شده است و تراکنش واقعی انجام نمی‌شود.
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
