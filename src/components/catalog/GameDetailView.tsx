import React from 'react';
import type { GameItem } from '../../types/catalog';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface GameDetailViewProps {
  game: GameItem;
  onBack: () => void;
  onEdit: (game: GameItem) => void;
  onDelete?: (id: string) => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  onBack,
  onEdit,
}) => {
  const estadoCaratulaText = game.faltaCaratula ? 'Faltante' : 'Impresa';
  const etiquetaDvdText = game.etiquetaDvd ? 'Impresa' : 'Pendiente';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 text-[#E0E6ED] font-sans animate-fadeIn">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-[#0B101B] hover:bg-[#141B2D] border border-slate-800 text-white font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-md w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
          <span>VOLVER AL CATÁLOGO</span>
        </button>

        <div className="text-xs font-mono tracking-wider text-slate-400">
          BIBLIOTECA DE JUEGOS / <span className="text-cyan-400">PS2</span> / <span className="text-cyan-400 font-bold">{game.titulo.toUpperCase()}</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: PS2 Cover Poster & Actions */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 w-full">
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,112,209,0.25)] border border-slate-800/80 bg-[#0B101B]">
            <div className="aspect-[3/4] w-full overflow-hidden relative">
              <img
                src={game.imagen || '/ps2-cover-placeholder.png'}
                alt={game.titulo}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/ps2-cover-placeholder.png';
                }}
              />
            </div>
          </div>

          {/* Action Buttons Section Under Cover */}
          <div className="w-full max-w-md flex flex-col gap-3">
            {/* Primary Action Button (Impeccable Polish Neon Glow) */}
            {game.linkIso ? (
              <a
                href={game.linkIso}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Descargar archivo ISO de ${game.titulo}`}
                className="w-full bg-[#0070D1] hover:bg-[#0082EE] text-white font-bold py-3.5 px-6 rounded-xl text-center text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,112,209,0.4)] hover:shadow-[0_0_35px_rgba(0,112,209,0.7)] border border-[#00E5FF]/30 block cursor-pointer"
              >
                DESCARGAR ISO
              </a>
            ) : (
              <button
                disabled
                aria-disabled="true"
                className="w-full bg-[#141B2D] border border-slate-800 text-slate-400 font-bold py-3.5 px-6 rounded-xl text-center text-sm tracking-wider uppercase cursor-not-allowed"
              >
                DESCARGAR ISO (NO DISPONIBLE)
              </button>
            )}

            {/* Secondary Buttons Row (Impeccable Polish Subtleties) */}
            <div className="grid grid-cols-2 gap-3">
              {game.linkCaratula ? (
                <a
                  href={game.linkCaratula}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Descargar imagen de carátula de ${game.titulo}`}
                  className="w-full bg-[#0B101B] hover:bg-[#141B2D] border border-slate-800 hover:border-[#00E5FF]/40 text-white font-bold py-3 px-4 rounded-xl text-center text-xs md:text-sm tracking-wider uppercase transition-all shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer block"
                >
                  DESCARGAR CARÁTULA
                </a>
              ) : (
                <button
                  disabled
                  aria-disabled="true"
                  className="w-full bg-[#0B101B]/50 border border-slate-800/50 text-slate-400 font-bold py-3 px-4 rounded-xl text-center text-xs md:text-sm tracking-wider uppercase cursor-not-allowed opacity-60"
                >
                  DESCARGAR CARÁTULA
                </button>
              )}

              <button
                onClick={() => onEdit(game)}
                aria-label={`Editar registro de ${game.titulo}`}
                className="w-full bg-[#0B101B] hover:bg-[#141B2D] border border-slate-800 hover:border-[#00E5FF]/40 text-white font-bold py-3 px-4 rounded-xl text-center text-xs md:text-sm tracking-wider uppercase transition-all shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer"
              >
                EDITAR REGISTRO
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Game Details and Synopsis */}
        <div className="lg:col-span-7 flex flex-col">
          
          {/* Game Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase mb-6 font-sans">
            {game.titulo}
          </h1>

          {/* Clean Vertical Specs List */}
          <div className="flex flex-col mb-6">
            
            {/* CÓDIGO ÚNICO / SERIAL */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">CÓDIGO ÚNICO / SERIAL</span>
              <span className="font-mono text-sm font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
                {game.codigoJuego || game.id}
              </span>
            </div>

            {/* GÉNERO */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">GÉNERO</span>
              <span className="font-bold text-[#00E5FF] text-sm md:text-base">{game.genero}</span>
            </div>

            {/* REGIÓN */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">REGIÓN</span>
              <span className="text-slate-200 text-sm font-mono">{game.region}</span>
            </div>

            {/* IDIOMA */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">IDIOMA</span>
              <span className="text-slate-200 text-sm">{game.idioma}</span>
            </div>

            {/* ESTADO DE FUNCIONAMIENTO */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">ESTADO DE FUNCIONAMIENTO</span>
              <span className={`font-bold text-sm ${
                game.estado === 'Funciona' ? 'text-[#00E676]' : game.estado === 'No Funciona' ? 'text-[#FF5252]' : 'text-[#FFD700]'
              }`}>
                {game.estado}
              </span>
            </div>

            {/* TIPO DE CAJA FÍSICA */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">TIPO DE CAJA FÍSICA</span>
              <span className="text-slate-200 text-sm">{game.tipoCaja}</span>
            </div>

            {/* ESTADO DE CARÁTULA IMPRESA */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">ESTADO DE CARÁTULA IMPRESA</span>
              <span className="text-slate-200 text-sm">{estadoCaratulaText}</span>
            </div>

            {/* ETIQUETA DVD */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">ETIQUETA DVD</span>
              <span className="text-slate-200 text-sm">{etiquetaDvdText}</span>
            </div>

            {/* CONTEO DE COPIAS (solo si tiene 2 o más copias) */}
            {game.copias && game.copias > 1 ? (
              <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
                <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">CONTEO DE COPIAS</span>
                <span className="text-slate-200 text-sm font-semibold text-[#00E5FF]">{game.copias} Copias</span>
              </div>
            ) : null}

            {/* LINK AL ISO */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">LINK AL ISO</span>
              {game.linkIso ? (
                <a
                  href={game.linkIso}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir enlace de descarga de ISO para ${game.titulo} en una pestaña nueva`}
                  className="text-[#00E5FF] hover:text-white hover:underline font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                >
                  <span>Descargar ISO</span>
                  <ExternalLink size={13} className="text-[#00E5FF]" />
                </a>
              ) : (
                <span className="text-slate-400 italic text-sm">No disponible</span>
              )}
            </div>

            {/* LINK A LA CARÁTULA */}
            <div className="flex items-center justify-between py-2.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs md:text-sm tracking-wider uppercase">LINK A LA CARÁTULA</span>
              {game.linkCaratula ? (
                <a
                  href={game.linkCaratula}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir enlace de carátula para ${game.titulo} en una pestaña nueva`}
                  className="text-[#00E5FF] hover:text-white hover:underline font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                >
                  <span>Ver Carátula</span>
                  <ExternalLink size={13} className="text-[#00E5FF]" />
                </a>
              ) : (
                <span className="text-slate-400 italic text-sm">No disponible</span>
              )}
            </div>

          </div>

          {/* Sinopsis Section */}
          <div>
            <h3 className="font-bold text-white text-base md:text-lg mb-2">Sinopsis</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {game.sinopsis || 'Sin sinopsis registrada en la base de datos de PS2 Vault.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
