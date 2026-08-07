import React, { useState, useRef } from 'react';
import { Search, LayoutGrid, List, Plus, Filter, SlidersHorizontal, X, History, Clock, ArrowUpDown, Check } from 'lucide-react';
import type { ViewMode, SortOption } from '../../types/catalog';
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
  const {
    gridColumns,
    setGridColumns,
    searchHistory,
    addSearchHistory,
    removeSearchHistoryItem,
    clearSearchHistory,
    sortOption,
    setSortOption,
  } = useCatalog();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchIconClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCloseSearch = () => {
    onSearchChange('');
    setIsSearchExpanded(false);
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      addSearchHistory(searchQuery);
      setIsSearchFocused(false);
    }
  };

  const sortLabels: Record<SortOption, string> = {
    recientes: 'Añadidos Recientemente',
    alfabetico_az: 'Nombre (A - Z)',
    alfabetico_za: 'Nombre (Z - A)',
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070A10]/95 backdrop-blur-xl border-b border-white/5 px-4 lg:px-6 py-2 flex items-center justify-between gap-3 min-h-[56px]">
      {/* Brand Identity: Mobile-only Logo (Desktop logo lives in Sidebar) */}
      <div className="flex items-center gap-3 flex-shrink-0 lg:hidden">
        <img
          src="/logo3ps2.png"
          alt="PS2 Vault Logo"
          onClick={onLogoClick}
          className="h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-105 active:scale-95"
        />
      </div>

      {/* Controls & Search */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Cover Size Slider (Grid View Only - Positioned to the LEFT of Search) */}
        {viewMode === 'grid' && (
          <div className="hidden sm:flex items-center gap-2 h-9 bg-[#0B101B] border border-slate-800 px-2.5 rounded-xl text-slate-400 select-none">
            <SlidersHorizontal size={13} className="text-[#00E5FF]" />
            <input
              type="range"
              min={3}
              max={7}
              step={1}
              value={gridColumns}
              onChange={(e) => setGridColumns(Number(e.target.value))}
              className="w-16 sm:w-20 md:w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
              title={`Columnas: ${gridColumns}`}
            />
            <span className="text-[11px] font-mono text-[#00E5FF] w-4 text-center">
              {gridColumns}x
            </span>
          </div>
        )}

        {/* Collapsible Search Input with Search History Dropdown */}
        {isSearchExpanded || searchQuery ? (
          <div className="relative flex items-center h-9 transition-all duration-300 w-44 sm:w-60 md:w-72">
            <Search className="absolute left-3 w-3.5 h-3.5 text-[#00E5FF] z-10" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSearchFocused(false);
                  if (!searchQuery.trim()) {
                    setIsSearchExpanded(false);
                  }
                }, 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar juegos..."
              className="w-full h-full bg-[#0B101B] border border-[#0070D1]/80 rounded-xl pl-9 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0070D1] transition-all animate-fadeIn"
            />
            <button
              onClick={handleCloseSearch}
              className="absolute right-2.5 p-1 text-slate-500 hover:text-white transition-colors z-10"
              title="Cerrar búsqueda"
            >
              <X size={13} />
            </button>

            {/* History Dropdown Menu */}
            {isSearchFocused && searchHistory.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-[#0B101B]/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn p-2 text-xs">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800/80 mb-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <History size={12} className="text-[#00E5FF]" />
                    <span>Búsquedas recientes</span>
                  </div>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      clearSearchHistory();
                    }}
                    className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase font-bold"
                  >
                    Limpiar
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {searchHistory.map((item) => (
                    <div
                      key={item}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSearchChange(item);
                        addSearchHistory(item);
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#141B2D] cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2 text-slate-300 group-hover:text-white font-medium truncate">
                        <Clock size={12} className="text-slate-500 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeSearchHistoryItem(item);
                        }}
                        className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar de historial"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSearchIconClick}
            className="w-9 h-9 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
            title="Buscar juegos"
          >
            <Search size={16} />
          </button>
        )}

        {/* Sort Order Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsSortMenuOpen((prev) => !prev)}
            className={`h-9 px-3 rounded-xl bg-[#0B101B] border transition-all flex items-center gap-2 text-xs cursor-pointer select-none ${
              isSortMenuOpen || sortOption !== 'recientes'
                ? 'border-[#00E5FF]/40 text-cyan-400 bg-white/5'
                : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title="Ordenar juegos"
          >
            <ArrowUpDown size={15} className={sortOption !== 'recientes' ? 'text-[#00E5FF]' : ''} />
            <span className="hidden md:inline font-medium text-[11px] truncate max-w-[130px]">
              {sortLabels[sortOption]}
            </span>
          </button>

          {isSortMenuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSortMenuOpen(false)}
              />
              <div className="absolute right-0 top-11 w-52 bg-[#0B101B] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn text-xs">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Ordenar Catálogo Por
                </div>
                {(['recientes', 'alfabetico_az', 'alfabetico_za'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option);
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      sortOption === option
                        ? 'bg-[#00E5FF]/10 text-cyan-400 font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white font-medium'
                    }`}
                  >
                    <span>{sortLabels[option]}</span>
                    {sortOption === option && <Check size={14} className="text-[#00E5FF]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View Switcher Toggle */}
        <div className="h-9 flex items-center bg-[#0B101B] p-1 rounded-xl border border-slate-800 gap-1 flex-shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-500 hover:text-white'
            }`}
            title="Vista Grilla"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-500 hover:text-white'
            }`}
            title="Vista Lista"
          >
            <List size={15} />
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={onToggleMobileFilters}
          className="lg:hidden w-9 h-9 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center flex-shrink-0"
          title="Filtros"
        >
          <Filter size={16} />
        </button>

        {/* Simplified Big "+" Add Game Button */}
        <button
          onClick={onOpenAddModal}
          className="w-9 h-9 rounded-xl bg-[#0070D1] hover:bg-[#0082EE] text-white border border-[#00E5FF]/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer flex-shrink-0"
          title="Añadir Juego"
        >
          <Plus size={18} className="stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};

