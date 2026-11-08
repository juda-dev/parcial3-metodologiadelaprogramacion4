import { Router } from 'express';
import { gameController } from '../controllers/game.controller.js';
import {
  validateBody,
  validateParams,
  validateQuery
} from '../middlewares/validate.middleware.js';
import {
  createGameSchema,
  updateGameSchema,
  patchGameSchema,
  gameIdParamSchema,
  gameQuerySchema
} from '../schemas/game.schema.js';

const router = Router();

// GET /api/videojuegos/stats - Obtener estadísticas generales
router.get('/stats', gameController.getStats);

// POST /api/videojuegos/reset-seed - Restaurar datos de prueba
router.post('/reset-seed', gameController.resetSeed);

// GET /api/videojuegos - Listar todos los videojuegos con filtros opcionales
router.get('/', validateQuery(gameQuerySchema as any), gameController.getAll);

// GET /api/videojuegos/:id - Obtener un videojuego por ID
router.get('/:id', validateParams(gameIdParamSchema as any), gameController.getById);

// POST /api/videojuegos - Crear un nuevo videojuego
router.post('/', validateBody(createGameSchema as any), gameController.create);

// PUT /api/videojuegos/:id - Actualización completa
router.put(
  '/:id',
  validateParams(gameIdParamSchema as any),
  validateBody(updateGameSchema as any),
  gameController.update
);

// PATCH /api/videojuegos/:id - Actualización parcial
router.patch(
  '/:id',
  validateParams(gameIdParamSchema as any),
  validateBody(patchGameSchema as any),
  gameController.patch
);

// DELETE /api/videojuegos/:id - Eliminar videojuego
router.delete('/:id', validateParams(gameIdParamSchema as any), gameController.delete);

export default router;
