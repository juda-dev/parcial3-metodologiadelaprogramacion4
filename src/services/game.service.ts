import { getDatabase } from '../db/database.js';
import {
  Game,
  CreateGameDTO,
  UpdateGameDTO,
  PatchGameDTO,
  GameFilters,
  GameStats
} from '../models/game.model.js';

export class GameService {
  public async getAllGames(filters: GameFilters = {}): Promise<Game[]> {
    const db = await getDatabase();
    return db.findAll(filters);
  }

  public async getGameById(id: number): Promise<Game | null> {
    const db = await getDatabase();
    return db.findById(id);
  }

  public async createGame(data: CreateGameDTO): Promise<Game> {
    const db = await getDatabase();
    return db.create(data);
  }

  public async updateGame(id: number, data: UpdateGameDTO): Promise<Game | null> {
    const db = await getDatabase();
    return db.update(id, data);
  }

  public async patchGame(id: number, data: PatchGameDTO): Promise<Game | null> {
    const db = await getDatabase();
    return db.patch(id, data);
  }

  public async deleteGame(id: number): Promise<boolean> {
    const db = await getDatabase();
    return db.delete(id);
  }

  public async getStats(): Promise<GameStats> {
    const db = await getDatabase();
    return db.getStats();
  }

  public async resetSeed(): Promise<void> {
    const db = await getDatabase();
    return db.resetSeed();
  }
}

export const gameService = new GameService();
