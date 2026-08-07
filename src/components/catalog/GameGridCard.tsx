import React from 'react';
import type { GameItem } from '../../types/catalog';
import { TiltedCard } from '../ui/TiltedCard';

interface GameGridCardProps {
  game: GameItem;
  onSelect: (game: GameItem) => void;
  onEdit?: (game: GameItem, e: React.MouseEvent) => void;
}

export const GameGridCard: React.FC<GameGridCardProps> = ({ game, onSelect }) => {
  // Dot color depending on state
  const getDotColor = () => {
    if (game.faltaCaratula) return 'bg-cyan-400 shadow-[0_0_8px_#00E5FF]';
    switch (game.estado) {
      case 'Funciona':
        return 'bg-[#00E676] shadow-[0_0_8px_#00E676]';
      case 'No Funciona':
        return 'bg-[#FF5252] shadow-[0_0_8px_#FF5252]';
      case 'Sin Probar':
      default:
        return 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]';
    }
  };

  return (
    <div
      onClick={() => onSelect(game)}
      className="group cursor-pointer flex flex-col transition-all duration-300 select-none"
    >
      {/* 3D Tilted Cover Image Container */}
      <TiltedCard
        scaleOnHover={1.04}
        rotateAmplitude={12}
        showTooltip={false}
        className="w-full aspect-[3/4]"
      >
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg">
          {/* Uniform Ambient Darker Cyan/Blue Halo Light on Hover */}
          <div className="absolute -inset-1 bg-[#0070D1]/0 group-hover:bg-[#0070D1]/45 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

          <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden">
            <img
              src={game.imagen || '/ps2-cover-placeholder.png'}
              alt={game.titulo}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/ps2-cover-placeholder.png';
              }}
            />

            {/* Small Status Dot in Bottom Right Corner */}
            <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center justify-center">
              <span className={`w-2.5 h-2.5 rounded-full ${getDotColor()}`} />
            </div>
          </div>
        </div>
      </TiltedCard>

      {/* Details Below Cover */}
      <div className="mt-2.5 flex flex-col">
        {/* Game Title */}
        <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">
          {game.titulo}
        </h3>

        {/* Genre in Cyan */}
        <span className="text-[#00E5FF] font-bold text-[10px] tracking-wider uppercase mt-1">
          {game.genero}
        </span>

        {/* Box Type & Serial Code Pill */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          <span className="bg-[#141B2D] text-slate-300 text-[10px] font-mono border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
            {game.tipoCaja === 'Caja CD' ? 'CD Box' : game.tipoCaja === 'Caja DVD' ? 'DVD Box' : 'Paper Box'}
            {game.faltaCaratula && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </span>
          {game.codigoJuego && (
            <span className="bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-mono border border-[#00E5FF]/20 px-1.5 py-0.5 rounded">
              {game.codigoJuego}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
