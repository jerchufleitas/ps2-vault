import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ icon, label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider">{label}</label>}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-[#8A99AD] pointer-events-none">{icon}</div>}
        <input
          className={`w-full bg-[#121824] border border-white/10 rounded-lg py-2 text-sm text-white placeholder-[#4A586E] focus:outline-none focus:border-[#0070D1] focus:ring-1 focus:ring-[#0070D1] transition-all ${
            icon ? 'pl-9 pr-3' : 'px-3'
          } ${error ? 'border-[#FF5252]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#FF5252]">{error}</p>}
    </div>
  );
};
