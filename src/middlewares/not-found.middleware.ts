import { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: [${req.method}] ${req.originalUrl}`,
    sugerencia: 'Visita /api/docs para consultar la documentación interactiva OpenAPI/Swagger'
  });
}
