import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'gray' | 'orange' | 'green' | 'red' | 'yellow';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'cyan', className = '' }) => {
  const variantStyles = {
    cyan: 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30',
    gray: 'bg-white/5 text-[#8A99AD] border-white/10',
    orange: 'bg-[#FF9800]/10 text-[#FF9800] border-[#FF9800]/30',
    green: 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30',
    red: 'bg-[#FF5252]/10 text-[#FF5252] border-[#FF5252]/30',
    yellow: 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border backdrop-blur-md uppercase tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
