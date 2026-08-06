import React from 'react';
import type { GameItem } from '../../types/catalog';
import { Modal } from '../ui/Modal';
import { StatusDot } from '../ui/StatusDot';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Pencil, Trash2, HardDrive, Globe, Calendar, ImageOff, Box } from 'lucide-react';

interface GameDetailModalProps {
  game: GameItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (game: GameItem) => void;
  onDelete: (id: string) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!game) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Ficha del Juego">
      <div className="space-y-6">
        {/* Top Header Section with Cover and Primary Meta */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Cover Art */}
          <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden bg-[#121824] border border-white/10 flex-shrink-0 shadow-2xl mx-auto sm:mx-0">
            <img
              src={game.imagen || '/ps2-cover-placeholder.png'}
              alt={game.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/ps2-cover-placeholder.png';
              }}
            />
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-3 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="cyan">{game.genero}</Badge>
              <span className="font-mono text-xs text-[#8A99AD] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {game.id}
              </span>
              {game.faltaCaratula && (
                <Badge variant="orange" className="flex items-center gap-1">
                  <ImageOff size={10} /> Sin Carátula
                </Badge>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {game.titulo}
            </h2>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <StatusDot estado={game.estado} showLabel size="lg" />
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#8A99AD]">
              <div className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-lg">
                <Box size={14} className="text-[#00E5FF]" />
                <div>
                  <span className="block text-[10px] uppercase font-mono">Tipo Caja</span>
                  <span className="text-white font-medium">{game.tipoCaja}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-lg">
                <Globe size={14} className="text-[#00E5FF]" />
                <div>
                  <span className="block text-[10px] uppercase font-mono">Región</span>
                  <span className="text-white font-medium">{game.region}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-lg">
                <HardDrive size={14} className="text-[#00E5FF]" />
                <div>
                  <span className="block text-[10px] uppercase font-mono">Tamaño ISO</span>
                  <span className="text-white font-medium">{game.tamanioMb} MB</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-lg">
                <Calendar size={14} className="text-[#00E5FF]" />
                <div>
                  <span className="block text-[10px] uppercase font-mono">Idioma</span>
                  <span className="text-white font-medium">{game.idioma || 'Español'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis / Description */}
        {game.sinopsis && (
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A99AD]">Sinopsis</h4>
            <p className="text-xs leading-relaxed text-[#C0CEE0] bg-white/[0.02] p-3 rounded-xl border border-white/5">
              {game.sinopsis}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm(`¿Eliminar ${game.titulo} del catálogo?`)) {
                onDelete(game.id);
                onClose();
              }
            }}
          >
            <Trash2 size={16} />
            <span>Eliminar</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(game);
            }}
          >
            <Pencil size={16} />
            <span>Editar Información</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
