import { Request, Response, NextFunction } from 'express';
import { gameService } from '../services/game.service.js';

export class GameController {
  // GET /api/videojuegos
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as any;
      const games = await gameService.getAllGames(filters);

      res.status(200).json({
        success: true,
        meta: {
          total: games.length,
          filtrosAplicados: Object.keys(filters).length > 0 ? filters : null
        },
        data: games
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/videojuegos/stats
  public async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await gameService.getStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/videojuegos/:id
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const game = await gameService.getGameById(id);

      if (!game) {
        res.status(404).json({
          success: false,
          error: `No se encontró ningún videojuego con el ID ${id}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: game
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/videojuegos
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await gameService.createGame(req.body);
      res.status(201).json({
        success: true,
        mensaje: 'Videojuego registrado exitosamente en la base de datos',
        data: created
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/videojuegos/:id (Reemplazo total)
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updated = await gameService.updateGame(id, req.body);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: `No se puede actualizar: no existe ningún videojuego con el ID ${id}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        mensaje: `Videojuego con ID ${id} actualizado completamente (PUT)`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/videojuegos/:id (Actualización parcial)
  public async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updated = await gameService.patchGame(id, req.body);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: `No se puede modificar: no existe ningún videojuego con el ID ${id}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        mensaje: `Videojuego con ID ${id} modificado parcialmente (PATCH)`,
        camposModificados: Object.keys(req.body),
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/videojuegos/:id
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const gameToDelete = await gameService.getGameById(id);

      if (!gameToDelete) {
        res.status(404).json({
          success: false,
          error: `No se puede eliminar: no existe ningún videojuego con el ID ${id}`
        });
        return;
      }

      const deleted = await gameService.deleteGame(id);
      if (!deleted) {
        res.status(500).json({
          success: false,
          error: `Ocurrió un error al intentar eliminar el videojuego con ID ${id}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        mensaje: `Videojuego con ID ${id} (${gameToDelete.titulo}) eliminado correctamente`,
        dataEliminada: gameToDelete
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/videojuegos/reset-seed
  public async resetSeed(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await gameService.resetSeed();
      const games = await gameService.getAllGames();
      res.status(200).json({
        success: true,
        mensaje: 'La base de datos ha sido restaurada con los datos semilla iniciales',
        totalRegistros: games.length,
        data: games
      });
    } catch (error) {
      next(error);
    }
  }
}

export const gameController = new GameController();
