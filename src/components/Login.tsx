
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { LogIn, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    if (user) {
      onLogin(user);
    } else {
      setError('نام کاربری یافت نشد. (برای تست از نام کوچک استفاده کنید)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 text-sm">
          <ArrowRight size={16} />
          بازگشت به خانه
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto flex justify-center mb-6">
             <Logo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ورود پرسنل</h2>
          <p className="text-gray-500 text-sm mt-2">لطفا نام کاربری خود را وارد کنید</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left outline-none transition-all"
              placeholder="Username"
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            ورود به سیستم
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-xs text-center text-gray-400">
             سامانه یکپارچه مدیریت پار صنعت صعود پشتیبان
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
