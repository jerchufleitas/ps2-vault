import React from 'react';
import { GENRES_OFICIALES } from '../../constants/catalog';
import type { GenreType } from '../../types/catalog';

interface GenreChipsMobileProps {
  selectedGenre: GenreType | 'Todos';
  onSelectGenre: (genre: GenreType | 'Todos') => void;
}

export const GenreChipsMobile: React.FC<GenreChipsMobileProps> = ({
  selectedGenre,
  onSelectGenre,
}) => {
  return (
    <div className="lg:hidden w-full overflow-x-auto py-2.5 px-4 flex items-center gap-2 no-scrollbar border-b border-white/5 bg-[#070A10]/80">
      <button
        onClick={() => onSelectGenre('Todos')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
          selectedGenre === 'Todos'
            ? 'bg-[#0070D1] text-white shadow-md'
            : 'bg-white/5 text-[#8A99AD] hover:bg-white/10 hover:text-white border border-white/10'
        }`}
      >
        Todos
      </button>

      {GENRES_OFICIALES.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelectGenre(genre)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedGenre === genre
              ? 'bg-[#0070D1] text-white shadow-md font-semibold'
              : 'bg-white/5 text-[#8A99AD] hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};
