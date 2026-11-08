import { Router, Request, Response } from 'express';
import { config } from '../config/env.js';
import { getCurrentEngine } from '../db/database.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    servicio: 'API REST - Catálogo de Videojuegos',
    asignatura: config.subject,
    institucion: config.institution,
    docente: config.teacher,
    autores: config.authors,
    motorBaseDatos: getCurrentEngine(),
    version: '1.0.0',
    uptimeSegundos: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    endpoints: {
      documentacionSwagger: '/api/docs',
      videojuegos: '/api/videojuegos',
      estadisticas: '/api/videojuegos/stats',
      coleccionPostman: '/postman/Parcial3_Videojuegos_API.postman_collection.json'
    }
  });
});

export default router;
