import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { GameItem, GenreType, FuncionamientoState, ViewMode, CatalogMetrics } from '../types/catalog';
import { INITIAL_GAMES } from '../data/mockGames';

interface CatalogContextType {
  games: GameItem[];
  filteredGames: GameItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGenre: GenreType | 'Todos';
  setSelectedGenre: (g: GenreType | 'Todos') => void;
  selectedState: FuncionamientoState | 'Todos';
  setSelectedState: (s: FuncionamientoState | 'Todos') => void;
  faltaCaratulaOnly: boolean;
  setFaltaCaratulaOnly: (v: boolean | ((prev: boolean) => boolean)) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  gridColumns: number;
  setGridColumns: (cols: number) => void;
  selectedGameForDetail: GameItem | null;
  setSelectedGameForDetail: (g: GameItem | null) => void;
  gameToEdit: GameItem | null;
  setGameToEdit: (g: GameItem | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  metrics: CatalogMetrics;
  addGame: (game: Omit<GameItem, 'id'>) => void;
  updateGame: (id: string, updated: Partial<GameItem>) => void;
  deleteGame: (id: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<GameItem[]>(() => {
    const saved = localStorage.getItem('ps2_vault_games');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreType | 'Todos'>('Todos');
  const [selectedState, setSelectedState] = useState<FuncionamientoState | 'Todos'>('Todos');
  const [faltaCaratulaOnly, setFaltaCaratulaOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [gridColumns, setGridColumns] = useState<number>(5);

  const [selectedGameForDetail, setSelectedGameForDetail] = useState<GameItem | null>(null);
  const [gameToEdit, setGameToEdit] = useState<GameItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ps2_vault_games', JSON.stringify(games));
  }, [games]);

  const metrics: CatalogMetrics = useMemo(() => {
    return {
      total: games.length,
      funciona: games.filter((g) => g.estado === 'Funciona').length,
      noFunciona: games.filter((g) => g.estado === 'No Funciona').length,
      sinProbar: games.filter((g) => g.estado === 'Sin Probar').length,
      faltaCaratula: games.filter((g) => g.faltaCaratula).length,
    };
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        game.titulo.toLowerCase().includes(query) ||
        game.id.toLowerCase().includes(query);

      const matchGenre = selectedGenre === 'Todos' || game.genero === selectedGenre;
      const matchState = selectedState === 'Todos' || game.estado === selectedState;
      const matchCaratula = !faltaCaratulaOnly || game.faltaCaratula;

      return matchQuery && matchGenre && matchState && matchCaratula;
    });
  }, [games, searchQuery, selectedGenre, selectedState, faltaCaratulaOnly]);

  const addGame = (gameData: Omit<GameItem, 'id'>) => {
    const id = `SLUS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGame: GameItem = { ...gameData, id };
    setGames((prev) => [newGame, ...prev]);
  };

  const updateGame = (id: string, updated: Partial<GameItem>) => {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    if (selectedGameForDetail && selectedGameForDetail.id === id) {
      setSelectedGameForDetail((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    if (selectedGameForDetail?.id === id) setSelectedGameForDetail(null);
    if (gameToEdit?.id === id) setGameToEdit(null);
  };

  return (
    <CatalogContext.Provider
      value={{
        games,
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
        gridColumns,
        setGridColumns,
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
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within a CatalogProvider');
  return context;
};
