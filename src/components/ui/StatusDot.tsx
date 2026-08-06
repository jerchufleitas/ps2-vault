import React from 'react';
import type { FuncionamientoState } from '../../types/catalog';
import { ESTADO_COLORS } from '../../constants/catalog';

interface StatusDotProps {
  estado: FuncionamientoState;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusDot: React.FC<StatusDotProps> = ({ estado, showLabel = false, size = 'md' }) => {
  const color = ESTADO_COLORS[estado];

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`rounded-full inline-block shadow-sm ${sizeClasses[size]}`}
        style={{ backgroundColor: color.hex }}
        title={estado}
      />
      {showLabel && (
        <span className={`text-xs font-semibold ${color.text}`}>
          {estado}
        </span>
      )}
    </div>
  );
};
