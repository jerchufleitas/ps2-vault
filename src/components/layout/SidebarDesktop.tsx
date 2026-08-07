import React from 'react';
import { GENRES_OFICIALES } from '../../constants/catalog';
import type { GenreType, FuncionamientoState, CatalogMetrics } from '../../types/catalog';
import {
  Folder,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ImageOff,
  Crosshair,
  Swords,
  Compass,
  Target,
  Trophy,
  Car,
  Gamepad2,
  Sparkles,
  Film,
  Smile,
  Ghost,
  Plane,
  BrainCircuit,
  Grid,
} from 'lucide-react';

interface SidebarDesktopProps {
  selectedGenre: GenreType | 'Todos';
  onSelectGenre: (genre: GenreType | 'Todos') => void;
  selectedState: FuncionamientoState | 'Todos';
  onSelectState: (state: FuncionamientoState | 'Todos') => void;
  faltaCaratulaOnly: boolean;
  onToggleFaltaCaratula: () => void;
  metrics: CatalogMetrics;
}

const getGenreIcon = (genre: string) => {
  switch (genre) {
    case 'Acción':
      return <Crosshair size={14} />;
    case "Beat 'em up":
      return <Swords size={14} />;
    case 'Aventura':
      return <Compass size={14} />;
    case 'Shooter':
      return <Target size={14} />;
    case 'Deportes':
      return <Trophy size={14} />;
    case 'Carreras':
      return <Car size={14} />;
    case 'Lucha':
      return <Gamepad2 size={14} />;
    case 'Arcade':
      return <Grid size={14} />;
    case 'Disney':
      return <Sparkles size={14} />;
    case 'Películas':
      return <Film size={14} />;
    case 'Infantiles':
      return <Smile size={14} />;
    case 'Terror':
      return <Ghost size={14} />;
    case 'Aviones':
      return <Plane size={14} />;
    case 'Estrategia':
      return <BrainCircuit size={14} />;
    default:
      return <Folder size={14} />;
  }
};

export const SidebarDesktop: React.FC<SidebarDesktopProps> = ({
  selectedGenre,
  onSelectGenre,
  selectedState,
  onSelectState,
  faltaCaratulaOnly,
  onToggleFaltaCaratula,
  metrics,
}) => {
  const isAllActive = selectedGenre === 'Todos' && selectedState === 'Todos' && !faltaCaratulaOnly;

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col gap-4 p-4 bg-[#070A10] border-r border-white/5 min-h-[calc(100vh-65px)] select-none text-slate-300">
      
      {/* Top Logo Brand */}
      <div className="flex items-center justify-center pb-2 mb-1 border-b border-white/5">
        <img
          src="/logo3ps2.png"
          alt="PS2 Vault Logo"
          onClick={() => {
            onSelectGenre('Todos');
            onSelectState('Todos');
            if (faltaCaratulaOnly) onToggleFaltaCaratula();
          }}
          className="h-16 w-auto object-contain cursor-pointer transition-transform hover:scale-105 active:scale-95"
        />
      </div>

      {/* Top Status & Catalog Quick Filters */}
      <div className="space-y-1">
        {/* All Games */}
        <button
          onClick={() => {
            onSelectGenre('Todos');
            onSelectState('Todos');
            if (faltaCaratulaOnly) onToggleFaltaCaratula();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isAllActive
              ? 'bg-[#00E5FF]/10 text-white border border-[#00E5FF]/30 font-bold'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Folder size={15} className={isAllActive ? 'text-[#00E5FF]' : 'text-slate-400'} />
            <span>Todos los Juegos</span>
          </span>
          <span className="text-[10px] opacity-75 font-mono">{metrics.total}</span>
        </button>

        {/* Funciona */}
        <button
          onClick={() => {
            onSelectState(selectedState === 'Funciona' ? 'Todos' : 'Funciona');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedState === 'Funciona' && !faltaCaratulaOnly
              ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-[#00E676]'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <CheckCircle size={15} className="text-[#00E676]" />
            <span>Funciona</span>
          </span>
          <span className="text-[10px] bg-[#00E676]/10 text-[#00E676] px-1.5 py-0.5 rounded font-mono">
            {metrics.funciona}
          </span>
        </button>

        {/* No Funciona */}
        <button
          onClick={() => {
            onSelectState(selectedState === 'No Funciona' ? 'Todos' : 'No Funciona');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedState === 'No Funciona' && !faltaCaratulaOnly
              ? 'bg-[#FF5252]/15 text-[#FF5252] border border-[#FF5252]/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-[#FF5252]'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <XCircle size={15} className="text-[#FF5252]" />
            <span>No Funciona</span>
          </span>
          <span className="text-[10px] bg-[#FF5252]/10 text-[#FF5252] px-1.5 py-0.5 rounded font-mono">
            {metrics.noFunciona}
          </span>
        </button>

        {/* Sin Probar */}
        <button
          onClick={() => {
            onSelectState(selectedState === 'Sin Probar' ? 'Todos' : 'Sin Probar');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedState === 'Sin Probar' && !faltaCaratulaOnly
              ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-[#FFD700]'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <AlertTriangle size={15} className="text-[#FFD700]" />
            <span>Sin Probar</span>
          </span>
          <span className="text-[10px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.5 rounded font-mono">
            {metrics.sinProbar}
          </span>
        </button>

        {/* Carátulas Faltantes */}
        <button
          onClick={onToggleFaltaCaratula}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            faltaCaratulaOnly
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-cyan-400'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <ImageOff size={15} className="text-cyan-400" />
            <span>Carátulas Faltantes</span>
          </span>
          <span className="text-[10px] bg-cyan-400/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
            {metrics.faltaCaratula}
          </span>
        </button>
      </div>

      <div className="h-px bg-slate-800/80 my-1" />

      {/* Explicit GÉNEROS Header */}
      <div>
        <h2 className="text-[11px] font-extrabold text-[#00E5FF] uppercase tracking-wider mb-2 px-3">
          GÉNEROS
        </h2>

        {/* Genres List - Full 14 Genres without Scrollbar */}
        <div className="space-y-0.5">
          {GENRES_OFICIALES.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => onSelectGenre(isSelected ? 'Todos' : genre)}
                className={`w-full flex items-center justify-start gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 text-cyan-400 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'
                }`}
              >
                <span className={isSelected ? 'text-[#00E5FF]' : 'text-slate-500'}>
                  {getGenreIcon(genre)}
                </span>
                <span>{genre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Stats Block (Complete 5 Metrics Grid) */}
      <div className="mt-auto pt-3 border-t border-slate-800/80">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Estadísticas Rápidas
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="block text-[10px] text-slate-400">Total Juegos</span>
            <span className="text-sm font-bold text-white font-mono">{metrics.total}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20">
            <span className="block text-[10px] text-[#00E676]">Funciona</span>
            <span className="text-sm font-bold text-[#00E676] font-mono">{metrics.funciona}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#FF5252]/10 border border-[#FF5252]/20">
            <span className="block text-[10px] text-[#FF5252]">No Funciona</span>
            <span className="text-sm font-bold text-[#FF5252] font-mono">{metrics.noFunciona}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
            <span className="block text-[10px] text-[#FFD700]">Sin Probar</span>
            <span className="text-sm font-bold text-[#FFD700] font-mono">{metrics.sinProbar}</span>
          </div>
          <div className="col-span-2 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
            <span className="text-[10px] text-cyan-400">Sin Carátula</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{metrics.faltaCaratula}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
