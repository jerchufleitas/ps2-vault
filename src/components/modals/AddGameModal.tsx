import React, { useState } from 'react';
import type { GameItem, GenreType, TipoCajaFisica, FuncionamientoState, RegionType } from '../../types/catalog';
import { GENRES_OFICIALES, TIPOS_CAJA, ESTADOS_FUNCIONAMIENTO, REGIONES } from '../../constants/catalog';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (game: Omit<GameItem, 'id'>) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState<GenreType>('Acción');
  const [tipoCaja, setTipoCaja] = useState<TipoCajaFisica>('Caja DVD');
  const [estado, setEstado] = useState<FuncionamientoState>('Funciona');
  const [region, setRegion] = useState<RegionType>('NTSC-U');
  const [imagen, setImagen] = useState('');
  const [faltaCaratula, setFaltaCaratula] = useState(false);
  const [idioma, setIdioma] = useState('Español');
  const [tamanioMb, setTamanioMb] = useState(3800);
  const [sinopsis, setSinopsis] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onAdd({
      titulo: titulo.trim(),
      genero,
      tipoCaja,
      estado,
      region,
      imagen: imagen.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
      faltaCaratula,
      idioma,
      tamanioMb,
      sinopsis: sinopsis.trim(),
    });

    // Reset form
    setTitulo('');
    setImagen('');
    setSinopsis('');
    setFaltaCaratula(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Juego a la Colección">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título del Juego *"
          placeholder="Ej. God of War, Metal Gear Solid 3..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Género
            </label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value as GenreType)}
              className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0070D1]"
            >
              {GENRES_OFICIALES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Estado Físico
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as FuncionamientoState)}
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
              value={tipoCaja}
              onChange={(e) => setTipoCaja(e.target.value as TipoCajaFisica)}
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
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionType)}
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
          placeholder="https://..."
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />

        {/* Checkbox Falta Carátula */}
        <label className="flex items-center gap-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={faltaCaratula}
            onChange={(e) => setFaltaCaratula(e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-[#121824] text-[#0070D1] focus:ring-[#0070D1]"
          />
          <span className="text-xs font-medium text-white">Falta Carátula Impresa</span>
        </label>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Guardar Juego
          </Button>
        </div>
      </form>
    </Modal>
  );
};
