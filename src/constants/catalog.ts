import type { GenreType, TipoCajaFisica, FuncionamientoState, RegionType } from '../types/catalog';

export const GENRES_OFICIALES: GenreType[] = [
  'Acción',
  "Beat 'em up",
  'Aventura',
  'Shooter',
  'Deportes',
  'Carreras',
  'Lucha',
  'Arcade',
  'Disney',
  'Películas',
  'Infantiles',
  'Terror',
  'Aviones',
  'Estrategia',
];

export const TIPOS_CAJA: TipoCajaFisica[] = ['Caja DVD', 'Caja CD', 'Sobre Papel'];

export const ESTADOS_FUNCIONAMIENTO: FuncionamientoState[] = ['Funciona', 'No Funciona', 'Sin Probar'];

export const REGIONES: RegionType[] = ['NTSC-U', 'PAL', 'NTSC-J'];

export const ESTADO_COLORS: Record<FuncionamientoState, { text: string; bg: string; border: string; hex: string }> = {
  Funciona: {
    text: 'text-[#00E676]',
    bg: 'bg-[#00E676]/10',
    border: 'border-[#00E676]/30',
    hex: '#00E676',
  },
  'No Funciona': {
    text: 'text-[#FF5252]',
    bg: 'bg-[#FF5252]/10',
    border: 'border-[#FF5252]/30',
    hex: '#FF5252',
  },
  'Sin Probar': {
    text: 'text-[#FFD700]',
    bg: 'bg-[#FFD700]/10',
    border: 'border-[#FFD700]/30',
    hex: '#FFD700',
  },
};

export const COLOR_FALTA_CARATULA = {
  text: 'text-[#FF9800]',
  bg: 'bg-[#FF9800]/10',
  border: 'border-[#FF9800]/30',
  hex: '#FF9800',
};
