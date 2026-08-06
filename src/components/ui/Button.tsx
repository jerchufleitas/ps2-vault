import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-[#0070D1] hover:bg-[#005bb0] text-white shadow-lg shadow-[#0070D1]/20 active:scale-95',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/10 active:scale-95',
    outline: 'bg-transparent border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 active:scale-95',
    danger: 'bg-[#FF5252]/10 hover:bg-[#FF5252]/20 text-[#FF5252] border border-[#FF5252]/30 active:scale-95',
    ghost: 'bg-transparent hover:bg-white/5 text-[#8A99AD] hover:text-white',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
