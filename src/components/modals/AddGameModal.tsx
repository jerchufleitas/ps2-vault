import React, { useState } from 'react';
import type { GameItem, GenreType, TipoCajaFisica, FuncionamientoState, RegionType } from '../../types/catalog';
import { GENRES_OFICIALES, TIPOS_CAJA, ESTADOS_FUNCIONAMIENTO, REGIONES, IDIOMAS_OFICIALES } from '../../constants/catalog';
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
  const [idioma, setIdioma] = useState('Español');
  const [copias, setCopias] = useState<number>(1);
  const [imagen, setImagen] = useState('');
  const [linkIso, setLinkIso] = useState('');
  const [linkCaratula, setLinkCaratula] = useState('');
  const [faltaCaratula, setFaltaCaratula] = useState(false);
  const [etiquetaDvd, setEtiquetaDvd] = useState(false);
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
      idioma: idioma.trim() || 'Español',
      copias: Number(copias) || 1,
      imagen: imagen.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
      linkIso: linkIso.trim() || undefined,
      linkCaratula: linkCaratula.trim() || undefined,
      faltaCaratula,
      etiquetaDvd,
      tamanioMb,
      sinopsis: sinopsis.trim() || undefined,
    });

    // Reset form
    setTitulo('');
    setImagen('');
    setLinkIso('');
    setLinkCaratula('');
    setSinopsis('');
    setIdioma('Español');
    setCopias(1);
    setFaltaCaratula(false);
    setEtiquetaDvd(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Juego a la Colección" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
        {/* Title */}
        <Input
          label="Título del Juego *"
          placeholder="Ej. God of War, Metal Gear Solid 3..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        {/* Row 1: Genre & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        {/* Row 2: Box Type & Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Tipo de Caja Físico
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

        {/* Row 3: Language & Copies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Idioma
            </label>
            <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0070D1]"
            >
              {IDIOMAS_OFICIALES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Conteo de Copias Físicas
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCopias(num)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${
                    copias === num
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {num} {num === 1 ? 'Copia' : 'Copias'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cover Image URL */}
        <Input
          label="URL Imagen de Carátula"
          placeholder="https://..."
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />

        {/* External Links Row: ISO Link & Cover Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Link al ISO (Descarga)"
            placeholder="https://mega.nz/... o https://drive.google.com/..."
            value={linkIso}
            onChange={(e) => setLinkIso(e.target.value)}
          />

          <Input
            label="Link a la Carátula HD"
            placeholder="https://..."
            value={linkCaratula}
            onChange={(e) => setLinkCaratula(e.target.value)}
          />
        </div>

        {/* Checkboxes Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
          <label className="flex items-center gap-2 cursor-pointer bg-[#121824] p-3 rounded-xl border border-white/5 hover:border-white/15 transition-all">
            <input
              type="checkbox"
              checked={faltaCaratula}
              onChange={(e) => setFaltaCaratula(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-[#0F1420] text-[#0070D1] focus:ring-[#0070D1]"
            />
            <span className="text-xs font-semibold text-white">Marcar como "Falta Carátula Impresa"</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-[#121824] p-3 rounded-xl border border-white/5 hover:border-white/15 transition-all">
            <input
              type="checkbox"
              checked={etiquetaDvd}
              onChange={(e) => setEtiquetaDvd(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-[#0F1420] text-[#0070D1] focus:ring-[#0070D1]"
            />
            <span className="text-xs font-semibold text-white">Marcar como "Etiqueta DVD Impresa"</span>
          </label>
        </div>

        {/* Synopsis Textarea */}
        <div>
          <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
            Sinopsis / Resumen
          </label>
          <textarea
            rows={3}
            placeholder="Resumen o detalles de la trama del juego..."
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            className="w-full bg-[#121824] border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#0070D1] resize-none"
          />
        </div>

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
