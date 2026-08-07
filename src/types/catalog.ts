export type GenreType =
  | 'Acción'
  | "Beat 'em up"
  | 'Aventura'
  | 'Shooter'
  | 'Deportes'
  | 'Carreras'
  | 'Lucha'
  | 'Arcade'
  | 'Disney'
  | 'Películas'
  | 'Infantiles'
  | 'Terror'
  | 'Aviones'
  | 'Estrategia';

export type TipoCajaFisica = 'Caja DVD' | 'Caja CD' | 'Sobre Papel';

export type FuncionamientoState = 'Funciona' | 'No Funciona' | 'Sin Probar';

export type RegionType = 'NTSC-U' | 'PAL' | 'NTSC-J';

export interface GameItem {
  id: string;
  codigoJuego?: string; // Código Único de Serie (ej. SLUS-21115, SLES-53860)
  titulo: string;
  genero: GenreType;
  tipoCaja: TipoCajaFisica;
  estado: FuncionamientoState;
  faltaCaratula: boolean;
  imagen: string;
  region: RegionType;
  idioma: string;
  tamanioMb: number;
  sinopsis?: string;
  etiquetaDvd?: boolean;
  copias?: number;
  linkIso?: string;
  linkCaratula?: string;
  youtubeGameplayUrl?: string;
}

export type ViewMode = 'grid' | 'list';

export type SortOption = 'recientes' | 'alfabetico_az' | 'alfabetico_za';

export interface CatalogMetrics {
  total: number;
  funciona: number;
  noFunciona: number;
  sinProbar: number;
  faltaCaratula: number;
}

export const CATALOG_TYPES_VERSION = '1.0.0';
