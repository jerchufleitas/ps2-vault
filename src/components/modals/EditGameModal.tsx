import React, { useState, useEffect } from 'react';
import type { GameItem, GenreType } from '../../types/catalog';
import { GENRES_OFICIALES, TIPOS_CAJA, ESTADOS_FUNCIONAMIENTO, REGIONES, IDIOMAS_OFICIALES } from '../../constants/catalog';
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar: ${game.titulo}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
        {/* Title & Serial Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Título del Juego *"
              value={formData.titulo || ''}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Código / Serial (SLUS, SLES)
            </label>
            <input
              type="text"
              placeholder="Ej. SLUS-21115"
              value={formData.codigoJuego || ''}
              onChange={(e) => setFormData({ ...formData, codigoJuego: e.target.value.toUpperCase() })}
              className="w-full bg-[#121824] border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0070D1] uppercase font-mono"
            />
          </div>
        </div>

        {/* Row 1: Genre Select & Estado Físico Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Género
            </label>
            <select
              value={formData.genero || 'Acción'}
              onChange={(e) => setFormData({ ...formData, genero: e.target.value as GenreType })}
              className="w-full bg-[#121824] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0070D1]"
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
            <div className="flex gap-1.5">
              {ESTADOS_FUNCIONAMIENTO.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormData({ ...formData, estado: st })}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    (formData.estado || 'Funciona') === st
                      ? st === 'Funciona'
                        ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]'
                        : st === 'No Funciona'
                        ? 'bg-[#FF5252]/20 border-[#FF5252] text-[#FF5252]'
                        : 'bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700]'
                      : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Tipo de Caja Buttons & Región Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Tipo de Caja
            </label>
            <div className="flex gap-1.5">
              {TIPOS_CAJA.map((tc) => (
                <button
                  key={tc}
                  type="button"
                  onClick={() => setFormData({ ...formData, tipoCaja: tc })}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    (formData.tipoCaja || 'Caja DVD') === tc
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {tc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Región
            </label>
            <div className="flex gap-1.5">
              {REGIONES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, region: r })}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    (formData.region || 'NTSC-U') === r
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Idioma Buttons & Copias Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Idioma
            </label>
            <div className="flex gap-1.5">
              {IDIOMAS_OFICIALES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setFormData({ ...formData, idioma: lang })}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    (formData.idioma || 'Español') === lang
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Copias Físicas
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, copias: num })}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    (formData.copias ?? 1) === num
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cover Image URL */}
        <Input
          label="URL Imagen de Carátula"
          value={formData.imagen || ''}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          placeholder="https://..."
        />

        {/* External Links Row: ISO Link & Cover Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Link al ISO (Descarga)"
            placeholder="https://mega.nz/... o https://drive.google.com/..."
            value={formData.linkIso || ''}
            onChange={(e) => setFormData({ ...formData, linkIso: e.target.value })}
          />

          <Input
            label="Link a la Carátula HD"
            placeholder="https://..."
            value={formData.linkCaratula || ''}
            onChange={(e) => setFormData({ ...formData, linkCaratula: e.target.value })}
          />
        </div>

        {/* Explicit NO / SI Button Selectors for Print Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Carátula Impresa
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, faltaCaratula: true })}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  (formData.faltaCaratula ?? true)
                    ? 'bg-[#FF5252]/20 border-[#FF5252] text-[#FF5252]'
                    : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                NO
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, faltaCaratula: false })}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  !(formData.faltaCaratula ?? true)
                    ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]'
                    : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                SÍ
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Etiqueta DVD Impresa
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, etiquetaDvd: false })}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  !formData.etiquetaDvd
                    ? 'bg-[#FF5252]/20 border-[#FF5252] text-[#FF5252]'
                    : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                NO
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, etiquetaDvd: true })}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  formData.etiquetaDvd
                    ? 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]'
                    : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                SÍ
              </button>
            </div>
          </div>
        </div>

        {/* Synopsis Textarea */}
        <div>
          <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
            Sinopsis / Resumen
          </label>
          <textarea
            rows={3}
            placeholder="Resumen o detalles de la trama del juego..."
            value={formData.sinopsis || ''}
            onChange={(e) => setFormData({ ...formData, sinopsis: e.target.value })}
            className="w-full bg-[#121824] border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#0070D1] resize-none"
          />
        </div>

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
