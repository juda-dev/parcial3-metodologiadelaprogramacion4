export interface Game {
  id: number;
  titulo: string;
  desarrollador: string;
  genero: string;
  plataforma: string;
  anioLanzamiento: number;
  calificacion: number;
  precio: number;
  descripcion: string;
  imagenUrl: string;
  enStock: boolean | number;
  creadoEn?: string;
}

export type CreateGameDTO = Omit<Game, 'id' | 'creadoEn'>;
export type UpdateGameDTO = Omit<Game, 'id' | 'creadoEn'>;
export type PatchGameDTO = Partial<UpdateGameDTO>;

export interface GameFilters {
  genero?: string;
  plataforma?: string;
  search?: string;
  minCalificacion?: number;
  maxPrecio?: number;
  sortBy?: 'id' | 'titulo' | 'calificacion' | 'precio' | 'anioLanzamiento' | 'creadoEn';
  order?: 'asc' | 'desc';
}

export interface GameStats {
  total: number;
  promedioCalificacion: number;
  precioPromedio: number;
  precioMinimo: number;
  precioMaximo: number;
  generosDisponibles: number;
  totalEnStock: number;
  conteoPorGenero: { genero: string; cantidad: number }[];
  juegoMejorCalificado?: Game;
}
