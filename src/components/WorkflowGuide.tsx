
import React, { useState } from 'react';
import { 
  PhoneCall, Wrench, Cpu, Hammer, Package, CheckCircle, 
  AlertTriangle, ArrowDown, Lightbulb, UserCheck, CreditCard 
} from 'lucide-react';

const WorkflowGuide: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'CALL_CENTER' | 'TECHNICIAN' | 'REPAIR' | 'RENOVATION'>('CALL_CENTER');

  const workflows = {
    CALL_CENTER: {
      title: 'فرآیند مرکز تماس (پذیرش خرابی)',
      description: 'وظیفه شما غربالگری اولیه و تخصیص صحیح تیکت است.',
      steps: [
        {
          title: 'دریافت تماس مشتری',
          desc: 'شنیدن دقیق مشکل و ثبت نام و آدرس.',
          tip: 'همیشه قبل از هر چیز بپرسید: "آیا کسی داخل آسانسور محبوس شده است؟" اولویت ایمنی است.',
          icon: <PhoneCall size={24} />
        },
        {
          title: 'بررسی گارانتی',
          desc: 'وارد کردن سریال تابلو در سیستم.',
          tip: 'اگر گارانتی تمام شده، حتماً "هزینه کارشناسی" را به مشتری اعلام کنید تا بعداً سوء تفاهم نشود.',
          icon: <CreditCard size={24} />
        },
        {
          title: 'تلاش برای رفع تلفنی',
          desc: 'بررسی خطاهای ساده (مثل دوشاخ درب یا کلید استپ).',
          tip: '۳۰٪ خرابی‌ها با یک راهنمایی ساده تلفنی حل می‌شوند. این کار رضایت مشتری را به شدت بالا می‌برد.',
          icon: <Lightbulb size={24} />
        },
        {
          title: 'ثبت تیکت و ارجاع',
          desc: 'انتخاب تکنسین منطقه مربوطه.',
          tip: 'توضیحات را کامل بنویسید. "آسانسور خراب است" کافی نیست! بنویسید: "موتور صدا می‌دهد و در طبقه ۳ توقف نمی‌کند".',
          icon: <UserCheck size={24} />
        }
      ]
    },
    TECHNICIAN: {
      title: 'فرآیند تکنسین حضوری (سرویس و خرابی)',
      description: 'سرعت عمل، دقت فنی و گزارش‌دهی لحظه‌ای.',
      steps: [
        {
          title: 'دریافت اعلان ماموریت',
          desc: 'بررسی آدرس و شرح خرابی در اپلیکیشن.',
          tip: 'قبل از حرکت، ابزار و قطعات احتمالی (مثل کنتاکتور یا فیوز) را از انبار تحویل بگیرید.',
          icon: <Wrench size={24} />
        },
        {
          title: 'اعلام شروع کار',
          desc: 'زدن دکمه "شروع" در اپلیکیشن هنگام رسیدن به محل.',
          tip: 'این کار باعث می‌شود مشتری بداند شما رسیده‌اید و تایم کاری شما محاسبه شود.',
          icon: <CheckCircle size={24} />
        },
        {
          title: 'عیب‌یابی و تعمیر',
          desc: 'رفع ایراد طبق استانداردهای ایمنی.',
          tip: 'اگر تعمیر نیاز به قطعه گران‌قیمت دارد، قبل از تعویض حتماً با شرکت هماهنگ کنید.',
          icon: <AlertTriangle size={24} />
        },
        {
          title: 'گزارش و پایان کار',
          desc: 'ثبت گزارش فنی و زدن دکمه "پایان".',
          tip: 'گزارش را "همان لحظه" بنویسید. گزارش‌های دقیق به هوش مصنوعی کمک می‌کند دفعه بعد راهکار بهتری بدهد.',
          icon: <CheckCircle size={24} />
        }
      ]
    },
    REPAIR: {
      title: 'فرآیند تعمیرات برد و قطعات',
      description: 'چرخه پذیرش، تعمیر و تحویل قطعات الکترونیکی.',
      steps: [
        {
          title: 'پذیرش و کدگذاری',
          desc: 'ثبت مشخصات برد و ایراد ظاهری.',
          tip: 'حتما از برد عکس بگیرید و روی برد "لیبل کد رهگیری" بچسبانید تا گم نشود.',
          icon: <Package size={24} />
        },
        {
          title: 'عیب‌یابی اولیه',
          desc: 'تست قطعه و برآورد هزینه.',
          tip: 'تا زمانی که مشتری هزینه تقریبی را تایید نکرده، تعمیر را شروع نکنید (جلوگیری از ضرر مالی).',
          icon: <Cpu size={24} />
        },
        {
          title: 'تعمیر و تست QC',
          desc: 'تعویض قطعات و تست نهایی.',
          tip: 'قطعات داغی (سوخته) را دور نریزید و به مشتری تحویل دهید تا اعتمادش جلب شود.',
          icon: <Wrench size={24} />
        },
        {
          title: 'تحویل و فاکتور',
          desc: 'تغییر وضعیت به "آماده تحویل".',
          tip: 'گارانتی تعمیر فقط شامل همان قطعه تعویضی است، این را در فاکتور قید کنید.',
          icon: <CheckCircle size={24} />
        }
      ]
    },
    RENOVATION: {
      title: 'فرآیند بازسازی و جنرال سرویس',
      description: 'مدیریت پروژه‌های نوسازی آسانسور.',
      steps: [
        {
          title: 'بازدید اولیه',
          desc: 'بررسی وضعیت فعلی آسانسور.',
          tip: 'لیست "چک‌لیست ایمنی" را پر کنید. اگر آسانسور خطرناک است، کتباً به مدیر ساختمان اعلام کنید.',
          icon: <UserCheck size={24} />
        },
        {
          title: 'ارائه پیش‌فاکتور',
          desc: 'محاسبه دقیق قطعات و اجرت.',
          tip: 'همیشه دو پیشنهاد بدهید: ۱. بازسازی اقتصادی ۲. بازسازی لوکس (Full).',
          icon: <CreditCard size={24} />
        },
        {
          title: 'عقد قرارداد',
          desc: 'دریافت پیش‌پرداخت و امضا.',
          tip: 'زمان‌بندی اجرا را واقع‌بینانه بنویسید تا بدقول نشوید.',
          icon: <Hammer size={24} />
        },
        {
          title: 'اجرا و تحویل',
          desc: 'نصب قطعات و استانداردسازی.',
          tip: 'در پایان کار، گواهی استاندارد ادواری را برای مشتری بگیرید.',
          icon: <CheckCircle size={24} />
        }
      ]
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">راهنمای جامع فرآیندهای کاری</h2>
        <p className="text-blue-100 max-w-2xl">
          فلوچارت‌های استاندارد شرکت پار صنعت صعود.
          رعایت این مراحل باعث افزایش بهره‌وری، کاهش خطا و رضایت بیشتر مشتریان می‌شود.
        </p>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveRole('CALL_CENTER')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeRole === 'CALL_CENTER' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          <PhoneCall size={18} /> مرکز تماس
        </button>
        <button 
          onClick={() => setActiveRole('TECHNICIAN')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeRole === 'TECHNICIAN' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          <Wrench size={18} /> تکنسین فنی
        </button>
        <button 
          onClick={() => setActiveRole('REPAIR')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeRole === 'REPAIR' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          <Cpu size={18} /> تعمیرات برد
        </button>
        <button 
          onClick={() => setActiveRole('RENOVATION')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeRole === 'RENOVATION' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          <Hammer size={18} /> بازسازی
        </button>
      </div>

      {/* Workflow Visualization */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{workflows[activeRole].title}</h3>
          <p className="text-gray-500">{workflows[activeRole].description}</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 right-6 w-1 bg-gray-100 hidden md:block"></div>

          <div className="space-y-8">
            {workflows[activeRole].steps.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row gap-6 items-start group">
                
                {/* Icon Circle */}
                <div className={`
                  z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-md transition-transform group-hover:scale-110
                  ${index === 0 ? 'bg-blue-500 text-white' : 
                    index === workflows[activeRole].steps.length - 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step.icon}
                </div>

                {/* Content Card */}
                <div className="flex-1 w-full bg-gray-50 rounded-xl p-5 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-gray-800">
                      <span className="text-gray-400 ml-2 text-sm font-mono">مرحله {index + 1}:</span>
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 mb-4">{step.desc}</p>
                  
                  {/* Pro Tip Box */}
                  <div className="bg-yellow-50 border-r-4 border-yellow-400 p-3 rounded text-sm text-yellow-800 flex gap-2">
                    <Lightbulb className="shrink-0 text-yellow-600" size={18} />
                    <div>
                      <span className="font-bold">نکته کلیدی بهره‌وری: </span>
                      {step.tip}
                    </div>
                  </div>
                </div>

                {/* Arrow for mobile */}
                {index !== workflows[activeRole].steps.length - 1 && (
                  <div className="md:hidden flex justify-center w-12 -my-4 z-0">
                    <ArrowDown className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowGuide;
