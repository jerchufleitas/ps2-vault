import React from 'react';
import type { GameItem } from '../../types/catalog';
import { GameGridCard } from './GameGridCard';
import { useCatalog } from '../../context/CatalogContext';

interface GameGridContainerProps {
  games: GameItem[];
  onSelectGame: (game: GameItem) => void;
}

export const GameGridContainer: React.FC<GameGridContainerProps> = ({ games, onSelectGame }) => {
  const { gridColumns, setGridColumns } = useCatalog();

  // Dynamic grid column CSS mapping based on gridColumns state (3 to 7)
  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
      case 5:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 6:
        return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6';
      case 7:
        return 'grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7';
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-6 bg-[#070A10]">

      {/* Empty State */}
      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
          <p className="text-base font-semibold">No se encontraron juegos en la biblioteca.</p>
          <p className="text-xs text-slate-600">Prueba ajustando los filtros o la búsqueda.</p>
        </div>
      ) : (
        /* Game Grid Container */
        <div className={`grid ${getGridColsClass(gridColumns)} gap-4 md:gap-5`}>
          {games.map((game) => (
            <GameGridCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      )}

      {/* Pagination Footer matching Stitch */}
      <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-white">1</span> to{' '}
          <span className="font-bold text-white">{games.length}</span> of{' '}
          <span className="font-bold text-white">248</span> entries
        </div>

        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 rounded-lg bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white font-medium transition-colors">
            Previous
          </button>          <button className="px-3 py-1.5 rounded-lg bg-[#00E5FF] text-[#070A10] font-bold shadow-md shadow-[#00E5FF]/20">
            1
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white font-medium transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white font-medium transition-colors">
            3
          </button>
          <span className="px-2 text-slate-600">...</span>
          <button className="px-3 py-1.5 rounded-lg bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white font-medium transition-colors">
            12
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white font-medium transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
