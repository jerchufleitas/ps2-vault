import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export const PaginationFooter: React.FC = () => {
  const { currentPage, setCurrentPage, totalPages, itemsPerPage, filteredGames } = useCatalog();

  const totalEntries = filteredGames.length;
  if (totalEntries === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalEntries);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 select-none">
      <div className="font-mono text-slate-400">
        Mostrando <span className="font-bold text-white">{startItem}</span> a{' '}
        <span className="font-bold text-white">{endItem}</span> de{' '}
        <span className="font-bold text-[#00E5FF]">{totalEntries}</span> juegos
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-3 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-all flex items-center gap-1 cursor-pointer"
          title="Página Anterior"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline text-xs">Anterior</span>
        </button>

        {getPageNumbers().map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => handlePageChange(p)}
              className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                currentPage === p
                  ? 'bg-[#00E5FF] text-[#070A10] shadow-md shadow-[#00E5FF]/20 font-extrabold'
                  : 'bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-1 text-slate-600 font-bold">
              ...
            </span>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-3 rounded-xl bg-[#0B101B] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-all flex items-center gap-1 cursor-pointer"
          title="Página Siguiente"
        >
          <span className="hidden sm:inline text-xs">Siguiente</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
