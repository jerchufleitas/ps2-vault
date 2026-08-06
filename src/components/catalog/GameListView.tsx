import React from 'react';
import type { GameItem } from '../../types/catalog';
import { StatusDot } from '../ui/StatusDot';
import { Badge } from '../ui/Badge';
import { Pencil, Disc } from 'lucide-react';

interface GameListViewProps {
  games: GameItem[];
  onSelectGame: (game: GameItem) => void;
  onEditGame: (game: GameItem, e: React.MouseEvent) => void;
}

export const GameListView: React.FC<GameListViewProps> = ({
  games,
  onSelectGame,
  onEditGame,
}) => {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Disc size={48} className="text-[#4A586E] animate-pulse mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No se encontraron juegos</h3>
        <p className="text-xs text-[#8A99AD]">Intenta ajustar los criterios de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#8A99AD] uppercase tracking-wider font-mono text-[10px] bg-white/[0.02]">
              <th className="py-3.5 px-4 w-16 text-center">Carátula</th>
              <th className="py-3.5 px-4">Título del Juego</th>
              <th className="py-3.5 px-4">ID Serial</th>
              <th className="py-3.5 px-4">Género</th>
              <th className="py-3.5 px-4">Caja Física</th>
              <th className="py-3.5 px-4">Región</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {games.map((game) => (
              <tr
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                {/* Thumbnail */}
                <td className="py-2.5 px-4">
                  <div className="w-10 h-13 rounded-lg overflow-hidden bg-[#121824] border border-white/10 flex-shrink-0">
                    <img
                      src={game.imagen || '/ps2-cover-placeholder.png'}
                      alt={game.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/ps2-cover-placeholder.png';
                      }}
                    />
                  </div>
                </td>

                {/* Title */}
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      {game.titulo}
                    </span>
                    {game.faltaCaratula && (
                      <Badge variant="orange" className="text-[9px]">
                        Sin Carátula
                      </Badge>
                    )}
                  </div>
                </td>

                {/* ID / Serial */}
                <td className="py-2.5 px-4 font-mono text-[#8A99AD]">{game.codigoJuego || game.id}</td>

                {/* Genre */}
                <td className="py-2.5 px-4">
                  <Badge variant="cyan">{game.genero}</Badge>
                </td>

                {/* Box Type */}
                <td className="py-2.5 px-4 text-[#8A99AD]">{game.tipoCaja}</td>

                {/* Region */}
                <td className="py-2.5 px-4 text-[#8A99AD] font-mono">{game.region}</td>

                {/* Status */}
                <td className="py-2.5 px-4">
                  <StatusDot estado={game.estado} showLabel size="sm" />
                </td>

                {/* Actions */}
                <td className="py-2.5 px-4 text-right">
                  <button
                    onClick={(e) => onEditGame(game, e)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-[#0070D1] text-[#8A99AD] hover:text-white transition-colors"
                    title="Editar Juego"
                  >
                    <Pencil size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Compact List View */}
      <div className="md:hidden space-y-2.5">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onSelectGame(game)}
            className="group cursor-pointer flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Thumbnail */}
              <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#121824] border border-white/10 flex-shrink-0">
                <img
                  src={game.imagen || '/ps2-cover-placeholder.png'}
                  alt={game.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/ps2-cover-placeholder.png';
                  }}
                />
              </div>

              {/* Information */}
              <div className="min-w-0 space-y-1">
                <h4 className="text-xs font-bold text-white group-hover:text-[#00E5FF] truncate">
                  {game.titulo}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-[#8A99AD] font-mono">
                  <span>{game.codigoJuego || game.id}</span>
                  <span>•</span>
                  <span>{game.genero}</span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <StatusDot estado={game.estado} showLabel size="sm" />
                  {game.faltaCaratula && (
                    <Badge variant="orange" className="text-[8px] py-0 px-1">
                      No Cover
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Prominent Mobile Edit Pencil Icon */}
            <button
              onClick={(e) => onEditGame(game, e)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-[#0070D1] text-[#00E5FF] hover:text-white border border-white/10 transition-colors flex-shrink-0 ml-2"
              title="Editar Juego"
            >
              <Pencil size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
