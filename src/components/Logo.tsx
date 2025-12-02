
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark', showText = true }) => {
  
  // Font size map
  const dims = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  }[size];

  const mainColor = variant === 'light' ? 'text-white' : 'text-slate-800';
  const accentColor = variant === 'light' ? 'text-blue-400' : 'text-blue-600';

  return (
    <div className={`select-none ${className} flex items-center justify-center gap-3 ${dims} font-black tracking-tight leading-none`}>
       {/* Persian Logotype */}
       <span className={mainColor}>پار</span>
       <span className={accentColor}>سرویس</span>
    </div>
  );
};

export default Logo;
