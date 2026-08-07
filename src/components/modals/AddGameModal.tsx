import React, { useState, useEffect, useRef } from 'react';
import type { GameItem, GenreType, TipoCajaFisica, FuncionamientoState, RegionType } from '../../types/catalog';
import { GENRES_OFICIALES, TIPOS_CAJA, ESTADOS_FUNCIONAMIENTO, REGIONES, IDIOMAS_OFICIALES } from '../../constants/catalog';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { searchGamesTheGamesDB, type TheGamesDBResult } from '../../services/thegamesdb';

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
  const [faltaCaratula, setFaltaCaratula] = useState(true);
  const [etiquetaDvd, setEtiquetaDvd] = useState(false);
  const [sinopsis, setSinopsis] = useState('');

  // Live Autocomplete state
  const [searchResults, setSearchResults] = useState<TheGamesDBResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    if (!titulo || titulo.trim().length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchGamesTheGamesDB(titulo);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(results.length > 0);
    }, 600);

    return () => clearTimeout(timer);
  }, [titulo]);

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTitulo('');
      setCodigoJuego('');
      setGenero('Acción');
      setTipoCaja('Caja DVD');
      setEstado('Funciona');
      setRegion('NTSC-U');
      setIdioma('Español');
      setCopias(1);
      setImagen('');
      setLinkIso('');
      setLinkCaratula('');
      setFaltaCaratula(true);
      setEtiquetaDvd(false);
      setSinopsis('');
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [isOpen]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [codigoJuego, setCodigoJuego] = useState('');

  const handleSelectSearchResult = (result: TheGamesDBResult) => {
    setTitulo(result.game_title);
    if (result.serialCode) setCodigoJuego(result.serialCode);
    if (result.genre) setGenero(result.genre);
    if (result.region) setRegion(result.region);
    if (result.overview) setSinopsis(result.overview);
    if (result.coverUrl && result.coverUrl !== '/ps2-cover-placeholder.png') {
      setImagen(result.coverUrl);
    }
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onAdd({
      titulo: titulo.trim(),
      codigoJuego: codigoJuego.trim() || undefined,
      genero,
      tipoCaja,
      estado,
      region,
      idioma: idioma.trim() || 'Español',
      copias: Number(copias) || 1,
      imagen: imagen.trim() || '/ps2-cover-placeholder.png',
      linkIso: linkIso.trim() || undefined,
      linkCaratula: linkCaratula.trim() || undefined,
      faltaCaratula,
      etiquetaDvd,
      tamanioMb: 0,
      sinopsis: sinopsis.trim() || undefined,
    });

    // Reset form
    setTitulo('');
    setCodigoJuego('');
    setImagen('');
    setLinkIso('');
    setLinkCaratula('');
    setSinopsis('');
    setIdioma('Español');
    setCopias(1);
    setFaltaCaratula(true);
    setEtiquetaDvd(false);
    setShowDropdown(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Juego a la Colección" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
        {/* Title input with live autocomplete & Serial Code Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
                Título del Juego * {isSearching && <span className="text-[#00E5FF] text-[10px] lowercase animate-pulse ml-2">(buscando metadatos...)</span>}
              </label>
            </div>
            <input
              type="text"
              placeholder="Ej. God of War, Metal Gear Solid 3..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              required
              className="w-full bg-[#121824] border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0070D1]"
            />

            {/* Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-[#121824] border border-[#0070D1]/40 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-white/5">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#00E5FF] tracking-wider bg-white/5 flex justify-between items-center">
                  <span>Sugerencias PS2 (TheGamesDB)</span>
                  <span className="text-slate-400 font-mono text-[9px]">Serial Identificador Único</span>
                </div>
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-[#0070D1]/20 transition-colors group"
                  >
                    <img
                      src={res.coverUrl}
                      alt={res.game_title}
                      className="w-8 h-11 object-contain rounded bg-black/40 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/ps2-cover-placeholder.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-[#00E5FF]">
                          {res.game_title}
                        </p>
                        <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.5 rounded border border-[#00E5FF]/20 flex-shrink-0 font-bold">
                          {res.serialCode || `SLUS-${String(res.id).padStart(5, '0').slice(-5)}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {res.genre} {res.region ? `• ${res.region}` : ''} {res.release_date ? `• ${res.release_date.substring(0, 4)}` : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Código / Serial (SLUS, SLES)
            </label>
            <input
              type="text"
              placeholder="Ej. SLUS-21115"
              value={codigoJuego}
              onChange={(e) => setCodigoJuego(e.target.value.toUpperCase())}
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
              value={genero}
              onChange={(e) => setGenero(e.target.value as GenreType)}
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
                  onClick={() => setEstado(st)}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    estado === st
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
                  onClick={() => setTipoCaja(tc)}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    tipoCaja === tc
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
                  onClick={() => setRegion(r)}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    region === r
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
                  onClick={() => setIdioma(lang)}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    idioma === lang
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
                  onClick={() => setCopias(num)}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                    copias === num
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
        <div>
          <Input
            label="URL Imagen de Carátula"
            placeholder="https://..."
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>

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

        {/* Explicit NO / SI Button Selectors for Print Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-1.5">
              Carátula Impresa
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setFaltaCaratula(true)}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  faltaCaratula
                    ? 'bg-[#FF5252]/20 border-[#FF5252] text-[#FF5252]'
                    : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                NO
              </button>
              <button
                type="button"
                onClick={() => setFaltaCaratula(false)}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  !faltaCaratula
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
                onClick={() => setEtiquetaDvd(false)}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  !etiquetaDvd
                    ? 'bg-[#FF5252]/20 border-[#FF5252] text-[#FF5252]'
                    : 'bg-[#121824] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                NO
              </button>
              <button
                type="button"
                onClick={() => setEtiquetaDvd(true)}
                className={`flex-1 py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                  etiquetaDvd
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
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            className="w-full bg-[#121824] border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#0070D1] resize-none"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Añadir a la Colección
          </Button>
        </div>
      </form>
    </Modal>
  );
};
