import {
  Game,
  CreateGameDTO,
  UpdateGameDTO,
  PatchGameDTO,
  GameFilters,
  GameStats
} from '../models/game.model.js';

export interface IDatabaseAdapter {
  init(): Promise<void>;
  findAll(filters?: GameFilters): Promise<Game[]>;
  findById(id: number): Promise<Game | null>;
  create(data: CreateGameDTO): Promise<Game>;
  update(id: number, data: UpdateGameDTO): Promise<Game | null>;
  patch(id: number, data: PatchGameDTO): Promise<Game | null>;
  delete(id: number): Promise<boolean>;
  getStats(): Promise<GameStats>;
  resetSeed(): Promise<void>;
  close(): Promise<void>;
}
