import React, { useState, useRef } from "react";
import type { GameItem } from "../../types/catalog";
import {
  X,
  Download,
  Image as ImageIcon,
  Edit3,
  Trash2,
} from "lucide-react";

import { useDailymotionGameplay } from "../../utils/gameplayVideo";

interface GameDetailViewProps {
  game: GameItem;
  onBack: () => void;
  onEdit: (game: GameItem) => void;
  onDelete?: (id: string) => void;
}

/**
 * Sanitizes game titles for external search engines (CoverCaratulas & GamesGX).
 * Keeps the full title (including subtitles like "Vanguard"), while stripping out
 * colons, hyphens, and special punctuation that break site search queries.
 */
const getCleanSearchTitle = (fullTitle: string): string => {
  if (!fullTitle) return "";
  // Replace all non-alphanumeric characters (colons, hyphens, quotes, slashes, etc.) with spaces
  const cleanTitle = fullTitle
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleanTitle || fullTitle.trim();
};

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  onBack,
  onEdit,
  onDelete,
}) => {
  // ESC key handler to close detail projection view
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  const estadoCaratulaText = game.faltaCaratula ? "Faltante" : "Impresa";
  const etiquetaDvdText = game.etiquetaDvd ? "Impresa" : "Pendiente";

  const coverUrl =
    game.linkCaratula ||
    `https://www.covercaratulas.com/seccion.php?name=caratula&op=Buscar&busca=${encodeURIComponent(
      getCleanSearchTitle(game.titulo),
    )}&tipo=ps2`;

  const isoUrl =
    game.linkIso ||
    `https://www.gamesgx.net/?s=${encodeURIComponent(getCleanSearchTitle(game.titulo))}`;

  const truncatedSinopsis = React.useMemo(() => {
    if (!game.sinopsis)
      return "Sin sinopsis registrada en la base de datos de PS2 Vault.";
    const maxChars = 320;
    if (game.sinopsis.length <= maxChars) return game.sinopsis;
    return game.sinopsis.slice(0, maxChars).trim() + "...";
  }, [game.sinopsis]);

  const [isVideoActive, setIsVideoActive] = React.useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const hoverTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const { embedUrl } = useDailymotionGameplay(game.titulo);

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsVideoLoaded(false);
      setIsVideoActive(true);
    }, 250);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsVideoActive(false);
    setIsVideoLoaded(false);
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-6 px-5 md:pt-6 md:pb-8 md:px-10 rounded-3xl bg-[#0B101B]/90 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-[#E0E6ED] font-sans animate-fadeIn my-2 md:my-4 relative border-none">
      {/* Minimalist Top-Right Close Button X */}
      <button
        onClick={onBack}
        aria-label="Cerrar vista de detalle"
        className="absolute top-3 right-3 md:top-4 md:right-5 p-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer z-20"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-2">
        {/* Left Column: PS2 Cover Poster & Actions */}
        <div className="lg:col-span-5 flex flex-col items-center gap-5 w-full">
          {/* Pure Static Clean 2D Cover Image with Subtle Halo + Dailymotion Video Swap */}
          <div
            className="relative w-full max-w-[320px] aspect-[3/4] flex justify-center items-center group my-1 cursor-pointer rounded-xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-slate-800/60"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Cyan/Blue Halo */}
            <div className="absolute -inset-1 bg-[#0070D1]/30 rounded-xl blur-md opacity-80 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-0" />

            {/* Base Cover Image (Masks Dailymotion loading spinner until video is ready) */}
            <img
              src={game.imagen || "/ps2-cover-placeholder.png"}
              alt={game.titulo}
              className={`w-full h-full object-cover rounded-xl relative z-10 transition-opacity duration-500 ${
                isVideoActive && isVideoLoaded ? "opacity-0" : "opacity-100"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/ps2-cover-placeholder.png";
              }}
            />

            {/* Scaled/Zoomed 16:9 Video iFrame (Converts horizontal video to fill 3:4 vertical cover format) */}
            {isVideoActive && embedUrl && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden rounded-xl z-20 pointer-events-none bg-black">
                <iframe
                  src={embedUrl}
                  title={`Gameplay de ${game.titulo}`}
                  style={{
                    width: "177.77%",
                    height: "133.33%",
                    transform: "scale(2.4)",
                    transformOrigin: "center center",
                  }}
                  className={`max-w-none max-h-none rounded-xl border-none transition-opacity duration-700 ${
                    isVideoLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  allow="autoplay; encrypted-media"
                  onLoad={() => {
                    // 1800ms delay ensures Dailymotion's internal player finishes buffering before showing video
                    setTimeout(() => setIsVideoLoaded(true), 1800);
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Icons Section Under Cover - Pure Floating Icons, Centered Under Cover */}
          <div className="w-full flex items-center justify-center gap-5 px-1 mt-1">
            {/* Primary ISO Download Icon */}
            <a
              href={isoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Descargar ISO"
              aria-label={`Descargar archivo ISO de ${game.titulo}`}
              className="text-slate-400 hover:text-cyan-400 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
            </a>

            {/* Cover Art Download Icon */}
            <a
              href={coverUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Buscar o descargar carátula"
              aria-label={`Buscar o descargar carátula de ${game.titulo}`}
              className="text-slate-400 hover:text-cyan-400 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
            >
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            </a>

            {/* Edit Game Record Icon */}
            <button
              onClick={() => onEdit(game)}
              title="Editar registro"
              aria-label={`Editar registro de ${game.titulo}`}
              className="text-slate-400 hover:text-cyan-400 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
            >
              <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Delete Game Record Icon */}
            {onDelete ? (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Estás seguro de eliminar "${game.titulo}" del catálogo?`,
                    )
                  ) {
                    onDelete(game.id);
                  }
                }}
                title="Eliminar registro"
                aria-label={`Eliminar registro de ${game.titulo}`}
                className="text-slate-400 hover:text-red-400 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Right Column: Game Details and Synopsis */}
        <div className="lg:col-span-7 flex flex-col pt-1">
          {/* Game Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight uppercase mb-3 pr-10 font-sans">
            {game.titulo}
          </h1>

          {/* Clean Vertical Specs List - Compacted Vertical Spacing */}
          <div className="flex flex-col mb-4">
            {/* CÓDIGO ÚNICO / SERIAL */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                CÓDIGO ÚNICO / SERIAL
              </span>
              <span className="font-mono text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
                {game.codigoJuego || game.id}
              </span>
            </div>

            {/* GÉNERO */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                GÉNERO
              </span>
              <span className="font-bold text-[#00E5FF] text-xs md:text-sm">
                {game.genero}
              </span>
            </div>

            {/* REGIÓN */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                REGIÓN
              </span>
              <span className="text-slate-200 text-xs md:text-sm font-mono">
                {game.region}
              </span>
            </div>

            {/* IDIOMA */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                IDIOMA
              </span>
              <span className="text-slate-200 text-xs md:text-sm">{game.idioma}</span>
            </div>

            {/* ESTADO DE FUNCIONAMIENTO */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                ESTADO DE FUNCIONAMIENTO
              </span>
              <span
                className={`font-bold text-xs md:text-sm ${
                  game.estado === "Funciona"
                    ? "text-[#00E676]"
                    : game.estado === "No Funciona"
                      ? "text-[#FF5252]"
                      : "text-[#FFD700]"
                }`}
              >
                {game.estado}
              </span>
            </div>

            {/* TIPO DE CAJA FÍSICA */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                TIPO DE CAJA FÍSICA
              </span>
              <span className="text-slate-200 text-xs md:text-sm">{game.tipoCaja}</span>
            </div>

            {/* ESTADO DE CARÁTULA IMPRESA */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                ESTADO DE CARÁTULA IMPRESA
              </span>
              <span className="text-slate-200 text-xs md:text-sm">
                {estadoCaratulaText}
              </span>
            </div>

            {/* ETIQUETA DVD */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
              <span className="font-bold text-white text-xs tracking-wider uppercase">
                ETIQUETA DVD
              </span>
              <span className="text-slate-200 text-xs md:text-sm">{etiquetaDvdText}</span>
            </div>

            {/* CONTEO DE COPIAS (solo si tiene 2 o más copias) */}
            {game.copias && game.copias > 1 ? (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
                <span className="font-bold text-white text-xs tracking-wider uppercase">
                  CONTEO DE COPIAS
                </span>
                <span className="text-slate-200 text-xs md:text-sm font-semibold text-[#00E5FF]">
                  {game.copias} Copias
                </span>
              </div>
            ) : null}
          </div>

          {/* Sinopsis Section */}
          <div>
            <h3 className="font-bold text-white text-xs md:text-sm uppercase tracking-wider mb-1">
              Sinopsis
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {truncatedSinopsis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
