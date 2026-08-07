import React, { useState } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { TopNav } from './components/layout/TopNav';
import { SidebarDesktop } from './components/layout/SidebarDesktop';
import { GenreChipsMobile } from './components/layout/GenreChipsMobile';
import { GameGridContainer } from './components/catalog/GameGridContainer';
import { GameListView } from './components/catalog/GameListView';
import { GameDetailView } from './components/catalog/GameDetailView';
import { EditGameModal } from './components/modals/EditGameModal';
import { AddGameModal } from './components/modals/AddGameModal';
import type { GameItem } from './types/catalog';
import { X, Filter } from 'lucide-react';
import Aurora from './components/ui/Aurora';

const CatalogMain: React.FC = () => {
  const {
    filteredGames,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedState,
    setSelectedState,
    faltaCaratulaOnly,
    setFaltaCaratulaOnly,
    viewMode,
    setViewMode,
    selectedGameForDetail,
    setSelectedGameForDetail,
    gameToEdit,
    setGameToEdit,
    isAddModalOpen,
    setIsAddModalOpen,
    metrics,
    addGame,
    updateGame,
    deleteGame,
  } = useCatalog();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleEditClick = (game: GameItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setGameToEdit(game);
  };

  const handleLogoClick = () => {
    setSelectedGameForDetail(null);
    setViewMode('grid');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Aurora Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-100">
        <Aurora
          colorStops={["#2e22e4", "#3836b3", "#06063e"]}
          blend={0.85}
          amplitude={1.0}
          speed={0.6}
        />
      </div>

      {/* Top Navbar */}
      <div className="relative z-50">
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onToggleMobileFilters={() => setIsMobileFiltersOpen((prev) => !prev)}
          onLogoClick={handleLogoClick}
          totalGames={metrics.total}
        />
      </div>

      {/* Mobile Horizontal Genre Bar */}
      <GenreChipsMobile
        selectedGenre={selectedGenre}
        onSelectGenre={(g) => {
          setSelectedGenre(g);
          if (selectedGameForDetail) setSelectedGameForDetail(null);
        }}
      />

      {/* Main Container Layout */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SidebarDesktop
            selectedGenre={selectedGenre}
            onSelectGenre={(g) => {
              setSelectedGenre(g);
              if (selectedGameForDetail) setSelectedGameForDetail(null);
            }}
            selectedState={selectedState}
            onSelectState={(s) => {
              setSelectedState(s);
              if (selectedGameForDetail) setSelectedGameForDetail(null);
            }}
            faltaCaratulaOnly={faltaCaratulaOnly}
            onToggleFaltaCaratula={() => setFaltaCaratulaOnly((prev) => !prev)}
            metrics={metrics}
          />
        </div>

        {/* Mobile Slide-over Filters Drawer */}
        {isMobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-4/5 max-w-xs bg-[#0F1420] h-full p-5 overflow-y-auto flex flex-col border-l border-white/10">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Filter size={16} className="text-[#00E5FF]" /> Filtros del Catálogo
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-[#8A99AD] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <SidebarDesktop
                selectedGenre={selectedGenre}
                onSelectGenre={(g) => {
                  setSelectedGenre(g);
                  if (selectedGameForDetail) setSelectedGameForDetail(null);
                  setIsMobileFiltersOpen(false);
                }}
                selectedState={selectedState}
                onSelectState={(s) => {
                  setSelectedState(s);
                  if (selectedGameForDetail) setSelectedGameForDetail(null);
                  setIsMobileFiltersOpen(false);
                }}
                faltaCaratulaOnly={faltaCaratulaOnly}
                onToggleFaltaCaratula={() => setFaltaCaratulaOnly((prev) => !prev)}
                metrics={metrics}
              />
            </div>
          </div>
        )}

        {/* Main Catalog View Area */}
        <main className="flex-1 min-w-0 pb-12">
          {viewMode === 'grid' ? (
            <GameGridContainer
              games={filteredGames}
              onSelectGame={setSelectedGameForDetail}
              onEditGame={handleEditClick}
            />
          ) : (
            <GameListView
              games={filteredGames}
              onSelectGame={setSelectedGameForDetail}
              onEditGame={handleEditClick}
            />
          )}
        </main>
      </div>

      {/* Glassmorphic Overlay Projection for Game Detail View */}
      {selectedGameForDetail && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md overflow-y-auto p-4 md:p-8 flex justify-center items-start animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedGameForDetail(null);
            }
          }}
        >
          <GameDetailView
            game={selectedGameForDetail}
            onBack={() => setSelectedGameForDetail(null)}
            onEdit={(game) => setGameToEdit(game)}
            onDelete={(id) => {
              deleteGame(id);
              setSelectedGameForDetail(null);
            }}
          />
        </div>
      )}

      {/* Admin CRUD Modals */}
      <EditGameModal
        game={gameToEdit}
        isOpen={!!gameToEdit}
        onClose={() => setGameToEdit(null)}
        onSave={updateGame}
        onDelete={deleteGame}
      />

      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addGame}
      />
    </div>
  );
};

export default function App() {
  return (
    <CatalogProvider>
      <CatalogMain />
    </CatalogProvider>
  );
}
