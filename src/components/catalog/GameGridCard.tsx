import React from 'react';
import type { GameItem } from '../../types/catalog';
import { Disc } from 'lucide-react';

interface GameGridCardProps {
  game: GameItem;
  onSelect: (game: GameItem) => void;
  onEdit: (game: GameItem, e: React.MouseEvent) => void;
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
      className="group cursor-pointer flex flex-col transition-all duration-300 transform hover:-translate-y-1 select-none"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#0B101B] border border-slate-800/80 shadow-md group-hover:shadow-xl group-hover:border-slate-700 transition-all">
        {game.imagen && !game.faltaCaratula ? (
          <img
            src={game.imagen}
            alt={game.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-600">
            <Disc size={36} className="mb-2 opacity-40" />
            <span className="text-[10px] font-mono tracking-wider uppercase">Sin Carátula</span>
          </div>
        )}

        {/* Small Status Dot in Bottom Right Corner (Matching Stitch design) */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center justify-center">
          <span className={`w-2.5 h-2.5 rounded-full ${getDotColor()}`} />
        </div>
      </div>

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

        {/* Box Type Pill */}
        <div className="mt-1.5 flex items-center gap-1">
          <span className="bg-[#141B2D] text-slate-300 text-[10px] font-mono border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
            {game.tipoCaja === 'Caja CD' ? 'CD Box' : game.tipoCaja === 'Caja DVD' ? 'DVD Box' : 'Paper Box'}
            {game.faltaCaratula && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </span>
        </div>
      </div>
    </div>
  );
};
