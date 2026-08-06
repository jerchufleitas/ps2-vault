import React from 'react';
import { Search, LayoutGrid, List, Plus, Filter, Settings } from 'lucide-react';
import type { ViewMode } from '../../types/catalog';
import { Button } from '../ui/Button';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onToggleMobileFilters?: () => void;
  totalGames: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onToggleMobileFilters,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#070A10]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Brand Identity: PS2 Vault Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo2ps2.png"
          alt="PS2 Vault Logo"
          className="h-16 md:h-20 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
        />
        <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white flex items-center">
          <span className="text-[#00E5FF]">PS2</span>
          <span className="ml-1.5 text-xs uppercase tracking-widest text-slate-400 font-semibold hidden sm:inline-block">Vault</span>
        </h1>
      </div>

      {/* Controls & Search */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Search Input */}
        <div className="relative flex items-center w-48 sm:w-64 md:w-80">
          <Search className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar juegos..."
            className="w-full bg-[#0B101B] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0070D1] focus:ring-1 focus:ring-[#0070D1] transition-all"
          />
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={onToggleMobileFilters}
          className="lg:hidden p-2 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Filtros"
        >
          <Filter size={16} />
        </button>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-[#0B101B] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
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
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-500 hover:text-white'
            }`}
            title="Vista Lista"
          >
            <List size={16} />
          </button>
        </div>

        {/* Settings Gear Icon */}
        <button className="p-2 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <Settings size={16} />
        </button>

        {/* Add Game Button */}
        <Button variant="primary" size="sm" onClick={onOpenAddModal} className="hidden sm:inline-flex">
          <Plus size={16} />
          <span>Añadir Juego</span>
        </Button>
      </div>
    </header>
  );
};
