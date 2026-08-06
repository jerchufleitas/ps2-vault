import React, { useState, useEffect } from 'react';
import type { GameItem, GenreType, TipoCajaFisica, FuncionamientoState, RegionType } from '../../types/catalog';
import { GENRES_OFICIALES, TIPOS_CAJA, ESTADOS_FUNCIONAMIENTO, REGIONES } from '../../constants/catalog';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface EditGameModalProps {
  game: GameItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<GameItem>) => void;
}

export const EditGameModal: React.FC<EditGameModalProps> = ({
  game,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<GameItem>>({});

  useEffect(() => {
    if (game) setFormData(game);
  }, [game]);

  if (!game) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(game.id, formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar: ${game.titulo}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título del Juego"
          value={formData.titulo || ''}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Género
            </label>
            <select
              value={formData.genero || 'Acción'}
              onChange={(e) => setFormData({ ...formData, genero: e.target.value as GenreType })}
              className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0070D1]"
            >
              {GENRES_OFICIALES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Estado Funcionamiento */}
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Estado Físico
            </label>
            <select
              value={formData.estado || 'Funciona'}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.value as FuncionamientoState })
              }
              className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0070D1]"
            >
              {ESTADOS_FUNCIONAMIENTO.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Tipo de Caja */}
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Tipo de Caja
            </label>
            <select
              value={formData.tipoCaja || 'Caja DVD'}
              onChange={(e) =>
                setFormData({ ...formData, tipoCaja: e.target.value as TipoCajaFisica })
              }
              className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0070D1]"
            >
              {TIPOS_CAJA.map((tc) => (
                <option key={tc} value={tc}>
                  {tc}
                </option>
              ))}
            </select>
          </div>

          {/* Región */}
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Región
            </label>
            <select
              value={formData.region || 'NTSC-U'}
              onChange={(e) => setFormData({ ...formData, region: e.target.value as RegionType })}
              className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0070D1]"
            >
              {REGIONES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="URL Imagen de Carátula"
          value={formData.imagen || ''}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          placeholder="https://..."
        />

        {/* Checkbox Falta Carátula */}
        <label className="flex items-center gap-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.faltaCaratula || false}
            onChange={(e) => setFormData({ ...formData, faltaCaratula: e.target.checked })}
            className="w-4 h-4 rounded border-white/10 bg-[#121824] text-[#0070D1] focus:ring-[#0070D1]"
          />
          <span className="text-xs font-medium text-white">Marcar como "Falta Carátula Impresa"</span>
        </label>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
