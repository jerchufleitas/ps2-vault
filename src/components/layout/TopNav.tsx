import React, { useState, useRef } from 'react';
import { Search, LayoutGrid, List, Plus, Filter, SlidersHorizontal, X } from 'lucide-react';
import type { ViewMode } from '../../types/catalog';
import { useCatalog } from '../../context/CatalogContext';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onToggleMobileFilters?: () => void;
  onLogoClick?: () => void;
  totalGames: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onToggleMobileFilters,
  onLogoClick,
}) => {
  const { gridColumns, setGridColumns } = useCatalog();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchIconClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCloseSearch = () => {
    onSearchChange('');
    setIsSearchExpanded(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070A10]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Brand Identity: PS2 Vault Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <img
          src="/logo3ps2.png"
          alt="PS2 Vault Logo"
          onClick={onLogoClick}
          className="h-16 md:h-20 w-auto object-contain cursor-pointer transition-transform hover:scale-105 active:scale-95"
        />
      </div>

      {/* Controls & Search */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Cover Size Slider (Grid View Only - Positioned to the LEFT of Search) */}
        {viewMode === 'grid' && (
          <div className="hidden sm:flex items-center gap-2 h-10 bg-[#0B101B] border border-slate-800 px-3 rounded-xl text-slate-400 select-none">
            <SlidersHorizontal size={14} className="text-[#00E5FF]" />
            <input
              type="range"
              min={3}
              max={7}
              step={1}
              value={gridColumns}
              onChange={(e) => setGridColumns(Number(e.target.value))}
              className="w-16 sm:w-20 md:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
              title={`Columnas: ${gridColumns}`}
            />
            <span className="text-[11px] font-mono text-[#00E5FF] w-4 text-center">
              {gridColumns}x
            </span>
          </div>
        )}

        {/* Collapsible Search Input (Positioned to the RIGHT of Cover Size Slider) */}
        {isSearchExpanded || searchQuery ? (
          <div className="relative flex items-center h-10 transition-all duration-300 w-44 sm:w-60 md:w-72">
            <Search className="absolute left-3 w-4 h-4 text-[#00E5FF]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setIsSearchExpanded(false);
                }
              }}
              placeholder="Buscar juegos..."
              className="w-full h-full bg-[#0B101B] border border-[#0070D1] rounded-xl pl-9 pr-8 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0070D1] shadow-[0_0_15px_rgba(0,112,209,0.2)] transition-all animate-fadeIn"
            />
            <button
              onClick={handleCloseSearch}
              className="absolute right-2.5 p-1 text-slate-500 hover:text-white transition-colors"
              title="Cerrar búsqueda"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSearchIconClick}
            className="w-10 h-10 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
            title="Buscar juegos"
          >
            <Search size={18} />
          </button>
        )}

        {/* View Switcher Toggle */}
        <div className="h-10 flex items-center bg-[#0B101B] p-1 rounded-xl border border-slate-800 gap-1 flex-shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-500 hover:text-white'
            }`}
            title="Vista Grilla"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-500 hover:text-white'
            }`}
            title="Vista Lista"
          >
            <List size={16} />
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={onToggleMobileFilters}
          className="lg:hidden w-10 h-10 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center flex-shrink-0"
          title="Filtros"
        >
          <Filter size={18} />
        </button>

        {/* Simplified Big "+" Add Game Button */}
        <button
          onClick={onOpenAddModal}
          className="w-10 h-10 rounded-xl bg-[#0070D1] hover:bg-[#0082EE] text-white shadow-[0_0_15px_rgba(0,112,209,0.4)] border border-[#00E5FF]/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer flex-shrink-0"
          title="Añadir Juego"
        >
          <Plus size={20} className="stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};
