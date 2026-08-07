import React from 'react';
import type { GameItem } from '../../types/catalog';
import { GameGridCard } from './GameGridCard';
import { useCatalog } from '../../context/CatalogContext';
import { PaginationFooter } from '../layout/PaginationFooter';

interface GameGridContainerProps {
  games: GameItem[];
  onSelectGame: (game: GameItem) => void;
  onEditGame?: (game: GameItem, e: React.MouseEvent) => void;
}

export const GameGridContainer: React.FC<GameGridContainerProps> = ({ games, onSelectGame, onEditGame }) => {
  const { gridColumns, paginatedGames } = useCatalog();

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
    <div className="flex-1 px-4 lg:px-6 pt-1 lg:pt-2 pb-6 space-y-4 bg-transparent">
      {/* Empty State */}
      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
          <p className="text-base font-semibold">No se encontraron juegos en la biblioteca.</p>
          <p className="text-xs text-slate-600">Prueba ajustando los filtros o la búsqueda.</p>
        </div>
      ) : (
        /* Game Grid Container */
        <div className={`grid ${getGridColsClass(gridColumns)} gap-4 md:gap-5`}>
          {paginatedGames.map((game) => (
            <GameGridCard key={game.id} game={game} onSelect={onSelectGame} onEdit={onEditGame} />
          ))}
        </div>
      )}

      {/* Dynamic Pagination Footer */}
      <PaginationFooter />
    </div>
  );
};
